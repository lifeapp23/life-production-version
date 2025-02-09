
import React, { useState, useEffect } from 'react';
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
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  FormElemeentSizeButtonView
 
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { TrainerTraineeManageMealsCalendarScreen } from "./trainer_trainee_manage_meals_calendar";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';



  
export const TrainerManageMealsScreen = ({navigation,route}) => {
  const TrainerTraineeCameData = route.params?.TrainerTraineeSent;
  const { t, i18n } = useTranslation();
  const [plansWithItsDays, setPlansWithItsDays] = useState([]);

  const [editedPlansEntry, setEditedPlansEntry] = useState(null);
  const [isEditPlansMode, setIsEditPlansMode] = useState(false);
  const dispatch = useDispatch();
  const [modalNewPlansVisible,setModalNewPlansVisible] = useState('');
  // const [traineeId,setTraineeId] = useState('');
  const [userId,setUserId] = useState('');
  
  const [userToken,setUserToken] = useState('');
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [plansDataTable, setPlansDataTable] = useState([]);
  const speKey = TrainerTraineeCameData?.trnrId + '.' + TrainerTraineeCameData?.trneId + '.' + new Date().getTime();
  console.log('trainer manage meals TrainerTraineeCameData',TrainerTraineeCameData);

  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      ////console.log('tokeeen:',res);
      setUserToken(res);
    AsyncStorage.getItem("currentUser").then((user) => {
  
        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
  
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
        if(state.isConnected){
          ////console.log('---------------now online--------')
          ////console.log('my plans page',TrainerTraineeCameData);


          axios.get(`https://life-pf.com/api/get-trainer-trainee-meals-plans?traineeId=${TrainerTraineeCameData?.trneId}&trainerId=${TrainerTraineeCameData?.trnrId}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            ////console.log('measurements::',response.data);
            console.log("response?.data[existingSubscription]",response?.data["existingSubscription"]);

            if(Object.keys(response?.data["existingSubscription"])?.length == 0 && storedUser.id != TrainerTraineeCameData?.trnrId){
              Alert.alert(` `,
                `${t('You_are_not_subscribed_to_a_personal_trainer')}`,
                [
                  { text: 'Cancel', style: 'cancel', onPress: () => {} },
                  {
                    text: `${t('Start_Searching')}`,
                    style: 'destructive',
                    onPress: () => {
                      navigation.navigate('PersonalTrainerSearch');
                    },
                    
                  },
                ],
                { cancelable: false }
              );
            }else{
            if(response?.data["getTraineePlans"].length > 0){
              setPlansDataTable(response?.data["getTraineePlans"]);

            }else{
              if(storedUser.id == TrainerTraineeCameData?.trneId){
                Alert.alert(`${t(' ')}`,`${t('Personal_trainer_did_not_assign_a_meal_plans_yet')}`);

              }


            }
            }
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching Meals:', error);
          });
          axios.get(`https://life-pf.com/api/get-trainer-meals-predefined-plans-with-its-days?trainerId=${storedUser.id}`, {
            headers: {
              'Authorization': `Bearer ${res}`,
              'Content-Type': 'application/json',
            },
            })
            .then(response => {
              
              //console.log("TrainerPredefinedPlansWithItsDays", response?.data?.["TrainerPredefinedPlansWithItsDays"]);
              setPlansWithItsDays(response?.data?.["TrainerPredefinedPlansWithItsDays"] || []);
              // setPublicWorkoutsPlanDaysTable(response?.data?.["TrainerPredefinedPlansWithItsDays"]);
    
              // TrainerPredefinedPlansWithItsDays [{"endDat": null, "id": 2, "plan_days": [[Object], [Object]], "plnNam": "plan one", "speKey": "11.1727965942532", "strDat": 
                // null, "trnrId": 11}, {"endDat": null, "id": 3, "plan_days": [[Object], [Object]], "plnNam": "plan two", "speKey": "11.1728213378492", "strDat": null, "trnrId": 11}]
                
                
            })
            .catch(error => {
              // Handle error
              ////console.log('Error fetching Days:', error);
            });


        }else{
          ////console.log('else no internet ahmed');
         
                

        }

        });
        
        // Unsubscribe
         unsubscribe();
      })
    });
   
  
  }, [])
  );

  const showAddNewPlansModal = () => {
    setModalNewPlansVisible(true);
    setIsEditPlansMode(false);
    setIsEditPlansMode(false);
  };

  const showEditPlansModal = (entry) => {
    setModalNewPlansVisible(true);
    setIsEditPlansMode(true);
    setEditedPlansEntry(entry);
  };
  const hidePlansModal = () => {
    setModalNewPlansVisible(false);
    setIsEditPlansMode(false);
    setEditedPlansEntry(null);
  };
  const plansDataArr = useSelector(state => state.plansData.plansData);



  const getNextPlansDataId = () => {
    const maxId = Math.max(...plansDataTable.map(item => item.id), 0);
    return maxId + 1;
  };
  const removePlansDataItem = (item) => {
    ////console.log('item,:',item);
    if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-trainee-meals-plan-deleting`, item)
      .then((response) => {
          ////console.log('Trainer Pricing data sent to online Database', response?.data?.message);
          setPlansDataTable(response?.data?.getTraineePlans)
          Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
              });

   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };
  



  const AddEntryPlans =({isEditPlansMode,editedPlansEntry,hideModal})=>{
    
    const [plansAddEntry, setPlansAddEntry] = useState("");     
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [plansEditedSpeKey, setPlansEditedSpeKey] = useState('');
    const [plansEditedId, setPlansEditedId] = useState('');
    
    
  const handleOpenCalendar = () => {
    setCalendarVisible(true);
    
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };
  const handleSelectDateRange = (start, end) => {
    // Check if the selected end date is before the start date
    if (end < start) {
      // Swap the dates if needed
      const temp = start;
      start = end;
      end = temp;
    }
    setSelectedDates({start,end});
    handleCloseCalendar();
  };

  const addPlansEntryHandler = () => {
   
    const newData = {
      trnrId:TrainerTraineeCameData?.trnrId,
      trneId:TrainerTraineeCameData?.trneId,
      speKey:speKey,
      plnNam:plansAddEntry,
      strDat:selectedDates.start,
      endDat: selectedDates.end
    };
    ////console.log('newData: ',newData);
    
  
   if(triainerConnected){
    axios.post(`https://life-pf.com/api/trainer-plans-meals-insert`, newData)
    .then((response) => {
        ////console.log('Trainer plan data sent to online Database', response?.data?.message);
        setPlansDataTable(response?.data?.newData)
        Alert.alert(`${t(' ')}`,`${t('Your_Plan_added_to_Database_successfully')}`,
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
          
            })
            .catch(error => {
              // Handle error
              Alert.alert(error?.response?.data?.message);
            });
  
    // insertTrainerPricingCurrency(newData).then((response) => {
    //   ////console.log('Trainer Pricing data sent to offline database', response);
    //       }).catch(error => {
    //         // Handle error
    //         //console.error('Error inserting Trainer Pricing:', error);
    //       });   
   }else{
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
   
  };
  useEffect(() => {
    if (isEditPlansMode) {
      // If in edit mode, populate the form fields with the data from the edited entry
      setPlansAddEntry(editedPlansEntry?.plnNam);
      const start = editedPlansEntry?.strDat;
      const end = editedPlansEntry?.endDat;
      setSelectedDates({start,end});
      setPlansEditedId(editedPlansEntry?.id);
      setPlansEditedSpeKey(editedPlansEntry?.speKey);
    }
  }, [isEditPlansMode,editedPlansEntry]);

  const editPlansEntryHandler = () => {
    if (plansAddEntry.trim() == "" || !selectedDates?.start || !selectedDates?.end) {
      Alert.alert(`${t('You_must_fill_plan_name_and_select_and_start_and_end_dates_fields')}`);
      return;
    }
    if (editedPlansEntry) {
      const newData = {
        id:plansEditedId,
        trnrId:TrainerTraineeCameData?.trnrId,
        trneId:TrainerTraineeCameData?.trneId,
        speKey:plansEditedSpeKey,
        plnNam:plansAddEntry,
        strDat:selectedDates?.start,
        endDat: selectedDates?.end

      };
      ////console.log('Trainer plan edit', newData);

    
     if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-plans-meals-update`, newData)
      .then((response) => {
          ////console.log('Trainer plan data sent to online Database', response?.data?.message);
          setPlansDataTable(response?.data?.newData);
            Alert.alert(`${t(' ')}`,
              `${t('Your_Plan_updated_to_Database_successfully')}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Clear the edited entry state
                    setEditedPlansEntry(null);
                    // Close the modal
                    hideModal();
                  },
                },
              ],
              { cancelable: false }
            );
          }).catch(error => {
            // Handle error
            
            Alert.alert(error?.response?.data?.message);
          });
    
      
     }else{
      Alert.alert(`${t('To_Add_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
      
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
            <ServicesPagesCardHeader>{isEditPlansMode ? `${t('Edit_plans')}` : `${t('Add_plans')}`}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>{t('Plan_Name')}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t('Plan_Name')}
              value={plansAddEntry}
              keyboardType="default"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setPlansAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
          <Spacer size="medium">
            <InputField>
                <FormLabelView>
                  <FormLabel>{t('Select_Dates')}:</FormLabel>
                </FormLabelView>
                <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
          onPress={handleOpenCalendar}>
                  <CalendarFullSizePressableButtonText >{t('Select_Dates')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                <TrainerTraineeManageMealsCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onSelectDateRange={handleSelectDateRange} TrainerTraineeCameData={TrainerTraineeCameData}/>
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('Start_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates?.start ? selectedDates?.start : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('End_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates?.end ? selectedDates?.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                  if (plansAddEntry && selectedDates.start && selectedDates.end) {
                  if (isEditPlansMode) {
                  // If in edit mode, call the edit handler
                  editPlansEntryHandler({ id: editedPlansEntry.id, updatedData: {plansPercent: plansAddEntry, startDate:selectedDates.start ,endDate:selectedDates.end} });
                  } else {
                    // If in add mode, call the add handler
                    addPlansEntryHandler();
                  }
                  
                }else{Alert.alert(`${t('You_must_fill_plan_name_and_select_and_start_and_end_dates_fields')}`);}}}>
              <CalendarFullSizePressableButtonText>
                {isEditPlansMode ? `${t('Edit_plans')}` : `${t('Add_New_plans')}`}
              </CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}>
            <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="large"></Spacer>
      </ScrollView>
      
      </PageContainer>
    );
  };
  if (userId == TrainerTraineeCameData?.trnrId){
    ////console.log('TrainerTraineeCameData?.trnrId',TrainerTraineeCameData?.trnrId);
    ////console.log('userId',userId);
    ////console.log('yeees');

  }else{
    ////console.log('noo');
  }
  const isCurrentDateInRange = (onePlans) => {
 
    let startDateConst=  onePlans?.strDat;
    let endDateConst=  onePlans?.endDat;
   
        if (startDateConst && endDateConst) {
          const currentDate = new Date();
          const start = new Date(startDateConst);
          const end = new Date(endDateConst);
          //console.log('currentDate test',currentDate);
          //console.log('start test',start);
          //console.log('end test',end);
   
          return currentDate >= start && currentDate <= end;
        }
        return false;
    };
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{TrainerTraineeCameData?.trainee?.fName} {TrainerTraineeCameData?.trainee?.lName} {t('Plans')}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <View style={styles.container}>
            <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plans')}</FormLabel>
            </FormLabelView> 

              {plansDataTable?.map((onePlans) => (
                <View key={onePlans.id} style={styles.viewContainer}>
                  <View style={styles.plansContainer}>
                    <View style={{width:130,}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width:130,height: 'auto',minHeight: 49,}} onPress={()=>navigation.navigate('TrainerPlanMeals',{publicMealsPlanRow:onePlans})}>
                        <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{onePlans?.plnNam || ''}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                    </View>
                    <Text style={[styles.plansTextValues,styles.plansStartDateText, isCurrentDateInRange(onePlans) && styles.activeDateText,]}>{onePlans?.strDat || `${t('Unlimited')}`}</Text>
                    <Text style={[styles.plansTextValues,styles.plansEndDateText, isCurrentDateInRange(onePlans) && styles.activeDateText,]}>{onePlans?.endDat || `${t('Unlimited')}`}</Text>
                  </View>
                  {(userId == TrainerTraineeCameData?.trnrId)?(
                    <>
                      <View style={{alignItems:'center', marginVertical: 15,marginRight:10,}}>
                        <Pressable
                          // onPress={() => {showEditPlansModal(onePlans)}}
                          onPress={()=>navigation.navigate('TrainerAddEntryPlansMeals',{editedPlansEntry :onePlans, isEditPlansMode:true,TrainerTraineeCameData:TrainerTraineeCameData,plansWithItsDaysSent:plansWithItsDays})}

                          style={{  borderRadius: 10, width: 20, height: 20 }}>
                          <AntDesign name="edit" size={20} color="black" />
                        </Pressable>
                      </View>
                      <View style={{alignItems:'center', marginVertical: 15,}}>
                        <Pressable onPress={() => removePlansDataItem(onePlans)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                          <AntDesign name="minuscircleo" size={20} color="white" />
                        </Pressable>
                      </View>
                    </>
                  ):(null)}
                  
                </View>
                
              ))}
              {(userId == TrainerTraineeCameData?.trnrId)?(
                <>
                {/* <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
              onPress={showAddNewPlansModal} >
                      <CalendarFullSizePressableButtonText >{t('Add_New_plans')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonParentView>
                </Spacer> */}
                <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
              onPress={()=>navigation.navigate('TrainerAddEntryPlansMeals',{TrainerTraineeCameData:TrainerTraineeCameData,plansWithItsDaysSent:plansWithItsDays})} >
                      <CalendarFullSizePressableButtonText >{t('Add_New_plans')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonParentView>
                </Spacer>
                {/* <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                    <FormElemeentSizeButtonView style={{width:"100%"}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={()=>navigation.navigate('PredefinedMeals')}>
                      <CalendarFullSizePressableButtonText >{t('Predefined')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    </FormElemeentSizeButtonView>
                  </FormElemeentSizeButtonParentView>
              </Spacer>
              <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                    <FormElemeentSizeButtonView style={{width:"100%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('ListOfFoods')}>
                      <CalendarFullSizePressableButtonText >{t('List_of_Foods')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    </FormElemeentSizeButtonView>
                  </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('AllMealsPage')}>
                      <CalendarFullSizePressableButtonText >{t("All_meals")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  
                </FormElemeentSizeButtonParentView>
              </Spacer>
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('TrainerTraineeRequiredMacrosPage',{TrainerTraineeCameData:TrainerTraineeCameData})}>
                      <CalendarFullSizePressableButtonText >{t("required_macros")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  
                </FormElemeentSizeButtonParentView>
              </Spacer>
              </>
              ):(null)}
          
              <Modal visible={modalNewPlansVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                <AddEntryPlans   
                  isEditPlansMode={isEditPlansMode}
                  editedPlansEntry={editedPlansEntry}
                  hideModal={hidePlansModal}/>
                </ViewOverlay>
              </Modal>
              {(userId == TrainerTraineeCameData?.trneId)?(
                <>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => {
                              navigation.navigate("TrainerTraineeTodayMeals",{publicWorkoutsPlanRowConArr:plansDataTable});
                            }} >
                    <CalendarFullSizePressableButtonText >{t('Today_Meal')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              {(plansDataTable.length == 0)?(
                
                <>
                <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => {
                              navigation.navigate("TrainerTodayMealsNewStyle",{publicWorkoutsPlanRowConArr:plansDataTable,TrainerTraineeCameData:TrainerTraineeCameData});
                            }} >
                    <CalendarFullSizePressableButtonText >{t('Today_Meal')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>

                </>
                ):(
                  null
              )}
              
              </>
              ):(null)}
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={() => navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
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
    marginBottom:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },

  plansContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginRight:15,
  },
  plansCountryText:{
    width:60,
    flexWrap: 'wrap',
    marginRight:4,
  },
  plansTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"black",
    flex: 1,
  },
  headerPlansPlansPercentText:{
    marginLeft:0,
  },
  plansPlansPercentText:{
    marginLeft:0,
  },
  headerPlansStartDateText:{
    marginLeft:-40,
  },
  plansStartDateText:{
    marginLeft:5,
  },
  headerPlansEndDateText:{
    marginLeft:10,
  },
  plansEndDateText:{
    marginLeft:5,
    marginRight:0,
  },
  activeDateText:{
    color:'#3f7eb3',
  },
});

  