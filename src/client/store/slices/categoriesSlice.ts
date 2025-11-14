import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CategoriesStateType = {
    categories: string[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoriesStateType = {
    categories: [],
    loading: false,
    error: null,
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        request: (state) => {
            state.loading = true;
            state.error = null;
        },
        success: (state, action: PayloadAction<string[]>) => {
            state.categories = action.payload;
            state.loading = false;
            state.error = null;
        },
        failure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const categoriesActions = categoriesSlice.actions;

export default categoriesSlice.reducer;