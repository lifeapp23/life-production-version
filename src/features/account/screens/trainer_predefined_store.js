// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  trainerPredefinedData: [
    { id: 1, name: "baked beans", protein: 0.06, fats: 0.05, carbs: 0.22, calories: 1.55 },
    { id: 2, name: "hot dogs", protein: 0.01, fats: 0.26, carbs: 0.042, calories: 2.9 },
    { id: 3, name: "refried beans", protein: 0.05, fats: 0.012, carbs: 0.15, calories: 0.92 },
    { id: 4, name: "corned beef", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
    { id: 5, name: "corned meat", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
  ],
};

// Create a slice for managing trainerPredefinedData
const trainerPredefinedDataSlice = createSlice({
  name: 'trainerPredefinedData',
  initialState,
  reducers: {
    addEntry: (state, action) => {
      state.trainerPredefinedData.push(action.payload);
    },
    removeEntry: (state, action) => {
      const itemId = action.payload;
      state.trainerPredefinedData = state.trainerPredefinedData.filter(item => item.id !== itemId);
      // Reassign new IDs to the remaining items
      state.trainerPredefinedData = state.trainerPredefinedData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));
    },
    // Add other reducers as needed
  },
});



// Export the actions
export const { addEntry, removeEntry } = trainerPredefinedDataSlice.actions;
export default trainerPredefinedDataSlice.reducer;