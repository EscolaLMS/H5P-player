var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "react/jsx-runtime", "react", "react-dom", "./App"], function (require, exports, jsx_runtime_1, react_1, react_dom_1, App_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    react_1 = __importDefault(react_1);
    react_dom_1 = __importDefault(react_dom_1);
    App_1 = __importDefault(App_1);
    react_dom_1.default.render(jsx_runtime_1.jsx(react_1.default.StrictMode, { children: jsx_runtime_1.jsx(App_1.default, {}, void 0) }, void 0), document.getElementById("root"));
});
