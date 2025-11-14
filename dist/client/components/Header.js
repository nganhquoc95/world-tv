"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_redux_1 = require("react-redux");
const filtersSlice_1 = require("../store/slices/filtersSlice");
require("../styles/Header.css");
function Header({ countryNameMap, categories }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { filterCountry, filterCategory, searchQuery } = (0, react_redux_1.useSelector)((state) => state.filters);
    const countryOptions = Object.entries(countryNameMap)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.code.localeCompare(b.code));
    return ((0, jsx_runtime_1.jsx)("header", { className: "header", children: (0, jsx_runtime_1.jsxs)("div", { className: "header-content", children: [(0, jsx_runtime_1.jsx)("h1", { className: "header-title", children: "\uD83C\uDF0D World TV" }), (0, jsx_runtime_1.jsxs)("div", { className: "header-filters", children: [(0, jsx_runtime_1.jsxs)("div", { className: "filter-container", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Filter by country...", value: filterCountry, onChange: (e) => dispatch((0, filtersSlice_1.setFilterCountry)(e.target.value)), className: "filter-input", list: "country-list" }), (0, jsx_runtime_1.jsxs)("datalist", { id: "country-list", children: [(0, jsx_runtime_1.jsx)("option", { value: "" }), countryOptions.map(country => ((0, jsx_runtime_1.jsxs)("option", { value: country.code, children: [country.name, " (", country.code, ")"] }, country.code)))] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "filter-container", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Filter by category...", value: filterCategory, onChange: (e) => dispatch((0, filtersSlice_1.setFilterCategory)(e.target.value)), className: "filter-input", list: "category-list" }), (0, jsx_runtime_1.jsxs)("datalist", { id: "category-list", children: [(0, jsx_runtime_1.jsx)("option", { value: "" }), categories.map(cat => ((0, jsx_runtime_1.jsx)("option", { value: cat, children: cat }, cat)))] })] }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search channels...", value: searchQuery, onChange: (e) => dispatch((0, filtersSlice_1.setSearchQuery)(e.target.value)), className: "search-input" })] })] }) }));
}
exports.default = Header;
//# sourceMappingURL=Header.js.map