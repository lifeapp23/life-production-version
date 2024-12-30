// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
publicPlansData: [],
};


// Create a slice for managing publicPlansData
const publicPlansDataSlice = createSlice({
    name: 'publicPlansData',
    initialState,
    reducers: {
        addPlansEntry: (state, action) => {
        state.publicPlansData.push(action.payload);
        },
        removePlansEntry: (state, action) => {
        const itemId = action.payload;
        state.publicPlansData = state.publicPlansData.filter(item => item.id !== itemId);
        // Reassign new IDs to the remaining items
        state.publicPlansData = state.publicPlansData.map((item, index) => ({
            ...item,
            id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
        }));
        },
        editPlansEntry:(state, action)=>{
        const { id, updatedData } = action.payload;
        const index = state.publicPlansData.findIndex(item => item.id === id);

        if (index !== -1) {
            state.publicPlansData[index] = { ...state.publicPlansData[index], ...updatedData };
        }
        },
        addDayToPlanInRedux: (state, action) => {
          const { id, newDay } = action.payload;
          const planIndex = state.publicPlansData.findIndex(plan => plan.id === id);

          if (planIndex !== -1) {
            state.publicPlansData[planIndex].days.push(newDay);
          }
        },
        deleteDayFromPlanInRedux: (state, action) => {
          const { planIdRowConId, viewId } = action.payload;
        
          const planIndex = state.publicPlansData.findIndex(plan => plan.id === planIdRowConId);
        
          if (planIndex !== -1) {
            // Filter out the deleted day
            state.publicPlansData[planIndex].days = state.publicPlansData[planIndex].days.filter(day => day.id !== viewId);
        
            // Reassign new IDs to the remaining days
            state.publicPlansData[planIndex].days = state.publicPlansData[planIndex].days.map((day, index) => ({
              ...day,
              id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
            }));
          }
        },
        // Update the day in redux by adding selected exercises and sets
        updateDayInRedux: (state, action) => {
          const { planId, updatedDay } = action.payload;
          
          // Find the plan in the state
          const planIndex = state.publicPlansData.findIndex((plan) => plan.id === planId);

          if (planIndex !== -1) {
            // Find the day in the plan and update it
            const dayIndex = state.publicPlansData[planIndex].days.findIndex((day) => day.id === updatedDay.id);
            if (dayIndex !== -1) {
              // Add the selected exercises and sets to the current day
               const currentDay = state.publicPlansData[planIndex].days[dayIndex];
               const { totalSets, totalExercises, selectedExerciseRows } = currentDay;
              
              // Add selected exercises and sets to the current day
              const updatedSets = updatedDay.totalSets;
              const updatedExercises = updatedDay.totalExercises;
              const updatedSelectedExercises = updatedDay.selectedExerciseRows;

              state.publicPlansData[planIndex].days[dayIndex] = {
                id: updatedDay.id,
                dayName: updatedDay.dayName,
                totalSets: updatedSets,
                totalExercises: updatedExercises,
                totalExpectedTime : updatedDay.totalExpectedTime,
                selectedExerciseRows: updatedSelectedExercises,
              };

            }
          }
        },

        
        // Add other reducers as needed
    },
});


// Export the actions
export const { addPlansEntry,removePlansEntry,editPlansEntry,addDayToPlanInRedux,deleteDayFromPlanInRedux,updateDayInRedux} = publicPlansDataSlice.actions;
export default publicPlansDataSlice.reducer;
