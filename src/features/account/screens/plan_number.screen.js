import React, { useState,useContext,useEffect } from 'react';
import { StyleSheet,Text,ScrollView,View,Modal,Pressable,Alert} from "react-native";
import { SelectDayExercisesScreen } from "./select_day_exercises.screen";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as SQLite from 'expo-sqlite'
import { insertPlansStartWorkout,fetchLastDayStartWorkouts} from "../../../../database/start_workout_db";

import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  FormLabelView,
  FormLabel,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  ServiceCloseInfoButton,
  ServiceCloseInfoButtonAvatarIcon,
  ServiceCloseInfoButtonText,
  ServiceInfoButtonView,
  ServiceInfoButton,
  ServiceInfoButtonAvatarIcon,
  ServiceCloseInfoButtonTextView,
} from "../components/account.styles";
import {AntDesign} from '@expo/vector-icons';

import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addPlansEntry,removePlansEntry,editPlansEntry,addDayToPlanInRedux,deleteDayFromPlanInRedux} from './public_manage_workouts';
import { useFocusEffect } from '@react-navigation/native';
import { WorkedExercisesCalendarScreen } from "./worked_exercises_calendar.screen";
import { updateWorkoutByChangingStatusToSkippedOrDone,fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable,restartWorkoutByChangingToActive,restartAllWorkoutByChangingSpekey,restartAllWorkoutsToActive } from "../../../../database/public_workouts_plan_days";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AuthGlobal from "../Context/store/AuthGlobal";
import "./i18n";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next'; // Import the i18next instance

export const PlanNumberScreen = ({navigation,route }) => {
  //const { PlanNumberVariable } = route.params;
  const dispatch = useDispatch();
  const params = route.params || {};

  const { TrainerTraineeSent = {}, publicWorkoutsPlanRow = {} } = params;
 //console.log('TrainerTraineeSent PlanNumberScreen',TrainerTraineeSent);
  const publicWorkoutsPlanRowCon = publicWorkoutsPlanRow;
  const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectDayExercisesVisible, setSelectDayExercisesVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [views, setViews] = useState(); 
  const [userId,setUserId] = useState('');
  // Create an object to store the summation, dayNam, and length for each speKey
  const [resultMap,setResultMap] = useState({});
  const context = useContext(AuthGlobal);
  const database = SQLite.openDatabase('health.db');

  const {t} = useTranslation();
   //console.log('publicWorkoutsPlanRowCon',publicWorkoutsPlanRowCon);
  const [publicWorkoutsPlanDaysTable,setPublicWorkoutsPlanDaysTable] = useState([]);
  const [fetchPublicSettingsData, setFetchPublicSettingsData] = useState({}); // State to manage the selected filter

  const [skippedButtonPressed,setSkippedButtonPressed] = useState(false);
const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      //////console.log('publicWorkoutsPlanDays user---->>>',storedUser);
      setUserId(storedUser.id);
      fetchPublicWorkoutsPlanDaysWithoutDeleting(storedUser.id,publicWorkoutsPlanRowCon?.speKey).then((publicWorkoutsPlanDaysTableResults) => {
       //console.log('publicWorkoutsPlanDay Table array',publicWorkoutsPlanDaysTableResults);
        setPublicWorkoutsPlanDaysTable(publicWorkoutsPlanDaysTableResults);
        // Iterate through the array and calculate the summation, dayNam, and length
              });
      // deletePublicWorkoutsPlanDaysTable().then((deletePublicWorkoutsPlanDaysTableResults) => {
      //   //////console.log('deletePublicWorkoutsPlanDaysTableResults',deletePublicWorkoutsPlanDaysTableResults);

      // });
      
      });
    }, [AsyncStorage])
    );
    
    useEffect(() => {
       // Create an object to store the summation, dayNam, and length for each speKey
       const newResultMap = {};
  
       // Iterate through the array and calculate the summation, dayNam, and length
       //console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);
       publicWorkoutsPlanDaysTable.forEach((item) => {
         const { speKey, wrkSts, dayNam,exrTyp,exrTim } = item;

         // Initialize the object if not exists
         if (!newResultMap[speKey]) {
           newResultMap[speKey] = {
             summation: 0,
             dayNam: '', // Initialize as an empty string
             length: 0,
             expectedTime:0,
           };
         }
         // 'Compound',
         // 'Cardio',
         // 'Isolation',
         // 'Stability',
         // Update the values
         newResultMap[speKey].summation += parseInt(wrkSts);
         newResultMap[speKey].dayNam = dayNam; // Assign directly to the value of dayNam
         newResultMap[speKey].length++;
         if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
           newResultMap[speKey].expectedTime += parseFloat(( ( ((30 * wrkSts)/60) + (exrTim/60) ) *(45/60) ).toFixed(2));
         }else if (exrTyp ==='Isolation'){
           newResultMap[speKey].expectedTime +=parseFloat(( ( ((30 * wrkSts)/60) + (exrTim/60) ) *(45/60) ).toFixed(2));
         }else if(exrTyp ==='Compound'){
           newResultMap[speKey].expectedTime +=parseFloat(( ( ((30 * wrkSts)/60) + (exrTim/60) ) *(45/60) ).toFixed(2));
         }
       });

         // Set the state with the new resultMap
         setResultMap(newResultMap);
   

    //   if(Object.keys(context.stateUser.userPublicSettings).length > 0){
    //     //console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
    //     //////console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);

        
    //       // Iterate through the array and calculate the summation, dayNam, and length
    //      // Create an object to store the summation, dayNam, and length for each speKey
    //       const newResultMap = {};
  
    //       // Iterate through the array and calculate the summation, dayNam, and length
    //       publicWorkoutsPlanDaysTable.forEach((item) => {
    //         const { speKey, wrkSts, dayNam,exrTyp } = item;
  
    //         // Initialize the object if not exists
    //         if (!newResultMap[speKey]) {
    //           newResultMap[speKey] = {
    //             summation: 0,
    //             dayNam: '', // Initialize as an empty string
    //             length: 0,
    //             expectedTime:0,
    //           };
    //         }
    //         // 'Compound',
    //         // 'Cardio',
    //         // 'Isolation',
    //         // 'Stability',
    //         // Update the values
    //         newResultMap[speKey].summation += parseInt(wrkSts);
    //         newResultMap[speKey].dayNam = dayNam; // Assign directly to the value of dayNam
    //         newResultMap[speKey].length++;
    //         if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
    //           newResultMap[speKey].expectedTime += ((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.cardio/60);
    //         }else if (exrTyp ==='Isolation'){
    //           newResultMap[speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.isoltn/60);
    //         }else if(exrTyp ==='Compound'){
    //           newResultMap[speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.compnd/60);
    //         }
    //       });
  
    //         // Set the state with the new resultMap
    //         setResultMap(newResultMap);
      
    //   }else{
    //     fetchPublicSettings(userId).then((PSettingsResults) => {
    //       // //////console.log('PSettingsResults[0]',PSettingsResults[0].cardio,'PSettingsResults[0].cardio/60',PSettingsResults[0].cardio/60);
    //       // //////console.log('PSettingsResults[0]',PSettingsResults[0].isoltn,'PSettingsResults[0].isoltn/60',PSettingsResults[0].isoltn/60);
    //       // //////console.log('PSettingsResults[0]',PSettingsResults[0].compnd,'PSettingsResults[0].compnd/60',PSettingsResults[0].compnd/60);
    //       //console.log('PSettingsResults[0]',PSettingsResults[0]);

    //         // Iterate through the array and calculate the summation, dayNam, and length
    //        // Create an object to store the summation, dayNam, and length for each speKey
    //         const newResultMap = {};
    
    //         // Iterate through the array and calculate the summation, dayNam, and length
    //         publicWorkoutsPlanDaysTable.forEach((item) => {
    //           const { speKey, wrkSts, dayNam,exrTyp } = item;
    
    //           // Initialize the object if not exists
    //           if (!newResultMap[speKey]) {
    //             newResultMap[speKey] = {
    //               summation: 0,
    //               dayNam: '', // Initialize as an empty string
    //               length: 0,
    //               expectedTime:0,
    //             };
    //           }
    
    //           // Update the values
    //           newResultMap[speKey].summation += parseInt(wrkSts);
    //           newResultMap[speKey].dayNam = dayNam; // Assign directly to the value of dayNam
    //           newResultMap[speKey].length++;
    //           if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
    //             newResultMap[speKey].expectedTime += parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].cardio/60)).toFixed(2));

    //           }else if (exrTyp ==='Isolation'){
    //             newResultMap[speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].isoltn/60)).toFixed(2));

    //           }else if(exrTyp ==='Compound'){
    //             newResultMap[speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].compnd/60)).toFixed(2));

    //           }
    //         });
    //         //////console.log('newResultMap',newResultMap);

    //           // Set the state with the new resultMap
    //           setResultMap(newResultMap);

    //     });
        
    //   }
    }, [publicWorkoutsPlanDaysTable]);     
     ////console.log('resultMap',resultMap);
  const handleOpenSelectDayExercise = () => {
    setSelectDayExercisesVisible(true);
  };

  const handleCloseSelectDayExercise = () => {
    setSelectDayExercisesVisible(false);
  };
  const handleOpenCalendar = () => {
    setCalendarVisible(true);
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };

  

  const handleSelectGetExerAndSetsData = (updatedTotalSets, updatedTotalExercises,dayNameInput,selectedExerciseRows) => {

    const newDay = {id: 2 + 1, dayName: dayNameInput, totalSets: updatedTotalSets, totalExercises: updatedTotalExercises,totalExpectedTime: parseFloat(((updatedTotalSets * 25)/60) + 2).toFixed(2) ,selectedExerciseRows:selectedExerciseRows};

    dispatch(addDayToPlanInRedux({ id: publicWorkoutsPlanRowCon.id, newDay: newDay}));

    // Dispatch an action to update the plan in the Redux store
    // Update the local state to trigger a re-render
    setViews((prevViews) => [
      ...prevViews,
      { id: 2 + 1, dayName: dayNameInput, totalSets: updatedTotalSets, totalExercises: updatedTotalExercises,totalExpectedTime: updatedTotalExercises,totalExpectedTime: parseFloat(((updatedTotalSets * 25)/60) + 2).toFixed(2),selectedExerciseRows:selectedExerciseRows },
    ]);

    // Call this function whenever you want to save the views array
    // e.g., after adding a new view or removing a view
    handleCloseSelectDayExercise();
  };

  //-------------- ًWorkout Button options buttons -------------//
const { showActionSheetWithOptions } = useActionSheet();
const [workoutStatuses, setWorkoutStatuses] = useState({});
const [workoutSkippedStatuses, setWorkoutSkippedStatuses] = useState({});


const onPressWorkoutButtonoptions = (publicWorkoutsPlanRowCon,speKey,publicWorkoutsPlanDayArr,isWorkoutDone,isWorkoutSkipped) => { 
  //console.log('publicWorkoutsPlanDayArr-------',publicWorkoutsPlanDayArr);
  //console.log('publicWorkoutsPlanDayArr[0]?.speKey',publicWorkoutsPlanDayArr[0]?.speKey);

  //console.log('workoutStatuses======',workoutStatuses);
  //console.log('workoutSkippedStatuses======',workoutSkippedStatuses);


  //console.log('speKey======',speKey);
  //console.log('isWorkoutDone======',isWorkoutDone);
  

  const cancelButtonIndex = -1;
  const options = [`${t("Edit_Workout")}`, `${t("skip_workout")}`, `${t("restart_workout")}`, `${t("remove_workout")}`];
 
  {/* ()=>navigation.navigate('SelectDayExercises', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDaySpeKey:speKey })} */}
  const disabledButtonIndices = options
  .map((option, index) => {
    if (index === 0 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 0 && !!isWorkoutDone || !!isWorkoutSkipped ) return index;
    }else if (index === 1 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 1 && !!isWorkoutDone || !!isWorkoutSkipped ) return index;
    }else if (index === 2 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 2 && !isWorkoutDone && !isWorkoutSkipped) return index;
    }else if (index === 3 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 3 && !!isWorkoutDone || !!isWorkoutSkipped ) return index;
    }
    return -1;
  })
  .filter(index => index !== -1);
  showActionSheetWithOptions({
    options,
    cancelButtonIndex,
    disabledButtonIndices,
  }, (selectedIndex) => {
    switch (selectedIndex) {
      case 0:
      navigation.navigate('SelectDayExercises', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDaySpeKey:speKey });

        
        break;

      case 1:
        newSkippedCompleted(publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon);
        break;

      case 2:
        restartWorkoutByChangingToActiveConst(userId, speKey, publicWorkoutsPlanDayArr[0].plnKey,publicWorkoutsPlanDayArr[0]);
        break;
      
      case 3:
        Alert.alert(
          '',
          `${t("Are_you_sure_you_want_to_remove_current_workout")}`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => {} },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => handleRemoveView(userId, speKey, publicWorkoutsPlanRowCon?.speKey),
            },
          ]
        );
        
        break;

      case cancelButtonIndex:
        // Canceled
    }});
};
const restartWorkoutByChangingToActiveConst = (userId, speKey, plnKey,publicWorkoutsPlanDayArr) => {

  restartWorkoutByChangingToActive(userId, speKey, plnKey,publicWorkoutsPlanDayArr)
  .then((PublicPlansDataResults) => {
    ////console.log('Public Plans DataResults added successfully', PublicPlansDataResults);
    // Fetch and update the PublicWorkoutsPlansArray after adding a new PublicWorkoutsPlansArray
    return fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,plnKey);
  })
  .then((PublicWorkoutsPlanDaysWithoutDeleting) => {
    // Update the state with the updated PublicWorkoutsPlansArray
    setPublicWorkoutsPlanDaysTable(PublicWorkoutsPlanDaysWithoutDeleting);
  })
  .catch((error) => {
    // Handle the error by showing an alert
    Alert.alert(``, `${t(error)}`);
  });
  }
const newSkippedCompleted =(publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon)=>{
  //console.log('publicWorkoutsPlanDayArr newSkippedCompleted',publicWorkoutsPlanDayArr);

  // const updatedSets = publicWorkoutsPlanDayArr.reduce((acc, row, i) => {
  //     const activeWorkoutId = publicWorkoutsPlanDayArr[i].wrkKey;
  //     const wrkKey = publicWorkoutsPlanDayArr[i].wrkKey;

  //     const wktNam = publicWorkoutsPlanDayArr[i].wktNam;
  //     const plnKey = publicWorkoutsPlanDayArr[i].plnKey;
  //     const exrTyp = publicWorkoutsPlanDayArr[i].exrTyp;
  //     const exrTim = publicWorkoutsPlanDayArr[i].exrTim;
  //     const totalSets = row.wrkSts;
  //     const dayName = row.dayNam;
  const speKey = publicWorkoutsPlanDayArr[0]?.speKey;
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
  //       weight: "0",
  //       reps: "0",
  //       casTim: 0,
  //       isCompleted: true,
  //       timerStarted: false,
  //       dayTim: 0,
  //       exrTyp:exrTyp,
  //       exrTim:exrTim,
  //       deleted:'no',
  //       isSync:'no'
  //     }));
  
  //     return acc;
  //   }, {});
  //   const combinedArray = combineArrays(updatedSets);
  //   //console.log("combinedArray newSkippedCompleted planNumber",combinedArray);
  //   insertPlansStartWorkout(combinedArray)
  //   .then((result) => {
  //     //////console.log('Day Workouts deleted turned into yes successfully', result);

  //     // Fetch and update the PublicWorkout equipments after soft deleting a gym
  //     return fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,publicWorkoutsPlanRowCon?.speKey);
  //   })
  //   .then((updatedPublicWorkoutsPlans) => {
  //     // Update the state with the updated PublicWorkoutsPlanDaysTableArray
  //     //console.log("updatedPublicWorkoutsPlans",updatedPublicWorkoutsPlans);

  //     setPublicWorkoutsPlanDaysTable(updatedPublicWorkoutsPlans);
  //     setSkippedButtonPressed(true);
  //   })
  //   .catch((error) => {
  //     Alert.alert(` `,
  //     error);
  //   });

  updateWorkoutByChangingStatusToSkippedOrDone(userId, speKey, publicWorkoutsPlanRowCon?.speKey,"skipped",publicWorkoutsPlanDayArr[0]?.lstUpd)
    .then((result) => {
      //////console.log('Day Workouts deleted turned into yes successfully', result);

      // Fetch and update the PublicWorkout equipments after soft deleting a gym
      return fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,publicWorkoutsPlanRowCon?.speKey);
    })
    .then((updatedPublicWorkoutsPlans) => {
      // Update the state with the updated PublicWorkoutsPlanDaysTableArray
      //console.log("updatedPublicWorkoutsPlans to skipped",updatedPublicWorkoutsPlans);

      setPublicWorkoutsPlanDaysTable(updatedPublicWorkoutsPlans);
      // setSkippedButtonPressed(true);
    })
    .catch((error) => {
      Alert.alert(``,
      error);
    });

}
const combineArrays = (data) => {
    return Object.values(data).reduce((acc, val) => {
      return acc.concat(val);
    }, []);
  };
const checkWorkoutDoneOrNot = (userId, speKey) => {

  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM publicWorkoutsPlanDays WHERE userId =? AND speKey = ? AND exrStu = ? AND deleted = ? AND isSync = ?',
      [userId, speKey,"done",'no','no'],
      (_, { rows }) => {
        setWorkoutStatuses(prevStatuses => ({
          ...prevStatuses,
          [speKey]: rows.length > 0
        }));
      },
      (_, error) => {
        ////console.log('Error checking other dates with same dayKey:', error);
      }
    );
  });
};

const checkWorkoutSkippedOrNot = (userId, speKey) => {

  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM publicWorkoutsPlanDays WHERE userId =? AND speKey = ? AND exrStu = ? AND deleted = ? AND isSync = ?',
      [userId, speKey,"skipped",'no','no'],
      (_, { rows }) => {
        //console.log('checkWorkoutSkippedOrNot',rows);
        setWorkoutSkippedStatuses(prevStatuses => ({
          ...prevStatuses,
          [speKey]: rows.length > 0
        }));
      },
      (_, error) => {
        ////console.log('Error checking other dates with same dayKey:', error);
      }
    );
  });
};

  useEffect(() => {

    // Function to execute the checks for each speKey
    // const performChecksForSpeKey = (speKey) => {
    //   return Promise.all([
    //     checkWorkoutSkippedOrNot(userId, speKey),
    //     checkWorkoutDoneOrNot(userId, speKey)
    //   ]);
    // };

    // Function to execute the entire flow
    const executeWorkflow = async () => {
      
      // try {
        // const speKeys = Object.keys(resultMap);
  
        // // Perform checks for all speKeys
        // await Promise.all(speKeys.map((speKey) => performChecksForSpeKey(speKey)));
  
        // Introduce a 2-second delay before executing the next part
        // setTimeout(async () => {
          try {
            // After all checks are done, restart the workout and update the table
            
            //console.log('before222 restartAllWorkoutsToActive');

            const publicPlanDataResults = await restartAllWorkoutsToActive(userId, publicWorkoutsPlanRowCon.speKey);
            //console.log('Public Plans DataResults added successfully', publicPlanDataResults);
  
            if (!publicPlanDataResults || publicPlanDataResults.length === 0) {
              // If PublicPlanDataResults is empty, return a value indicating no update
              return null;
            }
  
            // Fetch the updated PublicWorkoutsPlanDays
            const publicWorkoutsPlanDaysWithoutDeleting = await fetchPublicWorkoutsPlanDaysWithoutDeleting(userId, publicWorkoutsPlanRowCon.speKey);
            if (!publicWorkoutsPlanDaysWithoutDeleting) {
              // If no update is needed, exit early
              //console.log('No updates needed');
              return;
            }
  
            // Update the state
            setPublicWorkoutsPlanDaysTable(publicWorkoutsPlanDaysWithoutDeleting);
          } catch (error) {
            // Handle errors in the delayed block
            Alert.alert(`${t('note')}`, `${t(error.message)}` || `${t(error)}`);
          }
        // }, 2000); // 2000 milliseconds = 2 seconds
  
      // } catch (error) {
      //   // Handle errors in the initial block
      //   Alert.alert(` `, error.message || error);
      // }
    };
    executeWorkflow();

    // Execute the workflow
  }, [publicWorkoutsPlanDaysTable]);
  
  

  const handleRemoveView = (userId, speKey, plnKey) => {
    
    
    SoftDeleteAllPublicWorkoutsPlanDayWorkouts(userId, speKey, plnKey)
      .then((result) => {
        //////console.log('Day Workouts deleted turned into yes successfully', result);

        // Fetch and update the PublicWorkout equipments after soft deleting a gym
        return fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,publicWorkoutsPlanRowCon?.speKey);
      })
      .then((updatedPublicWorkoutsPlans) => {
         //console.log("SoftDeleteAllPublicWorkoutsPlanDayWorkouts updatedPublicWorkoutsPlans",updatedPublicWorkoutsPlans);

        // Update the state with the updated PublicWorkoutsPlanDaysTableArray
        setPublicWorkoutsPlanDaysTable(updatedPublicWorkoutsPlans);
      })
      .catch((error) => {
        // Handle the error by showing an alert
        Alert.alert(`${t('Failed_to_delete_workouts')}`);
      });
  };


// Output the result for each speKey
// //console.log("resultMap",resultMap);
useEffect(() => {
  navigation.setOptions({ title: `${publicWorkoutsPlanRowCon.plnNam}` });
 
}, [publicWorkoutsPlanRowCon]);
  
  return (
      <PageContainer>
          <ScrollView>
              <TitleView >
                  <Title >Life</Title>
              </TitleView>
              <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{publicWorkoutsPlanRowCon.plnNam}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>
              <Spacer size="large">
                  <ServiceInfoParentView >
                    {showInfo ? (
                      <ServiceCloseInfoButtonView>
                        <ServiceCloseInfoButton onPress={toggleInfo}>
                          <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                        </ServiceCloseInfoButton>
                        <ServiceCloseInfoButtonTextView>
                          <ServiceCloseInfoButtonText>{t("user_workout_plan_number_desc")}</ServiceCloseInfoButtonText>
                        </ServiceCloseInfoButtonTextView>
                      </ServiceCloseInfoButtonView>
                    ) : (
                      <ServiceInfoButtonView>
                        <ServiceInfoButton onPress={toggleInfo}>
                        <ServiceInfoButtonAvatarIcon icon="information" size={60} />
                        </ServiceInfoButton>
                      </ServiceInfoButtonView>
                    )}
                </ServiceInfoParentView>
              </Spacer>
              <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plan_info')}</FormLabel>
            </FormLabelView> 
              <View style={styles.container}> 


              <View key={publicWorkoutsPlanRowCon.id} style={styles.viewContainer}>
                  <View style={styles.plansContainer}>
                    <View style={{width:130,}}>
                      <CalendarFullSizePressableButton disabled={true} style={{backgroundColor:'#000',padding:5,width:130,height: 'auto',minHeight: 49,}}>
                        <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{publicWorkoutsPlanRowCon.plnNam || ''}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                    </View>
                    <Text style={[styles.plansTextValues,styles.plansStartDateText]}>{publicWorkoutsPlanRowCon.stDate || 'Unlimited'}</Text>
                    <Text style={[styles.plansTextValues,styles.plansEndDateText]}>{publicWorkoutsPlanRowCon.edDate || 'Unlimited'}</Text>
                  </View>
                  
              </View>
            


              <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10}}>{t('Workouts_info')}</FormLabel>
            </FormLabelView> 
               {(publicWorkoutsPlanDaysTable.length > 0) ? (
                <View style={styles.FromToView}>
                  <Text style={styles.totalSets}>{t("Sets")}</Text>
                  <Text style={styles.totalExercises}>{t("Exercises")}</Text>
                  <Text style={styles.ExpectedTime}>{t("Expected_Time")}</Text>
                </View>
              ):null}
             
              {Object.keys(resultMap)?.map((speKey) => {

                  const view = resultMap[speKey];
                  ////console.log('view>>>',view);
                  const publicWorkoutsPlanDayArr =publicWorkoutsPlanDaysTable.filter(item => item?.speKey === speKey);
                  const isWorkoutDone = publicWorkoutsPlanDayArr?.[0]?.exrStu == "done";
                  const isWorkoutSkipped = publicWorkoutsPlanDayArr?.[0]?.exrStu == "skipped";
                  //console.log('publicWorkoutsPlanDayArr?.exrStu',publicWorkoutsPlanDayArr?.[0]?.exrStu);

                //console.log('isWorkoutSkipped',isWorkoutSkipped);
                  return (
                    <View key={speKey} style={styles.viewContainer}>
                      <View style={styles.leftContainer}>
                        <CalendarFullSizePressableButton style={{ backgroundColor: '#000', padding: 5, width: 90, height: 'auto', minHeight: 49 }}  onPress={() => onPressWorkoutButtonoptions(publicWorkoutsPlanRowCon,speKey,publicWorkoutsPlanDayArr,isWorkoutDone,isWorkoutSkipped)}>
                          <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{view.dayNam}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                      
                      <View style={styles.rightContainer}>
                        <Text style={styles.rightContainerText}>{parseFloat(view.summation).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view.length).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view.expectedTime).toFixed(1)}</Text>
                        {/* Add more properties as needed */}
                      </View>
                      {/* <View style={styles.removeButtonContainer}>
                        <CalendarFullSizePressableButton style={styles.removeButtonContainerButton} onPress={() => handleRemoveView(userId, speKey, publicWorkoutsPlanRowCon?.speKey)}>
                          <CalendarFullSizePressableButtonText>{t("Remove")}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View> */}
                      <View style={styles.removeButtonContainer}>
                        <CalendarFullSizePressableButton style={{...styles.removeButtonContainerButton,backgroundColor: isWorkoutDone || isWorkoutSkipped ? '#888' : '#000', }}  
                          onPress={() => {
                              if (!isWorkoutDone && !isWorkoutSkipped) {
                                navigation.navigate('DaysExercisesToStart', { publicWorkoutsPlanDayArrSent: publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon:publicWorkoutsPlanRowCon });
                              }
                            }}
                            disabled={isWorkoutDone || isWorkoutSkipped}
                          >
                          <CalendarFullSizePressableButtonText>{isWorkoutDone  ? t('Done') :  isWorkoutSkipped ? t('Skipped') : t("Start")}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                    </View>
                  );
                })}
                
                <Spacer size="large">
                  <FormElemeentSizeButtonParentView style={{marginLeft:6,marginRight:6}}>
                    <FormElemeentSizeButtonView style={{width:"49%"}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={()=>navigation.navigate('SelectDayExercises',{publicWorkoutsPlanRowConArr:publicWorkoutsPlanRowCon})}>
                      <CalendarFullSizePressableButtonText >{t("Add_Workout")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    </FormElemeentSizeButtonView>
                    <FormElemeentSizeButtonView style={{width:"49%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={() => setModalVisible(true)}>
                      <CalendarFullSizePressableButtonText >{t("Open_Calendar")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                      <ViewOverlay>
                      <WorkedExercisesCalendarScreen 
                            onAddEntry={() => setModalVisible(false)}
                            TrainerTraineeSent = {TrainerTraineeSent}
                          />
                      </ViewOverlay>
                    </Modal>
                    </FormElemeentSizeButtonView>
                  </FormElemeentSizeButtonParentView>
                </Spacer>
                {/* <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={()=>navigation.goBack()}>
                      <CalendarFullSizePressableButtonText >{t("Back_To_Plans")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonParentView>
                </Spacer> */}
                {/* <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={handleSendingViewsData}>
                      <CalendarFullSizePressableButtonText >Add Days To Plans</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonParentView>
                </Spacer> */}
                
                {/* <SelectDayExercisesScreen sentPlanRow={publicWorkoutsPlanRowCon} isVisible={isSelectDayExercisesVisible} onClose={handleCloseSelectDayExercise} onSelectGetExerAndSetsData={handleSelectGetExerAndSetsData} /> */}
              </View>
        </ScrollView>
      </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    
  },
  viewContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft:10,
    marginRight:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
  rightContainerText:{
    fontSize:14,
    color:"#000",
    marginVertical: 15,
  },
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    
  },
  
  totalExercises:{
    fontSize:16,
    color:"#000",
    marginRight:10,
    marginLeft:5,
  },
  totalSets:{
    fontSize:16,
    color:"#000",
    marginRight:10
  },
  ExpectedTime:{
    fontSize:16,
    color:"#000",
    marginRight:-50
  },
  removeButtonContainer: {
    marginLeft: 10,
  },
  removeButtonContainerButton:
  {
    backgroundColor:'#000',
    width:75,
    borderRadius:6,
  },
  plansContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginRight:15,
    marginBottom:20,
  },
  plansCountryText:{
    width:60,
    flexWrap: 'wrap',
    marginRight:4,
  },
  plansTextValues:{
    fontSize:14,
    color:"#000",
    marginVertical: 15,
    },
 
  plansStartDateText:{
    marginLeft:5,
    color:'black',
  },
 
  plansEndDateText:{
    marginLeft:5,
    marginRight:0,
    color:'black',
  },
});


