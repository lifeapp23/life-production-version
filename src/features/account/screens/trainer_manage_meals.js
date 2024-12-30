// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  trainerMealsPlansData: [
    // {
    //   'id': '1',
    //   'name': 'Plan 1',
    //   'startDate': '2023-12-01',
    //   'endDate': '2024-01-15',
    //   'meals': [
    //     { id: 1, name: "baked beans", protein: 0.06, fats: 0.05, carbs: 0.22, calories: 1.55 },
    //     { id: 2, name: "hot dogs", protein: 0.01, fats: 0.26, carbs: 0.042, calories: 2.9 },
    //     { id: 3, name: "refried beans", protein: 0.05, fats: 0.012, carbs: 0.15, calories: 0.92 },
    //     { id: 4, name: "corned beef", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
    //     { id: 5, name: "corned meat", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
    //   ],
    // },
    // {
    //   'id': '2',
    //   'name': 'Plan 2',
    //   'startDate': '2024-01-01',
    //   'endDate': '2024-12-15',
    //   'meals': [
    //     { id: 1, name: "baked beans", protein: 0.06, fats: 0.05, carbs: 0.22, calories: 1.55 },
    //     { id: 2, name: "hot dogs", protein: 0.01, fats: 0.26, carbs: 0.042, calories: 2.9 },
    //     { id: 3, name: "refried beans", protein: 0.05, fats: 0.012, carbs: 0.15, calories: 0.92 },
    //       ],
    // },
    // // ... (up to Plan 7)
  ],
};


// Create a slice for managing plansData
const trainerMealsPlansDataSlice = createSlice({
    name: 'trainerMealsPlansData',
    initialState,
    reducers: {
        addPlansEntry: (state, action) => {
        state.trainerMealsPlansData.push(action.payload);
        },
        removePlansEntry: (state, action) => {
        const itemId = action.payload;
        state.trainerMealsPlansData = state.trainerMealsPlansData.filter(item => item.id !== itemId);
        // Reassign new IDs to the remaining items
        state.trainerMealsPlansData = state.trainerMealsPlansData.map((item, index) => ({
            ...item,
            id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
        }));
        },
        editPlansEntry:(state, action)=>{
        const { id, updatedData } = action.payload;
        const index = state.trainerMealsPlansData.findIndex(item => item.id === id);

        if (index !== -1) {
            state.trainerMealsPlansData[index] = { ...state.trainerMealsPlansData[index], ...updatedData };
        }
        },
        addMealToPlanInRedux: (state, action) => {
          const { id, newMeal } = action.payload;
          const planIndex = state.trainerMealsPlansData.findIndex(plan => plan.id === id);

          if (planIndex !== -1) {
            state.trainerMealsPlansData[planIndex].meals.push(newMeal);
          }
        },
        deleteMealFromPlanInRedux: (state, action) => {
          const { planIdRowConId, viewId } = action.payload;
        
          const planIndex = state.trainerMealsPlansData.findIndex(plan => plan.id === planIdRowConId);
        
          if (planIndex !== -1) {
            // Filter out the deleted meal
            state.trainerMealsPlansData[planIndex].meals = state.trainerMealsPlansData[planIndex].meals.filter(meal => meal.id !== viewId);
        
            // Reassign new IDs to the remaining meals
            state.trainerMealsPlansData[planIndex].meals = state.trainerMealsPlansData[planIndex].meals.map((meal, index) => ({
              ...meal,
              id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
            }));
          }
        },
        
        // Add other reducers as needed
    },
});


// Export the actions
export const { addPlansEntry,removePlansEntry,editPlansEntry,addMealToPlanInRedux,deleteMealFromPlanInRedux} = trainerMealsPlansDataSlice.actions;
export default trainerMealsPlansDataSlice.reducer;
