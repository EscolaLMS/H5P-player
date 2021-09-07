"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var index_1 = require("./components/hh5p/context/index");
var index_2 = __importDefault(require("./components/hh5p/editor/index"));
var player_1 = __importDefault(require("./components/hh5p/player"));
function App() {
    var _a = (0, react_1.useState)({
        state: "init",
    }), state = _a[0], setState = _a[1];
    (0, react_1.useEffect)(function () {
        var onHashChange = function () {
            var newState = {
                state: window.location.hash.includes("player")
                    ? "player"
                    : window.location.hash.includes("editor")
                        ? "editor"
                        : "init",
                id: window.location.hash.includes("id=")
                    ? parseInt(window.location.hash.split("id=")[1])
                    : undefined,
            };
            setState(newState);
        };
        window.addEventListener("hashchange", onHashChange);
        onHashChange();
        return function () {
            window.removeEventListener("hashchange", onHashChange);
        };
    }, []);
    return ((0, jsx_runtime_1.jsx)("div", __assign({ className: "App" }, { children: (0, jsx_runtime_1.jsxs)(index_1.EditorContextProvider, __assign({ url: "http://localhost:1000/api/hh5p" }, { children: [state.state === "editor" ? ((0, jsx_runtime_1.jsx)(index_2.default, { id: state.id, onSubmit: function (response) {
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { id: typeof response.id === "string"
                                ? parseInt(response.id)
                                : response.id })); });
                    } }, void 0)) : ((0, jsx_runtime_1.jsx)(react_1.default.Fragment, {}, void 0)), state.state === "player" && state.id ? ((0, jsx_runtime_1.jsx)(player_1.default, { id: state.id, onXAPI: function (data) { return console.log(data); } }, void 0)) : ((0, jsx_runtime_1.jsx)(react_1.default.Fragment, {}, void 0))] }), void 0) }), void 0));
}
exports.default = App;
