import React, {
  FunctionComponent,
  useCallback,
  useState,
  useMemo,
} from "react";

import type { EditorContextConfig, EditorState, EditorSettings, H5PEditorContent } from "h5p-headless-player"

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

  const getContentConfig = useCallback(
    (id) => {
      return fetch(id ? `${url}/content/${id}` : `${url}/content`, {
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
    (data: H5PEditorContent, id = null) => {
      return fetch(id ? `${url}/content/${id}` : `${url}/content`, {
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
      value={{ url, state, getEditorConfig, getContentConfig, submitContent }}
    >
      {children}
    </EditorContext.Provider>
  );
};
