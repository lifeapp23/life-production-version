// selectedItems.js
import { createSlice } from '@reduxjs/toolkit';

const selectedPublicWorkoutsDataSlice = createSlice({
  name: 'selectedPublicWorkoutsData',
  initialState: [],
  reducers: {
    togglePublicWorkoutsDataSelection: (state, action) => {
      const index = action.payload;
      const indexOfIndex = state.indexOf(index);
      if (indexOfIndex !== -1) {
        state.splice(indexOfIndex, 1); // Remove item if already selected
      } else {
        state.push(index); // Add item if not selected
      }
    },
    clearSelectedPublicWorkoutsData: (state) => {
      state.splice(0, state.length); // Clear all selected items
    },
  },
});

export const { togglePublicWorkoutsDataSelection, clearSelectedPublicWorkoutsData } = selectedPublicWorkoutsDataSlice.actions;
export default selectedPublicWorkoutsDataSlice.reducer;