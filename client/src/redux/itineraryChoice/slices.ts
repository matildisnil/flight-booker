import {createSlice} from "@reduxjs/toolkit";
import { ISelectedTrip } from "../../types";

const initialState: ISelectedTrip = { outboundTripIndex: null, returnTripIndex: null };

export const itineraryChoiceSlice = createSlice({
    name: "itineraryChoice",
    initialState,
    reducers: {
        chooseItinerary: (state, action) => {
          if(action.payload.direction === "outboundTripIndex"){
            state.outboundTripIndex = action.payload.index;
          } else if(action.payload.direction === "returnTripIndex") {
            state.returnTripIndex = action.payload.index;
          }
        },
        resetItineraryChoice: (state) => {
          return initialState;
        }
        // chooseReturnItinerary: (state, action) => {
        //   state.returnTripIndex = action.payload;
        // }
    },
})

export const { chooseItinerary, resetItineraryChoice } = itineraryChoiceSlice.actions;
export default itineraryChoiceSlice.reducer;