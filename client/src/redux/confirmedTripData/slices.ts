import {createSlice} from "@reduxjs/toolkit";
import { IConfirmedData } from "../../types";

const initialState: IConfirmedData = { 
    outboundItinerary: null,
    returnItinerary: null,
    adultPassengers: 0,
    childPassengers: 0,
    totalPrice: '',
};

export const confirmedTripDataSlice = createSlice({
    name: "confirmedTripData",
    initialState,
    reducers: {
        confirmTripData: (state, action) => action.payload,
    },
})

export const { confirmTripData } = confirmedTripDataSlice.actions;
export default confirmedTripDataSlice.reducer;