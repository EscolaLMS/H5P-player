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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorContextProvider = exports.EditorContext = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = __importStar(require("react"));
var defaultConfig = {
    url: "http://localhost:1000/api/hh5p/",
    state: { value: "initial" },
};
exports.EditorContext = react_1.default.createContext(defaultConfig);
/**
 *
 *
 */
var EditorContextProvider = function (_a) {
    var children = _a.children, url = _a.url;
    var _b = react_1.useState({ value: "initial" }), state = _b[0], setState = _b[1];
    var headers = react_1.useMemo(function () {
        return new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        });
    }, []);
    var getEditorConfig = react_1.useCallback(function (id) {
        return fetch(id ? url + "/editor/" + id : url + "/editor", {
            headers: headers,
        })
            .then(function (response) {
            if (!response.ok) {
                throw Error("response error status " + response.status);
            }
            return response.json();
        })
            .then(function (data) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { value: "loaded", settings: data })); });
            return data;
        })
            .catch(function (err) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { value: "error", error: err.toString() })); });
        });
    }, [url, headers]);
    var getContentConfig = react_1.useCallback(function (id) {
        return fetch(id ? url + "/content/" + id : url + "/content", {
            headers: headers,
        })
            .then(function (response) {
            if (!response.ok) {
                throw Error("response error status " + response.status);
            }
            return response.json();
        })
            .then(function (data) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { value: "loaded", settings: data })); });
            return data;
        })
            .catch(function (err) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { value: "error", error: err.toString() })); });
        });
    }, [url, headers]);
    var submitContent = react_1.useCallback(function (data, id) {
        if (id === void 0) { id = null; }
        return fetch(id ? url + "/content/" + id : url + "/content", {
            method: "POST",
            body: JSON.stringify(data),
            headers: headers,
        })
            .then(function (response) {
            if (!response.ok) {
                throw Error("response error status " + response.status);
            }
            return response.json();
        })
            .then(function (data) {
            return data;
        })
            .catch(function (err) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { value: "error", error: err.toString() })); });
        });
    }, [url, headers]);
    return (jsx_runtime_1.jsx(exports.EditorContext.Provider, __assign({ value: { url: url, state: state, getEditorConfig: getEditorConfig, getContentConfig: getContentConfig, submitContent: submitContent } }, { children: children }), void 0));
};
exports.EditorContextProvider = EditorContextProvider;
