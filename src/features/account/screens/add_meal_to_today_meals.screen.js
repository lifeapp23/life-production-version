import React, { useState, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { ScrollView,View, Modal,Alert,Text,TouchableOpacity , Animated, Easing} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Asset } from 'expo-asset';
import { mainMealsData } from "../../../../main_data/main_meals_data_with_require";
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton} from "react-native-paper";
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import { fetchAlltDaysTodayMeals,insertPlansTodayMeals,SoftDeleteTodayMeal} from "../../../../database/today_meals";


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
    FullSizeButtonView,
    FullButton,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
    ViewOverlay,
    FormLabelDateRowView,
    FormLabelDateRowViewText,
    FilterTextView,
    FilterTextPressable,
    FilterContainer,
    TraineeOrTrainerField,
    TraineeOrTrainerButtonsParentField,
    TraineeOrTrainerButtonField,
    ClearFilterTextView,
    ClearFilterTouchableOpacity,
    ClearFilterText,
    FilterText,
  
  } from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { addEntry,removeEntry } from './predefined_store';
import { toggleItemSelection, clearSelectedItems } from './selectedItems';
import { fetchAlltDaysListOfFoods,SoftDeleteSelectedMeals,SoftDeleteJustOneMeal} from "../../../../database/list_of_foods";
import { fetchAlltDaysPredefinedMeals} from "../../../../database/predefined_meals";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';


const MealsCheckButtonCom = React.memo(({item,selectedItemsForRemoving,setSelectedItemsForRemoving,addEntryHandler}) => {
  ////console.log('selectedItemsForRemoving',selectedItemsForRemoving);
  ////console.log('item',item);
///////////
const [gramsinputsValues,setGramsInputsValues]= useState('');
const {t} = useTranslation();


const [newCheckSignState,setNewCheckSignState]=useState([]);
  const [newItemState,setNewItemState]=useState({});
const toggleSelection = (item) => {
  //console.log('item',item);
  const mealKey = item.speKey;

  // //console.log('newCheckSignState toggle',newCheckSignState);
  // const indexToRemove  = newCheckSignState.findIndex((meal) => meal.speKey === mealKey);
  // if (indexToRemove  !== -1) {
  //   setNewCheckSignState((prevSelectedMeals) =>
  //   prevSelectedMeals.filter((_, index) => index !== indexToRemove)
  //   );
  // }else{

  //   setNewCheckSignState((prevSelectedMeals) => {
  //     const newItem = item; // Assuming 'item' is the value you want to add
      
  //     // Check if newItem meets the condition (num is between 1 and 500)
  //     if (newItem.id >= 1 && newItem.id <= 175 && newItem.userId == "appAssets") {
  //       alert("You can't remove main meals.");
  //       return prevSelectedMeals; // Return the previous state without adding the item
  //     } else {
  //       // Add the item to the state if it meets the condition
  //       return [...prevSelectedMeals, newItem];
  //     }
  //   });

  // }
  const indexSelectedItemsForRemovingToRemove  = selectedItemsForRemoving.findIndex((meal) => meal.speKey === mealKey);

  if (indexSelectedItemsForRemovingToRemove  !== -1) {

    setSelectedItemsForRemoving((prevSelectedMeals) =>
    prevSelectedMeals.filter((_, index) => index !== indexSelectedItemsForRemovingToRemove)
    );
  }else{


    setSelectedItemsForRemoving((prevSelectedMeals) => {
      const newItem = item; // Assuming 'item' is the value you want to add
      // Add the item to the state if it meets the condition
      return [...prevSelectedMeals, newItem];
      // // Check if newItem meets the condition (num is between 1 and 500)
      // if (newItem.id >= 1 && newItem.id <= 175 && newItem.userId == "appAssets") {
      //   alert("You can't remove main meals.");
      //   return prevSelectedMeals; // Return the previous state without adding the item
      // } else {
      //   // Add the item to the state if it meets the condition
      //   return [...prevSelectedMeals, newItem];
      // }
    });

  }

  // const index = selectedItemsForRemoving.indexOf(item.speKey);
  // if (index !== -1) {
  //   selectedItemsForRemoving.splice(index, 1); // Remove item if already selected
  //   //console.log('selectedItemsForRemoving splice',selectedItemsForRemoving);
  // } else {
  //   selectedItemsForRemoving.push(itemSpeKey); // Add item if not selected
  //   //console.log('selectedItemsForRemoving push',selectedItemsForRemoving);
  // }
};
  

  useEffect(() => {
    ////console.log('newCheckSignState',newCheckSignState);
    //console.log('selectedItemsForRemoving',selectedItemsForRemoving);

  }, []);
      return(
        <>
        <FormInputView style={{width:"100%",flexDirection:'row',justifyContent:'space-between',}}>

        
          <FormInput
              placeholder={t("Weight_100_g")}
              value={gramsinputsValues.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(text) =>setGramsInputsValues(text)}
              
              style={{width:"80%"}}
              />
              {/* {(item.userId != "appAssets")?( */}
                <>
                {/* <CalendarFullSizePressableButton
                  style={{
                    backgroundColor: 'transparent',
                    width:25,
                    height:25,
                    borderWidth:1,
                    borderColor:'black',marginVertical:10,
                    borderRadius:0
                  }} onPress={() => toggleSelection(item)}>
                    <CalendarFullSizePressableButtonText style={{
                      color: selectedItemsForRemoving.includes(item) ? '#00FF00' : '#000',position:'absolute',top:-5,fontSize:20}}>{selectedItemsForRemoving.includes(item) ? '✔' : ''}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton> */}
                  <TouchableOpacity onPress={() => addEntryHandler(gramsinputsValues,item)} style={{backgroundColor:'#fff',borderRadius:10,position:'absolute',top:5,right:2}}>
              <AntDesign name="pluscircleo" size={25} color="black" />
            </TouchableOpacity>
            </>
              {/* ):(null)} */}
            
          </FormInputView>
          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:2}}>
            <ExerciseInfoTextTag style={{fontSize:14}}>Calories:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.calris).toFixed(5))): (parseFloat((item.calris *100).toFixed(5)))}</ExerciseInfoTextTag>
            <ExerciseInfoTextTag style={{fontSize:14}}>Carbs:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.carbs).toFixed(5))): (parseFloat((item.carbs *100).toFixed(5)))}</ExerciseInfoTextTag>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <ExerciseInfoTextTag style={{fontSize:14}}>Protein:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.protin).toFixed(5))): (parseFloat((item.protin *100).toFixed(5)))}</ExerciseInfoTextTag>
            <ExerciseInfoTextTag style={{fontSize:14}}>Fats:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.fats).toFixed(5))): (parseFloat((item.fats *100).toFixed(5)))}</ExerciseInfoTextTag>
          </View>
          </>   
      );

});

const MemoizedExerciseParentView = React.memo(({ item, navigation, setFilteredData,filteredData,selectedItems,selectedItemsForRemoving,setSelectedItemsForRemoving,handleInputChange,getEnteredData,addEntryHandler }) => {
  const {t} = useTranslation();


  
  return (
    <ExerciseParentView>
      <ExerciseImageView >
        {(item.images !== '' && item.images !== undefined && item.images !== null) ? (
          <ExerciseImageViewImage
                  
                  source={
                    item.images.startsWith('../../../../assets/images')
                          ? mainMealsData[item?.id-1]?.images
                          : item?.images.startsWith('file:///data/user')
                          ? { uri: item?.images }
                          : null // Set an appropriate default or handle other cases
                      }   
                />
          ) : (
            <ExerciseImageViewImage source={require('../../../../assets/images/demo_meal.png')} />
          )}
      </ExerciseImageView>
      <ExerciseInfoParentView>
          <ExerciseInfoTextHead style={{fontSize:16,marginTop:-10,marginBottom:7}} >{item.foddes}</ExerciseInfoTextHead>
            <MealsCheckButtonCom item={item} selectedItemsForRemoving={selectedItemsForRemoving} setSelectedItemsForRemoving={setSelectedItemsForRemoving} addEntryHandler={addEntryHandler}/>
        
          
      </ExerciseInfoParentView>
      
    </ExerciseParentView>
  );
});
  export const AddNewMealToTodayMealsScreen = ({navigation,route}) => {
      const [searchQuery, setSearchQuery] = useState('');
      //const [modalVisible,setModalVisible] = useState('');
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      const [showFilter, setShowFilter] = useState(false); // New state for filter visibility
      const [selectedFilter, setSelectedFilter] = useState(''); // State to manage the selected filter

      const toggleFilter = () => {
        setShowFilter(!showFilter);
      };
      const clearFilter = () => {
        
        setSelectedFilter('');
      };
      //let selectedItemsForRemoving = [];
      const dispatch = useDispatch();
      const predefined_data = useSelector(state => state.predefinedData.predefinedData);
      const selectedItems = useSelector((state) => state.selectedItems);
      const [selectedItemsForRemoving, setSelectedItemsForRemoving] = useState([]);
      useEffect(() => {
        const saveNewListOfFoodsImage = async () => {
        const asset = Asset.fromModule(require('../../../../assets/images/vegetables.png'));
        if (!asset.downloaded) {
          await asset.downloadAsync();
        }
        /// continue from here ----------->>>>>>>>>>>>>
        ////console.log('asset----',asset);
      
        // Access the localUri property
        const localUri = asset.localUri;
        ////console.log('localUri----',localUri);
        }
        const asseto =  saveNewListOfFoodsImage();
        ////console.log('Asset.fromModule localUri',asseto);
      }, []); 
      const [data, setData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
      const [loading, setLoading] = useState(false);
      const [loadingPageInfo, setLoadingPageInfo] = useState(true);
      const [showSuccess, setShowSuccess] = useState(false);
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
      const [userId, setUserId] = useState('');
      const speKey = userId + '.' + new Date().getTime();

      useFocusEffect(
        React.useCallback(() => {
        

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {

            const storedUser = JSON.parse(user);
            setUserId(storedUser.id);
            ////console.log('predefined meals user',storedUser);
            // fetchAlltDaysListOfFoods(storedUser.id).then((PMResults) => {
            //   // setFetchedData(WResults);
            //   setData(PMResults);
            //   console.log('ListOfFoodsTable:', PMResults);
            //     }).catch((error) => {
            //     ////console.log('Error fetching ListOfFoodsTable:', error);
            // });
            setLoadingPageInfo(true);
            const fetchDataAndUpdateState = async () => {
              try {
                  // Fetch both arrays concurrently
                  const [PMResults, LOFResults] = await Promise.all([
                      fetchAlltDaysPredefinedMeals(storedUser.id),
                      fetchAlltDaysListOfFoods(storedUser.id)
                  ]);
        
                  // Merge the arrays
                  const mergedResults = [...LOFResults,...PMResults];
                  console.log('Updated LOFResults:', LOFResults)

                  // Update the state with the merged array
                  // setPredefinedMeals(mergedResults);
                  setData(mergedResults);
                  setLoadingPageInfo(false);
              //console.log('all meals table:', mergedResults);
              } catch (error) {
                  //console.log('Error fetching data:', error);
                  setLoadingPageInfo(false);

                }
              };
        
              // Call the function to fetch and update the state
              fetchDataAndUpdateState();
              
            
            })
            
        });
       
        }, [fetchAlltDaysPredefinedMeals,fetchAlltDaysListOfFoods])
      );
      
      const filterData = () => {
      const filtered = data.filter((item) => {
        const nameMatches = item.foddes.toLowerCase().includes(searchQuery.toLowerCase());
        const filterByUserId = () => {
          if (selectedFilter === 'Predefined') {
            return item.userId == "appAssets";
          } else if (selectedFilter === 'Own') {
            return item.userId == userId;
          }
          else if (selectedFilter === 'All') {
            return (item.userId == userId || item.userId == "appAssets");
          }
          return true;
        };
            if(nameMatches || filterByUserId()){
              setCurrentPage(1);
            }
            return nameMatches && filterByUserId();
        });

        setTotalItems(filtered?.length);
        //console.log('filtered?.length',filtered?.length);
        setTotalPages(Math.ceil(filtered?.length / pageSize));
        //console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));
        setFilteredData(filtered);
        //console.log('filtered',filtered);
        //setCurrentPage(currentPage ? currentPage : 1);
        
        //console.log('currentPage inside',currentPage);
      };  
      

      useEffect(() => {
          filterData();
        }, [searchQuery, data,selectedFilter]); 
        const handlePageChange = (page) => {
          setCurrentPage(page);
        };
        //console.log('currentPage outside',currentPage);

        // Calculate the range of page numbers to display
        const minPage = Math.max(1, currentPage - 2);
        const maxPage = Math.min(totalPages, currentPage + 2);


        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const visibleData = filteredData.slice(startIdx, endIdx);  

        // Render the pagination buttons
        const renderPaginationButtons = () => {
          const buttons = [];
          if ((currentPage - 5) >= 1) {
            buttons.push(
              (isArabic)?(
              <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              ):(
                <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              )
            );
          }
          // Render button for previous page
          if (currentPage > 1) {
            buttons.push(
              (isArabic)?(
                <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                  <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                  <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                )
              
            );
          }

          // Render buttons for pages before the current page
          for (let i = minPage; i < currentPage; i++) {
            buttons.push(
              <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                <Text style={{color:'#000'}}>{i}</Text>
              </TouchableOpacity>
            );
          }

          // Render button for current page
          buttons.push(
            <TouchableOpacity  style={{backgroundColor:'transparent',borderWidth:2,borderColor:"#3f7eb3",width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={currentPage} disabled>
              <Text style={{color:'#3f7eb3'}}>{currentPage}</Text>
            </TouchableOpacity>
          );

          // Render buttons for pages after the current page
          for (let i = currentPage + 1; i <= maxPage; i++) {
            buttons.push(
              <TouchableOpacity style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                <Text style={{color:'#000'}}>{i}</Text>
              </TouchableOpacity>
            );
          }

          // Render button for next page
          if (currentPage < totalPages) {
            buttons.push(
              (isArabic)?(
                <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                  <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                  <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                    <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                  </TouchableOpacity>
                )
              
            );
          }

          if (currentPage+5 <= totalPages) {
            buttons.push(
              (isArabic)?(
              <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              ):(
                <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              )
            );
          }
          return buttons;
        };

        
    const getNextId = () => {
      const maxId = Math.max(...data.map(item => item.speKey), 0);
      return maxId + 1;
    };
    

    // const removeJustOneMeal = (item) => {
      
    //   setLoading(true);
    //   SoftDeleteJustOneMeal(item)
    //   .then((result) => {
    //     //console.log('Day Meals deleted turned into yes successfully', result);
        
    //     // Fetch and update the Meals after soft deleting a Meals
    //     return Promise.all([
    //       fetchAlltDaysPredefinedMeals(userId),
    //       fetchAlltDaysListOfFoods(userId)
    //     ]);
    //   })
    //   .then(([PMResults, LOFResults]) => {
      
    //     // Merge the arrays from both tables
    //   const mergedResults = [...LOFResults, ...PMResults];
    //   console.log('Updated LOFResults:', LOFResults)

    //   // Update the state with the merged array
    //   setFilteredData(mergedResults);
    //   setData(mergedResults);
    //   setSelectedItemsForRemoving([]); // Clear the selected items
    //   setLoading(false);
    //   // console.log('Updated meals list:', mergedResults)
    //     //console.log('selectedItemsForRemoving after',selectedItemsForRemoving);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     // Handle the error by showing an alert
    //     Alert.alert(`${t('Failed_to_delete_Meals')}`);
    //   });
    // };
    // const removeSelectedItems = () => {
    //   // selectedItems.forEach((itemSpekey) => {
    //   //   dispatch(removeEntry(itemSpekey));
    //   //   setData((prevData) => prevData.filter((item) => item.speKey !== itemSpekey)); // Update local state
    //   // });
    //   // dispatch(clearSelectedItems());
    //   // // After removing selected items, update the data in the local state
    //   // setData((prevData) => {
    //   //   // Filter out the removed items
    //   //   const updatedData = prevData.filter((item) => !selectedItems.includes(item.speKey));

    //   //   // Reassign new IDs to the remaining items
    //   //   const updatedDataWithNewIds = updatedData.map((item, index) => ({
    //   //     ...item,
    //   //     id: index + 1, // Assuming IDs start from 1, you can adjust accordingly
    //   //   }));

    //   //   return updatedDataWithNewIds;
    //   // });
    //   //console.log('selectedItemsForRemoving',selectedItemsForRemoving);
    //   setLoading(true);
    //   SoftDeleteSelectedMeals(selectedItemsForRemoving)
    //   .then((result) => {
    //     //console.log('Day Meals deleted turned into yes successfully', result);
        
    //     // Fetch and update the Meals after soft deleting a Meals
    //     return Promise.all([
    //       fetchAlltDaysPredefinedMeals(userId),
    //       fetchAlltDaysListOfFoods(userId)
    //     ]);
    //   })
    //   .then(([PMResults, LOFResults]) => {
      
    //     // Merge the arrays from both tables
    //   const mergedResults = [...LOFResults, ...PMResults];
    //   console.log('Updated LOFResults:', LOFResults)

    //   // Update the state with the merged array
    //   setFilteredData(mergedResults);
    //   setData(mergedResults);
    //   setSelectedItemsForRemoving([]); // Clear the selected items
    //   setLoading(false);
    //   console.log('Updated meals list:', mergedResults)
    //     //console.log('selectedItemsForRemoving after',selectedItemsForRemoving);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //     // Handle the error by showing an alert
    //     Alert.alert(`${t('Failed_to_delete_Meals')}`);
    //   });
    // };
    const handleInputChange = (itemSpekey, text) => {
      // Update the data array with the entered text
      setFilteredData((prevData) => {
          return prevData.map((item) =>
          item.speKey === itemSpekey ? { ...item, enteredData: text } : item
          );
      });
  
      };
      
      const getEnteredData = (itemSpekey) => {
      // Retrieve entered data for a specific item
      const item = filteredData.find((i) => i.speKey === itemSpekey);
      return item ? item.enteredData || '' : '';
      };
       /// adding one meal into today's meals in the expo sqlite database 
       const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const addEntryHandler = (mealWeight,item) => {
        if (mealWeight.trim() == "") {
          Alert.alert(`${t("You_must_fill_Meal_Weight_field")}`);
          return;
        };
        //hideModal();
        setLoading(true);
        setShowSuccess(false); // Reset success state
      
          const newData = {
            userId:userId,
            speKey:speKey,
            food_description: item?.foddes,
            date:new Date().toISOString().split('T')[0],
            time:timeNow,
            weight: parseFloat(mealWeight),
            protein: parseFloat((mealWeight *item?.protin).toFixed(4)),
            carbohydrates:  parseFloat((mealWeight *item?.carbs).toFixed(4)),
            fats:  parseFloat((mealWeight *item?.fats).toFixed(4)),
            calories: parseFloat((mealWeight * item?.calris).toFixed(4)),
            Type: item?.Type ? item?.Type: "",
            Subtype: "",
            Saturated: item?.Satrtd ? parseFloat((item?.Satrtd*mealWeight).toFixed(4)) : "",
            Polyunsaturated: item?.Plnstd ? parseFloat((item?.Plnstd*mealWeight).toFixed(4)) : "",
            Monounsaturated: item?.Munstd ? parseFloat((item?.Munstd*mealWeight).toFixed(4)) : "",
            Trans: item?.Trans ? parseFloat((item?.Trans*mealWeight).toFixed(4)) : "",
            Sodium: item?.Sodium ? parseFloat((item?.Sodium*mealWeight).toFixed(4)) : "",
            Potassium: item?.Potsim ? parseFloat((item?.Potsim*mealWeight).toFixed(4)) :"",
            Cholesterol: item?.Chostl ? parseFloat((item?.Chostl*mealWeight).toFixed(4)) : "",
            Vitamin_A: item?.VtminA ? parseFloat((item?.VtminA*mealWeight).toFixed(4)) : "",
            Vitamin_C: item?.VtminC ? parseFloat((item?.VtminC*mealWeight).toFixed(4)):"",
            Calcium: item?.Calcim ? parseFloat((item?.Calcim*mealWeight).toFixed(4)) : "",
            Iron: item?.Iron ? parseFloat((item?.Iron*mealWeight).toFixed(4)) : "",
            images:item?.images ? item?.images : "",
            deleted:'no',
            isSync:'no'
          
      
         
        };
        //console.log('newData',newData);
        insertPlansTodayMeals(newData).then((TMResults) => {
          //console.log('insert Meal in TodayMeals succesfully:', TMResults);
          setLoading(false);
          setShowSuccess(true); // Show success message and animation
          // Delay to allow users to see the success message before closing the modal
          setTimeout(() => {
            setShowSuccess(false);
          }, 2000); // 2 seconds delay
          })
          .catch((error) => {
          setLoading(false);
          Alert.alert('Error', 'Failed to add the meal.');
          //console.log('Error insert Meals in TodayMeals:', error);
      });
      };
        return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t("All_meals")}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('CreateNewMealInListOfFoods')}>
                    <CalendarFullSizePressableButtonText >{t("Add_food")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    
                  </FormElemeentSizeButtonView>
                  {/* <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={removeSelectedItems}
           >
                    <CalendarFullSizePressableButtonText >{t("Remove")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView> */}
                </FormElemeentSizeButtonParentView>
              </Spacer>
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
                      <Text style={styles.successText}>{t('Your_New_Meals_added_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
            <View style={{marginBottom:20,marginRight:10,marginLeft:10,marginTop:10}}>
              <FormInput
                placeholder={t("Search")}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                theme={{colors: {primary: '#3f7eb3'}}}
              />
              
            <FilterTextView >
              <FilterTextPressable  onPress={()=>
                  {toggleFilter();
                    clearFilter();
                  }}>
                <FilterText>{t("Filter")}</FilterText>
                </FilterTextPressable>
              </FilterTextView>
              {showFilter && (
                <FilterContainer >
                  
                    <Spacer size="medium">
                        <TraineeOrTrainerField>
                            <FormLabelView>
                            <FormLabel>{t("Meals")}:</FormLabel>
                            </FormLabelView>
                          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
                            <TraineeOrTrainerButtonField >
                              <RadioButton
                                value="All"
                                status={ selectedFilter === 'All' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('All')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                                
                              />
                              <FormLabel>{t("All")}</FormLabel>
                          </TraineeOrTrainerButtonField>
                            <TraineeOrTrainerButtonField>
                              <RadioButton
                                value="Own"
                                status={ selectedFilter === 'Own' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('Own')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                              />
                              <FormLabel>{t("Own")}</FormLabel>
                            </TraineeOrTrainerButtonField>
                            <TraineeOrTrainerButtonField >
                              <RadioButton
                                value="Predefined"
                                status={ selectedFilter === 'Predefined' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('Predefined')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                                
                              />
                              <FormLabel>{t("Predefined")}</FormLabel>
                          </TraineeOrTrainerButtonField>
                        </TraineeOrTrainerButtonsParentField>
                      </TraineeOrTrainerField>
                    </Spacer>
                    <ClearFilterTextView>
                    <ClearFilterTouchableOpacity onPress={clearFilter}>
                      <ClearFilterText>{t('Clear_Filter')}</ClearFilterText>
                      </ClearFilterTouchableOpacity>
                    </ClearFilterTextView>
                    
                    
                </FilterContainer>
              )}


              {
                (loadingPageInfo)?(
                  <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}
                  // onRequestClose={() => {
                  //   setIsLoading(!isLoading);
                  // }}
                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
                </Modal>
                ):(
                (filteredData.length == 0)?(
                  <View style={{height:240, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{color:'#3f7eb3',fontSize:20,marginBottom:10,}}>{t("No_Meals_Found")}</Text>
                    {/* <ActivityIndicator size="large" /> */}
                  </View>
                ):(
              <Spacer size="medium">
              <FlatList
                data={visibleData}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <MemoizedExerciseParentView item={item} navigation={navigation}  setFilteredData={setFilteredData} filteredData={filteredData} selectedItems={selectedItems} selectedItemsForRemoving={selectedItemsForRemoving} setSelectedItemsForRemoving={setSelectedItemsForRemoving} handleInputChange={handleInputChange} getEnteredData={getEnteredData} addEntryHandler={addEntryHandler}/>}
                removeClippedSubviews={true}
                
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' ,marginTop:20}}>
                {renderPaginationButtons()}
              </View>
              </Spacer> 
                )
                )
                }
            </View>
        </ScrollView>
      </PageContainer>
        );
      };  
// Update your styles
const styles = {
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
};