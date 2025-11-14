"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChannels = useChannels;
exports.useCountries = useCountries;
exports.useCategories = useCategories;
const react_1 = require("react");
const ApiService_1 = __importDefault(require("../services/ApiService"));
/**
 * Hook for fetching channels
 */
function useChannels() {
    const [channels, setChannels] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadChannels = async () => {
            try {
                setLoading(true);
                const response = await ApiService_1.default.fetchChannels(1, 10000);
                setChannels(response.data || []);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load channels');
            }
            finally {
                setLoading(false);
            }
        };
        loadChannels();
    }, []);
    return { channels, loading, error };
}
/**
 * Hook for fetching countries
 */
function useCountries() {
    const [countries, setCountries] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadCountries = async () => {
            try {
                setLoading(true);
                const data = await ApiService_1.default.fetchCountries();
                setCountries(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load countries');
            }
            finally {
                setLoading(false);
            }
        };
        loadCountries();
    }, []);
    return { countries, loading, error };
}
/**
 * Hook for fetching categories
 */
function useCategories() {
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await ApiService_1.default.fetchCategories();
                setCategories(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load categories');
            }
            finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);
    return { categories, loading, error };
}
//# sourceMappingURL=useApi.js.map