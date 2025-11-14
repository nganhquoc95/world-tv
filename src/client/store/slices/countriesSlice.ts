import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICountry } from '../../types';

type CountriesStateType = {
    countries: ICountry[];
    loading: boolean;
    error: string | null;
}

const initialState: CountriesStateType = {
    countries: [],
    loading: false,
    error: null,
};

const countriesSlice = createSlice({
    name: 'countries',
    initialState,
    reducers: {
        request: (state) => {
            state.loading = true;
            state.error = null;
        },
        success: (state, action: PayloadAction<ICountry[]>) => {
            state.countries = action.payload;
            state.loading = false;
            state.error = null;
        },
        failure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const countriesActions = countriesSlice.actions;

export default countriesSlice.reducer;