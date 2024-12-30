// selectedTodayMeals.js
import { createSlice } from '@reduxjs/toolkit';

const selectedTodayMealsSlice = createSlice({
  name: 'selectedTodayMeals',
  initialState: [],
  reducers: {
    toggleTodayMealsSelection: (state, action) => {
      const itemId = action.payload;
      const index = state.indexOf(itemId);
      if (index !== -1) {
        state.splice(index, 1); // Remove item if already selected
      } else {
        state.push(itemId); // Add item if not selected
      }
    },
    clearSelectedTodayMeals: (state) => {
      state.splice(0, state.length); // Clear all selected items
    },
  },
});

export const { toggleTodayMealsSelection, clearSelectedTodayMeals } = selectedTodayMealsSlice.actions;
export default selectedTodayMealsSlice.reducer;