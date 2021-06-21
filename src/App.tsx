import React, { useState, useEffect } from "react";
import { EditorContextProvider } from "./components/hh5p/context/index";
import Editor from "./components/hh5p/editor/index";
import Player from "./components/hh5p/player";

function App() {
  const [state, setState] = useState<{
    state: string;
    id?: number;
  }>({
    state: "init",
  });

  useEffect(() => {
    const onHashChange = () => {
      const newState = {
        state: window.location.hash.includes("player")
          ? "player"
          : window.location.hash.includes("editor")
          ? "editor"
          : "init",
        id: window.location.hash.includes("id=")
          ? parseInt(window.location.hash.split("id=")[1])
          : undefined,
      };
      setState(newState);
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <div className="App">
      <EditorContextProvider url="http://localhost:1000/api/hh5p">
        {state.state === "editor" ? (
          <Editor
            id={state.id}
            onSubmit={(response) => {
              setState((prevState) => ({
                ...prevState,
                id:
                  typeof response.id === "string"
                    ? parseInt(response.id)
                    : response.id,
              }));
            }}
          />
        ) : (
          <React.Fragment />
        )}

        {state.state === "player" && state.id ? (
          <Player id={state.id} onXAPI={(data) => console.log(data)} />
        ) : (
          <React.Fragment />
        )}
      </EditorContextProvider>
    </div>
  );
}

export default App;
