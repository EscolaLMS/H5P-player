"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = exports.Player = exports.EditorContextProvider = exports.EditorContext = void 0;
var index_1 = require("./components/hh5p/context/index");
Object.defineProperty(exports, "EditorContext", { enumerable: true, get: function () { return index_1.EditorContext; } });
Object.defineProperty(exports, "EditorContextProvider", { enumerable: true, get: function () { return index_1.EditorContextProvider; } });
var player_1 = __importDefault(require("./components/hh5p/player"));
exports.Player = player_1.default;
var editor_1 = __importDefault(require("./components/hh5p/editor"));
exports.Editor = editor_1.default;
exports.default = { EditorContext: index_1.EditorContext, EditorContextProvider: index_1.EditorContextProvider, Player: player_1.default, Editor: editor_1.default };
