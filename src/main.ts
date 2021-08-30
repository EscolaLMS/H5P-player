import {
  EditorContext,
  EditorContextProvider,
} from "./components/hh5p/context/index";
import Player from "./components/hh5p/player";
import Editor from "./components/hh5p/editor";

const modules = {
  EditorContext: EditorContext,
  EditorContextProvider: EditorContextProvider,
  Player: Player,
  Editor: Editor,
};

export default modules;
