"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const Header_1 = __importDefault(require("./Header"));
const Sidebar_1 = __importDefault(require("./Sidebar"));
const Player_1 = __importDefault(require("./Player"));
const actions_1 = require("../store/actions");
const filtersSlice_1 = require("../store/slices/filtersSlice");
require("../styles/App.css");
function App() {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { channels, countries, categories, loading } = (0, react_redux_1.useSelector)((state) => state.channels);
    const { filterCountry, filterCategory, searchQuery, currentPage, pageSize } = (0, react_redux_1.useSelector)((state) => state.filters);
    const [selectedChannel, setSelectedChannel] = (0, react_1.useState)(null);
    // Load data on component mount
    (0, react_1.useEffect)(() => {
        dispatch((0, actions_1.fetchChannels)());
        dispatch((0, actions_1.fetchCountries)());
        dispatch((0, actions_1.fetchCategories)());
    }, [dispatch]);
    // Create country name map
    const countryNameMap = (0, react_1.useMemo)(() => {
        const map = {};
        countries.forEach((country) => {
            map[country.code] = country.name;
        });
        return map;
    }, [countries]);
    // Extract unique groups from channels
    const groups = (0, react_1.useMemo)(() => {
        const groupSet = new Set();
        channels.forEach((ch) => {
            if (ch.groupTitle)
                groupSet.add(ch.groupTitle);
        });
        return Array.from(groupSet).sort();
    }, [channels]);
    // Filter channels
    const filteredChannels = (0, react_1.useMemo)(() => {
        return channels.filter((ch) => {
            const matchCountry = !filterCountry || ch.countryCode === filterCountry;
            const matchCategory = !filterCategory || ch.categories?.includes(filterCategory);
            const matchSearch = !searchQuery ||
                ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ch.groupTitle?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCountry && matchCategory && matchSearch;
        });
    }, [channels, filterCountry, filterCategory, searchQuery]);
    // Paginate channels
    const paginatedChannels = (0, react_1.useMemo)(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredChannels.slice(start, end);
    }, [filteredChannels, currentPage, pageSize]);
    const totalPages = Math.ceil(filteredChannels.length / pageSize);
    // Page change handler
    const handlePageChange = (page) => {
        dispatch((0, filtersSlice_1.setCurrentPage)(page));
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsxs)("div", { className: "app-loading", children: [(0, jsx_runtime_1.jsx)("div", { className: "spinner" }), (0, jsx_runtime_1.jsx)("p", { children: "Loading channels..." })] }));
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)(Header_1.default, { countryNameMap: countryNameMap, categories: categories }), (0, jsx_runtime_1.jsxs)("div", { className: "main-container", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, { channels: paginatedChannels, selectedChannel: selectedChannel, setSelectedChannel: setSelectedChannel, filteredCount: filteredChannels.length, currentPage: currentPage, totalPages: totalPages, onPageChange: handlePageChange, channelCount: channels.length, groupCount: groups.length }), (0, jsx_runtime_1.jsx)(Player_1.default, { channel: selectedChannel })] })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map