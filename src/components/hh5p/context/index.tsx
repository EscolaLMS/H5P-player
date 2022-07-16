import React, { FunctionComponent, useCallback, useState } from "react";

import type {
  EditorContextConfig,
  EditorState,
  EditorSettings,
  H5PEditorContent,
  H5PObject,
} from "@escolalms/h5p-react";

interface IMock {
  children?: React.ReactElement[] | React.ReactElement;
  url: string;
  defaultLang?: string;
}

const defaultConfig: EditorContextConfig = {
  url: "http://localhost:1000/api/hh5p/",
  state: { value: "initial" },
};

export const EditorContext: React.Context<EditorContextConfig> =
  React.createContext(defaultConfig);

/**
 *
 *
 */
export const EditorContextProvider: FunctionComponent<IMock> = ({
  children,
  url,
  defaultLang = "en",
}) => {
  const [state, setState] = useState<EditorState>({ value: "initial" });
  const [lang, setLang] = useState<string>(defaultLang);
  const [headers, setHeaders] = useState<Headers>(
    new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
    })
  );

  const getEditorConfig = useCallback(
    (id?: number | string) => {
      let furl: string = id ? `${url}/editor/${id}` : `${url}/editor`;
      furl = lang ? `${furl}?lang=${lang}` : furl;

      return fetch(furl, {
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
            settings: data.data,
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
    [url, headers, lang]
  );

  const seth5pObject = useCallback(
    (h5pObject: H5PObject) => {
      if (h5pObject) {
        setState((prevState) => ({
          ...prevState,
          value: "loaded",
          settings: h5pObject,
        }));
      }
    },
    [url, headers]
  );

  const getContentConfig = useCallback(
    (id: number | string) => {
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
            settings: data.data,
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
    (data: H5PEditorContent, id?: string | number) => {
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
      value={{
        url,
        state,
        getEditorConfig,
        getContentConfig,
        submitContent,
        seth5pObject,
        setLang,
        setHeaders,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
