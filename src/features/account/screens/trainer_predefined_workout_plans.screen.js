
import React, { useState, useEffect } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable,Dimensions} from "react-native";
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
import { addPlansEntry,removePlansEntry,editPlansEntry} from './trainer_manage_workouts';
import { TrainerTraineeWorkoutPlansCalendarScreen } from "./trainer_trainee_workout_plans_calendar";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');


  
export const TrainerPredefinedWorkoutPlansScreen = ({navigation,route}) => {
  const { t, i18n } = useTranslation();
////console.log("TrainerTraineeCameData-----",TrainerTraineeCameData);
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


          axios.get(`https://life-pf.com/api/get-trainer-predefined-plans?trainerId=${storedUser.id}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            ////console.log('measurements::',response.data);
            //console.log("response?.data[getTraineePlans]",(response?.data["getTraineePlans"])?.length);
            // if((response?.data["getTraineePlans"])?.length == 0 && storedUser.id != TrainerTraineeCameData?.trnrId){
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
            setPlansDataTable(response?.data["getTraineePlans"]);
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching Plans:', error);
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
      axios.post(`https://life-pf.com/api/trainer-predefined-plans-remove`, item)
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
  



  // if (userId == TrainerTraineeCameData?.trnrId){
  //   ////console.log('TrainerTraineeCameData?.trnrId',TrainerTraineeCameData?.trnrId);
  //   ////console.log('userId',userId);
  //   ////console.log('yeees');

  // }else{
  //   ////console.log('noo');
  // }
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
                <ServicesPagesCardHeader>{t('Predefined_Workout_Plans')}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
             <Spacer size="large">
                  <ServiceInfoParentView >
                    {showInfo ? (
                      <ServiceCloseInfoButtonView>
                        <ServiceCloseInfoButton onPress={toggleInfo}>
                          <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                        </ServiceCloseInfoButton>
                        <ServiceCloseInfoButtonTextView>
                          <ServiceCloseInfoButtonText>{t("trainer_predefined_workouts_plans_desc")}</ServiceCloseInfoButtonText>
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
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width: width - 90,marginRight:10,height: 'auto',minHeight: 49,}} onPress={()=>navigation.navigate('TrainerPredefinedWorkoutPlanNumber',{publicWorkoutsPlanRow:onePlans})}>
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
                          onPress={()=>navigation.navigate('TrainerAddEntryPredefinedWorkoutPlan',{editedPlansEntry :onePlans, isEditPlansMode:true})}

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
                <Spacer size="medium">
                  <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
              onPress={()=>navigation.navigate('TrainerAddEntryPredefinedWorkoutPlan')} >
                      <CalendarFullSizePressableButtonText >{t('Add_New_plans')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonParentView>
                </Spacer>
          
              
              
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

  