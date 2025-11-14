import { useDispatch, useSelector } from 'react-redux';
import { setFilterCountry, setFilterCategory } from '../store/slices/filtersSlice';
import { RootState } from '../store';
import InfiniteDropdown from './InfiniteDropdown';
import SearchInput from './SearchInput';
import '../styles/Header.css';

interface HeaderProps {
    countryNameMap: Record<string, string>;
    categories: string[];
}

function Header({ countryNameMap, categories }: HeaderProps) {
    const dispatch = useDispatch();
    const { filterCountry, filterCategory } = useSelector((state: RootState) => state.filters);

    // Convert country map to dropdown options
    const countryOptions = Object.entries(countryNameMap)
        .map(([code, name]) => ({
            value: code,
            label: `${name} (${code})`
        }))
        .sort((a, b) => a.label.localeCompare(b.label));

    // Convert categories to dropdown options
    const categoryOptions = categories.map(cat => ({
        value: cat,
        label: cat
    }));

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="header-title">🌍 World TV</h1>

                <div className="header-filters">
                    <div className="filter-container">
                        <InfiniteDropdown
                            options={countryOptions}
                            value={filterCountry}
                            onChange={(value) => dispatch(setFilterCountry(value))}
                            placeholder="Filter by country..."
                            className="filter-input"
                            pageSize={20}
                        />
                    </div>

                    <div className="filter-container">
                        <InfiniteDropdown
                            options={categoryOptions}
                            value={filterCategory}
                            onChange={(value) => dispatch(setFilterCategory(value))}
                            placeholder="Filter by category..."
                            className="filter-input"
                            pageSize={10}
                        />
                    </div>

                    <SearchInput />
                </div>
            </div>
        </header>
    );
}

export default Header;
