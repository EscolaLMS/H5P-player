import React, { useState } from "react";
import { EditorContextProvider } from "./components/hh5p/context/index";
import Editor from "./components/hh5p/editor/index";
import Player from "./components/hh5p/player";

function App() {
  const [id, setId] = useState<string | number>(39);
  return (
    <div className="App">
      <EditorContextProvider url="http://localhost:1000/api/hh5p">
        {/*<Editor id={id} onSubmit={(response) => setId(response.id)} />*/}
        <Player id={id} onXAPI={(data) => console.log(data)} />
      </EditorContextProvider>
    </div>
  );
}

export default App;
