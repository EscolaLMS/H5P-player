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
import { useEffect, useState, useMemo, useRef, useContext } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { unescape } from 'html-escaper';
import Loader from './../loader';
import { EditorContext } from './../context';
import './index.css';
var prepareMarkupForPassing = function (markup) {
    return unescape(markup);
};
export var Editor = function (_a) {
    var id = _a.id, onSubmit = _a.onSubmit;
    var _b = useState(100), height = _b[0], setHeight = _b[1];
    var iFrameRef = useRef(null);
    var _c = useState({ state: 'initial' }), editorState = _c[0], setEditorState = _c[1];
    var _d = useContext(EditorContext), state = _d.state, getEditorConfig = _d.getEditorConfig, submitContent = _d.submitContent;
    useEffect(function () {
        getEditorConfig && getEditorConfig(id);
    }, [id, getEditorConfig]);
    useEffect(function () {
        var onMessage = function (event) {
            if (!(event.origin === window.location.origin)) {
                return;
            }
            if (event.data.iFrameHeight) {
                setHeight(event.data.iFrameHeight);
            }
            if (event.data.h5pEditorStatus) {
                var status_1 = event.data;
                if (status_1.h5pEditorStatus === 'success' && state.value === 'loaded') {
                    setEditorState({ state: 'loading' });
                    submitContent &&
                        submitContent(__assign(__assign({}, status_1.data), { nonce: state.settings.nonce }), id)
                            .then(function (data) {
                            onSubmit && data && onSubmit(data);
                            setEditorState({ state: 'loaded' });
                        })
                            .catch(function (err) {
                            setEditorState({ state: 'error', error: err.toString() });
                        });
                }
                status_1.h5pEditorStatus === 'error' && console.log(status_1.error);
            }
        };
        window && window.addEventListener('message', onMessage);
        return function () {
            window && window.removeEventListener('message', onMessage);
        };
    }, [iFrameRef, submitContent, state, onSubmit, id]);
    var src = useMemo(function () {
        var _a, _b, _c;
        var settings = state.value === 'loaded' && state.settings;
        if (!settings)
            return '';
        var content = state.value === 'loaded' && ((_a = state.settings) === null || _a === void 0 ? void 0 : _a.contents)
            ? (_b = state.settings) === null || _b === void 0 ? void 0 : _b.contents[Object.keys((_c = state.settings) === null || _c === void 0 ? void 0 : _c.contents)[0]]
            : null;
        var params = content ? content.jsonContent : '';
        try {
            params && JSON.parse(params);
        }
        catch (er) {
            setEditorState({ state: 'error', error: er.toString() });
            return null;
        }
        var library = content ? content.library : '';
        var scriptInline = "\n    (function ($) {\n        const postMessage = (data) => parent.postMessage(data, \"" + window.location.origin + "\");\n        const resizeObserver = new ResizeObserver((entries) =>\n            postMessage({ iFrameHeight: entries[0].contentRect.height })\n        );\n        const params = " + '`' + params + '`' + ".split(\"\\n\").join('');\n        ns.init = function () {\n            ns.$ = H5P.jQuery;\n            ns.basePath = H5PIntegration.editor.libraryUrl;\n            ns.fileIcon = H5PIntegration.editor.fileIcon;\n            ns.ajaxPath = H5PIntegration.editor.ajaxPath;\n            ns.filesPath = H5PIntegration.editor.filesPath;\n            ns.apiVersion = H5PIntegration.editor.apiVersion;\n            ns.copyrightSemantics = H5PIntegration.editor.copyrightSemantics;\n            ns.assets = H5PIntegration.editor.assets;\n            ns.baseUrl = H5PIntegration.baseUrl;\n            ns.metadataSemantics = H5PIntegration.editor.metadataSemantics;\n            if (H5PIntegration.editor.nodeVersionId !== undefined) {\n                ns.contentId = H5PIntegration.editor.nodeVersionId;\n            }\n            const h5peditor = new ns.Editor('" + library + "', params, document.getElementById(\"h5p-editor\"));\n            H5P.externalDispatcher.on(\"xAPI\", (event) => postMessage(event));\n            H5P.externalDispatcher.on(\"resize\", (event) => postMessage(event));\n            resizeObserver.observe(document.querySelector(\".h5p-editor-wrapper\"));\n            $(\"#h5p-editor-submit\").click(() => {\n                h5peditor.getContent(data => postMessage({h5pEditorStatus:\"success\", data}), error =>  postMessage({h5pEditorStatus:\"error\", error}))\n            } );\n        };\n        ns.getAjaxUrl = function (action, parameters) {\n            var url = H5PIntegration.editor.ajaxPath + action;\n            url += action === \"files\" ? \"/" + settings.nonce + "\" : \"\";\n            if (parameters !== undefined) {\n                var separator = url.indexOf(\"?\") === -1 ? \"?\" : \"&\";\n                for (var property in parameters) {\n                    if (parameters.hasOwnProperty(property)) {\n                        url += separator + property + \"=\" + parameters[property];\n                        separator = \"&\";\n                    }\n                }\n            }\n            return url;\n        };\n        $(document).ready(ns.init);\n    })(H5P.jQuery);\n    ";
        var markup = renderToStaticMarkup(_jsxs("html", { children: [_jsxs("head", { children: [_jsx("style", { children: " body, html {margin:0; padding:0;}" }, void 0),
                        _jsx("script", { dangerouslySetInnerHTML: {
                                __html: "const H5PIntegration = window.H5PIntegration = " + JSON.stringify(settings) + "; ",
                            } }, void 0),
                        settings.core.scripts.map(function (script) { return (_jsx("script", { src: script }, script)); }),
                        settings.core.styles.map(function (style) { return (_jsx("link", { type: "text/css", rel: "stylesheet", href: style }, style)); })] }, void 0),
                _jsx("body", { children: _jsxs("div", __assign({ className: "h5p-editor-wrapper" }, { children: [_jsx("div", __assign({ id: "h5p-editor", className: "height-observer" }, { children: "loading" }), void 0),
                            _jsx("p", {}, void 0),
                            _jsx("button", __assign({ className: "h5p-core-button", id: "h5p-editor-submit" }, { children: "submit data" }), void 0),
                            _jsx("script", { dangerouslySetInnerHTML: { __html: scriptInline } }, void 0)] }), void 0) }, void 0)] }, void 0));
        var pMarkup = prepareMarkupForPassing(markup);
        return window.URL.createObjectURL(new Blob([pMarkup], {
            type: 'text/html',
        }));
    }, [state]);
    return (_jsxs("div", __assign({ className: "h5p-editor", style: { height: height } }, { children: [editorState.state === 'loading' && _jsx(Loader, {}, void 0),
            editorState.state === 'error' && (_jsxs("p", { children: [_jsx("pre", { children: "Error:" }, void 0), " ", editorState.error] }, void 0)),
            src && _jsx("iframe", { ref: iFrameRef, title: "editor", src: src }, void 0)] }), void 0));
};
export default Editor;
