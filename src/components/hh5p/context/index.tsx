import React, {
  FunctionComponent,
  useCallback,
  useState,
  useMemo,
} from "react";

// TODO rename this to H5PContext

const defaultConfig: H5P.EditorContextConfig = {
  url: "http://localhost:1000/api/hh5p/",
  state: { value: "initial" },
};

export const EditorContext: React.Context<H5P.EditorContextConfig> =
  React.createContext(defaultConfig);

/**
 *
 *
 */
export const EditorContextProvider: FunctionComponent<{
  children?: React.ReactElement[] | React.ReactElement;
  url: string;
}> = ({ children, url }) => {
  const [state, setState] = useState<H5P.EditorState>({ value: "initial" });

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
          return data as H5P.EditorSettings;
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
          return data as H5P.EditorSettings;
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
    (data: H5P.EditorContent, id = null) => {
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
