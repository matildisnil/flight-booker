import {createSlice} from "@reduxjs/toolkit";
import { IResponseData } from '../../types'

const initialState:IResponseData = { outboundTrip: { itineraries: [], message: '' }, returnTrip: { itineraries: [], message: '' }, passengers: { adults: null, children: null }, message: '' };

export const responseDataSlice = createSlice({
    name: "responseData",
    initialState,
    reducers: {
        loadData: (state, action) => action.payload,
    },
})

export const { loadData } = responseDataSlice.actions;

export default responseDataSlice.reducer;