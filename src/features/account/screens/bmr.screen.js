import React, { useState,useContext,useEffect,useRef } from "react";
import { StyleSheet,ScrollView,View, Modal,Alert,Text, Animated, Easing} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  NewFormLabelDateRowView,
  AsteriskTitle,
  GenderSelector,
  FullSizeButtonView,
  FullButton,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  PageMainImage,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  FormElemeentSizeButton,
  FormInputSizeButton,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  ServiceCloseInfoButton,
  ServiceCloseInfoButtonAvatarIcon,
  ServiceCloseInfoButtonText,
  ServiceInfoButtonView,
  ServiceInfoButton,
  ServiceInfoButtonAvatarIcon,
  ServiceCloseInfoButtonTextView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  TraineeOrTrainerField,
  TraineeOrTrainerButtonField,
  TraineeOrTrainerButtonsParentField,
  ViewOverlay,
  FormHalfInputView,
  FormHalfInput,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,

} from "../components/account.styles";
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import { fetchbodyStatsAndMeasurementsLastInsertedRow,fetchbodyStatsAndMeasurementsDateTheSameDateInCalculator } from "../../../../database/B_S_and_measurements"; 

import { Spacer } from "../../../components/spacer/spacer.component";
import { RadioButton} from "react-native-paper";
import { useDate } from './DateContext'; // Import useDate from the context
import { PlansScreen } from "./plans.screen";
import { CalendarBmrCalculator } from "./calendar_bmr_calculator";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchCalculatorsTable,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
 
import { useFocusEffect } from '@react-navigation/native';
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';

export const BMRScreen = ({ route, navigation }) => {
  const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;
  const [dateFromDb,setDateFromDb] = useState("");

  const [heightBmr, setHeightBmr] = useState("");
  const [heightFeetBmr, setHeightFeetBmr] = useState("");
  const [heightInchesBmr, setHeightInchesBmr] = useState("");
  const [weightBmr, setWeightBmr] = useState("");
  const [ageBmr, setAgeBmr] = useState("");  
  const [equaChecked, setEquaChecked ] = useState('');
  const [genderChecked, setGenderChecked ] = useState('');
  const [genderCheckedToCompare, setGenderCheckedToCompare ] = useState('');
  const [selectedGender, setSelectedGender] =  useState("");
  const { selectedDate } = useDate(); // Access selectedDate from the context

  ////////////// Start genderData////////////////
  const genderData = [
    'Him',
    'Her',
  ];
  const renderGenderOption = (title,i) => (
    <SelectItem title={title} key={i} />
  );
  
  ////////////// End genderData////////////////

  const [unitsChecked, setUnitsChecked ] = useState('');
  const [bmrResult, setBmrResult] = useState(null); 
  const [userId,setUserId] = useState('');
  const context = useContext(AuthGlobal);
  const [calculatorsTableLastInsertedRow,setCalculatorsTableLastInsertedRow] = useState({});
  const {t} = useTranslation();//add this line
  const [loading, setLoading] = useState(false);
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: calculatorsTableLastInsertedRow?.date;
  const [updateShowSuccess, setUpdateShowSuccess] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

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
  function cmToFeetAndInches(cm) {
    const feet = Math.floor(cm / 30.48);
  
    // How to have inches match up?
    const inches = ((cm - feet * 30.48) * 0.393701).toFixed(2);
    return { feet, inches };
  }
  function feetAndInchesToCm(feet, inches) {
    const newInches = inches || 0;
    const cmTotal = feet * 30.48 + newInches * 2.54;
    return cmTotal;
  }


  useEffect(() => {

      // Fetch the latest data or update the state here
    AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      console.log('BMR calculator user selectedDate---->>>',selectedDate);
      setUserId(storedUser.id);
      
      const loadData = async () => {
        
        if(Object.keys(context.stateUser.userPublicSettings).length > 0){
          // setHeightBmr(context.stateUser.userPublicSettings.height);
         
         
          setUnitsChecked(context.stateUser.userPublicSettings.units);
          
          setGenderChecked(context.stateUser.userProfile.gender);
          setGenderCheckedToCompare(context.stateUser.userProfile.gender);
          const genderIndex = genderData.indexOf(context.stateUser.userProfile.gender);
          //console.log('genderIndex userPublicSettings',genderIndex);
          setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));

          fetchCalculatorsTableLastInsertedRow(storedUser.id,"bmrCal").then(async (calculatorsResults) => {
            //console.log('BMR calculatorsResults-->',calculatorsResults);
            const newDate = selectedDate ? selectedDate : calculatorsResults?.date ? calculatorsResults?.date : "";
        const bodyStatsRowDateTheSameOrLastDate = await fetchbodyStatsAndMeasurementsDateTheSameDateInCalculator(storedUser.id,newDate);
        console.log('BMR bodyStatsRowDateTheSameOrLastDate-->',bodyStatsRowDateTheSameOrLastDate);
        setCalculatorsTableLastInsertedRow(calculatorsResults);

            let newSentAge = calculatorsResults?.age ? calculatorsResults?.age : context.stateUser.userPublicSettings.age;
            setAgeBmr(newSentAge);

            if(selectedDate == calculatorsResults?.date || !selectedDate){
              let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : bodyStatsRowDateTheSameOrLastDate?.height ? bodyStatsRowDateTheSameOrLastDate?.height.toFixed(2) : context.stateUser.userPublicSettings?.height?.toFixed(2);
            console.log('BMR heightComeFromDbOrSaved-->',heightComeFromDbOrSaved);

            const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches
            const heightComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
            ////console.log('heightComeFromDatabase',heightComeFromDatabase);
            if(context.stateUser.userPublicSettings.units =="Metrics"){
              const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
              setHeightBmr(heightComeFromDatabaseWithoutNaN);

            }else{
              const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
              const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
              setHeightFeetBmr(heightComeFromDatabaseFeetWithoutNaN);
              setHeightInchesBmr(heightComeFromDatabaseInchesWithoutNaN);
              
              
            }

            const newWeight = calculatorsResults?.weight ? calculatorsResults?.weight : bodyStatsRowDateTheSameOrLastDate?.weight;
            const weightComeFromtDBToPounds = newWeight?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabase  =  context.stateUser.userPublicSettings.units == "Metrics" ? newWeight?.toFixed(0) : weightComeFromtDBToPounds.toFixed(3);
            const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
            ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
            setWeightBmr(weightComeFromDatabaseWithoutNaN);
            }else{
              ///selectedDate == calculatorsResults?.date
              let heightComeFromDbOrSaved =  bodyStatsRowDateTheSameOrLastDate?.height ? bodyStatsRowDateTheSameOrLastDate?.height.toFixed(2) : context.stateUser.userPublicSettings?.height?.toFixed(2);
              console.log('BMR heightComeFromDbOrSaved-->',heightComeFromDbOrSaved);
  
              const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches
              const heightComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
              ////console.log('heightComeFromDatabase',heightComeFromDatabase);
              if(context.stateUser.userPublicSettings.units =="Metrics"){
                const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
                setHeightBmr(heightComeFromDatabaseWithoutNaN);
  
              }else{
                const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
                const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
                setHeightFeetBmr(heightComeFromDatabaseFeetWithoutNaN);
                setHeightInchesBmr(heightComeFromDatabaseInchesWithoutNaN);
                
                
              }
  
              const newWeight = bodyStatsRowDateTheSameOrLastDate?.weight ? bodyStatsRowDateTheSameOrLastDate?.weight : "";
              const weightComeFromtDBToPounds = newWeight?.toFixed(0) * 2.20462; // Convert kg to pounds
              const weightComeFromDatabase  =  context.stateUser.userPublicSettings.units == "Metrics" ? newWeight?.toFixed(0) : weightComeFromtDBToPounds.toFixed(3);
              const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
              ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
              setWeightBmr(weightComeFromDatabaseWithoutNaN);
            }
            
            ////console.log('calculatorsResults?.methds',calculatorsResults?.methds);
            setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Mifflin');
            setBmrResult(calculatorsResults?.result);
          });
        }else{
          fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
            // setHeightBmr(PSettingsResults[0].height);
            setUnitsChecked(PSettingsResults[0].units);
            
            setGenderChecked(storedUser?.gender);
            setGenderCheckedToCompare(storedUser?.gender);

            const genderIndex = genderData.indexOf(storedUser?.gender);
            //console.log('genderIndex fetchPublicSettings',genderIndex);
            setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));


            fetchCalculatorsTableLastInsertedRow(storedUser.id,"bmrCal").then(async (calculatorsResults) => {
              let newSentAge = calculatorsResults?.age ? calculatorsResults?.age : PSettingsResults[0]?.age;
              setAgeBmr(newSentAge);
              const newDate = selectedDate ? selectedDate : calculatorsResults?.date ? calculatorsResults?.date : "";
        const bodyStatsRowDateTheSameOrLastDate = await fetchbodyStatsAndMeasurementsDateTheSameDateInCalculator(storedUser.id,newDate);
        console.log('BMR bodyStatsRowDateTheSameOrLastDate-->',bodyStatsRowDateTheSameOrLastDate);
        if(selectedDate == calculatorsResults?.date || !selectedDate){
          let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : bodyStatsRowDateTheSameOrLastDate?.height ? bodyStatsRowDateTheSameOrLastDate?.height.toFixed(2) : PSettingsResults[0]?.height?.toFixed(2);
          console.log('BMR heightComeFromDbOrSaved-->',heightComeFromDbOrSaved);

          //console.log('BMR calculatorsResults fetchPublicSettings-->',calculatorsResults);
          const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches

        //console.log(' before if PSettingsResult heightComeFromDbOrSaved',heightComeFromDbOrSaved);

        const heightComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
        
        if(PSettingsResults[0].units =="Metrics"){
          const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
          setHeightBmr(heightComeFromDatabaseWithoutNaN);

        }else{
          const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
          const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
          setHeightFeetBmr(heightComeFromDatabaseFeetWithoutNaN);
          setHeightInchesBmr(heightComeFromDatabaseInchesWithoutNaN);
          
          
          
        }
        
          setCalculatorsTableLastInsertedRow(calculatorsResults);
          const newWeight = calculatorsResults?.weight ? calculatorsResults?.weight : bodyStatsRowDateTheSameOrLastDate?.weight;

          const weightComeFromtDBToPounds = newWeight?.toFixed(0) * 2.20462; // Convert kg to pounds
          const weightComeFromDatabase  =  PSettingsResults[0].units == "Metrics" ? newWeight?.toFixed(0) : weightComeFromtDBToPounds.toFixed(3);
          const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
          ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
          setWeightBmr(weightComeFromDatabaseWithoutNaN);
        }else{
          let heightComeFromDbOrSaved =  bodyStatsRowDateTheSameOrLastDate?.height ? bodyStatsRowDateTheSameOrLastDate?.height.toFixed(2) : PSettingsResults[0]?.height?.toFixed(2);
          console.log('BMR heightComeFromDbOrSaved-->',heightComeFromDbOrSaved);

          //console.log('BMR calculatorsResults fetchPublicSettings-->',calculatorsResults);
          const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches

        //console.log(' before if PSettingsResult heightComeFromDbOrSaved',heightComeFromDbOrSaved);

        const heightComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
        
        if(PSettingsResults[0].units =="Metrics"){
          const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
          setHeightBmr(heightComeFromDatabaseWithoutNaN);

        }else{
          const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
          const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
          setHeightFeetBmr(heightComeFromDatabaseFeetWithoutNaN);
          setHeightInchesBmr(heightComeFromDatabaseInchesWithoutNaN);
          
          
          
        }
        
          const newWeight =  bodyStatsRowDateTheSameOrLastDate?.weight;

          const weightComeFromtDBToPounds = newWeight?.toFixed(0) * 2.20462; // Convert kg to pounds
          const weightComeFromDatabase  =  PSettingsResults[0].units == "Metrics" ? newWeight?.toFixed(0) : weightComeFromtDBToPounds.toFixed(3);
          const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
          ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
          setWeightBmr(weightComeFromDatabaseWithoutNaN);
        }
             
              ////console.log('calculatorsResults?.methds',calculatorsResults?.methds);
              setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Mifflin');
              setBmrResult(calculatorsResults?.result);
            });
          });
        }
      };
      loadData();

        const timer = setTimeout(() => {
          setLoadingPageInfo(false);
        }, 2000); // 2 seconds
    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
         
     
      });
  }, [AsyncStorage,fetchPublicSettings,fetchCalculatorsTableLastInsertedRow,selectedDate]);

  useEffect(() => {
      
    //console.log('Route Object.keys(dayWorkoutWorkedTask).length:', Object.keys(dayWorkoutWorkedTask).length);
    const useEffectLoadData = async () => {
      const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(userId);
      const PSettingsResults = await fetchPublicSettings(userId);

    if (sentPassNewDate) {
      
     
      // setUnitsChecked(dayWorkoutWorkedTask?.units);
      setAgeBmr(dayWorkoutWorkedTask.age);
  
      let weightComeFromtDBToPounds = parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
      let newWeight = unitsChecked=="Metrics" ? `${parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0)}` : `${weightComeFromtDBToPounds.toFixed(3)}`;
      //weight come from bodyStatsRow
      console.log('newWeight',newWeight);
      console.log('bodyStatsRow',bodyStatsRow);
      console.log('bodyStatsRow?.weight',bodyStatsRow?.weight);

      let weightComeFromtDBToPoundsFromBodyStatsRow = parseFloat(bodyStatsRow?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
      console.log('weightComeFromtDBToPoundsFromBodyStatsRow',weightComeFromtDBToPoundsFromBodyStatsRow);

      let newWeightFromBodyStatsRow = unitsChecked=="Metrics" ? `${parseFloat(bodyStatsRow?.weight)?.toFixed(0)}` : `${weightComeFromtDBToPoundsFromBodyStatsRow.toFixed(3)}`;
      console.log('newWeightFromBodyStatsRow',newWeightFromBodyStatsRow);

      
      setWeightBmr(!isNaN(newWeight) ? newWeight.toString() : !isNaN(newWeightFromBodyStatsRow) ? newWeightFromBodyStatsRow.toString() : "");
   
      function cmToFeetAndInches(cm) {
        const feet = Math.floor(cm / 30.48);
      
        // How to have inches match up?
        const inches = ((cm - feet * 30.48) * 0.393701).toFixed(2);
        return { feet, inches };
      }

       //values come from data base into inputs
      let convertedHeightFromDataBaseWithoutNanFeet = '';
      let convertedHeightFromDataBaseWithoutNanInches = '';
      let convertedHeightFrombodyStatsRowWithoutNanFeet = '';
      let convertedHeightFrombodyStatsRowWithoutNanInches = '';
      let convertedHeightFrommWorkoutSettingsWithoutNanFeet = '';
      let convertedHeightFrommWorkoutSettingsWithoutNanInches = '';
      
      
      let heightComeFromDatabaseWithoutNaN='';
      let heightComeFrombodyStatsRowWithoutNaN='';
      console.log('dayWorkoutWorkedTask?.height',dayWorkoutWorkedTask?.height);

      if(unitsChecked=="Metrics"){
        if(!isNaN(dayWorkoutWorkedTask?.height) && dayWorkoutWorkedTask?.height != ""){
          heightComeFromDatabaseWithoutNaN = !isNaN(dayWorkoutWorkedTask?.height) ? `${parseFloat(dayWorkoutWorkedTask?.height)?.toFixed(0)}` : "";
        }
        
        if(!isNaN(bodyStatsRow?.height) && bodyStatsRow?.height != ""){
          heightComeFrombodyStatsRowWithoutNaN = !isNaN(bodyStatsRow?.height) ? `${parseFloat(bodyStatsRow?.height)?.toFixed(0)}` : "";
        }
        console.log('heightComeFromDatabaseWithoutNaN',heightComeFromDatabaseWithoutNaN);
        console.log('heightComeFrombodyStatsRowWithoutNaN',heightComeFrombodyStatsRowWithoutNaN);

        if(heightComeFromDatabaseWithoutNaN){
          setHeightBmr(heightComeFromDatabaseWithoutNaN.toString());

        }else if (heightComeFrombodyStatsRowWithoutNaN){
          setHeightBmr(heightComeFrombodyStatsRowWithoutNaN.toString());

        }else{
          setHeightBmr(PSettingsResults?.[0]?.height);
        }


      }else{
      //values come from data base into inputs
      let convertedHeightFromDataBase = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.height)?.toFixed(2));
      let convertedHeightFrombodyStats = cmToFeetAndInches(parseFloat(bodyStatsRow?.height)?.toFixed(2));
      let convertedHeightFromWorkoutSettings = cmToFeetAndInches(PSettingsResults?.[0]?.height);

      convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet?.toString() : '';
      convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches?.toString() : '';
      
      convertedHeightFrombodyStatsRowWithoutNanFeet = !isNaN(convertedHeightFrombodyStats.feet) ? convertedHeightFrombodyStats.feet?.toString() : '';
      convertedHeightFrombodyStatsRowWithoutNanInches = !isNaN(convertedHeightFrombodyStats.inches) ? convertedHeightFrombodyStats.inches?.toString() : '';
       
      convertedHeightFrommWorkoutSettingsWithoutNanFeet = !isNaN(convertedHeightFromWorkoutSettings.feet) ? convertedHeightFromWorkoutSettings.feet?.toString() : '';
      convertedHeightFrommWorkoutSettingsWithoutNanInches = !isNaN(convertedHeightFromWorkoutSettings.inches) ? convertedHeightFromWorkoutSettings.inches?.toString() : '';
      
         
       if(convertedHeightFromDataBaseWithoutNanFeet){
        setHeightFeetBmr(convertedHeightFromDataBaseWithoutNanFeet ? convertedHeightFromDataBaseWithoutNanFeet.toString() : "");
        setHeightInchesBmr(convertedHeightFromDataBaseWithoutNanInches ? convertedHeightFromDataBaseWithoutNanInches.toString() : "");
       }else if(convertedHeightFrombodyStatsRowWithoutNanFeet){
        setHeightFeetBmr(convertedHeightFrombodyStatsRowWithoutNanFeet ? convertedHeightFrombodyStatsRowWithoutNanFeet.toString() : "");
        setHeightInchesBmr(convertedHeightFrombodyStatsRowWithoutNanInches ? convertedHeightFrombodyStatsRowWithoutNanInches.toString() : "");
       }else{
        setHeightFeetBmr(convertedHeightFrommWorkoutSettingsWithoutNanFeet ? convertedHeightFrommWorkoutSettingsWithoutNanFeet.toString() : "");
        setHeightInchesBmr(convertedHeightFrommWorkoutSettingsWithoutNanInches ? convertedHeightFrommWorkoutSettingsWithoutNanInches.toString() : "");
       }
      

      
     
              
      }

      setDateFromDb(dayWorkoutWorkedTask?.date || "");
      setEquaChecked(dayWorkoutWorkedTask?.methds !== undefined ? dayWorkoutWorkedTask?.methds : 'Mifflin');

      
      setBmrResult(dayWorkoutWorkedTask?.result ? dayWorkoutWorkedTask?.result : "");
     
    }


  };
   useEffectLoadData();

  }, [params]);
    function cmToFeetAndInches(cm) {
      const feet = Math.floor(cm / 30.48);
    
      // How to have inches match up?
      const inches = ((cm - feet * 30.48) * 0.393701).toFixed(2);
      return { feet, inches };
    }
    ////console.log('weightBmr beforrre',weightBmr);
    ////console.log('equaChecked beforrre',equaChecked);
    let convertedHeightInCmWithoutNaN = "";
  
    let heightFeetValue = "";
    let heightInchesValue = "";
  
    if (unitsChecked === "Imperial"){
       
      // converted values will go into database as cm values
      heightFeetValue = heightFeetBmr !=='' ? heightFeetBmr : "";
      heightInchesValue = heightInchesBmr !=='' ? heightInchesBmr : "";
      ////console.log('heightFeetValue-----',heightFeetValue);
      ////console.log('heightInchesValue-----',heightInchesValue);
      
      const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetValue), parseFloat(heightInchesValue));
      convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? convertedHeightInCm : "";
    
    }
    ////console.log('convertedHeightInCmWithoutNaN-----',convertedHeightInCmWithoutNaN);
    
    let newHeight='';
    if(unitsChecked === "Metrics"){
      newHeight = heightBmr?.toString();
    }else{
      newHeight = convertedHeightInCmWithoutNaN;
    }  
  const [showInfo, setShowInfo] = useState(false);
  const heightInInches = heightBmr / 2.54; // Convert cm to inches
    ////console.log('weightBmr',weightBmr);
    //KG from database

    const weightInKg = weightBmr !=="" ? 0.45359237 * parseFloat(weightBmr) : ""; // convert weight from pounds to kg
    const weightKgToDatabase = unitsChecked=="Metrics" ? weightBmr : weightInKg;

    
    ////console.log('heightBmr',heightBmr);
    ////console.log('genderChecked',genderChecked);
    ////console.log('weightKgToDatabase', weightKgToDatabase);

    
    let bmr = "";
    if(equaChecked=="Mifflin"){
      if(genderChecked=='Him'){
        if(unitsChecked=="Metrics"){
          //BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
          bmr = (10 * parseFloat(weightBmr))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) + 5;
          // Set the Bmr result 
          ////console.log('bmr1',bmr);

        }else{
          //BMR = (4.536 × weight in pounds) + (15.88 × height in inches) − (5 × age) + 5
          bmr = (10 * weightInKg)+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) + 5;
          // Set the Bmr result 
          ////console.log('bmr2',bmr);

        }
      }else{
        if(unitsChecked=="Metrics"){
          //BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
          bmr = (10 * parseFloat(weightBmr))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) - 161;
          // Set the Bmr result 
          ////console.log('bmr3',bmr);

        }else{
          //BMR = (4.536 × weight in pounds) + (15.88 × height in inches) − (5 × age) − 161;
          bmr = (10 * weightInKg)+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) - 161;
          // Set the Bmr result 
          ////console.log('bmr4',bmr);

        }
      }
    }else{
      if(genderChecked=='Him'){
        if(unitsChecked=="Metrics"){
          //BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
          bmr =  88.362 + (13.397 * parseFloat(weightBmr))+(4.799 * parseFloat(newHeight)) - (5.677*parseFloat(ageBmr));
          // Set the Bmr result 
          ////console.log('bmr5',bmr);

        }else{
          //5 feet * 12 inches/foot = 60 inches
          //8 inches = 8 inches
          //height in inches, which is 60 + 8 = 68 inches.
          //bmr =  88.362 + (13.397 * (0.45359237 * parseFloat(weightBmr)))+(4.799 * (((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr)) *2.54) ) - (5.677 *parseFloat(ageBmr));
          bmr =  88.362 + (13.397 * weightInKg)+(4.799 * parseFloat(newHeight)) - (5.677 *parseFloat(ageBmr));
          // Set the Bmr result 
          ////console.log('bmr6',bmr);

        }
      }else{
        if(unitsChecked=="Metrics"){
        //BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) - (4.330 x age in years)          
          bmr =  447.593 + (9.247 * parseFloat(weightBmr))+(3.098 * parseFloat(newHeight)) - (4.330*parseFloat(ageBmr));
        // Set the Bmr result 
        ////console.log('bmr7',bmr);

        }else{
          //bmr =  447.593 + (9.247 * (0.45359237 * parseFloat(weightBmr)))+(3.098 * (((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr)) *2.54)) - (4.330*parseFloat(ageBmr));
          bmr =  447.593 + (9.247 * weightInKg)+(3.098 * parseFloat(newHeight)) - (4.330*parseFloat(ageBmr));
          // Set the Bmr result 
          ////console.log('bmr8',bmr);

        }
      }
    }
    
  
 
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  ////console.log('bmr?.toFixed(0) ', parseFloat(bmr)?.toFixed(0));
  ////console.log('calculatorsTableLastInsertedRow?.result', calculatorsTableLastInsertedRow?.result);

  const todayDate = new Date().toISOString().split('T')[0];
  const checkFutureDate = sentPassNewDate > todayDate ? true : false ;
  ////console.log('todayDate',checkFutureDate);
  const [modalVisible, setModalVisible] = useState(false);
  const handleCalculateBmr = () => { 
    console.log('ageBmr--',ageBmr);
    if (!weightKgToDatabase || weightKgToDatabase === "" || weightKgToDatabase.toString().trim() == '' || isNaN(weightKgToDatabase)) { 
      Alert.alert(`${t('weight_are_required')}`); 
      return;
    }
    if (!newHeight || isNaN(newHeight) || newHeight == "") { 
      Alert.alert(`${t('height_are_required')}`); 
      return;
    }
    if (ageBmr === ""  && ageBmr?.toString().trim() == '' ||  ageBmr == undefined) { 
      Alert.alert(`${t('age_are_required')}`); 
      return;
    }

    if(weightKgToDatabase === 0 || weightKgToDatabase === '0'){
      Alert.alert(`${t('Weight_must_be_greater_than_zero')}`); 
      return;
    }
    if(heightBmr === 0 || heightBmr === '0'){
      Alert.alert(`${t('Height_must_be_greater_than_zero')}`); 
      return;
    }
    if(ageBmr === 0 || ageBmr === '0'){
      Alert.alert(`${t('Age_must_be_greater_than_zero')}`); 
      return;
    }
    setBmrResult(parseFloat(bmr).toFixed(0)); 
  };   
  const handleSubmitBmr = () => { 
    if (
      !weightKgToDatabase || weightKgToDatabase == "" || isNaN(weightKgToDatabase) ||  ageBmr === "" || ageBmr?.toString().trim() == '' ||
  !newHeight.toString().trim() || newHeight.toString().trim() == '' || isNaN(newHeight)  ||
  !sentPassNewDate && !calculatorsTableLastInsertedRow?.date
){ 
      Alert.alert(`${t('All_fields_are_required')}`); 
      return;
    }
    if(weightKgToDatabase === 0 || weightKgToDatabase === '0' ){
      Alert.alert(`${t('Weight_must_be_greater_than_zero')}`); 
      return;
    }
    if(newHeight === 0 || newHeight === '0'){
      Alert.alert(`${t('Height_must_be_greater_than_zero')}`); 
      return;
    }
    if(ageBmr === 0 || ageBmr === '0'){
      Alert.alert(`${t('Age_must_be_greater_than_zero')}`); 
      return;
    }
    if(checkFutureDate){
      Alert.alert(`${t("You_can_t_select_date_in_the_Future")}`);
      return;
    }
    if( dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date){

      setUpdateLoading(true);
  
    }else{
      setLoading(true);
  
    }
    setShowSuccess(false); // Reset success state
    setUpdateShowSuccess(false); // Show success message and animation

    const userCalAndMeasurements = {
      userId:userId,
      date: lastInsertedRowDate,
      calNam:"bmrCal",
      methds:equaChecked,
      sFMthd:"",
      age:ageBmr,
      height:newHeight,
      weight: parseFloat(weightKgToDatabase).toFixed(0),
      neck:"",
      torso:"",
      hips:"",
      chest:"",
      sprlic:"",
      tricep:"",
      thigh:"",
      abdmen:"",
      axilla:"",
      subcpl:"",
      workot:"",
      target:"",
      ditTyp:"",
      result:parseFloat(bmr).toFixed(0) || calculatorsTableLastInsertedRow?.result,
      bFPctg:"",
      bFMass:"",
      lBMass:"",
      calris:"",
      protin:"",
      fats:"",
      carbs:"",
      isSync :'no',
    };
    insertCalculatorsTable(userCalAndMeasurements).then((result)=>{
      ////console.log('result insert user calculators Measurements into database',result);
      if ( dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date){

        setUpdateLoading(false);
        setUpdateShowSuccess(true); // Show success message and animation
        // Delay to allow users to see the success message before closing the modal
        setTimeout(() => {
          setUpdateShowSuccess(false);
          // navigation.navigate('OurServices');

              //         navigation.navigate('OurServices');
  
        }, 2000); // 2 seconds delay
      
      }else{
        setLoading(false);
        setShowSuccess(true); // Show success message and animation
        setTimeout(() => {
          setShowSuccess(false);
         
        }, 2000); // 2 seconds delay
        
      
      }
    //   Alert.alert(`${t(' ')}`,
    //   `${t('Your_measurements_added_successfully')}`,
    //   [
    //     {
    //       text: 'OK',
    //       onPress: () => {
    //         navigation.navigate('OurServices');
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
    }).catch((error) => {
      setLoading(false);
      setUpdateLoading(false);
      setShowSuccess(false); // Reset success state
      setUpdateShowSuccess(false); // Reset success state

      Alert.alert(` `,
      `${t(error.message)}`);
    });
  };
  return (
    <PageContainer>
    <ScrollView >
        <TitleView >
          <Title >Life</Title>
        </TitleView>
        <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/BMR_Calculator.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover>
        <View>
        </View>
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
                      <Text style={styles.successText}>{t('Your_measurements_added_successfully')}</Text>
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
                      <Text style={styles.successText}>{t('Record_has_been_updated_successfully')}</Text>
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
      <Spacer size="large">
      <ServiceInfoParentView >
        {showInfo ? (
          <ServiceCloseInfoButtonView>
            <ServiceCloseInfoButton onPress={toggleInfo}>
              <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
            </ServiceCloseInfoButton>
            <ServiceCloseInfoButtonTextView>
              <ServiceCloseInfoButtonText>{t("bmr_desc")}</ServiceCloseInfoButtonText>
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
    <Spacer size="large">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Gender")}:</FormLabel>
        </FormLabelView>
          <GenderSelector
            selectedIndex={selectedGender}
            onSelect={(index) => {
              setSelectedGender(index);
              //console.log('index',index);
              setGenderChecked(genderData[index?.row]);
              }}
            placeholder={t('Select_Gender')}
            value={genderChecked}
            status="newColor"
            size="customSizo"
          >
            {genderData.map(renderGenderOption)}
          </GenderSelector>
      </InputField>
    </Spacer>
    <Spacer >
        <TraineeOrTrainerField>
            <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Equations")}:</FormLabel>
            </FormLabelView>
          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="Mifflin"
                status={ equaChecked === 'Mifflin' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('Mifflin')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t("Mifflin")}</FormLabel>
          </TraineeOrTrainerButtonField>
            <TraineeOrTrainerButtonField>
              <RadioButton
                value="HarrisBenedic"
                status={ equaChecked === 'HarrisBenedic' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('HarrisBenedic')}
                uncheckedColor={"#000"}
                color={'#000'}
              />
              <FormLabel>{t("Harris_Benedic")}</FormLabel>
            </TraineeOrTrainerButtonField>
        </TraineeOrTrainerButtonsParentField>
      </TraineeOrTrainerField>
    </Spacer>

      <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
              
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <CalendarBmrCalculator navigation={navigation}
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
    </Spacer>
    <Spacer size="large">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Age")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Age")}
            value={ageBmr?.toString()}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAgeBmr(u)}
          />
        </FormInputView>
      </InputField>
    </Spacer>
    {(unitsChecked === "Metrics")?(
              <View>
              <Spacer size="large">
                <InputField>
                <FormLabelView>
                  <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Height')}:</FormLabel>
                </FormLabelView>
                <FormInputView>
                  <FormInput
                    placeholder={t("Cm")}
                    value={heightBmr?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setHeightBmr(u)}
                  />
                </FormInputView>
                </InputField>
              </Spacer>
              </View>
            ):(
              <View>
                <Spacer size="medium">
                <InputField>
                  <FormLabelView>
                    <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Height')}:</FormLabel>
                  </FormLabelView>
                  <FormHalfInputView>
                    <FormHalfInput
                      placeholder={t("Feet")}
                      value={heightFeetValue?.toString()}
                      keyboardType="numeric"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(u) => setHeightFeetBmr(u)}
                      />
                    <FormHalfInput
                      placeholder={t("Inches")}
                      value={heightInchesValue?.toString()}
                      keyboardType="numeric"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(u) => setHeightInchesBmr(u)}
                    />
                  </FormHalfInputView> 
                  </InputField>
                </Spacer>
              </View>
            )}
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Weight")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={`${unitsChecked === 'Metrics' ?  `${t("Kg")}` : `${t('Pounds')}`}`}
              value={weightBmr} 
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightBmr(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>   
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel style={{marginLeft:12}}>{t("Result")}:</FormLabel>
          </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{bmrResult} {t("Calories_day")}</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      
      <Spacer size="large">
        <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
          <FormElemeentSizeButtonView style={{width:"48%"}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
     onPress={handleCalculateBmr}>
            <CalendarFullSizePressableButtonText >{t("Calculate")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
          <FormElemeentSizeButtonView style={{width:"48%"}}> 
          {(dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              handleSubmitBmr();
            }else{
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              Alert.alert(`${t("note")}`,`${t("trying_to_add_different_gener_message")}`);
            }
          
          }}>
              <CalendarFullSizePressableButtonText >{t("Update_Entry")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            ):(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              handleSubmitBmr();
            }else{
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              Alert.alert(`${t("note")}`,`${t("trying_to_add_different_gener_message")}`);
            }
          
          }}>
              <CalendarFullSizePressableButtonText >{t("Add_Entry")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            )
            }
          </FormElemeentSizeButtonView>
        </FormElemeentSizeButtonParentView>
      </Spacer>

    {/* <Spacer size="medium">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
    onPress={()=>navigation.goBack()}>
          <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView>
    </Spacer> */}
    </ScrollView>
    
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  //zoom image Front
     
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