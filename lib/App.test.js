var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "react/jsx-runtime", "@testing-library/react", "./App"], function (require, exports, jsx_runtime_1, react_1, App_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    App_1 = __importDefault(App_1);
    test('renders learn react link', function () {
        react_1.render(jsx_runtime_1.jsx(App_1.default, {}, void 0));
        var linkElement = react_1.screen.getByText(/learn react/i);
        expect(linkElement).toBeInTheDocument();
    });
});
