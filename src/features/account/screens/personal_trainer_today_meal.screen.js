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


} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addPersonalTrainerTodayMealsEntry, removePersonalTrainerTodayMealsEntry } from './personal_trainer_today_store';
import { deleteMealFromPlanInRedux } from './trainer_manage_meals';


export const PersonalTrainerTodayMealsScreen = ({navigation}) => {
  const predefinedMeals= [
    { id: 1, name: "baked beans", protein: 0.06, fats: 0.05, carbs: 0.22, calories: 1.55 },
    { id: 2, name: "hot dogs", protein: 0.1, fats: 0.26, carbs: 0.042, calories: 2.9 },
    { id: 3, name: "refried beans", protein: 0.05, fats: 0.012, carbs: 0.15, calories: 0.92 },
    { id: 4, name: "corned beef", protein: 0.18, fats: 0.19, carbs: 0.005, calories: 2.51 },
    { id: 5, name: "corned meat", protein: 0.13, fats: 0.11, carbs: 0.07, calories: 12 },
  ];
  const [views, setViews] = useState([]);
  const dispatch = useDispatch();
  const [modalVisible,setModalVisible] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0); 
  const personalTrainerMeals = useSelector(state => state.trainerMealsPlansData.trainerMealsPlansData);
  const personalTrainerTodayData = useSelector(state => state.personalTrainerTodayData.personalTrainerTodayData);
  const mergedData = [...personalTrainerTodayData, ...personalTrainerMeals?.[0]?.meals];
  const [data, setData] = useState(personalTrainerTodayData);
  const [trainerMealsView, setTrainerMealsView] = useState(personalTrainerMeals?.[0]?.meals);
  const getNextId = () => {
    const maxId = Math.max(...data.map(item => item.id), 0);
    return maxId + 1;
  };
  
  const removeTrainerMealsViewItem = (planIdRowConId,viewId) => {
    dispatch(deleteMealFromPlanInRedux({planIdRowConId, viewId}));
    setTrainerMealsView((prevData) => prevData.filter((item) => item.id !== viewId)); // Update local state
    // After removing selected items, update the data in the local state
    setTrainerMealsView((prevData) => {
      // Filter out the removed items
      // Reassign new IDs to the remaining items
      const updatedDataWithNewIds = prevData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));

      return updatedDataWithNewIds;
    });
  };
  const removePersonalTrainerTodayMeals = (itemId) => {
    dispatch(removePersonalTrainerTodayMealsEntry(itemId));
    setData((prevData) => prevData.filter((item) => item.id !== itemId)); // Update local state
    // After removing selected items, update the data in the local state
    setData((prevData) => {
      // Filter out the removed items
      // Reassign new IDs to the remaining items
      const updatedDataWithNewIds = prevData.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
      }));

      return updatedDataWithNewIds;
    });
  };
  const updateTotalValues = () => {
    // Initialize totals based on existing data
    const initialTotalCalories = data.reduce((total, meal) => total + (meal.calories || 0), 0);
    const initialTotalProtein = data.reduce((total, meal) => total + (meal.protein || 0), 0);
    const initialTotalCarbs = data.reduce((total, meal) => total + (meal.carbs || 0), 0);
    const initialTotalFats = data.reduce((total, meal) => total + (meal.fats || 0), 0);

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
  const AddEntryNewMeal =({ predefinedMeals })=>{
   
    const [weightAddEntry, setWeightAddEntry] = useState("");     
    const [caloriesAddEntry, setCaloriesAddEntry] = useState("");
    const hideModal = () => setModalVisible(false);
    ////////////// Start selectorTodayMealData////////////////
    const [selectedTodayMealIndex,setSelectedTodayMealIndex] = useState();
    const [selectedOneMeal, setSelectedOneMeal] = useState(new IndexPath(0));

    const renderTodayMealOption = (item, index) => (
      <SelectItem key={index} title={item.name} />
    );
    ////////////// End selectorTodayMealData////////////////
  
    // Use useEffect to update caloriesAddEntry whenever proteinAddEntry, carbsAddEntry, or fatsAddEntry changes
    useEffect(() => {
      // Check if all three values are filled
      if (selectedOneMeal.protein && selectedOneMeal.carbs && selectedOneMeal.fats) {
        // Perform the calculation and update the caloriesAddEntry state
        const protein = parseFloat(selectedOneMeal.protein) || 0;
        const carbs = parseFloat(selectedOneMeal.carbs) || 0;
        const fats = parseFloat(selectedOneMeal.fats) || 0;
        const calories = protein * 4 + carbs * 4 + fats * 9;
        setCaloriesAddEntry(parseFloat(calories.toFixed(2))); // Round to two decimal places
      }
    }, [selectedOneMeal.protein, selectedOneMeal.carbs, selectedOneMeal.fats]);
    const addEntryHandler = () => {
      if (selectedOneMeal.name !==undefined && weightAddEntry) {
        const newData = {
          id: getNextId(),
          name: selectedOneMeal.name,
          date:new Date().toISOString().split('T')[0],
          time:new Date().toLocaleTimeString(),
          weight: parseFloat(weightAddEntry),
          protein: parseFloat((weightAddEntry *selectedOneMeal.protein).toFixed(3)),
          carbs:  parseFloat((weightAddEntry *selectedOneMeal.carbs).toFixed(3)),
          fats:  parseFloat((weightAddEntry *selectedOneMeal.fats).toFixed(3)),
          calories: parseFloat((weightAddEntry * caloriesAddEntry).toFixed(3)),
        };

        dispatch(addPersonalTrainerTodayMealsEntry(newData));
        setData((prevData) => [...prevData, newData]); // Update the local state
        // Update total values
        
      }
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
            <ServicesPagesCardHeader>Add Meal</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel>Meal Name:</FormLabel>
              </FormLabelView>
              <FormInputView>
              <Select
                  onSelect={(index) => {
                    setSelectedTodayMealIndex(index-1);
                    setSelectedOneMeal(predefinedMeals[index-1]);
                    }}
                  placeholder="Meal's Name"
                  value={selectedTodayMealIndex >= 0 ? predefinedMeals[selectedTodayMealIndex].name : ''}
                  style={{marginBottom:10}}
                >
                  {predefinedMeals.map(renderTodayMealOption)}
                </Select>
              </FormInputView>  
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField >
            <FormLabelView>
              <FormLabel>Time:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{new Date().toLocaleTimeString().split(' PM')}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>Weight:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder="100gm (Weight)"
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
              <FormLabel>Protein:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal.protein).toFixed(3)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView>
              <FormLabel>Carbs:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal.carbs).toFixed(3)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>Fats:</FormLabel>
          </FormLabelView>
          <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry *selectedOneMeal.fats).toFixed(3)) || '0'}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField >
            <FormLabelView>
              <FormLabel>Calories:</FormLabel>
            </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{parseFloat((weightAddEntry * caloriesAddEntry).toFixed(3))}</FormLabelDateRowViewText></FormLabelDateRowView>
          </InputField>
        </Spacer>
      <Spacer size="large">
      <FullSizeButtonView>
            <FullButton
              icon="file-upload"
              mode="contained"
              onPress={()=>{
                if (selectedOneMeal.name && weightAddEntry) {
                addEntryHandler();
                hideModal();
              }else{Alert.alert("You must fill Meal name & Weight fields");}}}
              style={{fontSize:18}}
            >
              Add Meal
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
            Back
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
                <ServicesPagesCardHeader>Personal Trainer {new Date().toISOString().split('T')[0]} Meal</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <View style={styles.container}> 
            {(data.length >= 1) ? (
              <View style={styles.FromToView}>
                <Text style={styles.FromToViewText}>Meal</Text>
                <Text style={styles.FromToViewTextWeight}>Weight</Text>
                <Text style={styles.FromToViewTextTime}>Time</Text>
                <Text style={styles.FromToViewTextProtein}>Protein</Text>
                <Text style={styles.FromToViewTextCarbs}>Carbs</Text>
                <Text style={styles.FromToViewTextFats}>Fats</Text>
                <Text style={styles.FromToViewTextCalories}>Calories</Text>
              </View>
            ):null}
              
              {data.map((oneMeal,index) => (
                <View key={`${index}-${oneMeal.id}-TodayPersonalTrainerMealsViewItem`} style={styles.viewContainer}>
                  <View style={styles.rightContainer}>     
                    <Text style={styles.rightContainerText}>{oneMeal.name || ''}</Text>
                    <Text style={styles.rightContainerTextWeight}>{oneMeal.weight || '0'}</Text>
                    <Text style={styles.rightContainerTextTime}>{oneMeal.time || '0'}</Text>
                    <Text style={styles.rightContainerTextProtein}>{oneMeal.protein || '0'}</Text>
                    <Text style={styles.rightContainerTextCarbs}>{oneMeal.carbs || '0'}</Text>
                    <Text style={styles.rightContainerTextFats}>{oneMeal.fats || '0'}</Text>
                    <Text style={styles.rightContainerTextCalories}>{oneMeal.calories || '0'}</Text>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,}}>
                    <Pressable onPress={() => removePersonalTrainerTodayMeals(oneMeal.id)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>
                
              ))}
              {trainerMealsView.map((oneMeal,index) => {
                return(
                <View key={`${index}-${oneMeal.id}`} style={styles.viewContainer}>
                  <View style={styles.rightContainer}>     
                    <Text style={styles.rightContainerText}>{oneMeal.name || ''}</Text>
                    <Text style={styles.rightContainerTextWeight}>{oneMeal.weight || '0'}</Text>
                    <Text style={styles.rightContainerTextTime}>{oneMeal.time || '0'}</Text>
                    <Text style={styles.rightContainerTextProtein}>{oneMeal.protein || '0'}</Text>
                    <Text style={styles.rightContainerTextCarbs}>{oneMeal.carbs || '0'}</Text>
                    <Text style={styles.rightContainerTextFats}>{oneMeal.fats || '0'}</Text>
                    <Text style={styles.rightContainerTextCalories}>{oneMeal.calories || '0'}</Text>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,}}>
                    <Pressable onPress={() => removeTrainerMealsViewItem(personalTrainerMeals?.[0]?.id,oneMeal.id)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>
                );
              })}
              
            <Spacer size="medium">
              <ResultsParentView >
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>Protein:</FormLabel>
                  </ResultsHalfRowLabelView>
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalProtein.toFixed(2)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>Carbs:</FormLabel>
                  </ResultsHalfRowLabelView> 
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCarbs.toFixed(2)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
              </ResultsParentView>
              </Spacer>
              <Spacer size="small">
      <ResultsParentView >
        <ResultsHalfRowView >
          <ResultsHalfRowLabelView>
            <FormLabel style={{fontSize:16}}>Fats:</FormLabel>
          </ResultsHalfRowLabelView>
            <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalFats.toFixed(2)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
        </ResultsHalfRowView>
        <ResultsHalfRowView>
          <ResultsHalfRowLabelView>
            <FormLabel style={{fontSize:16}}>Calories:</FormLabel>
          </ResultsHalfRowLabelView>
            <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCalories.toFixed(2)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
        </ResultsHalfRowView>
      </ResultsParentView>
              </Spacer>
              <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >Add New Meal</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              <Modal visible={modalVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                {/* updateWorkoutName={(newName) => setWorkoutName(newName)} */}
                <AddEntryNewMeal  predefinedMeals={predefinedMeals}/>
                </ViewOverlay>
              </Modal>
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >Back</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
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
    marginVertical: 2,
    marginLeft:10,
    marginRight:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
  rightContainerText:{

    fontSize:14,
    width:50,
    color:"white",
    marginVertical: 15,
    flexWrap: 'wrap',
    marginRight:12,
  },

  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginLeft:20,
    marginRight:20,

  },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
  },
  FromToViewTextWeight:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-16,
  },
  rightContainerTextWeight:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginLeft:-10,
  },
  FromToViewTextTime:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-8,
  },
  rightContainerTextTime:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginRight:-8,
    marginLeft:-26,
    flexWrap: 'wrap',
  },
  FromToViewTextProtein:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-14,
  },
  rightContainerTextProtein:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginRight:-20,
    marginLeft:14
  },
  FromToViewTextCarbs:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-2,
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginRight:-30,
    marginLeft:4,
  },
  FromToViewTextFats:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-10,
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginRight:-24,
    marginLeft:14,
  },
  
  FromToViewTextCalories:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
    marginLeft:-24,
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:14,
    color:"white",
    marginVertical: 15,
    marginRight:-32,
  },
  
});

