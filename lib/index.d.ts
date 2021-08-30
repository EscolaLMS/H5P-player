/// <reference types="react" />
import { EditorContext, EditorContextProvider } from "./components/hh5p/context/index";
import Player from "./components/hh5p/player";
import Editor from "./components/hh5p/editor";
export { EditorContext, EditorContextProvider, Player, Editor };
declare const _default: {
    EditorContext: import("react").Context<import("./types").EditorContextConfig>;
    EditorContextProvider: import("react").FunctionComponent<{
        children?: import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>>[] | undefined;
        url: string;
    }>;
    Player: import("react").FunctionComponent<{
        id: string | number;
        onXAPI?: ((event: import("./types").XAPIEvent) => void) | undefined;
    }>;
    Editor: import("react").FunctionComponent<{
        id?: string | number | undefined;
        onSubmit?: ((response: {
            id: string | number;
        }) => void) | undefined;
    }>;
};
export default _default;
