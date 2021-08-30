import { FunctionComponent } from "react";
import { XAPIEvent } from "./../../../types";
declare type PlayerProps = {
    id: number | string;
    onXAPI?: (event: XAPIEvent) => void;
};
export declare const Player: FunctionComponent<PlayerProps>;
export default Player;
