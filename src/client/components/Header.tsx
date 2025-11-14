import { useDispatch, useSelector } from 'react-redux';
import { setFilterCountry, setFilterCategory, setSearchQuery } from '../store/slices/filtersSlice';
import { RootState } from '../store';
import '../styles/Header.css';

interface HeaderProps {
    countryNameMap: Record<string, string>;
    categories: string[];
}

function Header({ countryNameMap, categories }: HeaderProps) {
    const dispatch = useDispatch();
    const { filterCountry, filterCategory, searchQuery } = useSelector((state: RootState) => state.filters);
    const countryOptions = Object.entries(countryNameMap)
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.code.localeCompare(b.code));

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">🌍 World TV</h1>
                
                <div className="header-filters">
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Filter by country..."
                            value={filterCountry}
                            onChange={(e) => dispatch(setFilterCountry((e.target as HTMLInputElement).value))}
                            className="filter-input"
                            list="country-list"
                        />
                        <datalist id="country-list">
                            <option value="" />
                            {countryOptions.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.name} ({country.code})
                                </option>
                            ))}
                        </datalist>
                    </div>

                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Filter by category..."
                            value={filterCategory}
                            onChange={(e) => dispatch(setFilterCategory((e.target as HTMLInputElement).value))}
                            className="filter-input"
                            list="category-list"
                        />
                        <datalist id="category-list">
                            <option value="" />
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </datalist>
                    </div>

                    <input
                        type="text"
                        placeholder="Search channels..."
                        value={searchQuery}
                        onChange={(e) => dispatch(setSearchQuery((e.target as HTMLInputElement).value))}
                        className="search-input"
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;
