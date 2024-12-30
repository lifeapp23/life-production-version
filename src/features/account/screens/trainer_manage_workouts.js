// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
plansData: [
    
  ],
};


// Create a slice for managing plansData
const plansDataSlice = createSlice({
    name: 'plansData',
    initialState,
    reducers: {
        addPlansEntry: (state, action) => {
        state.plansData.push(action.payload);
        },
        removePlansEntry: (state, action) => {
        const itemId = action.payload;
        state.plansData = state.plansData.filter(item => item.id !== itemId);
        // Reassign new IDs to the remaining items
        state.plansData = state.plansData.map((item, index) => ({
            ...item,
            id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
        }));
        },
        editPlansEntry:(state, action)=>{
        const { id, updatedData } = action.payload;
        const index = state.plansData.findIndex(item => item.id === id);

        if (index !== -1) {
            state.plansData[index] = { ...state.plansData[index], ...updatedData };
        }
        },
        addDayToPlanInRedux: (state, action) => {
          const { id, newDay } = action.payload;
          const planIndex = state.plansData.findIndex(plan => plan.id === id);

          if (planIndex !== -1) {
            state.plansData[planIndex].days.push(newDay);
          }
        },
        deleteDayFromPlanInRedux: (state, action) => {
          const { planIdRowConId, viewId } = action.payload;
        
          const planIndex = state.plansData.findIndex(plan => plan.id === planIdRowConId);
        
          if (planIndex !== -1) {
            // Filter out the deleted day
            state.plansData[planIndex].days = state.plansData[planIndex].days.filter(day => day.id !== viewId);
        
            // Reassign new IDs to the remaining days
            state.plansData[planIndex].days = state.plansData[planIndex].days.map((day, index) => ({
              ...day,
              id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
            }));
          }
        },
        // Update the day in redux by adding selected exercises and sets
        updateDayInRedux: (state, action) => {
          const { planId, updatedDay } = action.payload;
          
          // Find the plan in the state
          const planIndex = state.plansData.findIndex((plan) => plan.id === planId);

          if (planIndex !== -1) {
            // Find the day in the plan and update it
            const dayIndex = state.plansData[planIndex].days.findIndex((day) => day.id === updatedDay.id);
            if (dayIndex !== -1) {
              // Add the selected exercises and sets to the current day
               const currentDay = state.plansData[planIndex].days[dayIndex];
               const { totalSets, totalExercises, selectedExerciseRows } = currentDay;
              
              // Add selected exercises and sets to the current day
              const updatedSets = updatedDay.totalSets;
              const updatedExercises = updatedDay.totalExercises;
              const updatedSelectedExercises = updatedDay.selectedExerciseRows;

              state.plansData[planIndex].days[dayIndex] = {
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
export const { addPlansEntry,removePlansEntry,editPlansEntry,addDayToPlanInRedux,deleteDayFromPlanInRedux,updateDayInRedux} = plansDataSlice.actions;
export default plansDataSlice.reducer;
