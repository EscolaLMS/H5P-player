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
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useCallback, useState, useMemo, } from "react";
var defaultConfig = {
    url: "http://localhost:1000/api/hh5p/",
    state: { value: "initial" },
};
export var EditorContext = React.createContext(defaultConfig);
/**
 *
 *
 */
export var EditorContextProvider = function (_a) {
    var children = _a.children, url = _a.url;
    var _b = useState({ value: "initial" }), state = _b[0], setState = _b[1];
    var headers = useMemo(function () {
        return new Headers({
            "Content-Type": "application/json",
            Accept: "application/json",
        });
    }, []);
    var getEditorConfig = useCallback(function (id) {
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
    var getContentConfig = useCallback(function (id) {
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
    var submitContent = useCallback(function (data, id) {
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
    return (_jsx(EditorContext.Provider, __assign({ value: { url: url, state: state, getEditorConfig: getEditorConfig, getContentConfig: getContentConfig, submitContent: submitContent } }, { children: children }), void 0));
};
