import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';

import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  MenuItemPressableButton,
  MenuItemPressableImagedButton,
  MenuItemPressableButtonText,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
  SeparatorView,
  SeparatorViewSpacer,
  WhitePageContainer,
  BlackTitle,
} from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
import { useFocusEffect } from '@react-navigation/native';
// Context API
import AuthGlobal from "../Context/store/AuthGlobal";
import { setCurrentUser } from "../Context/actions/Auth.actions";

import { fetchUsers,getOneUser,deleteUsersTable } from "../../../../database/usersTable";
import {fetchTokens, getUserIdFromTokenId } from "../../../../database/tokensTable"; 
import {deleteStartWorkoutTable,clearStartWorkoutTable} from "../../../../database/start_workout_db"; 



import { fetchBodyStatsAndMeasurements, updateStatsAndMeasurementsRowsToSynced,getBodyStatsAndMeasurementsUnsyncedRows,deleteBodyStatsAndMeasurementsTable} from "../../../../database/B_S_and_measurements";
import { fetchTargetStats,getTargetStatsUnsyncedRows,updateTargetStatsRowsToSynced} from "../../../../database/target_stats";
import { deletePublicSettingsTable,fetchPublicSettings,getPublicSettingsUnsyncedRows,updatePublicSettingsRowsToSynced} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { fetchCalculatorsTable,getCalculatorsTableUnsyncedRows, updateCalculatorsRowsToSynced} from "../../../../database/calcaulatorsTable";
import { deleteGymEquipmentsTable,fetchGymEquipments,getGymEquipmentsUnsyncedRows,deleteGymEquipmentsRowsWithYes,updateGymEquipmentsRowsToSynced } from "../../../../database/gym_equipments_table";
import { fetchWorkoutsTable,deleteWorkoutsTable,clearWorkoutsTable } from "../../../../database/workoutsTable";
import { fetchPublicWorkoutsPlans,getPublicWorkoutsPlansUnsyncedRows,deletePublicWorkoutsPlansRowsWithYes,updatePublicWorkoutsPlansRowsToSynced } from "../../../../database/public_workouts_plans";
import { clearPublicWorkoutsPlanDaysTable,deletePublicWorkoutsPlanDaysTable,deletePublicWorkoutsPlanDaysRowsWithYes,getPublicWorkoutsPlanDaysUnsyncedRows,updatePublicWorkoutsPlanDaysRowsToSynced } from "../../../../database/public_workouts_plan_days";
import { deletePredefinedMealsTable,getPredefinedMealsUnsyncedRows,deletePredefinedMealsRowsWithYes,updatePredefinedMealsRowsToSynced} from "../../../../database/predefined_meals";
import { fetchAlltDaysListOfFoods,getListOfFoodsUnsyncedRows,deleteListOfFoodsRowsWithYes,updateListOfFoodsRowsToSynced,deleteListOfFoodsTable} from "../../../../database/list_of_foods";
import { getTodayMealsUnsyncedRows,deleteTodayMealsRowsWithYes,updateTodayMealsRowsToSynced} from "../../../../database/today_meals";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
    
import { Asset } from 'expo-asset';

const { width } = Dimensions.get('window');

export const OurServices = ({ navigation }) => {
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const context = useContext(AuthGlobal);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userIdNum, setUserIdNum] = useState('');
  const [userRow, setUserRow] = useState('');
  const [showGateway, setShowGateway] = useState(false);
  const {t} = useTranslation();//add this line
  const [workoutsDato,setWorkoutsDato]=useState([]);

  useFocusEffect(
    React.useCallback(() => {
      ///////////start exercise with timer normal page////////////
      const removestoredBackgroundTimeForStartExercisesWithTimerNormalPageOnRestart = async () => {
        // This function removes background time when the app is restarted after being closed
       const storedBackgroundTimeForStartExercisesWithTimerNormalPage = await AsyncStorage.getItem('backgroundTimeForMainTimer');

        if (storedBackgroundTimeForStartExercisesWithTimerNormalPage) {
          await AsyncStorage.removeItem('backgroundTimeForMainTimer');
            }
          };
      // Clear background time when app starts (after being killed)
      removestoredBackgroundTimeForStartExercisesWithTimerNormalPageOnRestart();

      ///////////start exercise with timer TrainerTrainee page////////////

      const removestoredBackgroundTimeForStartExercisesWithTimerTrainerTraineePageOnRestart = async () => {
        // This function removes background time when the app is restarted after being closed
       const storedBackgroundTimeForStartExercisesWithTimerTrainerTraineePage = await AsyncStorage.getItem('trainerTraineeBackgroundTimeForMainTimer');

        if (storedBackgroundTimeForStartExercisesWithTimerTrainerTraineePage) {
          await AsyncStorage.removeItem('trainerTraineeBackgroundTimeForMainTimer');
            }
          };
      // Clear background time when app starts (after being killed)
      removestoredBackgroundTimeForStartExercisesWithTimerTrainerTraineePageOnRestart();
      




      ///////////start exercise with green timer normal page////////////
      const removestoredBackgroundTimeForStartExercisesWithGreenTimerNormalPageOnRestart = async () => {
        // This function removes background time when the app is restarted after being closed
       const storedBackgroundTimeForStartExercisesWithTimerNormalPage = await AsyncStorage.getItem('backgroundTimeForGreenTimer');

        if (storedBackgroundTimeForStartExercisesWithTimerNormalPage) {
          await AsyncStorage.removeItem('backgroundTimeForGreenTimer');
            }
          };
      // Clear background time when app starts (after being killed)
      removestoredBackgroundTimeForStartExercisesWithGreenTimerNormalPageOnRestart();

      ///////////start exercise with timer TrainerTrainee page////////////
///////////start exercise with green timer normal page////////////
const removestoredBackgroundTimeForStartExercisesWithGreenTimerOnRestartForTrainerTraineePage = async () => {
  // This function removes background time when the app is restarted after being closed
 const storedBackgroundTimeForStartExercisesWithTimerNormalPage = await AsyncStorage.getItem('TrainerTraineeBackgroundTimeForGreenTimer');

  if (storedBackgroundTimeForStartExercisesWithTimerNormalPage) {
    await AsyncStorage.removeItem('TrainerTraineeBackgroundTimeForGreenTimer');
      }
    };
// Clear background time when app starts (after being killed)
removestoredBackgroundTimeForStartExercisesWithGreenTimerOnRestartForTrainerTraineePage();

///////////start exercise with timer TrainerTrainee page////////////

      // Fetch the latest data or update the state here
      // deletePublicSettingsTable().then((users) => {
      //   //console.log('deletePublicSettingsTable deleted table :', users);
      // }).catch((error) => {
      //   //console.error('Error fetching users:', error);
      // });
    //   fetchTokens().then((tokens) => {
    //       ////console.log('Tokens table :', tokens);
    //     }).catch((error) => {
    //       //console.error('Error fetching Tokens:', error);
    //     });
    fetchUsers().then((users) => {
      console.log('Users table :', users);
      }).catch((error) => {
        //console.error('Error fetching users:', error);
      });
      AsyncStorage.getItem('workoutsDataImported').then((workoutsDataImported) => {
        ////console.log('workoutsDataImported SUCCES :', workoutsDataImported);
      }).catch((error) => {
        //console.error('Error fetching workoutsDataImported:', error);
      });
      AsyncStorage.getItem("sanctum_token")
    .then((res) => {
    AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        setUserIdNum(storedUser.id);
        ////console.log('OurServices user',storedUser);
        setUserRow(storedUser);
        // fetchPublicWorkoutsPlans(storedUser.id).then((publicWpTable) => {
        //   ////console.log('fetchPublicWorkoutsPlans table :', publicWpTable);
        // }).catch((error) => {
        //   //console.error('Error fetching fetchPublicWorkoutsPlans:', error);
        // });
       
        // deleteStartWorkoutTable().then(() => {
        //   console.log('deleteStartWorkoutTable :',);
        //   }).catch((error) => {
        //   console.error('Error fetching deleteStartWorkoutTable:', error);
        //   });
        // AsyncStorage.removeItem('workoutsDataImported');
        // AsyncStorage.removeItem('mealsDataImported');
        // deleteWorkoutsTable().then(() => {
        //   console.log('deleteWorkoutsTable :',);
        //   }).catch((error) => {
        //   //console.error('Error fetching deleteWorkoutsTable:', error);
        //   });
        //   AsyncStorage.removeItem('workoutsDataImported')
        //   deletePredefinedMealsTable().then(() => {
        //     console.log('deletePredefinedMealsTable :',);
        //     }).catch((error) => {
        //     //console.error('Error fetching deleteWorkoutsTable:', error);
        //     });
  
        //   fetchWorkoutsTable(storedUser.id).then((WorkoutsResults) => {
        //   // setFetchedData(WResults);
          
        //   ////console.log('fetchWorkoutsTable:', WorkoutsResults);
        //     }).catch((error) => {
        //     //////console.log('Error fetching WorkoutsResults:', error);
        // });
        fetchGymEquipments(storedUser.id).then((GEResults) => {
            ////console.log('Gym Facilites Table :',GEResults);
            }).catch((error) => {
            //console.error('Error fetching CalculatorsTable:', error);
            });
       
                  
        
        })
        
    });
   
    }, [AsyncStorage,getUserIdFromTokenId,fetchUsers, fetchPublicSettings,getPublicSettingsUnsyncedRows,updatePublicSettingsRowsToSynced])
  );
  // useEffect(() => {
  //   // Call the init function when the component mounts (i.e., when the app starts)
  //   console.log("context.stateUser ourservices",context.stateUser);

  // }, [context]);





////console.log('userRow.athRol',userRow.athRol);
if(userRow.athRol){
  ////console.log('yees');
}



















  return (
    <WhitePageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <BlackTitle >Life</BlackTitle>
                </TitleView>
                {/* <Video
                    ref={video}
                    style={styles.video}
                    source={{uri:`${workoutsDato[0]?.wktMda}`}}                           
                    useNativeControls
                    resizeMode="stretch"
                    isLooping
                    onPlaybackStatusUpdate={status => {setStatus(() => status);
                    
                    }}
                    onLoad={() => {video.current.playAsync();}}
                /> */}
                <View style={styles.RowTwoItemscontainerTwo}>
                  <View style={styles.viewContainer} >

                    <MenuItemPressableImagedButton
                        onPress={() => {
                            navigation.navigate("MixBodyAndTargetStats");
                            updateSelectedDate('');
                            }}
                        >
                          <Image
                            source={require('../../../../assets/home_Body_Status_and_Measurements.jpg')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("body_and_target_measurements")}</Text>
                          </View>
                    </MenuItemPressableImagedButton>
                    </View>
                    {/* <View style={styles.viewContainer} >

                    
                    <MenuItemPressableImagedButton
                        onPress={() => {
                        navigation.navigate("TargetStats");
                        updateSelectedDate('');
                        }}
                        >
                          <Image
                            source={require('../../../../assets/home_Body_Status_and_Measurements.jpg')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("Target_Stats")}</Text>
                          </View>
                    </MenuItemPressableImagedButton>
                    </View> */}

                  <View style={styles.viewContainer} >
                      <MenuItemPressableImagedButton
                      onPress={() => {
                          navigation.navigate("Calculator");
                          updateSelectedDate('');
                      }}
                      >
                          
                          
                            <Image
                              source={require('../../../../assets/home_Calculators.jpg')} // Replace with your image URL
                              style={styles.image}
                            />
                            <View style={styles.overlay}>
                              <Text style={styles.overlayText}>{t("Calculators")}</Text>
                            </View>
                            
                      </MenuItemPressableImagedButton>
                  </View>
                  {/* <View style={styles.viewContainer} >
                  <MenuItemPressableImagedButton
                      onPress={() => {
                          navigation.navigate("WorkoutPlan");
                          updateSelectedDate('');
                          }}
                      >
                      
                        <Image
                          source={require('../../../../assets/home_Workout_Plan.jpg')} // Replace with your image URL
                          style={styles.image}
                        />
                        <View style={styles.overlay}>
                          <Text style={styles.overlayText}>{t("Workout_Plan")}</Text>
                        </View>
                      
                  </MenuItemPressableImagedButton>
                  </View>
                
                <View style={styles.viewContainer} >
                <MenuItemPressableImagedButton
                    onPress={() => {
                    navigation.navigate("MealPlan");
                    updateSelectedDate('');
                    }}
                    >
                    
                    
                      <Image
                        source={require('../../../../assets/home_Meal_Plan.jpg')} // Replace with your image URL
                        style={styles.image}
                      />
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>{t("Meal_Plan")}</Text>
                      </View>
                    
                </MenuItemPressableImagedButton>
                </View> */}
                
                {/* <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("Analysis");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="chart-bar" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >{t("Analysis")}</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                 */}
                 <View style={styles.viewContainer} >
                    <MenuItemPressableImagedButton
                    onPress={() => {
                        navigation.navigate("CurrentPersonalTrainer");
                        updateSelectedDate('');
                    }}
                    >
                        
                        
                          <Image
                            source={require('../../../../assets/home_Personal_Trainer.png')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("Personal_Trainer")}</Text>
                          </View>
                         
                    </MenuItemPressableImagedButton>
                </View> 
                 <View style={styles.viewContainer} >
                    <MenuItemPressableImagedButton
                    onPress={() => {
                        navigation.navigate('MixDataHandlingAndWorkoutSettings');
                        updateSelectedDate('');
                    }}
                    >
                        
                        
                          <Image
                            source={require('../../../../assets/home_App_Settings.png')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("App_settings")}</Text>
                          </View>
                        
                    </MenuItemPressableImagedButton>
                </View>
                 <View style={styles.viewContainer} >
                <MenuItemPressableImagedButton
                    onPress={() => {
                    navigation.navigate("Analysis");
                    updateSelectedDate('');
                    }}
                    >
                    
                    
                      <Image
                        source={require('../../../../assets/home_Analysis.jpg')} // Replace with your image URL
                        style={styles.image}
                      />
                      <View style={styles.overlay}>
                        <Text style={styles.overlayText}>{t("Analysis")}</Text>
                      </View>
                    
                </MenuItemPressableImagedButton>
                </View>
                 
                
                {/* <View style={styles.viewContainer} >
                    <MenuItemPressableImagedButton
                    onPress={() => {
                        navigation.navigate('PersonalTrainerSearch');
                        updateSelectedDate('');
                    }}
                    >
                        
                        
                          <Image
                            source={require('../../../../assets/home_Personal_Trainer_Search.png')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("Personal_Trainer_Search")}</Text>
                          </View>
                        
                    </MenuItemPressableImagedButton>
                  </View>    */}
                  <View style={styles.viewContainer} >
                    <MenuItemPressableImagedButton
                    onPress={() => {
                        navigation.navigate('AdsPage');
                        updateSelectedDate('');
                    }}
                    >
                        
                        
                          <Image
                            source={require('../../../../assets/coming_soon.jpeg')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("Ads")}</Text>
                          </View>
                        
                    </MenuItemPressableImagedButton>
                </View>
                {
                    (userRow?.role == 'Trainer')?(
                    <>
                    <View style={styles.viewContainer} >
                        <MenuItemPressableImagedButton
                        onPress={() => {
                            navigation.navigate('TrainerClients');
                            updateSelectedDate('');
                        }}
                        >
                            
                            
                              <Image
                                source={require('../../../../assets/trainer_trainees_section.jpeg')}// Replace with your image URL
                                style={styles.image}
                              />
                              <View style={styles.overlay}>
                                <Text style={styles.overlayText}>{t("My_Clients")}</Text>
                              </View>
                            
                        </MenuItemPressableImagedButton>
                      </View>
                    <View style={styles.viewContainer} >
                        <MenuItemPressableImagedButton
                        onPress={() => {
                            navigation.navigate('TrainerAccountWallet');
                            updateSelectedDate('');
                        }}
                        >
                            
                            
                              <Image
                                source={require('../../../../assets/my_wallet_section.jpeg')} // Replace with your image URL
                                style={styles.image}
                              />
                              <View style={styles.overlay}>
                                <Text style={styles.overlayText}>{t("my_Wallet")}</Text>
                              </View>
                            
                        </MenuItemPressableImagedButton>
                    </View>  
                    </>
                    ):(null)
                  }
                  {(userRow?.athRol == 'admin')?(
                    <>
                    
                    <View style={styles.viewContainer} >
                        <MenuItemPressableImagedButton
                        onPress={() => {
                            navigation.navigate('AdminPayToTrainerPage');
                            updateSelectedDate('');
                        }}
                        >
                          
                            
                              <Image
                                source={require('../../../../assets/gym-workout.png')} // Replace with your image URL
                                style={styles.image}
                              />
                              <View style={styles.overlay}>
                                <Text style={styles.overlayText}>{t("Admin_Wallet")}</Text>
                              
                            </View>  
                        </MenuItemPressableImagedButton>
                    </View>

                    <View style={styles.viewContainer} >
                        <MenuItemPressableImagedButton
                        onPress={() => {
                            navigation.navigate('AdminSettingsApp');
                            updateSelectedDate('');
                        }}
                        >
                          
                            
                              <Image
                                source={require('../../../../assets/home_App_Settings.png')} // Replace with your image URL
                                style={styles.image}
                              />
                              <View style={styles.overlay}>
                                <Text style={styles.overlayText}>{t("AdminSettingsApp")}</Text>
                              
                            </View>  
                        </MenuItemPressableImagedButton>
                    </View>

                    </>
                  ):(null)}
                  
                
               
                
                <View style={styles.viewContainer} >
                    <MenuItemPressableImagedButton
                    onPress={() => {
                        navigation.navigate('SignoutPage');
                        updateSelectedDate('');
                    }}
                    >
                        
                        
                          <Image
                            source={require('../../../../assets/home_Signout.png')} // Replace with your image URL
                            style={styles.image}
                          />
                          <View style={styles.overlay}>
                            <Text style={styles.overlayText}>{t("Signout_Page")}</Text>
                          </View>
                        
                    </MenuItemPressableImagedButton>
                </View>
                
                </View>  
              <SeparatorViewSpacer/>
                    
            </AccountBackground>
        </ScrollView>
    </WhitePageContainer>
  );
};
const styles = StyleSheet.create({
  RowTwoItemscontainer: {
    width:"100%",
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  RowTwoItemscontainerTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,

  },
  viewContainer: {
    width: width / 2 - 15, // Half the screen width minus padding
    height: 150, // Adjust as needed
    marginBottom: 10,
    position: 'relative',
  },
 
  image: {
    width: '100%',
    height: '100%',
    borderRadius:30,

  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: '5%', // Adjust as needed for spacing from the left edge
    borderRadius:30,

  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    // width: '80%', // Ensures text stays within the left 30% of the image
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Dark shadow
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 10, // Shadow blur
    textAlign:"center"
  },
    WorkoutNametabContainer: {
      width:"100%",
      backgroundColor:"#455357"
    }, 
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width:"100%",
      height:780,
      backgroundColor:"#455357"
    },
    playIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: -25, // Adjust this based on your play icon size
      marginTop: -25, // Adjust this based on your play icon size
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 350,
      height: 250,
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });