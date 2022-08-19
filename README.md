# H5P Headless React Components

This package contains React components that are meant to be used with rendering [H5P](https://h5p.org/) Editor and Player while implmenting [Wellms.io](https://www.wellms.io/) Admin Panel and bespoke frontend.

![npm](https://img.shields.io/npm/v/@escolalms/h5p-react)
![npm](https://img.shields.io/npm/dm/@escolalms/h5p-react)
[![Generate TypeScript Documentation](https://github.com/EscolaLMS/H5P-player/actions/workflows/ts-doc.yml/badge.svg)](https://github.com/EscolaLMS/H5P-player/actions/workflows/ts-doc.yml)
[![Typescript check](https://github.com/EscolaLMS/H5P-player/actions/workflows/tsc.yml/badge.svg)](https://github.com/EscolaLMS/H5P-player/actions/workflows/tsc.yml)

See isolated implementation here [EscolaLMS/h5p-laravel-demo](https://github.com/EscolaLMS/h5p-laravel-demo/tree/main/resources/js) which is isolated into deployment [https://h5p-laravel-demo.stage.etd24.pl/](https://h5p-laravel-demo.stage.etd24.pl/)

Demo [react source files](https://github.com/EscolaLMS/h5p-laravel-demo/blob/main/resources/js/index.tsx), are great starting point for frontend tutorial.

## Editor

Rending h5p editor with `onSubmit` callback that gets params of new h5p element

Example

```tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  EditorSettings,
  H5PEditorContent,
  ContextlessEditor as Editor,
} from "@escolalms/h5p-react";

const LANG = "en";
const API_URL = "/api";
const TOKEN = "xxx";

const editorSettings = (id?: string | number, lang: string = "en") => {
  let url: string = id
    ? `${API_URL}/admin/hh5p/editor/${id}`
    : `${API_URL}/admin/hh5p/editor`;
  url = lang ? `${url}?lang=${lang}` : url;
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    method: "GET",
  });
};

const updateContent = (data: H5PEditorContent, id?: string | number) => {
  return fetch(
    id
      ? `${API_URL}/admin/hh5p/content/${id}`
      : `${API_URL}/admin/hh5p/content`,
    {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
};

export const page = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [settings, setEditorSettings] = useState<EditorSettings>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      editorSettings(id === "new" ? undefined : id, LANG)
        .then((res) => res.json())
        .then((data) => {
          setEditorSettings(data.data);
          setLoading(false);
        });
    }
  }, [id]);

  const onSubmit = useCallback((data: H5PEditorContent) => {
    setLoading(true);
    updateContent(data, id === "new" ? undefined : id)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.success) {
          setLoading(false);
          navigate(`/editor/${data.data.id}`);
        }
      });
  }, []);

  if (!settings) {
    return <p>loading...</p>;
  }

  return (
    settings && (
      <Editor
        onError={(err) => console.error(err)}
        state={settings}
        allowSameOrigin
        onSubmit={onSubmit}
        loading={loading}
      />
    )
  );
};

export default page;
```

## Player

Rending h5p player with `onXAPI` callback that gets params of new h5p element

Player also has option to pass custom styles, which is describes here https://components.wellms.io/#h5player

```tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  EditorSettings,
  ContextlessPlayer as Player,
} from "@escolalms/h5p-react";

const LANG = "en";
const API_URL = "/api";

const contentSettings = (uuid?: string | number, lang: string = "en") => {
  let url: string = `${API_URL}/hh5p/content/${uuid}`;
  url = lang ? `${url}?lang=${lang}` : url;
  return fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    method: "GET",
  });
};

export const page = () => {
  const { uuid } = useParams<{ uuid: string }>();

  const [settings, setSettings] = useState<EditorSettings>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (uuid) {
      setLoading(true);
      contentSettings(uuid, LANG)
        .then((res) => res.json())
        .then((data) => {
          setSettings(data.data);
          setLoading(false);
        });
    }
  }, [uuid]);

  if (!settings) {
    return <p>loading...</p>;
  }

  if (!uuid) {
    return <p>error: uuid is not set</p>;
  }

  if (settings && uuid && uuid !== "") {
    return (
      <div>
        <Player
          onXAPI={(e) => console.log("xAPI event", e)}
          state={settings}
          loading={loading}
        />
        <hr />
        <p>
          <pre>
            Open Developer Tools Console to see xAPI events from this content
          </pre>
        </p>
      </div>
    );
  }

  return <pre>error</pre>;
};

export default page;
```

## Documentation

Generated TS Doc is available at [https://escolalms.github.io/H5P-player/](https://escolalms.github.io/H5P-player/).

### TypeScript definitions

```ts
type H5PEditorContent = {
  title: string;
  library: string;
  params: string; // JSON string
  nonce: string;
};

export type H5PLibraryLanguage = {
  library_id: number;
  language_code: string;
  translation: {
    semantics: {
      default?: string;
      description?: string;
      label: string;
      fields: {
        entity?: string;
        widgets?: { label: string }[];
        label: string;
        description?: string;
        placeholder?: string;
        important?: {
          description?: string;
          example?: string;
        };
      }[];
    }[];
  };
};

export type H5PLibrary = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  title: string;
  runnable: number;
  restricted: number;
  fullscreen: number;
  embed_types: string;
  semantics: object;
  machineName: string;
  uberName: string;
  majorVersion: string;
  major_version: number;
  minorVersion: string;
  minor_version: number;
  patchVersion: string;
  patch_version: number;
  preloaded_js: string;
  preloadedJs: string;
  preloaded_css: string;
  preloadedCss: string;
  dropLibraryCss: string;
  drop_library_css: string;
  has_icon: string;
  tutorialUrl: string;
  tutorial_url: string;
  hasIcon: string;
  libraryId: number;
  children: H5PLibrary[];
  languages: H5PLibraryLanguage[];
};

export type H5PContent = {
  id: number;
  uuid: string;
  created_at: string;
  updated_at: string;
  user_id: string | number;
  title: string;
  library_id: string;
  parameters: string;
  filtered: string;
  slug: string;
  embed_type: string;
  params: object;
  metadata: object;
  library: H5PLibrary;
  nonce: string;
};
```
