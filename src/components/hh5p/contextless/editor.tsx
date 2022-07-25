import React, {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useRef,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unescape } from "html-escaper";
import Loader from "./../loader";

import type {
  H5PEditorStatus,
  H5PEditorContent,
  EditorSettings,
} from "@escolalms/h5p-react";

const prepareMarkupForPassing = (markup: string) => {
  return unescape(markup);
};

type EditorState =
  | {
      state: "initial";
    }
  | {
      state: "loading";
    }
  | {
      state: "loaded";
    }
  | {
      state: "submitting";
    }
  | {
      state: "error";
      error: string;
    };

export const Editor: FunctionComponent<{
  id?: number | string;
  state: EditorSettings;
  allowSameOrigin?: boolean;
  onSubmit?: (data: H5PEditorContent, id?: string | number) => void;
  onError?: (error: unknown) => void;
  loading?: boolean;
}> = ({
  id,
  onSubmit,
  state,
  allowSameOrigin = false,
  onError,
  loading = false,
}) => {
  const [height, setHeight] = useState<number>(100);
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!(event.origin === window.location.origin) && !allowSameOrigin) {
        return;
      }
      if (event.data.iFrameHeight) {
        setHeight(event.data.iFrameHeight);
      }
      if (event.data.h5pEditorStatus) {
        const status: H5PEditorStatus = event.data;
        if (status.h5pEditorStatus === "success") {
          onSubmit &&
            onSubmit(
              {
                ...status.data,
                nonce: state.nonce,
              },
              id
            );
        }

        status.h5pEditorStatus === "error" && onError && onError(status.error);
      }
    };

    window && window.addEventListener("message", onMessage);
    return () => {
      window && window.removeEventListener("message", onMessage);
    };
  }, [iFrameRef, state, onSubmit, id]);

  const src = useMemo(() => {
    const settings = state;
    if (!settings) return "";

    const content = state.contents
      ? state?.contents[Object.keys(state.contents)[0]]
      : null;
    const params = content ? content.jsonContent : "";

    try {
      params && JSON.parse(params);
    } catch (er: any) {
      onError && onError(er && er.toString());
      return null;
    }

    const library = content ? content.library : "";

    const scriptInline = `
      (function ($) {
          const postMessage = (data) => parent.postMessage(data, "${
            window.location.origin
          }");
          const resizeObserver = new ResizeObserver((entries) =>
              postMessage({ iFrameHeight: entries[0].contentRect.height })
          );
          const params = ${"`"}${params}${"`"}.split("\\n").join('');
              
          ns.init = function () {
              ns.$ = H5P.jQuery;
              ns.basePath = H5PIntegration.editor.libraryUrl;
              ns.fileIcon = H5PIntegration.editor.fileIcon;
              ns.ajaxPath = H5PIntegration.editor.ajaxPath;
              ns.filesPath = H5PIntegration.editor.filesPath;
              ns.apiVersion = H5PIntegration.editor.apiVersion;
              ns.copyrightSemantics = H5PIntegration.editor.copyrightSemantics;
              ns.assets = H5PIntegration.editor.assets;
              ns.baseUrl = H5PIntegration.baseUrl;
              ns.metadataSemantics = H5PIntegration.editor.metadataSemantics;
              if (H5PIntegration.editor.nodeVersionId !== undefined) {
                  ns.contentId = H5PIntegration.editor.nodeVersionId;
              }
              const h5peditor = new ns.Editor('${library}', params, document.getElementById("h5p-editor"));
              H5P.externalDispatcher.on("xAPI", (event) => postMessage(event));
              H5P.externalDispatcher.on("resize", (event) => postMessage(event));
              resizeObserver.observe(document.querySelector(".h5p-editor-wrapper"));
              $("#h5p-editor-submit").click(() => {
                  h5peditor.getContent(data => postMessage({h5pEditorStatus:"success", data}), error =>  postMessage({h5pEditorStatus:"error", error}))
              } );
          };
          ns.getAjaxUrl = function (action, parameters) {
              var url = H5PIntegration.editor.ajaxPath + action;
              url += action === "files" ? "/${settings.nonce}" : "";
              if (parameters !== undefined) {
                  var separator = url.indexOf("?") === -1 ? "?" : "&";
                  for (var property in parameters) {
                      if (parameters.hasOwnProperty(property)) {
                          url += separator + property + "=" + parameters[property];
                          separator = "&";
                      }
                  }
              }
              return url;
          };
          $(document).ready(ns.init);
      })(H5P.jQuery);
      `;

    const markup = renderToStaticMarkup(
      <html>
        <head>
          <style>{` body, html {margin:0; padding:0;}`}</style>
          <script
            dangerouslySetInnerHTML={{
              __html: `const H5PIntegration = window.H5PIntegration = ${JSON.stringify(
                settings
              )}; `,
            }}
          />
          {settings.core.scripts.map((script) => (
            <script key={script} src={script}></script>
          ))}
          {settings.core.styles.map((style) => (
            <link
              type="text/css"
              rel="stylesheet"
              key={style}
              href={style}
            ></link>
          ))}
        </head>
        <body>
          <div className="h5p-editor-wrapper">
            <div id="h5p-editor" className="height-observer">
              loading
            </div>
            <p></p>
            <button className="h5p-core-button" id="h5p-editor-submit">
              submit data
            </button>
            <script dangerouslySetInnerHTML={{ __html: scriptInline }} />
          </div>
        </body>
      </html>
    );

    const pMarkup = prepareMarkupForPassing(markup);

    return window.URL.createObjectURL(
      new Blob([pMarkup], {
        type: "text/html",
      })
    );
  }, [state]);

  return (
    <div
      className="h5p-editor"
      style={{ height: height, position: "relative" }}
    >
      {loading && <Loader />}

      {src && (
        <iframe
          ref={iFrameRef}
          title="editor"
          src={src}
          srcDoc={src}
          style={{
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            border: "none",
          }}
        ></iframe>
      )}
    </div>
  );
};

export default Editor;
