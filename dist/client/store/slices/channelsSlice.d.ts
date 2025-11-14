import { IChannelItem, ICountry } from '../../types';
export declare const fetchChannelsStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"channels/fetchChannelsStart">, fetchChannelsSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<IChannelItem[], "channels/fetchChannelsSuccess">, fetchChannelsFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "channels/fetchChannelsFailure">, fetchCountriesStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"channels/fetchCountriesStart">, fetchCountriesSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<ICountry[], "channels/fetchCountriesSuccess">, fetchCountriesFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "channels/fetchCountriesFailure">, fetchCategoriesStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"channels/fetchCategoriesStart">, fetchCategoriesSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<string[], "channels/fetchCategoriesSuccess">, fetchCategoriesFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "channels/fetchCategoriesFailure">;
declare const _default: import("redux").Reducer<{
    channels: IChannelItem[];
    countries: ICountry[];
    categories: string[];
    loading: boolean;
    error: string | null;
}>;
export default _default;
//# sourceMappingURL=channelsSlice.d.ts.map