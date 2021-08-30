import { FunctionComponent } from "react";
declare type EditorProps = {
    id?: number | string;
    onSubmit?: (response: {
        id: string | number;
    }) => void;
};
export declare const Editor: FunctionComponent<EditorProps>;
export default Editor;
