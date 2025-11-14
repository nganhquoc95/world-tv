import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  filterCountry: '',
  filterCategory: '',
  searchQuery: '',
  currentPage: 1,
  pageSize: 50,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilterCountry: (state, action: PayloadAction<string>) => {
      state.filterCountry = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when search changes
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    resetFilters: (state) => {
      state.filterCountry = '';
      state.filterCategory = '';
      state.searchQuery = '';
      state.currentPage = 1;
    },
  },
});

export const {
  setFilterCountry,
  setFilterCategory,
  setSearchQuery,
  setCurrentPage,
  setPageSize,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;