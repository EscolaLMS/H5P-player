import React, {
  useEffect,
  useState,
  FunctionComponent,
  useMemo,
  useRef,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unescape } from "html-escaper";

import "./editor.css";
import Loader from "./loader";
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
  contents?: {
    [contentId: string]: {
      library: string;
      jsonContent: string;
      fullScreen: boolean;
      title: string;
      contentUserData: [
        {
          state: object;
        }
      ];
    };
  };
};

type EditorState =
  | {
      value: "initial";
    }
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

type ContentState =
  | {
      value: "initial";
    }
  | {
      value: "loading";
    }
  | {
      value: "loaded";
      data: object;
    }
  | {
      value: "error";
      error: string;
    };

type H5PEditorStatus =
  | {
      h5pEditorStatus: "error";
      error: string;
    }
  | {
      h5pEditorStatus: "success";
      data: H5PEditorContent;
    };

type H5PEditorContent = {
  title: string;
  library: string;
  params: string; // JSON string
};

type EditorProps = {
  settings: EditorSettings;
  loading: boolean;
  onSubmit?: (data: H5PEditorContent) => void;
};

export const EditorWrapper: FunctionComponent<{ editorApiUrl: string }> = ({
  editorApiUrl,
}) => {
  const [editorState, setEditorState] = useState<EditorState>({
    value: "initial",
  });
  const [contentState, setContentState] = useState<ContentState>({
    value: "initial",
  });

  useEffect(() => {
    fetch(editorApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw Error(`response error status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setEditorState({
          value: "loaded",
          settings: data,
        });
      })
      .catch((err) => {
        setEditorState({
          value: "error",
          error: err.toString(),
        });
      });
  }, [editorApiUrl]);
  if (editorState.value === "loading" || editorState.value === "initial") {
    return <pre>loading</pre>;
  }
  if (editorState.value === "error") {
    return (
      <pre>
        <strong>Error:</strong> {editorState.error}
      </pre>
    );
  }
  return (
    <Editor
      settings={editorState.settings}
      onSubmit={(data) => {
        setContentState({ value: "loading" });
        setTimeout(() => {
          setContentState({ value: "loaded", data: { foo: "bar" } });
        }, 1500);
      }}
      loading={contentState.value === "loading"}
    />
  );
};

export const Editor: FunctionComponent<EditorProps> = ({
  settings,
  loading,
  onSubmit,
}) => {
  const [height, setHeight] = useState<number>(100);
  const iFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!(event.origin === window.location.origin)) {
        return;
      }
      if (event.data.iFrameHeight) {
        setHeight(event.data.iFrameHeight);
      }
      console.log(event.data);
      if (event.data.h5pEditorStatus) {
        const status: H5PEditorStatus = event.data;
        status.h5pEditorStatus === "success" &&
          onSubmit &&
          onSubmit(status.data);
        status.h5pEditorStatus === "error" && console.log(status.error);
      }
    };

    window && window.addEventListener("message", onMessage);
    return () => {
      window && window.removeEventListener("message", onMessage);
    };
  }, [iFrameRef, onSubmit]);

  const src = useMemo(() => {
    const content = settings.contents
      ? settings.contents[Object.keys(settings.contents)[0]]
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
  }, [settings]);

  return (
    <div className="h5p-editor" style={{ height: height }}>
      {loading && <Loader />}
      <iframe ref={iFrameRef} title="editor" src={src}></iframe>
    </div>
  );
};

export default EditorWrapper;
