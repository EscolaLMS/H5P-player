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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useMemo, useRef, useContext, } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { unescape } from "html-escaper";
import "./index.css";
import Loader from "./../loader";
import { EditorContext } from "./../context";
export var Player = function (_a) {
    var id = _a.id, onXAPI = _a.onXAPI;
    var _b = useState(100), height = _b[0], setHeight = _b[1];
    var iFrameRef = useRef(null);
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useContext(EditorContext), state = _d.state, getContentConfig = _d.getContentConfig;
    useEffect(function () {
        getContentConfig &&
            getContentConfig(id)
                .then(function () { return setLoading(false); })
                .catch(function () { return setLoading(false); });
    }, [id, getContentConfig]);
    useEffect(function () {
        var onMessage = function (event) {
            if (event.data.iFrameHeight) {
                setHeight(event.data.iFrameHeight);
            }
            if (event.data.statement) {
                onXAPI && onXAPI(event.data);
            }
        };
        window && window.addEventListener("message", onMessage);
        return function () {
            window && window.removeEventListener("message", onMessage);
        };
    }, [iFrameRef, state, onXAPI, id]);
    var src = useMemo(function () {
        var _a, _b, _c;
        var settings = state.value === "loaded" && state.settings;
        if (!settings)
            return "";
        var content = state.value === "loaded" && ((_a = state.settings) === null || _a === void 0 ? void 0 : _a.contents)
            ? (_b = state.settings) === null || _b === void 0 ? void 0 : _b.contents[Object.keys((_c = state.settings) === null || _c === void 0 ? void 0 : _c.contents)[0]]
            : null;
        var embedType = content === null || content === void 0 ? void 0 : content.content.library.embedTypes;
        var markup = renderToStaticMarkup(_jsxs("html", { children: [_jsxs("head", { children: [_jsx("style", { children: "\n          body, html {margin:0; padding:0;}\n          iframe { border:none; margin:0; padding:0; }\n          " }, void 0),
                        _jsx("script", { children: "const H5PIntegration = window.H5PIntegration = " + JSON.stringify(settings) + "; " }, void 0),
                        __spreadArray(__spreadArray([], settings.core.scripts), settings.loadedJs).map(function (script) { return (_jsx("script", { src: script }, script)); }),
                        __spreadArray(__spreadArray([], settings.core.styles), settings.loadedCss).map(function (style) { return (_jsx("link", { type: "text/css", rel: "stylesheet", href: style }, style)); }),
                        _jsx("script", { children: "H5P.getCrossOrigin = function (source) { return \"anonymous\" }" }, void 0)] }, void 0),
                _jsx("body", { children: _jsxs("div", __assign({ className: "h5p-player-wrapper h5p-resize-observer" }, { children: [(embedType && embedType === "div") || (embedType === '') && (_jsx("div", { className: "h5p-content", "data-content-id": id }, void 0)),
                            embedType && embedType === "iframe" && (_jsx("div", __assign({ className: "h5p-iframe-wrapper" }, { children: _jsx("iframe", { id: "h5p-iframe-" + id, className: "h5p-iframe", "data-content-id": id, src: "about:blank", frameBorder: "0", scrolling: "no", title: "player" }, void 0) }), void 0)),
                            _jsx("script", { children: "\n            (function ($) {\n                const replacerFunc = () => {\n                    const visited = new WeakSet();\n                    return (key, value) => {\n                      if (value.nodeType) return;\n                      if (typeof value === \"object\" && value !== null) {\n                        if (visited.has(value)) {\n                          return;\n                        }\n                        visited.add(value);\n                      }\n                      return value;\n                    };\n                  };\n                const postMessage = (data) => parent.postMessage(data, \"" + window.location.origin + "\");\n                const resizeObserver = new ResizeObserver((entries) =>\n                    postMessage({ iFrameHeight: entries[0].contentRect.height })\n                );\n                resizeObserver.observe(document.querySelector(\".h5p-resize-observer\"));\n                H5P.externalDispatcher.on('xAPI', function (event) {\n                    try {\n                      postMessage(event.data, replacerFunc())\n                    } catch(err) {\n                      console.error(event, err)\n                    }\n                });\n            })(H5P.jQuery);\n            " }, void 0)] }), void 0) }, void 0)] }, void 0));
        return window.URL.createObjectURL(new Blob([unescape(markup).split("&#x27;").join("'")], {
            type: "text/html",
        }));
    }, [state, id]);
    return (_jsxs("div", __assign({ className: "h5p-player", style: { height: height } }, { children: [loading && _jsx(Loader, {}, void 0),
            _jsx("iframe", { ref: iFrameRef, title: "player", src: src }, void 0)] }), void 0));
};
export default Player;
