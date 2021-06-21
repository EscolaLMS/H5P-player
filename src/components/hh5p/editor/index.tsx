import React, {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useRef,
  useContext,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unescape } from "html-escaper";

import "./index.css";
import Loader from "./../loader";

import { EditorContext } from "./../context";

import { H5PEditorStatus } from "./../../../types";

type EditorProps = {
  id?: number | string;
  onSubmit?: (response: { id: string | number }) => void;
};

export const Editor: FunctionComponent<EditorProps> = ({ id, onSubmit }) => {
  const [height, setHeight] = useState<number>(100);
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { state, getEditorConfig, submitContent } = useContext(EditorContext);

  useEffect(() => {
    getEditorConfig && getEditorConfig(id);
  }, [id, getEditorConfig]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!(event.origin === window.location.origin)) {
        return;
      }
      if (event.data.iFrameHeight) {
        setHeight(event.data.iFrameHeight);
      }
      if (event.data.h5pEditorStatus) {
        const status: H5PEditorStatus = event.data;
        if (status.h5pEditorStatus === "success" && state.value === "loaded") {
          setLoading(true);
          submitContent &&
            submitContent(
              {
                ...status.data,
                nonce: state.settings.nonce,
              },
              id
            )
              .then((data) => {
                onSubmit && data && onSubmit(data);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
        }

        status.h5pEditorStatus === "error" && console.log(status.error);
      }
    };

    window && window.addEventListener("message", onMessage);
    return () => {
      window && window.removeEventListener("message", onMessage);
    };
  }, [iFrameRef, submitContent, state, onSubmit, id]);

  const src = useMemo(() => {
    const settings = state.value === "loaded" && state.settings;
    if (!settings) return "";

    const content =
      state.value === "loaded" && state.settings?.contents
        ? state.settings?.contents[Object.keys(state.settings?.contents)[0]]
        : null;
    const params = content ? content.jsonContent : "";

    const library = content ? content.library : "";

    const markup = renderToStaticMarkup(
      <html>
        <head>
          <style>{` body, html {margin:0; padding:0;}`}</style>
          <script>
            {`const H5PIntegration = window.H5PIntegration = ${JSON.stringify(
              settings
            )}; `}
          </script>
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
            <script>
              {`           
            (function ($) {
                const postMessage = (data) => parent.postMessage(data, "${window.location.origin}");
                const resizeObserver = new ResizeObserver((entries) =>
                    postMessage({ iFrameHeight: entries[0].contentRect.height })
                );
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
                    const h5peditor = new ns.Editor('${library}', '${params}', document.getElementById("h5p-editor"));
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
    <div className="h5p-editor" style={{ height: height }}>
      {loading && <Loader />}
      <iframe ref={iFrameRef} title="editor" src={src}></iframe>
    </div>
  );
};

export default Editor;
