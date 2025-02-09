import React, { useState, useEffect,useContext  } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity,Image, ScrollView, TextInput,Alert , Dimensions } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { DataTable} from 'react-native-paper';
const { width } = Dimensions.get('window');

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
import { fetchPublicWorkoutsPlanDaysWithoutDeleting } from "../../../../database/public_workouts_plan_days";
import axios from 'axios';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";

import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';


const SecondTimer = React.memo(({index,publicPlansDataTableItemDayNewData,activeIndexes,set,groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises,objectForWorkedWorkouts,dayKey}) => {
  const [timerTwo, setTimerTwo] = useState(0);
  const [isStarted, setIsStarted] = useState(false) ;
  const [timerRunning, setTimerRunning] = useState(false);
  ////console.log('timerTwo index',index,timerTwo);
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

export const TrainerTraineeStartExercisesWithTimerFromCalendarScreen = ({hideModal,passNewDate,publicWorkoutsPlanRowCon,allUserWorkedWorkoutsFromDB}) => {
  const [todayDayworkouts,setTodayDayworkouts] = useState([]);
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [dayFilteredArray,setDayFilteredArray] =  useState([]);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  // console.log('TrainerTraineeStartExercisesWithTimerFromCalendarScreen allUserWorkedWorkoutsFromDB:', allUserWorkedWorkoutsFromDB);

  
  //   const publicPlansDataTableItemDayNewData = publicPlansDataTableItemDay.map((item, index) => ({
//   ...item,
//   id: index + 1, // Adding 1 to make the id start from 1 (if needed)
// }));
const context = useContext(AuthGlobal);

const [userId,setUserId] = useState('');
const [activeIndex, setActiveIndex] = useState(0);
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
    const key = item.wrkKey;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

//console.log('passNewDate',passNewDate);
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

useEffect(() => {
    // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
    .then((res) => { 
    AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      
      setUserId(storedUser.id);
      
      function filterByDate(array, passNewDate) {
        return array.filter(item => item.date === passNewDate);
    }
      // Filter the array
      let allUserWorkedWorkoutsFromDBFilteredData = filterByDate(allUserWorkedWorkoutsFromDB, passNewDate);
      
      //console.log('allUserWorkedWorkoutsFromDBFilteredData',allUserWorkedWorkoutsFromDBFilteredData);
      if(allUserWorkedWorkoutsFromDBFilteredData?.length > 0){
           //   const originalStructure = convertToOriginalStructure(allUserWorkedWorkoutsFromDBFilteredData);
      // setNewWorkoutsFromDB(originalStructure);
      const groupByDataIntoObjects = (array, key) => {
        return array.reduce((result, currentItem) => {
          (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
          return result;
        }, {});
      };
      const allUserWorkedWorkoutsFromDBFilteredDataWorkedExercisesOrganizedByDayKey = groupByDataIntoObjects(allUserWorkedWorkoutsFromDBFilteredData, 'dayKey');
      setWorkedExercisesOrganizedByDayKey(allUserWorkedWorkoutsFromDBFilteredDataWorkedExercisesOrganizedByDayKey);
      
      const spekeysWorkedWorkoutsValuesTempWithoutPlanId = {};
      Object.keys(allUserWorkedWorkoutsFromDBFilteredDataWorkedExercisesOrganizedByDayKey).forEach(key => {
        spekeysWorkedWorkoutsValuesTempWithoutPlanId[key] = convertToOriginalStructure(allUserWorkedWorkoutsFromDBFilteredDataWorkedExercisesOrganizedByDayKey[key]);
      });
      setObjectForWorkedWorkouts(spekeysWorkedWorkoutsValuesTempWithoutPlanId);
        //   //console.log('my plan Days page',publicWorkoutsPlanRowCon);

        // const unsubscribe = addEventListener(state => {
        //   //console.log("Connection type--", state.type);
        //   //console.log("Is connected?---", state.isConnected);
        //   setTriainerConnected(state.isConnected);
        // if(state.isConnected){
        //   //console.log('---------------now online--------')
        //   //console.log('my plan Days page',publicWorkoutsPlanRowCon);

        //   ///////////////////////start filter data based on plan Id /////////////////////
        // //   axios.get(`https://life-pf.com/api/get-trainer-trainee-plan-days?traineeId=${publicWorkoutsPlanRowCon?.trneId}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&planId=${publicWorkoutsPlanRowCon?.id}`, {
        // //   headers: {
        // //     'Authorization': `Bearer ${res}`,
        // //     'Content-Type': 'application/json',
        // //   },
        // //   })
        // //   .then(response => {
        // //     // Handle successful response
        // //     //console.log('Plan Days::',response.data);
        // //     const planDaysData = response?.data?.["getTraineePlanDays"];
        // //     // console.log('Plan Days::',planDaysData);
        // //     const resultNewPlanDaysDataArray = [];

        // //     planDaysData.forEach(item => {
        // //       // Parse the wrkAry string into an array of objects
        // //       const parsedWrkAry = JSON.parse(item?.wrkAry);
            
        // //       // Add the necessary properties to each object in the parsedWrkAry
        // //       const enrichedWrkAry = parsedWrkAry.map(workout => ({
        // //         ...workout,
        // //         dayNam: item.dayNam,
        // //         id: item.id,
        // //         planId: item.planId,
        // //         dayKey: item.dayKey,
        // //         trneId: item.trneId,
        // //         trnrId: item.trnrId
        // //       }));
            
        // //       // Push the enriched workouts to the resultArray
        // //       resultNewPlanDaysDataArray.push(...enrichedWrkAry);
        // //     });
            
        // //     // Log the result
        // //     // console.log("resultNewPlanDaysDataArray",resultNewPlanDaysDataArray);
           
        // //     const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
        // //     //console.log('userPublicSettings:', userPublicSettings);
        // //   // Extract SpeKeys values from allUserWorkedWorkoutsFromDBFilteredDataSpeKeys and get unique values using a Set
        // //   const allUserWorkedWorkoutsFromDBFilteredDataSpeKeys = [...new Set(allUserWorkedWorkoutsFromDBFilteredData.map(item => item.dayKey))];
        // // // Filter publicWorkoutsPlanDaysTableResults based on the unique speKey values
        // // const resultNewPlanDaysDataArrayFilteredArray = resultNewPlanDaysDataArray?.filter(item => allUserWorkedWorkoutsFromDBFilteredDataSpeKeys.includes(item.dayKey));
        // //   // Extract speKeys from the filteredArray (not worked workouts but in plan)
        // //   const resultNewPlanDaysDataArrayFilteredArraySpeKeys = resultNewPlanDaysDataArrayFilteredArray.map(item => item.dayKey);
        // // // Filter the filteredData based on the SpeKeys to filter it with just this plan workouts spekey
        // // const planWorkoutsSpeKeysFilteredResults = allUserWorkedWorkoutsFromDBFilteredData.filter(item => resultNewPlanDaysDataArrayFilteredArraySpeKeys.includes(item.dayKey));
        // // const groupByDataIntoObjects = (array, key) => {
        // //   return array.reduce((result, currentItem) => {
        // //     (result[currentItem[key]] = result[currentItem[key]] || []).push(currentItem);
        // //     return result;
        // //   }, {});
        // // };
        // // const planWorkoutsSpeKeysFilteredResultsGroupedBySpeKey = groupByDataIntoObjects(planWorkoutsSpeKeysFilteredResults, 'speKey');
        // // const resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKey = groupByDataIntoObjects(resultNewPlanDaysDataArrayFilteredArray, 'speKey');

        // // setTodayDayworkouts(resultNewPlanDaysDataArrayFilteredArray);

        // // setObjectForNotWorkedWorkouts(resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKey);
        // // const spekeysWorkedWorkoutsValuesTemp = {};
        // // //speKeysWorkedWorkoutsConvertedToOriginalStructure
        // // Object.keys(planWorkoutsSpeKeysFilteredResultsGroupedBySpeKey).forEach(key => {
        // //   spekeysWorkedWorkoutsValuesTemp[key] = convertToOriginalStructure(planWorkoutsSpeKeysFilteredResultsGroupedBySpeKey[key]);
        // // });
        // // setObjectForWorkedWorkouts(spekeysWorkedWorkoutsValuesTemp);
        // //   const exertypInit = resultNewPlanDaysDataArrayFilteredArray?.[activeIndexes[dayKey]]?.exrTyp;
        // //   setExertypInitConst(exertypInit);
        // //   // const exertimInit = resultNewPlanDaysDataArrayFilteredArray?.[activeIndexes[dayKey]]?.exrTim;

        // //   // setWrkTypTimInitSent(exertimInit);





        // //     // // Filter publicWorkoutsPlanDaysTableResults based on the unique speKey values
        // //     // const filteredArray = resultNewPlanDaysDataArray.filter(item => item.dayKey === allUserWorkedWorkoutsFromDBFilteredData[0].dayKey);
        // //     // //console.log('planDaysData',planDaysData);
        // //     // setDayFilteredArray(filteredArray);
        // //     // //console.log('filteredArray?.[0]',filteredArray?.[0]);
        // //     // const wrkAryConst =  filteredArray?.[0]?.wrkAry;
        // //     // let newafterJsonWrk = [];         
        // //     // if (wrkAryConst && typeof wrkAryConst !== 'undefined' ) {
        // //     //   newafterJsonWrk = JSON.parse(wrkAryConst);
        // //     //  //console.log('newafterJsonWrk:', newafterJsonWrk);
   
        // //     //    }
        // //     // setTodayDayworkouts(newafterJsonWrk);

        // //     // const exertypInit = newafterJsonWrk?.[activeIndex]?.exrTyp;

        // //     // setExertypInitConst(exertypInit);
        // //     ////console.log('exertypInit userPublicSettings',exertypInit);
        // //     ////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
        // //     ////console.log('activeIndex',activeIndex);

        // //     // if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.cardio);
        // //     //   // //console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);

        // //     // }else if (exertypInit ==='Isolation'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.isoltn);
        // //     //   ////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);

        // //     // }else if(exertypInit ==='Compound'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.compnd);
        // //     //   ////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);

        // //     // }
          
        // //   })
        // //   .catch(error => {
        // //     // Handle error
        // //     //console.log('Error fetching Performed Workouts:', error);
        // //   });
        //   ///////////////////////End filter data based on plan Id /////////////////////

        // ///////////////////////start filter data based on without plan Id /////////////////////
        
        // // axios.get(`https://life-pf.com/api/get-trainer-trainee-plan-days-without-planId?traineeId=${publicWorkoutsPlanRowCon?.trneId}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}`, {
        // //   headers: {
        // //     'Authorization': `Bearer ${res}`,
        // //     'Content-Type': 'application/json',
        // //   },
        // //   })
        // //   .then(response => {
        // //     // Handle successful response
        // //     //console.log('Plan Days::',response.data);
        // //     const planDaysDataWithoutPlanIdWithoutPlanId = response?.data?.["getTraineePlanDays"];
        // //     // console.log('planDaysDataWithoutPlanIdWithoutPlanId::',planDaysDataWithoutPlanIdWithoutPlanId);
        // //     const resultNewPlanDaysDataArrayWithoutPlanId = [];

        // //     planDaysDataWithoutPlanIdWithoutPlanId.forEach(item => {
        // //       // Parse the wrkAry string into an array of objects
        // //       const parsedWrkAry = JSON.parse(item?.wrkAry);
            
        // //       // Add the necessary properties to each object in the parsedWrkAry
        // //       const enrichedWrkAry = parsedWrkAry.map(workout => ({
        // //         ...workout,
        // //         dayNam: item.dayNam,
        // //         id: item.id,
        // //         planId: item.planId,
        // //         dayKey: item.speKey,
        // //         trneId: item.trneId,
        // //         trnrId: item.trnrId
        // //       }));
        // //       console.log('enrichedWrkAry::',enrichedWrkAry);

        // //       // Push the enriched workouts to the resultArray
        // //       resultNewPlanDaysDataArrayWithoutPlanId.push(...enrichedWrkAry);
        // //     });
            
        // //     // Log the result
        // //     // console.log("resultNewPlanDaysDataArray",resultNewPlanDaysDataArray);
           
        // //     const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
        // //     //console.log('userPublicSettings:', userPublicSettings);
        // //   // Extract SpeKeys values from allUserWorkedWorkoutsFromDBFilteredDataSpeKeys and get unique values using a Set
        // //   // const allUserWorkedWorkoutsFromDBFilteredDataSpeKeysWithoutPlanId = [...new Set(allUserWorkedWorkoutsFromDBFilteredData.map(item => item.dayKey))];
        // // // Filter publicWorkoutsPlanDaysTableResults based on the unique speKey values
        // // // const resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId = resultNewPlanDaysDataArrayWithoutPlanId?.filter(item => allUserWorkedWorkoutsFromDBFilteredDataSpeKeysWithoutPlanId.includes(item.dayKey));
        // // // console.log('resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId',resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId);

        // // // Extract speKeys from the filteredArray (not worked workouts but in plan)
        // //   // const resultNewPlanDaysDataArrayFilteredArraySpeKeysWithoutPlanId = resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId.map(item => item.dayKey);
        // // // Filter the filteredData based on the SpeKeys to filter it with just this plan workouts spekey
        // // // console.log('allUserWorkedWorkoutsFromDBFilteredData',allUserWorkedWorkoutsFromDBFilteredData);
        // // // console.log('resultNewPlanDaysDataArrayFilteredArraySpeKeysWithoutPlanId',resultNewPlanDaysDataArrayFilteredArraySpeKeysWithoutPlanId);

        // // // const planWorkoutsSpeKeysFilteredResultsWithoutPlanId = allUserWorkedWorkoutsFromDBFilteredData.filter(item => resultNewPlanDaysDataArrayFilteredArraySpeKeysWithoutPlanId.includes(item.dayKey));

        
        // // // const resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKeyWithoutPlanId = groupByDataIntoObjects(resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId, 'dayKey');
        // // // console.log('planWorkoutsSpeKeysFilteredResultsGroupedBySpeKeyWithoutPlanId',planWorkoutsSpeKeysFilteredResultsGroupedBySpeKeyWithoutPlanId);
        // // // console.log('setTodayDayworkouts resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId',resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId);

        // // // setTodayDayworkouts(resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId);
        // // // console.log('setObjectForNotWorkedWorkouts resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKeyWithoutPlanId',resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKeyWithoutPlanId);

        // // // setObjectForNotWorkedWorkouts(resultNewPlanDaysDataArrayFilteredArrayGroupedBySpeKeyWithoutPlanId);
        
        // // // console.log('setObjectForWorkedWorkouts spekeysWorkedWorkoutsValuesTempWithoutPlanId',spekeysWorkedWorkoutsValuesTempWithoutPlanId);

        // //   // const exertypInit = resultNewPlanDaysDataArrayFilteredArrayWithoutPlanId?.[activeIndexes[dayKey]]?.exrTyp;
        // //   // setExertypInitConst(exertypInit);
        // //   // const exertimInit = resultNewPlanDaysDataArrayFilteredArray?.[activeIndexes[dayKey]]?.exrTim;

        // //   // setWrkTypTimInitSent(exertimInit);





        // //     // // Filter publicWorkoutsPlanDaysTableResults based on the unique speKey values
        // //     // const filteredArray = resultNewPlanDaysDataArray.filter(item => item.dayKey === allUserWorkedWorkoutsFromDBFilteredData[0].dayKey);
        // //     // //console.log('planDaysData',planDaysData);
        // //     // setDayFilteredArray(filteredArray);
        // //     // //console.log('filteredArray?.[0]',filteredArray?.[0]);
        // //     // const wrkAryConst =  filteredArray?.[0]?.wrkAry;
        // //     // let newafterJsonWrk = [];         
        // //     // if (wrkAryConst && typeof wrkAryConst !== 'undefined' ) {
        // //     //   newafterJsonWrk = JSON.parse(wrkAryConst);
        // //     //  //console.log('newafterJsonWrk:', newafterJsonWrk);
   
        // //     //    }
        // //     // setTodayDayworkouts(newafterJsonWrk);

        // //     // const exertypInit = newafterJsonWrk?.[activeIndex]?.exrTyp;

        // //     // setExertypInitConst(exertypInit);
        // //     ////console.log('exertypInit userPublicSettings',exertypInit);
        // //     ////console.log('publicPlansDataTableItemDayNewData[activeIndex]',publicPlansDataTableItemDayNewData[activeIndex]);
        // //     ////console.log('activeIndex',activeIndex);

        // //     // if (exertypInit === 'Cardio' || exertypInit === 'Stability'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.cardio);
        // //     //   // //console.log('WrkTypTimInitSent cardio',context.stateUser.userPublicSettings.cardio);

        // //     // }else if (exertypInit ==='Isolation'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.isoltn);
        // //     //   ////console.log('WrkTypTimInitSent isoltn',context.stateUser.userPublicSettings.isoltn);

        // //     // }else if(exertypInit ==='Compound'){
        // //     //   ////console.log('context.stateUser.userPublicSettings exertypInit',exertypInit);
        // //     //   setWrkTypTimInitSent(userPublicSettings.compnd);
        // //     //   ////console.log('WrkTypTimInitSent compnd',context.stateUser.userPublicSettings.compnd);

        // //     // }
          
        // //   })
        // //   .catch(error => {
        // //     // Handle error
        // //     //console.log('Error fetching Performed Workouts:', error);
        // //   });
        
        // ///////////////////////End filter data based on without plan Id /////////////////////

        // }else{
        //   //console.log('else no internet ahmed');
        //   Alert.alert(`${t("To_see_Performed_Workouts")}`,
        //       `${t("You_must_be_connected_to_the_internet")}`);
                

        // }

        // });
        
        // // Unsubscribe
        // unsubscribe();
     

      }
      
      
        
    
      });
    });
  }, [activeIndexes,allUserWorkedWorkoutsFromDB, passNewDate]);

// const publicPlansDataTableItemDay = todayDayworkouts;
// const publicPlansDataTableItemDayNewData =publicPlansDataTableItemDay;
//console.log('publicPlansDataTableItemDayNewData)',publicPlansDataTableItemDayNewData);
  // const startExercisesWithTimerDataArr = newWorkoutsFromDB;
  ////console.log('WrkTypTimInitSent begin',WrkTypTimInitSent);
  const combineArrays = (data) => {
    return Object.values(data).reduce((acc, val) => {
      return acc.concat(val);
    }, []);
  };
  // useEffect(() => {
    //console.log('newWorkoutsFromDB',newWorkoutsFromDB); 
    // if (Object.keys(newWorkoutsFromDB)?.length === 0) {
    //   //console.log("newWorkoutsFromDB is empty");
    // } else {
    //   //console.log("newWorkoutsFromDB is not empty");
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
  //     const dayNam = row.dayNam;
  //     const dayKey = publicPlansDataTableItemDay[0]?.dayKey;
  //     const date = new Date().toISOString().split('T')[0];

  //     acc[activeWorkoutId] = Array.from({ length: totalSets }, (_, index) => ({
  //       userId:userId,
  //       plnKey: plnKey, // Add plnKey field
  //       dayKey: dayKey, // Change id to dayKey
  //       dayNam: dayNam, // Add dayNam field
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
  //       isCmpld: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.isCmpld !== undefined)
  //         ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.isCmpld) : (false),
  //       timStd: false,
  //       dayTim: (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.dayTim !== undefined)
  //       ? (startExercisesWithTimerDataArr[activeWorkoutId]?.[index]?.dayTim) : 0,
  //     }));
  
  //     return acc;
  //   }, {});

  //   const workedExercisesArray = {
  //     [publicPlansDataTableItemDay[0]?.dayKey]: {
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
const renderItem = (dayKey) => ({ item, index }) => (
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
    handleStoryPress(dayKey, index);
    // console.log('',);
        }}
      >
    
    {/* <Image
          style={{ height: 80, width: "100%", borderRadius: 23 }}
          source={item?.images != null && item?.images != '' ? (
              item?.images?.startsWith('../../../../assets/images')
                ? mainWorkoutsData[item?.wrkKey-1]?.images
                : item?.images?.startsWith('file:///data/user')
                ? { uri: item?.images }
                : item?.images?.startsWith('https://life-pf.com')
                ? { uri: item?.images }
                : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                : require('../../../../assets/gym-workout.png')
          ):(require('../../../../assets/gym-workout.png'))
                } // Set an appropriate default or handle other cases
                /> */}
                <>
                  {
                  (isImageUrl(item?.images)) ? (
                    
                    <Image 
                      source={
                      item?.images.startsWith('../../../../assets/images')
                      ? mainWorkoutsData[item?.wrkKey-1]?.images
                      : item?.images.startsWith('file:///data/user')
                      ? { uri: item?.images }
                      : item?.images.startsWith('https://life-pf.com')
                      ? { uri: item?.images }
                      : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                      ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                      : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                      
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

                      
                  if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null ) {
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
                  } else if (parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
                    return (
                      <>
                      {(isImageUrl(parsedDataImages?.LocalImageUrl))&& (
                        <Image
                                source={{
                                  uri: parsedDataImages?.LocalImageUrl
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

        {/* Display green check sign if all sets for this workout are completed */}
        {((objectForWorkedWorkouts[dayKey][item?.wrkKey]?.every((set) => (parseFloat(set.isCmpld) ? true : false)) || (index+1 === item?.wrkKey))) && (
          <Text style={{ color: 'green', position: 'absolute', top: '50%', left: '50%', marginLeft: -12, marginTop: -12,fontSize:20 }}>✔✔</Text>
        )}
      </TouchableOpacity>
      <View style={{ maxWidth: 80,}}>
        <Text style={{color:'black',fontSize:14,marginTop:10}}>{item.wktNam}</Text>
      </View>    
    </View>
  );




// Call the combineArrays function
// let combinedArray = [];
// if(newWorkoutsFromDB != undefined){
//   combinedArray = combineArrays(newWorkoutsFromDB);

// }
// Output the combined array
////console.log("Combined Array:", combinedArray);
//console.log('dayFilteredArray',dayFilteredArray);
// console.log('objectForWorkedWorkouts',objectForWorkedWorkouts);
// console.log('objectForNotWorkedWorkouts',objectForNotWorkedWorkouts);

////////////// i added the name of exercises with id 
  return (
    <>
        {(Object.keys(objectForWorkedWorkouts)?.length === 0)?
            (
              <DataTable >
              <DataTable.Header>
                <DataTableTitleValue><DataTableTitleValueText>{t('No_Entry_Found')}</DataTableTitleValueText></DataTableTitleValue>
              </DataTable.Header>
              <Spacer size="large">
                <Spacer size="large">
                  <CalendarFullSizePressableButton
                    onPress={hideModal} style={{backgroundColor:"#000",width:width-20,marginLeft:10,marginRight:10}}>
                    <CalendarFullSizePressableButtonText >{t('Back_to_Calendar')}</CalendarFullSizePressableButtonText>
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
                        //console.log('dayKey',dayKey);
                        {/* console.log('objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.exrTyp',objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.exrTyp);
                        console.log('objectForWorkedWorkouts[dayKey]',objectForWorkedWorkouts[dayKey]); */}

                        const groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises = groupWorkoutsByWrkKey(workedExercisesOrganizedByDayKey[dayKey]);

                        return(

                                  
                            <View key={dayKey} style={{ height:'auto'}}>


                                    
                                    <ServicesPagesCardCover>
                                      <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                                      <ServicesPagesCardHeader>{workedExercisesOrganizedByDayKey[dayKey]?.[0]?.dayNam ? workedExercisesOrganizedByDayKey[dayKey]?.[0]?.dayNam : `${t('Loading')}....`}</ServicesPagesCardHeader>
                                    </ServicesPagesCardCover>
                                    <View style={{marginTop:10,marginBottom:10,marginLeft:10}}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                      {/* flat list for the circles at the top of the page */}
                                      <FlatList
                                        data={groupedWorkedWorkoutsInDayKeyToHasLengthNumberOfExercises}
                                        renderItem={renderItem(dayKey)}
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
                                              {/* console.log('row.dayKey}-${row?.wrkKey,i',row.dayKey,row?.wrkKey,i);
                                              console.log('row',row); */}

                                              return (  
                                              <View key={`${row.dayKey}-${row?.wrkKey}-${i}`} style={{ display: (activeIndexes[dayKey] === i) ? 'flex' : 'none' }}>
                                                {objectForWorkedWorkouts[dayKey][workedExercisesOrganizedByDayKey[dayKey][i]?.wrkKey]?.map((set, index, array) => {
                                              
                                                  {/* console.log('set!!!',set);
                                                  console.log('objectForWorkedWorkouts[dayKey][objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.wrkKey]!!!',objectForWorkedWorkouts[dayKey][objectForNotWorkedWorkouts[dayKey][activeIndexes[dayKey]]?.wrkKey]);

                                                   */}
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