import React, {
  FunctionComponent,
  useCallback,
  useState,
  useMemo,
} from "react";

type Dict = {
  [key: string]: string | Dict;
};

export type H5PEditorContent = {
  title: string;
  library: string;
  params: string; // JSON string
  nonce: string;
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
  nonce: string;
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

type EditorContextConfig = {
  state: EditorState;
  url: string;
  getEditorConfig?: (id?: number | string) => Promise<EditorSettings | void>;
  submitContent?: (
    data: H5PEditorContent
  ) => Promise<{ id: string | number } | void>;
};
interface IMock {
  children?: React.ReactElement[] | React.ReactElement;
  url: string;
}

const defaultConfig: EditorContextConfig = {
  url: "http://localhost:1000/api/hh5p/",
  state: { value: "initial" },
};

export const EditorContext: React.Context<EditorContextConfig> = React.createContext(
  defaultConfig
);

/**
 *
 *
 */
export const EditorContextProvider: FunctionComponent<IMock> = ({
  children,
  url,
}) => {
  const [state, setState] = useState<EditorState>({ value: "initial" });

  const headers = useMemo(() => {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    });
  }, []);

  const getEditorConfig = useCallback(
    (id) => {
      return fetch(id ? `${url}/editor/${id}` : `${url}/editor`, {
        headers,
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(`response error status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          setState((prevState) => ({
            ...prevState,
            value: "loaded",
            settings: data,
          }));
          return data as EditorSettings;
        })
        .catch((err) => {
          setState((prevState) => ({
            ...prevState,
            value: "error",
            error: err.toString(),
          }));
        });
    },
    [url, headers]
  );

  const submitContent = useCallback(
    (data: H5PEditorContent) => {
      return fetch(`${url}/content`, {
        method: "POST",
        body: JSON.stringify(data),
        headers,
      })
        .then((response) => {
          if (!response.ok) {
            throw Error(`response error status ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((err) => {
          setState((prevState) => ({
            ...prevState,
            value: "error",
            error: err.toString(),
          }));
        });
    },
    [url, headers]
  );

  return (
    <EditorContext.Provider
      value={{ url, state, getEditorConfig, submitContent }}
    >
      {children}
    </EditorContext.Provider>
  );
};
