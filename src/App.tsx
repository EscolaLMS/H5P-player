import React, { useState } from "react";
import { EditorContextProvider } from "./components/hh5p/editor/context";
import Editor from "./components/hh5p/editor/index";
function App() {
  const [id, setId] = useState<string | number>(13);
  return (
    <div className="App">
      <EditorContextProvider url="http://localhost:1000/api/hh5p">
        <Editor id={id} onSubmit={(response) => setId(response.id)} />
      </EditorContextProvider>
    </div>
  );
}

export default App;
