// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  personalTrainerTodayData: [],
};

// Create a slice for managing personalTrainerTodayData
const personalTrainerTodayDataSlice = createSlice({
  name: 'personalTrainerTodayData',
  initialState,
  reducers: {
    addPersonalTrainerTodayMealsEntry: (state, action) => {
      state.personalTrainerTodayData.push(action.payload);
    },
    removePersonalTrainerTodayMealsEntry: (state, action) => {
      const itemId = action.payload;
      state.personalTrainerTodayData = state.personalTrainerTodayData.filter(item => item.id !== itemId);
      // Reassign new IDs to the remaining items
      state.personalTrainerTodayData = state.personalTrainerTodayData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));
    },
    // Add other reducers as needed
  },
});



// Export the actions
export const { addPersonalTrainerTodayMealsEntry, removePersonalTrainerTodayMealsEntry } = personalTrainerTodayDataSlice.actions;
export default personalTrainerTodayDataSlice.reducer;
