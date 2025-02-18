import React, { useState, useEffect,useContext, useRef } from "react";
import { StyleSheet,
  ScrollView,View,Modal,Alert,Text, Animated, Easing} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import { fetchbodyStatsAndMeasurementsLastInsertedRow,insertBodyStatsAndMeasurements } from "../../../../database/B_S_and_measurements"; 

import { RadioButton} from "react-native-paper";
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  FullSizeButtonView,
  FullButton,
  FormHalfInputView,
  FormHalfInput,
  NewFormLabelDateRowView,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
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
  ViewOverlay,
  TraineeOrTrainerField,
  TraineeOrTrainerButtonsParentField,
  TraineeOrTrainerButtonField,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  AsteriskTitle,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDate } from './DateContext'; // Import useDate from the context
import { CalendarBmiCalculator } from "./calendar_bmi_calculator";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchCalculatorsTable,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow,clearCalculatorsTableTable } from "../../../../database/calcaulatorsTable";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line

export const BMIScreen = ({ route, navigation }) => {
   const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;
  const [dateFromDb,setDateFromDb] = useState("");

  const [unitsChecked, setUnitsChecked ] = useState('');
  const [heightBmi, setHeightBmi] = useState("");
  const[heightCmWorkoutSettings,setHeightCmWorkoutSettings]=useState('');
  const[heightFeetWorkoutSettings,setHeightFeetWorkoutSettings]=useState('');
  const[heightInchesWorkoutSettings,setHeightInchesWorkoutSettings]=useState('');
  const [weightBmi, setWeightBmi] = useState("");
  const { selectedDate } = useDate(); // Access selectedDate from the context
  const [showInfo, setShowInfo] = useState(false);
  const [bmiResult, setBmiResult] = useState(null); 
  const [weightStatus, setWeightStatus] = useState(""); 

  
  const [publicSettingsDatabase,setPublicSettingsDatabase] = useState({});
  const [ageCal,setAgeCal] = useState('');
  const context = useContext(AuthGlobal);
  const [userId,setUserId] = useState('');
  const [calculatorsTableLastInsertedRow,setCalculatorsTableLastInsertedRow] = useState({});
  const {t} = useTranslation();//add this line
  const [loading, setLoading] = useState(false);
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: calculatorsTableLastInsertedRow?.date;
  const [updateShowSuccess, setUpdateShowSuccess] = useState(false);

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
  // useEffect(() => {

  // }, []);   
  useEffect(() => {
  AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);
    //console.log('bmi calculator user---->>>',storedUser);
    setUserId(storedUser.id);
    
    // clearCalculatorsTableTable().then((calculatorsResults) => {
    //   console.log('clearCalculatorsTableTable-->');

    // });
      if(Object.keys(context.stateUser.userPublicSettings).length > 0){
        // setHeightBmi(context.stateUser.userPublicSettings?.height);
        setUnitsChecked(context.stateUser.userPublicSettings.units);
        setAgeCal(context.stateUser.userPublicSettings.age);
        fetchCalculatorsTableLastInsertedRow(storedUser.id,"bmiCal").then(async (calculatorsResults) => {
          //console.log('calculatorsResults-->',calculatorsResults);
          const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(storedUser.id);

          let convertedHeightFromDataBaseWithoutNanFeet = '';
          let convertedHeightFromDataBaseWithoutNanInches = '';
          let convertedHeightFrombodyStatsRowWithoutNanFeet = '';
          let convertedHeightFrombodyStatsRowWithoutNanInches = '';
          let convertedHeightFromWorkoutSettingsWithoutNanFeet = '';
          let convertedHeightFromWorkoutSettingsWithoutNanInches = '';

           

          function cmToFeetAndInches(cm) {
            const feet = Math.floor(cm / 30.48);
          
            // How to have inches match up?
            const inches = ((cm - feet * 30.48) * 0.393701).toFixed(2);
            return { feet, inches };
          }
          let heightComeFromDatabaseWithoutNaN='';
          let heightComeFrombodyStatsRowWithoutNaN='';
          console.log('consoele before check context.stateUser.userPublicSettings?.units  == "Metrics"',);
          console.log('context.stateUser.userPublicSettings?.units',context.stateUser.userPublicSettings?.units);

          if(context.stateUser.userPublicSettings?.units  == "Metrics"){
            if(!isNaN(calculatorsResults?.height) && calculatorsResults?.height != ""){
              heightComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.height) ? `${parseFloat(calculatorsResults?.height)?.toFixed(0)}` : "";
            }
            
            if(!isNaN(bodyStatsRow?.height) && bodyStatsRow?.height != ""){
              heightComeFrombodyStatsRowWithoutNaN = !isNaN(bodyStatsRow?.height) ? `${parseFloat(bodyStatsRow?.height)?.toFixed(0)}` : "";
            }
                  
            console.log('heightComeFromDatabaseWithoutNaN?.toString()-->',heightComeFromDatabaseWithoutNaN?.toString());
          console.log('heightComeFrombodyStatsRowWithoutNaN?.toString()-->',heightComeFrombodyStatsRowWithoutNaN?.toString());
          console.log('context.stateUser.userPublicSettings?.height?.toString()-->',context.stateUser.userPublicSettings?.height?.toString());

            setHeightBmi(heightComeFromDatabaseWithoutNaN ? heightComeFromDatabaseWithoutNaN?.toString() : heightComeFrombodyStatsRowWithoutNaN ? heightComeFrombodyStatsRowWithoutNaN?.toString() : context.stateUser.userPublicSettings?.height ? context.stateUser.userPublicSettings?.height?.toString() : "");

          }else{
            let convertedHeightFromDataBase = cmToFeetAndInches(parseFloat(calculatorsResults?.height)?.toFixed(2));
            let convertedHeightFrombodyStats = cmToFeetAndInches(parseFloat(bodyStatsRow?.height)?.toFixed(2));
            let convertedHeightFromWorkoutSettings = cmToFeetAndInches(parseFloat(context.stateUser.userPublicSettings?.height)?.toFixed(2));

            
        convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet?.toString() : '';
        convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches?.toString() : '';
        
        convertedHeightFrombodyStatsRowWithoutNanFeet = !isNaN(convertedHeightFrombodyStats.feet) ? convertedHeightFrombodyStats.feet?.toString() : '';
        convertedHeightFrombodyStatsRowWithoutNanInches = !isNaN(convertedHeightFrombodyStats.inches) ? convertedHeightFrombodyStats.inches?.toString() : '';

        convertedHeightFromWorkoutSettingsWithoutNanFeet = !isNaN(convertedHeightFromWorkoutSettings.feet) ? convertedHeightFromWorkoutSettings.feet?.toString() : '';
        convertedHeightFromWorkoutSettingsWithoutNanInches = !isNaN(convertedHeightFromWorkoutSettings.inches) ? convertedHeightFromWorkoutSettings.inches?.toString() : '';
        
         if(convertedHeightFromDataBaseWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFromDataBaseWithoutNanFeet ? convertedHeightFromDataBaseWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFromDataBaseWithoutNanInches ? convertedHeightFromDataBaseWithoutNanInches.toString() : "");
         }else if(convertedHeightFrombodyStatsRowWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanFeet ? convertedHeightFrombodyStatsRowWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanInches ? convertedHeightFrombodyStatsRowWithoutNanInches.toString() : "");
         }else{
          setHeightFeetWorkoutSettings(convertedHeightFromWorkoutSettingsWithoutNanFeet ? convertedHeightFromWorkoutSettingsWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFromWorkoutSettingsWithoutNanInches ? convertedHeightFromWorkoutSettingsWithoutNanInches.toString() : "");
         }
        
            

          }

          setCalculatorsTableLastInsertedRow(calculatorsResults);
          if(calculatorsResults?.result){
            if(calculatorsResults?.result < 18.5){
              setWeightStatus("Underweight");
            }else if(18.5 <= calculatorsResults?.result <= 24.9){
              setWeightStatus("Healthy_Weight");
  
            }
            else if(25.0 <= calculatorsResults?.result <= 29.9){
              setWeightStatus("Overweight");
  
            }else if(30 <= calculatorsResults?.result){
              setWeightStatus("Obesity");
  
            }
          }
          
          setBmiResult(calculatorsResults?.result);
          const weightComeFromtDBToPounds = calculatorsResults?.weight?.toFixed(0) * 2.20462; // Convert kg to pounds
          const weightComeFromDatabase  =  context.stateUser.userPublicSettings.units == "Metrics" ? calculatorsResults?.weight?.toFixed(0) : weightComeFromtDBToPounds;
          const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
          setWeightBmi(weightComeFromDatabaseWithoutNaN);
        });

      }else{
        fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
          // setHeightBmi(PSettingsResults[0].height);
          setUnitsChecked(PSettingsResults[0].units);
          setAgeCal(PSettingsResults[0].age);
          fetchCalculatorsTableLastInsertedRow(storedUser.id,"bmiCal").then(async (calculatorsResults) => {
            //console.log('calculatorsResults-->',calculatorsResults);
            const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(storedUser.id);

          let convertedHeightFromDataBaseWithoutNanFeet = '';
          let convertedHeightFromDataBaseWithoutNanInches = '';
          let convertedHeightFrombodyStatsRowWithoutNanFeet = '';
          let convertedHeightFrombodyStatsRowWithoutNanInches = '';
          let convertedHeightFromWorkoutSettingsWithoutNanFeet = '';
          let convertedHeightFromWorkoutSettingsWithoutNanInches = '';

           

          function cmToFeetAndInches(cm) {
            const feet = Math.floor(cm / 30.48);
          
            // How to have inches match up?
            const inches = ((cm - feet * 30.48) * 0.393701).toFixed(2);
            return { feet, inches };
          }
          let heightComeFromDatabaseWithoutNaN='';
          let heightComeFrombodyStatsRowWithoutNaN='';

          if(PSettingsResults[0].units  == "Metrics"){
            if(!isNaN(calculatorsResults?.height) && calculatorsResults?.height != ""){
              heightComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.height) ? `${parseFloat(calculatorsResults?.height)?.toFixed(0)}` : "";
            }
            
            if(!isNaN(bodyStatsRow?.height) && bodyStatsRow?.height != ""){
              heightComeFrombodyStatsRowWithoutNaN = !isNaN(bodyStatsRow?.height) ? `${parseFloat(bodyStatsRow?.height)?.toFixed(0)}` : "";
            }
                  
  
            setHeightBmi(heightComeFromDatabaseWithoutNaN ? heightComeFromDatabaseWithoutNaN?.toString() : heightComeFrombodyStatsRowWithoutNaN ? heightComeFrombodyStatsRowWithoutNaN?.toString() : PSettingsResults[0].height ? PSettingsResults[0].height?.toString() : "");

          }else{
            let convertedHeightFromDataBase = cmToFeetAndInches(parseFloat(calculatorsResults?.height)?.toFixed(2));
            let convertedHeightFrombodyStats = cmToFeetAndInches(parseFloat(bodyStatsRow?.height)?.toFixed(2));
            let convertedHeightFromWorkoutSettings = cmToFeetAndInches(parseFloat(PSettingsResults[0].height)?.toFixed(2));

            
        convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet?.toString() : '';
        convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches?.toString() : '';
        
        convertedHeightFrombodyStatsRowWithoutNanFeet = !isNaN(convertedHeightFrombodyStats.feet) ? convertedHeightFrombodyStats.feet?.toString() : '';
        convertedHeightFrombodyStatsRowWithoutNanInches = !isNaN(convertedHeightFrombodyStats.inches) ? convertedHeightFrombodyStats.inches?.toString() : '';

        convertedHeightFromWorkoutSettingsWithoutNanFeet = !isNaN(convertedHeightFromWorkoutSettings.feet) ? convertedHeightFromWorkoutSettings.feet?.toString() : '';
        convertedHeightFromWorkoutSettingsWithoutNanInches = !isNaN(convertedHeightFromWorkoutSettings.inches) ? convertedHeightFromWorkoutSettings.inches?.toString() : '';
        
         if(convertedHeightFromDataBaseWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFromDataBaseWithoutNanFeet ? convertedHeightFromDataBaseWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFromDataBaseWithoutNanInches ? convertedHeightFromDataBaseWithoutNanInches.toString() : "");
         }else if(convertedHeightFrombodyStatsRowWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanFeet ? convertedHeightFrombodyStatsRowWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanInches ? convertedHeightFrombodyStatsRowWithoutNanInches.toString() : "");
         }else{
          setHeightFeetWorkoutSettings(convertedHeightFromWorkoutSettingsWithoutNanFeet ? convertedHeightFromWorkoutSettingsWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFromWorkoutSettingsWithoutNanInches ? convertedHeightFromWorkoutSettingsWithoutNanInches.toString() : "");
         }
        
            

          }

            setCalculatorsTableLastInsertedRow(calculatorsResults);
            if(calculatorsResults?.result){
              if(calculatorsResults?.result < 18.5){
                setWeightStatus("Underweight");
              }else if(18.5 <= calculatorsResults?.result <= 24.9){
                setWeightStatus("Healthy_Weight");
    
              }
              else if(25.0 <= calculatorsResults?.result <= 29.9){
                setWeightStatus("Overweight");
    
              }else if(30 <= calculatorsResults?.result){
                setWeightStatus("Obesity");
    
              }
            }
            
            setBmiResult(calculatorsResults?.result);
            const weightComeFromtDBToPounds = calculatorsResults?.weight?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabase  =  PSettingsResults[0].units == "Metrics" ? calculatorsResults?.weight?.toFixed(0) : weightComeFromtDBToPounds;
            const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
            setWeightBmi(weightComeFromDatabaseWithoutNaN);
          });
        });
      }
      
    
    
    });
  }, [AsyncStorage,fetchPublicSettings,fetchCalculatorsTableLastInsertedRow]);
  //console.log('publicSettingsDatabase---->>',context.stateUser.userPublicSettings);
  ////console.log('calculatorsTableLastInsertedRow weight---->>',calculatorsTableLastInsertedRow?.weight?.toFixed(0));
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
  
      const timer = setTimeout(() => {
        setLoadingPageInfo(false);
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
        
    }, [])
  );
  
  // useEffect(() => {
    
  // }, [context,publicSettingsDatabase]);

  //console.log('publicSettingsDatabase1111 unitsChecked---->>',unitsChecked);
  //console.log('publicSettingsDatabase1111 heightBmi---->>',heightBmi);
  //console.log('publicSettingsDatabase1111 ageCal---->>',ageCal);
  useEffect(() => {
      
    //console.log('Route Object.keys(dayWorkoutWorkedTask).length:', Object.keys(dayWorkoutWorkedTask).length);
    const useEffectLoadData = async () => {
      const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(userId);
      const PSettingsResults = await fetchPublicSettings(userId);

    if (sentPassNewDate) {
      
     
      // setUnitsChecked(dayWorkoutWorkedTask?.units);
      setAgeCal(dayWorkoutWorkedTask.age);
  
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

      
      setWeightBmi(!isNaN(newWeight) ? newWeight.toString() : !isNaN(newWeightFromBodyStatsRow) ? newWeightFromBodyStatsRow.toString() : "");
   
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
          setHeightBmi(heightComeFromDatabaseWithoutNaN.toString());

        }else if (heightComeFrombodyStatsRowWithoutNaN){
          setHeightBmi(heightComeFrombodyStatsRowWithoutNaN.toString());

        }else{
          setHeightBmi(PSettingsResults[0].height);
        }


      }else{
      //values come from data base into inputs
      let convertedHeightFromDataBase = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.height)?.toFixed(2));
      let convertedHeightFrombodyStats = cmToFeetAndInches(parseFloat(bodyStatsRow?.height)?.toFixed(2));
      let convertedHeightFromWorkoutSettings = cmToFeetAndInches(PSettingsResults[0].height);

      convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet?.toString() : '';
      convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches?.toString() : '';
      
      convertedHeightFrombodyStatsRowWithoutNanFeet = !isNaN(convertedHeightFrombodyStats.feet) ? convertedHeightFrombodyStats.feet?.toString() : '';
      convertedHeightFrombodyStatsRowWithoutNanInches = !isNaN(convertedHeightFrombodyStats.inches) ? convertedHeightFrombodyStats.inches?.toString() : '';
       
      convertedHeightFrommWorkoutSettingsWithoutNanFeet = !isNaN(convertedHeightFromWorkoutSettings.feet) ? convertedHeightFromWorkoutSettings.feet?.toString() : '';
      convertedHeightFrommWorkoutSettingsWithoutNanInches = !isNaN(convertedHeightFromWorkoutSettings.inches) ? convertedHeightFromWorkoutSettings.inches?.toString() : '';
      
         
       if(convertedHeightFromDataBaseWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFromDataBaseWithoutNanFeet ? convertedHeightFromDataBaseWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFromDataBaseWithoutNanInches ? convertedHeightFromDataBaseWithoutNanInches.toString() : "");
       }else if(convertedHeightFrombodyStatsRowWithoutNanFeet){
          setHeightFeetWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanFeet ? convertedHeightFrombodyStatsRowWithoutNanFeet.toString() : "");
          setHeightInchesWorkoutSettings(convertedHeightFrombodyStatsRowWithoutNanInches ? convertedHeightFrombodyStatsRowWithoutNanInches.toString() : "");
       }else{
        setHeightFeetWorkoutSettings(convertedHeightFrommWorkoutSettingsWithoutNanFeet ? convertedHeightFrommWorkoutSettingsWithoutNanFeet.toString() : "");
        setHeightInchesWorkoutSettings(convertedHeightFrommWorkoutSettingsWithoutNanInches ? convertedHeightFrommWorkoutSettingsWithoutNanInches.toString() : "");
       }
      

      
     
              
      }

      setDateFromDb(dayWorkoutWorkedTask?.date || "");
      if(dayWorkoutWorkedTask?.result){
        if(dayWorkoutWorkedTask?.result < 18.5){
          setWeightStatus("Underweight");
        }else if(18.5 <= dayWorkoutWorkedTask?.result <= 24.9){
          setWeightStatus("Healthy_Weight");

        }
        else if(25.0 <= dayWorkoutWorkedTask?.result <= 29.9){
          setWeightStatus("Overweight");

        }else if(30 <= dayWorkoutWorkedTask?.result){
          setWeightStatus("Obesity");

        }
      }else{
        setWeightStatus("");
      }
      
      setBmiResult(dayWorkoutWorkedTask?.result ? dayWorkoutWorkedTask?.result : "");
     
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
  function feetAndInchesToCm(feet, inches) {
    const newInches = inches || 0;
    const cmTotal = feet * 30.48 + newInches * 2.54;
    return cmTotal;
  }
  //values come from data base into inputs
  let convertedHeightFromDataBaseWithoutNanFeet = '';
  let convertedHeightFromDataBaseWithoutNanInches = '';
  // converted values will go into database as cm values
  let convertedHeightInCmWithoutNaN = "";
  
  let heightFeetValue = "";
  let heightInchesValue = "";

  if (unitsChecked === "Imperial"){
    //values come from data base into inputs
    const convertedHeightFromDataBase = cmToFeetAndInches(heightBmi);
    convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet : '';
    convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches : '';
    // converted values will go into database as cm values
    heightFeetValue = heightFeetWorkoutSettings !=='' ? heightFeetWorkoutSettings : convertedHeightFromDataBaseWithoutNanFeet;
    heightInchesValue = heightInchesWorkoutSettings !=='' ? heightInchesWorkoutSettings : convertedHeightFromDataBaseWithoutNanInches;
    //console.log('heightFeetValue-----',heightFeetValue);
    //console.log('heightInchesValue-----',heightInchesValue);
  
    const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetValue), parseFloat(heightInchesValue));
    convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? convertedHeightInCm : "";
  
  }
  //console.log('convertedHeightInCmWithoutNaN-----',convertedHeightInCmWithoutNaN);
  
  let newHeight='';
  if(unitsChecked === "Metrics"){
    newHeight = heightBmi?.toString();
  }else{
    newHeight = convertedHeightInCmWithoutNaN;
  }

    
    let bmi = '';
    const heightInInches = newHeight / 2.54; // Convert cm to inches
    console.log('weightBmi outside ',weightBmi);
    const weightInKg = weightBmi !=="" ? weightBmi / 2.20462 : ""; // convert weight from pounds to kg
    console.log('weightInKg outside ',weightInKg);
    const weightKgToDatabase = unitsChecked=="Metrics" ? weightBmi : weightInKg;
    console.log('weightKgToDatabase outside ',weightKgToDatabase);

    
    if(unitsChecked=="Metrics"){
      //metric units: BMI = weight (kg) ÷ height2 (meters)
      bmi = (parseFloat(weightBmi) /  
        ((parseFloat(newHeight) / 100) ** 2))?.toFixed(2); 
      // bmi here will be shown in calculator and will be sent to database
    }else{
      //US units: BMI = weight (lb) ÷ height2 (inches) * 703
      bmi = ((parseFloat(weightBmi) /  ((parseFloat(heightInInches)) ** 2))* 703)?.toFixed(2);
      // bmi here will be shown in calculator but bmiImperialConvertedToMetric will be sent to database
      //weight (lb) will be show in the calculator but weightInKg must be send to database
    
    }
    const todayDate = new Date().toISOString().split('T')[0];
    const checkFutureDate = sentPassNewDate > todayDate ? true : false ;

    //console.log('todayDate',checkFutureDate);
    
    //console.log('bmi ------>',bmi);
    
    //console.log('userId ---->',userId);

    //console.log('weightKgToDatabase typeof  ---->',calculatorsTableLastInsertedRow?.weight,'weightKgToDatabase', weightKgToDatabase);
    // Set the BMI result 
    //setBmiResult(bmi); 
    

  const handleCalculateBmi = () => { 
    if (!weightKgToDatabase || weightKgToDatabase == "" || isNaN(weightKgToDatabase) && !calculatorsTableLastInsertedRow?.weight?.toString()) { 
      Alert.alert(`${t('weight_are_required')}`); 
      return;
    }
    if (!newHeight || isNaN(newHeight) || newHeight == "") { 
      Alert.alert(`${t('height_are_required')}`); 
      return;
    }

    if(newHeight === 0 || newHeight === '0'){
      Alert.alert(`${t('Height_must_be_greater_than_zero')}`); 
      return;
    }
    if(weightKgToDatabase === 0 || weightKgToDatabase === '0' || calculatorsTableLastInsertedRow?.weight == 0){
      Alert.alert(`${t('Weight_must_be_greater_than_zero')}`); 
      return;
    }
    console.log('calcaulate bmi',bmi);
    if(bmi && !isNaN(bmi)){
      if(bmi < 18.5){
        setWeightStatus("Underweight");
      }else if(18.5 <= bmi <= 24.9){
        setWeightStatus("Healthy_Weight");
  
      }
      else if(25.0 <= bmi <= 29.9){
        setWeightStatus("Overweight");
  
      }else if(30 <= bmi){
        setWeightStatus("Obesity");
  
      }
    }else{
      setWeightStatus("");
    }
    
    setBmiResult(!isNaN(bmi) ? bmi : ""); 
  };   
  const handleSubmitBmi = () => { 
    if ((!weightKgToDatabase || weightKgToDatabase == "" || isNaN(weightKgToDatabase) && !calculatorsTableLastInsertedRow?.weight?.toString()) || !newHeight || isNaN(newHeight) || newHeight == "" || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
      Alert.alert(`${t('All_fields_are_required')}`); 
      return;
    }

    if(weightKgToDatabase === 0 || weightKgToDatabase === '0' || calculatorsTableLastInsertedRow?.weight == 0 || calculatorsTableLastInsertedRow?.weight == "0"){
      Alert.alert(`${t('Weight_must_be_greater_than_zero')}`); 
      return;
    }

    if(newHeight === 0 || newHeight === '0'){
      Alert.alert(`${t('Height_must_be_greater_than_zero')}`); 
      return;
    }
    
    if(checkFutureDate){
      Alert.alert(`${t('You_can_t_select_date_in_the_Future')}`);
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
      calNam:"bmiCal",
      methds:"",
      sFMthd:"",
      age:ageCal,
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
      result:parseFloat(bmi),
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
      //console.log('result insert user calculators Measurements into database',result);
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
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <PageContainer>
    <ScrollView >
        <TitleView >
          <Title >Life</Title>
        </TitleView>
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
        <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/BMI_Calculator.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover>
        <View>
        </View>
      <Spacer size="large">
      <ServiceInfoParentView >
        {showInfo ? (
          <ServiceCloseInfoButtonView>
            <ServiceCloseInfoButton onPress={toggleInfo}>
              <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
            </ServiceCloseInfoButton>
            <ServiceCloseInfoButtonTextView style={{backgroundColor:"#000",}}>
              <ServiceCloseInfoButtonText>{t("BMI_Calculator_desc")}</ServiceCloseInfoButtonText>
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
    <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
              
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Select_Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <CalendarBmiCalculator navigation={navigation}
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
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
                    value={heightBmi?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setHeightBmi(u)}
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
                      onChangeText={(u) => setHeightFeetWorkoutSettings(u)}
                      />
                    <FormHalfInput
                      placeholder={t("Inches")}
                      value={heightInchesValue?.toString()}
                      keyboardType="numeric"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(u) => setHeightInchesWorkoutSettings(u)}
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
              placeholder={(unitsChecked !== "") ? unitsChecked=="Metrics" ? `${t('Kg')}` : `${t('lb')}`: ''}
              value={weightBmi} 
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightBmi(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel>   {t("Result")}:</FormLabel>
          </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{bmiResult} {t('kg_m2')}</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel>{t("Weight_Status")}:</FormLabel>
          </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{weightStatus ? t(weightStatus) : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
          <FormElemeentSizeButtonView style={{width:"48%"}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
      onPress={handleCalculateBmi}>
            <CalendarFullSizePressableButtonText >{t("Calculate")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
          <FormElemeentSizeButtonView style={{width:"48%"}}> 

          {(dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          // if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              handleSubmitBmi();
            // }else{
            //   //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
            //   Alert.alert(`${t("note")}`,`${t("trying_to_add_different_gener_message")}`);
            // }
          
          }}>
              <CalendarFullSizePressableButtonText >{t("Update_Entry")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            ):(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          // if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              handleSubmitBmi();
            // }else{
            //   //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
            //   Alert.alert(`${t("note")}`,`${t("trying_to_add_different_gener_message")}`);
            // }
          
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