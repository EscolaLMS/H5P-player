"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./components/hh5p/context/index");
var player_1 = __importDefault(require("./components/hh5p/player"));
var editor_1 = __importDefault(require("./components/hh5p/editor"));
var modules = {
    EditorContext: index_1.EditorContext,
    EditorContextProvider: index_1.EditorContextProvider,
    Player: player_1.default,
    Editor: editor_1.default,
};
exports.default = modules;
