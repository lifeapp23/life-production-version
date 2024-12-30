const initialState = {
publicPlansData: [
    {
      'id': '1',
      'name': 'Plan 1',
      'startDate': '2023-12-01',
      'endDate': '2024-01-15',
      'days': [
        { 'id': '1', 'dayName': 'Day 1', 'totalSets': '1', 'totalExercises': '2', 'totalExpectedTime': '3' },
        { 'id': '2', 'dayName': 'Day 2', 'totalSets': '3', 'totalExercises': '2', 'totalExpectedTime': '1' },
        // ... (up to Day 7)
      ],
    },
    {
      'id': '2',
      'name': 'Plan 2',
      'startDate': '2024-01-01',
      'endDate': '2024-12-15',
      'days': [
        { 'id': '1', 'dayName': 'Day 1', 'totalSets': '1', 'totalExercises': '2', 'totalExpectedTime': '3' },
        { 'id': '2', 'dayName': 'Day 2', 'totalSets': '3', 'totalExercises': '2', 'totalExpectedTime': '1' },
        // ... (up to Day 7)
      ],
    },
    // ... (up to Plan 7)
  ],
};
views [{"dayName": "day one", "id": 1, "selectedExerciseRows": [[Object], [Object], [Object]], "totalExercises": 3, "totalExpectedTime": "5.75", "totalSets": 9}]
//LOG  views[0].selectedExerciseRows 
[{"sets": 3 ,1,"workout": {"benchesAndRacks": "benche_one", "complexity": "easy_type", "excerciseType": "stability", "id": 1, "machines": "machine_one", "majorMuscleGroupOne": "Quadriceps", "majorMuscleGroupThree": "Calves", "majorMuscleGroupTwo": "Hamstrings", "minorMuscleGroupOne": "iliacus", "minorMuscleGroupThree": "psoas major", "minorMuscleGroupTwo": "pectineus", "weights": "5 KG", "workoutName": "STATIC LUNGE", "workoutType": "easy_type"}},
  {"sets": 4 ,2, "workout": {"benchesAndRacks": "benche_two", "complexity": "easy_type", "excerciseType": "cardio", "id": 2, "machines": "machine_one", "majorMuscleGroupOne": "Glutes", "majorMuscleGroupThree": "Calves", "majorMuscleGroupTwo": "Adductors", "minorMuscleGroupOne": "Hip Flexor", "minorMuscleGroupThree": "Sartorius", "minorMuscleGroupTwo": "Iliopsoas", "weights": "10 KG", "workoutName": "STANDING LEG CIRCLES", "workoutType": "easy_type"}}, 
  {"sets": 2 , 3,"workout": {"benchesAndRacks": "benche_three", "complexity": "easy_type", "excerciseType": "isolation", "id": 3, "machines": "machine_three", "majorMuscleGroupOne": "Quadriceps", "majorMuscleGroupThree": "Brachialis", "majorMuscleGroupTwo": "Hamstrings", "minorMuscleGroupOne": "Lats", "minorMuscleGroupThree": "psoas major", "minorMuscleGroupTwo": "Traps", "weights": "15 KG", "workoutName": "NAVY SEAL BURPEE", "workoutType": "easy_type"}}]

//   LOG  publicPlansDataTable 
  [{"days": [], "endDate": "2023-12-08", "id": 1, "name": "aaaa", "startDate": "2023-12-01"}]

  startExercisesWithTimerDataArr [{"date": "2024-02-06", "dayName": "Day one", "exerciseDetails": [[Object], [Object], [Object]], "id": "2.1707056390431", "workedExercises": {"19": [Array], "20": [Array], "21": [Array]}}]
 LOG  startExercisesWithTimerDataArr[0].exerciseDetails [{"id": 19, "workoutName": undefined}, {"id": 20, "workoutName": undefined}, {"id": 21, "workoutName": undefined}]
 LOG  sets------- {"date": "2024-02-06", "dayName": "Day one", "exerciseDetails": [{"id": 19, "workoutName": "STANDING LEG CIRCLES"}, {"id": 20, "workoutName": "STATIC LUNGE"}, {"id": 21, "workoutName": "NAVY SEAL BURPEE"}], "id": "2.1707056390431", "workedExercises": {"19": [[Object], [Object], [Object]], "20": [[Object], [Object], [Object], [Object]], "21": [[Object], [Object]]}}
 LOG  sets.workedExercises------- {"19": [{"isCompleted": true, "reps": "43", "sets": 1, "timerStarted": false, "weight": "44"}, {"isCompleted": true, "reps": "53", "sets": 2, "timerStarted": false, "weight": "55"}, {"isCompleted": true, "reps": "63", "sets": 3, "timerStarted": false, "weight": "66"}], "20": [{"isCompleted": true, "reps": "11", "sets": 1, "timerStarted": false, "weight": "11"}, {"isCompleted": true, "reps": "22", "sets": 2, "timerStarted": false, "weight": "22"}, {"isCompleted": true, "reps": "33", "sets": 3, "timerStarted": false, "weight": "33"}, {"isCompleted": true, "reps": "44", "sets": 4, "timerStarted": false, "weight": "44"}], "21": [{"isCompleted": true, "reps": "55", "sets": 1, "timerStarted": false, "weight": "55"}, {"isCompleted": true, "reps": "66", "sets": 2, "timerStarted": false, "weight": "66"}]}
 LOG  startExercisesWithTimerDataArr [{"date": "2024-02-06", "dayName": "Day one", "exerciseDetails": [[Object], [Object], [Object]], "id": "2.1707056390431", "workedExercises": {"19": [Array], "20": [Array], "21": [Array]}}]
 LOG  startExercisesWithTimerDataArr[0].exerciseDetails [{"id": 19, "workoutName": undefined}, {"id": 20, "workoutName": undefined}, {"id": 21, "workoutName": undefined}]
 LOG  sets------- {"date": "2024-02-06", "dayName": "Day one", "exerciseDetails": [{"id": 19, "workoutName": "STANDING LEG CIRCLES"}, {"id": 20, "workoutName": "STATIC LUNGE"}, {"id": 21, "workoutName": "NAVY SEAL BURPEE"}], "id": "2.1707056390431", "workedExercises": {"19": [[Object], [Object], [Object]], "20": [[Object], [Object], [Object], [Object]], "21": [[Object], [Object]]}}
 LOG  sets.workedExercises------- {"19": [{"isCompleted": true, "reps": "43", "sets": 1, "timerStarted": false, "weight": "44"}, {"isCompleted": true, "reps": "53", "sets": 2, "timerStarted": false, "weight": "55"}, {"isCompleted": true, "reps": "63", "sets": 3, "timerStarted": false, "weight": "66"}], "20": [{"isCompleted": true, "reps": "11", "sets": 1, "timerStarted": false, "weight": "11"}, {"isCompleted": true, "reps": "22", "sets": 2, "timerStarted": false, "weight": "22"}, {"isCompleted": true, "reps": "33", "sets": 3, "timerStarted": false, "weight": "33"}, {"isCompleted": true, "reps": "44", "sets": 4, "timerStarted": false, "weight": "44"}], "21": [{"isCompleted": true, "reps": "55", "sets": 1, "timerStarted": false, "weight": "55"}, {"isCompleted": true, "reps": "66", "sets": 2, "timerStarted": false, "weight": "66"}]}