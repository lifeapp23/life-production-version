import React, { useState, useEffect,useRef  } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput,Alert } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  ExerciseImageViewImage,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText
} from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { updateSet, updateCompletedExercises,updateDayTim } from './start_exer_with_timer_store'; // Assuming you have an updateNewArray action
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StartExercisesWithTimerScreen = ({navigation,route}) => {
  const publicPlansDataTableItemDay = route.params?.publicPlansDataTableItemDayCon;
  const publicPlansDataTableItemDayNewData =publicPlansDataTableItemDay;
  let dayTimtimer = 0;
  let breakTimerRef = useRef(120);
//   const publicPlansDataTableItemDayNewData = publicPlansDataTableItemDay.map((item, index) => ({
//   ...item,
//   id: index + 1, // Adding 1 to make the id start from 1 (if needed)
// }));
const [userId,setUserId] = useState('');
useFocusEffect(
  React.useCallback(() => {
    // Fetch the latest data or update the state here
  AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);
    //console.log('publicWorkoutsPlans user---->>>',storedUser.id);
    setUserId(storedUser.id);
    
      
   
    });
  }, [AsyncStorage])
  );
  const startExercisesWithTimerDataArr = useSelector(state => state.startExercisesWithTimerData.startExercisesWithTimerData);

  // //console.log('startExercisesWithTimerDataArr',startExercisesWithTimerDataArr);
  // //console.log('startExercisesWithTimerDataArr[0].workedExercises',startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);

  const [activeIndex, setActiveIndex] = useState(0);
  
  const [sets, setSets] = useState({});
  // //console.log('sets-------',sets);
  ////console.log('sets.workedExercises-------',sets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);

  const [buttonPressed, setButtonPressed] = useState(false);

  //const [timer, setTimer] = useState(120);
  //const [dayTimtimer, setDayTimtimer] = useState(0);
  // let dayTimtimer = 0;
  // New state variable to track completed sets for each workout
  const [completedSets, setCompletedSets] = useState({});
  const [lastRowPressed, setLastRowPressed] = useState(false);
  const [inputValues, setInputValues] = useState([]);
  const dispatch = useDispatch();
  const [exercisesCompleted, setExercisesCompleted] = useState(false);

  //let breakInterval;

  const lastSession = [
    {session_set:1,session_weight:10,session_reps:5},
    {session_set:2,session_weight:12,session_reps:6},
    {session_set:3,session_weight:14,session_reps:7},
    {session_set:4,session_weight:16,session_reps:8},
  ];
  const handleStoryPress = (index) => {
    setActiveIndex(index);
    // Handle navigation or other actions here based on the selected story
  };

  useEffect(() => {
    const updatedSets = publicPlansDataTableItemDay.reduce((acc, row, i) => {
      const activeWorkoutId = publicPlansDataTableItemDayNewData[i].wrkKey;
      const wrkKey = publicPlansDataTableItemDayNewData[i].wrkKey;
      const wktNam = publicPlansDataTableItemDayNewData[i].wktNam;
      const plnKey = publicPlansDataTableItemDayNewData[i].plnKey;
      const exrTyp = publicPlansDataTableItemDayNewData[i].exrTyp;
      const totalSets = row.wrkSts;
      const dayName = row.dayNam;
      const speKey = publicPlansDataTableItemDay[0].speKey;
      const date = new Date().toISOString().split('T')[0];

      acc[activeWorkoutId] = Array.from({ length: totalSets }, (_, index) => ({
        userId:userId,
        plnKey: plnKey, // Add plnKey field
        dayKey: speKey, // Change id to speKey
        dayName: dayName, // Add dayName field
        date: date, // Add date field
        wrkKey:wrkKey,
        wktNam: wktNam, // Add workoutName field
        sets: index + 1,
        weight: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.weight !== undefined)
          ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.weight) : (""),
        reps: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.reps !== undefined)
          ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.reps) : (""),
        casTim: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.casTim !== undefined)
        ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.casTim) : (""),
        isCompleted: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.isCompleted !== undefined)
          ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.isCompleted) : (false),
        timerStarted: false,
        dayTim: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.dayTim !== undefined)
        ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.dayTim) : 0,
      }));
  
      return acc;
    }, {});

    const workedExercisesArray = {
      [publicPlansDataTableItemDay[0].speKey]: {
        workedExercises: updatedSets
      }
    };
    setSets(workedExercisesArray);
  }, [publicPlansDataTableItemDay, startExercisesWithTimerDataArr,userId]);
  

  
  // const allDayTimValues = [];
  // for (const workoutId in sets) {
  //   const workedExercises = sets[workoutId]?.workedExercises;
  //   if (workedExercises) {
  //     for (const exerciseId in workedExercises) {
  //       //console.log('exerciseId',exerciseId);
  //       const exercises = workedExercises[exerciseId];
  //       //console.log('exercises---',exercises);
  //       for (const exercise of exercises) {
  //         //console.log('-----exercise',exercise);
  //         allDayTimValues.push(exercise.dayTim);
  //       }
  //     }
  //   }
  // }
  
//   // //console.log('sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[0];',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[0].wrkKey][0]?.dayTim);
//   const dayTimerFuncton=()=>{
//     // Check if dayTime is already set in acc
//  // const storedDayTime = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[0].wrkKey][0]?.dayTim; // Assuming dayTime is stored in the first element of the array

//   // Start the timer based on the stored dayTime

// const timerInterval = setInterval(() => {
    
//     setDayTimtimer((prevTimer) => prevTimer + 1);
//   }, 1000);
//   // Clean up the interval when the component unmounts
//   return () => clearInterval(timerInterval);
//   }
// //   // Step 1: Update the useEffect hook to start the timer based on dayTime if it's already set

// const dayTimerFunction = (timer) => {
//   const timerInterval = setInterval(() => {
//     timer.value += 1; // Increment the value property of the object
//   }, 1000);
  
//   // Clean up the interval when the component unmounts
//   return () => clearInterval(timerInterval);
// };
const timerInterval = setInterval(() => {
  dayTimtimer += 1; // Increment the value property of the object
}, 1000);


useEffect(() => {
  const unsubscribe = navigation.addListener('beforeRemove', () => {
    //console.log('sets leaving before daytimer', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

    //console.log('dayTimtimerRef leaving ', dayTimtimer);
    // Access the specific sets based on publicPlansDataTableItemDay[0].speKey
    const workout = sets[publicPlansDataTableItemDay[0].speKey];

    if (workout) {
      // Access workedExercises array for the specified workout
      const workedExercises = workout.workedExercises;

      // Iterate over each exercise array
      for (const exerciseId in workedExercises) {
        const exercises = workedExercises[exerciseId];

        // Update dayTim for each exercise array
        const updatedExercises = exercises.map((exercise) => ({
          ...exercise,
          dayTim: exercise.dayTim + dayTimtimer, // Increment dayTime
        }));

        // Update the exercises array with updated dayTim
        sets[publicPlansDataTableItemDay[0].speKey].workedExercises[exerciseId] = updatedExercises;
      }
    }
    //console.log('sets leaving ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

    // Save the dayTim value into Redux
    dispatch(updateDayTim({
      dayKey:publicPlansDataTableItemDay[0].speKey,
      workedExercises: sets,
    }));

  });

  // Return cleanup function to unsubscribe from the event
  return unsubscribe;
}, [navigation, dispatch,updateDayTim,publicPlansDataTableItemDay,sets]);

// //console.log('sets.workedExercises222222-------',sets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);


  useEffect(() => {
    // Start the timer when a blue check sign is pressed
    const activeWorkoutId = publicPlansDataTableItemDayNewData[activeIndex].wrkKey;
  
    // Check if any blue check sign is pressed, and if the timer is not started, start it
    const isAnyBlueCheckPressed = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.some((set) => set.isCompleted);
    //console.log('isAnyBlueCheckPressed',isAnyBlueCheckPressed)
    let breakInterval;
    if (isAnyBlueCheckPressed ) {
      //console.log('yeees');
      
      breakInterval = setInterval(() => {
        breakTimerRef.current -= 1;
      }, 1000);
      
    }
    return () => {
      clearInterval(breakInterval);
    };
  }, [activeIndex, sets, publicPlansDataTableItemDayNewData,breakTimerRef]);

  const handleStartTimer = () => {
    breakTimerRef.current = 120; // Set initial time (120 seconds)
  };
  const handleNavigateToNextPage = () => {
    // Navigate to the NextPage component
    navigation.navigate('BeginWorkout');
  };

  const handleCompleteSet = () => {
    const activeWorkoutId = publicPlansDataTableItemDayNewData[activeIndex].wrkKey;
    const setValues = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId].map((set) => ({
      sets: set.sets,
      weight: set.weight,
      reps: set.reps,
    }));
  
    // Use setValues as needed, for example, save it to state or send it to the server
  };
  const showTrainingStartAlert = () => {
    Alert.alert('Start Training', 'It\'s time to start your training!');
  };
  
  const handleToggleComplete = (plnKey,dayKey,dayName,date,wrkKey,wktNam,setId, index, weight, reps,dayTim, array) => {
    const activeWorkoutId = publicPlansDataTableItemDayNewData[activeIndex].wrkKey;
//console.log('handleToggleComplete dayTimtimer',dayTimtimer);
//console.log('sets before ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

// Access the specific sets based on publicPlansDataTableItemDay[0].speKey
const workout = sets[publicPlansDataTableItemDay[0].speKey];

if (workout) {
  // Access workedExercises array for the specified workout
  const workedExercises = workout.workedExercises;

  // Iterate over each exercise array
  for (const exerciseId in workedExercises) {
    const exercises = workedExercises[exerciseId];

    // Update dayTim for each exercise array
    const updatedExercises = exercises.map((exercise) => ({
      ...exercise,
      dayTim: exercise.dayTim + dayTimtimer, // Increment dayTime
    }));

    // Update the exercises array with updated dayTim
    sets[publicPlansDataTableItemDay[0].speKey].workedExercises[exerciseId] = updatedExercises;
  }
}
//console.log('sets after ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

    workedExercises={
      userId:userId,
      plnKey: plnKey, // Add plnKey field
      dayKey: dayKey, // Change id to speKey
      dayName: dayName, // Add dayName field
      date: date, // Add date field
      wrkKey:wrkKey,
      wktNam: wktNam, // Add workoutName field
      sets: setId,
      isCompleted: true,
      timerStarted: true,
      weight: weight,
      reps: reps,
      dayTim:dayTim + dayTimtimer,
    }
    dispatch(updateSet({
      dayKey: dayKey,
      workedExercises: workedExercises,
      activeWorkoutId: activeWorkoutId,
    }));
    // Create the new array with the incremented ID

    setSets((prevSets) => {

      const updatedSets = {
        ...prevSets,
        [publicPlansDataTableItemDay[0].speKey]: {
          workedExercises: {
            ...prevSets[publicPlansDataTableItemDay[0].speKey].workedExercises,
            [activeWorkoutId]: prevSets[publicPlansDataTableItemDay[0].speKey].workedExercises[activeWorkoutId].map((set) =>
              set.sets === setId
                ? { ...set, isCompleted: !set.isCompleted, timerStarted: !set.timerStarted, weight: weight, reps: reps }
                : set
            ),
          },
        },
      };

       // Update completedSets state based on the completed sets for the current workout
      setCompletedSets((prevCompletedSets) => ({
        ...prevCompletedSets,
        [activeWorkoutId]: updatedSets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId].filter((set) => set.isCompleted),
      }));
      
      const allSetsCompleted = updatedSets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId].every((set) => set.isCompleted);

    // If it's the last row in workout and all sets are completed, move to the next workout
    if (allSetsCompleted && (activeIndex < publicPlansDataTableItemDay.length - 1)) {
      setActiveIndex((prevIndex) => prevIndex + 1);
    }
   
    if ( allSetsCompleted && activeIndex === publicPlansDataTableItemDay?.length - 1 ) {
      setLastRowPressed(true);
      Alert.alert('You did your workout, Good Worked');
    }
      return updatedSets;
    });
    

  

    // Handle the timer logic here
    const set = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId].find((s) => s.sets === setId);
    if (set && !set.timerStarted) {
      handleStartTimer();
    } else {
      handleCompleteSet();
    }
};

const handleCompleteExercises = () => {
  setButtonPressed(true);

  // Loop through all exercises and sets in the sets array and fill empty values with 0
  const updatedSets = Object.keys(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises).reduce((acc, exerciseId) => {
    const updatedExerciseSets = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[exerciseId]?.map((set) => ({
      ...set,
      weight: set.weight === '' ? '0' : set.weight,
      reps: set.reps === '' ? '0' : set.reps,
      isCompleted:true,
      timerStarted: false,
    }));
    acc[exerciseId] = updatedExerciseSets;
    return acc;
  }, {});
  // Update the state with the new sets
  // Update the state with the new sets
    setSets((prevSets) => ({
      ...prevSets,
      [publicPlansDataTableItemDay[0].speKey]: {
        workedExercises: updatedSets,
      },
    }));
////////////////////// here adding the dataa to store 
  // Dispatch the updateSet action to update Redux state

  Object.keys(updatedSets).forEach((exerciseId) => {
    const activeWorkoutId = publicPlansDataTableItemDayNewData.find((item) => item.wrkKey === exerciseId).wrkKey;
 
    dispatch(updateCompletedExercises({
      dayKey: publicPlansDataTableItemDay[0].speKey,
      workedExercises: updatedSets,
      activeWorkoutId: activeWorkoutId,
    }));
  });
  setExercisesCompleted(true);
  // Show the alert
};
// // Add a useEffect hook to listen for changes in startExercisesWithTimerData
useEffect(() => {
  // When exercises are completed, show the alert
  if (exercisesCompleted) {
    Alert.alert(
      'Good work',
      'You completed your exercises!',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('BeginWorkout');
          },
        },
      ],
      { cancelable: false }
    );
    setExercisesCompleted(false); // Reset the state
  }
}, [startExercisesWithTimerDataArr]); // Listen for changes in startExercisesWithTimerData
  const renderItem = ({ item, index }) => (
    <View style={{marginRight:10,
    alignItems: 'center',flexWrap: 'wrap'}}>
      <TouchableOpacity key={index}
        style={[
          styles.storyItem,
          index === activeIndex && styles.activeStory,
          ((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || (index+1 === publicPlansDataTableItemDayNewData[index].wrkKey))) && { opacity: 0.5 }, // Adjust the opacity as needed
        ]}
        onPress={() => {
    // Disable the onPress when all sets are completed
            handleStoryPress(index);
            handleStartTimer();
        }}
      >
    
        <ExerciseImageViewImage style={{ height: 80, width: 80,justifyContent:"center",alignItems: 'center',}} source={require('../../../../assets/gym-workout.png')} />
        {/* Display green check sign if all sets for this workout are completed */}
        {((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || (index+1 === publicPlansDataTableItemDayNewData[index].wrkKey))) && (
          <Text style={{ color: 'green', position: 'absolute', top: '50%', left: '50%', marginLeft: -8, marginTop: -8 }}>✔✔</Text>
        )}
      </TouchableOpacity>
      <View style={{ maxWidth: 80,}}>
        <Text style={{color:'white',fontSize:14,marginTop:10}}>{item.wktNam}</Text>
      </View>    
    </View>
  );
// the code worked here if you make a delete stop hereeeeeeeeeeeeeeeeeee
  const handleInputFocus = () => {
    //console.log('Current dayTimer foucs value:', dayTimtimer);
    //console.log('sets before ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

// Access the specific sets based on publicPlansDataTableItemDay[0].speKey
const workout = sets[publicPlansDataTableItemDay[0].speKey];

if (workout) {
  // Access workedExercises array for the specified workout
  const workedExercises = workout.workedExercises;

  // Iterate over each exercise array
  for (const exerciseId in workedExercises) {
    const exercises = workedExercises[exerciseId];

    // Update dayTim for each exercise array
    const updatedExercises = exercises.map((exercise) => ({
      ...exercise,
      dayTim: exercise.dayTim + dayTimtimer, // Increment dayTime
    }));

    // Update the exercises array with updated dayTim
    sets[publicPlansDataTableItemDay[0].speKey].workedExercises[exerciseId] = updatedExercises;
    
  }
  
}
dayTimtimer=0;
//console.log('sets after ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);
//console.log('Current dayTimer after zero value:', dayTimtimer);

  };

////////////// i added the name of exercises with id 
  return (
    <PageContainer>
      <ScrollView>
        <TitleView >
          <Title >Life</Title>
        </TitleView>
        <ServicesPagesCardCover>
          <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
          <ServicesPagesCardHeader>day</ServicesPagesCardHeader>
        </ServicesPagesCardCover>
        <View style={{marginTop:10,marginBottom:10,marginLeft:10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FlatList
            data={publicPlansDataTableItemDay}
            renderItem={renderItem}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            horizontal
          />
        </ScrollView>
        </View>
        <View style={styles.container}>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.headerLabels}>
              <Text style={styles.headerCell}>Set</Text>
              <Text style={styles.headerWeightCell}>Weight</Text>
              <Text style={styles.headerRepsCell}>Reps</Text>
              <Text style={styles.headerCell}>Completed</Text>
            </View>

            {/* Rows */}
            {publicPlansDataTableItemDay.map((row, i) => {
              return (  
              <View key={row.wrkKey} style={{ display: activeIndex === i ? 'flex' : 'none' }}>
                {sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[i].wrkKey]?.map((set, index, array) => {
               

                return(
            <View key={`${row.wrkKey}-${index}`} style={styles.row}>
              <Text style={styles.cell}>{set.sets}</Text>
              <TextInput
                style={styles.input}
                placeholder="weight"
                onFocus={handleInputFocus}
                keyboardType="numeric"
                value={(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight) || (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight)}
                onChangeText={(text) =>
                  setInputValues((prevInputValues) => {
                    const newInputValues = [...prevInputValues];
                    newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] = {
                      ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] || {}),
                      [index]: {
                        ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index],
                        weight: text,
                      },
                    };
                    return newInputValues;
                  })
                }
              />

              <TextInput
                style={styles.input}
                placeholder="Reps"
                keyboardType="numeric"
                value={(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps) || (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps)}
                onFocus={handleInputFocus}
                onChangeText={(text) =>
                  setInputValues((prevInputValues) => {
                    const newInputValues = [...prevInputValues];
                    newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] = {
                      ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] || {}),
                      [index]: {
                        ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index],
                        reps: text,
                      },
                    };
                    return newInputValues;
                  })
                }
              />

                
                
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    {
                      color: set.timerStarted ? 'green' : 'blue',
                      borderColor: 'transparent',
                    },
                  ]}
                  onPress={() => {
                    ((parseFloat(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight) > 0) && (parseFloat(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps) > 0))?(
                      handleToggleComplete(set.plnKey,set.dayKey,set.dayName,set.date,set.wrkKey,set.wktNam,set.sets, index, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps,set.dayTim, array)):(
                      Alert.alert("please fill with nubmers bigger that zero")
                    )
                    
                    // If it's the last workout and the blue check sign in the last row is pressed, setLastRowPressed to true
                  }}
                  disabled={set.isCompleted}
                >
                  {set.isCompleted ? 
                  
                  (
                    <Text style={{ color: 'green',fontSize:16 }}>✔✔</Text>
                  ) : (
                    <Text style={{ color: 'blue',fontSize:20 }}>✔</Text>
                  )}
              </TouchableOpacity>
              </View>);
              })}
              </View>
              );})}

          </View>
          <Spacer size="large">
            <View style={{marginLeft:10,marginRight:10,}}>
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}  onPress={() => {
                handleCompleteExercises();
              }}>
                <CalendarFullSizePressableButtonText >Complete Exercises</CalendarFullSizePressableButtonText>
              </CalendarFullSizePressableButton>
            </View>
          </Spacer>
          {/* Timer */}
          <Text style={styles.timer}>
      {breakTimerRef.current > 0 ? (
        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>
          Time Remaining: {Math.floor(breakTimerRef.current / 60)}m : {breakTimerRef.current % 60}s
        </Text>
      ) : breakTimerRef.current < 0 ? (
        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>
          Negative Time: -{Math.floor(Math.abs(breakTimerRef.current) / 60)}m : {Math.abs(breakTimerRef.current) % 60}s
        </Text>
      ) : (
        showTrainingStartAlert()
      )}
    </Text>
        </View>
        <View style={styles.container}>
        <Text style={{fontSize:16,color:'white',fontFamily:'OpenSans_400Regular',}}>Last Session</Text>
          <View style={styles.table}>
            {/* Header */}
            
            <View style={styles.sessionHeaderLabels}>
              <Text style={styles.sessionHeaderCellSets}>Set</Text>
              <Text style={styles.sessionHeaderWeightCell}>Weight</Text>
              <Text style={styles.sessionHeaderRepsCell}>Reps</Text>
            </View>

            {/* Rows */}
            {sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.map((set, index, array) => (
              <View key={set.sets} style={styles.row}>
                <Text style={styles.session_sets}>{set.sets}</Text>
                <Text style={styles.session_weight}>{set.sets}</Text>
                <Text style={styles.session_reps}>{set.sets}</Text>
              </View>
            ))}

          </View>

          
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  storyItem: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#ddd',
    height: 87,
    width: 87,
    aspectRatio: 1,
    justifyContent:'center',
    alignItems:'center',
    
  },
  activeStory: {
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#007bff',
    height: 87,
    width: 87,
    justifyContent:'center',
    alignItems:'center',
    
  },
  storyText: {
    color: '#333',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
 
  headerLabels:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    
    padding: 8,
  },
  sessionHeaderLabels:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    
    padding: 8,
  },
  sessionHeaderCellSets:{
    color:"white",
    fontFamily:'OpenSans_400Regular',
    fontWeight: 'bold',
    marginLeft:5,
  },
  sessionHeaderWeightCell:{

    fontWeight: 'bold',
    color:"white",
    fontFamily:'OpenSans_400Regular',
    
    
  },
  sessionHeaderRepsCell:{

    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"white",
  },
   
             
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    padding: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color:"white",
    fontFamily:'OpenSans_400Regular',
  },
  headerWeightCell: {
    fontWeight: 'bold',
    color:"white",
    fontFamily:'OpenSans_400Regular',
    marginRight:20
  },
  headerRepsCell: {
    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"white",
    
  },
   
  cell: {
    flex: 1,
    textAlign: 'center',
    color:'white',
    fontFamily:'OpenSans_400Regular',
  },
  session_sets: {
    flex: 1,
    textAlign: 'center',
    color:'white',
    fontFamily:'OpenSans_400Regular',
  },
  session_weight: {
    flex: 1,
    textAlign: 'center',
    color:'white',
    fontFamily:'OpenSans_400Regular',
  },
  session_reps: {
    flex: 1,
    textAlign: 'center',
    color:'white',
    fontFamily:'OpenSans_400Regular',
  },
   
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    color:'white',
    fontFamily:'OpenSans_400Regular',
    marginRight:15,
    borderRadius:7,
  },
  completeButton: {
    flex: 1,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
  },
});