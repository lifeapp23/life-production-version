// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  trainerTraineeStartExercisesWithTimerData: {},
  workedExercisesSentToCalendar: {},
  workedExerciseSentToCalendarId: 0,
};

// Create a slice for managing predefinedData
const trainerTraineeStartExercisesWithTimerDataSlice = createSlice({
  name: 'trainerTraineeStartExercisesWithTimerData',
  initialState,
  reducers: {
    updateSet: (state, action) => {
      const { speKey, workedExercises, activeWorkoutId} = action.payload;
      //console.log('workedExercises updateSet',workedExercises);

      // Check if the array already exists based on the provided speKey
      if (!state.trainerTraineeStartExercisesWithTimerData[speKey]) {
        // If speKey doesn't exist, create a new entry with an empty object for workedExercises
        state.trainerTraineeStartExercisesWithTimerData[speKey] = {
          workedExercises: {}
        };
      }
      
      // Now that speKey exists, check if activeWorkoutId exists under workedExercises
      if (!state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId]) {
        // If activeWorkoutId doesn't exist, create a new array for it
        state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId] = [];
      }

      // Find the index of the set with the matching setId
      const setIndex = state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId].findIndex((set) => set.sets === workedExercises.sets);

      // If the set exists, update it, otherwise add a new set
      if (setIndex !== -1) {
        state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId][setIndex] = {
          ...state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId][setIndex],
          userId:workedExercises.userId,
          plnKey:workedExercises.plnKey,
          speKey:workedExercises.speKey,
          dayNam:workedExercises.dayNam,
          date:workedExercises.date,
          wrkKey:workedExercises.wrkKey,
          wktNam:workedExercises.wktNam,
          sets:workedExercises.sets,
          isCmpld:workedExercises.isCmpld,
          timStd:workedExercises.timStd,
          weight:workedExercises.weight,
          reps:workedExercises.reps,
          casTim:workedExercises.casTim
        };
      } else {
        state.trainerTraineeStartExercisesWithTimerData[speKey].workedExercises[activeWorkoutId].push({
          userId:workedExercises.userId,
          plnKey:workedExercises.plnKey,
          speKey:workedExercises.speKey,
          dayNam:workedExercises.dayNam,
          date:workedExercises.date,
          wrkKey:workedExercises.wrkKey,
          wktNam:workedExercises.wktNam,
          sets:workedExercises.sets,
          isCmpld:workedExercises.isCmpld,
          timStd:workedExercises.timStd,
          weight:workedExercises.weight,
          reps:workedExercises.reps,
          casTim:workedExercises.casTim
        });
      }
    },
    updateCompletedExercises: (state, action) => {
      const { speKey, workedExercises, activeWorkoutId} = action.payload;
      //console.log('workedExercises updateCompletedExercises',workedExercises);

      // Empty trainerTraineeStartExercisesWithTimerData
      state.trainerTraineeStartExercisesWithTimerData[speKey] = {
        workedExercises: {}
      };

      // Push new data into trainerTraineeStartExercisesWithTimerData
      state.trainerTraineeStartExercisesWithTimerData[speKey] = {
        workedExercises:  workedExercises
      };
      // state.trainerTraineeStartExercisesWithTimerData[speKey].push({
      //   workedExercises: workedExercises,
      // });

    },
    updateDayTim: (state, action) => {
      const { speKey, workedExercises} = action.payload;
//console.log('workedExercises updateDayTim',workedExercises[speKey].workedExercises);
      // Empty trainerTraineeStartExercisesWithTimerData
      state.trainerTraineeStartExercisesWithTimerData[speKey] = {
        workedExercises: {}
      };

      // Push new data into trainerTraineeStartExercisesWithTimerData
      state.trainerTraineeStartExercisesWithTimerData[speKey] = {
        workedExercises:  workedExercises[speKey].workedExercises
      };
      // state.trainerTraineeStartExercisesWithTimerData[speKey].push({
      //   workedExercises: workedExercises,
      // });

    },
    // Add a new action for updating the new array
    deleteKeyObject: (state, action) => {
      const { speKey} = action.payload;
      //console.log('state.trainerTraineeStartExercisesWithTimerData speKey',speKey);
      delete state.trainerTraineeStartExercisesWithTimerData[speKey];
      //console.log('state.trainerTraineeStartExercisesWithTimerData',state.trainerTraineeStartExercisesWithTimerData);
    },
  },
});

// Export the actions
export const { updateSet,updateCompletedExercises,updateDayTim,deleteKeyObject } = trainerTraineeStartExercisesWithTimerDataSlice.actions;
export default trainerTraineeStartExercisesWithTimerDataSlice.reducer;
