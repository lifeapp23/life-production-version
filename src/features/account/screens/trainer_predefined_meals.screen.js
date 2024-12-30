import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { ScrollView,View, Modal,Alert} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import * as ImagePicker from 'expo-image-picker';
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
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    FormElemeentSizeButton,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
    ViewOverlay,
    FormLabelDateRowView,
    FormLabelDateRowViewText,


  
  } from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { addEntry,removeEntry } from './trainer_predefined_store';
import { toggleItemSelection, clearSelectedItems } from './trainer_selected_meals';

  export const TrainerPredefinedMealsScreen = ({navigation,route}) => {
      const [searchQuery, setSearchQuery] = useState('');
      const [modalVisible,setModalVisible] = useState('');
      const dispatch = useDispatch();
      const trainerPredefinedData = useSelector(state => state.trainerPredefinedData.trainerPredefinedData);
      const trainerSelectedMeals = useSelector((state) => state.trainerSelectedMeals);
      const toggleSelection = (itemId) => {
        dispatch(toggleItemSelection(itemId));
      };
      const [data, setData] = useState(trainerPredefinedData);
      const [filteredData, setFilteredData] = useState([]);
      const filterData = () => {
      const filtered = data.filter((item) => {
        const nameMatches = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            return nameMatches;
        });

        setFilteredData(filtered);
      };  
      

      useEffect(() => {
          filterData();
        }, [searchQuery, data]); 

      const handleInputChange = (itemId, text) => {
            // Update the data array with the entered text
        setData((prevData) => {
            return prevData.map((item) =>
            item.id === itemId ? { ...item, enteredData: text } : item
            );
        });
        
        };
  
    const getEnteredData = (itemId) => {
        // Retrieve entered data for a specific item
        const item = data.find((i) => i.id === itemId);
        return item ? item.enteredData || '' : '';
    }; 
    const getNextId = () => {
      const maxId = Math.max(...data.map(item => item.id), 0);
      return maxId + 1;
    };
    const removeSelectedItems = () => {
      trainerSelectedMeals.forEach((itemId) => {
        dispatch(removeEntry(itemId));
        setData((prevData) => prevData.filter((item) => item.id !== itemId)); // Update local state
      });
      dispatch(clearSelectedItems());
      // After removing selected items, update the data in the local state
      setData((prevData) => {
        // Filter out the removed items
        const updatedData = prevData.filter((item) => !trainerSelectedMeals.includes(item.id));

        // Reassign new IDs to the remaining items
        const updatedDataWithNewIds = updatedData.map((item, index) => ({
          ...item,
          id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
        }));

        return updatedDataWithNewIds;
      });
    };
       
  const AddEntryPredefined =({ data })=>{
   
      const [nameAddEntry, setNameAddEntry] = useState("");
      const [weightAddEntry, setWeightAddEntry] = useState("");  
      const [proteinAddEntry, setProteinAddEntry] = useState("");
      const [carbsAddEntry, setCarbsAddEntry] = useState("");
      const [fatsAddEntry, setFatsAddEntry] = useState(""); 
      const [caloriesAddEntry, setCaloriesAddEntry] = useState("");
      const [imagesAddEntry, setImagesNameAddEntry] = useState("");
      const hideModal = () => setModalVisible(false);

      // Select image from mobile
      const pickImageAddEntry = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      
        if (!result.canceled) {
          setImagesNameAddEntry(result.assets[0].uri);
        }
      };
      // Use useEffect to update caloriesAddEntry whenever proteinAddEntry, carbsAddEntry, or fatsAddEntry changes
      useEffect(() => {
        // Check if all three values are filled
        if (proteinAddEntry && carbsAddEntry && fatsAddEntry) {
          // Perform the calculation and update the caloriesAddEntry state
          const protein = parseFloat(proteinAddEntry) || 0;
          const carbs = parseFloat(carbsAddEntry) || 0;
          const fats = parseFloat(fatsAddEntry) || 0;

          const calories = protein * 4 + carbs * 4 + fats * 9;
          setCaloriesAddEntry(parseFloat(calories.toFixed(2))); // Round to two decimal places
        }
      }, [proteinAddEntry, carbsAddEntry, fatsAddEntry]);
      const addEntryHandler = () => {
        if (nameAddEntry && weightAddEntry && proteinAddEntry && carbsAddEntry && fatsAddEntry) {
          const newData = {
            id: getNextId(),
            name: nameAddEntry,
            weight: weightAddEntry/weightAddEntry,
            protein: proteinAddEntry/weightAddEntry,
            carbs: carbsAddEntry/weightAddEntry,
            fats: fatsAddEntry/weightAddEntry,
            calories:caloriesAddEntry/weightAddEntry,
          };
  
          dispatch(addEntry(newData));
          setData((prevData) => [...prevData, newData]); // Update the local state
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
              <ServicesPagesCardHeader>Add Entry</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            
          
          <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel>Name:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder="Name"
                  value={nameAddEntry}
                  keyboardType="default"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setNameAddEntry(u)}
                />
              </FormInputView>
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
              <FormInputView>
                <FormInput
                  placeholder="Protein"
                  value={proteinAddEntry}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setProteinAddEntry(u)}
                />
              </FormInputView>
              </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel>Carbs:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder="Carbs"
                  value={carbsAddEntry}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setCarbsAddEntry(u)}
                />
              </FormInputView>
              </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
            <FormLabelView>
              <FormLabel>Fats:</FormLabel>
            </FormLabelView>
            <FormInputView>
              <FormInput
                placeholder="Fats"
                value={fatsAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setFatsAddEntry(u)}
              />
            </FormInputView>
            </InputField>
          </Spacer>
          <Spacer size="medium">
                <InputField >
                  <FormLabelView>
                    <FormLabel>Calories:</FormLabel>
                  </FormLabelView>
                    <FormLabelDateRowView><FormLabelDateRowViewText>{caloriesAddEntry}</FormLabelDateRowViewText></FormLabelDateRowView>
                </InputField>
              </Spacer>
          <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel>Images:</FormLabel>
              </FormLabelView>
              <FormInputView>
              <FormElemeentSizeButton
                  icon="human"
                  mode="contained"
                  onPress={pickImageAddEntry}
                >Upload image</FormElemeentSizeButton>
              </FormInputView>
              </InputField>
        </Spacer>
        <Spacer size="large">
            <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                        if (nameAddEntry && weightAddEntry && proteinAddEntry && carbsAddEntry && fatsAddEntry) {
                        addEntryHandler();
                        hideModal();
                        }else{Alert.alert("You must fill all the fields");}}}
                >
                    <CalendarFullSizePressableButtonText >Add Entry</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}
                >
                    <CalendarFullSizePressableButtonText >Back</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView>
            </FormElemeentSizeButtonParentView>
        </Spacer>
        <Spacer size="large"></Spacer>
        <Spacer size="large"></Spacer>
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
                <ServicesPagesCardHeader>Meal List</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"49%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >Add Entry</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    <Modal visible={modalVisible} transparent={true} animationType="fade">
                      <ViewOverlay>
                      {/* updateWorkoutName={(newName) => setWorkoutName(newName)} */}
                      <AddEntryPredefined  />
                      </ViewOverlay>
                    </Modal>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={removeSelectedItems}
           >
                    <CalendarFullSizePressableButtonText >Remove</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer>
            <View style={{marginBottom:20,marginRight:10,marginLeft:10,marginTop:10}}>
              <FormInput
                placeholder="Search"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                theme={{colors: {primary: '#3f7eb3'}}}
              />
              <Spacer size="medium">
              <FlatList
                data={filteredData}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) =>
                <ExerciseParentView>
                  <ExerciseImageView >
                    <ExerciseImageViewImage source={require('../../../../assets/gym-workout.png')}/>
                  </ExerciseImageView>
                  <ExerciseInfoParentView>
                     <ExerciseInfoTextHead style={{fontSize:16,marginTop:-10,marginBottom:7}} >{item.name}</ExerciseInfoTextHead>
                     <FormInputView style={{width:"100%",flexDirection:'row',justifyContent:'space-between',}}>
                        <FormInput
                        placeholder="100gm (Weight)"
                        value={getEnteredData(item.id)}
                        keyboardType="numeric"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(text) => handleInputChange(item.id, text)}
                        
                        style={{width:"80%"}}
                        />
                        <CalendarFullSizePressableButton
                        style={{
                          backgroundColor: 'white',
                          width:20,
                          height:20,
                          border:1,
                          borderColor:'black',marginVertical:10,
                        }} onPress={() => toggleSelection(item.id)}>
                          <CalendarFullSizePressableButtonText style={{
                            color: trainerSelectedMeals.includes(item.id) ? '#00FF00' : '#000',position:'absolute',top:-2,}}>{trainerSelectedMeals.includes(item.id) ? '✔' : ''}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </FormInputView>
                      <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:2}}>
                        <ExerciseInfoTextTag style={{fontSize:14}}>Calories:{(getEnteredData(item.id))? (parseFloat((getEnteredData(item.id) *item.calories).toFixed(3))): (parseFloat((item.calories *100).toFixed(3)))}</ExerciseInfoTextTag>
                        <ExerciseInfoTextTag style={{fontSize:14}}>Carbs:{(getEnteredData(item.id))? (parseFloat((getEnteredData(item.id) *item.carbs).toFixed(3))): (parseFloat((item.carbs *100).toFixed(3)))}</ExerciseInfoTextTag>
                      </View>
                      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <ExerciseInfoTextTag style={{fontSize:14}}>Protein:{(getEnteredData(item.id))? (parseFloat((getEnteredData(item.id) *item.protein).toFixed(3))): (parseFloat((item.protein *100).toFixed(3)))}</ExerciseInfoTextTag>
                        <ExerciseInfoTextTag style={{fontSize:14}}>Fats:{(getEnteredData(item.id))? (parseFloat((getEnteredData(item.id) *item.fats).toFixed(3))): (parseFloat((item.fats *100).toFixed(3)))}</ExerciseInfoTextTag>
                      </View>
                  </ExerciseInfoParentView>
                  
                </ExerciseParentView>
                }
              />
              </Spacer> 
            </View>
        </ScrollView>
      </PageContainer>
        );
      };  
