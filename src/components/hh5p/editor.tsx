import React, { useEffect, useState, FunctionComponent, useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { escape, unescape } from "html-escaper";

import "./editor.css";
type Dict = {
  [key: string]: string | Dict;
};
export type EditorSettings = {
  baseUrl: string;
  url: string;
  postUserStatistics: false;
  ajax: { setFinished: string; contentUserData: string };
  saveFreq: false;
  siteUrl: string;
  l10n: Dict;
  hubIsEnabled: false;
  loadedJs: string[];
  loadedCss: string[];
  core: {
    styles: string[];
    scripts: string[];
  };
  editor: {
    filesPath: string;
    fileIcon: { path: string; width: number; height: number };
    ajaxPath: string;
    libraryUrl: string;
    copyrightSemantics: Dict;
    metadataSemantics: Dict[];

    assets: {
      css: string[];
      js: string[];
    };
    deleteMessage: string;
    apiVersion: { majorVersion: number; minorVersion: number };
  };
};

type EditorState =
  | {
      value: "loading";
    }
  | {
      value: "loaded";
      settings: EditorSettings;
    }
  | {
      value: "error";
      error: string;
    };

type EditorProps = {
  settings: EditorSettings;
};

export const EditorWrapper: FunctionComponent<{ editorApiUrl: string }> = ({
  editorApiUrl,
}) => {
  const [state, setState] = useState<EditorState>({ value: "loading" });
  useEffect(() => {
    fetch(editorApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw Error(`response error status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setState({
          value: "loaded",
          settings: data,
        });
      })
      .catch((err) => {
        setState({
          value: "error",
          error: err.toString(),
        });
      });
  }, [editorApiUrl]);
  if (state.value === "loading") {
    return <pre>loading</pre>;
  }
  if (state.value === "error") {
    return (
      <pre>
        <strong>Error:</strong> {state.error}
      </pre>
    );
  }
  return <Editor settings={state.settings} />;
};

export const Editor: FunctionComponent<EditorProps> = ({ settings }) => {
  const [height, setHeight] = useState<number>(100);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data.iFrameHeight) {
        setHeight(event.data.iFrameHeight);
      }
      //console.log(event);
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  const src = useMemo(() => {
    const markup = renderToStaticMarkup(
      <html>
        <head>
          <style>
            {`
              body, html {margin:0; padding:0;}
              `}
          </style>
          <script>
            const H5PIntegration = window.H5PIntegration ={" "}
            {JSON.stringify(settings)};
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
                const postMessage = (data) => parent.postMessage(data, "*");
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
                    const $editor = $("#h5p-editor");
                    const $params = $("#h5p-parameters");
                    const $library = $("#h5p-library");
                    const library = $library.val();
                    const h5peditor = new ns.Editor(library, $params.val(), $editor[0]);
                    H5P.externalDispatcher.on("xAPI", (event) => postMessage(event));
                    H5P.externalDispatcher.on("resize", (event) => postMessage(event));
                    resizeObserver.observe(document.querySelector(".h5p-editor-wrapper"));
                    $("#h5p-editor-submit").click(function () {
                        console.log(h5peditor.getParams(), h5peditor.getLibrary());
                        return false;
                    });
                };
                ns.getAjaxUrl = function (action, parameters) {
                    var url = H5PIntegration.editor.ajaxPath + action;
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
      new Blob([unescape(markup)], { type: "text/html" })
    );
  }, [settings]);

  return (
    <div className="editor" style={{ height: height }}>
      <iframe title="editor" src={src}></iframe>
    </div>
  );
};

export default EditorWrapper;
