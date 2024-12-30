import React, { useState, useEffect,useContext, useRef,useCallback, useImperativeHandle, forwardRef   } from 'react';
import {AppState,TouchableWithoutFeedback, View,Button , FlatList, StyleSheet, Text, TouchableOpacity,Pressable ,ScrollView, TextInput,Alert,Image,PanResponder, Animated,Modal, Platform } from 'react-native';
import { IndexPath , Select, SelectItem,Card } from '@ui-kitten/components';
import { debounce } from 'lodash'; // You can also use throttle
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useActionSheet } from "@expo/react-native-action-sheet";

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';


import Constants from 'expo-constants';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { updateWorkoutByChangingStatusToSkippedOrDone,fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable,restartWorkoutByChangingToActive,restartAllWorkoutByChangingSpekey } from "../../../../database/public_workouts_plan_days";
import { useDispatch, useSelector } from 'react-redux';
import { updateSet, updateCompletedExercises,updateDayTim,deleteKeyObject } from './start_exer_with_timer_store'; // Assuming you have an updateNewArray action
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import { FontAwesome } from '@expo/vector-icons';
import { insertPlansStartWorkout,fetchLastDayStartWorkouts,fetchLastDayStartWorkoutsWithoutPlnKeyAndDayKey} from "../../../../database/start_workout_db";
import { StackActions } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
const isImageInMemory = async (fileUri) => {
  try {
    

    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    // Return true if the file exists
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
};

const SecondTimer = React.memo(({ onChangeInputValues, index, publicPlansDataTableItemDayNewData, activeIndex, set, activeTimerIndex, setActiveTimerIndex,publicPlansDataTableItemDay,navigation }) => {
  const [timerTwo, setTimerTwo] = useState(set.casTim ? set.casTim : 0);
  const [isStarted, setIsStarted] = useState(false) ;
  const [timerRunning, setTimerRunning] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const intervalRef = useRef(null); // Use ref to store interval ID


  useEffect(() => {
    ///////console.log('activeTimerIndex, index',activeTimerIndex, index);
    const start = Date.now();
    
    // Your logic here
  
    
  
    
    if (activeTimerIndex === index) {
      if (isStarted) {
        intervalRef.current = setInterval(() => {
          setTimerTwo(prevTimer => {
           
        
            const  ExerciesSpekey =publicPlansDataTableItemDay?.[activeIndex]?.speKey;
            const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
  
            const  ExerciesPlnKey = publicPlansDataTableItemDay?.[activeIndex]?.plnKey;
            //console.log('timerTwo activeIndex publicPlansDataTableItemDayNewData',activeIndex,publicPlansDataTableItemDayNewData);

            
              const key = `user_green_timer_workout_${ExerciesPlnKey}_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_${index}`;
              const savedLiveTimer = `user_green_timer_workout_${ExerciesPlnKey}_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_${index}_timer`;
                //console.log('timerTwo activeIndex ExerciesPlnKey',index,ExerciesPlnKey);
                //console.log('timerTwo activeIndex ExerciesSpekey',index,ExerciesSpekey);
                //console.log('timerTwo activeIndex ExerciesWrkKey',index,ExerciesWrkKey);
                //console.log('timerTwo activeIndex key',key);
                //console.log('timerTwo activeIndex savedLiveTimer',savedLiveTimer);

              const currentTime = Date.now();
              const newTime = prevTimer + 1;

               AsyncStorage.setItem(key, JSON.stringify(currentTime));
               AsyncStorage.setItem(savedLiveTimer, JSON.stringify(newTime));
      
            return newTime;
          }
          );
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
      }
    } else {
      // AsyncStorage.removeItem('backgroundTimeForGreenTimer');

      clearInterval(intervalRef.current);
      setTimerRunning(false);
      setIsStarted(false);
    }
// Your logic here
const end = Date.now();
////console.log(`if (activeTimerIndex === index) Time taken: ${end - start} ms`);
// return () => {
//   // AsyncStorage.removeItem('backgroundTimeForGreenTimer');
//   clearInterval(intervalRef.current);
// }
  }, [isStarted, activeTimerIndex]);
  const saveBackgroundTimeForGreenTimer = async () => {
    const currentTime = Date.now();
    if(intervalRef.current){
      await AsyncStorage.setItem('backgroundTimeForGreenTimer', currentTime.toString());
  
    }
  };
  const updateTimerAfterBackgroundForGreenTimer = async () => {
    if (activeTimerIndex === index) {
      if (isStarted) {
    const storedBackgroundTime = await AsyncStorage.getItem('backgroundTimeForGreenTimer');
    const currentTime = Date.now();
  
    if (storedBackgroundTime) {
      // const timeInBackground = Math.floor((currentTime - parseInt(storedBackgroundTime, 10)) / 1000);
      // setTimerTwo((prevTime) => prevTime + timeInBackground); // Subtract background time
      const parsedTime = parseInt(storedBackgroundTime, 10);
      if (!isNaN(parsedTime)) {
        const timeInBackground = Math.floor((currentTime - parsedTime) / 1000);
        setTimerTwo((prevTime) => prevTime + timeInBackground);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimeout(() => {
        
        intervalRef.current = setInterval(() => {
          setTimerTwo(prevTimer => {
        
            const  ExerciesSpekey =publicPlansDataTableItemDay?.[activeIndex]?.speKey;
            const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
  
            const  ExerciesPlnKey = publicPlansDataTableItemDay?.[activeIndex]?.plnKey;
            //console.log('timerTwo activeIndex publicPlansDataTableItemDayNewData',activeIndex,publicPlansDataTableItemDayNewData);

            
              const key = `user_green_timer_workout_${ExerciesPlnKey}_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_${index}`;
              const savedLiveTimer = `user_green_timer_workout_${ExerciesPlnKey}_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_${index}_timer`;
                //console.log('timerTwo activeIndex ExerciesPlnKey',index,ExerciesPlnKey);
                //console.log('timerTwo activeIndex ExerciesSpekey',index,ExerciesSpekey);
                //console.log('timerTwo activeIndex ExerciesWrkKey',index,ExerciesWrkKey);
                //console.log('timerTwo activeIndex key',key);
                //console.log('timerTwo activeIndex savedLiveTimer',savedLiveTimer);

              const currentTime = Date.now();
              const newTime = prevTimer + 1;

               AsyncStorage.setItem(key, JSON.stringify(currentTime));
               AsyncStorage.setItem(savedLiveTimer, JSON.stringify(newTime));
      
            return newTime;
          }
          );
        }, 1000);// Start the timer after ensuring state update
      
      }, 50); // Small delay to give time for state update
    }
  }
}
  };
  const handleAppStateChangeForGreenTimers = async (nextAppState) => {
    if (nextAppState === 'active') {
      // await updateTimerAfterBackground(); // Update timer when coming back to the app
      await updateTimerAfterBackgroundForGreenTimer(); // Update timer when coming back to the app
       
     
      // App is in the foreground, sync timer
      // syncTimer();
    } else if (nextAppState === 'background' || nextAppState === 'inactive') {
      
      // App is going to the background, register background task
      if (intervalRef.current) {
        // await saveBackgroundTime(); // Save the time when the app goes to the background
        await saveBackgroundTimeForGreenTimer(); // Save the time when the app goes to the background
        clearInterval(intervalRef.current);

      // await registerBackgroundTask();
      }
    }

  };

  useEffect(() => {
    
    // Your logic here
  
    
    const subscription_green_timer_handleAppStateChange = AppState.addEventListener('change', handleAppStateChangeForGreenTimers);
    return () => {

      subscription_green_timer_handleAppStateChange.remove();
  
    }
    // Your logic here
  ////console.log(`if (timerTwo !== 0) Time taken: ${end - start} ms`);
  }, [isStarted, activeTimerIndex]);
  
    
  useEffect(() => {
    
  // Your logic here

  

  
    if (timerTwo !== 0) { // Send the updated time only if it's not zero
      onChangeInputValues((prevInputValues) => {
        const newInputValues = {...prevInputValues};
        newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] = {
          ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] || {}),
          [index]: {
            ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index],
            casTim: timerTwo,
          },
        };
        return newInputValues;
      });
    }
   
    // Your logic here
  ////console.log(`if (timerTwo !== 0) Time taken: ${end - start} ms`);
  }, [onChangeInputValues, publicPlansDataTableItemDayNewData, activeIndex, index, timerTwo]);
  
  const handleToggle = () => {
    ///////console.log('setActiveTimerIndex(index) before', index);
    ///////console.log('intervalRef.current before', intervalRef.current);

    if (activeTimerIndex !== index) {
      setIsStarted((prevIsStarted) => {
        const newIsStarted = prevIsStarted;
        setTimerRunning(newIsStarted);
        return newIsStarted;
      });
      clearInterval(intervalRef.current);
      // AsyncStorage.removeItem('backgroundTimeForGreenTimer');

      setActiveTimerIndex(index);
      ///////console.log('setActiveTimerIndex(activeTimerIndex !== index)', index);
    }
      setIsStarted((prevIsStarted) => {
        const newIsStarted = !prevIsStarted;
        setTimerRunning(newIsStarted);
        return newIsStarted;
      });
    
    // if (isStarted) {
    //   clearInterval(intervalRef.current);
    // }
    
  };


  const handleReset = () => {
    setTimerTwo(0);
    setIsStarted(false);
    setTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}${t("m")} : ${remainingSeconds.toString().padStart(2, '0')}${t("s")}`;
  };

  useEffect(() => {
    const unsubscribeForIntervalRef = navigation.addListener('beforeRemove', async () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Clear the interval when navigating away
         
        }
    });
    
       return () => {
        ////console.log('StartExercisesWithTimerScreen component unmounted');
        unsubscribeForIntervalRef();
        
    
        
       };
     }, []);
  return (
    <>
      <Text style={[isArabic ? styles.ArabicStopWatchTimer : styles.EnglishRightStopWatchTimer,set.isCompleted && { opacity: 0.4 }]} disabled={set.isCompleted}>
      <FontAwesome
          name={timerRunning ? 'pause' : 'play'}
          size={20}
          color={timerRunning ? 'red' : 'green'}
          onPress={handleToggle}
          style={styles.button}
          disabled={set.isCompleted}
        />
        {timerRunning ? (
          <View style={{flex:1,paddingLeft:3}}>
            <Text style={{ color: 'red', fontSize: 11, fontFamily: 'OpenSans_400Regular' }}>
              {formatTime(timerTwo)}
            </Text>
          </View>
        ) : (
          <View style={{flex:1,paddingLeft:3}}>
            <Text style={{ color: 'green', fontSize: 11, fontFamily: 'OpenSans_400Regular' }}>
              {formatTime(timerTwo)}
            </Text>
          </View>
        )}
        
      </Text>
    </>
  );
});

export const StartExercisesWithTimerScreen = ({navigation,route}) => {
  //const publicPlansDataTableItemDay = route.params?.publicPlansDataTableItemDayCon;
  const [publicPlansDataTableItemDay, setPublicPlansDataTableItemDay] = useState(route.params?.publicPlansDataTableItemDayCon || []);
  const { showActionSheetWithOptions } = useActionSheet();
  const [appState, setAppState] = useState(AppState.currentState);

  const positions = useRef([]).current; // Array to hold workouts icons positions

  const listRef = useRef(null);
  const [listLayout, setListLayout] = useState(null); // Object to store the layout of the FlatList

  // const listLayout = useRef({}).current; // Object to store the layout of the FlatList
  const publicPlansDataTableItemDayNewData =publicPlansDataTableItemDay;
const context = useContext(AuthGlobal);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const todayDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

const [userId,setUserId] = useState('');
const [activeIndex, setActiveIndex] = useState(0);

const [WrkTypTimInitSent,setWrkTypTimInitSent] = useState(0);
const [exertypInitConst,setExertypInitConst] = useState('');
const [sets, setSets] = useState({});
const [setsFromDB,setSetsFromDB] = useState({});
const [newWorkoutsFromDB, setNewWorkoutsFromDB] = useState([]);
  
  
  
  const updateDraggingPosition = (x, y, fromIndex) => {
    if (!listLayout?.width) return;
  
    const itemWidth = positions[fromIndex]?.width || 86; // Use dynamic item width or default
    const relativeX = x - listLayout?.x;
  
    // Calculate the new index based on relativeX
    let newIndex = Math.floor(relativeX / itemWidth);
  
    // Adjust the newIndex if dragging center is past the middle of the next item
    const draggedItemCenter = relativeX + itemWidth / 2;
    const nextItemCenter = (newIndex + 1) * itemWidth + itemWidth / 2;
  
    // Log for debugging
    ///////console.log('RelativeX:', relativeX);
    ///////console.log('ItemWidth:', itemWidth);
    ///////console.log('DraggedItemCenter:', draggedItemCenter);
    ///////console.log('NextItemCenter:', nextItemCenter);
    ///////console.log('Calculated NewIndex:', newIndex);
  
    if (draggedItemCenter > nextItemCenter && newIndex < publicPlansDataTableItemDay.length - 1) {
      newIndex += 1;
    }
  
    // Ensure the new index is within bounds
    newIndex = Math.max(0, Math.min(newIndex, publicPlansDataTableItemDay.length - 1));
  
    ///////console.log('Final NewIndex:', newIndex);
    return newIndex;

    // if (newIndex !== fromIndex) {
    //   moveItem(fromIndex, newIndex);
    // }
  };
  
  
  

// function to change workouts icons positions indexs
const moveItem = (fromIndex, toIndex) => {
  ///////console.log('MoveItem fromIndex:', fromIndex);
  ///////console.log('MoveItem toIndex:', toIndex);

  if (fromIndex !== toIndex) {
    const updatedData = [...publicPlansDataTableItemDay];
    const movedItem = updatedData.splice(fromIndex, 1)[0];
    ///////console.log('MovedItem:', movedItem);

    updatedData.splice(toIndex, 0, movedItem);
    setPublicPlansDataTableItemDay(updatedData);
  }
};
  // useFocusEffect(
  //   useCallback(() => {
  //     if (route.params?.publicPlansDataTableItemDayCon) {
  //       setPublicPlansDataTableItemDay(route.params.publicPlansDataTableItemDayCon);
  //     }
  //   }, [route.params?.publicPlansDataTableItemDayCon])
  // );

 ///////console.log("publicPlansDataTableItemDay",publicPlansDataTableItemDay);
//   const publicPlansDataTableItemDayNewData = publicPlansDataTableItemDay.map((item, index) => ({
//   ...item,
//   id: index + 1, // Adding 1 to make the id start from 1 (if needed)
// }));
  
// Function to convert combined array back to original structure
const convertToOriginalStructure = (combinedArray) => {
  return combinedArray.reduce((acc, item) => {
    const key = item.wrkKey;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/////////console.log('publicPlansDataTableItemDayNewData)',publicPlansDataTableItemDayNewData);
useEffect(() => {
  const start = Date.now();
    
  // if(Object.keys(context.stateUser.userPublicSettings).length > 0){
  //   ////console.log('parseInt FreWit',parseInt(context.stateUser.userPublicSettings?.FreWit));
  //   ////console.log('parseInt barBel',parseInt(context.stateUser.userPublicSettings?.barBel));
  //   ////console.log('parseInt bands',parseInt(context.stateUser.userPublicSettings?.bands));
  //   ////console.log('parseInt dumbel',parseInt(context.stateUser.userPublicSettings?.dumbel));

    
  //     setFreWitWeight(parseInt(context.stateUser.userPublicSettings?.FreWit));
  //     setBarBelWeight(parseInt(context.stateUser.userPublicSettings?.barBel));
  //     setBandsWeight(parseInt(context.stateUser.userPublicSettings?.bands));
  //     setDumbellWeight(parseInt(context.stateUser.userPublicSettings?.dumbel));
  //   }else{
  //       fetchPublicSettings(userId).then((PSettingsResults) => {
  //        ////console.log('parseInt FreWit',parseInt(PSettingsResults[0]?.FreWit));
  //       ////console.log('parseInt barBel',parseInt(PSettingsResults[0]?.barBel));
  //       ////console.log('parseInt bands',parseInt(PSettingsResults[0]?.bands));
  //       ////console.log('parseInt dumbel',parseInt(PSettingsResults[0]?.dumbel));

  //       setFreWitWeight(parseInt(PSettingsResults[0]?.FreWit));
  //       setBarBelWeight(parseInt(PSettingsResults[0]?.barBel));
  //       setBandsWeight(parseInt(PSettingsResults[0]?.bands));
  //       setDumbellWeight(parseInt(PSettingsResults[0]?.dumbel));

  
  //     });

  //     }

  

  
    const exertypInit = publicPlansDataTableItemDayNewData[activeIndex].exrTyp;
    setExertypInitConst(exertypInit);
    ///////////console.log('exertypInit userPublicSettings',exertypInit);
    ///////////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
    ///////////console.log('activeIndex',activeIndex);

    if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
      ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
      setWrkTypTimInitSent(publicPlansDataTableItemDayNewData[activeIndex].exrTim);
     // /////////console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);

    }else if (exertypInit ==='Isolation'){
      ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
      setWrkTypTimInitSent(publicPlansDataTableItemDayNewData[activeIndex].exrTim);
      ///////////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);

    }else if(exertypInit ==='Compound'){
      ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
      setWrkTypTimInitSent(publicPlansDataTableItemDayNewData[activeIndex].exrTim);
      ///////////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);

    }
    

    ///exercises time and type 
    // if(Object.keys(context.stateUser.userPublicSettings).length > 0){
    //   ///////////console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
    //   const exertypInit = publicPlansDataTableItemDayNewData[activeIndex].exrTyp;
    //   setExertypInitConst(exertypInit);
    //   ///////////console.log('exertypInit userPublicSettings',exertypInit);
    //   ///////////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
    //   ///////////console.log('activeIndex',activeIndex);

    //   if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
    //     ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
    //     setWrkTypTimInitSent(context.stateUser.userPublicSettings.cardio);
    //    // /////////console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);

    //   }else if (exertypInit ==='Isolation'){
    //     ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
    //     setWrkTypTimInitSent(context.stateUser.userPublicSettings.isoltn);
    //     ///////////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);

    //   }else if(exertypInit ==='Compound'){
    //     ///////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
    //     setWrkTypTimInitSent(context.stateUser.userPublicSettings.compnd);
    //     ///////////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);

    //   }
    
    // }else{
    //   ///////////console.log('storedUser.id====',storedUser.id);
    //   fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
    //     const exertypInit = publicPlansDataTableItemDayNewData[activeIndex].exrTyp;
    //     setExertypInitConst(exertypInit);
    //     ///////////console.log('exertypInit fetchPublicSettings',exertypInit);
    //     if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
    //       ///////////console.log('PSettingsResults',PSettingsResults);

    //       setWrkTypTimInitSent(PSettingsResults[0].cardio);
    //       ///////////console.log('WrkTypTimInitSent cardio',WrkTypTimInitSent);
  
    //     }else if (exertypInit ==='Isolation'){
    //       setWrkTypTimInitSent(PSettingsResults[0].isoltn);
    //       ///////////console.log('WrkTypTimInitSent isoltn',WrkTypTimInitSent);
  
    //     }else if(exertypInit ==='Compound'){
    //       setWrkTypTimInitSent(PSettingsResults[0].compnd);
    //       ///////////console.log('WrkTypTimInitSent compnd',WrkTypTimInitSent);
  
    //     }
  
    //   });
      
    // }
      // Your logic here
  const end = Date.now();
  ////console.log(`setExertypInitConst Time taken: ${end - start} ms`);
  }, [activeIndex]);
  const startExercisesWithTimerDataArr = useSelector(state => state.startExercisesWithTimerData.startExercisesWithTimerData);
  ///////////console.log('WrkTypTimInitSent begin',WrkTypTimInitSent);
  const combineArrays = (data) => {
    return Object.values(data).reduce((acc, val) => {
      return acc.concat(val);
    }, []);
  };
  // useEffect(() => {
    /////////console.log('newWorkoutsFromDB',newWorkoutsFromDB); 
  // }, []);
  ///////////console.log('WrkTypTimInitSent-->>--',WrkTypTimInitSent);
  // /////////console.log('sets-------',sets);
  ///////////console.log('sets.workedExercises-------',sets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);

  const [buttonPressed, setButtonPressed] = useState(false);

  //const [timer, setTimer] = useState(120);

  //const [dayTimtimer, setDayTimtimer] = useState(0);
  // let dayTimtimer = 0;
  // New state variable to track completed sets for each workout
  const [completedSets, setCompletedSets] = useState({});
  const [lastRowPressed, setLastRowPressed] = useState(false);
  const [hideButtonClicks, setHideButtonClicks] = useState(false);

  const dispatch = useDispatch();
  const [exercisesCompleted, setExercisesCompleted] = useState(false);
  let dayTimtimer = 0;


  const lastSession = [
    {session_set:1,session_weight:10,session_reps:5},
    {session_set:2,session_weight:12,session_reps:6},
    {session_set:3,session_weight:14,session_reps:7},
    {session_set:4,session_weight:16,session_reps:8},
  ];
  const handleStoryPress = (index) => {
    setActiveIndex(index);

      // Optionally clear AsyncStorage item on unmount
      // AsyncStorage.removeItem('timeWhenZeroHit')
      //   .then(() => ////console.log('AsyncStorage item removed on unmount'))
      //   .catch(error => ////console.log('Error removing AsyncStorage item:', error));
      // // AsyncStorage.removeItem('inputValuesInAsyncStorage')
      //   .then(() => ////console.log('inputValuesInAsyncStorage items removed on unmount'))
      //   .catch(error => ////console.log('Error removing inputValuesInAsyncStorage items:', error));
    
    
    // Handle navigation or other actions here based on the selected story
  };

  useEffect(() => {
    const start = Date.now();
    
    // Your logic here

    

    
    const updatedSets = publicPlansDataTableItemDay.reduce((acc, row, i) => {
      const activeWorkoutId = publicPlansDataTableItemDayNewData[i].wrkKey;
      const wrkKey = publicPlansDataTableItemDayNewData[i].wrkKey;
      const wktNam = publicPlansDataTableItemDayNewData[i].wktNam;
      const plnKey = publicPlansDataTableItemDayNewData[i].plnKey;
      const exrTyp = publicPlansDataTableItemDayNewData[i].exrTyp;
      const exrTim = publicPlansDataTableItemDayNewData[i].exrTim;
      const images = publicPlansDataTableItemDayNewData[i].images;

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
        ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.casTim) : (0),
        isCompleted: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.isCompleted !== undefined)
          ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.isCompleted) : (false),
        timerStarted: false,
        dayTim: (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.dayTim !== undefined)
        ? (startExercisesWithTimerDataArr?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId]?.[index]?.dayTim) : 0,
        exrTyp:exrTyp,
        exrTim:exrTim,
        images:images,
        deleted:'no',
        isSync:'no'
      }));
  
      return acc;
    }, {});

    const workedExercisesArray = {
      [publicPlansDataTableItemDay[0].speKey]: {
        workedExercises: updatedSets
      }
    };
    setSets(workedExercisesArray);
    // Your logic here
    const end = Date.now();
    ////console.log(`updatedSets Time taken: ${end - start} ms`);
  }, [publicPlansDataTableItemDay, startExercisesWithTimerDataArr,userId]);
  

  
  // const allDayTimValues = [];
  // for (const workoutId in sets) {
  //   const workedExercises = sets[workoutId]?.workedExercises;
  //   if (workedExercises) {
  //     for (const exerciseId in workedExercises) {
  //       /////////console.log('exerciseId',exerciseId);
  //       const exercises = workedExercises[exerciseId];
  //       /////////console.log('exercises---',exercises);
  //       for (const exercise of exercises) {
  //         /////////console.log('-----exercise',exercise);
  //         allDayTimValues.push(exercise.dayTim);
  //       }
  //     }
  //   }
  // }
  
//   // /////////console.log('sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[0];',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[0].wrkKey][0]?.dayTim);
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
const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  useFocusEffect(
    React.useCallback(() => {
          // Fetch the latest data or update the state here
  AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);
    ///////////console.log('publicWorkoutsPlans user---->>>',storedUser.id);
    // fetchLastDayStartWorkouts(storedUser.id,publicPlansDataTableItemDayNewData[0].plnKey).then((LastDayStartWorkouts) => {
    //   ///////////console.log('LastDayStartWorkouts Table array',LastDayStartWorkouts);
    //   // setPublicWorkoutsPlanDaysTable(publicWorkoutsPlanDaysTableResults);
    //   // Call the convertToOriginalStructure function
    //     const originalStructure = convertToOriginalStructure(LastDayStartWorkouts);
    //     setSetsFromDB(originalStructure);
    //     // Output the original structure
    //     ///////////console.log("Original Structure---:", originalStructure);
    // });
    
    ////console.log('publicPlansDataTableItemDayNewData---->>>',publicPlansDataTableItemDayNewData);

    const wrkKeys = publicPlansDataTableItemDayNewData.map(item => item.wrkKey);
    //console.log('wrkKeys', wrkKeys);

    // Create an array of promises for each fetchLastDayStartWorkouts call
    const promises = wrkKeys.map(wrkKey =>
      fetchLastDayStartWorkoutsWithoutPlnKeyAndDayKey(storedUser.id, wrkKey)
    );

    // //console.log('publicPlansDataTableItemDayNewData[0].plnKey', publicPlansDataTableItemDayNewData[0].plnKey);
    // //console.log('publicPlansDataTableItemDayNewData[0].speKey', publicPlansDataTableItemDayNewData[0].speKey);

    // Wait for all promises to resolve
    Promise.all(promises)
      .then(arrayOfWorkouts => {
        // //console.log('fetchedWorkouts', fetchedWorkouts);

        // Flatten the array of arrays into a single array
        const fetchedWorkouts = arrayOfWorkouts.flat();

        /////////console.log('fetchedWorkouts', fetchedWorkouts);
        // Call the convertToOriginalStructure function
        const originalStructure = convertToOriginalStructure(fetchedWorkouts);
        // //console.log('originalStructure', originalStructure);
       
        setNewWorkoutsFromDB(originalStructure);
      })
      .catch(error => {
        ///////console.error('Error fetching workouts:', error);
      });
    
    // fetchLastDayStartWorkouts(storedUser.id,publicPlansDataTableItemDayNewData[0].plnKey,publicPlansDataTableItemDayNewData[0].dayKey,plnKey,publicPlansDataTableItemDayNewData[0].wrkKey).then((LastDayStartWorkouts) => {

    // });
    setUserId(storedUser.id);

    
   
    });
      // Page is focused
      const nowStartTime = new Date();
      setStartTime(nowStartTime);

      // Function to run on unmount (or when the page loses focus)
      
    }, [])
  );



// const timerInterval = setInterval(() => {
//   dayTimtimer += 1; // Increment the value property of the object
// }, 1000);
function allCompleted(data) {
  if (!data) {
    ///////////console.log("Data is undefined or null.");
    return false;
  }

  for (const key in data) {
    const arr = data[key];
    for (const item of arr) {
      if (!item.isCompleted) {
        return false;
      }
    }
  }
  return true;
}
// useeffect when i press on the lfet top arrow it works 

useEffect(() => {
  const start = Date.now();
  const unsubscribe = navigation.addListener('beforeRemove', () => {
    const nowEndTime = new Date();
    const timeDifference = Math.round((nowEndTime - startTime) / 1000); // Time spent in seconds
    dayTimtimer = timeDifference;
    ///////console.log('startTime leaving ', startTime);
    ///////console.log('nowEndTime leaving ', nowEndTime);
    ///////console.log('dayTimtimerRef leaving ', dayTimtimer);

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
    ///////////console.log('sets leaving ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

    // Save the dayTim value into Redux
    dispatch(updateDayTim({
      dayKey:publicPlansDataTableItemDay[0].speKey,
      workedExercises: sets,
    }));
    // AsyncStorage.removeItem('timeWhenZeroHit')
    // .then(() => ////console.log('AsyncStorage item removed on unmount'))
    // .catch(error => ////console.log('Error removing AsyncStorage item:', error));
    // AsyncStorage.removeItem('inputValuesInAsyncStorage')
    // .then(() => ////console.log('inputValuesInAsyncStorage items removed on unmount'))
    // .catch(error => ////console.log('Error removing inputValuesInAsyncStorage items:', error));



    
  });

    // Your logic here
    const end = Date.now();
    ////console.log(`unsubscribe Time taken: ${end - start} ms`);
   
  // Return cleanup function to unsubscribe from the event
  return unsubscribe;
  
    
    // Your logic here

    

}, [navigation, dispatch,updateDayTim,publicPlansDataTableItemDay,sets]);

// /////////console.log('sets.workedExercises222222-------',sets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);
    const activeWorkoutIded = publicPlansDataTableItemDayNewData[activeIndex].wrkKey;
  
    // Check if any blue check sign is pressed, and if the timer is not started, start it
    const isAnyBlueCheckPresseded = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutIded]?.some((set) => set.isCompleted);
  
    
  // useEffect(() => {
    
  //   //return () => clearInterval(intervalTwo);
  //   // Start the timer when a blue check sign is pressed
    
  //   // if (isAnyBlueCheckPressed ) {
  //   //   /////////console.log('yeeees')
  //   //   const interval = setInterval(() => {
  //   //     setTimer((prevTimer) => prevTimer - 1);
  //   //   }, 1000);
  
  //   //   return () => clearInterval(interval);
  //   // }
    
  // }, [ activeIndex, sets, publicPlansDataTableItemDayNewData]);

  const handleStartTimer = (WrkTypTimInitSent) => {
    ///////////console.log('WrkTypTimInitSent handleStartTimer',WrkTypTimInitSent)
    setWrkTypTimInitSent(WrkTypTimInitSent); // Set initial time (120 seconds)
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
  
  
  /////////console.log('sets checking>>>>>>',sets[publicPlansDataTableItemDay[0]?.speKey]?.workedExercises)
  const handleToggleComplete = (WrkTypTimInitSent,plnKey,dayKey,dayName,date,wrkKey,wktNam,setId, index, weight, reps,dayTim, array,casTim,exrTyp,exrTim,images) => {
    //console.log('handleToggleComplete weight',weight);
//console.log('handleToggleComplete reps',reps);
if(casTim == 0 || casTim == '0'){
  if (weight?.trim() == "") {
    Alert.alert(`${t("You_must_fill_Weight_field_with_numbers")}`);
    return;
  };
  if (reps?.trim() == "") {
    Alert.alert(`${t("You_must_fill_Reps_field_with_numbers")}`);
    return;
  };
}
    const activeWorkoutId = publicPlansDataTableItemDayNewData[activeIndex].wrkKey;


///////////console.log('sets before ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);
///////console.log('casTim handleToggleComplete ------------', casTim);

///////////console.log('setId handleToggleComplete ------------', setId);
    const nowEndTime = new Date();
    const timeDifference = Math.round((nowEndTime - startTime) / 1000); // Time spent in seconds
    dayTimtimer = timeDifference;
    ///////console.log('startTime handleToggleComplete ', startTime);
    ///////console.log('nowEndTime handleToggleComplete ', nowEndTime);
    ///////console.log('dayTimtimerRef handleToggleComplete ', dayTimtimer);

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
///////////console.log('sets after ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);


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
      casTim:casTim,
      exrTyp:exrTyp,
      exrTim:exrTim,
      images:images,
      deleted:'no',
      isSync:'no'
    }
    ///////////console.log('workedExercises handle toggle',workedExercises);
    // Create the new array with the incremented ID

    setSets((prevSets) => {

      const updatedSets = {
        ...prevSets,
        [publicPlansDataTableItemDay[0].speKey]: {
          workedExercises: {
            ...prevSets[publicPlansDataTableItemDay[0].speKey].workedExercises,
            [activeWorkoutId]: prevSets[publicPlansDataTableItemDay[0].speKey].workedExercises[activeWorkoutId].map((set) =>
              set.sets === setId
                ? { ...set, isCompleted: !set.isCompleted, timerStarted: !set.timerStarted, weight: weight, reps: reps,dayTim:sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim'],casTim:casTim }
                : set
            ),
          },
        },
      };
      
      ///////////console.log('updatedSets handle toggle',updatedSets[publicPlansDataTableItemDay[0].speKey].workedExercises);

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
   
    // if ( allSetsCompleted && activeIndex === publicPlansDataTableItemDay?.length - 1 ) {
    //   setLastRowPressed(true);
    //   Alert.alert('You did your workout, Good Worked');
    // }
    
    const isAllCompleted = allCompleted(updatedSets[publicPlansDataTableItemDay[0].speKey]?.workedExercises);
    ///////////console.log("Are all completed?", isAllCompleted);
    if ( isAllCompleted ) {
      setLastRowPressed(true);
      const combinedArray = combineArrays(updatedSets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);
      // Output the combined array
      ///////////console.log("Combined Array:", combinedArray);
      insertPlansStartWorkout(combinedArray).then((result)=>{
        ///////////console.log('insertPlansStartWorkout into database successfully',result);
        ///////console.log("todayDate:", todayDate);
        
      return updateWorkoutByChangingStatusToSkippedOrDone(userId, publicPlansDataTableItemDay?.[0]?.speKey,publicPlansDataTableItemDay?.[0]?.plnKey,"done",todayDate);
      
      })
      .then((updateWorkoutStatusResult) => {
        // Update the state with the updated PublicWorkoutsPlanDaysTableArray
        Alert.alert(`${t(' ')}`,
        `${t('You_Completed_All_exercises_successfully')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.navigate('BeginWorkout');
              
              navigation.dispatch(StackActions.pop(2));
              dispatch(deleteKeyObject({
                  dayKey:publicPlansDataTableItemDay[0].speKey
                }));
            },
          },
        ],
        { cancelable: false }
      );
        // setSkippedButtonPressed(true);
      })
      .catch((error) => {
        Alert.alert(` `,
        error);
      });
      
      
    }
    ///////////console.log('return just updatedSets',updatedSets); 
    ///////////console.log('return updatedSets',updatedSets[publicPlansDataTableItemDay[0].speKey].workedExercises);

      return updatedSets;
    });
    ///////////console.log('return sets inside',sets[publicPlansDataTableItemDay[0].speKey].workedExercises);


    dispatch(updateDayTim({
      dayKey: publicPlansDataTableItemDay[0].speKey,
      workedExercises: sets,
      activeWorkoutId: activeWorkoutId,
    }));
    ///////////console.log('workedExercises after updateDayTim------------', workedExercises);

    dispatch(updateSet({
      dayKey: dayKey,
      workedExercises: workedExercises,
      activeWorkoutId: activeWorkoutId,
    }));

    // Handle the timer logic here
    const set = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[activeWorkoutId].find((s) => s.sets === setId);
    if (set && !set.timerStarted) {
      const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
      const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
      const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeWorkoutId}`;
      const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
      
       AsyncStorage.removeItem(key);
       AsyncStorage.removeItem(savedLiveTimer);
       handleStartTimer(WrkTypTimInitSent);


    } else {
      // handleCompleteSet();
    }
};
///////////console.log('sets checking2222>>>>>>',sets[publicPlansDataTableItemDay[0]?.speKey]?.workedExercises)
///button with the skip and compelete options ///
const onPressWorkoutButtonoptions = () => { 
  const cancelButtonIndex = -1;
  const options = [`${t("skip_workout")}`, `${t("Complete_workout")}`];
  showActionSheetWithOptions({
    options,
    cancelButtonIndex,
  }, (selectedIndex) => {
    switch (selectedIndex) {
      case 0:
        handleSkipWorkoutAlert();
        break;

      case 1:
        handleCompleteExercises();
        break;
      
      case cancelButtonIndex:
        // Canceled
    }});
}
const handleSkipWorkoutAlert = () => {

  Alert.alert(
    ``,
    `${t('Are_you_sure_you_want_to_skip_the_workout')}`,
    [
      {
        text: `${t('OK')}`,
        onPress: () => {
          newSkippedCompleted();
        },
      },
      {
        text: `${t('Cancel')}`,
        onPress: () => {},
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
  }
const newSkippedCompleted =()=>{
  ////console.log('publicPlansDataTableItemDayNewData newSkippedCompleted',publicPlansDataTableItemDayNewData);
  ////console.log('userId newSkippedCompleted',userId);

  const speKey = publicPlansDataTableItemDayNewData[0]?.speKey;
  const plnKey = publicPlansDataTableItemDayNewData[0]?.plnKey;
  const lstUpd = publicPlansDataTableItemDayNewData[0]?.lstUpd;
  ////console.log('speKey newSkippedCompleted',speKey);
  ////console.log('plnKey newSkippedCompleted',plnKey);
  ////console.log('lstUpd newSkippedCompleted',lstUpd);

  
  ///updateWorkoutByChangingStatusToSkippedOrDone(userId, speKey, plnKey,status,lastDate)
  updateWorkoutByChangingStatusToSkippedOrDone(userId, speKey, plnKey,"skipped",lstUpd)
    .then((result) => {
      ////////console.log('Day Workouts deleted turned into yes successfully', result);
      Alert.alert(``,
        `${t('you_skipped_the_workout')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.navigate('BeginWorkout');
              
              navigation.dispatch(StackActions.pop(2));
              dispatch(deleteKeyObject({
                dayKey:speKey
              }));
            },
          },
        ],
        { cancelable: false }
      );
    })
    .catch((error) => {
      Alert.alert(``,
      error);
    });

}
const handleCompleteExercises = () => {
  setButtonPressed(true);
  setHideButtonClicks(true);
  const nowEndTime = new Date();
    const timeDifference = Math.round((nowEndTime - startTime) / 1000); // Time spent in seconds
    dayTimtimer = timeDifference;
    ///////console.log('startTime handleCompleteExercises ', startTime);
    ///////console.log('nowEndTime handleCompleteExercises ', nowEndTime);
    ///////console.log('dayTimtimerRef handleCompleteExercises ', dayTimtimer);
  ///////////console.log('handleCompleteExercises sets before ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);
  ///////////console.log('dayTim:sets[publicPlansDataTableItemDay[0].speKey]',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim'] + dayTimtimer);
  ///////////console.log('sets[publicPlansDataTableItemDay[0].speKey] daytim',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim']);

  // Loop through all exercises and sets in the sets array and fill empty values with 0
  const updatedSets = Object.keys(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises).reduce((acc, exerciseId) => {
    const updatedExerciseSets = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[exerciseId]?.map((set) => ({
      ...set,
      weight: set.weight === '' ? '0' : set.weight,
      reps: set.reps === '' ? '0' : set.reps,
      casTim : set.casTim === undefined || set.casTim === "" || set.casTim === "0" || set.casTim === 0 ? 0 : set.casTim,
      isCompleted:true,
      timerStarted: false,
      dayTim:sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim'] + dayTimtimer
    }));
    acc[exerciseId] = updatedExerciseSets;
    return acc;
  }, {});
  ///////////console.log('handleCompleteExercises updatedSets before ------------', updatedSets);

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
  // Clear the interval when exercises are completed
    // clearInterval(timerInterval);
  // Show the alert
  ///////////console.log('after clearInterval dayTimtimer',dayTimtimer);

  ///////////console.log('after clearInterval daytim',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim']);
  const isAllCompleted = allCompleted(updatedSets);
    ///////////console.log("Are all completed 2222?", isAllCompleted);
      setLastRowPressed(true);
      const combinedArray = combineArrays(updatedSets);
      // Output the combined array
      ///////////console.log("Combined Array2222:", combinedArray);
      insertPlansStartWorkout(combinedArray).then((result)=>{
        ///////////console.log('insertPlansStartWorkout into database successfully',result);
        
      return updateWorkoutByChangingStatusToSkippedOrDone(userId, publicPlansDataTableItemDay?.[0]?.speKey,publicPlansDataTableItemDay?.[0]?.plnKey,"done",todayDate);
      
      })
      .then((updateWorkoutStatusResult) => {
        // Update the state with the updated PublicWorkoutsPlanDaysTableArray
        Alert.alert(`${t(' ')}`,
        `${t('You_Completed_All_exercises_successfully')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // navigation.navigate('BeginWorkout');
              
              navigation.dispatch(StackActions.pop(2));
              dispatch(deleteKeyObject({
                dayKey:publicPlansDataTableItemDay[0].speKey
              }));
            },
          },
        ],
        { cancelable: false }
      );
        // setSkippedButtonPressed(true);
      }).catch((error) => {
        Alert.alert('Error',
        error);
        setHideButtonClicks(false);
      });
      
      

};

// // Add a useEffect hook to listen for changes in startExercisesWithTimerData
// useEffect(() => {
//   // When exercises are completed, show the alert
//   if (exercisesCompleted) {
//     clearInterval(timerInterval);
//     /////////console.log('if (exercisesCompleted) ',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDay[0].wrkKey][0]['dayTim']);
//     /////////console.log('if (exercisesCompleted)dayTimtimer ',dayTimtimer);

//     Alert.alert(
//       'Good work',
//       'You completed your exercises!',
//       [
//         {
//           text: 'OK',
//           onPress: () => {
//             clearInterval(timerInterval);
//             /////////console.log('okkk (exercisesCompleted) ',dayTimtimer);
//             navigation.navigate('BeginWorkout');

//           },
//         },
//       ],
//       { cancelable: false }
//     );
//     setExercisesCompleted(false); // Reset the state
//   }
// }, [startExercisesWithTimerDataArr]); // Listen for changes in startExercisesWithTimerData
function isImageUrl(url) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
  const lowercasedUrl = url?.toLowerCase();
  return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
}   
// const RenderItem = ({ item, index, updateDraggingPosition }) => {
//   const position = useRef(new Animated.ValueXY()).current;
//   const [dragging, setDragging] = useState(false);
//   const [originalIndex, setOriginalIndex] = useState(index); // Store original index for resetting

//   const panResponder = useRef(
//     PanResponder.create({
//         onStartShouldSetPanResponder: () => !dragging,  // Do not start drag if dragging is disabled
//         onMoveShouldSetPanResponder: () => !dragging,   // Same here
//         onPanResponderGrant: () => {
//           setDragging(true);
//           setOriginalIndex(index); // Store the original index on drag start
//           // position.setValue({ x: 0, y: 0 }); // Reset position on drag start
//         },
//         onPanResponderMove: Animated.event(
//             [
//                 null,
//                 {
//                     dx: position.x,
//                     dy: new Animated.Value(0), // Lock vertical movement by setting dy to 0

//                     // dy: position.y,
//                 },
//             ],
//             { useNativeDriver: false }
//         ),
//       onPanResponderRelease: (e, gestureState) => {
//         const newIndex = updateDraggingPosition(e.nativeEvent.pageX, e.nativeEvent.pageY, index);

//         if (newIndex !== originalIndex) {
//           // If a valid replacement occurred, swap the items.
//           moveItem(originalIndex, newIndex);
//         } else {
//          // Return item to its original position if no swap happened
//          const targetPosition = positions[originalIndex]; // Ensure we get the original position

//             Animated.spring(position, {
//               toValue: { x: targetPosition?.x - listLayout?.x || 0, y: 0 },
//               friction: 6,  // Control how bouncy the return animation is
//               tension: 40,  // Control the speed of the return animation
//               useNativeDriver: false
//             }).start();
//         }
      
//         setDragging(false); // Disable dragging
//         },
//       })
//     ).current;

//   // Measure item layout and store it in the positions array
//    const onLayout = (event) => {
//     const layout = event.nativeEvent.layout;
//     ///////console.log(`Item ${index} layout:`, layout); // Log the layout measurements
//     positions[index] = {
//       x: layout.x,
//       y: layout.y,
//       width: layout.width,
//       height: layout.height,
//     };
//   };

//   return (
//     <Animated.View
//       style={[
//         {
//           marginRight: 10,
//           alignItems: "center",
//           flexWrap: "wrap",
//           transform: position.getTranslateTransform(),
//           opacity: dragging ? 0.8 : 1,
//         },
//       ]}
//       {...panResponder.panHandlers}
//       onLayout={onLayout} // Attach the onLayout function

//     >
//       <TouchableOpacity
//         key={index}
//         style={[
//           styles.storyItem,
//           index === activeIndex && styles.activeStory,
//           ((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || index + 1 === publicPlansDataTableItemDayNewData[index].wrkKey)) && { opacity: 0.5 },
//         ]}
//         onPress={() => {
//           handleStoryPress(index);
//           handleStartTimer(WrkTypTimInitSent);
//         }}
//       >
//         <Image
//           style={{ height: 80, width: "100%", borderRadius: 23 }}
//           source={
//             item?.images.startsWith('../../../../assets/images')
//               ? mainWorkoutsData[item?.wrkKey - 1]?.images
//               : item?.images.startsWith('file:///data/user')
//               ? { uri: item?.images }
//               : require('../../../../assets/gym-workout.png')
//           }
//         />
//         {((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || index + 1 === publicPlansDataTableItemDayNewData[index].wrkKey)) && (
//           <Text style={{ color: 'green', position: 'absolute', top: '50%', left: '50%', marginLeft: -8, marginTop: -8 }}>✔✔</Text>
//         )}
//       </TouchableOpacity>
//       <View style={{ maxWidth: 80 }}>
//         <Text style={{ color: "black", fontSize: 14, marginTop: 10 }}>
//           {item.wktNam}
//         </Text>
//       </View>
//       {(index === activeIndex)?(

//         <TouchableWithoutFeedback
//           onPressIn={() => setDragging(false)}  // Disable dragging when pressing the button
//           onPressOut={() => setDragging(true)}  // Re-enable dragging after pressing
//         >
//             <TouchableOpacity  style={{backgroundColor:'transparent',marginTop:5,borderWidth:1,borderColor:"black",borderRadius:10,width:80,height:30, alignItems: 'center', justifyContent: 'center',paddingTop:2,paddingBottom:2}}  onPress={() => navigation.navigate('WorkoutName', { item: item })}>
//               <MaterialCommunityIcons name="eye-settings" size={24} color="black" style={{ textAlign:'center' }}/>
//             </TouchableOpacity>
//         </TouchableWithoutFeedback>
//       ):(null)}
      
//     </Animated.View>
//   );
// };
const RenderItem = ({ item, index }) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);
  const [originalIndex, setOriginalIndex] = useState(index); // Store original index for resetting

  
//////////////Start check if the image in the local database////
const [localImageInMemory, setLocalImageInMemory] = useState(false);

  useEffect(() => {
    const checkImageInMemory = async () => {
      let parsedDataImages = null;
      try {
        parsedDataImages = JSON.parse(item?.images);
      } catch (error) {
        // console.error("Failed to parse item?.images:", error);
      }

      if (parsedDataImages?.LocalImageUrl) {
        const exists = await isImageInMemory(parsedDataImages.LocalImageUrl);
        setLocalImageInMemory(exists);
      }
    };

    checkImageInMemory();
  }, [item?.images]);

//////////////End check if the image in the local database////

  return (
    <View
      style={[
        {
          marginRight: 10,
          alignItems: "center",
          flexWrap: "wrap",
          
        },
      ]}
     

    >
      <TouchableOpacity
        key={index}
        style={[
          styles.storyItem,
          index === activeIndex && styles.activeStory,
          ((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || index + 1 === publicPlansDataTableItemDayNewData[index].wrkKey)) && { opacity: 0.5 },
        ]}
        onPress={() => {
          handleStoryPress(index);
          handleStartTimer(WrkTypTimInitSent);
        }}
      >
            <>
              {
                (isImageUrl(item?.images)) ? (
                  
                  <Image
                          source={
                            item?.images?.startsWith('../../../../assets/images')
                                ? mainWorkoutsData[item?.wrkKey-1]?.images
                                : item?.images?.startsWith('file:///data/user')
                                ? { uri: item?.images }
                                : item?.images.startsWith('https://www.elementdevelops.com')
                                ? { uri: item?.images }
                                : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                : require('../../../../assets/gym-workout.png')
                            }   
                            style={{ height: 80, width: "100%", borderRadius: 23 }}

                        />
                        
                  

                ) : (
                  (() => {
                    let parsedDataImages;

                    try {
                      parsedDataImages = JSON.parse(item?.images);
                      {/* console.log("parsedData TRAINEEE-------:", parsedDataImages); */}
                    } catch (error) {
                      {/* console.error("Failed to parse item?.images:", error); */}
                      parsedDataImages = null;
                    }
                    
                    {/* console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl); */}

                    
                if (localImageInMemory == true && parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
                  return (
                    <>
                    {(isImageUrl(parsedDataImages?.LocalImageUrl))&& (
                      <Image
                      style={{ height: 80, width: "100%", borderRadius: 23 }}
                              source={{
                                uri: parsedDataImages?.LocalImageUrl
                              }}

                              />
                      
                    )}
                  </>
                
                  );
                }else if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null ) {
                  return (
                    <>
                    {(isImageUrl(parsedDataImages?.CloudFlareImageUrl) )&& (
                      <Image
                              source={{
                                uri: parsedDataImages?.CloudFlareImageUrl.replace(
                                  'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                                  'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                                )
                              }}
                              style={{ height: 80, width: "100%", borderRadius: 23 }}

                              />
                      
                    )}
                  </>
                
                  );
                } else {
                      return (
                        <Image
                          source={require("../../../../assets/gym-workout.png")}
                          style={{ height: 80, width: "100%", borderRadius: 23 }}

                          />
                      );
                    }
                  })()
                )
              }
              </>
        {((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[index].wrkKey]?.every((set) => set.isCompleted) || index + 1 === publicPlansDataTableItemDayNewData[index].wrkKey)) && (
          <Text style={{ color: 'green', position: 'absolute', top: '50%', left: '50%', marginLeft: -8, marginTop: -8 }}>✔✔</Text>
        )}
      </TouchableOpacity>
      <View style={{ maxWidth: 80 }}>
        <Text style={{ color: "black", fontSize: 14, marginTop: 10 }}>
          {item.wktNam}
        </Text>
      </View>
      {(index === activeIndex)?(

            <TouchableOpacity  style={{backgroundColor:'transparent',marginTop:5,borderWidth:1,borderColor:"black",borderRadius:10,width:80,height:30, alignItems: 'center', justifyContent: 'center',paddingTop:2,paddingBottom:2}}  onPress={() => navigation.navigate('WorkoutName', { item: item })}>
              <MaterialCommunityIcons name="eye-settings" size={24} color="black" style={{ textAlign:'center' }}/>
            </TouchableOpacity>
      ):(null)}
      
    </View>
  );
};
// the code worked here if you make a delete stop hereeeeeeeeeeeeeeeeeee
  const handleInputFocus = () => {
    ///////////console.log('Current dayTimer foucs value:', dayTimtimer);
    ///////////console.log('sets before ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);

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
///////////console.log('sets after ------------', sets[publicPlansDataTableItemDay[0].speKey].workedExercises);
///////////console.log('Current dayTimer after zero value:', dayTimtimer);

  };
///////////console.log('exertypInitConst---',exertypInitConst);


const WorkoutsInputs = ({sets,publicPlansDataTableItemDay,publicPlansDataTableItemDayNewData,activeIndex,handleToggleComplete,WrkTypTimInitSent,navigation}, ref)=>{
  {/* Rows */}
  const [inputValues, setInputValues] = useState({});
  // Expose `inputValues` and `setInputValues` to the parent component via `ref`
  // useImperativeHandle(ref, () => ({
  //   getInputValues: () => inputValues,
  //   setInputValues: (newValues) => setInputValues(newValues),
  // }));

  const [middleInputValues, setMiddleInputValues] = useState([]);

  const [activeTimerIndex, setActiveTimerIndex] = useState(null);

  const [barBelWeight, setBarBelWeight] = useState('');
  const [dumbellWeight, setDumbellWeight] = useState('');
  const [FreWitWeight, setFreWitWeight] = useState('');
  const [bandsWeight, setBandsWeight] = useState('');
  const [weightFromWorkoutSettingsNumber, setWeightFromWorkoutSettingsNumber] = useState(""); // Replace with your dynamic number

  useFocusEffect(
    useCallback(() => {
    AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);

    
      if(Object.keys(context.stateUser.userPublicSettings).length > 0){
        ////console.log('parseInt context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);

        ////console.log('parseInt FreWit context',parseInt(context.stateUser.userPublicSettings?.FreWit));
        ////console.log('parseInt barBel context',parseInt(context.stateUser.userPublicSettings?.barBel));
        ////console.log('parseInt bands context',parseInt(context.stateUser.userPublicSettings?.bands));
        ////console.log('parseInt dumbel context',parseInt(context.stateUser.userPublicSettings?.dumbel));
    
        if(
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "EZ barbell" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Traps bar" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Straight Bar" 
        ){
          setWeightFromWorkoutSettingsNumber(context.stateUser.userPublicSettings?.barBel);
          ////console.log('context.stateUser.userPublicSettings?.barBel heeere',context.stateUser.userPublicSettings?.barBel)
        }else if(
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Resistance Band" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Weighted Belts"
        ){
          setWeightFromWorkoutSettingsNumber(context.stateUser.userPublicSettings?.bands);
          ////console.log('context.stateUser.userPublicSettings?.bands heeere',context.stateUser.userPublicSettings?.bands);
    
        }else if(
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "dumbbells" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "kettle bells" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Exercise ball" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Plate" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Sand bag"
        ){
          setWeightFromWorkoutSettingsNumber(context.stateUser.userPublicSettings?.dumbel);
          ////console.log('context.stateUser.userPublicSettings?.dumbel heeere',context.stateUser.userPublicSettings?.dumbel);
    
        }else if(
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Free Weight" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Jumping Rope" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Rings" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Jump box" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Parallettes" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Ab wheel" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Sled"||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Bosu Ball" ||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Rope Climbing"||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Battle Rope"||
          publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Tires"
        ){
          setWeightFromWorkoutSettingsNumber(context.stateUser.userPublicSettings?.FreWit);
          ////console.log('context.stateUser.userPublicSettings?.FreWit heeere',context.stateUser.userPublicSettings?.FreWit);
    
        }
        
          setFreWitWeight(parseInt(context.stateUser.userPublicSettings?.FreWit));
          setBarBelWeight(parseInt(context.stateUser.userPublicSettings?.barBel));
          setBandsWeight(parseInt(context.stateUser.userPublicSettings?.bands));
          setDumbellWeight(parseInt(context.stateUser.userPublicSettings?.dumbel));
        }else{
            fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
              ////console.log('parseInt PSettingsResults',PSettingsResults);

             ////console.log('parseInt FreWit PSettingsResults',parseInt(PSettingsResults[0]?.FreWit));
            ////console.log('parseInt barBel PSettingsResults',parseInt(PSettingsResults[0]?.barBel));
            ////console.log('parseInt bands PSettingsResults',parseInt(PSettingsResults[0]?.bands));
            ////console.log('parseInt dumbel PSettingsResults',parseInt(PSettingsResults[0]?.dumbel));
            if(
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "EZ barbell" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Traps bar" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Straight Bar" 
            ){
              setWeightFromWorkoutSettingsNumber(PSettingsResults[0]?.barBel);
              ////console.log('PSettingsResults[0]?.barBel heeere',PSettingsResults[0]?.barBel)
            }else if(
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Resistance Band" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Weighted Belts"
            ){
              setWeightFromWorkoutSettingsNumber(PSettingsResults[0]?.bands);
              ////console.log('PSettingsResults[0]?.bands heeere',PSettingsResults[0]?.bands);
        
            }else if(
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "dumbbells" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "kettle bells" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Exercise ball" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Plate" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Sand bag"
            ){
              setWeightFromWorkoutSettingsNumber(PSettingsResults[0]?.dumbel);
              ////console.log('PSettingsResults[0]?.dumbel heeere',PSettingsResults[0]?.dumbel);
        
            }else if(
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Free Weight" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Jumping Rope" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Rings" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Jump box" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Parallettes" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Ab wheel" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Sled"||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Bosu Ball" ||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Rope Climbing"||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Battle Rope"||
              publicPlansDataTableItemDayNewData[activeIndex]?.witUsd == "Tires"
            ){
              setWeightFromWorkoutSettingsNumber(PSettingsResults[0]?.FreWit);
              ////console.log('PSettingsResults[0]?.FreWit heeere',PSettingsResults[0]?.FreWit);
        
            }
            
            setFreWitWeight(parseInt(PSettingsResults[0]?.FreWit));
            setBarBelWeight(parseInt(PSettingsResults[0]?.barBel));
            setBandsWeight(parseInt(PSettingsResults[0]?.bands));
            setDumbellWeight(parseInt(PSettingsResults[0]?.dumbel));
    
      
          });
    
          }
          });
    
    }, [context,activeIndex])
  );

  // const debouncedUpdate = useRef(
   
  //   debounce(( activeTimerIndex) => {
  //     // ////console.log('Debounced inputValues:', inputValues);
  //     // ////console.log('Debounced activeTimerIndex:', activeTimerIndex);
  //   }, 1000) // Adjust the delay as needed
  // ).current;
  useEffect(() => {
    ///////////console.log('inside -----',inputValues);
    ///////console.log('activeTimerIndex(index)',activeTimerIndex);
    // const start = Date.now();
    
    // Your logic here
    ////console.log('WorkoutsInputs inputValues-----',inputValues);
    ////console.log('WorkoutsInputs FreWitWeight-----',FreWitWeight);
    ////console.log('WorkoutsInputs barBelWeight-----',barBelWeight);
    ////console.log('WorkoutsInputs bandsWeight-----',bandsWeight);
    ////console.log('WorkoutsInputs dumbellWeight-----',dumbellWeight);


    // Your logic here
    // const end = Date.now();
    ////console.log(`WorkoutsInputs Time taken: ${end - start} ms`);
    ////console.log('publicPlansDataTableItemDayNewData',publicPlansDataTableItemDayNewData);

  }, [inputValues]);
  // useEffect(() => {
  //   //barBelWeight, dumbellWeight,FreWitWeight,bandsWeight

   
  // }, [activeIndex]);
///Start new custom Selector with inputs for Weight///

  const [selectorInputSelectedIndex, setSelectorInputSelectedIndex] = useState([]);
  const [selectorInputNumberInput, setSelectorInputNumberInput] = useState('');
  const [selectorInputVisible, setSelectorInputVisible] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState(null);

//  const selectorInputData = [
//   '5',
//   '10',
//   '15',
//   '20',
//   '25',
//   '30',
//   '35',
//   '40',
//   '45',
//   '50',
//   'custom weight',
// ];


// Generate the list dynamically based on the input number
const generateOptions = (num) => {
  let selectorInputData = [];
  for (let i = 0; i < 31; i++) {

    // if (i ==0 ){
    //   selectorInputData.push('custom weight');  // Option titles will start from 0

    // }
    // if (i >0 && i<=31 ){
        // options.push({ title: `${(i-1) * num}` });// Option titles will start from 0
  //         //console.log('selectorInputData i',i);
  //         //console.log('selectorInputData num',num);

  // //console.log('selectorInputData i,i * num',i,i * num);

        selectorInputData.push(`${i * num}`);
      // }
  }
  return selectorInputData;
};

const selectorInputData = generateOptions(weightFromWorkoutSettingsNumber || 5);

const toggleModal = (index) =>{
  ////console.log('toggleModal index',index);
    setSelectorInputVisible(!selectorInputVisible);
  
   
};
const handleSelect = (index) => {
  selectorInputSelectedIndex(index);
  toggleModal(); // Open the Modal after selecting
};
///End new custom Selector with inputs for Weight///


///Start new custom Selector with inputs///

  const [selectorRepsSelectedIndex, setSelectorRepsSelectedIndex] = useState({});
  
  // const [activeRowIndex, setActiveRowIndex] = useState(null);

 const selectorRepsData = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50'
];


return(
  <View>
    {publicPlansDataTableItemDay.map((row, i) => {
        {/* FreWitWeight,barBelWeight,bandsWeight */}
      {/* useEffect(() => { */}
      {/* //console.log('publicPlansDataTableItemDay row',row); */}
    {/* (row?.witUsd == 'dumbbells')?():() */}
  {/* }, []); */}

      return (  
      <View key={row.wrkKey} style={{ display: activeIndex === i ? 'flex' : 'none' }}>
        {sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[i].wrkKey]?.map((set, index, array) => {
      /////////console.log('inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight',inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight);
      /////////console.log('inputValues',inputValues);
      /////////console.log('publicPlansDataTableItemDay',publicPlansDataTableItemDay);
      /////////console.log('publicPlansDataTableItemDayNewData',publicPlansDataTableItemDayNewData);
      /////////console.log('sets',sets);
    ////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
      /////////console.log('index',index);
      {/* useEffect(() => {

        setInputValues((prevInputValues) => {
        const newInputValues = [...prevInputValues];
        newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
          ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
          [index]: {
            ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[index],
            weight: inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.id]?.[index]?.weight ? inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.id]?.[index]?.weight : (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight) ? (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight).toString() : newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight  ? newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight : "",

          },
        };
        return newInputValues;
      })
  }, []); */}

       {/* useFocusEffect(
    useCallback(() => {
      setInputValues((prevInputValues) => {
        const newInputValues = [...prevInputValues];
        newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
          ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
          [index]: {
            ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[index],
            weight: inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.id]?.[index]?.weight ? inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.id]?.[index]?.weight : (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight) ? (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight).toString() : newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight  ? newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight : "",

          },
        };
        return newInputValues;
      })
  }, [])
   ); */}
   useEffect(() => {

    // Log the data coming from the database
    {/* //console.log("Database data:", publicPlansDataTableItemDayNewData, newWorkoutsFromDB);
    //console.log("Database data inputValues====",inputValues);
    //console.log("Database data inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight:", inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight);
    //console.log("Database data inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight:", inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight);
    //console.log("snewWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight:", newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight);
    //console.log("snewWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps:", newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps);
 */}

    // Fetch or set data logic
    setInputValues((prevInputValues) => {
  const newInputValues = {...prevInputValues};
  {/* //console.log("before if i--====:", i);
  //console.log("before if publicPlansDataTableItemDayNewData?.[i]--====:", publicPlansDataTableItemDayNewData?.[i]); */}

  // Ensure activeIndex and publicPlansDataTableItemDayNewData have valid data
  if (publicPlansDataTableItemDayNewData?.[i]) {
    const currentId = publicPlansDataTableItemDayNewData[i].wrkKey;
    {/* //console.log("before if currentId--====:", currentId);
    //console.log("before if newWorkoutsFromDB===--====:", newWorkoutsFromDB); */}

    // Loop over the exercises (if multiple)

      let workoutData = '';
      // Check if data exists for current index and wrkKey
      if (newWorkoutsFromDB?.[currentId]?.[index] !== undefined) {
        workoutData = newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey][index];
        {/* //console.log("if inside workoutData--====:", workoutData); */}
      }
        // Get the weight and reps for the current exercise
        const weight = (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight) 
          ? (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight).toString()
          : workoutData?.weight ? workoutData?.weight.toString() : "";
          //console.log("if inside weight--====:", weight);

        const reps = (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps) 
          ? (sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps).toString()
          : workoutData?.reps ? workoutData?.reps.toString() : "";
          {/* //console.log("if inside reps--====:", reps);
      //console.log("if inside index--====:", index); */}

        // Update the input values for this exercise
        newInputValues[currentId] = {
          ...(newInputValues[currentId] || {}),
          [index]: {
            ...newInputValues[currentId]?.[index],
            weight: weight,
            reps: reps,  // Also update reps here
          },
        };
        //console.log(" after if inside newInputValues--====:", newInputValues);

      
   
  }

  return newInputValues;
});
{/* //console.log('sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps',sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps); */}

{/* const RepsFromDBIndex = sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps ?  selectorRepsData.indexOf(sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps) : newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps ? selectorRepsData.indexOf(newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps) : ""; */}
        // Calculate Reps Index from DB
  const repsFromSets = sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps?.toString();
  const repsFromDB = newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.reps?.toString();
  const weightFromSets = sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight?.toString();
  const weightFromDB = newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight?.toString();
  {/* //console.log('weightFromSets===:',i, weightFromSets);
  //console.log('weightFromDB===:',i, weightFromDB); */}
  const weightValue = weightFromSets || weightFromDB;
  {/* //console.log('weightValue===:', weightValue); */}

  const repsValue = repsFromSets || repsFromDB;
  {/* //console.log('repsValue===:', repsValue); */}

  const RepsFromDBIndex = selectorRepsData.indexOf(repsValue); // Get index of the reps from DB
  const WeightFromDBIndex = selectorInputData.indexOf(weightValue); // Get index of the reps from DB
  {/* //console.log('Type of weightValue:', typeof weightValue);
        //console.log('Type of selectorInputData[0]:', typeof selectorInputData[0]);
        //console.log('selectorInputData:', selectorInputData);
  //console.log('WeightFromDBIndex===:', WeightFromDBIndex); */}

  {/* //console.log('RepsFromDBIndex===:', RepsFromDBIndex); */}

  // Ensure both currentId and RepsFromDBIndex are valid
const currentId = publicPlansDataTableItemDayNewData[i]?.wrkKey;
{/* //console.log('setSelectorRepsSelectedIndex currentId===:', currentId); */}

if (currentId && WeightFromDBIndex !== -1) {
  setSelectorInputSelectedIndex((prevSelectedIndex) => {
    const newSelectedIndex = { ...prevSelectedIndex };
    {/* //console.log('setSelectorRepsSelectedIndex prevSelectedIndex===:', prevSelectedIndex);
    //console.log(' setSelectorRepsSelectedIndex Before update newSelectedIndex===:', newSelectedIndex); */}
    {/* //console.log('WeightFromDBIndex newSelectedIndex===:', newSelectedIndex); */}

    // Update the selected index for the currentId and index
    newSelectedIndex[currentId] = {
      ...(newSelectedIndex[currentId] || {}),
      [index]: {
        ...newSelectedIndex[currentId]?.[index],
        selectedIndeValue: { row: WeightFromDBIndex },  // Ensure selectedIndeValue contains `row`
      },
    };
    {/* //console.log('setSelectorRepsSelectedIndex  After update newSelectedIndex===:', newSelectedIndex); */}

    return newSelectedIndex;
  });

}
if (currentId && RepsFromDBIndex !== -1) {
  setSelectorRepsSelectedIndex((prevSelectedIndex) => {
    const newSelectedIndex = { ...prevSelectedIndex };
    {/* //console.log('setSelectorRepsSelectedIndex prevSelectedIndex===:', prevSelectedIndex);
    //console.log(' setSelectorRepsSelectedIndex Before update newSelectedIndex===:', newSelectedIndex); */}

    // Update the selected index for the currentId and index
    newSelectedIndex[currentId] = {
      ...(newSelectedIndex[currentId] || {}),
      [index]: {
        ...newSelectedIndex[currentId]?.[index],
        selectedIndeValue: { row: RepsFromDBIndex },  // Ensure selectedIndeValue contains `row`
      },
    };
    {/* //console.log('setSelectorRepsSelectedIndex  After update newSelectedIndex===:', newSelectedIndex); */}

    return newSelectedIndex;
  });

}

{/* //console.log('setSelectorRepsSelectedIndex selectorRepsSelectedIndex---', selectorRepsSelectedIndex);
//console.log('setSelectorRepsSelectedIndex selectorRepsData[selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[i].id]?.[index]---', selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[i].wrkKey]?.[index]); */}


}, [i, index]); 

    ///////////console.log('inside -----',inputValues);
    ///////console.log('activeTimerIndex(index)',activeTimerIndex);
    ////console.log('selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row == 10',selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row);
    ////console.log('selectorInputSelectedIndex@@@',selectorInputSelectedIndex);

    ////console.log('inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight',inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight);
    ////console.log('inputValues@@@',inputValues);
    ////console.log('@@@index@@@',index);

    ////console.log('selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]',selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]);
    ////console.log('selectorInputData@@@',selectorInputData);
    ////console.log('sets@@@',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight);

    
    // (selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row == 10
    //   && 
    //   inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight)?(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight):(selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row])}
      
  {/* //console.log('newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData[i].wrkKey][index]?.weight',index,newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData?.[i]?.wrkKey]?.[index]?.weight); */}
        return(
    <View key={`${row.wrkKey}-${index}`} style={[styles.row,styles.InputsRows]}>
      <Text style={[styles.cell,isArabic ? styles.ArabicSetsBoddy : styles.EnglishSetsBoddy]}>{set.sets}</Text>
      

      
            {row?.exrTyp === 'Cardio' || row?.exrTyp === 'Stability' ? (
              <SecondTimer
                      onChangeInputValues={setInputValues}
                      index={index}
                      publicPlansDataTableItemDayNewData={publicPlansDataTableItemDayNewData}
                      activeIndex={activeIndex}
                      set={set}
                      activeTimerIndex={activeTimerIndex}
                      setActiveTimerIndex={setActiveTimerIndex}
                      publicPlansDataTableItemDay={publicPlansDataTableItemDay}
                      navigation={navigation}
                    />
            ) : row?.exrTyp === '' ? (
              <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicBodyLoading : styles.EnglishBodyLoading]}>{t("Loading")}...</Text>
            ) : (
              <>

              {/* custom Selector with input  */}
                {/* <Select
                  selectedIndex={selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue}
                  value={ (selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row == 0
                  && 
                  inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight)?
                  (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight?.toString()):
                  ((selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]) ? (selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]):
                  ((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight) ? (
                    sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight
                  ):(null) ) )}
                  disabled={set.isCompleted}  // Disable the Select component when !set.isCompleted

                  // value={ inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight}
                  onSelect={(selectedIndexManual) => {
                    if (selectedIndexManual.row === 0) {
                      ////console.log('selectorInputSelectedIndex Select',selectorInputSelectedIndex);
                      ////console.log('selectorInputSelectedIndex selectedIndeValue',selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue);
                      ////console.log('selectorInputSelectedIndex selectedIndeValue?.row',selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row);
                      setActiveRowIndex(index);

                      toggleModal(index);
                      setSelectorInputSelectedIndex((prevSelectedIndex) => {
                        ////console.log('selectorInputSelectedIndex index',index);

                            const newSelectedIndex = [...prevSelectedIndex];
                            newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [index]: {
                                ...newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[index],
                                selectedIndeValue: selectedIndexManual,
                              },
                            };
                            return newSelectedIndex;
                          });
                    } else {
                      ////console.log('selectorInputSelectedIndex Select',selectorInputSelectedIndex);
                      ////console.log('selectorInputSelectedIndex selectorInputData[selectedIndexManual.row]',selectorInputData[selectedIndexManual.row]);

                      setSelectorInputSelectedIndex((prevSelectedIndex) => {
                            const newSelectedIndex = [...prevSelectedIndex];
                            newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [index]: {
                                ...newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[index],
                                selectedIndeValue: selectedIndexManual,
                              },
                            };
                            return newSelectedIndex;
                          });
                      setInputValues((prevInputValues) => {
                            const newInputValues = [...prevInputValues];
                            newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [index]: {
                                ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[index],
                                weight: selectorInputData[selectedIndexManual.row],
                              },
                            };
                            return newInputValues;
                          });
                          if(selectedIndexManual.row !== 0){
                            setMiddleInputValues((prevInputValues) => {
                            const newInputValues = [...prevInputValues];
                            newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [activeRowIndex]: {
                                ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[activeRowIndex],
                                weight: selectorInputData[selectedIndexManual.row],
                              },
                            };
                            return newInputValues;
                          });
                          }
                        
                      
                    }
                  }}
                  style={[styles.selectorInputSelect,isArabic ? styles.ArabicBodyWeightsInput : styles.EnglishBodyWeightsInput]}
                  status="newColor"
                  size="customSizo"
                >

                  {selectorInputData.map((option, index) => (
                    <SelectItem key={index} title={option.toString()} /> // Convert number to string for display
                  ))}
                </Select> */}

                {/* <Modal
                 transparent 
                  visible={selectorInputVisible}
                  // style={{backgroundColor:'transparent',height:"100%",width:"100%"}}
                >
                      <View style={{ flexDirection: 'row', alignItems: 'center',width:260,height:260, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                          placeholder={t("Weights")}
                          keyboardType="numeric"
                          // value={selectorInputNumberInput}
                        // value={middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString() ? middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString() : (sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString()) ? (sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString()) : (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString()) ? (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString()) : "" }
                          value={
        middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString() ||
        sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString() || 
        inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight?.toString() || ""
      }
                          // onChangeText={(text) => setSelectorInputNumberInput(text)}
                          onChangeText={(text) =>{
                          ////console.log('activeRowIndextext',activeRowIndex);
                          setMiddleInputValues((prevInputValues) => {
                            const newInputValues = [...prevInputValues];
                            newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [activeRowIndex]: {
                                ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[activeRowIndex],
                                weight: text ? text : parseInt(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) ? parseInt(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) : "",
                              },
                            };
                            return newInputValues;
                          });
                          }}
                        />
                        <TouchableOpacity
                         style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5 }}
                         onPress={()=>{
                          // ////console.log('sets =',(parseInt(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0)
                          // );
                          // ////console.log('sets =0 ',(parseInt(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0) == 0 
                          // );
                          // ////console.log('set = ""', (parseInt(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0)  == ''
                          // );
                          // ////console.log('input = 0 ',(parseInt(middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0) ==0
                          // );
                          // ////console.log('input = ""',(parseInt(middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0) == ''
                          // );
                          // ////console.log('input = ""',(parseInt(middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10) || 0)
                          // );
                          const middleInputValuesWeight = middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight;
                          const setsWeight = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight;

                          if(
                            setsWeight  == ''
                            
                            &&
                            
                            middleInputValuesWeight == ''
                            ){
                            
                            Alert.alert(`${t("you_must_enter_number")}`);
                            return;
                          } 

                          if(
                            (parseInt(setsWeight, 10) || 0) == 0 
                            
                            &&
                            
                              (parseInt(middleInputValuesWeight, 10) || 0) ==0
                            ){
                            
                            Alert.alert(`${t("Weight_must_be_greater_than_zero")}`);
                            return;
                          } 
                          setInputValues((prevInputValues) => {
                            const newInputValues = [...prevInputValues];
                            newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [activeRowIndex]: {
                                ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[activeRowIndex],
                                weight: parseInt(middleInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight, 10),
                              },
                            };
                            return newInputValues;
                          });
                          toggleModal(activeRowIndex);
                          }}>
                          <Text style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5,padding:9 }}>{t("OK")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                         style={{ color: 'white',borderWidth: 1,marginLeft:10, borderColor: 'white', borderRadius: 5 }}
                         onPress={()=>{
                          // setMiddleInputValues((prevInputValues) => {
                          //   const newInputValues = [...prevInputValues];
                          //   newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                          //     ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                          //     [activeRowIndex]: {
                          //       ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[activeRowIndex],
                          //       weight: "",
                          //     },
                          //   };
                          //   return newInputValues;
                          // });
                          if(!inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[activeRowIndex]?.weight){
                            setSelectorInputSelectedIndex((prevSelectedIndex) => {
                            const newSelectedIndex = [...prevSelectedIndex];
                            newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] = {
                              ...(newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id] || {}),
                              [activeRowIndex]: {
                                ...newSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex]?.id]?.[activeRowIndex],
                                selectedIndeValue: null,
                              },
                            };
                            return newSelectedIndex;
                          });
                          
                          }
                          
                          
                         toggleModal(activeRowIndex);
                         
                         }}>
                          <Text style={{ color: 'white',borderWidth: 1,borderColor: 'white', borderRadius: 5,padding:9 }}>X</Text>
                        </TouchableOpacity>
                      </View>
                </Modal> */}



              
              <TextInput
                  style={[styles.WorkoutsInput,isArabic ? styles.ArabicBodyWeightsInput : styles.EnglishBodyWeightsInput]}
                  placeholder={t("Weight")}
                  // onFocus={handleInputFocus}
                  editable={!set.isCompleted}
                  selectTextOnFocus={!set.isCompleted}
                  keyboardType="numeric"
                  value={inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight ? inputValues?.[publicPlansDataTableItemDayNewData?.[activeIndex]?.wrkKey]?.[index]?.weight : ""}
                  onChangeText={(text) =>
                    setInputValues((prevInputValues) => {
                      const newInputValues = {...prevInputValues};
                      newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] = {
                        ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] || {}),
                        [index]: {
                          ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey]?.[index],
                          weight: text ? text : "",

                        },
                      };
                      return newInputValues;
                    })
                  }
                />



              {/* <TextInput
                style={[styles.WorkoutsInput,isArabic ? styles.ArabicBodyRepsInput : styles.EnglishBodyRepsInput]}
                placeholder={t("Reps")}
                keyboardType="numeric"
                editable={!set.isCompleted}
                selectTextOnFocus={!set.isCompleted}
                value={(sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps) || (inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps)}
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
              /> */}
                {/* <Select

                  value={selectorInputData[selectorInputSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]}
                    disabled={set.isCompleted}  // Disable the Select component when !set.isCompleted

                  // value={ inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight}
                  onSelect={(selectedIndexManual) => {

                      setSelectorInputSelectedIndex((prevSelectedIndex) => {
                        const newSelectedIndex = { ...prevSelectedIndex };  // Treat as an object
                        const currentId = publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey;

                        newSelectedIndex[currentId] = {
                          ...(newSelectedIndex[currentId] || {}),
                          [index]: {
                            ...newSelectedIndex[currentId]?.[index],
                            selectedIndeValue: selectedIndexManual,  // Update the selected index value
                          },
                        };

                        return newSelectedIndex;  // Return the updated object
                      });
                      setInputValues((prevInputValues) => {
                        const newInputValues = {...prevInputValues};
                        newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] = {
                          ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] || {}),
                          [index]: {
                            ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey]?.[index],
                            weight: selectorInputData[selectedIndexManual.row],
                          },
                        };
                        return newInputValues;
                      });
                  }}
                  style={[styles.selectorInputSelect,isArabic ? styles.ArabicBodyWeightsInput : styles.EnglishBodyWeightsInput]}

                  status="newColor"
                  size="customSizo"
                >
                  {selectorInputData.map((title, index) => (
                    <SelectItem key={index} title={title} />
                  ))}
                </Select> */}
              <Select
                  // selectedIndex={selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue}
                  // value={ 
                  // (selectorRepsData[selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]) ?
                  //   (selectorRepsData[selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]):
                  // ((sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps) ? (
                  //   sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps
                  // ):(null) ) }
                  value={selectorRepsData[selectorRepsSelectedIndex[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.selectedIndeValue?.row]}
                   disabled={set.isCompleted}  // Disable the Select component when !set.isCompleted

                  // value={ inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight}
                  onSelect={(selectedIndexManual) => {
                    setSelectorRepsSelectedIndex((prevSelectedIndex) => {
                        const newSelectedIndex = { ...prevSelectedIndex };  // Treat as an object
                        const currentId = publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey;

                        newSelectedIndex[currentId] = {
                          ...(newSelectedIndex[currentId] || {}),
                          [index]: {
                            ...newSelectedIndex[currentId]?.[index],
                            selectedIndeValue: selectedIndexManual,  // Update the selected index value
                          },
                        };

                        return newSelectedIndex;  // Return the updated object
                      });
                      setInputValues((prevInputValues) => {
                        const newInputValues = {...prevInputValues};
                        newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] = {
                          ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey] || {}),
                          [index]: {
                            ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex]?.wrkKey]?.[index],
                            reps: selectorRepsData[selectedIndexManual.row],
                          },
                        };
                        return newInputValues;
                      });
                  }}
                  style={[styles.selectorInputSelect,isArabic ? styles.ArabicBodyRepsInput : styles.EnglishBodyRepsInput]}

                  status="newColor"
                  size="customSizo"
                >
                  {selectorRepsData.map((title, index) => (
                    <SelectItem key={index} title={title} />
                  ))}
                </Select>

              </>
            )}
        
        
        <TouchableOpacity
          style={[
            styles.completeButton,
            {
              color: set.timerStarted ? 'green' : 'blue',
              borderColor: 'transparent',
            },
            isArabic ? styles.ArabicCheckBlueButton : styles.EnglishCheckBlueButton
          ]}
          onPress={() => {
          (row?.exrTyp === 'Cardio' || row?.exrTyp === 'Stability')?(
          ((parseFloat(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.casTim) > 0) )?(
              handleToggleComplete(WrkTypTimInitSent,set.plnKey,set.dayKey,set.dayName,set.date,set.wrkKey,set.wktNam,set.sets, index, 0, 0,set.dayTim, array,inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.casTim,set.exrTyp,set.exrTim,set.images)):(
              Alert.alert(`${t("please_start_the_timer_First")}`)
            )
          ):(
          // ((parseFloat(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight) >= 0) && (parseFloat(inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps) >= 0))?(
          //     handleToggleComplete(WrkTypTimInitSent,set.plnKey,set.dayKey,set.dayName,set.date,set.wrkKey,set.wktNam,set.sets, index, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps,set.dayTim, array,0,set.exrTyp,set.exrTim,set.images)):(
          //     Alert.alert(`${t("please_fill_with_nubmers_bigger_that_zero")}`)
          //   )
          handleToggleComplete(WrkTypTimInitSent,set.plnKey,set.dayKey,set.dayName,set.date,set.wrkKey,set.wktNam,set.sets, index, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.weight, inputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index]?.reps,set.dayTim, array,0,set.exrTyp,set.exrTim,set.images)
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
);
};
const FirstTimer=({isAnyBlueCheckPressedo,WrkTypTimInitSento,activeIndex, publicPlansDataTableItemDay,sets,publicPlansDataTableItemDayNewData})=>{
  ///////////console.log('inside firsttimer WrkTypTimInitSent',WrkTypTimInitSent);
  const [timeAfterMinusOne, setTimeAfterMinusOne] = useState(false);
  // const TASK_NAME = 'NORMAL_EXERCIES_BACKGROUND_TIMER_TASK';

const timeThatNoticationWillShowAt= parseInt(WrkTypTimInitSento) + 1;
  
  // // Define the background task
  // TaskManager.defineTask(TASK_NAME, async () => {

  //   // //console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
  //   const storedTime = await AsyncStorage.getItem('NORMAL_EXERCIES_BACKGROUND_TIMER_TASK_ASYNC');

  //   let NORMALEXERCIESTime = storedTime ? parseInt(storedTime) : "";
  //   if(NORMALEXERCIESTime){
  //     NORMALEXERCIESTime -= 1; // Decrease timer by 1 second
    
  //   await AsyncStorage.setItem('NORMAL_EXERCIES_BACKGROUND_TIMER_TASK_ASYNC', NORMALEXERCIESTime.toString());
  //   return BackgroundFetch.Result.NewData;

  // }else{
  //   return BackgroundFetch.Result.NoData;

  //   }
    
  
  // });
  const [timerOne, setTimerOne] = useState(null);
  const [timerFour, setTimerFour] = useState(20);

  const intervalFourRef = useRef(null); // Use useRef to store the interval ID

  const intervalOneRef = useRef(null); // Use useRef to store the interval ID
////new background timer way  get out and get back way 
// Save the current time when the app goes to the background
// const saveBackgroundTime = async () => {
//   const currentTime = Date.now();
//   await AsyncStorage.setItem('backgroundTime', currentTime.toString());
// };

// // Calculate the time spent in the background and update the timer
// const updateTimerAfterBackground = async () => {
//   const storedBackgroundTime = await AsyncStorage.getItem('backgroundTime');
//   const currentTime = Date.now();

//   if (storedBackgroundTime) {
//     const timeInBackground = Math.floor((currentTime - parseInt(storedBackgroundTime, 10)) / 1000);
//     setTimerFour((prevTime) => prevTime - timeInBackground); // Subtract background time
//     setTimeout(() => {
//       startTimer_for_timer_four(); // Start the timer after ensuring state update
//     }, 50); // Small delay to give time for state update
//   }
// };
const saveBackgroundTimeForMainTimer = async () => {
  const currentTime = Date.now();
  if(intervalOneRef.current){
    await AsyncStorage.setItem('backgroundTimeForMainTimer', currentTime.toString());

  }
};
const updateTimerAfterBackgroundForMainTimer = async () => {
  const storedBackgroundTime = await AsyncStorage.getItem('backgroundTimeForMainTimer');
  const currentTime = Date.now();

  if (storedBackgroundTime) {
    const timeInBackground = Math.floor((currentTime - parseInt(storedBackgroundTime, 10)) / 1000);
    setTimerOne((prevTime) => prevTime - timeInBackground); // Subtract background time
    setTimeout(() => {
      startTimer(); // Start the timer after ensuring state update
    }, 50); // Small delay to give time for state update
  }
};

 ////Start push notification////

 const [expoPushToken, setExpoPushToken] = useState('');
 const [channels, setChannels] = useState([]);
 const [notification, setNotification] = useState(undefined);
 const notificationListener = useRef();
 const responseListener = useRef();
 const appState = useRef(AppState.currentState);
 const [isRegistered, setIsRegistered] = useState(false);
 const [status, setStatus] = useState(null);
 const notificationIdRef = useRef(null);


// ////Start update timer in background
// const BACKGROUND_FETCH_TASK = 'First-Timer-background-fetch';

// // Define the background task
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
//   try {
//     // Get the saved timer value from AsyncStorage
//     let savedCounter = await AsyncStorage.getItem('BackGroundCounter');
//     savedCounter = savedCounter ? parseInt(savedCounter, 10) : 0;

//     // Increment the timer value
//     const newCounter = savedCounter - 1;

//     // Save the new timer value back to AsyncStorage
//     await AsyncStorage.setItem('BackGroundCounter', newCounter.toString());

//     //console.log('Timer updated in background:', newCounter);

//     // Indicate to the system that the task succeeded
//     return BackgroundFetch.BackgroundFetchResult.NewData;
//   } catch (error) {
//     //console.log('Background fetch failed:', error);
//     return BackgroundFetch.BackgroundFetchResult.Failed;
//   }
// });

// useEffect(() => {
//   const subscription = AppState.addEventListener('change', handleAppStateChange);
//   return () => {
//     subscription.remove();
//   };
// }, []);

// const handleAppStateChange = async (nextAppState) => {
//   if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
//     // App has come to the foreground
//     const backgroundTime = await AsyncStorage.getItem('backgroundTime');
//     const savedTimerValue = await AsyncStorage.getItem('savedTimerValue');
    
//     if (backgroundTime && savedTimerValue) {
//       const timeNow = Date.now();
//       const timeInBackground = Math.floor((timeNow - parseInt(backgroundTime)) / 1000);

//       // Subtract time spent in the background from the timer
//       const updatedTimer = Math.max(parseInt(savedTimerValue) - timeInBackground, 0);
//       setTimerOne(updatedTimer);

//       await AsyncStorage.removeItem('backgroundTime');
//       await AsyncStorage.removeItem('savedTimerValue');
//     }
//   } else if (nextAppState === 'background') {
//     // App is going into the background, save the current time and timer value
//     await AsyncStorage.setItem('backgroundTime', Date.now().toString());
//     await AsyncStorage.setItem('savedTimerValue', timerOne?.toString());
//   }
//   appState.current = nextAppState;
// };
// //// End update timer in background
 // //// End update timer in background
//  useEffect(() => {
//   checkStatusAsync();
// }, []);

// const checkStatusAsync = async () => {
//   const status = await BackgroundFetch.getStatusAsync();
//   const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
//   setStatus(status);
//   setIsRegistered(isRegistered);
// };

// const toggleFetchTask = async () => {
//   if (isRegistered) {
//     await unregisterBackgroundTask();
//   } else {
//     await registerBackgroundTask();
//   }

//   checkStatusAsync();
// };
// const registerBackgroundTask = async () => {
//   await BackgroundFetch.registerTaskAsync(TASK_NAME, {
//     minimumInterval: 1, // Execute every 1 second in the background
//     stopOnTerminate: false,
//     startOnBoot: true,
//   });
// };

// const unregisterBackgroundTask = async () => {
//   await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
// };
const startTimer_with_removeitem = async () => {
  const storedTime = await AsyncStorage.getItem('backgroundTimeForMainTimer');
  if(storedTime){
    await AsyncStorage.removeItem('backgroundTimeForMainTimer');

  }

  try {
    const intervalOne = setInterval(async () => {
      setTimerOne(prevTimer => {
        let timeThatNoticationWillShowAtMinus = timeThatNoticationWillShowAt-1;
        if (prevTimer == timeThatNoticationWillShowAtMinus) {
          showTrainingStartAlert(timeThatNoticationWillShowAtMinus);

        }
        const newTime = prevTimer - 1;
        const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
        const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
        const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}`;
        const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
        const currentTime = Date.now();

         AsyncStorage.setItem(key, JSON.stringify(currentTime));
         AsyncStorage.setItem(savedLiveTimer, JSON.stringify(newTime));

        return newTime; // Continue decrementing the timer
      });
    }, 1000);
    intervalOneRef.current = intervalOne; // Store the interval ID in the ref
    // registerBackgroundTask();
    return () => clearInterval(intervalOneRef.current);
  } catch (error) {
    ////console.log('Error initializing timer:', error);
  }
};
const startTimer = async () => {
  if (intervalOneRef.current) {
    clearInterval(intervalOneRef.current);
  }

  try {
    const intervalOne = setInterval(async () => {
      setTimerOne(prevTimer => {
        let timeThatNoticationWillShowAtMinus = timeThatNoticationWillShowAt-1;

        if (prevTimer == timeThatNoticationWillShowAtMinus) {
          showTrainingStartAlert(timeThatNoticationWillShowAtMinus);

        }
        const newTime = prevTimer - 1;
        const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
        const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
        const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}`;
        const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
        const currentTime = Date.now();

         AsyncStorage.setItem(key, JSON.stringify(currentTime));
         AsyncStorage.setItem(savedLiveTimer, JSON.stringify(newTime));

        return newTime; // Continue decrementing the timer
      });
    }, 1000);
    intervalOneRef.current = intervalOne; // Store the interval ID in the ref
    // registerBackgroundTask();
    return () => clearInterval(intervalOneRef.current);
  } catch (error) {
    ////console.log('Error initializing timer:', error);
  }
};
// const startTimer_for_timer_four = async () => {
//   if (intervalFourRef.current) {
//     clearInterval(intervalFourRef.current);
//   }

//   try {
//     const intervalFour = setInterval(async () => {
//       setTimerFour(prevTimer => {

//         const newTime = prevTimer - 1;

//         return newTime; // Continue decrementing the timer
//       });
//     }, 1000);
//     intervalFourRef.current = intervalFour; // Store the interval ID in the ref
//     // registerBackgroundTask();
//     return () => clearInterval(intervalFourRef.current);
//   } catch (error) {
//     ////console.log('Error initializing timer:', error);
//   }
// };
// const syncTimer = async () => {
//   const storedTime = await AsyncStorage.getItem('NORMAL_EXERCIES_BACKGROUND_TIMER_TASK_ASYNC');
//   const latestTime = storedTime ? parseInt(storedTime) : "";
// if(latestTime){
// // Update the timer state based on the latest stored time
// setTimerOne(latestTime);
// // Use setTimeout to ensure the state is updated before starting the timer
// setTimeout(() => {
//   startTimer(); // Start the timer after ensuring state update
// }, 50); // Small delay to give time for state update
// }
  
// };
// Sync timer when app state changes
const handleAppStateChange = async (nextAppState) => {
  if (nextAppState === 'active') {
    // await updateTimerAfterBackground(); // Update timer when coming back to the app
    await updateTimerAfterBackgroundForMainTimer(); // Update timer when coming back to the app

   
    // App is in the foreground, sync timer
    // syncTimer();
  } else if (nextAppState === 'background' || nextAppState === 'inactive') {
    
    // App is going to the background, register background task
    if (intervalOneRef.current) {
      // await saveBackgroundTime(); // Save the time when the app goes to the background
      await saveBackgroundTimeForMainTimer(); // Save the time when the app goes to the background

    // await registerBackgroundTask();
    }
  }
};

  useEffect(() => {
    // //console.log('Starting next workout automatically');
    // activeIndex
    // //console.log('current workout activeIndex ',activeIndex);

    // //console.log('current workout sets ',sets);
    //console.log('current workout publicPlansDataTableItemDay ',publicPlansDataTableItemDay);
    // //console.log('current workout sets[publicPlansDataTableItemDay[0].speKey] ',sets[publicPlansDataTableItemDay[0].speKey]);
    // //console.log('current workout sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises ',sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises);
    const newWorkedExercises = sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises;
    
    const allSetsInWorkedExercises = newWorkedExercises &&  Object.values(newWorkedExercises).flatMap(exercises => exercises);

   //console.log('current workout allSetsInWorkedExercises ',allSetsInWorkedExercises);
   const hasAnyCompletedSetInExercise = allSetsInWorkedExercises?.some(exercise => exercise.isCompleted);
  //console.log('Is any exercise completed?', hasAnyCompletedSetInExercise);
    // const allWorkoutsSetsCompleted = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.every((set) => set.isCompleted);
    // //console.log('Are all current sets completed?', allWorkoutsSetsCompleted);

    // const workedExercisesConst = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises;
    // const workedPrevExercisesConst = sets[publicPlansDataTableItemDay[activeIndex-1]?.speKey]?.workedExercises;
    // const getAllWorkoutsSets = Object.values(sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises);
    // //console.log('getAllWorkoutsSets', getAllWorkoutsSets);
    // const isAnySeyInAllWorkoutdDone = sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises && Object.values(sets?.[publicPlansDataTableItemDay?.[0]?.speKey]?.workedExercises).every(exerciseArray =>
    //   exerciseArray.every(exercise => exercise?.isCompleted)
    // );
    // //console.log('isAnySeyInAllWorkoutdDone', isAnySeyInAllWorkoutdDone);

      if(activeIndex>=1){
        const allPrevWorkoutsSetsCompleted = sets[publicPlansDataTableItemDay[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex-1].wrkKey]?.every((set) => set.isCompleted);
        
        //console.log('Are all prev sets completed?', allPrevWorkoutsSetsCompleted);
        if (allPrevWorkoutsSetsCompleted && !isAnyBlueCheckPressedo) {
      
          const startTimerNewFormThatContinue = async () => {

            const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
            const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
            const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}`;
            const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
            
              const storedWorkoutTime = await AsyncStorage.getItem(key);
              const storedWorkoutTimeFormAsynch = await AsyncStorage.getItem(savedLiveTimer);
            
              
              if (storedWorkoutTime && storedWorkoutTimeFormAsynch) {
                const currentTime = Date.now();
                //console.log('storedWorkoutTime Prev',storedWorkoutTime);
                //console.log('storedWorkoutTimeFormAsynch Prev',storedWorkoutTimeFormAsynch);
            
                const storedWorkoutTimeWillGetIntoTimer = Math.floor((currentTime - parseInt(storedWorkoutTime, 10)) / 1000);
                //console.log('storedWorkoutTimeWillGetIntoTimer Prev',storedWorkoutTimeWillGetIntoTimer);
                //console.log('parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer Prev',parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer);
            
                setTimerOne(parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer); // Subtract background time
                setTimeout(() => {
                  startTimer_with_removeitem(); // Start the timer after ensuring state update
                }, 50); // Small delay to give time for state update
              }else{
                setTimerOne(WrkTypTimInitSento);
                // Use setTimeout to ensure the state is updated before starting the timer
                setTimeout(() => {
                  startTimer_with_removeitem();
                  // Start the timer after ensuring state update
                }, 50);
              }
            };
            startTimerNewFormThatContinue(); 
        }
      }

    
  }, [activeIndex]);
  useEffect(() => {

    const subscription_handleAppStateChange = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      ////console.log('StartExercisesWithTimerScreen component unmounted');
      
      subscription_handleAppStateChange.remove();
  
      
     };
   }, []);

   
  const allSetsCompleted = sets[publicPlansDataTableItemDay?.[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.every((set) => set.isCompleted);


  

 useEffect(() => {
   registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

   if (Platform.OS === 'android') {
     Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
   }
   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    ////console.log('Notification received:', notification);
 
    setNotification(notification);
   });

   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
     ////console.log('response',response);
   });
 


////console.log('StartExercisesWithTimerScreen component mounted');


// //// Start update timer in background

  //// starttimer from  down useffect start//////
  // Start a foreground timer that updates every second
  // const loadInitialCounter = async () => {
  //   // Load the saved counter value from AsyncStorage when the app starts
  //   const savedCounter = await AsyncStorage.getItem('BackGroundCounter');
  //   if (savedCounter !== null) {
  //     setTimerOne(parseInt(savedCounter, 10));
  //   }
  // };

  // loadInitialCounter();

  // // Register the background fetch task
  // const startBackgroundFetch = async () => {
  //   await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  //     minimumInterval: 60, // Fetch every 60 seconds
  //     stopOnTerminate: false, // Android only
  //     startOnBoot: true, // Android only
  //   });
  //   //console.log('Background fetch registered');
  // };

  // startBackgroundFetch();

 

  // startTimer_for_timer_four(); // Start the timer after ensuring state update

  if (isAnyBlueCheckPressedo && !allSetsCompleted) {
    const startTimerNewFormThatContinue = async () => {

      const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
      const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;
      const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}`;
      const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
      
        const storedWorkoutTime = await AsyncStorage.getItem(key);
        const storedWorkoutTimeFormAsynch = await AsyncStorage.getItem(savedLiveTimer);
      
        
        if (storedWorkoutTime && storedWorkoutTimeFormAsynch) {
          const currentTime = Date.now();
          //console.log('storedWorkoutTime',storedWorkoutTime);
          //console.log('storedWorkoutTimeFormAsynch',storedWorkoutTimeFormAsynch);
      
          const storedWorkoutTimeWillGetIntoTimer = Math.floor((currentTime - parseInt(storedWorkoutTime, 10)) / 1000);
          //console.log('storedWorkoutTimeWillGetIntoTimer',storedWorkoutTimeWillGetIntoTimer);
          //console.log('parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer',parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer);
      
          setTimerOne(parseInt(storedWorkoutTimeFormAsynch) - storedWorkoutTimeWillGetIntoTimer); // Subtract background time
          setTimeout(() => {
            startTimer_with_removeitem(); // Start the timer after ensuring state update
          }, 50); // Small delay to give time for state update
        }else{
          setTimerOne(WrkTypTimInitSento);
          // Use setTimeout to ensure the state is updated before starting the timer
          setTimeout(() => {
            startTimer_with_removeitem();
            // Start the timer after ensuring state update
          }, 50);
        }
      };
      startTimerNewFormThatContinue(); 
    // startTimer(); // Start the timer once the value is set

    ////console.log(`Time taken to start timer: ${end - start} ms`);
  }else{
    setTimerOne(WrkTypTimInitSento);
  }

  if (allSetsCompleted) {
    if (intervalOneRef.current) {
      clearInterval(intervalOneRef.current); // Clear the interval on unmount

    }

    notificationListener.current &&
    Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      notificationListener.current &&
          notificationListener.current.remove();
      responseListener.current &&
          responseListener.current.remove();
      if (notificationIdRef.current) {
         Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
        notificationIdRef.current = null; // Reset after cancellation
      }
      const  ExerciesSpekey = publicPlansDataTableItemDay?.[activeIndex]?.speKey;
      const  ExerciesWrkKey = publicPlansDataTableItemDay?.[activeIndex]?.wrkKey;

      const key = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}`;
      const savedLiveTimer = `workout_${ExerciesSpekey}_${ExerciesWrkKey}_${activeIndex}_timer`;
       AsyncStorage.removeItem(key);
       AsyncStorage.removeItem(savedLiveTimer);
    
  
  }
  
  const unsubscribeForIntervalOne = navigation.addListener('beforeRemove', async () => {
    if (intervalOneRef.current) {
      clearInterval(intervalOneRef.current); // Clear the interval when navigating away
     
    }
    notificationListener.current &&
       Notifications.removeNotificationSubscription(notificationListener.current);
     responseListener.current &&
       Notifications.removeNotificationSubscription(responseListener.current);
      notificationListener.current &&
          notificationListener.current.remove();
      responseListener.current &&
         responseListener.current.remove();
    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      notificationIdRef.current = null; // Reset after cancellation
    }
    //  notificationListener.current &&
    //   Notifications.cancelScheduledNotificationAsync(notificationListener.current);
    // responseListener.current &&
    //   Notifications.cancelScheduledNotificationAsync(responseListener.current);

    // Clear the stored time in AsyncStorage
    await AsyncStorage.removeItem('backgroundTimeForMainTimer');
   

   
    publicPlansDataTableItemDay.forEach(async (item, wrkAryIndex) => {
      const { wrkKey,plnKey,speKey } = item;
      
      //console.log('beefore leave plnKey',plnKey);
      //console.log('beefore leave wrkKey',wrkKey);
      //console.log('beefore leave speKey',speKey);

        const key = `workout_${speKey}_${wrkKey}_${wrkAryIndex}`;
        const savedLiveTimer = `workout_${speKey}_${wrkKey}_${wrkAryIndex}_timer`;
        //console.log('activeIndex wrkAryIndex',wrkAryIndex,key);
        //console.log('savedLiveTimer wrkAryIndex',wrkAryIndex,savedLiveTimer);
        await AsyncStorage.removeItem(key);
        await AsyncStorage.removeItem(savedLiveTimer);
        const loopOverGreenTimersInsidesAllWorkouts =  sets[publicPlansDataTableItemDay?.[0].speKey]?.workedExercises[publicPlansDataTableItemDayNewData[wrkAryIndex].wrkKey];
        //console.log('activeIndex loopOverGreenTimersInsidesAllWorkouts',loopOverGreenTimersInsidesAllWorkouts);

        loopOverGreenTimersInsidesAllWorkouts.forEach(async (greenTimerItem, indexop) => {


        const greenTimerKey = `user_green_timer_workout_${plnKey}_${speKey}_${wrkKey}_${wrkAryIndex}_${indexop}`;
        const greenTimerSavedLiveTimer = `user_green_timer_workout_${plnKey}_${speKey}_${wrkKey}_${wrkAryIndex}_${indexop}_timer`;
        
      
        //console.log('greenTimerKey wrkAryIndex,indexop',wrkAryIndex,indexop,greenTimerKey);
        //console.log('greenTimerSavedLiveTimer wrkAryIndex,indexop',wrkAryIndex,indexop,greenTimerSavedLiveTimer);

        await AsyncStorage.removeItem(greenTimerKey);
        await AsyncStorage.removeItem(greenTimerSavedLiveTimer);
        await AsyncStorage.removeItem('backgroundTimeForGreenTimer');

      });
      });
    // AsyncStorage.removeItem("BackGroundCounter");
  });

  //// starttimer from  down useffect end//////

   return () => {
    ////console.log('StartExercisesWithTimerScreen component unmounted');
    unsubscribeForIntervalOne();
    if (intervalOneRef.current) {
      clearInterval(intervalOneRef.current); // Clear the interval on unmount

    }

    notificationListener.current &&
    Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      notificationListener.current &&
          notificationListener.current.remove();
      responseListener.current &&
          responseListener.current.remove();
      if (notificationIdRef.current) {
         Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
        notificationIdRef.current = null; // Reset after cancellation
      }
    //   notificationListener.current &&
    //   Notifications.cancelScheduledNotificationAsync(notificationListener.current);
    // responseListener.current &&
    //   Notifications.cancelScheduledNotificationAsync(responseListener.current);

   };
 }, [activeIndex,allSetsCompleted,isAnyBlueCheckPressedo]);
 async function schedulePushNotification(notificationTimeSent) {

   const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${t('Start_Training')} 📬`,
      body: `${t("It_s_time_to_start_your_training")}`,
    },
    trigger: { seconds: notificationTimeSent },
  });

  // Store the notification ID
  notificationIdRef.current = notificationId;
 }
 
 async function registerForPushNotificationsAsync() {
   let token;
 
   if (Platform.OS === 'android') {
     await Notifications.setNotificationChannelAsync('default', {
       name: 'start exercies channel',
       importance: Notifications.AndroidImportance.MAX,
       vibrationPattern: [0, 250, 250, 250],
       lightColor: '#FF231F7C',
     });
   }
 
   if (Device.isDevice) {
     const { status: existingStatus } = await Notifications.getPermissionsAsync();
     let finalStatus = existingStatus;
     if (existingStatus !== 'granted') {
       const { status } = await Notifications.requestPermissionsAsync();
       finalStatus = status;
     }
     if (finalStatus !== 'granted') {
       //alert('Failed to get push token for push notification!');
       return;
     }
     // Learn more about projectId:
     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
     // EAS projectId is used here.
     try {
       const projectId =
         Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
       if (!projectId) {
         throw new Error('Project ID not found');
       }
       token = (
         await Notifications.getExpoPushTokenAsync({
           projectId,
         })
       ).data;
       ////console.log('token',token);
     } catch (e) {
       token = `${e}`;
     }
   } else {
    //  alert('Must use physical device for Push Notifications');
   }
 
   return token;
 }
 const showTrainingStartAlert = async (notificationTime) => {
  //Alert.alert(`${t('Start_Training')}`, `${t("It_s_time_to_start_your_training")}`);
  notificationListener.current &&
      Notifications.removeNotificationSubscription(notificationListener.current);
  
  responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
  notificationListener.current &&
      notificationListener.current.remove();
  responseListener.current &&
      responseListener.current.remove();

  // notificationListener.current &&
  //     Notifications.cancelScheduledNotificationAsync(notificationListener.current);
  
  // responseListener.current &&
  //    Notifications.cancelScheduledNotificationAsync(responseListener.current);
  if (notificationIdRef.current) {
    await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
    notificationIdRef.current = null; // Reset after cancellation
  }

  await schedulePushNotification(notificationTime);
};
 ////End push notification////
  
  
  

  // useEffect(() => {
  //   //// starttimer from  down useffect start//////
  //   const startTimer = async () => {
  //     try {
  //       // Retrieve saved time from AsyncStorage
  //       // const timeWhenZeroHit = await AsyncStorage.getItem('timeWhenZeroHit');
  //       // let  inputValuesFromAsyncStorageLet = await AsyncStorage.getItem('inputValuesInAsyncStorage');
  //       // let inputValuesFromAsyncStorageParsed;
  //       // ////console.log('inputValuesFromAsyncStorageLet:', inputValuesFromAsyncStorageLet);

  //       // if(inputValuesFromAsyncStorageLet){
  //       //   inputValuesFromAsyncStorageParsed = JSON.parse(inputValuesFromAsyncStorageLet);
  //       //   ////console.log('inputValuesFromAsyncStorageParsed:', inputValuesFromAsyncStorageParsed);
  //       //   // Update inputValues in WorkoutsInputs using the ref
  //       //   ////console.log('workoutInputsRef.current:', workoutInputsRef.current);

  //       //   if (workoutInputsRef.current) {
  //       //     // Ensure inputValues is structured correctly
  //       //     const updatedInputValues = [...inputValuesFromAsyncStorageParsed].map(item => item || undefined);

  //       //     workoutInputsRef.current.setInputValues(updatedInputValues);
            
  //       //     //setInputValues(inputValuesFromAsyncStorageParsed);

  //       //   }
  //       // }
  //       // let initialTimerValue;
  //       // // setTimeAfterMinusOne(timeWhenZeroHit ? true : false);
  //       // ////console.log('AsyncStorage.getItem timeWhenZeroHit:', timeWhenZeroHit);
  
  //       // if (timeWhenZeroHit) {
  //       //   const timeSinceZero = Math.floor((Date.now() - parseInt(timeWhenZeroHit, 10)) / 1000);
  //       //   initialTimerValue = -1 - timeSinceZero; // Continue counting from where it left off
  //       //   setTimerOne(initialTimerValue);

  //       // } else {
  //       //   initialTimerValue = WrkTypTimInitSento; // Start from the beginning if no saved time
  //       //   setTimerOne(initialTimerValue);
  //       // }
  
  //       // ////console.log('Initial Timer Value:', initialTimerValue);
  
  
  //       const intervalOne = setInterval(async () => {
  //         setTimerOne(prevTimer => {
  //           if (prevTimer === -1) {
  //             // const newTimeWhenZeroHit = Date.now();
  //             // ////console.log('Saving time when timer hits -1:', newTimeWhenZeroHit);
  
  //             // // Save the current time to AsyncStorage
  //             // AsyncStorage.setItem('timeWhenZeroHit', newTimeWhenZeroHit.toString())
  //             //   .then(() => ////console.log('Time saved successfully'))
  //             //   .catch(error => ////console.log('Error saving time:', error));
  //             // // Save the current inputValues to AsyncStorage

  //           // Save the current inputValues to AsyncStorage using the ref
  //             // if (workoutInputsRef.current) {
  //             //   const currentInputValues = workoutInputsRef.current.getInputValues();
  //             //   ////console.log('currentInputValues',currentInputValues);
  //             //   AsyncStorage.setItem('inputValuesInAsyncStorage', JSON.stringify(currentInputValues))
  //             //     .then(() => ////console.log('inputValues saved to AsyncStorage successfully'))
  //             //     .catch(error => ////console.log('Error saving inputValues to AsyncStorage:', error));
  //             // }
  //             // AsyncStorage.setItem('inputValuesInAsyncStorage', JSON.stringify(inputValues))
  //             // .then(() => ////console.log('inputValues to AsyncStorage saved successfully'))
  //             // .catch(error => ////console.log('Error saving inputValues to AsyncStorage:', error));

  //             showTrainingStartAlert();
  //           }
  
  //           return prevTimer - 1; // Continue decrementing the timer
  //         });
  //       }, 1000);
  //       intervalOneRef.current = intervalOne; // Store the interval ID in the ref
  
  //       return () => clearInterval(intervalOneRef.current);
  //     } catch (error) {
  //       ////console.log('Error initializing timer:', error);
  //     }
  //   };
  //   if (isAnyBlueCheckPressedo) {
  //     const start = Date.now();

  //     startTimer();

  //     const end = Date.now();
  //     ////console.log(`Time taken to start timer: ${end - start} ms`);
  //   }else{
  //     setTimerOne(WrkTypTimInitSento);
  //   }

  //   // return () => {
  //   //   // Optionally clear AsyncStorage item on unmount
  //   //   AsyncStorage.removeItem('timeWhenZeroHit')
  //   //     .then(() => ////console.log('AsyncStorage item removed on unmount'))
  //   //     .catch(error => ////console.log('Error removing AsyncStorage item:', error));
  //   // };
  //   const unsubscribeForIntervalOne = navigation.addListener('beforeRemove', () => {
  //     if (intervalOneRef.current) {
  //       clearInterval(intervalOneRef.current); // Clear the interval when navigating away
  //     }
  //   });
  //   return () => {
  //       // Optionally clear AsyncStorage item on unmount
  //       unsubscribeForIntervalOne();
  //       if (intervalOneRef.current) {
  //         clearInterval(intervalOneRef.current); // Clear the interval on unmount
  //       }
  //     };
  //   //// starttimer from  down useffect end//////

  // }, []);

  return (
    <>
  <Text style={styles.timer}>

      {timerOne === 0 || timerOne === null ? (
        <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Loading_Timer")}...</Text>
      ) : timerOne > 0 ? (
        <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Time_Remaining")}: {Math.floor(timerOne / 60)}{t("m")} : {timerOne % 60}{t("s")}</Text>
      ) : (
        <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Negative_Time")}: -{Math.floor(Math.abs(timerOne) / 60)}{t("m")} : {Math.abs(timerOne) % 60}{t("s")}</Text>
      )}

      {/* Call the alert function when the timer reaches zero */}
      {/* {timerOne == -1 && showTrainingStartAlert()} */}
  </Text>
  {/* <Text style={styles.timer}>

{timerFour === 0 || timerFour === null ? (
  <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Loading_Timer")}...</Text>
) : timerFour > 0 ? (
  <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Time_Remaining")}: {Math.floor(timerFour / 60)}{t("m")} : {timerFour % 60}{t("s")}</Text>
) : (
  <Text style={{ color: 'black', fontSize: 14, fontFamily: 'OpenSans_400Regular' }}>{t("Negative_Time")}: -{Math.floor(Math.abs(timerFour) / 60)}{t("m")} : {Math.abs(timerFour) % 60}{t("s")}</Text>
)}

</Text> */}
  {/* <View style={styles.screen}>
      <View style={styles.textContainer}>
        <Text>
          Background fetch status:{' '}
          <Text style={styles.boldText}>
            {status && BackgroundFetch.BackgroundFetchStatus[status]}
          </Text>
        </Text>
        <Text>
          Background fetch task name:{' '}
          <Text style={styles.boldText}>
            {isRegistered ? TASK_NAME : 'Not registered yet!'}
          </Text>
        </Text>
      </View>
      <View style={styles.textContainer}></View>
      <Button
        title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
        onPress={toggleFetchTask}
      />
    </View> */}
  </>
  );
};


// Call the combineArrays function
let combinedArray = [];
if(sets?.[publicPlansDataTableItemDay[0].speKey]?.  workedExercises != undefined){
  combinedArray = combineArrays(sets?.[publicPlansDataTableItemDay[0].speKey]?.workedExercises);

}
// Output the combined array
///////////console.log("Combined Array:", combinedArray);

// //console.log('newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]',newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]);
////////////// i added the name of exercises with id 
  return (
    <PageContainer>
      <ScrollView>
        <TitleView >
          <Title >Life</Title>
        </TitleView>
        <ServicesPagesCardCover>
          <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
          <ServicesPagesCardHeader>{publicPlansDataTableItemDay?.[0]?.dayNam}</ServicesPagesCardHeader>
        </ServicesPagesCardCover>
        
        <View style={{marginTop:10,marginBottom:10,marginLeft:10}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

          <View
            // onLayout={(event) => {
            //     const layout = event.nativeEvent.layout;
            //     setListLayout(layout);
            //   }}
        >
            <FlatList
                data={publicPlansDataTableItemDay}
                renderItem={({ item, index }) => (
                    <RenderItem
                        item={item}
                        index={index}
                        // updateDraggingPosition={updateDraggingPosition}
                    />
                )}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                horizontal
            />
        </View>
        </ScrollView>
        </View>
        <View style={styles.container}>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.headerLabels}>
  
              <Text style={[styles.headerCell,styles.headerSetCell,isArabic ? styles.ArabicHeaderSets : styles.EnglishHeaderSets]}>{t("Set")}</Text>
              {publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Cardio' || publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Stability' ? (
                <Text style={[styles.headerStopWatchCell,isArabic ? styles.ArabicHeaderStopwatch : styles.EnglishHeaderStopwatch]}>{t("Stopwatch")}</Text>
            ) : publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === '' ? (
              <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicHeaderLoading : styles.EnglishHeaderLoading]}>{t('Loading')}...</Text>
            ) : (
              <>
              <Text style={[styles.headerWeightCell,isArabic ? styles.ArabicHeaderWeightCell : styles.EnglishHeaderWeightCell]}>{t('Weight')}</Text>
              <Text style={[styles.headerRepsCell,isArabic ? styles.ArabicHeaderRepsCell : styles.EnglishHeaderRepsCell]}>{t('Reps')}</Text>
              </>
              
            )}
           
            <Text style={[styles.headerCell,isArabic ? styles.ArabicHeaderCompletedCell : styles.EnglishHeaderCompletedCell]}>{t('Completed')}</Text>
            </View>

            <WorkoutsInputs sets={sets} publicPlansDataTableItemDay={publicPlansDataTableItemDay} publicPlansDataTableItemDayNewData={publicPlansDataTableItemDayNewData} activeIndex={activeIndex} handleToggleComplete={handleToggleComplete} WrkTypTimInitSent={WrkTypTimInitSent} navigation={navigation}/>

          </View>
          <Spacer size="large">
            <View style={{marginLeft:10,marginRight:10,}}>
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}  onPress={()=>onPressWorkoutButtonoptions()}>
                <CalendarFullSizePressableButtonText >{t("Complete_or_skip_workout")}</CalendarFullSizePressableButtonText>
              </CalendarFullSizePressableButton>
            </View>
          </Spacer>
          {/* Timer */}
          {/* <Text style={styles.timer}>
            {timer > 0
              ? <Text style={{ color: 'black',fontSize:14,fontFamily:'OpenSans_400Regular', }}>Time Remaining: {Math.floor(timer / 60)}m : {timer % 60}s</Text>
              : timer < 0
                ? <Text style={{ color: 'black',fontSize:14,fontFamily:'OpenSans_400Regular', }}>Negative Time: -{Math.floor(Math.abs(timer) / 60)}m : {Math.abs(timer) % 60}s</Text>
                : showTrainingStartAlert()}
          </Text> */}
         <FirstTimer isAnyBlueCheckPressedo={isAnyBlueCheckPresseded} WrkTypTimInitSento={publicPlansDataTableItemDayNewData?.[activeIndex]?.exrTim}  activeIndex={activeIndex}  publicPlansDataTableItemDay={publicPlansDataTableItemDay} sets={sets} publicPlansDataTableItemDayNewData={publicPlansDataTableItemDayNewData}/>
         

         
        </View>
        <View style={styles.container}>
        <Text style={{fontSize:16,color:'black',fontFamily:'OpenSans_400Regular',}}>{t("Last_Session")}</Text>
          <View style={styles.table}>
            {/* Header */}
            <View style={styles.sessionHeaderLabels}>
              <Text style={[styles.sessionHeaderCellSets,isArabic ? styles.ArabicSessionHeaderCellSets : styles.EnglishSessionHeaderCellSets]}>{t('Set')}</Text>
              {publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Cardio' || publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Stability' ? (
                <Text style={[styles.sessionHeaderStopwatchCell,isArabic ? styles.ArabicHeaderSessionStopWatchTimer : styles.EnglishHeaderSessionStopWatchTimer]}>{t('Stopwatch')}</Text>
            ) : publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === '' ? (
              <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicHeaderLoading : styles.EnglishHeaderLoading]}>{t('Loading')}...</Text>
            ) : (
            <>
              <Text style={[styles.sessionHeaderWeightCell,isArabic ? styles.ArabicSessionHeaderWeightCell : styles.EnglishSessionHeaderWeightCell]}>{t('Weight')}</Text>
              <Text style={[styles.sessionHeaderRepsCell,isArabic ? styles.ArabicSessionHeaderRepsCell : styles.EnglishSessionHeaderRepsCell]}>{t('Reps')}</Text>
            </>
            )}
            </View>
            {/* Rows */}
            {newWorkoutsFromDB?.[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.map((set, index, array) => {
              {/* //console.log('newWorkoutsFromDB',newWorkoutsFromDB);
              //console.log('parseInt(set.sets),index',parseInt(set.sets),index);
              //console.log('${index}-${parseInt(set.sets)',`${index}-${parseInt(set.sets)}`); */}

              
              return(
              <View key={`${index}-${parseInt(set.sets)}`} style={styles.lastWorkoutRow}>
              <Text style={[styles.session_sets,isArabic ? styles.ArabicSessionBodyCellSets : styles.EnglishSessionBodyCellSets]}>{parseInt(set.sets)}</Text>
                {publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Cardio' || publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === 'Stability' ? (
                  <Text style={[styles.session_stopwatch,isArabic ? styles.ArabicSessionStopWatchTimer : styles.EnglishSessionStopWatchTimer]}>{parseInt(set.casTim)}</Text>
                  ) : publicPlansDataTableItemDayNewData[activeIndex]?.exrTyp === '' ? (
                  <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicBodyLoading : styles.EnglishBodyLoading]}>{t('Loading')}...</Text>
                ) : (
                <>
                <Text style={[styles.session_weight,isArabic ? styles.ArabicSessionBodyCellWeight : styles.EnglishSessionBodyCellWeight]}>{parseInt(set.weight)}</Text>
                <Text style={[styles.session_reps,isArabic ? styles.ArabicSessionBodyCellReps : styles.EnglishSessionBodyCellReps]}>{parseInt(set.reps)}</Text>
                </>
                )}
              </View>
              );
            })}

          </View>

          
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  storyItem: {
    borderRadius: 25,
    borderWidth: 5,
    borderColor: '#ddd',
    height: 87,
    width: 87,
    aspectRatio: 1,
    justifyContent:'center',
    alignItems:'center',
    
  },
  activeStory: {
    borderRadius: 25,
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
    marginBottom:20,
  },
  sessionHeaderLabels:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft:0,
    padding: 8,
  },
  sessionHeaderCellSets:{
    color:"black",
    fontFamily:'OpenSans_400Regular',
    fontWeight: 'bold',
    
  },
  ArabicSessionHeaderCellSets:{
    position:"absolute",
    left:'10%',
  },
  EnglishSessionHeaderCellSets:{
    position:"absolute",
    left:'10%',
  },
  ArabicSessionBodyCellSets:{
    position:"absolute",
    left:'14%',
  },
  EnglishSessionBodyCellSets:{
    position:"absolute",
    left:'12%',
  },
  ArabicSessionHeaderWeightCell:{
    position:"absolute",
    left:'40%',
  },
  EnglishSessionHeaderWeightCell:{
    position:"absolute",
    left:'40%',
  },
  ArabicSessionBodyCellWeight:{
    position:"absolute",
    left:'43%',
  }, 
  EnglishSessionBodyCellWeight:{
    position:"absolute",
    left:'45%',
  },
  ArabicSessionHeaderRepsCell:{
    position:"absolute",
    left:'80%',
  },
  EnglishSessionHeaderRepsCell:{
    position:"absolute",
    left:'80%',
  },
  ArabicSessionBodyCellReps:{
    position:"absolute",
    left:'83%',
  },
  EnglishSessionBodyCellReps:{
    position:"absolute",
    left:'83%',
  },

  ArabicHeaderSessionStopWatchTimer:{
    position:"absolute",
    left:'50%',
  },
  EnglishHeaderSessionStopWatchTimer:{
    position:"absolute",
    left:'50%',
  },
  ArabicSessionStopWatchTimer:{
    position:"absolute",
    left:'57%',
  },
  EnglishSessionStopWatchTimer:{
    position:"absolute",
    left:'57%',
  },
  sessionHeaderWeightCell:{
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
  },
  sessionHeaderStopwatchCell:{
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
    
  },
  sessionHeaderRepsCell:{

    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"black",
  },
   
  InputsRows:{
  marginVertical:20,
  //marginBottom:20,
  width:'100%'
  },           
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    padding: 8,
  },
  lastWorkoutRow:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical:15,
    padding: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
  },
  headerSetCell:{
  marginLeft:10,
  },
  headerWeightCell: {
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginRight:25,
    marginLeft:15,
  },
  headerStopWatchCell:{
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginRight:60,
    marginLeft:10,
  },
  headerRepsCell: {
    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"black",
    marginRight:60,
    marginLeft:20,
  },
   
  cell: {
    flex: 1,
    textAlign: 'center',
    color:'black',
    fontFamily:'OpenSans_400Regular',
    
  },
  ArabicHeaderSets:{
    position:"absolute",
    left:"2%",
  },
  EnglishHeaderSets:{
    position:"absolute",
    left:"3%",
  },
  ArabicSetsBoddy:{
    position:"absolute",
    left:"10%",
  },
  EnglishSetsBoddy:{
    position:"absolute",
    left:"8%",
  },
  ArabicHeaderStopwatch:{
    position:"absolute",
    left:"36%",
  },
  EnglishHeaderStopwatch:{
    position:"absolute",
    left:"36%",
  },
  ArabicHeaderWeightCell:{
    position:"absolute",
    left:"32%",
  },
  EnglishHeaderWeightCell:{
    position:"absolute",
    left:"20%",
  },
  ArabicBodyWeightsInput:{
    position:"absolute",
    left:"33%",
    marginVertical:40,
  },
  EnglishBodyWeightsInput:{
    position:"absolute",
    left:"23%",
    
  },
  
  ArabicHeaderRepsCell:{
    position:"absolute",
    left:"59%",
    
  },
  EnglishHeaderRepsCell:{
    position:"absolute",
    left:"50%",
  }, 
  ArabicBodyRepsInput:{
    position:"absolute",
    left:"62%",
  },
  EnglishBodyRepsInput:{
    position:"absolute",
    left:"52%",
  },
  
  ArabicHeaderLoading:{
    position:"absolute",
    left:"48%",
  },
  EnglishHeaderLoading:{
    position:"absolute",
    left:"48%",
  },
  ArabicBodyLoading:{
    position:"absolute",
    left:"48%",
  },
  EnglishBodyLoading:{
    position:"absolute",
    left:"49%",
  },
  
    
  ArabicStopWatchTimer:{position:'absolute',left:"40%"},
  EnglishRightStopWatchTimer:{
    position:'absolute',left:"39%",
  },
  ArabicHeaderCompletedCell:{
    position:"absolute",
    left:"90%",
  }, 
  EnglishHeaderCompletedCell:{
    position:"absolute",
    left:"82%",
  },
  ArabicCheckBlueButton:{
    position:"absolute",
    left:"90%",
    },
  EnglishCheckBlueButton:{
    position:"absolute",
    left:"87%",
  },
  session_sets: {
    textAlign: 'center',
    color:'black',
    fontFamily:'OpenSans_400Regular',
  },
  session_weight: {
    textAlign: 'center',
    color:'black',
    fontFamily:'OpenSans_400Regular',
  },
  session_stopwatch:{
    textAlign: 'center',
    color:'black',
    fontFamily:'OpenSans_400Regular',
  },
  session_reps: {
    textAlign: 'center',
    color:'black',
    fontFamily:'OpenSans_400Regular',
  },
   
  WorkoutsInput: {
    width:60,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    color:'black',
    fontFamily:'OpenSans_400Regular',
    borderRadius:7,
  },
  completeButton: {
    borderRadius: 8,
    padding: 0,
    alignItems: 'center',
    borderWidth: 1,
    //backgroundColor:'black',
    width:35,
    height:28,
    marginBottom:20,

  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
  },
  selectorInputcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  selectorInputSelect: {
    // flex: 1,
    // marginHorizontal: 5,
    width:85,
    // borderWidth: 1,
    // borderColor: 'gray',
    // padding: 8,
    // color:'black',
    // fontFamily:'OpenSans_400Regular',
    // borderRadius:7,
  },
  selectorInputInput: {
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  selectorInputBackdrop: {
    backgroundColor: 'transparent',
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    margin: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
});