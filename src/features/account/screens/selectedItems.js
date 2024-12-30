// selectedItems.js
import { createSlice } from '@reduxjs/toolkit';

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState: [],
  reducers: {
    toggleItemSelection: (state, action) => {
      const itemId = action.payload;
      const index = state.indexOf(itemId);
      if (index !== -1) {
        state.splice(index, 1); // Remove item if already selected
      } else {
        state.push(itemId); // Add item if not selected
      }
    },
    clearSelectedItems: (state) => {
      state.splice(0, state.length); // Clear all selected items
    },
  },
});

export const { toggleItemSelection, clearSelectedItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;