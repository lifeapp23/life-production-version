import React, { useState, useEffect,useContext  } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ScrollView, TextInput,Alert , Dimensions,Image} from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { DataTable} from 'react-native-paper';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";

import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  ExerciseImageViewImage,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  DataTableTitleValue,
  DataTableTitleValueText
} from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { updateSet, updateCompletedExercises,updateDayTim,deleteKeyObject } from './start_exer_with_timer_store'; // Assuming you have an updateNewArray action
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import { FontAwesome } from '@expo/vector-icons';
import { insertPlansStartWorkout,fetchLastDayStartWorkouts} from "../../../../database/start_workout_db";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,fetchPublicWorkoutsPlanDaysWithoutDeletingWithoutPlnKey } from "../../../../database/public_workouts_plan_days";
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');
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

const SecondTimer = React.memo(({index,publicPlansDataTableItemDayNewData,activeIndexes,set,groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises,objectForWorkedWorkouts,dayKey}) => {
  const [timerTwo, setTimerTwo] = useState(0);
  const [isStarted, setIsStarted] = useState(false) ;
  const [timerRunning, setTimerRunning] = useState(false);
  ///////////////console.log('timerTwo index',index,timerTwo);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  useEffect(() => {
    const newTimerValue = parseFloat(
      objectForWorkedWorkouts?.[dayKey]?.[
        groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises?.[activeIndexes?.[dayKey]]?.wrkKey
      ]?.[index]?.casTim
    ) || 0;
  
    setTimerTwo(newTimerValue); // Update state when the dependent values change
  }, [
    objectForWorkedWorkouts,
    dayKey,
    groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises,
    activeIndexes,
    index,
  ]); // Add all dependent variables here
//   console.log('timerTwo',timerTwo);
// console.log('parseFloat(objectForWorkedWorkouts?.[dayKey]?.[groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises?.[activeIndexes?.[dayKey]]?.wrkKey]?.[index]?.casTim)',parseFloat(objectForWorkedWorkouts?.[dayKey]?.[groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises?.[activeIndexes?.[dayKey]]?.wrkKey]?.[index]?.casTim));
  
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}${t("m")} : ${remainingSeconds.toString().padStart(2, '0')}${t("s")}`;
  };

  return (
    <>
      <Text style={[isArabic ? styles.ArabicStopWatchTimer : styles.EnglishRightStopWatchTimer,(parseFloat(set.isCmpld) ? true : false) && { opacity: 0.4 }]} disabled={(parseFloat(set.isCmpld) ? true : false)}>
      <FontAwesome
          name={timerRunning ? 'pause' : 'play'}
          size={20}
          color={timerRunning ? 'red' : 'green'}
          style={styles.button}
          disabled={(parseFloat(set.isCmpld) ? true : false)}
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

export const StartExercisesWithTimerFromCalendarScreen = ({hideModal,passNewDate,publicPlansDataTableItemDayCon,allUserWorkedWorkoutsFromDB,TrainerTraineeSent}) => {
  const [todayDayworkouts,setTodayDayworkouts] = useState([]);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

 
  ///console.log('allUserWorkedWorkoutsFromDB in StartExercisesWithTimerFromCalendarScreen',allUserWorkedWorkoutsFromDB);
  //   const publicPlansDataTableItemDayNewData = publicPlansDataTableItemDay.map((item, index) => ({
//   ...item,
//   id: index + 1, // Adding 1 to make the id start from 1 (if needed)
// }));
const context = useContext(AuthGlobal);

const [userId,setUserId] = useState('');
const [WrkTypTimInitSent,setWrkTypTimInitSent] = useState(0);
const [exertypInitConst,setExertypInitConst] = useState('');

const [setsFromDB,setSetsFromDB] = useState({});
const [newWorkoutsFromDB, setNewWorkoutsFromDB] = useState({});

const [objectForWorkedWorkouts, setObjectForWorkedWorkouts] = useState({});
const [objectForNotWorkedWorkouts, setObjectForNotWorkedWorkouts] = useState({});
const [workedExercisesOrganizedByDayKey, setWorkedExercisesOrganizedByDayKey] = useState({});


const [activeIndexes, setActiveIndexes] = useState(() => {
  const initialActiveIndexes = {};
  Object.keys(objectForWorkedWorkouts).forEach(dayKey => {
    initialActiveIndexes[dayKey] = 0;
  });
  return initialActiveIndexes;
});

useEffect(() => {
  if (Object.keys(activeIndexes).length === 0) {
    const initialActiveIndexes = {};
    Object.keys(objectForWorkedWorkouts).forEach(dayKey => {
      initialActiveIndexes[dayKey] = 0;
    });
    setActiveIndexes(initialActiveIndexes);
  }
}, [objectForWorkedWorkouts]);
const [sets, setSets] = useState({});
// Function to convert combined array back to original structure
const convertToOriginalStructure = (combinedArray) => {
  return combinedArray.reduce((acc, item) => {
    const key = item?.wrkKey;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};
const groupWorkoutsByWrkKey= (workouts) =>{
  const groupedWorkouts = {};

  workouts.forEach((workout) => {
    const { wrkKey, wktNam, dayKey, dayNam, date,images,exrTyp } = workout;

    if (!groupedWorkouts[wrkKey]) {
      // Initialize group if it doesn't exist
      groupedWorkouts[wrkKey] = {
        wrkKey,
        wktNam,
        dayKey,
        dayNam,
        date,
        images,
        exrTyp,
      };
    }
  });

  // Convert the object into an array
  return Object.values(groupedWorkouts);
}
/////////////console.log('passNewDate',passNewDate);


useEffect(() => {
    // Fetch the latest data or update the state here
  AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);
    
    setUserId(storedUser.id);
    
    function filterByDate(array, passNewDate) {
      return array.filter(item => item.date === passNewDate);
  }
    // Filter the array
    let filteredData = filterByDate(allUserWorkedWorkoutsFromDB, passNewDate);
    // console.log('allUserWorkedWorkoutsFromDB start exer with timer',allUserWorkedWorkoutsFromDB);

    ///console.log('filteredData start exer with timer',filteredData);
    if(filteredData.length > 0){
    // console.log('filteredData start exer with timer',filteredData);

      // if (TrainerTraineeSent) {
      //   console.log("Yes TrainerTraineeSent");
      // } else {
      //   console.log("TrainerTraineeSent undefined");
        
      // }
        const groupByDataIntoObjects = (array, key) => {
          return array.reduce((result, currentItem) => {
            (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
            return result;
          }, {});
        };
        const planWorkoutsDayKeysFilteredResultsGroupedByDayKey = groupByDataIntoObjects(filteredData, 'dayKey');
    
        setWorkedExercisesOrganizedByDayKey(planWorkoutsDayKeysFilteredResultsGroupedByDayKey);
        // console.log('setWorkedExercisesOrganizedByDayKey planWorkoutsDayKeysFilteredResultsGroupedByDayKey',planWorkoutsDayKeysFilteredResultsGroupedByDayKey);

        const daykeysWorkedWorkoutsValuesTemp = {};
        //daykeysWorkedWorkoutsConvertedToOriginalStructure
        Object.keys(planWorkoutsDayKeysFilteredResultsGroupedByDayKey).forEach(key => {
          daykeysWorkedWorkoutsValuesTemp[key] = convertToOriginalStructure(planWorkoutsDayKeysFilteredResultsGroupedByDayKey[key]);
        });
        setObjectForWorkedWorkouts(daykeysWorkedWorkoutsValuesTemp);
        // console.log('setObjectForWorkedWorkouts daykeysWorkedWorkoutsValuesTemp',daykeysWorkedWorkoutsValuesTemp);

  
    // Output the filtered data
    // /////////////console.log('allUserWorkedWorkoutsFromDB',allUserWorkedWorkoutsFromDB);
    
    // /////////////console.log('filteredData[0].plnKey',filteredData[0].plnKey);
    // /////////////console.log('filteredData[0].dayKey',filteredData[0].dayKey);

    // /////////////console.log('originalStructure',originalStructure);
    // we will get the day by getting the days from the plan then fikter the days to get the day
    ///////////console.log('storedUser.id>>>---',storedUser.id);
    ///////////console.log('filteredData>>>---',filteredData);
/////////////////////////////////// start show the data based on plan id////////////////
  //   fetchPublicWorkoutsPlanDaysWithoutDeleting(storedUser.id,filteredData[0].plnKey).then((publicWorkoutsPlanDaysTableResults) => {
  //     ///////////console.log('publicWorkoutsPlanDaysTableResults>>>---',publicWorkoutsPlanDaysTableResults);
  //     // Extract dayKey values from filteredData and get unique values using a Set
  //     const dayKeys = [...new Set(filteredData.map(item => item.dayKey))];

  //     // Filter publicWorkoutsPlanDaysTableResults based on the unique dayKey values
  //     const filteredArray = publicWorkoutsPlanDaysTableResults.filter(item => dayKeys.includes(item.speKey));
  //  ///console.log('filteredArray>>>---',filteredArray);

  //     // const filteredArray = publicWorkoutsPlanDaysTableResults.filter(item => item.speKey === filteredData[0].dayKey);

       
      

  //       // Extract speKeys from the filteredArray (not worked workouts but in plan)
  //       const filteredArraySpeKeys = filteredArray.map(item => item.speKey);

  //       // Filter the filteredData based on the DayKeys to filter it with just this plan workouts spekey
  //       const planWorkoutsDayKeysFilteredResults = filteredData.filter(item => filteredArraySpeKeys.includes(item.dayKey));
  //       ///////////console.log('planWorkoutsDayKeysFilteredResults',planWorkoutsDayKeysFilteredResults);

  //       const groupByDataIntoObjects = (array, key) => {
  //         return array.reduce((result, currentItem) => {
  //           (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
  //           return result;
  //         }, {});
  //       };
  //       const planWorkoutsDayKeysFilteredResultsGroupedByDayKey = groupByDataIntoObjects(planWorkoutsDayKeysFilteredResults, 'dayKey');
  //       ///console.log('planWorkoutsDayKeysFilteredResultsGroupedByDayKey>>>---',planWorkoutsDayKeysFilteredResultsGroupedByDayKey);

  //       const filteredArrayGroupedBySpeKey = groupByDataIntoObjects(filteredArray, 'speKey');
  //       ///console.log('filteredArrayGroupedBySpeKey>>>---',filteredArrayGroupedBySpeKey);

  //       ///////////console.log('todayDayworkouts>>>---',filteredArray);
  //       setTodayDayworkouts(filteredArray);

  //       /////////console.log('Grouped by dayKey:', planWorkoutsDayKeysFilteredResultsGroupedByDayKey);
  //       ///////console.log('ObjectForNotWorkedWorkouts:', filteredArrayGroupedBySpeKey);
        
  //       setObjectForNotWorkedWorkouts(filteredArrayGroupedBySpeKey);
  //       const daykeysWorkedWorkoutsValuesTemp = {};
  //       //daykeysWorkedWorkoutsConvertedToOriginalStructure
  //       Object.keys(planWorkoutsDayKeysFilteredResultsGroupedByDayKey).forEach(key => {
  //         daykeysWorkedWorkoutsValuesTemp[key] = convertToOriginalStructure(planWorkoutsDayKeysFilteredResultsGroupedByDayKey[key]);
  //       });
  //       ///console.log('daykeysWorkedWorkoutsValuesTemp>>>---',filteredArrayGroupedBySpeKey);

  //       ///////console.log('ObjectForWorkedWorkouts:', daykeysWorkedWorkoutsValuesTemp);
  //       setObjectForWorkedWorkouts(daykeysWorkedWorkoutsValuesTemp);

  //     //   const originalStructure = convertToOriginalStructure(filteredData);
  //     //   ///////////console.log('originalStructure',originalStructure);
   
  //     //  setNewWorkoutsFromDB(originalStructure);

  //     // Handle activeIndexes for each dayKey
  //     Object.keys(activeIndexes).forEach((dayKey) => {
  //       if(Object.keys(context.stateUser.userPublicSettings).length > 0){
  //         ///////////////console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
  //         const exertypInit = filteredArray?.[activeIndexes[dayKey]]?.exrTyp;
  //         setExertypInitConst(exertypInit);
  //         ///////////////console.log('exertypInit userPublicSettings',exertypInit);
  //         ///////////////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
  //         ///////////////console.log('activeIndex',activeIndex);
    
  //         if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
  //           ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
  //           setWrkTypTimInitSent(context.stateUser.userPublicSettings.cardio);
  //          // /////////////console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);
    
  //         }else if (exertypInit ==='Isolation'){
  //           ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
  //           setWrkTypTimInitSent(context.stateUser.userPublicSettings.isoltn);
  //           ///////////////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);
    
  //         }else if(exertypInit ==='Compound'){
  //           ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
  //           setWrkTypTimInitSent(context.stateUser.userPublicSettings.compnd);
  //           ///////////////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);
    
  //         }
        
  //       }else{
  //         ///////////////console.log('storedUser.id====',storedUser.id);
  //         fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
  //           const exertypInit = filteredArray?.[activeIndexes[dayKey]]?.exrTyp;
  //           setExertypInitConst(exertypInit);
  //           ///////////////console.log('exertypInit fetchPublicSettings',exertypInit);
  //           if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
  //             ///////////////console.log('PSettingsResults',PSettingsResults);
    
  //             setWrkTypTimInitSent(PSettingsResults[0].cardio);
  //             ///////////////console.log('WrkTypTimInitSent cardio',WrkTypTimInitSent);
      
  //           }else if (exertypInit ==='Isolation'){
  //             setWrkTypTimInitSent(PSettingsResults[0].isoltn);
  //             ///////////////console.log('WrkTypTimInitSent isoltn',WrkTypTimInitSent);
      
  //           }else if(exertypInit ==='Compound'){
  //             setWrkTypTimInitSent(PSettingsResults[0].compnd);
  //             ///////////////console.log('WrkTypTimInitSent compnd',WrkTypTimInitSent);
      
  //           }
      
  //         });
          
  //       }
  //     }); 
  //   });

/////////////////////////////////// End show the data based on plan id////////////////

/////////////////////////////////// start show the data  not based on plan id////////////////
// fetchPublicWorkoutsPlanDaysWithoutDeletingWithoutPlnKey(storedUser.id,).then((publicWorkoutsDaysTableResults) => {
//   ///////////console.log('publicWorkoutsDaysTableResults>>>---',publicWorkoutsDaysTableResults);
//   // Extract dayKey values from filteredData and get unique values using a Set
//   // const dayKeys = [...new Set(filteredData.map(item => item.dayKey))];

//   // // Filter publicWorkoutsDaysTableResults based on the unique dayKey values
//   // const filteredArray = publicWorkoutsDaysTableResults.filter(item => dayKeys.includes(item.speKey));
// ///console.log('filteredArray>>>---',filteredArray);

//   // const filteredArray = publicWorkoutsDaysTableResults.filter(item => item.speKey === filteredData[0].dayKey);

   
  

//     // Extract speKeys from the filteredArray (not worked workouts but in plan)
//     // const filteredArraySpeKeys = filteredArray.map(item => item.speKey);

//     // Filter the filteredData based on the DayKeys to filter it with just this plan workouts spekey
//     // const planWorkoutsDayKeysFilteredResults = filteredData.filter(item => filteredArraySpeKeys.includes(item.dayKey));
//     ///////////console.log('planWorkoutsDayKeysFilteredResults',planWorkoutsDayKeysFilteredResults);

   
//     // const filteredArrayGroupedBySpeKey = groupByDataIntoObjects(filteredArray, 'speKey');
//     ///console.log('filteredArrayGroupedBySpeKey>>>---',filteredArrayGroupedBySpeKey);

//     ///////////console.log('todayDayworkouts>>>---',filteredArray);
//     // setTodayDayworkouts(filteredArray);

//     /////////console.log('Grouped by dayKey:', planWorkoutsDayKeysFilteredResultsGroupedByDayKey);
//     ///////console.log('ObjectForNotWorkedWorkouts:', filteredArrayGroupedBySpeKey);
    
//     // setObjectForNotWorkedWorkouts(filteredArrayGroupedBySpeKey);
    
//     ///console.log('daykeysWorkedWorkoutsValuesTemp>>>---',filteredArrayGroupedBySpeKey);

//     ///////console.log('ObjectForWorkedWorkouts:', daykeysWorkedWorkoutsValuesTemp);

//   //   const originalStructure = convertToOriginalStructure(filteredData);
//   //   ///////////console.log('originalStructure',originalStructure);

//   //  setNewWorkoutsFromDB(originalStructure);

//   // Handle activeIndexes for each dayKey
//   // Object.keys(activeIndexes).forEach((dayKey) => {
//   //   if(Object.keys(context.stateUser.userPublicSettings).length > 0){
//   //     ///////////////console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
//   //     const exertypInit = filteredArray?.[activeIndexes[dayKey]]?.exrTyp;
//   //     setExertypInitConst(exertypInit);
//   //     ///////////////console.log('exertypInit userPublicSettings',exertypInit);
//   //     ///////////////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
//   //     ///////////////console.log('activeIndex',activeIndex);

//   //     if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
//   //       ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
//   //       setWrkTypTimInitSent(context.stateUser.userPublicSettings.cardio);
//   //      // /////////////console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);

//   //     }else if (exertypInit ==='Isolation'){
//   //       ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
//   //       setWrkTypTimInitSent(context.stateUser.userPublicSettings.isoltn);
//   //       ///////////////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);

//   //     }else if(exertypInit ==='Compound'){
//   //       ///////////////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
//   //       setWrkTypTimInitSent(context.stateUser.userPublicSettings.compnd);
//   //       ///////////////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);

//   //     }
    
//   //   }else{
//   //     ///////////////console.log('storedUser.id====',storedUser.id);
//   //     fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
//   //       const exertypInit = filteredArray?.[activeIndexes[dayKey]]?.exrTyp;
//   //       setExertypInitConst(exertypInit);
//   //       ///////////////console.log('exertypInit fetchPublicSettings',exertypInit);
//   //       if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
//   //         ///////////////console.log('PSettingsResults',PSettingsResults);

//   //         setWrkTypTimInitSent(PSettingsResults[0].cardio);
//   //         ///////////////console.log('WrkTypTimInitSent cardio',WrkTypTimInitSent);
  
//   //       }else if (exertypInit ==='Isolation'){
//   //         setWrkTypTimInitSent(PSettingsResults[0].isoltn);
//   //         ///////////////console.log('WrkTypTimInitSent isoltn',WrkTypTimInitSent);
  
//   //       }else if(exertypInit ==='Compound'){
//   //         setWrkTypTimInitSent(PSettingsResults[0].compnd);
//   //         ///////////////console.log('WrkTypTimInitSent compnd',WrkTypTimInitSent);
  
//   //       }
  
//   //     });
      
//   //   }
//   // }); 
// });

/////////////////////////////////// End show the data not based on plan id////////////////



    }
    
    
      
   
    });
  }, [activeIndexes,allUserWorkedWorkoutsFromDB, passNewDate]);
  ///////////console.log('todayDayworkouts)',todayDayworkouts);

  // objectForWorkedWorkouts
  // objectForNotWorkedWorkouts


// const publicPlansDataTableItemDay = todayDayworkouts;
///////////console.log('publicPlansDataTableItemDay)',publicPlansDataTableItemDay);

// const publicPlansDataTableItemDayNewData =publicPlansDataTableItemDay;
// ///////////console.log('publicPlansDataTableItemDayNewData)',publicPlansDataTableItemDayNewData);
//   const startExercisesWithTimerDataArr = newWorkoutsFromDB;
  ///////////console.log('startExercisesWithTimerDataArr',startExercisesWithTimerDataArr);
  const combineArrays = (data) => {
    return Object.values(data).reduce((acc, val) => {
      return acc.concat(val);
    }, []);
  };
  // useEffect(() => {
    // /////////////console.log('newWorkoutsFromDB',newWorkoutsFromDB); 
    // if (Object.keys(newWorkoutsFromDB).length === 0) {
    //   /////////////console.log("newWorkoutsFromDB is empty");
    // } else {
    //   /////////////console.log("newWorkoutsFromDB is not empty");
    // }
  // }, []);
 

  const handleStoryPress = (dayKey, index) => {
    setActiveIndexes(prevState => ({
      ...prevState,
      [dayKey]: index,
    }));
  };

  // useEffect(() => {
  //   const updatedSets = publicPlansDataTableItemDay.reduce((acc, row, i) => {
  //     const activeWorkoutId = publicPlansDataTableItemDayNewData[i]?.wrkKey;
  //     const wrkKey = publicPlansDataTableItemDayNewData[i]?.wrkKey;
  //     const wktNam = publicPlansDataTableItemDayNewData[i]?.wktNam;
  //     const plnKey = publicPlansDataTableItemDayNewData[i]?.plnKey;
  //     const exrTyp = publicPlansDataTableItemDayNewData[i]?.exrTyp;
  //     const totalSets = row.wrkSts;
  //     const dayName = row.dayNam;
  //     const speKey = publicPlansDataTableItemDay[0]?.speKey;
  //     const date = new Date().toISOString().split('T')[0];

  //     acc[activeWorkoutId] = Array.from({ length: totalSets }, (_, index) => ({
  //       userId:userId,
  //       plnKey: plnKey, // Add plnKey field
  //       dayKey: speKey, // Change id to speKey
  //       dayName: dayName, // Add dayName field
  //       date: date, // Add date field
  //       wrkKey:wrkKey,
  //       wktNam: wktNam, // Add workoutName field
  //       sets: index + 1,
  //       weight: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.weight !== undefined)
  //         ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.weight) : (""),
  //       reps: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.reps !== undefined)
  //         ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.reps) : (""),
  //       casTim: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.casTim !== undefined)
  //       ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.casTim) : (0),
  //       isCompleted: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.isCompleted !== undefined)
  //         ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.isCompleted) : (false),
  //       timerStarted: false,
  //       dayTim: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.dayTim !== undefined)
  //       ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.dayTim) : 0,
  //       deleted:'no',
  //       isSync:'no'
  //     }));
  
  //     return acc;
  //   }, {});

  //   const workedExercisesArray = {
  //     [publicPlansDataTableItemDay[0]?.speKey]: {
  //       workedExercises: updatedSets
  //     }
  //   };
  //   setSets(workedExercisesArray);
  // }, [publicPlansDataTableItemDay, startExercisesWithTimerDataArr,userId]);
  

  









function isImageUrl(url) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
  const lowercasedUrl = url?.toLowerCase();
  return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
}   
const RenderItem = ({ item, index,dayKey }) => {
  
  ///console.log('renderItem activeIndexes',activeIndexes);
  ///console.log('renderItem dayKey',dayKey);
  ///console.log('renderItem item',item);
  ///console.log('renderItem workedExercisesOrganizedByDayKey',workedExercisesOrganizedByDayKey);
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

  return(
    <View style={{marginRight:10,
    alignItems: 'center',flexWrap: 'wrap'}}>
      <TouchableOpacity key={`${item?.dayKey}-${item?.wrkKey}`}
        style={[
          styles.storyItem,
          (activeIndexes[dayKey] === index ) && styles.activeStory,
          ((objectForWorkedWorkouts[dayKey][item?.wrkKey]?.every((set) => (parseFloat(set.isCmpld) ? true : false)) || (index+1 === item?.wrkKey))) && { opacity: 0.5 }, // Adjust the opacity as needed
        ]}
        onPress={() => {
    // Disable the onPress when all sets are completed
    /////console.log('handleStoryPress(index)',index,item)
    handleStoryPress(dayKey, index);
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
    {/* <Image
          style={{ height: 80, width: "100%", borderRadius: 23 }}

          source={item?.images != null && item?.images != '' ? (
              item?.images?.startsWith('../../../../assets/images')
                ? mainWorkoutsData[item?.wrkKey-1]?.images
                : item?.images?.startsWith('file:///data/user')
                ? { uri: item?.images }
                : item?.images?.startsWith('https://www.elementdevelops.com')
                ? { uri: item?.images }
                : item?.images.startsWith('https://lifeapp23.e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com')
                ? { uri: item?.images.replace('https://lifeapp23.e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                : require('../../../../assets/gym-workout.png')
          ):(require('../../../../assets/gym-workout.png'))
          }
        /> */}
        {/* Display green check sign if all sets for this workout are completed */}
        {((objectForWorkedWorkouts[dayKey][item?.wrkKey]?.every((set) => (parseFloat(set.isCmpld) ? true : false)) || (index+1 === item?.wrkKey))) && (
          <Text style={{ color: 'green', position: 'absolute', top: '50%', left: '50%', marginLeft: -12, marginTop: -12,fontSize:20 }}>✔✔</Text>
        )}
      </TouchableOpacity>
      <View style={{ maxWidth: 80,}}>
        <Text style={{color:'black',fontSize:14,marginTop:10}}>{item.wktNam}</Text>
      </View>    
    </View>
  )};




// Call the combineArrays function
// let combinedArray = [];
// if(newWorkoutsFromDB != undefined){
//   combinedArray = combineArrays(newWorkoutsFromDB);

// }
// Output the combined array
///////////////console.log("Combined Array:", combinedArray);

/////////////console.log('setsFromDB',setsFromDB);
////////////// i added the name of exercises with id 
// objectForWorkedWorkouts
  // objectForNotWorkedWorkouts
  ///console.log('workedExercisesOrganizedByDayKey----',workedExercisesOrganizedByDayKey);
  ///console.log('objectForWorkedWorkouts----',objectForWorkedWorkouts);

  return (
    
     
          <>
          {(Object.keys(objectForWorkedWorkouts).length === 0)?
              (
                <DataTable >
                <DataTable.Header>
                  <DataTableTitleValue><DataTableTitleValueText>{t("No_Entry_Found")}</DataTableTitleValueText></DataTableTitleValue>
                </DataTable.Header>
                <Spacer size="large">
                  <Spacer size="large">
                    <CalendarFullSizePressableButton
                      onPress={hideModal} style={{backgroundColor:"#000",width:width-20,marginLeft:10,marginRight:10}}>
                      <CalendarFullSizePressableButtonText >{t("Back_to_Calendar")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </Spacer>
                </Spacer>
                </DataTable>
              ):
              (   
                <>
                <PageContainer style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <TitleView >
                    <Title >Life</Title>
                  </TitleView>
                        {Object.keys(objectForWorkedWorkouts).map((dayKey) => {
                        /////console.log('dayKey',dayKey);
                        {/* ///console.log('objectForNotWorkedWorkouts',objectForNotWorkedWorkouts); */}
                        ///console.log('objectForWorkedWorkouts[dayKey]',objectForWorkedWorkouts[dayKey]);

                        const groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises = groupWorkoutsByWrkKey(workedExercisesOrganizedByDayKey[dayKey]);
                        {/* console.log('groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises',groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises);
                        console.log('workedExercisesOrganizedByDayKey',workedExercisesOrganizedByDayKey); */}

                        return(

                                  
                            <View key={dayKey} style={{ height:'auto' }}>


                                    
                                    <ServicesPagesCardCover>
                                      <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                                      <ServicesPagesCardHeader>{workedExercisesOrganizedByDayKey[dayKey]?.[0]?.dayNam ? workedExercisesOrganizedByDayKey[dayKey]?.[0]?.dayNam : `${t('Loading')}....`}</ServicesPagesCardHeader>
                                    </ServicesPagesCardCover>
                                    <View style={{marginTop:10,marginBottom:10,marginLeft:10}}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                      {/* flat list for the circles at the top of the page */}
                                      <FlatList
                                        data={groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises}
                                        renderItem={({ item, index }) => (
                                            <RenderItem
                                                item={item}
                                                index={index}
                                                dayKey={dayKey}
                                            />
                                        )}
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
                                        <Text style={[styles.headerCell,styles.headerSetCell,isArabic ? styles.ArabicHeaderSets : styles.EnglishHeaderSets]}>{t('Set')}</Text>
                                          {groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === 'Cardio' || groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === 'Stability' ? (
                                            <Text style={[styles.headerStopWatchCell,isArabic ? styles.ArabicHeaderStopwatch : styles.EnglishHeaderStopwatch]}>{t('Stopwatch')}</Text>
                                        ) : groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === '' ? (
                                          <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicHeaderLoading : styles.EnglishHeaderLoading]}>{t('Loading')}...</Text>
                                        ) : (
                                          <>
                                          <Text style={[styles.headerWeightCell,isArabic ? styles.ArabicHeaderWeightCell : styles.EnglishHeaderWeightCell]}>{t('Weight')}</Text>
                                          <Text style={[styles.headerRepsCell,isArabic ? styles.ArabicHeaderRepsCell : styles.EnglishHeaderRepsCell]}>{t('Reps')}</Text>
                                          </>
                                        )}
                                        <Text style={[styles.headerCell,isArabic ? styles.ArabicHeaderCompletedCell : styles.EnglishHeaderCompletedCell]}>{t('Completed')}</Text>
                                        </View>
                                          <View>
                                            {workedExercisesOrganizedByDayKey[dayKey].map((row, i) => {
                                              {/* ///console.log('row.dayKey}-${row?.wrkKey,i',row.speKey,row?.wrkKey,i);
                                              ///console.log('row',row); */}
                                              {/* ///console.log('row.dayKey',row.dayKey); 
                                              ///console.log('row?.wrkKey',row?.wrkKey); 
                                              ///console.log('row?. si',i);  */}

                                              return (  
                                              <View key={`${row.dayKey}-${row?.wrkKey}-${i}`} style={{ display: (activeIndexes[dayKey] === i) ? 'flex' : 'none' }}>
                                                {objectForWorkedWorkouts[dayKey][workedExercisesOrganizedByDayKey[dayKey][i]?.wrkKey]?.map((set, index, array) => {
                                              
                                                  {/* ///console.log('set!!!',set);
                                                console.log('objectForWorkedWorkouts[dayKey][objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.wrkKey]!!!',objectForWorkedWorkouts[dayKey][objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.wrkKey]);

                                                   */}
                                                  {/* console.log('row.exrTyp',row.exrTyp  ); 
                                                  console.log('set.dayKeyp',set.dayKey  ); 
                                                  console.log('set?.wrkKey',set?.wrkKey  );  */}

                                                   
                                                return(
                                            <View key={`${set.dayKey}-${set?.wrkKey}-${index}`} style={[styles.row,styles.InputsRows]}>
                                              <Text style={[styles.setsCell,isArabic ? styles.ArabicSetsBoddy : styles.EnglishSetsBoddy]}>{parseFloat(set.sets)}</Text>
                                              

                                              
                                                    {groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === 'Cardio' || groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === 'Stability' ? (
                                                      <SecondTimer  index={index} publicPlansDataTableItemDayNewData={workedExercisesOrganizedByDayKey[dayKey]} activeIndexes={activeIndexes} set={set} groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises={groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises} objectForWorkedWorkouts={objectForWorkedWorkouts} dayKey={dayKey}/>
                                                    ) : groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.exrTyp === '' ? (
                                                      <Text style={[{color: 'black', fontSize: 11, fontFamily: 'OpenSans_400Regular'},isArabic ? styles.ArabicBodyLoading : styles.EnglishBodyLoading]}>{t("Loading")}...</Text>
                                                    ) : (
                                                      <>
                                                      <TextInput
                                                          style={[styles.WorkoutsInput,isArabic ? styles.ArabicBodyWeightsInput : styles.EnglishBodyWeightsInput]}
                                                          placeholder={t("weight")}
                                                          // onFocus={handleInputFocus}
                                                          editable={!(parseFloat(set.isCmpld) ? true : false)}
                                                          selectTextOnFocus={!(parseFloat(set.isCmpld) ? true : false)}
                                                          keyboardType="numeric"
                                                          value={objectForWorkedWorkouts[dayKey][groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.wrkKey]?.[index]?.weight}
                                                          
                                                        />
                                                      <TextInput
                                                        style={[styles.WorkoutsInput,isArabic ? styles.ArabicBodyRepsInput : styles.EnglishBodyRepsInput]}
                                                        placeholder={t("Reps")}
                                                        keyboardType="numeric"
                                                        editable={!(parseFloat(set.isCmpld) ? true : false)}
                                                        selectTextOnFocus={!(parseFloat(set.isCmpld) ? true : false)}
                                                        value={objectForWorkedWorkouts[dayKey][groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.wrkKey]?.[index]?.reps}
                                                        
                                                      />
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
                                                  
                                                  disabled={(parseFloat(set.isCmpld) ? true : false)}
                                                >
                                                  { objectForWorkedWorkouts[dayKey][groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises[activeIndexes[dayKey]]?.wrkKey]?.[index]?.isCmpld == true? 
                                                  
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
                                      </View>

                                    </View>
                                    
                                  </View>
                                  

                              )}
                    
                              
                    )}
                    <Spacer size="large">
                    <Spacer size="large">
                      <CalendarFullSizePressableButton
                        onPress={hideModal} style={{backgroundColor:"#000",width:width-20,marginLeft:10,marginRight:10}}>
                        <CalendarFullSizePressableButtonText >{t("Back_to_Calendar")}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                    </Spacer>
                  </Spacer>
                  <Spacer size="large"></Spacer>
                  <Spacer size="large"></Spacer>
                  <Spacer size="large"></Spacer>

              </ScrollView>
            </PageContainer>
                  
            </> 
            
     
        )}   
    </>
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
    marginBottom:20,
    padding: 8,
  },

  InputsRows:{
  height:55,
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
    marginLeft:40,
    padding: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
  },
  headerSetCell:{
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',
  },
  headerWeightCell: {
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',

  },
  headerStopWatchCell:{
    fontWeight: 'bold',
    color:"black",
    fontFamily:'OpenSans_400Regular',

  },
  headerRepsCell: {
    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"black",

  },
   headerComletedCell:{
    fontWeight: 'bold',
    fontFamily:'OpenSans_400Regular',
    color:"black",

   },
  setsCell: {

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
   WorkoutsRepsInput: {
    position:'absolute',
    left:"50%"
  },
  WorkoutsWeightsInput: {
    position:'absolute',
    left:"20%"
  },
  completeButton: {
    borderRadius: 8,
    padding: 0,
    alignItems: 'center',
    borderWidth: 1,
    //backgroundColor:'black',
    width:35,
    height:28,
    position:'absolute',
    right:'10%',
    
  },
  timer: {
    fontSize: 18,
    textAlign: 'center',
  },

  ArabicHeaderSets:{
    position:"absolute",
    left:"5%",
  },
  EnglishHeaderSets:{
    position:"absolute",
    left:"5%",
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
    left:"39%",
  },
  EnglishHeaderStopwatch:{
    position:"absolute",
    left:"39%",
  },
  ArabicHeaderWeightCell:{
    position:"absolute",
    left:"38%",
  },
  EnglishHeaderWeightCell:{
    position:"absolute",
    left:"25%",
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
    left:"65%",
    
  },
  EnglishHeaderRepsCell:{
    position:"absolute",
    left:"55%",
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
    left:"51%",
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



});