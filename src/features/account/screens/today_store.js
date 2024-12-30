// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  predefinedTodayData: [],
};

// Create a slice for managing predefinedData
const predefinedTodayDataSlice = createSlice({
  name: 'predefinedTodayData',
  initialState,
  reducers: {
    addTodayMealsEntry: (state, action) => {
      state.predefinedTodayData.push(action.payload);
    },
    removeTodayMealsEntry: (state, action) => {
      const itemId = action.payload;
      state.predefinedTodayData = state.predefinedTodayData.filter(item => item.id !== itemId);
      // Reassign new IDs to the remaining items
      state.predefinedTodayData = state.predefinedTodayData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));
    },
    // Add other reducers as needed
  },
});



// Export the actions
export const { addTodayMealsEntry, removeTodayMealsEntry } = predefinedTodayDataSlice.actions;
export default predefinedTodayDataSlice.reducer;
