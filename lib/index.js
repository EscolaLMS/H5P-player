"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = exports.Editor = exports.EditorContext = exports.EditorContextProvider = void 0;
var index_1 = require("./components/hh5p/context/index");
Object.defineProperty(exports, "EditorContextProvider", { enumerable: true, get: function () { return index_1.EditorContextProvider; } });
Object.defineProperty(exports, "EditorContext", { enumerable: true, get: function () { return index_1.EditorContext; } });
var index_2 = __importDefault(require("./components/hh5p/editor/index"));
exports.Editor = index_2.default;
var player_1 = __importDefault(require("./components/hh5p/player"));
exports.Player = player_1.default;
exports.default = {
    EditorContextProvider: index_1.EditorContextProvider,
    EditorContext: index_1.EditorContext,
    Editor: index_2.default,
    Player: player_1.default,
};
