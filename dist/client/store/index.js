"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toolkit_1 = require("@reduxjs/toolkit");
const redux_saga_1 = __importDefault(require("redux-saga"));
const reducers_1 = require("./reducers");
const sagas_1 = __importDefault(require("./sagas"));
const sagaMiddleware = (0, redux_saga_1.default)();
const store = (0, toolkit_1.configureStore)({
    reducer: reducers_1.rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        thunk: false, // Disable thunk since we're using saga
        serializableCheck: {
            ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
});
sagaMiddleware.run(sagas_1.default);
exports.default = store;
//# sourceMappingURL=index.js.map