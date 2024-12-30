// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  predefinedTrainerPricingData: [
  { id: 1, currency: 'USD', pricing: "100.00" },

],
discountData: [
    { id: 1, discountPercent: "10%", startDate: '2023-12-01', endDate: '2024-01-15' },
  ],
};

// Create a slice for managing predefinedData
const predefinedTrainerPricingDataSlice = createSlice({
  name: 'predefinedTrainerPricingData',
  initialState,
  reducers: {
    addTrainerPricingEntry: (state, action) => {
      state.predefinedTrainerPricingData.push(action.payload);
    },
    removeTrainerPricingEntry: (state, action) => {
      const itemId = action.payload;
      state.predefinedTrainerPricingData = state.predefinedTrainerPricingData.filter(item => item.id !== itemId);
      // Reassign new IDs to the remaining items
      state.predefinedTrainerPricingData = state.predefinedTrainerPricingData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));
    },
    editTrainerPricingEntry:(state, action)=>{
      const { id, updatedData } = action.payload;
      const index = state.predefinedTrainerPricingData.findIndex(item => item.id === id);

      if (index !== -1) {
        state.predefinedTrainerPricingData[index] = { ...state.predefinedTrainerPricingData[index], ...updatedData };
      }
    },
    // Add other reducers as needed
  },
});
// Create a slice for managing discountData
const discountDataSlice = createSlice({
    name: 'discountData',
    initialState,
    reducers: {
      addDiscountEntry: (state, action) => {
        state.discountData.push(action.payload);
      },
      removeDiscountEntry: (state, action) => {
        const itemId = action.payload;
        state.discountData = state.discountData.filter(item => item.id !== itemId);
        // Reassign new IDs to the remaining items
        state.discountData = state.discountData.map((item, index) => ({
          ...item,
          id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
        }));
      },
      editDiscountEntry:(state, action)=>{
        const { id, updatedData } = action.payload;
        const index = state.discountData.findIndex(item => item.id === id);
  
        if (index !== -1) {
          state.discountData[index] = { ...state.discountData[index], ...updatedData };
        }
      },
      // Add other reducers as needed
    },
  });
  


// Export the actions
export const { addTrainerPricingEntry, removeTrainerPricingEntry,editTrainerPricingEntry } = predefinedTrainerPricingDataSlice.actions;
export const { addDiscountEntry,removeDiscountEntry,editDiscountEntry} = discountDataSlice.actions;
export const predefinedTrainerPricingReducer = predefinedTrainerPricingDataSlice.reducer;
export const discountDataReducer = discountDataSlice.reducer;
