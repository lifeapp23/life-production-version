import React, { useState,useEffect } from 'react';
import {StyleSheet,Text,ScrollView,View,Modal} from "react-native";
import { DataTable } from 'react-native-paper';
import { TodayMealsCalendar } from "./today_meals_calendar";
import {BarChart} from 'react-native-gifted-charts';
import { Spinner } from '@ui-kitten/components';
import axios from 'axios';

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
  DataTableTitleKey, 
    DataTableCellValue,
    DataTableTitleKeyText,
    DataTableCellValueText,
    ViewOverlay,
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
import { Spacer } from "../../../components/spacer/spacer.component";
import "./i18n";
import { useTranslation } from 'react-i18next';

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAlltDaysTodayMeals,fetchTodayMealForCalendar,insertPlansTodayMeals,SoftDeleteTodayMeal} from "../../../../database/today_meals";
import { fetchCalculatorsTable,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";
import { addEventListener } from "@react-native-community/netinfo";

  
export const MealPlanScreen = ({navigation}) => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [views, setViews] = useState([]);
  const [userId, setUserId] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0); 
  const [currentAllMealsArray, setCurrentAllMealsArray] = useState([]);
  const [macroCalTableLastInsertedRow,setMacroCalTableLastInsertedRow] = useState({});
  const [traineeData, setTraineeData] = useState({}); 
  const { t, i18n } = useTranslation();
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [allUserWorkedMealsFromDB,setAllUserWorkedMealsFromDB] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
// Check the current language
const isArabic = i18n.language === 'ar';

  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
    AsyncStorage.getItem("currentUser").then((user) => {

        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
        ////current from offline database
        
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          //setTriainerConnected(state.isConnected);
        if(state.isConnected){
          ////console.log('---------------now online--------')
          axios.get('https://www.elementdevelops.com/api/get-trainee-side-data', {
            headers: {
              'Authorization': `Bearer ${res}`,
              'Content-Type': 'application/json',
            },
            })
            .then(response => {
              // Handle successful response
            console.log('trainee::',response.data?.['TraineesData']?.[0]);
              
             
              setTraineeData(response.data?.['TraineesData']?.[0]);
              let  traineeDataLet= response.data?.['TraineesData']?.[0];
              if (traineeDataLet) {
                const today = new Date();
    
                if (traineeDataLet?.strDat && traineeDataLet?.endDat) {
                const strDat = new Date(traineeDataLet?.strDat);
                const endDat = new Date(traineeDataLet?.endDat);
    
                // Check if today is between `strDat` and `endDat`
                if (today >= strDat && today <= endDat) {
                  axios.get(`https://www.elementdevelops.com/api/fetch-all-performed-meals`, {
                    params: {
                      traineeId: traineeDataLet?.trneId,
                      trainerId: traineeDataLet?.trnrId
                    },
                    headers: {
                      'Authorization': `Bearer ${res}`,
                      'Content-Type': 'application/json',
                    },
                  })
                  .then(response => {
                   
                    const allPerformedMealsRows = response?.data?.allPerformedMealsRows;
                    console.log('allPerformedWorkoutRows meal plan page normal:', allPerformedMealsRows);
                  
                    setAllUserWorkedMealsFromDB(allPerformedMealsRows);
                  
                  })
                  .catch(error => {
                    setLoadingPageInfo(false);

                    // Handle error
                    ////console.log('Error fetching all performed Meals:', error);
                  });

                  axios.get(`https://www.elementdevelops.com/api/get-trainer-trainee-last-required-macros?trneId=${traineeDataLet?.trneId}&trnrId=${traineeDataLet?.trnrId}`, {
                    headers: {
                      'Authorization': `Bearer ${res}`,
                      'Content-Type': 'application/json',
                    },
                    })
                    .then(response => {
                      
                      console.log("lastTrainerTraineeRequiredMacros", response?.data["lastTrainerTraineeRequiredMacros"]);
                      // setPlansWithItsDays(response?.data?.["TrainerPredefinedPlansWithItsDays"] || []);
                      // setPublicWorkoutsPlanDaysTable(response?.data?.["TrainerPredefinedPlansWithItsDays"]);
            
                      // TrainerPredefinedPlansWithItsDays [{"endDat": null, "id": 2, "plan_days": [[Object], [Object]], "plnNam": "plan one", "speKey": "11.1727965942532", "strDat": 
                        // null, "trnrId": 11}, {"endDat": null, "id": 3, "plan_days": [[Object], [Object]], "plnNam": "plan two", "speKey": "11.1728213378492", "strDat": null, "trnrId": 11}]
                        if(Object.keys(response?.data["lastTrainerTraineeRequiredMacros"]).length > 0){
                          let lastTrainerTraineeRequiredMacros =response?.data["lastTrainerTraineeRequiredMacros"];
                          // Convert all number-like strings to actual numbers
                            Object.keys(lastTrainerTraineeRequiredMacros).forEach(key => {
                              const value = lastTrainerTraineeRequiredMacros[key];
                              // Check if the value is a string and can be converted to a number
                              if (typeof value === "string" && !isNaN(value)) {
                                lastTrainerTraineeRequiredMacros[key] = parseFloat(value);
                              }
                            });

                          setMacroCalTableLastInsertedRow(lastTrainerTraineeRequiredMacros);

    
                        }
                        setLoadingPageInfo(false);
    
                        
                    })
                    .catch(error => {
                      setLoadingPageInfo(false);
    
                      // Handle error
                      ////console.log('Error fetching Days:', error);
                    });

                    const todayDay =new Date().toISOString().split('T')[0];
                      axios.get(`https://www.elementdevelops.com/api/get-Trainer-Trainee-Today-Meals-For-Today-For-Meal-Plan-Normal-Page-With-Charts?traineeId=${traineeDataLet?.trneId}&trainerId=${traineeDataLet?.trnrId}&todDay=${todayDay}`, {
                      headers: {
                        'Authorization': `Bearer ${res}`,
                        'Content-Type': 'application/json',
                      },
                      })
                      .then(response => {
                        setLoadingPageInfo(false);

                          console.log('today meals into nor meal plan page response?.data["getTraineeTodayMeals"]',response?.data["getTraineeTodayMeals"]);
                          if(response?.data["getTraineeTodayMeals"]?.length > 0){

                          function processTrainerPlanMealCalendar(data) {
                          const result = [];
                      
                          data.forEach(item => {
                              // Extract the necessary keys
                              const { planId, todDay, trneId, trnrId, dayNam, id, malAry } = item;
                      
                              // Parse malAry
                              let mealsArray = [];
                              try {
                                  mealsArray = JSON.parse(malAry);
                              } catch (error) {
                                  console.error('Error parsing malAry:', error);
                                  return; // Skip this item if malAry parsing fails
                              }
                      
                              // Add additional keys to each meal
                              mealsArray = mealsArray.map(meal => ({
                                  ...meal,
                                  planId,
                                  todDay,
                                  trneId,
                                  trnrId,
                                  dayNam,
                                  id
                              }));
                      
                              // Add the processed meals to the result
                              result.push(...mealsArray);
                          });
                      
                          return result;
                      } 

                      let processedDataFromLaravelDb = processTrainerPlanMealCalendar(response?.data["getTraineeTodayMeals"]);
                      console.log('today meals into nor meal plan page processedDataFromLaravelDb',processedDataFromLaravelDb);
                      setCurrentAllMealsArray(processedDataFromLaravelDb);

                        
                        }
                      })
                      .catch(error => {
                        setLoadingPageInfo(false);

                      });
                } else{
                  fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
                    setCurrentAllMealsArray(TMResults);
                    setLoadingPageInfo(false);

                    ////console.log('Current TodayMealsTable:', TMResults);
                      }).catch((error) => {
                        setLoadingPageInfo(false);

                      ////console.log('Error fetching Current TodayMealsTable:', error);
                  });
                  ////required from offline database
                  fetchCalculatorsTableLastInsertedRow(storedUser?.id,"macroCal").then((macroCalResults) => {
                    ////console.log('Required MacroLastTable:', macroCalResults);
                    setMacroCalTableLastInsertedRow(macroCalResults);
                    setLoadingPageInfo(false);

                  });
                }
              } else{
                fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
                  setCurrentAllMealsArray(TMResults);
                  setLoadingPageInfo(false);

                  ////console.log('Current TodayMealsTable:', TMResults);
                    }).catch((error) => {
                      setLoadingPageInfo(false);

                    ////console.log('Error fetching Current TodayMealsTable:', error);
                });
                ////required from offline database
                fetchCalculatorsTableLastInsertedRow(storedUser?.id,"macroCal").then((macroCalResults) => {
                  ////console.log('Required MacroLastTable:', macroCalResults);
                  setMacroCalTableLastInsertedRow(macroCalResults);
                  setLoadingPageInfo(false);

                });
              }

            }else{
              fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
                setCurrentAllMealsArray(TMResults);
                setLoadingPageInfo(false);

                ////console.log('Current TodayMealsTable:', TMResults);
                  }).catch((error) => {
                    setLoadingPageInfo(false);

                  ////console.log('Error fetching Current TodayMealsTable:', error);
              });
              ////required from offline database
              fetchCalculatorsTableLastInsertedRow(storedUser?.id,"macroCal").then((macroCalResults) => {
                ////console.log('Required MacroLastTable:', macroCalResults);
                setMacroCalTableLastInsertedRow(macroCalResults);
                setLoadingPageInfo(false);

              });
            }
            setLoadingPageInfo(false);

            })
            .catch(error => {
              setLoadingPageInfo(false);

              // Handle error
              ////console.log('Error fetching Trainee:', error);
            });

            


        }else{
          ////console.log('else no internet ahmed');
          setLoadingPageInfo(false);
          const timer = setTimeout(() => {

          Alert.alert(' ',
          'Please Connect to the internet To see the Trainees',
          [
            {
              text: 'OK',
              onPress: () => {
               
              },
            },
          ],
          { cancelable: false }
        );
      }, 500); // 2 seconds

        }
      });
        
        // Unsubscribe
        unsubscribe();

        const timer = setTimeout(() => {
          setLoadingPageInfo(false);
        }, 3000); // 2 seconds
      
      
      })
        
    });
   
  
}, [fetchAlltDaysTodayMeals])
);
  const updateTotalValues = () => {
    // Initialize totals based on existing data
    const initialTotalCalories = currentAllMealsArray.reduce((total, meal) => total + (parseFloat((meal.calris)) || 0), 0);
    const initialTotalProtein = currentAllMealsArray.reduce((total, meal) => total + (parseFloat((meal.protin)) || 0), 0);
    const initialTotalCarbs = currentAllMealsArray.reduce((total, meal) => total + (parseFloat((meal.carbs)) || 0), 0);
    const initialTotalFats = currentAllMealsArray.reduce((total, meal) => total + (parseFloat((meal.fats)) || 0), 0);

    // Update state with initial values
    setTotalCalories(initialTotalCalories);
    setTotalProtein(initialTotalProtein);
    setTotalCarbs(initialTotalCarbs);
    setTotalFats(initialTotalFats);
  };

  useEffect(() => {
    // Update totals when the component mounts
    updateTotalValues();
  }, [currentAllMealsArray]);
  const predefinedMealsNavigation = () => {
    navigation.navigate('PredefinedMeals');
  };
  const handleOpenCalendar = () => {
    setCalendarVisible(true);
    setSelectedDates({});
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
    setSelectedDates({});
  };

  // const handleSelectDateRange = (start, end) => {
  //   // Check if the selected end date is before the start date
  //   if (end < start) {
  //     // Swap the dates if needed
  //     const temp = start;
  //     start = end;
  //     end = temp;
  //   }
  //   setViews((prevViews) => [
  //     ...prevViews,
  //     { id: prevViews.length + 1, startDate: start, endDate: end },
  //   ]);
  //   handleCloseCalendar();
  // };

  // const handlePlanPress = (viewId) => {
  //   // Navigate to the page with the name written on the button as the title
  //   // Replace the following line with the navigation logic you are using
  //   navigation.navigate('PlanNumber', {
  //     PlanNumberVariable: viewId,
  //   });
  // };


  MealValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const MealsNames = [
    { 1: `${t('Current')}`, 2: `${t('Required')}` },
  ];
  
  const barData = [
    {
      value: parseFloat(totalProtein?.toFixed(4)) || 0,
      label: `${t("short_Protein")}`,
      spacing: 5,
      labelWidth: 30,
      labelTextStyle: {color:'white',position:'absolute',left:isArabic ? 4 : 0,fontSize:10},
      frontColor: '#177AD5',
    },
    {value: parseFloat(macroCalTableLastInsertedRow?.protin?.toFixed(4)) || 0,spacing: 18, frontColor: '#ED6665'},
    {
      value: parseFloat(totalCarbs?.toFixed(4)) || 0,
      label: `${t("short_Carbs")}`,
      spacing: 5,
      labelWidth: 30,
      labelTextStyle: {color: 'white',position:'absolute',fontSize:10,left:isArabic ? 0 : -4},
      frontColor: '#177AD5',
    },
    {value: parseFloat(macroCalTableLastInsertedRow?.carbs?.toFixed(4)) || 0, frontColor: '#ED6665',spacing: isArabic ? 16 : 16},
    {
      value: parseFloat(totalFats?.toFixed(4)) || 0,
      label: `${t("short_Fats")}`,
      spacing: 5,
      labelWidth: 20,
      labelTextStyle: {color: 'white',position:'absolute',fontSize:10,left:isArabic ? -2:0},
      frontColor: '#177AD5',
    },
    {value: parseFloat(macroCalTableLastInsertedRow?.fats?.toFixed(4)) || 0, frontColor: '#ED6665'} 
  ];
  
  const barCaloriesData = [
    {
      value: parseFloat(totalCalories?.toFixed(4)) || 0,
      label: `${t("Calories")}`,
      spacing: 5,
      labelWidth: isArabic ? 90 : 40,
      labelTextStyle: {color:'white',position:'absolute',left:isArabic ? -18 : -5,fontSize:10},
      frontColor: '#177AD5',
    },
    {value: parseFloat(macroCalTableLastInsertedRow?.calris?.toFixed(4)) || 0,spacing: 30, frontColor: '#ED6665'},
  ];
  const renderTitle = () => {
    return(
      <View style={{marginVertical: 10}}>
      <Text
        style={{
          color: 'white',
          fontSize: 12,
          fontFamily:"OpenSans_400Regular",
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        {t("three_elements_chart")} 
      </Text>
      
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 4,
              marginTop:-2,
            }}
          />
          <Text
            style={{
              width: 30,
              height: 14,
              color: 'lightgray',
              fontSize:8,
              fontFamily:"OpenSans_400Regular",
            }}>
            {MealsNames[0][1]}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 4,
              marginTop:-2,
            }}
          />
          <Text
            style={{
              width: 30,
              height: 14,
              color: 'lightgray',
              fontSize:8,
              fontFamily:"OpenSans_400Regular",
            }}>
            {MealsNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderCaloriesTitle = () => {
    return(
      <View style={{marginVertical: 10,}}>
      <Text
        style={{
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
          fontFamily:"OpenSans_400Regular",
          textAlign: 'center',
        }}>
        {t("Total_Vs_required_Calories")}
      </Text>
      
      <View
        style={{
          flexDirection: 'row',
          marginTop: 4,
          height:34,
          marginLeft:10
        }}>
        <View style={{flex:1,justifyContent:"center",flexDirection: 'row', alignItems: 'center',width: 75,
              height: 16,}}>
           <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 4,
              marginTop:-2,
            }}
          />
          <Text
            style={{
              width: 30,
              height: 14,
              color: 'lightgray',
              fontSize:8,
              fontFamily:"OpenSans_400Regular",
            }}>
            {MealsNames[0][1]}
          </Text>
        </View>
        <View style={{flex:1,justifyContent:"center",flexDirection: 'row', alignItems: 'center',width: 75,
              height: 16,}}>          
           <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 4,
              marginTop:-2,
            }}
          />
          <Text
            style={{
              width: 30,
              height: 14,
              color: 'lightgray',
              fontSize:8,
              fontFamily:"OpenSans_400Regular",
            }}>
            {MealsNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
//three elements max
  const [modalVisible, setModalVisible] = useState(false);
  const numberPro = parseFloat(macroCalTableLastInsertedRow?.protin?.toFixed(4)) || 0;
  const numberCarbs =  parseFloat(macroCalTableLastInsertedRow?.carbs?.toFixed(4)) || 0;
  const numberFat = parseFloat(macroCalTableLastInsertedRow?.fats?.toFixed(4)) || 0;
  const numberTotalProtein =parseFloat(totalProtein?.toFixed(4)) || 0;
  const numberTotalCarbs =parseFloat(totalCarbs?.toFixed(4)) || 0;
  const numberTootalFats =parseFloat(totalFats?.toFixed(4)) || 0;
  const maxNumber = parseFloat(Math.max(numberPro,numberTotalProtein, numberCarbs,numberTotalCarbs, numberFat,numberTootalFats));

  const newMaxNumber = (maxNumber > 0) ? (maxNumber) : (10);
  ////console.log('numberPro',numberPro,'numberCarbs',numberCarbs,"numberFat",numberFat,",numberTotalProtein",numberTotalProtein,"numberTotalCarbs",numberTotalCarbs,"numberTootalFats",numberTootalFats);
////console.log('maxNumber',maxNumber);
//calories
const numberTotalCalories = parseFloat(totalCalories?.toFixed(4)) || 0;
const numbercalris = parseFloat(macroCalTableLastInsertedRow?.calris?.toFixed(4)) || 0;
const maxCaloriesNumber = parseFloat(Math.max(numbercalris,numberTotalCalories));

const newMaxCaloriesNumber = (maxCaloriesNumber > 0) ? (maxCaloriesNumber) : (10);
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t("Meal_Plan")}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                  <ServiceInfoParentView >
                    {showInfo ? (
                      <ServiceCloseInfoButtonView>
                        <ServiceCloseInfoButton onPress={toggleInfo}>
                          <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                        </ServiceCloseInfoButton>
                        <ServiceCloseInfoButtonTextView>
                          <ServiceCloseInfoButtonText>{t("meal_plan_desc")}</ServiceCloseInfoButtonText>
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
            <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}

                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
            </Modal>
            <Spacer size="medium"/>
            <View style={styles.container}> 
                <View>
                    <View style={{flexDirection:'row',justifyContent: 'space-evenly',}}>
                      <View
                        style={{
                          backgroundColor: 'black',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:165,
                          marginRight:18,
                        }}>
                        {renderTitle()}
                        <BarChart
                          data={barData}
                          barWidth={5}
                          spacing={isArabic ? 50 : 20}
                          initialSpacing={10}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'white'}}
                          noOfSections={3}
                          maxValue={newMaxNumber}
                          height={90}
                          width={150}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: 'black',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:180,
                        }}>
                        {renderCaloriesTitle()}
                        <BarChart
                          data={barCaloriesData}
                          barWidth={5}
                          spacing={4}
                          initialSpacing={30}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'white'}}
                          noOfSections={3}
                          maxValue={newMaxCaloriesNumber}
                          height={58}
                          width={80}
                        />
                      </View>
                    </View>
                  </View>
              <Spacer size="medium">
                <View>
                  <DataTable style={{width:"100%",flexDirection:'row',justifyContent:'center',marginTop:10,marginBottom:20}}>
                      <DataTable style={{width:"30%"}}>
                        <DataTable.Header>
                            <DataTableTitleKey ><DataTableTitleKeyText style={{fontSize:15}}>{t("Macro")}</DataTableTitleKeyText></DataTableTitleKey>
                        </DataTable.Header>
                        <DataTable.Row><DataTableCellValue ><DataTableTitleKeyText style={{fontSize:15}}>{t("Protein")}</DataTableTitleKeyText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableTitleKeyText style={{fontSize:15}}>{t("Carbs")}</DataTableTitleKeyText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableTitleKeyText style={{fontSize:15}}>{t("Fats")}</DataTableTitleKeyText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableTitleKeyText style={{fontSize:15}}>{t("Calories")}</DataTableTitleKeyText></DataTableCellValue></DataTable.Row>
                      </DataTable>
                      <DataTable style={{width:"30%"}}>
                        <DataTable.Header>
                          <DataTableTitleKey ><DataTableTitleKeyText style={{fontSize:15}}>{t("Current")}</DataTableTitleKeyText></DataTableTitleKey>
                        </DataTable.Header>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat(totalProtein?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat(totalCarbs?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat(totalFats?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat(totalCalories?.toFixed(2)) || 0} {t("cal")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                      </DataTable>
                      <DataTable style={{width:"30%"}}>
                        <DataTable.Header>
                          <DataTableTitleKey ><DataTableTitleKeyText  style={{fontSize:15}}>{t("Required")}</DataTableTitleKeyText></DataTableTitleKey>
                        </DataTable.Header>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat((macroCalTableLastInsertedRow?.protin)?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat((macroCalTableLastInsertedRow?.carbs)?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat((macroCalTableLastInsertedRow?.fats)?.toFixed(2)) || 0} {t("g")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                        <DataTable.Row><DataTableCellValue ><DataTableCellValueText style={{fontSize:12}}>{parseFloat(macroCalTableLastInsertedRow?.calris?.toFixed(2)) || 0} {t("cal")}</DataTableCellValueText></DataTableCellValue></DataTable.Row>
                      </DataTable>
                            
                    </DataTable>
                </View>
              </Spacer>
              
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:6,marginRight:6}}>
                  <FormElemeentSizeButtonView style={{width:"99%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('AllMealsPage')}>
                      <CalendarFullSizePressableButtonText >{t("All_meals")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  
                </FormElemeentSizeButtonParentView>
              </Spacer>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:6,marginRight:6}}>
                  <FormElemeentSizeButtonView style={{width:"49%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={predefinedMealsNavigation}>
                    <CalendarFullSizePressableButtonText >{t("Predefined")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('ListOfFoods')}>
                    <CalendarFullSizePressableButtonText >{t("List_of_Foods")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:6,marginRight:6}}>
                  <FormElemeentSizeButtonView style={{width:"49%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                     onPress={() =>{navigation.navigate("TodayMeals",{TrainerTraineeSent:traineeData});}}>
                    <CalendarFullSizePressableButtonText >{t("Today_Meals")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={()=>{navigation.navigate('TrainerManageMeals',{TrainerTraineeSent:traineeData});}}>
                    <CalendarFullSizePressableButtonText >{t("Personal_trainer_Plan")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >{t("Calendar")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <ViewOverlay>
                    <TodayMealsCalendar 
                          onAddEntry={() => setModalVisible(false)}
                          traineeData={traineeData}
                          allUserWorkedMealsFromLaravelDB={allUserWorkedMealsFromDB}
                        />
                    </ViewOverlay>
                  </Modal>
                </FormElemeentSizeButtonParentView>
              </Spacer>
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
    fontFamily:"OpenSans_400Regular",
    color:"white",
    marginVertical: 15,
  },
  FromToView:{
    flexDirection: 'row',
    marginLeft:118,
    marginRight:80,
  },
  FromToViewText:{
    fontSize:18,
    fontFamily:"OpenSans_400Regular",
    color:"white",
    flex: 1,
  },
  removeButtonContainer:
  {
    backgroundColor:'#000',
    paddingRight:8,
    paddingLeft:8,
    borderRadius:6,
    marginLeft: 10,
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
});

