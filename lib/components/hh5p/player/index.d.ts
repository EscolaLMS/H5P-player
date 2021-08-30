import { FunctionComponent } from "react";
declare type PlayerProps = {
    id: number | string;
    onXAPI?: (event: H5P.XAPIEvent) => void;
};
export declare const Player: FunctionComponent<PlayerProps>;
export default Player;
