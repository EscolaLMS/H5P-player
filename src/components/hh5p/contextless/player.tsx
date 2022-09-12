import {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unescape } from "html-escaper";
import throttle from "lodash.throttle";

import type { XAPIEvent, H5PObject } from "@escolalms/h5p-react";

const srcIsAbsolute = (src: string) => src.includes("://");

/*
const requiredScripts = [
  "js/jquery.js",
  "js/h5p.js",
  "js/h5p-event-dispatcher.js",
  "js/h5p-x-api-event.js",
  "js/h5p-x-api.js",
  "js/h5p-content-type.js",
  "js/h5p-confirmation-dialog.js",
  "js/h5p-action-bar.js",
  "js/request-queue.js",
];
*/

export const Player: FunctionComponent<{
  onXAPI?: (event: XAPIEvent) => void;
  styles?: string[];
  state: H5PObject;
  loading?: boolean;
  lang?: string;
}> = ({ onXAPI, state, styles = [], lang = "pl" }) => {
  const [height, setHeight] = useState<number>(100);
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  const contentId = useMemo(() => {
    if (state?.contents) {
      const n = Number(Object.keys(state?.contents)[0].split("-")[1]);
      return isNaN(n) ? 0 : n;
    }
    return 0;
  }, [state]);

  const changeHeight = useCallback(
    throttle(
      (iFrameHeight: number) => {
        setHeight(iFrameHeight);
      },
      200,
      { leading: false }
    ),
    []
  );

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data.iFrameHeight) {
      changeHeight(event.data.iFrameHeight);
    }

    if (event.data.statement) {
      onXAPI && onXAPI(event.data as XAPIEvent);
    }
  }, []);

  useEffect(() => {
    window && window.addEventListener("message", onMessage);
    return () => {
      window && window.removeEventListener("message", onMessage);
    };
  }, [iFrameRef, state, onXAPI]);

  const src = useMemo(() => {
    const settings = state;
    if (!settings) return "";

    settings.core.styles = settings.core.styles.concat(styles);

    /*
    if (
      !settings.core.scripts.some((src) => src.includes(requiredScripts[0]))
    ) {
    }
    */

    const content = state?.contents
      ? state?.contents[Object.keys(state?.contents)[0]]
      : null;

    if (content) {
    }

    const embedType =
      settings.loadedJs && settings.loadedJs.length > 0 ? "div" : "iframe";

    settings.core.scripts = settings.core.scripts.map((src) => {
      if (srcIsAbsolute(src)) {
        return src;
      }
      if (srcIsAbsolute(settings.baseUrl)) {
        return `${settings.baseUrl}/${src};`;
      }
      return src;
    });

    const srcPrefix = srcIsAbsolute(settings.baseUrl)
      ? settings.baseUrl + "/"
      : "";

    const markup = renderToStaticMarkup(
      <html>
        <head>
          <style>{`
            body, html {margin:0; padding:0;}
            iframe { border:none; margin:0; padding:0; }
            `}</style>
          <script>
            {`const H5PIntegration = window.H5PIntegration = JSON.parse(atob('${btoa(
              JSON.stringify(settings, null, 2)
            )}'))
            `}
          </script>
          {[
            ...(settings.core.scripts ? settings.core.scripts : []),
            ...(settings.loadedJs ? settings.loadedJs : []),
            ...(content?.scripts ? content?.scripts : []),
          ].map((script) => (
            <script
              key={script}
              src={srcIsAbsolute(script) ? script : srcPrefix + script}
            ></script>
          ))}
          {[
            ...(settings.core.styles ? settings.core.styles : []),
            ...(settings.loadedCss ? settings.loadedCss : []),
            ...(content?.styles ? content?.styles : []),
          ].map((style) => (
            <link
              type="text/css"
              rel="stylesheet"
              key={style}
              href={srcIsAbsolute(style) ? style : srcPrefix + style}
            ></link>
          ))}
          <script>
            {`H5P.getCrossOrigin = function (source) { return "anonymous" }`}
          </script>
        </head>
        <body>
          <div className="h5p-player-wrapper h5p-resize-observer">
            {embedType && embedType === "div" && (
              <div className="h5p-content" data-content-id={contentId}></div>
            )}
            {embedType && embedType === "iframe" && (
              <div className="h5p-iframe-wrapper">
                <iframe
                  id={`h5p-iframe-${contentId}`}
                  className="h5p-iframe"
                  data-content-id={contentId}
                  src="about:blank"
                  frameBorder="0"
                  scrolling="no"
                  title="player"
                ></iframe>
              </div>
            )}

            <script>
              {`
              (function ($) {
                  const replacerFunc = () => {
                      const visited = new WeakSet();
                      return (key, value) => {
                        if (value.nodeType) return;
                        if (typeof value === "object" && value !== null) {
                          if (visited.has(value)) {
                            return;
                          }
                          visited.add(value);
                        }
                        return value;
                      };
                    };
                  const postMessage = (data) => parent.postMessage(data, "${window.location.origin}");
                  const resizeObserver = new ResizeObserver((entries) =>
                      postMessage({ iFrameHeight: entries[0].contentRect.height })
                  );
                  resizeObserver.observe(document.querySelector(".h5p-resize-observer"));
                  H5P.externalDispatcher.on('xAPI', function (event) {
                      try {
                        postMessage(event.data, replacerFunc())
                      } catch(err) {
                        console.error(event, err)
                      }
                  });
              })(H5P.jQuery);
              `}
            </script>
          </div>
        </body>
      </html>
    );

    return window.URL.createObjectURL(
      new Blob([unescape(markup).split("&#x27;").join("'")], {
        type: "text/html",
      })
    );
  }, [state]);

  return (
    <div
      className="h5p-player"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
      }}
    >
      <iframe
        ref={iFrameRef}
        title="player"
        src={src}
        // TODO test this
        // srcDoc={src}
        style={{
          display: "block",
          border: "none",
          flexGrow: 1,
          flexShrink: 1,
          height: height,
        }}
      />
    </div>
  );
};

export default Player;
