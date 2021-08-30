type Dict = {
  [key: string]: string | Dict;
};
declare namespace H5P {
  export type EditorContent = {
    title: string;
    library: string;
    params: string; // JSON string
    nonce: string;
  };

  export type XAPIEvent = {
    statement: {
      actor: {
        account: {
          name: string;
          homePage: string;
        };
        objectType: string;
      };
      verb: {
        id: string; // one of those http://xapi.vocab.pub/verbs/index.html
        display: { [lang: string]: string };
      };
      object: {
        objectType: string;
        definition: {
          extensions: { [key: string]: number };
          description: { [lang: string]: string };
          type: string; // https://xapi.com/statements-101/
          interactionType: string;
          correctResponsesPattern: string[];
        };
      };
      context: {
        contextActivities: {
          category: [
            {
              id: string;
              objectType: string;
            }
          ];
        };
      };
      result: {
        score: { min: number; max: number; raw: number; scaled: number };
        completion: boolean;
        success: boolean;
        duration: string;
        response: boolean | string;
      };
    };
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
    contents?: Record<
      string,
      {
        library: string;
        jsonContent: string;
        fullScreen: boolean;
        title: string;
        content: {
          id: number;
          library: {
            id: number;
            embedTypes: string;
            name: string;
          };
        };
        contentUserData: [
          {
            state: object;
          }
        ];
      }
    >;
  };

  export type EditorState =
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

  export type EditorContextConfig = {
    state: EditorState;
    url: string;
    getEditorConfig?: (id?: number | string) => Promise<EditorSettings | void>;
    getContentConfig?: (id: number | string) => Promise<EditorSettings | void>;
    submitContent?: (
      data: H5PEditorContent,
      id?: string | number
    ) => Promise<{ id: string | number } | void>;
  };

  export type EditorStatus =
    | {
        h5pEditorStatus: "error";
        error: string;
      }
    | {
        h5pEditorStatus: "success";
        data: H5PEditorContent;
      };
}
