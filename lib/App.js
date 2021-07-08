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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { EditorContextProvider } from "./components/hh5p/context/index";
import Editor from "./components/hh5p/editor/index";
import Player from "./components/hh5p/player";
function App() {
    var _a = useState({
        state: "init",
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
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
    return (_jsx("div", __assign({ className: "App" }, { children: _jsxs(EditorContextProvider, __assign({ url: "http://localhost:1000/api/hh5p" }, { children: [state.state === "editor" ? (_jsx(Editor, { id: state.id, onSubmit: function (response) {
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { id: typeof response.id === "string"
                                ? parseInt(response.id)
                                : response.id })); });
                    } }, void 0)) : (_jsx(React.Fragment, {}, void 0)),
                state.state === "player" && state.id ? (_jsx(Player, { id: state.id, onXAPI: function (data) { return console.log(data); } }, void 0)) : (_jsx(React.Fragment, {}, void 0))] }), void 0) }), void 0));
}
export default App;
