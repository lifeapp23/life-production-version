
import React, { useState, useEffect,useContext } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';
import AuthGlobal from "../Context/store/AuthGlobal";
import axios from 'axios';

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
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  NewFormLabelDateRowView,
  AsteriskTitle,

 
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addPlansEntry,removePlansEntry,editPlansEntry} from './public_manage_workouts';
import { TrainerOnboardingCurrentTraineesCalendar } from "./trainer_onboarding_trainee_calendar";
import { PlanNumberScreen } from "./plan_number.screen";
import { useFocusEffect } from '@react-navigation/native';
import { insertPublicWorkoutsPlans,insertUnlimitedPlansPublicWorkoutsPlans,fetchPublicWorkoutsPlans,fetchPublicWorkoutsPlansWithoutDeleting,SoftDeletePublicWorkoutsPlans,updatePublicWorkoutsPlans,updateUnlimitedPlansPublicWorkoutsPlans } from "../../../../database/public_workouts_plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,SoftDeletePublicWorkoutsPlanAllDays } from "../../../../database/public_workouts_plan_days";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
  



 


  

  //console.log('new Date().getTime()',1 +'.' + new Date().getTime());


  export const TrainerOnboardingCurrentTraineesScreen =({navigation,route})=>{
    /// {isEditPlansMode,editedPlansEntry,hideModal}

    const params = route.params || {};
    const [userToken, setUserToken] = useState(""); 
     
    
    // const { editedPlansEntry = {}, isEditPlansMode = false } = params;

    const {t} = useTranslation();//add this line

    const [userId,setUserId] = useState('');
    useFocusEffect(
      React.useCallback(() => {
        AsyncStorage.getItem("sanctum_token")
  .then((res) => {
    setUserToken(res);

        // Fetch the latest data or update the state here
      AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        //console.log('publicWorkoutsPlans user---->>>',storedUser);
        setUserId(storedUser.id);
        
          
       
        });

      });
      }, [AsyncStorage])
      );
    const [traineeEmailEntry, setTraineeEmailEntry] = useState("");     
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [startDateBoolean,setStartDateBoolean] = useState(null);
    const [endDateBoolean,setEndDateBoolean] = useState(null);
    const [selectingStartDate, setSelectingStartDate] = useState(false);

    ///select just  one date from calendar 
    const openStartDateSelector = () => {
      setSelectingStartDate(true);
      setCalendarVisible(true);
    };
  
    const openEndDateSelector = () => {
      setSelectingStartDate(false);
      setCalendarVisible(true);
    };
  
    const handleDateSelect = (date) => {
      if (selectingStartDate) {
        setStartDateBoolean(date);
      } else {
        setEndDateBoolean(date);
      }
    };



    ////// end select just one date from calendar 


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
  const addCurrentTraineesEntryHandler = () => {
    if(traineeEmailEntry === "" || traineeEmailEntry.trim() === "" ) { 
      Alert.alert(`${t('You_must_fill_email_field')}`); 
      return;
    }
      if(!startDateBoolean || !endDateBoolean) { 
        Alert.alert(`${t('start_and_end_dates_are_required')}`); 
        return;
      }
      
      if (endDateBoolean < startDateBoolean) {
        Alert.alert(`${t('Start_date_must_be_before_end_date')}`); 
        return;
      }
      // Convert startDate and endDate to Date objects
        const startDateForNinetyDaysCheck= new Date(startDateBoolean);
        const endDateForNinetyDaysCheck = new Date(endDateBoolean);

        // Calculate startDate + 90 days
        const ninetyDaysLaterForNinetyDaysCheck = new Date(startDateForNinetyDaysCheck);
        ninetyDaysLaterForNinetyDaysCheck.setDate(startDateForNinetyDaysCheck.getDate() + 90);
        console.log('startDateForNinetyDaysCheck',startDateForNinetyDaysCheck); 
        console.log('endDateForNinetyDaysCheck',endDateForNinetyDaysCheck); 
        console.log('ninetyDaysLaterForNinetyDaysCheck',ninetyDaysLaterForNinetyDaysCheck); 
        // Calculate the difference in milliseconds
        const differenceInMs = endDateForNinetyDaysCheck - startDateForNinetyDaysCheck;

        // Convert the difference to days
        const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

        console.log(`The period between the start date and end date is ${differenceInDays} days.`);
                // Check if endDate is between startDate and startDate + 90 days
        if (endDateForNinetyDaysCheck > ninetyDaysLaterForNinetyDaysCheck) {
          Alert.alert(`${t('The_maximum_Period_you_can_put_for_the_trainee_ninety_day')}`); 
          return;          
        }
    
     

      axios.post(`https://life-pf.com/api/trainer-Onboarding-Current-Trainee-For-Free`, {
        params:{
          status:"active",
          period:`${differenceInDays} Day`,
          trainerId:userId,
          email:traineeEmailEntry,
          strDat:startDateBoolean,
          endDat: endDateBoolean,
        },
       headers: {
           'Authorization': `Bearer ${userToken}`,
           'Content-Type': 'application/json',
         },
       })
       .then((response) => {
           console.log('response?.data?.value', response?.data?.value);
          //  setShowGateway(response?.data?.value)

           Alert.alert(`${t(' ')}`,`${t('onboarding_current_trainee_done_successfully')}`);


           }).catch(error => {
             // Handle error
             
             Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
           });
      
    
  };
 
 
//console.log('publicWorkoutsPlansTable',publicWorkoutsPlansTable);

    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/Add_New_Plan.jpeg')} 
              // style={{width:320,aspectRatio:1.4}}
            /></ServicesPagesCardCover>
        <Spacer size="medium">
          <InputField>
          <FormLabelView  style={{width:"38%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("trainee_email")}:</FormLabel>
          </FormLabelView>
          <FormInputView style={{width:"62%"}}>
            <FormInput
              placeholder={t("trainee_email")}
              value={traineeEmailEntry}
              keyboardType="default"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setTraineeEmailEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
      
          <Spacer size="medium">
            <InputField>

                {/* <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
          onPress={handleOpenCalendar}>
                  <CalendarFullSizePressableButtonText >{t("Select_Dates")}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton> */}
              <TrainerOnboardingCurrentTraineesCalendar isVisible={isCalendarVisible} onClose={handleCloseCalendar} onDateSelect={handleDateSelect} />
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <CalendarFullSizePressableButton
          onPress={openStartDateSelector} 
          style={{ width: "48%",backgroundColor:'#000'}}
          >
            <CalendarFullSizePressableButtonText >{t("Start_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{startDateBoolean ? startDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <CalendarFullSizePressableButton style={{ width: "48%",backgroundColor:'#000'}}
          onPress={openEndDateSelector}>
            <CalendarFullSizePressableButtonText >{t("End_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{endDateBoolean ? endDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
      <Spacer size="large">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                     addCurrentTraineesEntryHandler();
                  }}>
              <CalendarFullSizePressableButtonText>{t('onboarding_current_trainee')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      {/* <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
            <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
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
    color:"white",
    marginVertical: 15,
    },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
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
  disabledButton: {
    backgroundColor: '#a9a9a9', // Light gray color to indicate disabled state
  },
});

  