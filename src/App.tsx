import React from "react";
import Editor from "./components/hh5p/editor";

function App() {
  return (
    <div className="App">
      <Editor editorApiUrl="http://localhost:1000/api/hh5p/editor" />
    </div>
  );
}

export default App;
