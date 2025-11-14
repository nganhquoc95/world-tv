import React from 'react';
import '../styles/Header.css';

interface HeaderProps {
    countryNameMap: Record<string, string>;
    filterCountry: string;
    setFilterCountry: (country: string) => void;
    filterCategory: string;
    setFilterCategory: (category: string) => void;
    categories: string[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

function Header({
    countryNameMap,
    filterCountry,
    setFilterCountry,
    filterCategory,
    setFilterCategory,
    categories,
    searchQuery,
    setSearchQuery
}: HeaderProps) {
    const countryOptions = Object.entries(countryNameMap)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.code.localeCompare(b.code));

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">🌍 World TV</h1>
                
                <div className="header-filters">
                    <select
                        value={filterCountry}
                        onChange={(e) => {
                            setFilterCountry(e.target.value);
                        }}
                        className="filter-select"
                    >
                        <option value="">All Countries</option>
                        {countryOptions.map(country => (
                            <option key={country.code} value={country.code}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;
