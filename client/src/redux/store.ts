import { configureStore, combineReducers } from '@reduxjs/toolkit'
import responseDataReducer from './responseData/slices'
import itineraryChoiceReducer from './itineraryChoice/slices'
import formDataReducer from './formData/slices'
import passengerDataReducer from './passengerData/slices'
import confirmedTripDataReducer from './confirmedTripData/slices'

export const store = configureStore({
  reducer: {
    responseData: responseDataReducer,
    itineraryChoice: itineraryChoiceReducer,
    formData: formDataReducer,
    passengerData: passengerDataReducer,
    confirmedTripData: confirmedTripDataReducer,
  },
})

// const combinedReducer = combineReducers({
//   responseData: responseDataReducer,
//   itineraryChoice: itineraryChoiceReducer,
//   formData: formDataReducer,
//   passengerData: passengerDataReducer,
// });

// const rootReducer = (state: RootState, action) => {
//   if (action.type === 'USER_LOGOUT') {
//     return combinedReducer(undefined, action)
//   }
//   return combinedReducer(state, action)
// }

// export const store = configureStore({
//   reducer: rootReducer,
//   // devTools: true,
// });

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch