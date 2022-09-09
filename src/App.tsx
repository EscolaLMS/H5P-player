import React, { useState } from "react";
import Editor from "./components/hh5p/contextless/editor";
import Player from "./components/hh5p/contextless/player";
import { H5PObject, EditorSettings } from "@escolalms/h5p-react";

type AppState =
  | {
      state: "init";
    }
  | {
      state: "player";
      props: H5PObject;
    }
  | {
      state: "editor";
      props: EditorSettings;
    };

function App() {
  const [params, setParams] = useState<string>("");
  const [lang, setLang] = useState<"pl" | "en">("en");
  const [state, setState] = useState<AppState>({
    state: "init",
  });

  return (
    <div className="App">
      {state.state === "editor" ? (
        <Editor
          lang={lang}
          state={state.props}
          onSubmit={(response) => {
            console.log(response);
          }}
        />
      ) : (
        <React.Fragment />
      )}

      {state.state === "player" ? (
        <Player
          lang={lang}
          state={state.props}
          onXAPI={(data) => console.log(data)}
        />
      ) : (
        <React.Fragment />
      )}
      <div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as "pl" | "en")}
        >
          <option>en</option>
          <option>pl</option>
        </select>
        <br />
        <textarea
          placeholder="pass here H5PIntegration data as JSON"
          value={params}
          onChange={(e) => setParams(e.target.value)}
        ></textarea>
        <br />
        <button
          onClick={() => {
            setState({ state: "player", props: JSON.parse(params) });
          }}
        >
          launch player
        </button>
        <button
          onClick={() => {
            setState({ state: "editor", props: JSON.parse(params) });
          }}
        >
          launch editor
        </button>
      </div>
    </div>
  );
}

export default App;
