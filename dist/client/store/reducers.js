"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootReducer = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const channelsSlice_1 = __importDefault(require("./slices/channelsSlice"));
const filtersSlice_1 = __importDefault(require("./slices/filtersSlice"));
exports.rootReducer = (0, toolkit_1.combineReducers)({
    channels: channelsSlice_1.default,
    filters: filtersSlice_1.default,
});
//# sourceMappingURL=reducers.js.map