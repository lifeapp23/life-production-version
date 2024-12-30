// selectedItems.js
import { createSlice } from '@reduxjs/toolkit';

const trainerSelectedWorkoutsDataSlice = createSlice({
  name: 'trainerSelectedWorkoutsData',
  initialState: [],
  reducers: {
    toggleTrainerSelectedWorkoutsDataSelection: (state, action) => {
      const index = action.payload;
      const indexOfIndex = state.indexOf(index);
      if (indexOfIndex !== -1) {
        state.splice(indexOfIndex, 1); // Remove item if already selected
      } else {
        state.push(index); // Add item if not selected
      }
    },
    clearTrainerSelectedWorkoutsData: (state) => {
      state.splice(0, state.length); // Clear all selected items
    },
  },
});

export const { toggleTrainerSelectedWorkoutsDataSelection, clearTrainerSelectedWorkoutsData } = trainerSelectedWorkoutsDataSlice.actions;
export default trainerSelectedWorkoutsDataSlice.reducer;