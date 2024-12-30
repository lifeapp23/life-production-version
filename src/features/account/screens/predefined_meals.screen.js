import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { ScrollView,View, Modal,Alert,Text,TouchableOpacity} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Asset } from 'expo-asset';
import { mainMealsData } from "../../../../main_data/main_meals_data_with_require";
import "./i18n";
import { useTranslation } from 'react-i18next';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { MaterialCommunityIcons } from '@expo/vector-icons';


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

  
  } from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { addEntry,removeEntry } from './predefined_store';
import { toggleItemSelection, clearSelectedItems } from './selectedItems';
import { fetchAlltDaysPredefinedMeals,SoftDeleteSelectedMeals} from "../../../../database/predefined_meals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';


const MealsCheckButtonCom = React.memo(({item}) => {
  ////console.log('item',item);
///////////
const [gramsinputsValues,setGramsInputsValues]= useState('');
const {t} = useTranslation();


  useEffect(() => {
    ////console.log('newCheckSignState',newCheckSignState);

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
            
          </FormInputView>
          <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:2}}>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t("short_Calories")}:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.calris).toFixed(5))): (parseFloat((item.calris *100).toFixed(5)))}</ExerciseInfoTextTag>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t("short_Carbs")}:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.carbs).toFixed(5))): (parseFloat((item.carbs *100).toFixed(5)))}</ExerciseInfoTextTag>
          </View>
          <View style={{flexDirection:"row",justifyContent:"space-between"}}>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t("short_Protein")}:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.protin).toFixed(5))): (parseFloat((item.protin *100).toFixed(5)))}</ExerciseInfoTextTag>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t("short_Fats")}:{(gramsinputsValues)? (parseFloat((gramsinputsValues *item.fats).toFixed(5))): (parseFloat((item.fats *100).toFixed(5)))}</ExerciseInfoTextTag>
          </View>
          </>   
      );

});

const MemoizedExerciseParentView = React.memo(({ item, navigation, setFilteredData,filteredData,selectedItems,handleInputChange,getEnteredData}) => {
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
            <MealsCheckButtonCom item={item} />
        
          
      </ExerciseInfoParentView>
      
    </ExerciseParentView>
  );
});
  export const PredefinedMealsScreen = ({navigation,route}) => {
      const [searchQuery, setSearchQuery] = useState('');
      //const [modalVisible,setModalVisible] = useState('');
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);


      const dispatch = useDispatch();
      const predefined_data = useSelector(state => state.predefinedData.predefinedData);
      const selectedItems = useSelector((state) => state.selectedItems);
      useEffect(() => {
        const saveNewPredefinedMealsImage = async () => {
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
        const asseto =  saveNewPredefinedMealsImage();
        ////console.log('Asset.fromModule localUri',asseto);
      }, []); 
      const [data, setData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
      const [userId, setUserId] = useState('');
      useFocusEffect(
        React.useCallback(() => {
        

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {

            const storedUser = JSON.parse(user);
            setUserId(storedUser.id);
            ////console.log('predefined meals user',storedUser);
            fetchAlltDaysPredefinedMeals().then((PMResults) => {
              // setFetchedData(WResults);
              setData(PMResults);
              ////console.log('PredefinedMealsTable:', PMResults);
                }).catch((error) => {
                ////console.log('Error fetching PredefinedMealsTable:', error);
            });
           
              
            
            })
            
        });
       
        }, [])
      );
      
      const filterData = () => {
      const filtered = data.filter((item) => {
        const nameMatches = item.foddes.toLowerCase().includes(searchQuery.toLowerCase());
        if(nameMatches){
          setCurrentPage(1);
        }
            return nameMatches;
        });

        setTotalItems(filtered?.length);
        //console.log('filtered?.length',filtered?.length);
        setTotalPages(Math.ceil(filtered?.length / pageSize));
        //console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));
        setFilteredData(filtered);
        //console.log('filtered',filtered);
      };  
      

      useEffect(() => {
          filterData();
        }, [searchQuery, data]); 
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
    
        return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t("Predefined")}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>

            <View style={{marginBottom:20,marginRight:10,marginLeft:10,marginTop:10}}>
              <FormInput
                placeholder={t("Search")}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                theme={{colors: {primary: '#3f7eb3'}}}
              />
              {(filteredData.length == 0)?(
                  <View style={{height:240, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{color:'#3f7eb3',fontSize:25,marginBottom:10,}}>{t("Loading")}...</Text>
                    {/* <ActivityIndicator size="large" /> */}
                  </View>
                ):(
              <Spacer size="medium">
              <FlatList
                data={visibleData}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <MemoizedExerciseParentView item={item} navigation={navigation}  setFilteredData={setFilteredData} filteredData={filteredData} selectedItems={selectedItems}  handleInputChange={handleInputChange} getEnteredData={getEnteredData}/>}
                removeClippedSubviews={true}
                
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' ,marginTop:20}}>
                  {renderPaginationButtons()}
                </View>
              </Spacer> 
                )}
            </View>
        </ScrollView>
      </PageContainer>
        );
      };  
