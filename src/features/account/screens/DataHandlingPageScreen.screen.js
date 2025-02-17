import React, { useState,useEffect } from 'react';
import {TouchableWithoutFeedback,DevSettings,I18nManager,Dimensions ,NativeModules, Platform, StyleSheet,ScrollView,View,Alert,Modal,TouchableOpacity,Text,ActivityIndicator,Pressable} from "react-native";
const { height,width } = Dimensions.get('window');
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  FormInput,
  FormInputView,
  PageContainer,
  FormLabelView,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  ServiceCloseInfoButtonText,
  ServiceCloseInfoButtonTextView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  GenderSelector,
  ViewOverlay,

} from "../components/account.styles";
import Feather from 'react-native-vector-icons/Feather';

import { Spacer } from "../../../components/spacer/spacer.component";
import { SelectItem  } from '@ui-kitten/components';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import RNRestart from "react-native-restart";
import './i18n';
import {useTranslation} from 'react-i18next';
import { fetchBodyStatsAndMeasurements, updateStatsAndMeasurementsRowsToSynced,getBodyStatsAndMeasurementsUnsyncedRows} from "../../../../database/B_S_and_measurements";
import { fetchTargetStats,getTargetStatsUnsyncedRows,updateTargetStatsRowsToSynced} from "../../../../database/target_stats";
import { fetchPublicSettings,getPublicSettingsUnsyncedRows,updatePublicSettingsRowsToSynced} from "../../../../database/workout_settings";

import { fetchCalculatorsTable,getCalculatorsTableUnsyncedRows, updateCalculatorsRowsToSynced} from "../../../../database/calcaulatorsTable";
import { deleteGymEquipmentsTable,fetchGymEquipments,getGymEquipmentsUnsyncedRows,deleteGymEquipmentsRowsWithYes,updateGymEquipmentsRowsToSynced } from "../../../../database/gym_equipments_table";
import { fetchWorkoutsTable,deleteWorkoutsTable } from "../../../../database/workoutsTable";
import { fetchPublicWorkoutsPlans,getPublicWorkoutsPlansUnsyncedRows,deletePublicWorkoutsPlansRowsWithYes,updatePublicWorkoutsPlansRowsToSynced } from "../../../../database/public_workouts_plans";
import { deletePublicWorkoutsPlanDaysRowsWithYes,getPublicWorkoutsPlanDaysUnsyncedRows,updatePublicWorkoutsPlanDaysRowsToSynced } from "../../../../database/public_workouts_plan_days";
import { getPredefinedMealsUnsyncedRows,deletePredefinedMealsRowsWithYes,updatePredefinedMealsRowsToSynced} from "../../../../database/predefined_meals";
import { getListOfFoodsUnsyncedRows,deleteListOfFoodsRowsWithYes,updateListOfFoodsRowsToSynced} from "../../../../database/list_of_foods";
import { getTodayMealsUnsyncedRows,deleteTodayMealsRowsWithYes,updateTodayMealsRowsToSynced} from "../../../../database/today_meals";

import { addPlansStartWorkoutRowsToDatabase,addBodyStatsAndMeasurementsRowsToDatabase,addCalculatorsTableRowsToDatabase,addGymEquipmentsRowsToDatabase,addListOfFoodsTableRowsToDatabase,addPublicSettingsRowsToDatabase,addPublicWorkoutsPlanDaysRowsToDatabase,addPublicWorkoutsPlansRowsToDatabase,addTargetStatsRowsToDatabase,addTodayMealsTableRowsToDatabase,addWorkoutRowsToDatabase} from "../../../../database/data_handling_functions";
import { getStartWorkoutUnsyncedRows, deleteStartWorkoutRowsWithYes,updateStartWorkoutRowsToSynced } from "../../../../database/start_workout_db";
import { getWorkoutsUnsyncedRows,updateWorkoutsRowsToSynced } from "../../../../database/workoutsTable";



export const DataHandlingPageScreen = ({navigation,route,onLayout}) => {
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTwoLoading, setIsTwoLoading] = useState(false);
  const [storedUserConst, setStoredUserConst] = useState('');
  useEffect(() => {
    if (onLayout) {
      // Send the height of this component to the parent via onLayout
      //console.log('DataHandlingPageScreen 200',200);
      let sentHeight = 200;
      onLayout({ nativeEvent: { layout: { sentHeight } } });

    }
  }, [height]);
  const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale.replace('-', '_').split('_')[0] ||
      NativeModules.SettingsManager.settings.AppleLanguages[0].replace('-', '_').split('_')[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier.replace('-', '_').split('_')[0];

  ////console.log(deviceLanguage); //en_US
  if(deviceLanguage == 'ar'){
////console.log('ara')
  }else if(deviceLanguage == 'en'){
    ////console.log('eng')

  }
  const [visible, setVisible] = useState(false);

  const {t, i18n} = useTranslation();
  
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
    ////////////// Start periodData////////////////
    useFocusEffect(
      React.useCallback(() => {
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        //////console.log('tokeeen:',res);
        setUserToken(res);

      AsyncStorage.getItem("currentUser").then((user) => {
    
          const storedUser = JSON.parse(user);
          setUserId(storedUser.id);
          setStoredUserConst(storedUser);
          
          const unsubscribe = addEventListener(state => {
            //////console.log("Connection type--", state.type);
            //////console.log("Is connected?---", state.isConnected);
            setTriainerConnected(state.isConnected);
          // if(state.isConnected){
          //   //////console.log('---------------now online--------')
            
          // }else{
          //   //////console.log('else no internet ahmed');
          //   Alert.alert(' ',
          //   'Please Connect to the internet To see the Wallet',
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => {
                 
          //       },
          //     },
          //   ],
          //   { cancelable: false }
          // );

          // }
        });
          
          // Unsubscribe
          unsubscribe();
        })
      });
     
    
    }, [])
    );

    ////////////// End periodData////////////////
    // import React, { useState } from 'react';
    // import { View, ActivityIndicator, Alert } from 'react-native';
    
    // const YourComponent = () => {
    //   const [isLoading, setIsLoading] = useState(false);
    
    //   const makeBackupforTheData = async () => {
    //     setIsLoading(true); // Show activity indicator
        
    //     try {
    //       // Your function logic here
          
    //       // For example:
    //       await function1();
    //       await function2();
    //       // Call other functions here
    //     } catch (error) {
    //       //////console.log('Error:', error);
    //     } finally {
    //       setIsLoading(false); // Hide activity indicator
    //     }
    //   };
    
    //   // Define your functions here
    
    //   return (
    //     <View style={{ flex: 1 }}>
    //       {/* Your main content */}
    //       <YourButton onPress={makeBackupforTheData} />
    
    //       {/* Show activity indicator based on isLoading state */}
    //       {isLoading && (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //           <ActivityIndicator size="large" color="blue" />
    //         </View>
    //       )}
    //     </View>
    //   );
    // };
    
    // export default YourComponent;
 //////console.log('storedUserConst',storedUserConst?.['athRol']);    
  const makeBackupforTheData = async () => {
    
       
      
if(triainerConnected){
  setIsLoading(true); // Show activity indicator
  try {
        //****** TargetStat
 await getTargetStatsUnsyncedRows(userId).then((usersTS) => {
  //////console.log('TargetStat unSynced Data :', usersTS);
  axios.post(`https://life-pf.com/api/tarStat-update-data`, usersTS)
  .then((response) => {
    //////console.log('our services target axios update backend', response.data.message);
    // Handle any other logic here if needed
  })
  .catch((error) => {
    // Handle errors, e.g., show an error message
    //////console.log('our services target axios error.response.data', error.response.data);
    setIsLoading(false); // Hide activity indicator

  });
  const unsyncedTSRowIds = usersTS.map((row) => row.id);
  updateTargetStatsRowsToSynced(unsyncedTSRowIds,userId).then((users) => {
      //////console.log('TargetStat updateTargetStatsRowsToSynced updated :', users);
    }).catch((error) => {
      //////console.log('BSmeasurements updateTargetStatsRowsToSynced didnt updated:', error);
      setIsLoading(false); // Hide activity indicator

    });
}).catch((error) => {
//////console.log('Error fetching TargetStat:', error);
setIsLoading(false); // Hide activity indicator

});
///// //*********body stats and meaurements 
await getBodyStatsAndMeasurementsUnsyncedRows(userId).then((usersBSMeasurements) => {
  //////console.log('BodyStatsAndMeasurementsUnsyncedRows unSynced Data :', usersBSMeasurements);
  usersBSMeasurements.forEach(async usersBSMeasurement => {
    //////console.log('usersBSMeasurement?.["images"] :', usersBSMeasurement?.["images"]);

    
    let usersBSMeasurementFormData = new FormData();
    
    
    let imagesNamesArr= [];
    if(usersBSMeasurement?.["images"]){
    let imagesParsed = JSON.parse((usersBSMeasurement?.["images"]));
    imagesParsed.forEach(async oneImagesParsed => {
      let imageName = "";
      let imageExt = "";
    

        imageName = oneImagesParsed?.split('images/').pop();
        imagesNamesArr?.push(imageName);
        imageExt = imageName?.split('.').pop(); 
        //////console.log('oneImagesParsed',oneImagesParsed);
        //////console.log('imageName',imageName);

        //////console.log('imageExt',imageExt);
        if(imagesNamesArr.length > 0){
          usersBSMeasurementFormData.append("media_files[]", {
            uri: oneImagesParsed,
            name:  `${imageName}`,
            type: `image/${imageExt}`
          });
        }
       
      });
    }
   //////console.log('imagesNamesArr',imagesNamesArr);
    let usersBSMeasurementObj = {
      arm: usersBSMeasurement.arm ? usersBSMeasurement.arm : "",
      calves: usersBSMeasurement.calves,
      chest: usersBSMeasurement.chest,
      date: usersBSMeasurement.date,
      forarm: usersBSMeasurement.forarm,
      hHips: usersBSMeasurement.hHips,
      height: usersBSMeasurement.height,
      hips: usersBSMeasurement.hips,
      id: usersBSMeasurement.id,
      isSync: usersBSMeasurement.isSync,
      neck: usersBSMeasurement.neck,
      should: usersBSMeasurement.should,
      thigh: usersBSMeasurement.thigh,
      torso: usersBSMeasurement.torso,
      userId: usersBSMeasurement.userId,
      weight: usersBSMeasurement.weight,
      imageNames:imagesNamesArr,    
    };
    //////console.log('usersBSMeasurementObj',usersBSMeasurementObj);
      
    usersBSMeasurementFormData.append('usersBSMeasurementObj', {
        "string": JSON.stringify(usersBSMeasurementObj), //This is how it works :)
        type: 'application/json'
      });
      //////console.log('usersBSMeasurement usersBSMeasurementFormData',usersBSMeasurementFormData);

      
  
      
      axios.post(`https://life-pf.com/api/BSMeasurments-insert-data`, usersBSMeasurementFormData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
      }
    })
        .then((response) => {
    
              })
        .catch((error) => {
          setIsLoading(false); // Hide activity indicator

                //////console.log('BSmeasurements updateBSmeasurementsRowsToSynced didnt updated:', error);
              });


  });
  // axios.post(`https://life-pf.com/api/BSMeasurments-insert-data`, usersBSMeasurements)
  // .then((response) => {
  //   //////console.log('our services usersBSMeasurements axios update backend', response.data.message);
  //   // Handle any other logic here if needed
  // })
  // .catch((error) => {
  //   // Handle errors, e.g., show an error message
  //   //////console.log('our services usersBSMeasurements axios error.response.data', error.response.data);
  // });
  const unsyncedBSMeasuremntsRowIds = usersBSMeasurements.map((row) => row.id);
  updateStatsAndMeasurementsRowsToSynced(unsyncedBSMeasuremntsRowIds,userId).then((users) => {
      //////console.log('BSmeasurements updateBSmeasurementsRowsToSynced updated :', users);
    }).catch((error) => {
      setIsLoading(false); // Hide activity indicator

      //////console.log('BSmeasurements updateBSmeasurementsRowsToSynced didnt updated:', error);
    });
}).catch((error) => {
  setIsLoading(false); // Hide activity indicator

//////console.log('Error fetching usersBSMeasurements:', error);
});
//////////////////////

//*********workout Settings page 
await getPublicSettingsUnsyncedRows(userId).then((usersPS) => {
  //////console.log('PublicSettings unSynced Data :', usersPS);
  axios.post(`https://life-pf.com/api/publicSettings-update-data`, usersPS)
  .then((response) => {
      //////console.log('PublicSettings axios update backend', response.data.message);
      // Handle any other logic here if needed
          const unsyncedPublicSettingsRowIds = usersPS.map((row) => row.id);
          updatePublicSettingsRowsToSynced(unsyncedPublicSettingsRowIds,userId).then((users) => {
                  //////console.log('PublicSettings updatePublicSettingsRowsToSynced updated :', users);
                  }).catch((error) => {
                    setIsLoading(false); // Hide activity indicator

                  //////console.log('PublicSettings updatePublicSettingsRowsToSynced didnt updated:', error);
                  });
              })
  .catch((error) => {
    setIsLoading(false); // Hide activity indicator

      // Handle errors, e.g., show an error message
      //////console.log('PublicSettings axios error.response.data', error.response.data);
  });

}).catch((error) => {
  setIsLoading(false); // Hide activity indicator

//////console.log('Error fetching PublicSettings:', error);
});
//******//********* Calculators pages 
await getCalculatorsTableUnsyncedRows(userId).then((usersPS) => {
  //////console.log('Calculators unSynced Data :', usersPS);
  axios.post(`https://life-pf.com/api/calculators-insert-data`, usersPS)
  .then((response) => {
      //////console.log('Calculators axios update backend', response.data.message);
      // Handle any other logic here if needed
      const unsyncedCalculatorsRowIds = usersPS.map((row) => row.id);
      updateCalculatorsRowsToSynced(unsyncedCalculatorsRowIds,userId).then((users) => {
              //////console.log('Calculators updateStatsAndMeasurementsRowsToSynced updated :', users);
              }).catch((error) => {
                setIsLoading(false); // Hide activity indicator

              //////console.log('Calculators updateStatsAndMeasurementsRowsToSynced didnt updated:', error);
              });
  })
  .catch((error) => {
    setIsLoading(false); // Hide activity indicator

      // Handle errors, e.g., show an error message
      //////console.log('Calculators axios error.response.data', error.response.data);
  });

}).catch((error) => {
  setIsLoading(false); // Hide activity indicator

//////console.log('Error fetching Calculators:', error);
});

//******//********* Gym Facilities pages 
await getGymEquipmentsUnsyncedRows(userId).then((usersPS) => {
  //////console.log('GymEquipments unSynced Data:', usersPS);
  
  axios.post(`https://life-pf.com/api/gymEquipments-insert-data`, usersPS)
      .then((response) => {
          //////console.log('GymEquipments axios update backend', response?.data.message);

          // Delete gym rows
          deleteGymEquipmentsRowsWithYes(usersPS)
              .then((DGEResults) => {
                  //////console.log('Gym Facilites rows deleted:', DGEResults);

                  // Update the rest of the rows
                  const unsyncedGymEquipmentsRowIds = usersPS.map((row) => row.id);
                  updateGymEquipmentsRowsToSynced(unsyncedGymEquipmentsRowIds, userId)
                      .then((users) => {
                          //////console.log('GymEquipments updateStatsAndMeasurementsRowsToSynced updated:', users);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('GymEquipments updateStatsAndMeasurementsRowsToSynced didnt updated:', error);
                      });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting Gym Facilites rows:', error);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          // Handle errors from axios
          //////console.log('GymEquipments axios error.response.data', error.response?.data);
      });
})
.catch((error) => {
  setIsLoading(false); // Hide activity indicator

  //////console.log('Error fetching GymEquipments:', error);
});

//******//*********Workouts pages 
await getWorkoutsUnsyncedRows(userId).then((usersPS) => {
  // console.log('Workouts unSynced Data:', usersPS);
  usersPS.forEach(async workoutData => {
    let WorkoutsFormData = new FormData();
    // let imageUri = workoutData?.images;
    // let imageName = "";
    // let imageExt = "";
    // if(imageUri){
    //   //   // Access local image file
    //   imageName = imageUri.split('images/').pop();
    //   imageExt = imageUri.split('.').pop();   
    // }

    // let videoUri = workoutData?.videos;
    // let videoName = "";
    // let videoExt = "";
    // if(videoUri && storedUserConst?.['role'] == "Trainer"){
    //   //   // Access local image file
    //   videoName = videoUri.split('videos/').pop();
    //   videoExt = videoUri.split('.').pop();   
    // }
    let workoutInfo = {
      eqpUsd: workoutData.eqpUsd,
      exrTyp: workoutData.exrTyp,
      mjMsOn: workoutData.mjMsOn,
      mjMsTr: workoutData.mjMsTr,
      mjMsTw: workoutData.mjMsTw,
      mnMsOn: workoutData.mnMsOn,
      mnMsTo: workoutData.mnMsTo,
      mnMsTr: workoutData.mnMsTr,
      pfgWkt: workoutData.pfgWkt,
      witUsd: workoutData.witUsd,
      wktNam: workoutData.wktNam,
      wktStp: workoutData.wktStp,
      id: workoutData.id,
      isSync: workoutData.isSync,
      speKey: workoutData.speKey,
      userId: workoutData.userId,
      images:workoutData.images,  
      videos:workoutData?.videos,    };
    //////console.log('workoutInfo',workoutInfo);
      
    WorkoutsFormData.append('workoutInfo', {
        "string": JSON.stringify(workoutInfo), //This is how it works :)
        type: 'application/json'
      });
    //   if(imageUri){

    //     WorkoutsFormData.append('image', {
    //       uri: imageUri,
    //       name:  `${imageName}`,
    //       type: `image/${imageExt}`
    //     });
    // }
      
      // if(storedUserConst?.['role'] == "Trainer" && videoUri){
      //   WorkoutsFormData.append('video', {
      //   uri: videoUri,
      //   name:  `${videoName}`,
      //   type: `video/${videoExt}`
      // });
      // }
      // console.log('WorkoutsFormData',WorkoutsFormData);

      
      axios.post(`https://life-pf.com/api/workouts-insert-data`, WorkoutsFormData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
      }
    })
        .then((response) => {
                 // // Update the rest of the rows
              const unsyncedWorkoutsRowIds = usersPS.map((row) => row.id);
              updateWorkoutsRowsToSynced(unsyncedWorkoutsRowIds, userId)
                  .then((users) => {
                      //////console.log('Workouts updateWorkoutsRowsToSynced updated:', users);
                  })
                  .catch((error) => {
                    setIsLoading(false); // Hide activity indicator

                      //////console.log('Workouts updateWorkoutsRowsToSynced didnt updated:', error);
                  });
        })
        .catch((error) => {
          setIsLoading(false); // Hide activity indicator

            // Handle errors from axios
            //////console.log('Workouts axios error.response.data', error.response?.data);
        });
      });
  
 
})
.catch((error) => {
  setIsLoading(false); // Hide activity indicator

  //////console.log('Error fetching Workouts:', error);
});

//******//********* PublicWorkoutsPlans pages 
await getPublicWorkoutsPlansUnsyncedRows(userId).then((usersPWP) => {
  //////console.log('PublicWorkoutsPlans unSynced Data:', usersPWP);
  
  axios.post(`https://life-pf.com/api/publicWorkoutsPlans-insert-data`, usersPWP)
      .then((response) => {
          //////console.log('PublicWorkoutsPlans axios update backend', response?.data.message);
      
      // Delete gym rows
          deletePublicWorkoutsPlansRowsWithYes(usersPWP)
              .then((DGEResults) => {
                  //////console.log('PublicWorkoutsPlans rows deleted:', DGEResults);

                  // Update the rest of the rows
                  const unsyncedPublicWorkoutsPlansRowIds = usersPWP.map((row) => row.id);
                  updatePublicWorkoutsPlansRowsToSynced(unsyncedPublicWorkoutsPlansRowIds, userId)
                      .then((resultPWP) => {
                          //////console.log('PublicWorkoutsPlans updatePublicWorkoutsPlansRowsToSynced updated:', resultPWP);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('PublicWorkoutsPlans updatePublicWorkoutsPlansRowsToSynced didnt updated:', error);
                      });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting PublicWorkoutsPlans rows:', error);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          // Handle errors from axios
          //////console.log('PublicWorkoutsPlans axios error.response.data', error.response?.data);
      });
})
.catch((error) => {
  setIsLoading(false); // Hide activity indicator

  //////console.log('Error fetching PublicWorkoutsPlans:', error);
});
  // //******//********* PublicWorkoutsPlan Days pages 
  await getPublicWorkoutsPlanDaysUnsyncedRows(userId).then((usersPWPD) => {
  //////console.log('PublicWorkoutsPlanDays unSynced Data:', usersPWPD);
  
  axios.post(`https://life-pf.com/api/publicWorkoutsPlansDays-insert-data`, usersPWPD)
      .then((response) => {
          //////console.log('PublicWorkoutsPlanDays axios update backend', response?.data.message);
          // Delete gym rows
          deletePublicWorkoutsPlanDaysRowsWithYes(usersPWPD)
              .then((DGEResults) => {
                  //////console.log('PublicWorkoutsPlanDays rows deleted:', DGEResults);

                  // Update the rest of the rows
                  const unsyncedPublicWorkoutsPlanDaysRowIds = usersPWPD.map((row) => row.id);
                  updatePublicWorkoutsPlanDaysRowsToSynced(unsyncedPublicWorkoutsPlanDaysRowIds, userId)
                      .then((resultPWPD) => {
                          //////console.log('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced updated:', resultPWPD);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced didnt updated:', error);
                      });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting PublicWorkoutsPlanDays rows:', error);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          // Handle errors from axios
          //////console.log('PublicWorkoutsPlanDays axios error.response.data', error.response?.data);
      });
})
.catch((error) => {
  setIsLoading(false); // Hide activity indicator

  //////console.log('Error fetching PublicWorkoutsPlanDays:', error);
});
  //******//********* BeginWorkouts pages 
  await getStartWorkoutUnsyncedRows(userId).then((usersBWS) => {
  //////console.log('BeginWorkouts unSynced Data:', usersBWS);
  
  axios.post(`https://life-pf.com/api/beginWorkouts-insert-data`, usersBWS)
      .then((response) => {
          //////console.log('BeginWorkouts axios update backend', response?.data.message);
          // Delete gym rows
          deleteStartWorkoutRowsWithYes(usersBWS)
              .then((DGEResults) => {
                  //////console.log('BeginWorkouts rows deleted:', DGEResults);
                 
                  // Update the rest of the rows
                  const unsyncedBeginWorkouts = usersBWS.map((row) => row.id);
                  updateStartWorkoutRowsToSynced(unsyncedBeginWorkouts, userId)
                      .then((resultPWPD) => {
                          //////console.log('BeginWorkouts updateBeginWorkoutsRowsToSynced updated:', resultPWPD);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('BeginWorkouts updateBeginWorkoutsRowsToSynced didnt updated:', error);
                      });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting BeginWorkouts rows:', error);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          // Handle errors from axios
          //////console.log('PublicWorkoutsPlanDays axios error.response.data', error.response?.data);
      });
})
.catch((error) => {
  setIsLoading(false); // Hide activity indicator

  //////console.log('Error fetching PublicWorkoutsPlanDays:', error);
});

  //******//********* PredefinedMeals pages 
  await getPredefinedMealsUnsyncedRows(userId).then((usersPM) => {
      //////console.log('PredefinedMeals unSynced Data:', usersPM);
      
      axios.post(`https://life-pf.com/api/predefinedMeals-insert-data`, usersPM)
          .then((response) => {
              //////console.log('PredefinedMeals axios update backend', response?.data.message);
              // Delete gym rows
              deletePredefinedMealsRowsWithYes(usersPM)
                  .then((DPMResults) => {
                      //////console.log('PredefinedMeals rows deleted:', DPMResults);
  
                      // Update the rest of the rows
                      const unsyncedPredefinedMealsRowIds = usersPM.map((row) => row.id);
                      updatePredefinedMealsRowsToSynced(unsyncedPredefinedMealsRowIds, userId)
                          .then((resultPWPD) => {
                              //////console.log('PredefinedMeals updatePredefinedMealsRowsToSynced updated:', resultPWPD);
                          })
                          .catch((error) => {
                            setIsLoading(false); // Hide activity indicator

                              //////console.log('PredefinedMeals updatePredefinedMealsRowsToSynced didnt updated:', error);
                          });
                  })
                  .catch((error) => {
                    setIsLoading(false); // Hide activity indicator

                      //////console.log('Error deleting PredefinedMeals rows:', error);
                  });
                  })
                  .catch((error) => {
                    setIsLoading(false); // Hide activity indicator

                      // Handle errors from axios
                      //////console.log('PredefinedMeals axios error.response.data', error.response?.data);
                  });
          })
          .catch((error) => {
            setIsLoading(false); // Hide activity indicator

              //////console.log('Error fetching PredefinedMeals:', error);
          });

// //******//********* ListOfFoods pages 
await getListOfFoodsUnsyncedRows(userId).then((usersPM) => {
  //////console.log('ListOfFoods unSynced Data:', usersPM);
  usersPM.forEach(async mealData => {
  let formData = new FormData();
  let imageUri = mealData?.images;
  let imageName = "";
  let imageExt = "";
  if(imageUri && storedUserConst?.['role'] == "Trainer"){
    //   // Access local image file
    imageName = imageUri.split('images/').pop();
    imageExt = imageUri.split('.').pop();   
  }
  let mealInfo = {
    Calcim: mealData.Calcim,
    Chostl: mealData.Chostl,
    Iron: mealData.Iron,
    Munstd: mealData.Munstd,
    Plnstd: mealData.Plnstd,
    Potsim: mealData.Potsim,
    Satrtd: mealData.Satrtd,
    Sodium: mealData.Sodium,
    Subtyp: mealData.Subtyp,
    Trans: mealData.Trans,
    Type: mealData.Type,
    VtminA: mealData.VtminA,
    VtminC: mealData.VtminC,
    calris: mealData.calris,
    carbs: mealData.carbs,
    deleted: mealData.deleted,
    fats: mealData.fats,
    foddes: mealData.foddes,
    id: mealData.id,
    isSync: mealData.isSync,
    protin: mealData.protin,
    speKey: mealData.speKey,
    userId: mealData.userId,
    weight: mealData.weight,
    imageName:(imageName && storedUserConst?.['role'] == "Trainer") ? imageName : '',    
  };
 console.log('imageUri',imageUri);
    
    formData.append('mealInfo', {
      "string": JSON.stringify(mealInfo), //This is how it works :)
      type: 'application/json'
    });
    if(storedUserConst?.['role'] == "Trainer"){
      if(imageUri?.startsWith('file:///') || imageUri?.startsWith('content://')){
          formData.append('image', {
          uri: imageUri,
          name:  `${imageName}`,
          type: `image/${imageExt}`
        });
      }
    }
    
    console.log('formData',formData);

    
    axios.post(`https://life-pf.com/api/ListOfFoods-insert-data`, formData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
    }
  })
      .then((response) => {
                deleteListOfFoodsRowsWithYes(usersPM)
              .then((DPMResults) => {
                  //////console.log('ListOfFoods rows deleted:', DPMResults);
                                // Update the rest of the rows
                  const unsyncedListOfFoodsRowIds = usersPM.map((row) => row.id);
                  updateListOfFoodsRowsToSynced(unsyncedListOfFoodsRowIds, userId)
                      .then((resultPWPD) => {
                          //////console.log('ListOfFoods updateListOfFoodsRowsToSynced updated:', resultPWPD);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('ListOfFoods updateListOfFoodsRowsToSynced didnt updated:', error);
                      });
                  
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting ListOfFoods rows:', error);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          // Handle errors from axios
          //////console.log('ListOfFoods axios error.response.data', error.response?.data);
      });
    });
  // const formData = new FormData();

  // usersPM.forEach(async mealData => {
  //   formData.append('Calcim', mealData.calris);
  //   formData.append('Chostl', mealData.carbs);
  //   formData.append('Iron', mealData.carbs);
  //   formData.append('Munstd', mealData.carbs);
  //   formData.append('Plnstd', mealData.carbs);
  //   formData.append('Potsim', mealData.carbs);
  //   formData.append('Satrtd', mealData.carbs);
  //   formData.append('Sodium', mealData.carbs);
  //   formData.append('Subtyp', mealData.carbs);
  //   formData.append('Trans', mealData.carbs);
  //   formData.append('Type', mealData.carbs);
  //   formData.append('VtminA', mealData.carbs);
  //   formData.append('VtminC', mealData.carbs);
  //   formData.append('calris', mealData.carbs);
  //   formData.append('carbs', mealData.carbs);
  //   formData.append('deleted', mealData.carbs);
  //   formData.append('fats', mealData.carbs);
  //   formData.append('foddes', mealData.carbs);
  //   formData.append('id', mealData.carbs);
  //   formData.append('isSync', mealData.carbs);
  //   formData.append('protin', mealData.carbs);
  //   formData.append('speKey', mealData.carbs);
  //   formData.append('userId', mealData.carbs);
  //   formData.append('weight', mealData.carbs);


  //   // Append other meal attributes...

  //   // Access local image file
  //   const imageUri = mealData.images;
  //   const imageInfo = await FileSystem.getInfoAsync(imageUri);
  //   if (imageInfo.exists) {
  //     const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     formData.append('image', {
  //       uri: imageUri,
  //       name: 'image.jpg',
  //       type: 'image/jpeg',
  //       base64: imageBase64,
  //     });
  //   }
  //   //////console.log('formData',formData['_parts']);

  // });
  // axios.post(`https://life-pf.com/api/ListOfFoods-insert-data`, usersPM)
  //     .then((response) => {
  //         //////console.log('ListOfFoods axios update backend', response?.data.message);
  //         // Delete gym rows
  //         deleteListOfFoodsRowsWithYes(usersPM)
  //             .then((DPMResults) => {
  //                 //////console.log('ListOfFoods rows deleted:', DPMResults);

  //                 // Update the rest of the rows
  //                 const unsyncedListOfFoodsRowIds = usersPM.map((row) => row.id);
  //                 updateListOfFoodsRowsToSynced(unsyncedListOfFoodsRowIds, userId)
  //                     .then((resultPWPD) => {
  //                         //////console.log('ListOfFoods updateListOfFoodsRowsToSynced updated:', resultPWPD);
  //                     })
  //                     .catch((error) => {
  //                         //////console.log('ListOfFoods updateListOfFoodsRowsToSynced didnt updated:', error);
  //                     });
  //             })
  //             .catch((error) => {
  //                 //////console.log('Error deleting ListOfFoods rows:', error);
  //             });
  //             })
  //             .catch((error) => {
  //                 // Handle errors from axios
  //                 //////console.log('ListOfFoods axios error.response.data', error.response?.data);
  //             });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          //////console.log('Error fetching ListOfFoods:', error);
      });
      
// //******//********* Today Meals pages 
await getTodayMealsUnsyncedRows(userId).then((usersPM) => {
  //////console.log('TodayMeals unSynced Data:', usersPM);
  axios.post(`https://life-pf.com/api/TodayMeals-insert-data`, usersPM)
      .then((response) => {
          //////console.log('TodayMeals axios update backend', response?.data.message);
          // Delete gym rows
          deleteTodayMealsRowsWithYes(usersPM)
              .then((DPMResults) => {
                  //////console.log('TodayMeals rows deleted:', DPMResults);

                  // Update the rest of the rows
                  const unsyncedTodayMealsRowIds = usersPM.map((row) => row.id);
                  updateTodayMealsRowsToSynced(unsyncedTodayMealsRowIds, userId)
                      .then((resultPWPD) => {
                          //////console.log('TodayMeals updateTodayMealsRowsToSynced updated:', resultPWPD);
                      })
                      .catch((error) => {
                        setIsLoading(false); // Hide activity indicator

                          //////console.log('TodayMeals updateTodayMealsRowsToSynced didnt updated:', error);
                      });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  //////console.log('Error deleting TodayMeals rows:', error);
              });
              })
              .catch((error) => {
                setIsLoading(false); // Hide activity indicator

                  // Handle errors from axios
                  //////console.log('TodayMeals axios error.response.data', error.response?.data);
              });
      })
      .catch((error) => {
        setIsLoading(false); // Hide activity indicator

          //////console.log('Error fetching TodayMeals:', error);
      });
    } catch (error) {
      setIsLoading(false); // Hide activity indicator

      //       
      //////console.log('Error:', error);
        }
         finally {
          setIsLoading(false); // Hide activity indicator
        }
      
     

      
   
       }else{
        Alert.alert(`${t('To_Upload_your_Data')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
       }
      
    }
//     const downloadDataForUser = async () => {

//       let userBeginWorkoutsData= [];
//       let userBodyStatsAndMeasurementsData= [];
//       let userCalculatorsData= [];
//       let userGymEquipmentsData= [];
//       let userListOfFoodsData= [];
//       let userPublicSettingsData= [];
//       let userPublicWorkoutsPlanDaysData= [];
//       let userPublicWorkoutsPlansData= [];
//       let userTargetStatsData= [];
//       let userTodayMealsData= [];
//       let userworkoutsData= [];
     
//      if(triainerConnected){
//        setIsTwoLoading(true); // Show activity indicator

//          axios.get('https://life-pf.com/api/downloadDataForDatabaseToTheApp', {
//            headers: {
//              'Authorization': `Bearer ${userToken}`,
//              'Content-Type': 'application/json',
//              'Connection':"keep-alive",
//            },
//            })
//            .then(response => {
//              userBeginWorkoutsData = response.data["userBeginWorkoutsData"];
//              userBodyStatsAndMeasurementsData= response.data["userBodyStatsAndMeasurementsData"];
//              userCalculatorsData= response.data["userCalculatorsData"];
//              userGymEquipmentsData= response.data["userGymEquipmentsData"];
//              userListOfFoodsData= response.data["userListOfFoodsData"];
//              userPublicSettingsData= response.data["userPublicSettingsData"];
//              userPublicWorkoutsPlanDaysData= response.data["userPublicWorkoutsPlanDaysData"];
//              userPublicWorkoutsPlansData= response.data["userPublicWorkoutsPlansData"];
//              userTargetStatsData= response.data["userTargetStatsData"];
//              userTodayMealsData= response.data["userTodayMealsData"];
//              userworkoutsData= response.data["userworkoutsData"];
           
           
           
//            })
//            .catch(error => {
//              // Handle error
//              //////console.log('Error fetching User data:', error);
//            });
       

//              try {
//                setIsTwoLoading(true); // Show activity indicator

//              // Handle successful response
//              //setOurPersonalTrainers(response.data["trainers"]);
//              await addPlansStartWorkoutRowsToDatabase(userBeginWorkoutsData).then((userBodyStatsAndMeasurementsData) => {
//                //////console.log('addPlansStartWorkoutRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addPlansStartWorkoutRowsToDatabase:', error);
//              });
//              await addBodyStatsAndMeasurementsRowsToDatabase(userBodyStatsAndMeasurementsData).then((userBodyStatsAndMeasurementsData) => {
//                //////console.log('addBodyStatsAndMeasurementsRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addBodyStatsAndMeasurementsRowsToDatabase:', error);
//              });
//              await addCalculatorsTableRowsToDatabase(userCalculatorsData).then((userCalculatorsData) => {
//                //////console.log('addCalculatorsTableRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addCalculatorsTableRowsToDatabase:', error);
//              });
//              await addGymEquipmentsRowsToDatabase(userGymEquipmentsData).then((userGymEquipmentsData) => {
//                //////console.log('addGymEquipmentsRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addGymEquipmentsRowsToDatabase:', error);
//              });
//              await addListOfFoodsTableRowsToDatabase(userListOfFoodsData).then((userListOfFoodsData) => {
//                //////console.log('addListOfFoodsTableRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addListOfFoodsTableRowsToDatabase:', error);
//              });
//              await addPublicSettingsRowsToDatabase(userPublicSettingsData).then((userPublicSettingsData) => {
//                //////console.log('addPublicSettingsRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addPublicSettingsRowsToDatabase:', error);
//              });
//              await addPublicWorkoutsPlanDaysRowsToDatabase(userPublicWorkoutsPlanDaysData).then((userPublicWorkoutsPlanDaysData) => {
//                //////console.log('addPublicWorkoutsPlanDaysRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addPublicWorkoutsPlanDaysRowsToDatabase:', error);
//              });
//              await addPublicWorkoutsPlansRowsToDatabase(userPublicWorkoutsPlansData).then((userPublicWorkoutsPlansData) => {
//                //////console.log('addPublicWorkoutsPlansRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addPublicWorkoutsPlansRowsToDatabase:', error);
//              });

//              await addTargetStatsRowsToDatabase(userTargetStatsData).then((userTargetStatsData) => {
//                //////console.log('addTargetStatsRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addTargetStatsRowsToDatabase:', error);
//              });
//              await addTodayMealsTableRowsToDatabase(userTodayMealsData).then((userTodayMealsData) => {
//                //////console.log('addTodayMealsTableRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addTodayMealsTableRowsToDatabase:', error);
//              });
//              await addWorkoutRowsToDatabase(userworkoutsData).then((userworkoutsData) => {
//                //////console.log('addWorkoutRowsToDatabase function done SUCCES :');
//              }).catch((error) => {
//                //////console.log('Error fetching addWorkoutRowsToDatabase:', error);
//              });
//              setIsTwoLoading(false);
//              } catch (error) {
//                //       
//                //////console.log('Error:', error);
//              }finally {
//                  setIsTwoLoading(false); // Hide activity indicator
//              }
//        }else{
//          Alert.alert('To Download your Data',
//          'You must be connected to the internet');
//        }
 
// }     
    const downloadDataForUser = async () => {

       
      
      if(triainerConnected){
        setIsTwoLoading(true); // Show activity indicator
        let counter = 0;
        try {
          axios.get('https://life-pf.com/api/downloadDataForDatabaseToTheApp', {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
              'Connection':"keep-alive",
            },
            })
            .then(response => {
              // Handle successful response
              //////console.log('userData::',response.data);
              //setOurPersonalTrainers(response.data["trainers"]);
              addPlansStartWorkoutRowsToDatabase(response.data["userBeginWorkoutsData"]).then((userBodyStatsAndMeasurementsData) => {
                //////console.log('addPlansStartWorkoutRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 1',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addPlansStartWorkoutRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addBodyStatsAndMeasurementsRowsToDatabase(response.data["userBodyStatsAndMeasurementsData"]).then((userBodyStatsAndMeasurementsData) => {
                //////console.log('addBodyStatsAndMeasurementsRowsToDatabase function done SUCCES :',userBodyStatsAndMeasurementsData);
                counter = counter +1;
                //////console.log('counter 2',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addBodyStatsAndMeasurementsRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addCalculatorsTableRowsToDatabase(response.data["userCalculatorsData"]).then((userCalculatorsData) => {
                //////console.log('addCalculatorsTableRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 3',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addCalculatorsTableRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addGymEquipmentsRowsToDatabase(response.data["userGymEquipmentsData"]).then((userGymEquipmentsData) => {
                //////console.log('addGymEquipmentsRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 4',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addGymEquipmentsRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addListOfFoodsTableRowsToDatabase(response.data["userListOfFoodsData"]).then((userListOfFoodsData) => {
                //////console.log('addListOfFoodsTableRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 5',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addListOfFoodsTableRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addPublicSettingsRowsToDatabase(response.data["userPublicSettingsData"]).then((userPublicSettingsData) => {
                //////console.log('addPublicSettingsRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 6',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addPublicSettingsRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addPublicWorkoutsPlanDaysRowsToDatabase(response.data["userPublicWorkoutsPlanDaysData"]).then((userPublicWorkoutsPlanDaysData) => {
                //////console.log('addPublicWorkoutsPlanDaysRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 7',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addPublicWorkoutsPlanDaysRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addPublicWorkoutsPlansRowsToDatabase(response.data["userPublicWorkoutsPlansData"]).then((userPublicWorkoutsPlansData) => {
                //////console.log('addPublicWorkoutsPlansRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 8',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addPublicWorkoutsPlansRowsToDatabase:', error);
                setIsTwoLoading(false);

              });

              addTargetStatsRowsToDatabase(response.data["userTargetStatsData"]).then((userTargetStatsData) => {
                //////console.log('addTargetStatsRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 9',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addTargetStatsRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addTodayMealsTableRowsToDatabase(response.data["userTodayMealsData"]).then((userTodayMealsData) => {
                //////console.log('addTodayMealsTableRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 10',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addTodayMealsTableRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
              addWorkoutRowsToDatabase(response.data["userworkoutsData"]).then((userworkoutsData) => {
                //////console.log('addWorkoutRowsToDatabase function done SUCCES :');
                counter = counter +1;
                //////console.log('counter 11',counter);
                if(counter == 11){
                  //////console.log('11 yes');
                  setIsTwoLoading(false);
                }
              }).catch((error) => {
                //////console.log('Error fetching addWorkoutRowsToDatabase:', error);
                setIsTwoLoading(false);

              });
            })
            .catch(error => {
              // Handle error
              //////console.log('Error fetching User data:', error);
              setIsTwoLoading(false);

            });
        } catch (error) {
          //       
          //////console.log('Error:', error);
        setIsTwoLoading(false);

        }
        }else{
          setIsTwoLoading(false);

          Alert.alert(`${t('To_Download_your_Data')}`,
          `${t('You_must_be_connected_to_the_internet')}`);
        }
  
}
    
  return (
    <PageContainer>
      {/* <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/home_App_Settings.png')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover> */}
          
       

            <Spacer size="large">
              <InputField >
              <FormLabelView>
                <FormLabel>{t('Take_Backup')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>makeBackupforTheData()}>
                  <CalendarFullSizePressableButtonText >{t('Upload_Your_Data')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                
                
              </FormInputView>
              </InputField>
            </Spacer>
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isLoading}
                    >
                    
                    <TouchableWithoutFeedback onPress={() => Alert.alert('', `${t('Do_you_want_to_close_the_loading_screen')}`, [
                    { text: `${t('Cancel')}`, style: 'cancel' },
                    { text: `${t('Yes')}`, onPress: () => setIsLoading(false) },
                  ])}>
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                      <View style={styles.loadingBox}>
                        <Text style={styles.loadingText}>Loading...</Text>
                        <Spinner size="large" color="#fff" />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Spacer size="medium">
              <InputField >
              <FormLabelView>
                <FormLabel>{t('Download_Data')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>downloadDataForUser()}>
                  <CalendarFullSizePressableButtonText >{t('Download_you_Data')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
          
              </FormInputView>
              </InputField>
            </Spacer>
              <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isTwoLoading}
                    >
                    
                 <TouchableWithoutFeedback onPress={() => Alert.alert('', `${t('Do_you_want_to_close_the_loading_screen')}`, [
                    { text: `${t('Cancel')}`, style: 'cancel' },
                    { text: `${t('Yes')}`, onPress: () => setIsTwoLoading(false) },
                  ])}>
                  <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                      <View style={styles.loadingBox}>
                        <Text style={styles.loadingText}>Loading...</Text>
                        <Spinner size="large" color="#fff" />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
            </Modal>
             <Spacer size="medium">
              <InputField >
              <FormLabelView>
                <FormLabel>{t('changeLngBtn')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} 
                onPress={async () =>{
                  //DevSettings.reload();
                  // RNRestart.Restart();
                  // i18n
                  //   .changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')
                  //   .then(() => {
                  //     ////console.log('i18n.language',i18n.language);
                  //     ////console.log('RNRestart',RNRestart)

                  //     if(i18n.language === 'ar'){
                  //       I18nManager.allowRTL(true);
                  //       I18nManager.forceRTL(true);
                  //       //DevSettings.reload();
                  //       //RNRestart.Restart();
                        
                  //     }else if(i18n.language === 'en'){
                  //       I18nManager.allowRTL(false);
                  //       I18nManager.forceRTL(false);
                  //       //DevSettings.reload();
                  //       //RNRestart.Restart();
                  //     }
                      
                  //   })
                  //   .catch(err => {
                  //     //////console.log('something went wrong while applying RTL');
                  //   });


                  const isSystemRTL = I18nManager.isRTL;

                  if (isSystemRTL) {
                    // Switch to LTR and English
                      I18nManager.allowRTL(false);
                      I18nManager.forceRTL(false);
                    ////console.log('I18nManager.isRTL if',I18nManager.isRTL);
                    // await AsyncStorage.setItem('pendingLanguage', 'en');
                    setTimeout(() => {
                      // i18n.changeLanguage('en');

                    RNRestart.Restart();
                    // DevSettings.reload();
                  }, 500);    
                  } else {
                    // Switch to RTL and Arabic
                      I18nManager.allowRTL(true);
                      I18nManager.forceRTL(true);
                    // I18nManager.swapLeftAndRightInRTL(true);
                    ////console.log('I18nManager.isRTL else',I18nManager.isRTL);

                    // await AsyncStorage.setItem('pendingLanguage', 'ar');
                    setTimeout(() => {
                      // i18n.changeLanguage('ar');

                    RNRestart.Restart();
                    // DevSettings.reload();
                  }, 500);    
                  }

                                
                  // Reload the app to apply changes

                }}>
                  <CalendarFullSizePressableButtonText >{t('changeLngBtn')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
          
              </FormInputView>
              </InputField>
            </Spacer> 
        {/* <Spacer size="large">
          <View style={{marginLeft:10,marginRight:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
              <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
          </View>
        </Spacer> */}
        <Spacer size="large"></Spacer>
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
    flex: 1,
    marginVertical: 30,
    // marginLeft:10,
    // marginRight:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  trainerPricingContainer:{
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
  },
  TraineFullNameText:{
    position:'absolute',
    left:"3%"
  },
  TrainerPricingCurrencyText:{
    position:'absolute',
    right:"22%"
  },
  TrainerPricingNumberText:{
    position:'absolute',
    left:"40%"
  },
  discountContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
  trainerPricingTextValues:{
    fontSize:14,
    color:"white",
    marginVertical: 15,
    flex: 1,
    },

  headerTrainerPricing:{
    flexDirection: 'row',
    justifyContent:'space-between',

  },
  headerTrainerPricingNumber:{
    position:'absolute',
    left:'41%',
  },
  headerTraineFullNameText:{ 
    position:'absolute',
  left:'5%',
},
  headerTrainerPricingCurrency:{
    position:'absolute',
    right:'16%',
  },

  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
  },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
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