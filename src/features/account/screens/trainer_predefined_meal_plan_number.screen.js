import React, { useState,useContext,useEffect } from 'react';
import { StyleSheet,Text,ScrollView,View,Modal,Alert, Dimensions,Pressable} from "react-native";
import { TrainerTraineeSelectDayExercisesScreen } from "./select_day_exercises.screen";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as SQLite from 'expo-sqlite';
import {AntDesign} from '@expo/vector-icons';

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
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addPlansEntry,removePlansEntry,editPlansEntry,addDayToPlanInRedux,deleteDayFromPlanInRedux} from './public_manage_workouts';
import { useFocusEffect } from '@react-navigation/native';
import { TrainerTraineeWorkedExercisesCalendarScreen } from "./trainer_trainee_worked_exercises_calendar.screen";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable } from "../../../../database/public_workouts_plan_days";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AuthGlobal from "../Context/store/AuthGlobal";
import axios from 'axios';
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

import { addEventListener } from "@react-native-community/netinfo";

export const TrainerPredefinedMealPlanNumberScreen = ({navigation,route }) => {
  //const { PlanNumberVariable } = route.params;
  const dispatch = useDispatch();
  const publicWorkoutsPlanRowCon = route.params?.publicMealsPlanRow;

  //console.log('publicWorkoutsPlanRowCon',publicWorkoutsPlanRowCon);
  const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelectDayExercisesVisible, setSelectDayExercisesVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [views, setViews] = useState(); 
  const [userId,setUserId] = useState('');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [triainerConnected,setTriainerConnected] =  useState(false);
  // Create an object to store the summation, dayNam, and length for each speKey
  const [resultMap,setResultMap] = useState({});
  const context = useContext(AuthGlobal);  
  const [publicWorkoutsPlanDaysTable,setPublicWorkoutsPlanDaysTable] = useState([]);
 
 
  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {

      AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      ////console.log('publicWorkoutsPlanDays user---->>>',storedUser);
      setUserId(storedUser.id);

      const unsubscribe = addEventListener(state => {
        ////console.log("Connection type--", state.type);
        ////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        ////console.log('---------------now online--------')
        ////console.log('my plan Days page',publicWorkoutsPlanRowCon);


        axios.get(`https://life-pf.com/api/get-trainer-predefined-meal-plan-days?trainerId=${publicWorkoutsPlanRowCon?.trnrId}&planId=${publicWorkoutsPlanRowCon?.id}`, {
        headers: {
          'Authorization': `Bearer ${res}`,
          'Content-Type': 'application/json',
        },
        })
        .then(response => {
          setPublicWorkoutsPlanDaysTable(response?.data?.["getTrainerPlanDays"]);
          const daysDataTable = response?.data?.["getTrainerPlanDays"];
          let newResultMap = {};
          //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];



          daysDataTable?.forEach((dayData) => {

                    const malAry =  dayData?.malAry;
                    //console.log('malAry:', malAry);

                    let newafterJsonMal = [];         
                    if (malAry && typeof malAry !== 'undefined' ) {
                      newafterJsonMal = JSON.parse(malAry);
                    ////console.log('newafterJsonMal:', newafterJsonMal);

                      }
                      if (!newResultMap?.[dayData?.speKey]) {
                        newResultMap[dayData?.speKey] = {
                          dayNam: '', // Initialize as an empty string
                          totalCalories: 0,
                          totalProtein: 0,
                          totalCarbs: 0,
                          totalFats: 0,
  
                          };
                      }
                  // Iterate through the array and calculate the summation, dayNam, and length
                  newafterJsonMal?.forEach((item) => {

                    let { calris, protin,carbs,fats } = item;
                    ////console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
                    // Initialize the object if not exists
                    
                    // 'Compound',
                    // 'Cardio',
                    // 'Isolation',
                    // 'Stability',
                    // Update the values calris, protin,carbs,fats
                    
                    newResultMap[dayData?.speKey].totalCalories += parseFloat(calris?.toFixed(2));
                    newResultMap[dayData?.speKey].totalProtein += parseFloat(protin?.toFixed(2));
                    newResultMap[dayData?.speKey].totalCarbs += parseFloat(carbs?.toFixed(2));
                    newResultMap[dayData?.speKey].totalFats += parseFloat(fats?.toFixed(2));

                    newResultMap[dayData?.speKey].dayNam = dayData?.dayNam; // Assign directly to the value of dayNam
                    
                  });
                  });
              // Set the state with the new resultMap
                //console.log('newResultMap predefined:', newResultMap);

              setResultMap(newResultMap);

        })
        .catch(error => {
          // Handle error
          ////console.log('Error fetching Days:', error);
        });

      }else{
        ////console.log('else no internet ahmed');
        Alert.alert(`${t("To_see_Plan_s_days")}`,
            `${t("You_must_be_connected_to_the_internet")}`);
              

      }

      });
      
      // Unsubscribe
      unsubscribe();
    

      })
    })
    }, [AsyncStorage])
  );
  
  // useEffect(() => {

  //     // Fetch the latest data or update the state here


  //     const fetchData = async () => { 
  //       ////console.log("Connection type--", state.type);
  //       ////console.log("Is connected?---", state.isConnected);
  //     if(triainerConnected){
  //       ////console.log('---------------now online--------')

  //       if(Object.keys(context.stateUser.userPublicSettings).length > 0){
  //         //console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
  //         //////console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);

  //         let newResultMap = {};
  //   //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];
    


  //   publicWorkoutsPlanDaysTable?.forEach((dayData) => {

  //     const wrkAry =  dayData?.wrkAry;
  //     let newafterJsonWrk = [];         
  //     if (wrkAry && typeof wrkAry !== 'undefined' ) {
  //       newafterJsonWrk = JSON.parse(wrkAry);
  //      ////console.log('newafterJsonWrk:', newafterJsonWrk);

  //        }
  //   // Iterate through the array and calculate the summation, dayNam, and length
  //   newafterJsonWrk?.forEach((item) => {

  //     let { wrkSts, exrTyp } = item;
  //     ////console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
  //      // Initialize the object if not exists
  //      if (!newResultMap?.[dayData?.speKey]) {
  //        newResultMap[dayData?.speKey] = {
  //          summation: 0,
  //          dayNam: '', // Initialize as an empty string
  //          length: 0,
  //          expectedTime:0,
  //        };
  //      }
  //      // 'Compound',
  //      // 'Cardio',
  //      // 'Isolation',
  //      // 'Stability',
  //      // Update the values
  //      newResultMap[dayData?.speKey].summation += parseInt(wrkSts);
  //      newResultMap[dayData?.speKey].dayNam = dayData?.dayNam; // Assign directly to the value of dayNam
  //      newResultMap[dayData?.speKey].length++;
  //      if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
  //        newResultMap[dayData?.speKey].expectedTime += ((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.cardio/60);
  //      }else if (exrTyp ==='Isolation'){
  //        newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.isoltn/60);
  //      }else if(exrTyp ==='Compound'){
  //        newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.compnd/60);
  //      ////console.log('((30 * wrkSts)/60) + (userPublicSettings?.compnd/60)',((30 * wrkSts)/60) + (userPublicSettings?.compnd/60));
  //       }
  //    });
  //   });
  //      // Set the state with the new resultMap
  //      setResultMap(newResultMap);
  
                
  //       }else{
  //         fetchPublicSettings(userId).then((PSettingsResults) => {
  //           // //////console.log('PSettingsResults[0]',PSettingsResults[0].cardio,'PSettingsResults[0].cardio/60',PSettingsResults[0].cardio/60);
  //           // //////console.log('PSettingsResults[0]',PSettingsResults[0].isoltn,'PSettingsResults[0].isoltn/60',PSettingsResults[0].isoltn/60);
  //           // //////console.log('PSettingsResults[0]',PSettingsResults[0].compnd,'PSettingsResults[0].compnd/60',PSettingsResults[0].compnd/60);
  //           //console.log('PSettingsResults[0]',PSettingsResults[0]);

  //             // Iterate through the array and calculate the summation, dayNam, and length
  //           // Create an object to store the summation, dayNam, and length for each speKey
  //           let newResultMap = {};
  //           //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];
            
            
            
  //           publicWorkoutsPlanDaysTable?.forEach((dayData) => {
            
  //             const wrkAry =  dayData?.wrkAry;
  //             let newafterJsonWrk = [];         
  //             if (wrkAry && typeof wrkAry !== 'undefined' ) {
  //               newafterJsonWrk = JSON.parse(wrkAry);
  //              ////console.log('newafterJsonWrk:', newafterJsonWrk);
            
  //                }
  //           // Iterate through the array and calculate the summation, dayNam, and length
  //           newafterJsonWrk?.forEach((item) => {
            
  //             let { wrkSts, exrTyp,exrTim } = item;
  //             ////console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
  //              // Initialize the object if not exists
  //              if (!newResultMap?.[dayData?.speKey]) {
  //                newResultMap[dayData?.speKey] = {
  //                  summation: 0,
  //                  dayNam: '', // Initialize as an empty string
  //                  length: 0,
  //                  expectedTime:0,
  //                };
  //              }
  //              // 'Compound',
  //              // 'Cardio',
  //              // 'Isolation',
  //              // 'Stability',
  //              // Update the values
  //              newResultMap[dayData?.speKey].summation += parseInt(wrkSts);
  //              newResultMap[dayData?.speKey].dayNam = dayData?.dayNam; // Assign directly to the value of dayNam
  //              newResultMap[dayData?.speKey].length++;
  //              if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
  //               //  newResultMap[dayData?.speKey].expectedTime += ((30 * wrkSts)/60) + (exrTim/60);
  //               newResultMap[dayData?.speKey].expectedTime += parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].cardio/60)).toFixed(2));
            
  //               }else if (exrTyp ==='Isolation'){
  //               //  newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (exrTim/60);
  //               newResultMap[dayData?.speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].isoltn/60)).toFixed(2));
            
  //               }else if(exrTyp ==='Compound'){
  //                 newResultMap[dayData?.speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].compnd/60)).toFixed(2));
            
  //                 // newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (exrTim/60);
  //              ////console.log('((30 * wrkSts)/60) + (userPublicSettings?.compnd/60)',((30 * wrkSts)/60) + (userPublicSettings?.compnd/60));
  //               }
  //            });
  //           });
  //              // Set the state with the new resultMap
  //              setResultMap(newResultMap);
            
            

  //         });
          
  //       }

        
        

  //     }

      
      
  //     // Unsubscribe
  //   };
  //   fetchData();
      
      
  // }, [publicWorkoutsPlanDaysTable]);   
    // useEffect(() => {
    //   async function fetchData() {
    //   if(Object.keys(context.stateUser.userPublicSettings)?.length > 0){
    //     ////console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
    //     ////console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);

        
    //       // Iterate through the array and calculate the summation, dayNam, and length
    //      // Create an object to store the summation, dayNam, and length for each speKey
    //      let newResultMap = {};
    //      //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];
    //      const wrkAry = await publicWorkoutsPlanDaysTable?.[0]?.wrkAry;
    //      let newafterJsonWrk = [];         
    //      if (wrkAry && typeof wrkAry !== 'undefined' ) {
    //        newafterJsonWrk = JSON.parse(wrkAry);
    //       ////console.log('newafterJsonWrk:', newafterJsonWrk);

    //         }
    //      //const newafterJsonWrk= newBeforeJsonWrk;
    //      //////console.log('newafterJsonWrk',newafterJsonWrk);

    //      //////console.log('JSON0',newafterJsonWrk);

         
    //      // Iterate through the array and calculate the summation, dayNam, and length
    //      newafterJsonWrk?.forEach((item) => {
    //        // const { speKey, dayNam,wrkAry } = item;
    //        // const newWrkAry = JSON.parse(wrkAry)[0];
    //        let { wrkSts, exrTyp } = item;
    //        ////console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
    //         // Initialize the object if not exists
    //         if (!newResultMap?.[publicWorkoutsPlanDaysTable?.[0]?.speKey]) {
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey] = {
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
    //         newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].summation += parseInt(wrkSts);
    //         newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].dayNam = publicWorkoutsPlanDaysTable?.[0]?.dayNam; // Assign directly to the value of dayNam
    //         newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].length++;
    //         if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime += ((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.cardio/60);
    //         }else if (exrTyp ==='Isolation'){
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.isoltn/60);
    //         }else if(exrTyp ==='Compound'){
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.compnd/60);
    //         }
    //       });
  
    //         // Set the state with the new resultMap
    //         setResultMap(newResultMap);
    //       ////console.log('newResultMap--',newResultMap);
    //   }else{
    //     const wrkAry = await publicWorkoutsPlanDaysTable?.[0]?.wrkAry;
    //     let newafterJsonWrk = [];         
    //     if (wrkAry && typeof wrkAry !== 'undefined' ) {
    //       newafterJsonWrk = JSON.parse(wrkAry);
    //     ////console.log('newafterJsonWrk:', newafterJsonWrk);

    //       }
    //     fetchPublicSettings(userId).then((PSettingsResults) => {
    //       // ////console.log('PSettingsResults[0]',PSettingsResults[0].cardio,'PSettingsResults[0].cardio/60',PSettingsResults[0].cardio/60);
    //       // ////console.log('PSettingsResults[0]',PSettingsResults[0].isoltn,'PSettingsResults[0].isoltn/60',PSettingsResults[0].isoltn/60);
    //       // ////console.log('PSettingsResults[0]',PSettingsResults[0].compnd,'PSettingsResults[0].compnd/60',PSettingsResults[0].compnd/60);
    //         ////console.log('publicWorkoutsPlanDaysTable fetchPublicSettings',publicWorkoutsPlanDaysTable);

    //         // Iterate through the array and calculate the summation, dayNam, and length
    //        // Create an object to store the summation, dayNam, and length for each speKey
    //         let newResultMap = {};
    //         //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];
            

    //         ////console.log('newafterJsonWrk befor foreach',newafterJsonWrk);
    //         // Iterate through the array and calculate the summation, dayNam, and length
    //         newafterJsonWrk?.forEach((item) => {
    //           // const { speKey, dayNam,wrkAry } = item;
    //           // const newWrkAry = JSON.parse(wrkAry)[0];
    //           let { wrkSts, exrTyp } = item;
    //           ////console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
    
    //           // Initialize the object if not exists
    //           if (!newResultMap?.[publicWorkoutsPlanDaysTable?.[0]?.speKey]) {
    //             newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey] = {
    //               summation: 0,
    //               dayNam: '', // Initialize as an empty string
    //               length: 0,
    //               expectedTime:0,
    //             };
    //           }
    
    //           // Update the values
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].summation += parseInt(wrkSts);
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].dayNam = publicWorkoutsPlanDaysTable?.[0]?.dayNam; // Assign directly to the value of dayNam
    //           newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].length++;
    //           if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
    //             newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime += parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].cardio/60)).toFixed(2));

    //           }else if (exrTyp ==='Isolation'){
    //             newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].isoltn/60)).toFixed(2));

    //           }else if(exrTyp ==='Compound'){
    //             newResultMap[publicWorkoutsPlanDaysTable?.[0]?.speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].compnd/60)).toFixed(2));

    //           }
    //           ////console.log('newResultMap---',newResultMap);

    //         });

    //           // Set the state with the new resultMap
    //           setResultMap(newResultMap);

    //     });
        
    //   }
    // }
    // fetchData();
    // }, [publicWorkoutsPlanDaysTable]);     
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

    dispatch(addDayToPlanInRedux({ id: publicWorkoutsPlanRowCon?.id, newDay: newDay}));

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
const onPressWorkoutButtonoptions = (publicWorkoutsPlanRowCon,speKey,publicWorkoutsPlanDayArr,isWorkoutDone,isWorkoutSkipped,publicWorkoutsPlanDayArrBeforeSeperateWrkAry) => { 
  //console.log('publicWorkoutsPlanDayArrBeforeSeperateWrkAry onPressWorkoutButtonoptions',publicWorkoutsPlanDayArrBeforeSeperateWrkAry);
  //console.log('publicWorkoutsPlanDaysTable onPressWorkoutButtonoptions',publicWorkoutsPlanDaysTable);


  const cancelButtonIndex = -1;
  const options = [`${t("Edit_Workout")}`, `${t("skip_workout")}`, `${t("restart_workout")}`, `${t("remove_workout")}`];
 
  const disabledButtonIndices = options
  .map((option, index) => {
    if (index === 0 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 0 && !!isWorkoutDone || !!isWorkoutSkipped ) return index;
    }else if (index === 1 ) {
      // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
      if (index === 1 && !!isWorkoutDone || !!isWorkoutSkipped ) return index;
    }
    else if (index === 2 ) {
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
        navigation.navigate('TrainerTraineeSelectDayExercises', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDaySpeKey:speKey,publicWorkoutsPlanDayArrBeforeSeperateWrkArySent:publicWorkoutsPlanDayArrBeforeSeperateWrkAry });
        
        break;

      case 1:
        newSkippedCompleted(publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon,publicWorkoutsPlanDayArrBeforeSeperateWrkAry);
        break;

      case 2:
        restartWorkoutByChangingToActiveConst(publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon,publicWorkoutsPlanDayArrBeforeSeperateWrkAry);
        break;
      
      case 3:
        Alert.alert(
          '',
          `${t("Are_you_sure_you_want_to_remove_current_workout")}`,
          [
            {
              text: 'Yes',
              style: 'destructive',
              onPress: () => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId, speKey, publicWorkoutsPlanRowCon?.id),
            },
            { text: 'Cancel', style: 'cancel', onPress: () => {} },

          ]
        );
        
        break;

      case cancelButtonIndex:
        // Canceled
    }});
};
const restartWorkoutByChangingToActiveConst = (publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon,publicWorkoutsPlanDayArrBeforeSeperateWrkAry) => {
  //console.log('publicWorkoutsPlanDayArrBeforeSeperateWrkAry restart',publicWorkoutsPlanDayArrBeforeSeperateWrkAry);
  //console.log('publicWorkoutsPlanDayArr restart',publicWorkoutsPlanDayArr);
  //console.log('publicWorkoutsPlanDayArr[0]?.lstUpd restart',publicWorkoutsPlanDayArr[0]?.lstUpd);

 
  const speKey = publicWorkoutsPlanDayArrBeforeSeperateWrkAry[0]?.speKey;
  //console.log('speKey restart',speKey);
  newData = {
    trnrId:publicWorkoutsPlanRowCon?.trnrId,
    trneId:publicWorkoutsPlanRowCon?.trneId,
    speKey:speKey,
    planId:publicWorkoutsPlanRowCon?.id,
    exrStu:"active",
    lstUpd:publicWorkoutsPlanDayArr[0]?.lstUpd,
  }
  if(triainerConnected){
    axios.post(`https://life-pf.com/api/trainer-trainee-plan-day-restart-workout-to-active`, newData)
    .then((response) => {
        //console.log('active');
        setPublicWorkoutsPlanDaysTable(response?.data?.["TrainerWorkoutsPredefinedPlanDays"]);

        // Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
        // Alert.alert(``,
        //   `${t('Your_Workout_Deleted_from_Database_successfully')}`,
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
                

        //       },
        //     },
        //   ],
        //   { cancelable: false }
        // );
            }).catch(error => {
              // Handle error
              //console.log('error');
             Alert.alert('',`${t(error?.response?.data?.message)}`);
            });

 
   }else{
    Alert.alert(`${t('To_Delete_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
  
  }
const newSkippedCompleted = (publicWorkoutsPlanDayArr,publicWorkoutsPlanRowCon,publicWorkoutsPlanDayArrBeforeSeperateWrkAry)=>{
  //console.log('publicWorkoutsPlanDayArrBeforeSeperateWrkAry newSkippedCompleted',publicWorkoutsPlanDayArrBeforeSeperateWrkAry);
  //console.log('publicWorkoutsPlanDayArr newSkippedCompleted',publicWorkoutsPlanDayArr);
  //console.log('publicWorkoutsPlanDayArr[0]?.lstUpd newSkippedCompleted',publicWorkoutsPlanDayArr[0]?.lstUpd);

 
  const speKey = publicWorkoutsPlanDayArrBeforeSeperateWrkAry[0]?.speKey;
  //console.log('speKey newSkippedCompleted',speKey);
  newData = {
    trnrId:publicWorkoutsPlanRowCon?.trnrId,
    trneId:publicWorkoutsPlanRowCon?.trneId,
    speKey:speKey,
    planId:publicWorkoutsPlanRowCon?.id,
    exrStu:"skipped",
    lstUpd:publicWorkoutsPlanDayArr[0]?.lstUpd,
  }
  if(triainerConnected){
    axios.post(`https://life-pf.com/api/trainer-trainee-plan-day-skip-workout-or-done`, newData)
    .then((response) => {
        //console.log('skip');
        setPublicWorkoutsPlanDaysTable(response?.data?.["TrainerWorkoutsPredefinedPlanDays"]);

        // Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
        // Alert.alert(``,
        //   `${t('Your_Workout_Deleted_from_Database_successfully')}`,
        //   [
        //     {
        //       text: 'OK',
        //       onPress: () => {
                

        //       },
        //     },
        //   ],
        //   { cancelable: false }
        // );
            }).catch(error => {
              // Handle error
              //console.log('error');
              // Alert.alert(error?.response?.data?.message);
            });

 
   }else{
    Alert.alert(`${t('To_Delete_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
 
  // updateWorkoutByChangingStatusToSkippedOrDone(userId, speKey, publicWorkoutsPlanRowCon?.speKey,"skipped",publicWorkoutsPlanDayArr[0]?.lstUpd)
  //   .then((result) => {
  //     //////console.log('Day Workouts deleted turned into yes successfully', result);

  //     // Fetch and update the PublicWorkout equipments after soft deleting a gym
  //     return fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,publicWorkoutsPlanRowCon?.speKey);
  //   })
  //   .then((updatedPublicWorkoutsPlans) => {
  //     // Update the state with the updated PublicWorkoutsPlanDaysTableArray
  //     //console.log("updatedPublicWorkoutsPlans to skipped",updatedPublicWorkoutsPlans);

  //     setPublicWorkoutsPlanDaysTable(updatedPublicWorkoutsPlans);
  //     // setSkippedButtonPressed(true);
  //   })
  //   .catch((error) => {
  //     Alert.alert(``,
  //     error);
  //   });

}
  const handleRemoveView = (trnrId, speKey, planId) => {
    
    newData = {
      trnrId:trnrId,
      speKey:speKey,
      planId:planId
    }
    ////console.log('newData,:',newData);
    if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-Predefined-meal-plan-day-deleting`, newData)
      .then((response) => {
          //console.log('deleted');
          setPublicWorkoutsPlanDaysTable(response?.data?.["getTrainerPlanDays"]);

          // Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
          Alert.alert(``,
            `${t('Your_Workout_Deleted_from_Database_successfully')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  

                },
              },
            ],
            { cancelable: false }
          );
              }).catch(error => {
                // Handle error
                //console.log('error');
                Alert.alert(error?.response?.data?.message);
              });

   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };

  
// Output the result for each speKey
////console.log(resultMap);

const restartAllWorkoutsToActive = (publicWorkoutsPlanDaysTable,publicWorkoutsPlanRowCon) => {
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  //console.log('Promise publicWorkoutsPlanDaysTable', publicWorkoutsPlanDaysTable);
  //console.log('Promise publicWorkoutsPlanDaysTable?.length', publicWorkoutsPlanDaysTable?.length);

  return new Promise((resolve, reject) => {
    if (publicWorkoutsPlanDaysTable?.length > 0) {
      let lstUpdArray = [];
      let exrStuArray = [];
      let arrayOfAllDoneOrSkippedValues = [];
      let errorMessage = '';

      for (let i = 0; i < publicWorkoutsPlanDaysTable.length; i++) {
        try {
          //console.log('Promise i', i);
          const wrkAry = JSON.parse(publicWorkoutsPlanDaysTable[i]?.wrkAry); // Parse wrkAry into an array of objects
          //console.log('Promise wrkAry', wrkAry);
          const firstRow = wrkAry?.[0]; // Get the first row
          //console.log('Promise firstRow', firstRow);

          if (firstRow) {
            const lstUpd = firstRow?.lstUpd; // Extract lstUpd from the first row
            const exrStu = firstRow?.exrStu; // Extract exrStu from the first row
            //console.log('Promise lstUpd', lstUpd);
            //console.log('Promise exrStu', exrStu);

            // Compare lstUpd with lstUpdDate
            lstUpdArray.push(lstUpd === today);
            exrStuArray.push(exrStu === 'active'); // Changed to use exrStu variable
            arrayOfAllDoneOrSkippedValues.push(exrStu); // Changed to use exrStu variable
          }
        } catch (error) {
          console.error('Error processing entry at index', i, error);
        }
      }

      //console.log('Promise lstUpdArray====', lstUpdArray);
      //console.log('Promise exrStuArray====', exrStuArray);
      //console.log('Promise arrayOfAllDoneOrSkippedValues====', arrayOfAllDoneOrSkippedValues);

      //console.log('Promise exrStuArray.includes(true)', exrStuArray.includes(true));
      //console.log('Promise lstUpdArray.includes(true)', lstUpdArray.includes(true));
      const allDoneOrSkipped = arrayOfAllDoneOrSkippedValues.every(status => status === 'done' || status === 'skipped');
      //console.log('Promise allDoneOrSkipped', allDoneOrSkipped);
      if (allDoneOrSkipped && lstUpdArray.includes(true)) {
        errorMessage = 'Your_workouts_will_be_reactivated_tomorrow';
        return reject(errorMessage);
      }
      if (allDoneOrSkipped) {
        //console.log('Promise allDoneOrSkipped before sent to backend');
        //console.log('Promise publicWorkoutsPlanRowCon before sent to backend',publicWorkoutsPlanRowCon);

      newData = {
        trnrId:publicWorkoutsPlanRowCon?.trnrId,
        trneId:publicWorkoutsPlanRowCon?.trneId,
        planId:publicWorkoutsPlanRowCon?.id,
       
      }
      if(triainerConnected){
        axios.post(`https://life-pf.com/api/trainer-trainee-plan-day-restart-all-workouts-to-active`, newData)
        .then((response) => {
            //console.log('active');
            setPublicWorkoutsPlanDaysTable(response?.data?.["TrainerWorkoutsPredefinedPlanDays"]);
            //console.log('response?.data?.["TrainerWorkoutsPredefinedPlanDays"]',response?.data?.["TrainerWorkoutsPredefinedPlanDays"]);

            // Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
            // Alert.alert(``,
            //   `${t('Your_Workout_Deleted_from_Database_successfully')}`,
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => {
                    
    
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
                }).catch(error => {
                  // Handle error
                  //console.log('error');
                 Alert.alert('',`${t(error?.response?.data?.message)}`);
                });
    
     
       }else{
        Alert.alert(`${t('To_Delete_your_data')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
       }
      }
      
      //console.log('Succeeded to update all workouts to active');
      // resolve('Workouts updated successfully');
    } else {
      //console.log('Workouts rows not found');
      resolve('No workouts found to update');
    }
  });
}
const speKeyForNewDay = userId + '.' +  new Date().getTime();

// useEffect(() => {

//   // Function to execute the checks for each speKey
//   // const performChecksForSpeKey = (speKey) => {
//   //   return Promise.all([
//   //     checkWorkoutSkippedOrNot(userId, speKey),
//   //     checkWorkoutDoneOrNot(userId, speKey)
//   //   ]);
//   // };

//   // Function to execute the entire flow
//   const executeWorkflow = async () => {
    
//     // try {
//       // const speKeys = Object.keys(resultMap);

//       // // Perform checks for all speKeys
//       // await Promise.all(speKeys.map((speKey) => performChecksForSpeKey(speKey)));

//       // Introduce a 2-second delay before executing the next part
//       // setTimeout(async () => {
//         try {
//           // After all checks are done, restart the workout and update the table
          
//           //console.log('before222 restartAllWorkoutsToActive');

//           const publicPlanDataResults = await restartAllWorkoutsToActive(publicWorkoutsPlanDaysTable,publicWorkoutsPlanRowCon);
//           //console.log('Public Plans DataResults added successfully', publicPlanDataResults);

//           // if (!publicPlanDataResults || publicPlanDataResults.length === 0) {
//           //   // If PublicPlanDataResults is empty, return a value indicating no update
//           //   return null;
//           // }

//           // // Fetch the updated PublicWorkoutsPlanDays
//           // const publicWorkoutsPlanDaysWithoutDeleting = await fetchPublicWorkoutsPlanDaysWithoutDeleting(userId, publicWorkoutsPlanRowCon.speKey);
//           // if (!publicWorkoutsPlanDaysWithoutDeleting) {
//           //   // If no update is needed, exit early
//           //   //console.log('No updates needed');
//           //   return;
//           // }

//           // // Update the state
//           // setPublicWorkoutsPlanDaysTable(publicWorkoutsPlanDaysWithoutDeleting);
//         } catch (error) {
//           // Handle errors in the delayed block
//           Alert.alert(`${t('note')}`, `${t(error.message)}` || `${t(error)}`);
//         }
//       // }, 2000); // 2000 milliseconds = 2 seconds

//     // } catch (error) {
//     //   // Handle errors in the initial block
//     //   Alert.alert(` `, error.message || error);
//     // }
//   };
//   executeWorkflow();

//   // Execute the workflow
// }, [publicWorkoutsPlanDaysTable]);

  return (
      <PageContainer>
          <ScrollView>
              <TitleView >
                  <Title >Life</Title>
              </TitleView>
              <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{publicWorkoutsPlanRowCon?.plnNam}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>

              <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plan_info')}</FormLabel>
            </FormLabelView> 
              <View style={styles.container}> 
                <View key={publicWorkoutsPlanRowCon.id} style={styles.viewContainer}>
                    <View style={styles.plansContainer}>
                      <View  style={{width:width}}>
                        <CalendarFullSizePressableButton disabled={true} style={{backgroundColor:'#000',padding:5,width:width-20,marginRight:10,height: 'auto',minHeight: 49,}}>
                          <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{publicWorkoutsPlanRowCon.plnNam || ''}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                      {/* <Text style={[styles.plansTextValues,styles.plansStartDateText]}>{publicWorkoutsPlanRowCon.strDat || 'Unlimited'}</Text>
                      <Text style={[styles.plansTextValues,styles.plansEndDateText]}>{publicWorkoutsPlanRowCon.endDat || 'Unlimited'}</Text> */}
                    </View>
                    
                </View>
              


                <FormLabelView style={{width:"100%"}}>
                  <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10}}>{t('Days_info')}</FormLabel>
              </FormLabelView>

              {(publicWorkoutsPlanDaysTable?.length > 0) ? (

                  <>
                  <View style={styles.FromToView}>
                  {/* <Text style={[styles.FromToViewText,isArabic ? styles.ArabicFromToViewText : styles.EnglishFromToViewText]}>{t("Meal")}</Text>
                  <Text style={[styles.FromToViewTextWeight,isArabic ? styles.ArabicFromToViewTextWeight : styles.EnglishFromToViewTextWeight]}>{t("Weight")}</Text> */}
                  {/* <Text style={styles.FromToViewTextTime}>Time</Text> */}
                  <Text style={[styles.FromToViewTextProtein,isArabic ? styles.ArabicFromToViewTextProtein : styles.EnglishFromToViewTextProtein]}>{t("Protein")}</Text>
                  <Text style={[styles.FromToViewTextCarbs,isArabic ? styles.ArabicFromToViewTextCarbs : styles.EnglishFromToViewTextCarbs]}>{t("short_Carbs")}</Text>
                  <Text style={[styles.FromToViewTextFats,isArabic ? styles.ArabicFromToViewTextFats : styles.EnglishFromToViewTextFats]}>{t("short_Fats")}</Text>
                  <Text style={[styles.FromToViewTextCalories,isArabic ? styles.ArabicFromToViewTextCalories : styles.EnglishFromToViewTextCalories]}>{t("short_Calories")}</Text>
                  </View>

                  </>

                  ):null}

              {(publicWorkoutsPlanDaysTable?.length > 0) ? (
                publicWorkoutsPlanDaysTable?.map((day,index) => {
                  ////console.log('index--',index);
                  ////console.log('day--',day);
                  const view = resultMap?.[day?.speKey];

                  return (
                      

                        <View key={index} style={styles.viewContainer}>

                        <View style={styles.leftContainer}>

                          <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width:90,height: 'auto',minHeight: 49,}} onPress={() => navigation.navigate('TrainerPredefinedMealsPlanDays', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDay:day,speKeySentFromPlanMeal:day?.speKey })}>
                            <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{day.dayNam}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                        </View>
                        <Text style={styles.rightContainerTextProtein}>{parseFloat(view?.totalProtein?.toFixed(2))}</Text>
                        <Text style={styles.rightContainerTextCarbs}>{parseFloat(view?.totalCarbs?.toFixed(2))}</Text>
                        <Text style={styles.rightContainerTextFats}>{parseFloat(view?.totalFats?.toFixed(2))}</Text>
                        <Text style={styles.rightContainerTextCalories}>{parseFloat(view?.totalCalories?.toFixed(2))}</Text>
                        
                        <View style={styles.removeButtonContainer}>
                          {/* <CalendarFullSizePressableButton style={styles.removeButtonContainerButton} onPress={() => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId, day.speKey, publicWorkoutsPlanRowCon?.id)}>
                            <CalendarFullSizePressableButtonText>{t('Remove')}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton> */}
                          <Pressable onPress={() => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId, day.speKey, publicWorkoutsPlanRowCon?.id)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20,    marginVertical: 15,
}}>
                            <AntDesign name="minuscircleo" size={20} color="white" />
                          </Pressable>
                        </View>
                        </View>
                       

                  );
                })
                
                ):null}
                
                

              
          

                <Spacer size="large">


                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                    <FormElemeentSizeButtonView style={{width:"100%"}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={()=>navigation.navigate('TrainerPredefinedMealsPlanDays',{publicWorkoutsPlanRowConArr:publicWorkoutsPlanRowCon,speKeySentFromPlanMeal:speKeyForNewDay})}>
                      <CalendarFullSizePressableButtonText >{t('Add_Meals')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    </FormElemeentSizeButtonView>
                    {/* <FormElemeentSizeButtonView style={{width:"49%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={() => setModalVisible(true)}>
                      <CalendarFullSizePressableButtonText >{t('Open_Calendar')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                      <ViewOverlay>
                      <TrainerTraineeWorkedExercisesCalendarScreen 
                            onAddEntry={() => setModalVisible(false)}
                            publicWorkoutsPlanRowCon={publicWorkoutsPlanRowCon}
                          />
                      </ViewOverlay>
                    </Modal>
                    </FormElemeentSizeButtonView> */}
                  </FormElemeentSizeButtonParentView>
                </Spacer>
                {/* <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={()=>navigation.goBack()}>
                      <CalendarFullSizePressableButtonText >{t('Back_To_Plans')}</CalendarFullSizePressableButtonText>
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
    color:"black",
    marginVertical: 15,
  },
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    
  },
  
  totalExercises:{
    fontSize:16,
    color:"black",
    marginRight:10,
    marginLeft:5,
  },
  totalSets:{
    fontSize:16,
    color:"black",
    marginRight:10
  },
  ExpectedTime:{
    fontSize:16,
    color:"black",
    marginRight:-50
  },
  removeButtonContainer: {
    marginLeft: 10,
  },
  removeButtonContainerButton:
  {
    backgroundColor:'#000',
    paddingRight:8,
    paddingLeft:8,
    borderRadius:6,
  },
plansContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginRight:15,
    marginBottom:20,
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
  
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical: 15,
    width:"100%",

  },
  FromToViewText:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewText:{
    position:'absolute',
    left:'8%',
  },
  EnglishFromToViewText:{
    position:'absolute',
    left:'4%'
  },
  FromToViewTextWeight:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextWeight:{
    position:'absolute',
    left:'31%'
  },
  EnglishFromToViewTextWeight:{
    position:'absolute',
    left:'28%'
  },
  // FromToViewTextTime:{
  //   fontSize:13,
  //   fontWeight:'bold',
  //   color:"black",
  //   flex: 1,
  //   marginLeft:-8,
  // },
  // rightContainerTextTime:{
  //   flex: 1,
  //   fontSize:13,
  //   color:"black",
  //   marginVertical: 15,
  //   marginRight:-8,
  //   marginLeft:-26,
  //   flexWrap: 'wrap',
  // },
  FromToViewTextProtein:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextProtein:{
    position:'absolute',
  left:'28%'
},
  EnglishFromToViewTextProtein:{
    position:'absolute',
    left:'28%'
  },
  rightContainerTextProtein:{
    fontSize:13,
    color:"black",
    position:'absolute',
    right:'63%',
    marginVertical: 15,

  },
  FromToViewTextCarbs:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",

  },
  ArabicFromToViewTextCarbs:{
    position:'absolute',
    left:'45%'
  },
  EnglishFromToViewTextCarbs:{
    position:'absolute',
    left:'45%'
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    marginVertical: 15,
    right:'46%'
  },
  FromToViewTextFats:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextFats:{
    position:'absolute',
    left:'60%'
  },
  EnglishFromToViewTextFats:{
    position:'absolute',
    left:'60%'
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    marginVertical: 15,
    right:'29%'
  },
  
  FromToViewTextCalories:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextCalories:{
    position:'absolute',
    left:'75%'
  },
  EnglishFromToViewTextCalories:{
    position:'absolute',
    left:'73%'
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    marginVertical: 15,
    right:'15%'
  },

});


