"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rootSaga;
const effects_1 = require("redux-saga/effects");
const channelsSagas_1 = __importDefault(require("./sagas/channelsSagas"));
function* rootSaga() {
    yield (0, effects_1.all)([
        (0, channelsSagas_1.default)(),
    ]);
}
//# sourceMappingURL=sagas.js.map