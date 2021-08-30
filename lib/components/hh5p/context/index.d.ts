import React, { FunctionComponent } from "react";
import { EditorContextConfig } from "../../../types";
export declare const EditorContext: React.Context<EditorContextConfig>;
/**
 *
 *
 */
export declare const EditorContextProvider: FunctionComponent<{
    children?: React.ReactElement[] | React.ReactElement;
    url: string;
}>;
