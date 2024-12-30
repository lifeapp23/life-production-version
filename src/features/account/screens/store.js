import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './selectedItems';
import predefinedDataReducer from './predefined_store';
import trainerSelectedMealsReducer from './trainer_selected_meals';
import trainerPredefinedDataReducer from './trainer_predefined_store';
import predefinedTodayDataReducer from './today_store';
import personalTrainerTodayDataReducer from './personal_trainer_today_store';
import plansDataReducer from './trainer_manage_workouts';
import trainerMealsPlansDataReducer from './trainer_manage_meals';
import publicPlansDataReducer from './public_manage_workouts';
import selectedPublicWorkoutsDataReducer from './selected_public_workouts_data';
import trainerSelectedWorkoutsDataReducer from './trainer_selected_workouts_data';
import trainerTraineeStartExercisesWithTimerDataReducer from './trainer_trainee_start_exer_with_timer_store';

import startExercisesWithTimerDataReducer from './start_exer_with_timer_store';


import {
  predefinedTrainerPricingReducer,
  discountDataReducer,
} from './trainer_pricing_store';
const middlewares = [];

if (process.env.NODE_ENV === 'development') {
  // Add the middleware only in development
  const { createLogger } = require('redux-logger');
  const logger = createLogger();
  middlewares.push(logger);
}
// Configure the Redux store
const store = configureStore({
    reducer: {
      predefinedData: predefinedDataReducer,
      selectedItems: selectedItemsReducer,
      predefinedTodayData: predefinedTodayDataReducer,
      personalTrainerTodayData:personalTrainerTodayDataReducer,
      predefinedTrainerPricingData: predefinedTrainerPricingReducer,
      plansData: plansDataReducer,
      discountData: discountDataReducer,
      trainerPredefinedData: trainerPredefinedDataReducer,
      trainerSelectedMeals: trainerSelectedMealsReducer,
      trainerMealsPlansData: trainerMealsPlansDataReducer,
      publicPlansData: publicPlansDataReducer,
      selectedPublicWorkoutsData: selectedPublicWorkoutsDataReducer,
      trainerSelectedWorkoutsData: trainerSelectedWorkoutsDataReducer,
      startExercisesWithTimerData:startExercisesWithTimerDataReducer,
      trainerTraineeStartExercisesWithTimerData:trainerTraineeStartExercisesWithTimerDataReducer

      // Add other reducers as needed
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
  // Add other store configurations as needed
  });
export default store;
