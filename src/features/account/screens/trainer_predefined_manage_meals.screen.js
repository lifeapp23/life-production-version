
import React, { useState, useEffect } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Dimensions,Pressable} from "react-native";
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
  FormElemeentSizeButtonView,
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
import { useDispatch, useSelector } from 'react-redux';
import { TrainerTraineeManageMealsCalendarScreen } from "./trainer_trainee_manage_meals_calendar";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');


  
export const TrainerPredefinedManageMealsPlansScreen = ({navigation,route}) => {
  const { t, i18n } = useTranslation();

  const [editedPlansEntry, setEditedPlansEntry] = useState(null);
  const [isEditPlansMode, setIsEditPlansMode] = useState(false);
  const dispatch = useDispatch();
  const [modalNewPlansVisible,setModalNewPlansVisible] = useState('');
  // const [traineeId,setTraineeId] = useState('');
  const [userId,setUserId] = useState('');
  
  const [userToken,setUserToken] = useState('');
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [plansDataTable, setPlansDataTable] = useState([]);
  const speKey = userId + '.' + new Date().getTime();
  const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
      setShowInfo(!showInfo);
    };

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


          axios.get(`https://www.elementdevelops.com/api/get-meals-trainer-predefined-plans?trainerId=${storedUser.id}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            ////console.log('measurements::',response.data);
            //console.log("response?.data[getTrainerPlans]",(response?.data["getTrainerPlans"])?.length);
            // if((response?.data["getTrainerPlans"])?.length == 0 && storedUser.id != TrainerTraineeCameData?.trnrId){
            //   Alert.alert(` `,
            //     `${t('You_are_not_subscribed_to_a_personal_trainer')}`,
            //     [
            //       {
            //         text: 'Start Searching',
            //         onPress: () => {
            //           navigation.navigate('PersonalTrainerSearch');
            //         },
                    
            //       },
            //     ],
            //     { cancelable: false }
            //   );
            // }
            setPlansDataTable(response?.data["getTrainerPlans"]);
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching Meals:', error);
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
      axios.post(`https://www.elementdevelops.com/api/trainer-meals-predefined-plans-remove`, item)
      .then((response) => {
          ////console.log('Trainer Pricing data sent to online Database', response?.data?.message);
          setPlansDataTable(response?.data?.getTrainerPlans)
          Alert.alert(`${t('Your_Plan_Deleted_from_Database_successfully')}`);
              });

   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };
  



 
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
                <ServicesPagesCardHeader>{t('Predefined_meals_Plans')}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                <ServiceInfoParentView >
                  {showInfo ? (
                    <ServiceCloseInfoButtonView>
                      <ServiceCloseInfoButton onPress={toggleInfo}>
                        <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                      </ServiceCloseInfoButton>
                      <ServiceCloseInfoButtonTextView>
                        <ServiceCloseInfoButtonText>{t("trainer_predefined_manage_meals_page_desc")}</ServiceCloseInfoButtonText>
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
            <View style={styles.container}>
            <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plans')}</FormLabel>
            </FormLabelView> 

              {plansDataTable?.map((onePlans) => (
                <View key={onePlans.id} style={styles.viewContainer}>
                  <View style={styles.plansContainer}>
                    <View style={{width:130,}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width: width - 90,marginRight:10,height: 'auto',minHeight: 49,}} onPress={()=>navigation.navigate('TrainerPredefinedMealPlanNumber',{publicMealsPlanRow:onePlans})}>
                        <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{onePlans?.plnNam || ''}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                    </View>
                    {/* <Text style={[styles.plansTextValues,styles.plansStartDateText, isCurrentDateInRange(onePlans) && styles.activeDateText,]}>{onePlans?.strDat || `${t('Unlimited')}`}</Text>
                    <Text style={[styles.plansTextValues,styles.plansEndDateText, isCurrentDateInRange(onePlans) && styles.activeDateText,]}>{onePlans?.endDat || `${t('Unlimited')}`}</Text> */}
                  </View>
                    <>
                      <View style={{alignItems:'center', marginVertical: 15,marginRight:10,}}>
                        <Pressable
                          // onPress={() => {showEditPlansModal(onePlans)}}
                          onPress={()=>navigation.navigate('TrainerPredefinedAddEntryPlansMeals',{editedPlansEntry :onePlans, isEditPlansMode:true})}

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
                  
                </View>
                
              ))}
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
              onPress={()=>navigation.navigate('TrainerPredefinedAddEntryPlansMeals')} >
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
              </>
          
              {/* <Modal visible={modalNewPlansVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                <AddEntryPlans   
                  isEditPlansMode={isEditPlansMode}
                  editedPlansEntry={editedPlansEntry}
                  hideModal={hidePlansModal}/>
                </ViewOverlay>
              </Modal> */}
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
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => {
                              navigation.navigate("TrainerTodayMealsNewStyle",{publicWorkoutsPlanRowConArr:plansDataTable});
                            }} >
                    <CalendarFullSizePressableButtonText >{t('Today_Meal')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              </>
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

  