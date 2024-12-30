import React, { useState, useEffect } from 'react';
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FullSizeButtonView,
  FullButton,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  ResultsParentView,
  ResultsHalfRowView,
  ResultsHalfRowLabelView,
  ResultsHalfRowResultPlaceView,
  ResultsHalfRowResultPlaceViewText,
  TraineeOrTrainerField,
  TraineeOrTrainerButtonsParentField,
  TraineeOrTrainerButtonField

} from "../components/account.styles";
import { RadioButton} from "react-native-paper";
import "./i18n";
import { useTranslation } from 'react-i18next';

import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addTodayMealsEntry, removeTodayMealsEntry } from './today_store';
import { fetchAlltDaysPredefinedMeals} from "../../../../database/predefined_meals";
import { fetchAlltDaysListOfFoods} from "../../../../database/list_of_foods";
import { fetchAlltDaysTodayMeals,insertPlansTodayMeals,SoftDeleteTodayMeal} from "../../../../database/today_meals";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

  
export const TodayMealsScreen = ({navigation,route}) => {
  const params = route.params || {};

  const { TrainerTraineeSent = {} } = params;
  // const predefinedMeals= [
  //   { id: 1, name: "baked beans", protein: 0.06, fats: 0.05, carbs: 0.22, calories: 1.55 },
  //   { id: 2, name: "hot dogs", protein: 0.1, fats: 0.26, carbs: 0.042, calories: 2.9 },
  //   { id: 3, name: "refried beans", protein: 0.05, fats: 0.012, carbs: 0.15, calories: 0.92 },
  //   { id: 4, name: "corned beef", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
  //   { id: 5, name: "corned meat", protein: 0.13, fats: 0.11, carbs: 0.07, calories: 12 },
  // ];
  const [views, setViews] = useState([]);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');
  const {t} = useTranslation();

  const dispatch = useDispatch();
  const [modalVisible,setModalVisible] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0); 
  const predefinedTodayData = useSelector(state => state.predefinedTodayData.predefinedTodayData);
  const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getNextId = () => {
    const maxId = Math.max(...data.map(item => item.id), 0);
    return maxId + 1;
  };
 
  useFocusEffect(
    React.useCallback(() => {
    

    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
    AsyncStorage.getItem("currentUser").then((user) => {

        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
        if (TrainerTraineeSent) {
          const today = new Date();
         
          if (TrainerTraineeSent?.strDat && TrainerTraineeSent?.endDat) {
          const strDat = new Date(TrainerTraineeSent?.strDat);
          const endDat = new Date(TrainerTraineeSent?.endDat);

          // Check if today is between `strDat` and `endDat`
          if (today >= strDat && today <= endDat) {
            console.log('yes subscribed')
            Alert.alert(` `,
              `${t('You_are_subscribed_to_a_personal_trainer_so_please_press_ok_and_follow_the_trainer_plans')}`,
              [
                {
                  text: `${t('OK')}`,
                  style: 'destructive',
                  onPress: () => {
                    navigation.navigate('TrainerManageMeals',{TrainerTraineeSent:TrainerTraineeSent});
                  },
                  
                },
              ],
              { cancelable: false }
            );
          } else{
            fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
              setData(TMResults);
              //console.log('TodayMealsTable:', TMResults);
                }).catch((error) => {
                //console.log('Error fetching TodayMealsTable:', error);
            });
          }
        }else{
          fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
            setData(TMResults);
            //console.log('TodayMealsTable:', TMResults);
              }).catch((error) => {
              //console.log('Error fetching TodayMealsTable:', error);
          });
          }
      }else{
        fetchAlltDaysTodayMeals(storedUser.id).then((TMResults) => {
          setData(TMResults);
          //console.log('TodayMealsTable:', TMResults);
            }).catch((error) => {
            //console.log('Error fetching TodayMealsTable:', error);
        });
      }

        

        })
        
    });
   
  }, [fetchAlltDaysTodayMeals])
);
  
  const removeTodayMeals = (item) => {
    SoftDeleteTodayMeal(item)
      .then((result) => {
        //console.log('Today Meal deleted turned into yes successfully', result);
        //console.log('Today Meal deleted userId', userId);

        // Fetch and update the Meals after soft deleting a Meals
        return fetchAlltDaysTodayMeals(userId);
      })
      .then((updatedTodayMealsList) => {
        // Update the state with the updated Meals
        //console.log('updatedTodayMealsList',updatedTodayMealsList);
        setData(updatedTodayMealsList);
      })
      .catch((error) => {
        // Handle the error by showing an alert
        Alert.alert(`${t('Failed_to_delete_Meal')}`);
      });
  };

  const updateTotalValues = () => {
    // Initialize totals based on existing data
    const initialTotalCalories = data.reduce((total, meal) => total + (parseFloat((meal.calris)) || 0), 0);
    const initialTotalProtein = data.reduce((total, meal) => total + (parseFloat((meal.protin)) || 0), 0);
    const initialTotalCarbs = data.reduce((total, meal) => total + (parseFloat((meal.carbs)) || 0), 0);
    const initialTotalFats = data.reduce((total, meal) => total + (parseFloat((meal.fats)) || 0), 0);

    // Update state with initial values
    setTotalCalories(initialTotalCalories);
    setTotalProtein(initialTotalProtein);
    setTotalCarbs(initialTotalCarbs);
    setTotalFats(initialTotalFats);
  };

  useEffect(() => {
    // Update totals when the component mounts
    updateTotalValues();
  }, [data]);
  const AddEntryNewMeal =({ setData })=>{
   
    const [weightAddEntry, setWeightAddEntry] = useState("");     
    const [caloriesAddEntry, setCaloriesAddEntry] = useState("");
    const [mealsChecked, setMealsChecked] = useState("OurMeals");
    const [userId, setUserId] = useState('');
    const [predefinedMeals, setPredefinedMeals] = useState([]);
    const speKey = userId + '.' + new Date().getTime();
    useEffect(() => {

      
  
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
      AsyncStorage.getItem("currentUser").then((user) => {
  
          const storedUser = JSON.parse(user);
          setUserId(storedUser.id);

          if(mealsChecked ==="OurMeals"){
            fetchAlltDaysPredefinedMeals(storedUser.id).then((PMResults) => {
              setPredefinedMeals(PMResults);
              ////console.log('PredefinedMealsTable:', PMResults);
                }).catch((error) => {
                //console.log('Error fetching PredefinedMealsTable:', error);
            });
          }else{
            fetchAlltDaysListOfFoods(storedUser.id).then((LOFResults) => {
              setPredefinedMeals(LOFResults);
              ////console.log('ListOfFoods:', LOFResults);
                }).catch((error) => {
                //console.log('Error fetching ListOfFoods:', error);
            });
          }
          
          
          
            
          
          })
          
      });
     
    }, [mealsChecked,fetchAlltDaysPredefinedMeals,fetchAlltDaysListOfFoods,]);
    
    const hideModal = () => setModalVisible(false);
    ////////////// Start selectorTodayMealData////////////////
    const [selectedTodayMealIndex,setSelectedTodayMealIndex] = useState();
    const [selectedOneMeal, setSelectedOneMeal] = useState(new IndexPath(0));

    const renderTodayMealOption = (item, index) => (
      <SelectItem key={index} title={item?.foddes} />
    );
    ////////////// End selectorTodayMealData////////////////
  
    // Use useEffect to update caloriesAddEntry whenever proteinAddEntry, carbsAddEntry, or fatsAddEntry changes
    useEffect(() => {
      // Check if all three values are filled
      if (selectedOneMeal?.protin && selectedOneMeal?.carbs && selectedOneMeal?.fats) {
        // Perform the calculation and update the caloriesAddEntry state
        const protein = parseFloat(selectedOneMeal?.protin) || 0;
        const carbs = parseFloat(selectedOneMeal?.carbs) || 0;
        const fats = parseFloat(selectedOneMeal?.fats) || 0;
        const calories = protein * 4 + carbs * 4 + fats * 9;
        setCaloriesAddEntry(parseFloat(calories.toFixed(4))); // Round to two decimal places
      }
    }, [selectedOneMeal?.protin, selectedOneMeal?.carbs, selectedOneMeal?.fats]);
    const addEntryHandler = () => {
      if (selectedOneMeal?.foddes ===undefined && weightAddEntry.trim() == "") {
        Alert.alert(`${t("You_must_fill_Meal_name_Weight_fields")}`);
        return;
      };
      //hideModal();
              
        const newData = {
          userId:userId,
          speKey:speKey,
          food_description: selectedOneMeal?.foddes,
          date:new Date().toISOString().split('T')[0],
          time:timeNow,
          weight: parseFloat(weightAddEntry),
          protein: parseFloat((weightAddEntry *selectedOneMeal?.protin).toFixed(4)),
          carbohydrates:  parseFloat((weightAddEntry *selectedOneMeal?.carbs).toFixed(4)),
          fats:  parseFloat((weightAddEntry *selectedOneMeal?.fats).toFixed(4)),
          calories: parseFloat((weightAddEntry * caloriesAddEntry).toFixed(4)),
          Type: selectedOneMeal?.Type ? selectedOneMeal?.Type: "",
          Subtype: selectedOneMeal?.Subtyp ? selectedOneMeal?.Subtyp : "",
          Saturated: selectedOneMeal?.Satrtd ? parseFloat((selectedOneMeal?.Satrtd*weightAddEntry).toFixed(4)) : "",
          Polyunsaturated: selectedOneMeal?.Plnstd ? parseFloat((selectedOneMeal?.Plnstd*weightAddEntry).toFixed(4)) : "",
          Monounsaturated: selectedOneMeal?.Munstd ? parseFloat((selectedOneMeal?.Munstd*weightAddEntry).toFixed(4)) : "",
          Trans: selectedOneMeal?.Trans ? parseFloat((selectedOneMeal?.Trans*weightAddEntry).toFixed(4)) : "",
          Sodium: selectedOneMeal?.Sodium ? parseFloat((selectedOneMeal?.Sodium*weightAddEntry).toFixed(4)) : "",
          Potassium: selectedOneMeal?.Potsim ? parseFloat((selectedOneMeal?.Potsim*weightAddEntry).toFixed(4)) :"",
          Cholesterol: selectedOneMeal?.Chostl ? parseFloat((selectedOneMeal?.Chostl*weightAddEntry).toFixed(4)) : "",
          Vitamin_A: selectedOneMeal?.VtminA ? parseFloat((selectedOneMeal?.VtminA*weightAddEntry).toFixed(4)) : "",
          Vitamin_C: selectedOneMeal?.VtminC ? parseFloat((selectedOneMeal?.VtminC*weightAddEntry).toFixed(4)):"",
          Calcium: selectedOneMeal?.Calcim ? parseFloat((selectedOneMeal?.Calcim*weightAddEntry).toFixed(4)) : "",
          Iron: selectedOneMeal?.Iron ? parseFloat((selectedOneMeal?.Iron*weightAddEntry).toFixed(4)) : "",
          images:selectedOneMeal?.images ? selectedOneMeal?.images : "",
          deleted:'no',
          isSync:'no'
        

       
      };
      //console.log('newData',newData);
      insertPlansTodayMeals(newData).then((TMResults) => {
        //console.log('insert Meal in TodayMeals succesfully:', TMResults);
        Alert.alert(`${t(' ')}`,
              `${t('Your_New_Meals_added_successfully')}`,
              [
              {
                  text: 'OK',
                  onPress: () => {
                    hideModal();
                  },
              },
              ],
              { cancelable: false }
          );
          return fetchAlltDaysTodayMeals(userId);
        })
        .then((updatedTodayMeals) => {
          // Update the state with the updated Meals
          //console.log('updatedTodayMeals',updatedTodayMeals);
          setData(updatedTodayMeals);
          
        })
        .catch((error) => {
        //console.log('Error insert Meals in TodayMeals:', error);
    });
    };


    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t('Add_Meal')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          <Spacer >
        <TraineeOrTrainerField>
            <FormLabelView>
            <FormLabel>{t('Meals_Lists')}:</FormLabel>
            </FormLabelView>
          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="OurMeals"
                status={ mealsChecked === 'OurMeals' ? 'checked' : 'unchecked' }
                onPress={() => setMealsChecked('OurMeals')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t('Our_Meals')}</FormLabel>
                </TraineeOrTrainerButtonField>
                  <TraineeOrTrainerButtonField>
                    <RadioButton
                      value="YourMeals"
                      status={ mealsChecked === 'YourMeals' ? 'checked' : 'unchecked' }
                      onPress={() => setMealsChecked('YourMeals')}
                      uncheckedColor={"#000"}
                      color={'#000'}
                    />
                    <FormLabel>{t('Your_Meals')}</FormLabel>
                  </TraineeOrTrainerButtonField>
              </TraineeOrTrainerButtonsParentField>
            </TraineeOrTrainerField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel>{t('Meal_Name')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
              <Select
                  onSelect={(index) => {
                    setSelectedTodayMealIndex(index-1);
                    setSelectedOneMeal(predefinedMeals?.[index-1]);
                    }}
                  placeholder={t('Meal_Name')}
                  value={selectedTodayMealIndex >= 0 ? predefinedMeals?.[selectedTodayMealIndex]?.foddes : ''}
                  style={{marginBottom:10}}
                  status="newColor"
                  size="customSizo"
                >
                  {predefinedMeals.map(renderTodayMealOption)}
                </Select>
              </FormInputView>  
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField >
            <FormLabelView>
              <FormLabel>{t('Time')}:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{timeNow}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>{t('Weight')}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Weight_100_g")}
              value={weightAddEntry}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView>
              <FormLabel>{t("Protein")}:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal?.protin).toFixed(4)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView>
              <FormLabel>{t("Carbs")}:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal?.carbs).toFixed(4)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>{t("Fats")}:</FormLabel>
          </FormLabelView>
          <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal?.fats).toFixed(4)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField >
            <FormLabelView>
              <FormLabel>{t("Calories")}:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry * caloriesAddEntry).toFixed(4))}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
      <Spacer size="large">
      <FullSizeButtonView>
            <FullButton
              icon="file-upload"
              mode="contained"
              onPress={()=>{
                addEntryHandler();
                }}
              style={{fontSize:18}}
            >
              {t("Add_Meal")}
            </FullButton>
          </FullSizeButtonView>
      </Spacer>
      <Spacer size="medium">
      <FullSizeButtonView>
          <FullButton
            icon="arrow-down-left-bold"
            mode="contained"
            style={{fontSize:18}}
            onPress={hideModal}
          >
            {t("Back")}
          </FullButton>
        </FullSizeButtonView>
      </Spacer>
      </ScrollView>
      
      </PageContainer>
    );
  };
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{new Date().toISOString().split('T')[0]}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            {(data.length >= 1) ? (
              <View style={styles.FromToViewParentColumnHeader}>
                <Text style={styles.FromToViewText}>{t("Meal")}</Text>
                <View style={styles.FromToView}>
                  <Text style={styles.FromToViewTextWeight}>{t("Weight")}</Text>
                  <Text style={styles.FromToViewTextTime}>{t("Time")}</Text>
                  <Text style={styles.FromToViewTextProtein}>{t("Protein")}</Text>
                  <Text style={styles.FromToViewTextCarbs}>{t("short_Carbs")}</Text>
                  <Text style={styles.FromToViewTextFats}>{t("short_Fats")}</Text>
                  <Text style={styles.FromToViewTextCalories}>{t("short_Calories")}</Text>
                </View>
              </View>
            ):null}
              
              {data.map((oneMeal) => (
                <View key={oneMeal.id} style={styles.FromToViewParentColumnBody}>
                <Text style={styles.rightContainerText}>{oneMeal.foddes || ''}</Text>
                <View style={styles.viewContainer}>
                  <View style={styles.rightContainer}>     
                    <Text style={styles.rightContainerTextWeight}>{parseFloat(oneMeal.weight) || '0'}</Text>
                    <Text style={styles.rightContainerTextTime}>{oneMeal.time || '0'}</Text>
                    <Text style={styles.rightContainerTextProtein}>{parseFloat(oneMeal.protin) || '0'}</Text>
                    <Text style={styles.rightContainerTextCarbs}>{parseFloat(oneMeal.carbs) || '0'}</Text>
                    <Text style={styles.rightContainerTextFats}>{parseFloat(oneMeal.fats) || '0'}</Text>
                    <Text style={styles.rightContainerTextCalories}>{oneMeal.calris || '0'}</Text>
                  </View>
                  <View style={{alignItems:'center', marginVertical: -12,width:"10%",height:24}}>
                    <Pressable onPress={() => removeTodayMeals(oneMeal)} style={{backgroundColor:'#fff',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="#000" />
                    </Pressable>
                  </View>
                </View>
              </View>
              ))}
            <Spacer size="medium">
              <ResultsParentView >
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>{t("Protein")}:</FormLabel>
                  </ResultsHalfRowLabelView>
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalProtein?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>{t("Carbs")}:</FormLabel>
                  </ResultsHalfRowLabelView> 
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCarbs?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
              </ResultsParentView>
              </Spacer>
              <Spacer size="small">
      <ResultsParentView >
        <ResultsHalfRowView >
          <ResultsHalfRowLabelView>
            <FormLabel style={{fontSize:16}}>{t("Fats")}:</FormLabel>
          </ResultsHalfRowLabelView>
            <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalFats?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
        </ResultsHalfRowView>
        <ResultsHalfRowView>
          <ResultsHalfRowLabelView>
            <FormLabel style={{fontSize:16}}>{t("Calories")}:</FormLabel>
          </ResultsHalfRowLabelView>
            <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCalories?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
        </ResultsHalfRowView>
      </ResultsParentView>
              </Spacer>
              <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('AddNewMealToTodayMeals')}>
                    <CalendarFullSizePressableButtonText >{t("Add_New_Meal")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >{t("Add_New_Meal")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Modal visible={modalVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                {/* updateWorkoutName={(newName) => setWorkoutName(newName)} */}
                <AddEntryNewMeal setData={setData}/>
                </ViewOverlay>
              </Modal>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Spacer size="large"></Spacer>

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
  
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    width:"90%",
    height:22,
    // justifyContent:'space-between',
  //  backgroundColor:'blue'
  },
  


  FromToViewParentColumnHeader:{
    flexDirection: 'column',
    flex:1,
    width:"100%",
    height:48,
    // marginBottom:5,
    borderTopWidth:1,
    borderTopColor:"black",
    // backgroundColor:'blue'


  },
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    height:24,
    width:"100%",
    borderWidth:1,
    borderColor:"black",
  },
  FromToViewParentColumnBody:{
    flexDirection: 'column',
    width:"100%",
    height:50,
    // marginBottom:10,
    borderBottomWidth:1,
    borderBottomColor:"black",
    //backgroundColor:"yellow",

  },
  viewContainer: {
    flexDirection: 'row',
    marginRight:10,
    width:"100%",
    height:24,
    //backgroundColor:"green",

  },
  FromToViewText:{
    height:24,
    width:"100%",
    justifyContent:"center",
    textAlign:'center',
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    // flex:1,
    
  },
  rightContainerText:{

    fontSize:14,
    color:"#000",
    // //marginVertical: 17,
    height:24,
    width:"100%",
    justifyContent:"center",
    textAlign:'center',
    marginTop:5,
     //backgroundColor:"red",
  },
  FromToViewTextWeight:{

    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"1%"
  },
  rightContainerTextWeight:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"1%"
  },
  FromToViewTextTime:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"18%",
  },
  rightContainerTextTime:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"18%",
    flexWrap: 'wrap',
  },
  FromToViewTextProtein:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"32%",
  },
  rightContainerTextProtein:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"37%",
  },
  FromToViewTextCarbs:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"48%",
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"53%",
  },
  FromToViewTextFats:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"63%",
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"70%",
  },
  
  FromToViewTextCalories:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"77%",
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"85%",
  },
  
});

