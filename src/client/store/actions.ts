// Action creators for triggering sagas
export const fetchChannels = () => ({
  type: 'channels/fetchChannelsStart',
});

export const fetchCountries = () => ({
  type: 'channels/fetchCountriesStart',
});

export const fetchCategories = () => ({
  type: 'channels/fetchCategoriesStart',
});