import React, { useState,useContext,useEffect,useRef } from 'react';
import { StyleSheet,Text,ScrollView,View,Modal,Alert,Dimensions,Pressable, Animated, Easing} from "react-native";
const { width } = Dimensions.get('window');
import {AntDesign} from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';
import { Checkbox } from 'react-native-paper';

import { TrainerTraineeSelectDayExercisesScreen } from "./select_day_exercises.screen";
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
import { TrainerTraineeMealsPlansCalendarScreen } from "./trainer_trainee_meals_plans_calendar";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable } from "../../../../database/public_workouts_plan_days";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AuthGlobal from "../Context/store/AuthGlobal";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';

import { addEventListener } from "@react-native-community/netinfo";

export const TrainerPlanMealsScreen = ({navigation,route }) => {
  //const { PlanNumberVariable } = route.params;
  const dispatch = useDispatch();
  const publicWorkoutsPlanRowCon = route.params?.publicMealsPlanRow;
  console.log('publicWorkoutsPlanRowCon plan meal',publicWorkoutsPlanRowCon);
  const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
  const [modalVisible, setModalVisible] = useState(false);
  const [lastPressedButtonFoMealStatus, setLastPressedButtonFoMealStatus] = useState(false);

  const [isSelectDayExercisesVisible, setSelectDayExercisesVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [views, setViews] = useState(); 
  const [allUserWorkedMealsFromDB,setAllUserWorkedMealsFromDB] = useState('');
  const [userId,setUserId] = useState('');
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [resultMap,setResultMap] = useState({});

  const [mealDayCheckBox, setMealDayCheckBox] = useState({}); // Limited or Unlimited

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadingAllMeals, setLoadingAllMeals] = useState(false);
  const [showSuccessAllMeals, setShowSuccessAllMeals] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (showSuccess) {
      Animated.timing(checkmarkAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      checkmarkAnimation.setValue(0); // Reset animation
    }
  }, [showSuccess]);
  useEffect(() => {
    if (showSuccessAllMeals) {
      Animated.timing(checkmarkAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      checkmarkAnimation.setValue(0); // Reset animation
    }
  }, [showSuccessAllMeals]);
  // Create an object to store the summation, dayNam, and length for each speKey
  const context = useContext(AuthGlobal);
//console.log('publicWorkoutsPlanRowCon---',publicWorkoutsPlanRowCon);
//console.log('allUserWorkedMealsFromDB---',allUserWorkedMealsFromDB);

  const [publicWorkoutsPlanDaysTable,setPublicWorkoutsPlanDaysTable] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
      .then((res) => {

      AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      ////console.log('publicWorkoutsPlanDays user---->>>',storedUser);
      setUserId(storedUser.id);
      const fetchData = async () => { 
      const unsubscribe = addEventListener(state => {
        ////console.log("Connection type--", state.type);
        ////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        ////console.log('---------------now online--------')
        ////console.log('my plan Days page',publicWorkoutsPlanRowCon);


        axios.get(`https://life-pf.com/api/get-trainer-trainee-meal-plan-days?traineeId=${publicWorkoutsPlanRowCon?.trneId}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&planId=${publicWorkoutsPlanRowCon?.id}`, {
        headers: {
          'Authorization': `Bearer ${res}`,
          'Content-Type': 'application/json',
        },
        })
        .then(response => {
          // Handle successful response
          console.log('trainer plan meal Plan Days::',response?.data?.["getTraineePlanDays"]);

          setPublicWorkoutsPlanDaysTable(response?.data?.["getTraineePlanDays"]);
          const daysDataTable = response?.data?.["getTraineePlanDays"];
          const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
          ////console.log('userPublicSettings:', userPublicSettings);
          let newResultMap = {};
          //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];



          daysDataTable?.forEach((dayData) => {
            const malChk = (dayData?.malChk != "0" && dayData?.malChk != 0 && dayData?.malChk != "false" && dayData?.malChk != false) ? true : false; // Get malChk value from dayData
            const speKey = dayData?.speKey; // Get speKey from dayData
            
                  // Update the state object
                  setMealDayCheckBox((prevState) => ({
                    ...prevState,
                    [speKey]: malChk,
                  }));
                    const malAry =  dayData?.malAry;
                    //console.log('malAry:', malAry);

                    let newafterJsonMal = [];         
                    if (malAry && typeof malAry !== 'undefined' ) {
                      newafterJsonMal = JSON.parse(malAry);
                      newafterJsonMal = newafterJsonMal.filter(meal => meal.malChk === "1");

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
          //console.log('newResultMap:', newResultMap);

        setResultMap(newResultMap);
          
       
        })
        .catch(error => {
          // Handle error
          ////console.log('Error fetching Days:', error);
        });
        ////////////////all performed meals will go to the calendar/////////////////

        

        ////////////////////////////////////////////////////////////////////////////

      }else{
        ////console.log('else no internet ahmed');
        Alert.alert(`${t('To_see_Plan_s_days')}`,
            `${t("You_must_be_connected_to_the_internet")}`);
              

      }

      });
      
      // Unsubscribe
      unsubscribe();
    };
    fetchData();
      
      });
    });
    }, [AsyncStorage])
    );
    useEffect(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {
          const storedUser = JSON.parse(user);
            
          const fetchData = async () => { 
            const unsubscribe = addEventListener(state => {
              ////console.log("Connection type--", state.type);
              ////console.log("Is connected?---", state.isConnected);
              setTriainerConnected(state.isConnected);
            if(state.isConnected){
              ////console.log('---------------now online--------')
              ////console.log('my all worked Meals page',publicWorkoutsPlanRowCon);
  
  
              axios.get(`https://life-pf.com/api/fetch-all-performed-meals`, {
                params: {
                  traineeId: publicWorkoutsPlanRowCon?.trneId,
                  trainerId: publicWorkoutsPlanRowCon?.trnrId
                },
                headers: {
                  'Authorization': `Bearer ${res}`,
                  'Content-Type': 'application/json',
                },
              })
              .then(response => {
                // Handle successful response
                ////console.log('start Meals::',response.data);
                // setPublicWorkoutsPlanDaysTable(response?.data?.["getTraineePlanDays"]);
                // const daysData = response?.data?.["getTraineePlanDays"];
                ////console.log('response?.data?.["allPerformedMealsRows"]:', response?.data?.allPerformedMealsRows);
                const allPerformedMealsRows = response?.data?.allPerformedMealsRows;
                console.log('allPerformedWorkoutRows:', allPerformedMealsRows);
  
                setAllUserWorkedMealsFromDB(allPerformedMealsRows);
                
  
  
  
              })
              .catch(error => {
                // Handle error
                ////console.log('Error fetching all performed Meals:', error);
              });
  
            }else{
              Alert.alert(`${t("To_see_Performed_Meals")}`,
                  `${t("You_must_be_connected_to_the_internet")}`);
                    
  
            }
  
            });
            
            // Unsubscribe
            unsubscribe();
          };
          fetchData();
  
        });
    
  
    });
  
  }, []); 
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

  



  const handleRemoveView = (trnrId,trneId, speKey, planId) => {
    
    newData = {
      trnrId:trnrId,
      trneId:trneId,
      speKey:speKey,
      planId:planId
    }
    ////console.log('newData,:',newData);
    if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-trainee-meal-plan-day-deleting`, newData)
      .then((response) => {
          ////console.log('Trainer trainee meal Day data sent to online Database', response?.data?.message);
          setPublicWorkoutsPlanDaysTable(response?.data?.getTraineePlanDays);

          Alert.alert(`${t('Meal_s_Day_Deleted_from_Database_successfully')}`);

              })
              .catch(error => {
                // Handle error
                Alert.alert(error?.response?.data?.message);
              });

   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };

  
// Output the result for each speKey
const speKeyForNewDay = userId + '.' + publicWorkoutsPlanRowCon.trneId  + '.' + new Date().getTime();
const addOrUpdateDayMealsCheckboxValue = (DayMealsCheckboxValue,speKey,trnrId,trneId) => {
  //console.log('mealWeight',mealWeight);
  
  //console.log('dayName',dayName);
  //console.log('speKeySentOrNormal',speKeySentOrNormal);

  
  //hideModal();
  // setLoading(true);
  // setShowSuccess(false); // Reset success state

  let newData={
    trnrId: trnrId,
    trneId:trneId,
    speKey:speKey,
    malChk:DayMealsCheckboxValue,
  };
//console.log('inset one meal plus newData',newData);

  if(triainerConnected){
    setLoading(true);
    setShowSuccess(false); // Reset success state
    axios.post(`https://life-pf.com/api/trainer-trainee-plan-days-insert-Or-Update-Check-Box-OF-Day-Meal`, newData)
    .then((response) => {
        //console.log('Trainer plan plan days sent to online Database');

        // Alert.alert(`${t(' ')}`,'Today_Meals_added_to_Database_successfully',
        //           [
        //           {
        //               text: 'OK',
        //               onPress: () => {
        //                 navigation.goBack();
        //               },
        //           },
        //           ],
        //           { cancelable: false }
        //       );
        // setDayName(response?.data["getTraineeTodayMeals"]?.dayNam)
        
        // const MealDayDatacomeFromDB = response?.data["MealDayData"]
        // setMealDayDataState(MealDayDatacomeFromDB);
        // // setDayNameAddEntry(response?.data["getTraineeTodayMeals"]?.dayNam);
        // setTodayMealsData(response?.data["getTraineeTodayMeals"]);
        setMealDayCheckBox((prevState) => ({
          ...prevState,
          [speKey]: DayMealsCheckboxValue,
        }));
        console.log('before etLastPressedButtonFoMealStatus(DayMealsCheckboxValue)');
        setLastPressedButtonFoMealStatus(DayMealsCheckboxValue);
        console.log('after etLastPressedButtonFoMealStatus(DayMealsCheckboxValue)');

            setLoading(false);
            setTimeout(() => {
              setShowSuccess(true); // Show success message and animation
            }, 500); // 2 seconds delay
            
            // Delay to allow users to see the success message before closing the modal
            setTimeout(() => {
              setShowSuccess(false);
            }, 2000); // 2 seconds delay
            })
            .catch(error => {
              // Handle error
              setLoading(false);
              setShowSuccess(false); // Reset success state
              Alert.alert(JSON.stringify(error?.response?.data?.message));
            });
  
   
   }else{
    setLoading(false);
    setShowSuccess(false); // Reset success state
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
   

};
  
useEffect(() => {
  let newDataToRestartAllMeals={
    trnrId: publicWorkoutsPlanRowCon?.trnrId,
    trneId:publicWorkoutsPlanRowCon?.trneId,
    planId:publicWorkoutsPlanRowCon?.id,
  };
console.log('restart-The-Meals-Of-Day',newDataToRestartAllMeals);

const updateTheChecksSignOfAllMeals = async () => { 
    // setLoadingAllMeals(true);
    // setShowSuccessAllMeals(false); // Reset success state
    
    // axios.get(`https://life-pf.com/api/get-One-Meal-From-Trainer-Trainee-Today-Meals?trneId=${trneId}&trnrId=${trnrId}&planId=${planId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${sendToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // })
    // .then((response) => {
    //     //console.log('active');
        
    //     const getTraineeTodayMeals = response?.data?.["getTraineeTodayMeals"];
    //     const today = new Date(); // Today's date
    //     const todayMealDate = new Date(getTraineeTodayMeals?.todDay); // Convert `todDay` to a Date object

    //     // Compare dates
    //     if (today > todayMealDate) {
              axios.post(`https://life-pf.com/api/restart-All-Meals-By-Changing-One-To-Zero`, newDataToRestartAllMeals)
              .then((response) => {
                  console.log('response?.data------------',response?.data);
                  console.log('------------------');
                  setPublicWorkoutsPlanDaysTable(response?.data?.["getTrainerPlanDays"]);

                  // if(response?.data?.message == "updated"){
                  //   const daysDataTable = response?.data["getTrainerPlanDays"];
                  //   setPublicWorkoutsPlanDaysTable(response?.data?.["getTrainerPlanDays"]);
                  // // const newafterJsonMal = JSON.parse(daysDataTable?.malAry);
                  // // newafterJsonMal?.forEach((dayData) => {
                  // //   const malChk = (dayData?.malChk != "0" && dayData?.malChk != 0 && dayData?.malChk != "false" && dayData?.malChk != false) ? true : false; // Get malChk value from dayData
                  // //   const speKey = dayData?.mealSpekey; // Get speKey from dayData
                              
                  // //     // Update the state object
                  // //     setMealDayCheckBox((prevState) => ({
                  // //       ...prevState,
                  // //       [speKey]: malChk,
                  // //     }));
                  // //     }  
                  // //   );
          
                  //   setLoadingAllMeals(false);
                  //   setTimeout(() => {
                  //     setShowSuccessAllMeals(true); // Show success message and animation
                  //   }, 500); // 2 seconds delay
                    
                  //   // Delay to allow users to see the success message before closing the modal
                  //   setTimeout(() => {
                  //     setShowSuccessAllMeals(false);
                  //   }, 2000); // 2 seconds delay
                  // }else{
                  
          
                  //   // setLoadingAllMeals(false);
                    
                  // }
                  
        }).catch(error => {
          // Handle error
          // //console.log('error');
          // setShowSuccessAllMeals(false);
          // setLoadingAllMeals(false);

        //  Alert.alert('',`${t(error?.response?.data?.message)}`);
        });
        //}


// setLoadingAllMeals(false);
// setTimeout(() => {
//   setShowSuccessAllMeals(true); // Show success message and animation
// }, 500); // 2 seconds delay

// // Delay to allow users to see the success message before closing the modal
// setTimeout(() => {
//   setShowSuccessAllMeals(false);
// // }, 2000); // 2 seconds delay
//       }).catch(error => {
//         // Handle error
//         //console.log('error');
//         setShowSuccessAllMeals(false);
//           setLoadingAllMeals(false);

//        Alert.alert('',`${t(error?.response?.data?.message)}`);
//       });
 
};
   setTimeout(() => {
    console.log('updateTheChecksSignOfAllMeals');
    updateTheChecksSignOfAllMeals(); // Show success message and animation
    }, 1000); // 2 seconds delay
}, [publicWorkoutsPlanRowCon]);

// const restartAllMealsByChangingOneToZero = (planId,trnrId,trneId) => {
//   //console.log('mealWeight',mealWeight);
  
//   //console.log('dayName',dayName);
//   //console.log('speKeySentOrNormal',speKeySentOrNormal);

 
//   //hideModal();
//   // setLoading(true);
//   // setShowSuccess(false); // Reset success state
 
//   let newDataToRestartAllMeals={
//     trnrId: trnrId,
//     trneId:trneId,
//     planId:planId,
//   };
// console.log('restart-The-Meals-Of-Day',newDataToRestartAllMeals);

//   if(triainerConnected){
//     setLoadingAllMeals(true);
//     setShowSuccessAllMeals(false); // Reset success state
    
//     // axios.get(`https://life-pf.com/api/get-One-Meal-From-Trainer-Trainee-Today-Meals?trneId=${trneId}&trnrId=${trnrId}&planId=${planId}`, {
//     //   headers: {
//     //     'Authorization': `Bearer ${sendToken}`,
//     //     'Content-Type': 'application/json',
//     //   },
//     // })
//     // .then((response) => {
//     //     //console.log('active');
        
//     //     const getTraineeTodayMeals = response?.data?.["getTraineeTodayMeals"];
//     //     const today = new Date(); // Today's date
//     //     const todayMealDate = new Date(getTraineeTodayMeals?.todDay); // Convert `todDay` to a Date object

//     //     // Compare dates
//     //     if (today > todayMealDate) {
//               axios.post(`https://life-pf.com/api/restart-All-Meals-By-Changing-One-To-Zero`, newDataToRestartAllMeals)
//               .then((response) => {
//                   console.log('response?.data------------',response?.data);
//                   console.log('------------------');
                  
//                   if(response?.data?.message == "updated"){
//                     const daysDataTable = response?.data["getTrainerPlanDays"];
//                     setPublicWorkoutsPlanDaysTable(response?.data?.["getTrainerPlanDays"]);
//                   // const newafterJsonMal = JSON.parse(daysDataTable?.malAry);
//                   // newafterJsonMal?.forEach((dayData) => {
//                   //   const malChk = (dayData?.malChk != "0" && dayData?.malChk != 0 && dayData?.malChk != "false" && dayData?.malChk != false) ? true : false; // Get malChk value from dayData
//                   //   const speKey = dayData?.mealSpekey; // Get speKey from dayData
                              
//                   //     // Update the state object
//                   //     setMealDayCheckBox((prevState) => ({
//                   //       ...prevState,
//                   //       [speKey]: malChk,
//                   //     }));
//                   //     }  
//                   //   );
          
//                     setLoadingAllMeals(false);
//                     setTimeout(() => {
//                       setShowSuccessAllMeals(true); // Show success message and animation
//                     }, 500); // 2 seconds delay
                    
//                     // Delay to allow users to see the success message before closing the modal
//                     setTimeout(() => {
//                       setShowSuccessAllMeals(false);
//                     }, 2000); // 2 seconds delay
//                   }else{
                  
          
//                     setLoadingAllMeals(false);
                    
//                   }
                  
//         }).catch(error => {
//           // Handle error
//           //console.log('error');
//           setShowSuccessAllMeals(false);
//           setLoadingAllMeals(false);

//         //  Alert.alert('',`${t(error?.response?.data?.message)}`);
//         });
//         //}


// // setLoadingAllMeals(false);
// // setTimeout(() => {
// //   setShowSuccessAllMeals(true); // Show success message and animation
// // }, 500); // 2 seconds delay

// // // Delay to allow users to see the success message before closing the modal
// // setTimeout(() => {
// //   setShowSuccessAllMeals(false);
// // // }, 2000); // 2 seconds delay
// //       }).catch(error => {
// //         // Handle error
// //         //console.log('error');
// //         setShowSuccessAllMeals(false);
// //           setLoadingAllMeals(false);

// //        Alert.alert('',`${t(error?.response?.data?.message)}`);
// //       });
 
//    }else{
//     setLoading(false);
//     setShowSuccess(false); // Reset success state
//     Alert.alert(`${t('To_Add_your_data')}`,
//     `${t('You_must_be_connected_to_the_internet')}`);
//    }
   

// };
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
              <Modal
              animationType="slide"
              transparent={true}
              visible={loadingAllMeals || showSuccessAllMeals} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loadingAllMeals && !showSuccessAllMeals && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {showSuccessAllMeals && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      <Text style={styles.successText}>{t('your_meals_has_been_retrieved_successfully')}</Text>

                    </>
                  )}
                </View>
              </View>
            </Modal>
              <Modal
              animationType="slide"
              transparent={true}
              visible={loading || showSuccess} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loading && !showSuccess && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {showSuccess && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      {(lastPressedButtonFoMealStatus)?(
                        <Text style={styles.successText}>{t('your_meal_has_been_consumed_successfully')}</Text>

                      ):(
                        <Text style={styles.successText}>{t('your_meal_has_been_retrieved_successfully')}</Text>

                      )}
                    </>
                  )}
                </View>
              </View>
            </Modal>
              <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plan_info')}</FormLabel>
            </FormLabelView>
              <View style={styles.container}> 

              <View style={styles.viewContainer}>
                    <View style={styles.plansContainer}>
                      <View style={{width:130,}}>
                        <CalendarFullSizePressableButton disabled={true} style={{backgroundColor:'#000',padding:5,width:130,height: 'auto',minHeight: 49,}}>
                          <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{publicWorkoutsPlanRowCon.plnNam || ''}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                      <Text style={[styles.plansTextValues,styles.plansStartDateText]}>{publicWorkoutsPlanRowCon.strDat || 'Unlimited'}</Text>
                      <Text style={[styles.plansTextValues,styles.plansEndDateText]}>{publicWorkoutsPlanRowCon.endDat || 'Unlimited'}</Text>
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
                  //console.log('day--',index,day);
                  {/* //console.log('day--',index,day);
                  //console.log('day speKey--',index,day?.speKey); */}
                  const view = resultMap?.[day?.speKey];
                    {/* console.log('MealDayCheckBox', mealDayCheckBox);
                    console.log('MealDayCheckBox[speKey]', mealDayCheckBox[day?.speKey]); */}

                  return (
                      <>
                      
                      {(userId != publicWorkoutsPlanRowCon?.trnrId)?(

                        <View key={`${day?.speKey}-${index}`} style={styles.viewContainer}>

                          <View style={styles.leftContainer}>

                          <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width:90,height: 'auto',minHeight: 49,marginRight:20}} onPress={() => navigation.navigate('TrainerTraineePlanDays', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDay:day,speKeySentFromPlanMeal:day?.speKey })}>
                            <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{day.dayNam}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                          </View>
                        
                          <Text style={styles.rightContainerTextProtein}>{parseFloat(view?.totalProtein?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextCarbs}>{parseFloat(view?.totalCarbs?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextFats}>{parseFloat(view?.totalFats?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextCalories}>{parseFloat(view?.totalCalories?.toFixed(2))}</Text>
                          {/* <View style={styles.rightContainerTextCheckBox}>
                          <Checkbox 
                              status={mealDayCheckBox[day?.speKey] ? 'checked' : 'unchecked'}
                              onPress={() => {
                                addOrUpdateDayMealsCheckboxValue(!mealDayCheckBox[day?.speKey],day?.speKey,day?.trnrId,day?.trneId);
                              }}
                              color="black"
                              uncheckedColor="black"
                            />
                          </View> */}
                          {/* Delete that button after finish*/}
                          {/* <View style={styles.removeButtonContainer}>
                           
                            <Pressable onPress={() => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId,publicWorkoutsPlanRowCon?.trneId, day.speKey, publicWorkoutsPlanRowCon?.id)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                              <AntDesign name="minuscircleo" size={20} color="white" />
                            </Pressable>
                          </View> */}
                          
                        </View>
                      ):(null)}
                      {(userId == publicWorkoutsPlanRowCon?.trnrId)?(
                        
                        <View key={`${day?.speKey}-${index}`} style={styles.viewContainer}>

                          <View style={styles.leftContainer}>

                            <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width:90,height: 'auto',minHeight: 49,}} onPress={() => navigation.navigate('TrainerTraineePlanDays', { publicWorkoutsPlanRowConArr: publicWorkoutsPlanRowCon,sentDay:day,speKeySentFromPlanMeal:day?.speKey })}>
                              <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{day.dayNam}</CalendarFullSizePressableButtonText>
                            </CalendarFullSizePressableButton>
                          </View>
                        
                          <Text style={styles.rightContainerTextProtein}>{parseFloat(view?.totalProtein?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextCarbs}>{parseFloat(view?.totalCarbs?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextFats}>{parseFloat(view?.totalFats?.toFixed(2))}</Text>
                          <Text style={styles.rightContainerTextCalories}>{parseFloat(view?.totalCalories?.toFixed(2))}</Text>
                          {/* <View style={styles.rightContainerTextCheckBox}>
                          <Checkbox 
                              status={mealDayCheckBox[day?.speKey] ? 'checked' : 'unchecked'}
                              disabled={mealDayCheckBox[day?.speKey]} 
                              color="black"
                              uncheckedColor="black"
                            />
                          </View> */}
                          <View style={styles.removeButtonContainer}>
                            {/* <CalendarFullSizePressableButton style={styles.removeButtonContainerButton} onPress={() => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId,publicWorkoutsPlanRowCon?.trneId, day.speKey, publicWorkoutsPlanRowCon?.id)}>
                              <CalendarFullSizePressableButtonText>{t('Remove')}</CalendarFullSizePressableButtonText>
                            </CalendarFullSizePressableButton> */}
                            <Pressable onPress={() => handleRemoveView(publicWorkoutsPlanRowCon?.trnrId,publicWorkoutsPlanRowCon?.trneId, day.speKey, publicWorkoutsPlanRowCon?.id)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                              <AntDesign name="minuscircleo" size={20} color="white" />
                            </Pressable>
                          </View>
                        </View>
                        
                       

                      ):(null)}
                      </>
                  );
                })
                
                ):null}
                
                

              
          

                <Spacer size="large">
                {(userId == publicWorkoutsPlanRowCon?.trnrId)?(
                  <FormElemeentSizeButtonParentView style={{marginLeft:6,marginRight:6}}>
                    <FormElemeentSizeButtonView style={{width:"49%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('TrainerTraineePlanDays',{publicWorkoutsPlanRowConArr:publicWorkoutsPlanRowCon,speKeySentFromPlanMeal:speKeyForNewDay})}>
                    <CalendarFullSizePressableButtonText >{t("Add_New_Meal")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                      {/* <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={()=>navigation.navigate('TrainerTraineePlanDays',{publicWorkoutsPlanRowConArr:publicWorkoutsPlanRowCon})}>
                      <CalendarFullSizePressableButtonText >{t('Add_Day')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton> */}
                    </FormElemeentSizeButtonView>
                    <FormElemeentSizeButtonView style={{width:"49%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={() => setModalVisible(true)}>
                      <CalendarFullSizePressableButtonText >{t('Open_Calendar')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                      <ViewOverlay>
                      <TrainerTraineeMealsPlansCalendarScreen 
                            onAddEntry={() => setModalVisible(false)}
                            publicWorkoutsPlanRowCon={publicWorkoutsPlanRowCon}
                            allUserWorkedMealsFromDB={allUserWorkedMealsFromDB}
                          />
                      </ViewOverlay>
                    </Modal>
                    </FormElemeentSizeButtonView>
                  </FormElemeentSizeButtonParentView>
                  ):(
                    null
                  )}
                </Spacer>
                {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginTop:10,marginRight:10,marginLeft:10}}>
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                 onPress={() => {
                  restartAllMealsByChangingOneToZero(publicWorkoutsPlanRowCon?.id,publicWorkoutsPlanRowCon?.trnrId,publicWorkoutsPlanRowCon?.trneId);
                        }}>
                        <CalendarFullSizePressableButtonText >uncheck all the meals</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                        
                    </FormElemeentSizeButtonParentView>
                </Spacer> */}
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
    position:"absolute",
    left:"92%",
    marginVertical: 15,

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
    left:'43%'
  },
  EnglishFromToViewTextCarbs:{
    position:'absolute',
    left:'43%'
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    marginVertical: 15,
    right:'48%'
  },
  FromToViewTextFats:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextFats:{
    position:'absolute',
    left:'59%'
  },
  EnglishFromToViewTextFats:{
    position:'absolute',
    left:'59%'
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    marginVertical: 15,
    right:'31%'
  },
  
  FromToViewTextCalories:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextCalories:{
    position:'absolute',
    left:'74%'
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
    right:'14%'
  },
  rightContainerTextCheckBox:{

height:30,
width:30,
//  backgroundColor:'yellow',
//     fontSize:13,
//     color:"black",
    position:'absolute',
    marginVertical: 6,

    right:'9%'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  loadingBox: {
    width: 200,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 15,
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  
});


