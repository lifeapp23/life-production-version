// redux/store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
  startExercisesWithTimerData: {},
  workedExercisesSentToCalendar: {},
  workedExerciseSentToCalendarId: 0,
};

// Create a slice for managing predefinedData
const startExercisesWithTimerDataSlice = createSlice({
  name: 'startExercisesWithTimerData',
  initialState,
  reducers: {
    updateSet: (state, action) => {
      const { dayKey, workedExercises, activeWorkoutId} = action.payload;
      ////console.log('workedExercises updateSet',workedExercises);

      // Check if the array already exists based on the provided dayKey
      if (!state.startExercisesWithTimerData[dayKey]) {
        // If dayKey doesn't exist, create a new entry with an empty object for workedExercises
        state.startExercisesWithTimerData[dayKey] = {
          workedExercises: {}
        };
      }
      
      // Now that dayKey exists, check if activeWorkoutId exists under workedExercises
      if (!state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId]) {
        // If activeWorkoutId doesn't exist, create a new array for it
        state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId] = [];
      }

      // Find the index of the set with the matching setId
      const setIndex = state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId].findIndex((set) => set.sets === workedExercises.sets);

      // If the set exists, update it, otherwise add a new set
      if (setIndex !== -1) {
        state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId][setIndex] = {
          ...state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId][setIndex],
          userId:workedExercises.userId,
          plnKey:workedExercises.plnKey,
          dayKey:workedExercises.dayKey,
          dayName:workedExercises.dayName,
          date:workedExercises.date,
          wrkKey:workedExercises.wrkKey,
          wktNam:workedExercises.wktNam,
          sets:workedExercises.sets,
          isCompleted:workedExercises.isCompleted,
          timerStarted:workedExercises.timerStarted,
          weight:workedExercises.weight,
          reps:workedExercises.reps,
          casTim:workedExercises.casTim,
          exrTyp:workedExercises.exrTyp,
          exrTim:workedExercises.exrTim,
          images:workedExercises.images,
          deleted:'no',
          isSync:'no'
        };
      } else {
        state.startExercisesWithTimerData[dayKey].workedExercises[activeWorkoutId].push({
          userId:workedExercises.userId,
          plnKey:workedExercises.plnKey,
          dayKey:workedExercises.dayKey,
          dayName:workedExercises.dayName,
          date:workedExercises.date,
          wrkKey:workedExercises.wrkKey,
          wktNam:workedExercises.wktNam,
          sets:workedExercises.sets,
          isCompleted:workedExercises.isCompleted,
          timerStarted:workedExercises.timerStarted,
          weight:workedExercises.weight,
          reps:workedExercises.reps,
          casTim:workedExercises.casTim,
          exrTyp:workedExercises.exrTyp,
          exrTim:workedExercises.exrTim,
          images:workedExercises.images,
          deleted:'no',
          isSync:'no'
        });
      }
    },
    updateCompletedExercises: (state, action) => {
      const { dayKey, workedExercises, activeWorkoutId} = action.payload;
      ////console.log('workedExercises updateCompletedExercises',workedExercises);

      // Empty startExercisesWithTimerData
      state.startExercisesWithTimerData[dayKey] = {
        workedExercises: {}
      };

      // Push new data into startExercisesWithTimerData
      state.startExercisesWithTimerData[dayKey] = {
        workedExercises:  workedExercises
      };
      // state.startExercisesWithTimerData[dayKey].push({
      //   workedExercises: workedExercises,
      // });

    },
    updateDayTim: (state, action) => {
      const { dayKey, workedExercises} = action.payload;
////console.log('workedExercises updateDayTim',workedExercises[dayKey].workedExercises);
      // Empty startExercisesWithTimerData
      state.startExercisesWithTimerData[dayKey] = {
        workedExercises: {}
      };

      // Push new data into startExercisesWithTimerData
      state.startExercisesWithTimerData[dayKey] = {
        workedExercises:  workedExercises[dayKey].workedExercises
      };
      // state.startExercisesWithTimerData[dayKey].push({
      //   workedExercises: workedExercises,
      // });

    },
    // Add a new action for updating the new array
    deleteKeyObject: (state, action) => {
      const { dayKey} = action.payload;
      //console.log('state.startExercisesWithTimerData deleteKeyObject',state.startExercisesWithTimerData);

      //console.log('state.startExercisesWithTimerData dayKey deleteKeyObject',dayKey);
      //console.log('state.state.startExercisesWithTimerData[dayKey] dayKey deleteKeyObject',state.startExercisesWithTimerData[dayKey]);

      delete state.startExercisesWithTimerData[dayKey];
      ////console.log('state.startExercisesWithTimerData',state.startExercisesWithTimerData);
    },
  },
});

// Export the actions
export const { updateSet,updateCompletedExercises,updateDayTim,deleteKeyObject } = startExercisesWithTimerDataSlice.actions;
export default startExercisesWithTimerDataSlice.reducer;
