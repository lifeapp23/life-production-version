
import React, { useState, useEffect } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';

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
import { WorkoutPlansCalendarScreen } from "./workout_plans_custom_calendar";
import { PlanNumberScreen } from "./plan_number.screen";
import { useFocusEffect } from '@react-navigation/native';
import { insertPublicWorkoutsPlans,insertUnlimitedPlansPublicWorkoutsPlans,fetchPublicWorkoutsPlans,fetchPublicWorkoutsPlansWithoutDeleting,SoftDeletePublicWorkoutsPlans,updatePublicWorkoutsPlans,updateUnlimitedPlansPublicWorkoutsPlans } from "../../../../database/public_workouts_plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,SoftDeletePublicWorkoutsPlanAllDays } from "../../../../database/public_workouts_plan_days";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
  



 


  

  //console.log('new Date().getTime()',1 +'.' + new Date().getTime());


  export const AddEntryPlansScreen =({navigation,route})=>{
    /// {isEditPlansMode,editedPlansEntry,hideModal}

    const params = route.params || {};

    const { editedPlansEntry = {}, isEditPlansMode = false } = params;

    const {t} = useTranslation();//add this line

    const [userId,setUserId] = useState('');
    useFocusEffect(
      React.useCallback(() => {
        // Fetch the latest data or update the state here
      AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        //console.log('publicWorkoutsPlans user---->>>',storedUser);
        setUserId(storedUser.id);
        
          
       
        });
      }, [AsyncStorage])
      );
    const [plansAddEntry, setPlansAddEntry] = useState("");     
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [startDateBoolean,setStartDateBoolean] = useState(null);
    const [endDateBoolean,setEndDateBoolean] = useState(null);
    const [selectingStartDate, setSelectingStartDate] = useState(false);
    const [planTypeCheckBox, setPlanTypeCheckBox] = useState(false); // Limited or Unlimited

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
  const addPlansEntryHandler = () => {
    if(plansAddEntry === "" || plansAddEntry.trim() === "" ) { 
      Alert.alert(`${t('Plan_name_field_are_required')}`); 
      return;
    }
    if(!planTypeCheckBox){
      if(!startDateBoolean || !endDateBoolean) { 
        Alert.alert(`${t('start_and_end_dates_are_required_for_limited_plans')}`); 
        return;
      }
      if (endDateBoolean < startDateBoolean) {
        Alert.alert(`${t('Start_date_must_be_before_end_date')}`); 
        return;
      }
    }
      const newPublicPlansData = {
        userId:userId,
        speKey:userId +'.' + new Date().getTime(),
        name:plansAddEntry,
        startDate:startDateBoolean,
        endDate: endDateBoolean,
        deleted:'no',
        isSync: 'no'
      };
      if(!planTypeCheckBox){
      insertPublicWorkoutsPlans(newPublicPlansData)
      .then((PublicPlansDataResults) => {
        //console.log('Public Plans DataResults added successfully', PublicPlansDataResults);
        // Fetch and update the PublicWorkoutsPlansArray after adding a new PublicWorkoutsPlansArray
        Alert.alert(``,
          `${t('new_plan_add_successfully')}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('WorkoutPlans');
              },
              
            },
          ],
          { cancelable: false }
        );      })
      .catch((error) => {
        // Handle the error by showing an alert
        // console.log('error',error);
        Alert.alert(` `, `${t(error)}`);
      });
    }else{
      
      insertUnlimitedPlansPublicWorkoutsPlans(newPublicPlansData)
      .then((PublicPlansDataResults) => {
        //console.log('Public Plans DataResults added successfully', PublicPlansDataResults);
        // Fetch and update the PublicWorkoutsPlansArray after adding a new PublicWorkoutsPlansArray
        Alert.alert(``,
          `${t('new_plan_add_successfully')}`,
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('WorkoutPlans');
              },
              
            },
          ],
          { cancelable: false }
        );      })
      .catch((error) => {
        // Handle the error by showing an alert
        Alert.alert(` `, `${t(error)}`);
      });

      }
      
    
  };
  useEffect(() => {
    if (isEditPlansMode) {
      navigation.setOptions({ title: `${t("Edit_plans")}` });
      // If in edit mode, populate the form fields with the data from the edited entry
      setPlansAddEntry(editedPlansEntry?.plnNam);
      const start = editedPlansEntry?.stDate;
      const end = editedPlansEntry?.edDate;
      console.log('start udaped ',start);
      if(!start && !end){
        setPlanTypeCheckBox(true);
      }
      setStartDateBoolean(start);
      setEndDateBoolean(end);
    }
  }, [isEditPlansMode,editedPlansEntry]);
  //console.log('editedPlansEntry',editedPlansEntry);

  const editPlansEntryHandler = (PublicWorkoutsPlansArray,plansAddEntry, startDateBoolean ,endDateBoolean) => {
    //console.log('PublicWorkoutsPlansArray editPlansEntryHandler',PublicWorkoutsPlansArray);
    //console.log('plansAddEntry editPlansEntryHandler',plansAddEntry);
    //console.log('selectedDates editPlansEntryHandler',selectedDates);
//|| plansAddEntry.trim() === ""

      if(plansAddEntry === "" || plansAddEntry.trim() === "" ) { 
        Alert.alert(`${t('Plan_name_field_are_required')}`); 
        return;
      }
      if(!planTypeCheckBox){
        if(!startDateBoolean || !endDateBoolean) { 
          Alert.alert(`${t('start_and_end_dates_are_required_for_limited_plans')}`); 
          return;
        }
        if (endDateBoolean < startDateBoolean) {
          Alert.alert(`${t('Start_date_must_be_before_end_date')}`); 
          return;
        }
      }
      if(!planTypeCheckBox){
        updatePublicWorkoutsPlans(PublicWorkoutsPlansArray,plansAddEntry, startDateBoolean ,endDateBoolean)
          .then((result) => {
            //console.log('PublicWorkoutsPlans updated  successfully', result);
            Alert.alert(``,
              `${t('current_plan_updated_successfully')}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.navigate('WorkoutPlans');
                  },
                  
                },
              ],
              { cancelable: false }
            );
          })
          .catch((error) => {
            Alert.alert(` `, `${t(error)}`);
            // Handle the error (e.g., show an alert)
          });
        }else{
          updateUnlimitedPlansPublicWorkoutsPlans(PublicWorkoutsPlansArray,plansAddEntry, startDateBoolean ,endDateBoolean)
          .then((result) => {
            //console.log('PublicWorkoutsPlans updated  successfully', result);
            Alert.alert(``,
              `${t('current_plan_updated_successfully')}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.navigate('WorkoutPlans');
                  },
                  
                },
              ],
              { cancelable: false }
            );
          })
          .catch((error) => {
            Alert.alert(` `, `${t(error)}`);
            // Handle the error (e.g., show an alert)
          });

        }
  
    // Clear the edited entry state
    
    // Close the modal
    
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
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Plan_Name")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Plan_Name")}
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
              <FormLabelView style={{width:"50%",marginLeft:10}}>
                <FormLabel>{t("unlimited_Plans")}:</FormLabel>
              </FormLabelView>
              <Checkbox
                  status={planTypeCheckBox ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setPlanTypeCheckBox(!planTypeCheckBox);
                    if(planTypeCheckBox != true){
                      setStartDateBoolean('');
                      setEndDateBoolean('');

                    }
                  }}
                  color="black"
                  uncheckedColor="black"
                />
           </InputField>
           </Spacer>
          <Spacer size="medium">
            <InputField>

                {/* <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
          onPress={handleOpenCalendar}>
                  <CalendarFullSizePressableButtonText >{t("Select_Dates")}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton> */}
              <WorkoutPlansCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onDateSelect={handleDateSelect} />
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <CalendarFullSizePressableButton
          onPress={openStartDateSelector} 
          style={[
            { width: "48%",backgroundColor:'#000'},
            planTypeCheckBox && styles.disabledButton,
            ]}
            disabled={planTypeCheckBox}
          >
            <CalendarFullSizePressableButtonText >{t("Start_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{startDateBoolean ? startDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <CalendarFullSizePressableButton style={[
            { width: "48%",backgroundColor:'#000'},
            planTypeCheckBox && styles.disabledButton,
            ]}
            disabled={planTypeCheckBox}
          onPress={openEndDateSelector}>
            <CalendarFullSizePressableButtonText >{t("End_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{endDateBoolean ? endDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
      <Spacer size="large">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                  if (isEditPlansMode) {
                  // If in edit mode, call the edit handler
                  editPlansEntryHandler(editedPlansEntry,plansAddEntry, startDateBoolean ,endDateBoolean);
                  } else {
                    // If in add mode, call the add handler
                    addPlansEntryHandler();
                  }
                  }}>
              <CalendarFullSizePressableButtonText>
                {isEditPlansMode ? `${t('Edit_plans')}` : `${t('Add_New_plans')}`}
              </CalendarFullSizePressableButtonText>
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

  