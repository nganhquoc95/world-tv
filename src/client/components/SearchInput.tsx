import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '../store/slices/filtersSlice';
import { RootState } from '../store';
import '../styles/Header.css';

function SearchInput() {
    const dispatch = useDispatch();
    const { searchQuery } = useSelector((state: RootState) => state.filters);

    return (
        <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery((e.target as HTMLInputElement).value))}
            className="search-input"
        />
    );
}

export default SearchInput;