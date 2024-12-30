import React, { useState, useEffect ,useRef} from 'react';
import { FlatList } from 'react-native';
import { ScrollView,View, RefreshControl, Modal,Alert,StyleSheet,TouchableOpacity,Image,Text, Animated, Easing} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as FileSystem from 'expo-file-system';
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import { StackActions } from '@react-navigation/native';
import { TrainerTraineeRequiredMacrosCalculator } from "./calendar_bmi_calculator";
import { addEventListener } from "@react-native-community/netinfo";
import axios from 'axios';

import {
    Title,
    TitleView,
    InputField,
    FormInput,
    FormLabel,
    PageContainer,
    NewFormLabelDateRowView,
    FormLabelView,
    FormInputView,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    GenderSelector,
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
    AsteriskTitle,

  
  } from "../components/account.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { insertPlansListOfFoods} from "../../../../database/list_of_foods";
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

export const TrainerTraineeRequiredMacrosPageScreen =({ navigation,route })=>{
  const {t} = useTranslation();
  const params = route.params || {};

  const { TrainerTraineeCameData = {} } = params;
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or any async operation
    setTimeout(() => {
      console.log('Data refreshed!');
      setRefreshing(false); // Stop the refreshing animation
    }, 2000); // Simulated delay
  };

    const [proteinAddEntry, setProteinAddEntry] = useState("");
    const [carbsAddEntry, setCarbsAddEntry] = useState("");
    const [fatsAddEntry, setFatsAddEntry] = useState(""); 
    const [caloriesAddEntry, setCaloriesAddEntry] = useState("");
    const [updateState, setUpdateState] = useState(false);
    const [triainerConnected,setTriainerConnected] =  useState(false);

    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingPageInfo, setLoadingPageInfo] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateShowSuccess, setUpdateShowSuccess] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const checkmarkAnimation = useRef(new Animated.Value(0)).current;
    const speKey = TrainerTraineeCameData?.trnrId + '.' + TrainerTraineeCameData?.trneId + '.' + new Date().getTime();
    const [speKeyState, setSpeKeyState] = useState(speKey ? speKey :'');

    console.log('TrainerTraineeCameData TrainerTraineeRequiredMacrosPageScreen',TrainerTraineeCameData);
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
      if (updateShowSuccess) {
        Animated.timing(checkmarkAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }).start();
      } else {
        checkmarkAnimation.setValue(0); // Reset animation
      }
    }, [updateShowSuccess]);
    useEffect(() => {
      const unsubscribe = addEventListener(state => {
        //////console.log("Connection type--", state.type);
        //////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);

      });
      
      // Unsubscribe when the component unmounts
      return () => {
        unsubscribe();
    };
  
    }, [refreshing]);
    useFocusEffect(
        React.useCallback(() => {

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {
          // setSearchQuery('');
          // setSelectedMuscles(''); 
          // setSelectedEquipments('');
            const storedUser = JSON.parse(user);
            setUserId(storedUser.id);
            
            ////console.log('predefined meals user',storedUser);
            // fetchListOfFoodsTable(storedUser.id).then((WResults) => {
            //   setFetchedData(WResults);
            //   setFilteredData(WResults);
            //     }).catch((error) => {
            //     //console.error('Error fetching ListOfFoodsTable:', error);
            // });
              axios.get(`https://www.elementdevelops.com/api/get-trainer-trainee-last-required-macros?trneId=${TrainerTraineeCameData?.trneId}&trnrId=${TrainerTraineeCameData?.trnrId}`, {
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
                      setProteinAddEntry(response?.data["lastTrainerTraineeRequiredMacros"]?.protin);
                    setCarbsAddEntry(response?.data["lastTrainerTraineeRequiredMacros"]?.carbs);
                    setFatsAddEntry(response?.data["lastTrainerTraineeRequiredMacros"]?.fats);
                    setCaloriesAddEntry(response?.data["lastTrainerTraineeRequiredMacros"]?.calris);
                    setSpeKeyState(response?.data["lastTrainerTraineeRequiredMacros"]?.speKey);
                    setUpdateState(true);

                    }
                    setLoadingPageInfo(false);

                    
                })
                .catch(error => {
                  setLoadingPageInfo(false);

                  // Handle error
                  ////console.log('Error fetching Days:', error);
                });
           
           
              
            const timer = setTimeout(() => {
              setLoadingPageInfo(false);
            }, 3000); // 2 seconds
        
            })
            
        });
       
        }, [])
      );
   
    // Use useEffect to update caloriesAddEntry whenever proteinAddEntry, carbsAddEntry, or fatsAddEntry changes
    useEffect(() => {
      // Check if all three values are filled
        // Perform the calculation and update the caloriesAddEntry state
        const protein = parseFloat(proteinAddEntry) || 0;
        const carbs = parseFloat(carbsAddEntry) || 0;
        const fats = parseFloat(fatsAddEntry) || 0;

        const calories = protein * 4 + carbs * 4 + fats * 9;
        setCaloriesAddEntry(calories ? parseFloat(calories.toFixed(4)) : ""); // Round to two decimal places
      
    }, [proteinAddEntry, carbsAddEntry, fatsAddEntry]);

    const addEntryHandler = async () => {
      
       
      
      if (!proteinAddEntry || !carbsAddEntry || !fatsAddEntry) {
        Alert.alert(`${t('All_fields_are_required')}`); 
        return;
      }
        //////console.log('savedNewListOfFoodsImageConst',savedNewListOfFoodsImageConst);
        const newData = {
          trnrId:TrainerTraineeCameData?.trnrId,
          trneId:TrainerTraineeCameData?.trneId,
          speKey:speKeyState,
          protin: parseFloat(proteinAddEntry),
          carbs: parseFloat(carbsAddEntry),
          fats: parseFloat(fatsAddEntry),
          calris: parseFloat(caloriesAddEntry),
         
        };
        console.log('newData',newData);
        if(triainerConnected){
         
          if( updateState){

            setUpdateLoading(true);
            setUpdateShowSuccess(false); // Reset success state      
            setLoadingPageInfo(false);

          }else{
            setLoading(true);
            setShowSuccess(false); // Reset success state
            setLoadingPageInfo(false);
          }
            axios.post(`https://www.elementdevelops.com/api/trainer-trainee-add-or-update-required-macros`, newData)
            .then((response) => {
                //console.log('Trainer meal delete from online Database');
                //console.log('getTrainerMealPlanDay::,',response?.data["getTrainerMealPlanDay"]);
                  ////console.log('getTrainerPlanDays::,',response?.data["getTrainerPlanDays"]);
                    
                   ////console.log('parsedgetTrainerPlanDaysMalAryone::,',[...parsedgetTrainerPlanDaysMalAry]);
                  
                  if(updateState){
                    setUpdateLoading(false);
                    setUpdateShowSuccess(true); // Show success message and animation
                    // Delay to allow users to see the success message before closing the modal
                    setTimeout(() => {
                      setUpdateState(true);
                      setUpdateShowSuccess(false);
                    }, 2000); // 2 seconds delay
                  }else{
                    setLoading(false);
                    setShowSuccess(true); // Show success message and animation
                    // Delay to allow users to see the success message before closing the modal
                    setTimeout(() => {
                      setUpdateState(true);
                      setShowSuccess(false);
                    }, 2000); // 2 seconds delay
                    
                  }
                    
               
                  
                    })
                    .catch(error => {
                      // Handle error
                      setLoadingPageInfo(false);
      
                      setLoading(false);
                      setUpdateLoading(false);
                      setShowSuccess(false); // Reset success state
                      setUpdateShowSuccess(false); // Reset success state

                      Alert.alert(JSON.stringify(error?.response?.data?.message));
                    });
          
           
           }else{
            setLoadingPageInfo(false);
      
            setLoading(false);
            setUpdateLoading(false);
            setShowSuccess(false); // Reset success state
            setUpdateShowSuccess(false); // Reset success state

            Alert.alert(`${t('To_Add_your_data')}`,
            `${t('You_must_be_connected_to_the_internet')}`);
           } 
        
      };
    const [isImageFullScreenVisible, setImageFullScreenVisible] = useState(false);
  const handleImagePress = () => {
    setImageFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setImageFullScreenVisible(false);
  };
    return (
      <PageContainer>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t('required_macros')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
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
                      <Text style={styles.successText}>{t('Required_Macros_addded_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={updateLoading || updateShowSuccess} // Show when updateLoading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {updateLoading && !updateShowSuccess && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {updateShowSuccess && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      <Text style={styles.successText}>{t('Required_Macros_updated_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
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
        
        {/* <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Name')}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={t("Name")}
                value={nameAddEntry}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setNameAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer> */}
        {/* <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Type")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
             
              
              <GenderSelector
                selectedIndex={selectedType}
                onSelect={(index) => {
                  setSelectedType(index);
                  //console.log('index',index);
                  setTypeChecked(typeData[index?.row]);
                  }}
                placeholder={t('Select_Type')}
                value={typeChecked}
                status="newColor"
                size="customSizo"
                style={{width:"100%"}}
              >
                {typeData.map(renderTypeOption)}
              </GenderSelector>
            </FormInputView>
            </InputField>
        </Spacer> */}
        {/* <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Subtype")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={t("Subtype")}
                value={subtypeAddEntry}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setSubtypeAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer> */}
        {/* <Spacer size="medium">
          <InputField>
          <FormLabelView  style={{width:"42%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Weight")}:</FormLabel>
          </FormLabelView>
          <FormInputView style={{width:"58%"}}>
            <FormInput
              placeholder={t("Weight_100_g")}
              value={weightAddEntry}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer> */}
        {/* <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
              
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Select_Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <TrainerTraineeRequiredMacrosCalculator navigation={navigation}
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
    </Spacer> */}
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Protein")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Protein")}(${t("g")})`}
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
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Carbohydrates")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput 
                placeholder={`${t("Carbs")}(${t("g")})`}
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
          <FormLabelView  style={{width:"42%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Fats")}:</FormLabel>
          </FormLabelView>
          <FormInputView style={{width:"58%"}}>
            <FormInput
              placeholder={`${t("Fats")}(${t("g")})`}
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
                <FormLabelView  style={{width:"42%"}}>
                  <FormLabel>{t("Calories")}:</FormLabel>
                </FormLabelView>
                  <FormLabelDateRowView><FormLabelDateRowViewText>{caloriesAddEntry}</FormLabelDateRowViewText></FormLabelDateRowView>
              </InputField>
            </Spacer>
        <Spacer size="medium">


        
      
      </Spacer>
{/* 
        <Spacer size="small">
          <InputField style={{marginTop:10}}
      >
          <FormLabelView  style={{width:"42%"}}>
          <FormLabel style={{marginLeft:0}}
      >{t('Images')}:</FormLabel>
          <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
              <FormElemeentSizeButtonView style={{width:"100%",marginTop:5}}> 
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={onPressListOfFoodsMedia}>
              <CalendarFullSizePressableButtonText >{t('Add_image')}</CalendarFullSizePressableButtonText>
              </CalendarFullSizePressableButton>
              </FormElemeentSizeButtonView>
          </FormElemeentSizeButtonParentView>
          </FormLabelView>
              <FormInputView style={{width:"58%"}}>
              {(imagesAddEntry !== "")? (
                  <>
                  <TouchableOpacity onPress={handleImagePress}>
                  <Image
                      style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                      source={{
                      uri: `${imagesAddEntry}`
                      }}
                  />
                  </TouchableOpacity>
                  <Modal visible={isImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseFullScreen}>
                  <View style={styles.modalImageOverlay}>
                      <TouchableOpacity style={styles.closeImageButton} onPress={handleCloseFullScreen}>
                      <View style={styles.closeImageButtonInner} >
                      <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                      </View>
                      </TouchableOpacity>
                      <Image style={styles.fullScreenImage} source={{ uri: `${imagesAddEntry}` }} />
                  </View>
                  </Modal>
              </>
              ):(null)}
            
              </FormInputView>
          </InputField>
        </Spacer> */}
      <Spacer size="large">
      <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}>
      
                    {(!updateState)?(
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                        onPress={()=>{
                              addEntryHandler();
                              
                              }}>
                    <CalendarFullSizePressableButtonText >{t("add_new_macros")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    ):(
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                      onPress={()=>{
                            addEntryHandler();
                            
                            }}>
                    <CalendarFullSizePressableButtonText >{t("update_macros")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    )}
                    
                  </FormElemeentSizeButtonView>
                  
                </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="large"></Spacer>
      <Spacer size="large"></Spacer>

      
      </ScrollView>
      
      </PageContainer>
    );
  };

  const styles = StyleSheet.create({
 
       modalImageOverlay: {
       flex: 1,
       backgroundColor: 'rgba(0, 0, 0, 0.9)',
       justifyContent: 'center',
       alignItems: 'center',
     },
     fullScreenImage: {
       width: '100%',
       height: '100%',
       resizeMode: 'contain',
     },
     closeImageButton: {
       position: 'absolute',
       top: 30,
       right: 30,
       zIndex: 1,
     },
     closeImageButtonInner: {
       width: 30,
       height: 30,
       backgroundColor: 'white',
       borderRadius: 15,
       justifyContent:"center",
       alignItems:"center",
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