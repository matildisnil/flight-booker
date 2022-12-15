import {createSlice} from "@reduxjs/toolkit";
import { IPassengerData } from "../../types";

const initialState: IPassengerData[] = [];

export const passengerDataSlice = createSlice({
    name: "passengerData",
    initialState,
    reducers: {
        submitPassengerData: (state, action) => action.payload,
        resetPassengerData: (state) => initialState,
    },
})

export const { submitPassengerData, resetPassengerData } = passengerDataSlice.actions;
export default passengerDataSlice.reducer;