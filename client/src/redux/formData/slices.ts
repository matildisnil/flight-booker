import {createSlice} from "@reduxjs/toolkit";
import { IFormattedFormData } from "../../types";

const initialState: IFormattedFormData = { 
  origin: '',
  destination: '',
  returnTrip: false,
  numberOfAdults: '1',
  numberOfChildren: '0',
  formattedDepartureDate: '',
  formattedReturnDate: '' 
};

export const formDataSlice = createSlice({
    name: "formData",
    initialState,
    reducers: {
        submitFormData: (state, action) => action.payload,
    },
})

export const { submitFormData } = formDataSlice.actions;
export default formDataSlice.reducer;