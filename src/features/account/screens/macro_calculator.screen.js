import React, { useState,useContext,useEffect, useRef  } from "react";
import { ScrollView,View, Modal,Alert,Text, Dimensions,StyleSheet,Animated, Easing} from "react-native";
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
import { fetchbodyStatsAndMeasurementsLastInsertedRow,fetchbodyStatsAndMeasurementsDateTheSameDateInCalculator } from "../../../../database/B_S_and_measurements"; 
import { Spinner } from '@ui-kitten/components';
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
  FullSizeButtonView,
  FullButton,
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
  TraineeOrTrainerField,
  TraineeOrTrainerButtonField,
  TraineeOrTrainerButtonsParentField,
  ViewOverlay,
  FormHalfInputView,
  FormHalfInput,
  GenderSelector,
  NewFormLabelDateRowView,
  AsteriskTitle,
  ResultsParentView,
  ResultsHalfRowView,
  ResultsHalfRowLabelView ,
  ResultsHalfRowResultPlaceView,
  ResultsHalfRowResultPlaceViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,


} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { RadioButton} from "react-native-paper";
import { useDate } from './DateContext'; // Import useDate from the context
import { PlansScreen } from "./plans.screen";
import { CalendarMacroCalculator } from "./calendar_macro_calculator";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchCalculatorsTable,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";

import { useFocusEffect } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
const { width } = Dimensions.get('window');
 

export const MacroCalculatorScreen = ({ route, navigation }) => {
  const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;
  const context = useContext(AuthGlobal);
  const {t} = useTranslation();//add this line
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [updateShowSuccess, setUpdateShowSuccess] = useState(false);

  
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
  const { selectedDate } = useDate(); // Access selectedDate from the context
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
  const [caloriesResult, setCaloriesResult] = useState(null); 
  const [proteinValue, setProteinValue] = useState(null); 
  const [fatValue, setFatValue] = useState(null); 
  const [carbsValue, setCarbsValue] = useState(null); 
  const [userId,setUserId] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [calculatorsTableLastInsertedRow,setCalculatorsTableLastInsertedRow] = useState({});

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
   ////////////// Start workoutData////////////////
const [selectedWorkout,setSelectedWorkout] = useState('');
const workoutData = [
  'Sedentary: little or no exercise',
  'Light: exercise 1-3 days a week',
  'Moderate: exercise 3-5 days a week',
  'Very Active: hard exercise 6-7 days/ week',
  'Super active:very hard exercise daily, physical job',
];
const workoutDataValues = [
  1.2,
  1.375,
  1.55,
  1.725,
  1.9,
];
const renderWorkoutOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayWorkoutValue = workoutData[selectedWorkout?.row];
const workoutDataValue =workoutDataValues[selectedWorkout?.row];
////////////// End workoutData////////////////
////////////// Start targetData////////////////
const [selectedTarget,setSelectedTarget] = useState('');
const targetData = [
  'Maintain',
  'Cut',
  'Bulk',
];
const targetDataValues = [
  0,
  -300,
  300
];
const renderTargetOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayTargetValue = targetData[selectedTarget?.row];
const targetDataValue =targetDataValues[selectedTarget?.row];
////////////// End targetData////////////////
////////////// Start typeOfDietData////////////////
const [selectedTypeOfDiet,setSelectedTypeOfDiet] = useState('');
const typeOfDietData = [
  'High Protein, Moderate Fat, Moderate Carbs',
  'High Protein, High Fats, Zero Carbs',
  'Moderate Protein, Moderate Fat, Moderate Carbs',
];
const dietDataValues = [
  [35,25,40],
  [35,60,5],
  [22,30,48],
];
const renderTypeOfDietOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayTypeOfDietValue = typeOfDietData[selectedTypeOfDiet?.row];
const dietDataValue =dietDataValues[selectedTypeOfDiet?.row];

////////////// End typeOfDietData////////////////
useEffect(() => {

    // Fetch the latest data or update the state here
  AsyncStorage.getItem("currentUser").then((user) => {
    const storedUser = JSON.parse(user);
    ////console.log('Macro calculator user---->>>',storedUser);
    setUserId(storedUser.id);
    

      if(Object.keys(context.stateUser.userPublicSettings)?.length > 0){
        setUnitsChecked(context.stateUser.userPublicSettings?.units);
        setGenderChecked(context.stateUser.userProfile.gender);
        setGenderCheckedToCompare(context.stateUser.userProfile.gender);
        const genderIndex = genderData.indexOf(context.stateUser.userProfile.gender);
        //console.log('genderIndex userPublicSettings',genderIndex);
        setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));
      fetchCalculatorsTableLastInsertedRow(storedUser?.id,"macroCal").then((calculatorsResults) => {
        let newSentAge = calculatorsResults?.age ? calculatorsResults?.age : context.stateUser.userPublicSettings.age;
        setAgeBmr(newSentAge);

        let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : context.stateUser.userPublicSettings?.height?.toFixed(2);

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
        ////console.log('Macro calculatorsResults-->',calculatorsResults);
          setCalculatorsTableLastInsertedRow(calculatorsResults);
          ////console.log('inside------> stateUser.userPublicSettings unitsChecked',context.stateUser.userPublicSettings?.units);
    
          const weightComeFromtDBToPounds = calculatorsResults?.weight?.toFixed(0) * 2.20462; // Convert kg to pounds
          const weightComeFromDatabase  =  context.stateUser.userPublicSettings?.units == "Metrics" ? calculatorsResults?.weight?.toFixed(0) : weightComeFromtDBToPounds.toFixed(3);
          const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
          ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
          
          setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Mifflin');
          setWeightBmr(weightComeFromDatabaseWithoutNaN);
          //setTdeeResult(calculatorsResults?.result);
          const workoutDataIndex = workoutData?.indexOf(calculatorsResults?.workot);
          setSelectedWorkout(workoutDataIndex !== -1 ? new IndexPath(workoutDataIndex) : new IndexPath(0));
          const targetDataIndex = targetData?.indexOf(calculatorsResults?.target);
          setSelectedTarget(targetDataIndex !== -1 ? new IndexPath(targetDataIndex) : new IndexPath(0));
          const typeOfDietDataIndex = typeOfDietData?.indexOf(calculatorsResults?.ditTyp);
          setSelectedTypeOfDiet(typeOfDietDataIndex !== -1 ? new IndexPath(typeOfDietDataIndex) : new IndexPath(0));
          setCaloriesResult(calculatorsResults?.calris); 
          setProteinValue(calculatorsResults?.protin);
          setFatValue(calculatorsResults?.fats);
          setCarbsValue(calculatorsResults?.carbs);  
        });
      }else{
        fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
          setHeightBmr(PSettingsResults[0]?.height);
          setUnitsChecked(PSettingsResults[0]?.units);
          setGenderChecked(storedUser?.gender);
          setGenderCheckedToCompare(storedUser?.gender);

          const genderIndex = genderData.indexOf(storedUser?.gender);
          //console.log('genderIndex fetchPublicSettings',genderIndex);
          setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));

        fetchCalculatorsTableLastInsertedRow(storedUser.id,"macroCal").then((calculatorsResults) => {
          let newSentAge = calculatorsResults?.age ? calculatorsResults?.age : PSettingsResults[0]?.age;
          setAgeBmr(newSentAge);
          
          //console.log('BMR calculatorsResults fetchPublicSettings-->',calculatorsResults);
          let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : PSettingsResults[0]?.height?.toFixed(2);
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
          
          ////console.log('Macro calculatorsResults-->',calculatorsResults);
            setCalculatorsTableLastInsertedRow(calculatorsResults);
            ////console.log('inside------> stateUser.PSettingsResults[0].units unitsChecked',PSettingsResults[0]?.units);
      
            const weightComeFromtDBToPounds = calculatorsResults?.weight?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabase  =  PSettingsResults[0]?.units == "Metrics" ? calculatorsResults?.weight?.toFixed(0) : weightComeFromtDBToPounds?.toFixed(3);
            const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
            ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
            
            setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Mifflin');
            setWeightBmr(weightComeFromDatabaseWithoutNaN);
            //setTdeeResult(calculatorsResults?.result);
            const workoutDataIndex = workoutData?.indexOf(calculatorsResults?.workot);
            setSelectedWorkout(workoutDataIndex !== -1 ? new IndexPath(workoutDataIndex) : new IndexPath(0));
            const targetDataIndex = targetData?.indexOf(calculatorsResults?.target);
            setSelectedTarget(targetDataIndex !== -1 ? new IndexPath(targetDataIndex) : new IndexPath(0));
            const typeOfDietDataIndex = typeOfDietData?.indexOf(calculatorsResults?.ditTyp);
            setSelectedTypeOfDiet(typeOfDietDataIndex !== -1 ? new IndexPath(typeOfDietDataIndex) : new IndexPath(0));
            setCaloriesResult(calculatorsResults?.calris); 
            setProteinValue(calculatorsResults?.protin);
            setFatValue(calculatorsResults?.fats);
            setCarbsValue(calculatorsResults?.carbs);  
          });
        });
      }
      
      const timer = setTimeout(() => {
        setLoadingPageInfo(false);
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
       
   
    });
  }, [AsyncStorage,fetchPublicSettings,fetchCalculatorsTableLastInsertedRow,selectedDate]);




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


  ////console.log('weightBmr',weightBmr);
    //KG from database

  const weightInKg = weightBmr !=="" ? 0.45359237 * parseFloat(weightBmr) : ""; // convert weight from pounds to kg
  const weightKgToDatabase = unitsChecked=="Metrics" ? weightBmr : weightInKg;
  const weightKgToDatabaseParsed =parseFloat(weightKgToDatabase)?.toFixed(0);
  ////console.log('ageBmr',ageBmr);
  ////console.log('heightBmr',heightBmr);
  ////console.log('genderChecked',genderChecked);
  ////console.log('weightKgToDatabase', weightKgToDatabaseParsed);
  ////console.log('weightInKg',weightInKg);
  ////console.log('selectedWorkout.row',selectedWorkout.row);
  ////console.log('equaChecked',equaChecked);
  ////console.log('unitsChecked',unitsChecked);
  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: calculatorsTableLastInsertedRow?.date;

  useEffect(() => {
    //console.log('Route Params:', params);
    
    //console.log('Route Object.keys(dayWorkoutWorkedTask).length:', Object.keys(dayWorkoutWorkedTask).length);
    const useEffectLoadData = async () => {
      const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(userId);
  console.log('sentPassNewDate useEffectLoadData',sentPassNewDate);
  console.log('dayWorkoutWorkedTask useEffectLoadData',dayWorkoutWorkedTask);
  
    if (sentPassNewDate) {
   
      
      let weightComeFromtDBToPounds = parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
      let newWeight = unitsChecked=="Metrics" ? `${parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0)}` : `${weightComeFromtDBToPounds.toFixed(3)}`;
      //weight come from bodyStatsRow
      console.log('newWeight',newWeight);
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
      
      
    
  
  
        if(dayWorkoutWorkedTask?.height != "" && bodyStatsRow?.height != ""){
          
  
  
        //console.log('BMR calculatorsResults fetchPublicSettings-->',calculatorsResults);
        let heightComeFromDbOrSaved =  dayWorkoutWorkedTask?.height ? dayWorkoutWorkedTask?.height :bodyStatsRow?.height ? bodyStatsRow?.height.toFixed(2): "";
        console.log('MACRO PSettingsResults heightComeFromDbOrSaved-->',heightComeFromDbOrSaved);
  
        
        const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches
  
        //console.log(' before if PSettingsResult heightComeFromDbOrSaved',heightComeFromDbOrSaved);
  
        const heightComeFromDatabase  =  unitsChecked =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
  
        if(unitsChecked =="Metrics"){
        const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
        setHeightBmr(heightComeFromDatabaseWithoutNaN);
  
        }else{
        const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
        const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
        setHeightFeetBmr(heightComeFromDatabaseFeetWithoutNaN);
        setHeightInchesBmr(heightComeFromDatabaseInchesWithoutNaN);
  
        
  
  
        }
  
      }
      setDateFromDb(dayWorkoutWorkedTask?.date || "");
      setEquaChecked(dayWorkoutWorkedTask?.methds !== undefined ? dayWorkoutWorkedTask?.methds : 'Mifflin');
  
      const workoutDataIndex = workoutData?.indexOf(dayWorkoutWorkedTask?.workot);
          setSelectedWorkout(workoutDataIndex !== -1 ? new IndexPath(workoutDataIndex) : new IndexPath(0));
          const targetDataIndex = targetData?.indexOf(dayWorkoutWorkedTask?.target);
          setSelectedTarget(targetDataIndex !== -1 ? new IndexPath(targetDataIndex) : new IndexPath(0));
          const typeOfDietDataIndex = typeOfDietData?.indexOf(dayWorkoutWorkedTask?.ditTyp);
          setSelectedTypeOfDiet(typeOfDietDataIndex !== -1 ? new IndexPath(typeOfDietDataIndex) : new IndexPath(0));
          setCaloriesResult(dayWorkoutWorkedTask?.calris); 
          setProteinValue(dayWorkoutWorkedTask?.protin);
          setFatValue(dayWorkoutWorkedTask?.fats);
          setCarbsValue(dayWorkoutWorkedTask?.carbs);  
    }
  
  
  };
   useEffectLoadData();
  
  }, [params]);
  useEffect(() => {
    const protein = proteinValue ? parseFloat(proteinValue) : 0;
    const carbs = carbsValue ? parseFloat(carbsValue) : 0;
    const fats = fatValue ? parseFloat(fatValue) : 0;

    const calories = protein * 4 + carbs * 4 + fats * 9;
    // setCaloriesAddEntry(calories ? parseFloat(calories.toFixed(4)) : ""); // Round to two decimal places
    setCaloriesResult(calories);
    // TotalCalories = calories ? parseFloat(calories?.toFixed(4)) : "";

  }, [proteinValue, carbsValue, fatValue]);
    if(equaChecked=="Mifflin"){
      if(genderChecked=='Him'){
        if(unitsChecked=="Metrics"){
          //BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
          bmr = (10 * parseFloat(weightBmr))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) + 5;
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
          ////console.log('Metrics weightBmr',weightBmr);
          ////console.log('Metrics heightBmr',heightBmr);
          ////console.log('Metrics ageBmr',ageBmr);
          ////console.log('Metrics workoutDataValue',workoutDataValue);
          ////console.log('Metrics targetDataValue',targetDataValue);
          ////console.log('Metrics TDEE',TDEE);
          ////console.log('Metrics TotalCalories',TotalCalories);
          ////console.log('Metrics proteinNumber',proteinNumber);
          ////console.log('Metrics dietDataValue',dietDataValue);
        }else{
          //BMR = (4.536 × weight in pounds) + (15.88 × height in inches) − (5 × age) + 5
          bmr = (10 * parseFloat(weightInKg))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) + 5;
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
           
        }
      }else{
        if(unitsChecked=="Metrics"){
          //BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
          bmr = (10 * parseFloat(weightBmr))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) - 161;
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }else{
          //BMR = (4.536 × weight in pounds) + (15.88 × height in inches) − (5 × age) − 161;
          bmr = (10 * parseFloat(weightInKg))+(6.25 * parseFloat(newHeight)) - (5*parseFloat(ageBmr)) - 161;
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          //put ???????
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }
      }
    }else if(equaChecked=="HarrisBenedic"){
      if(genderChecked=='Him'){
        if(unitsChecked=="Metrics"){
          //BMR = 88.362 + (13.397 x weight in kg) + (4.799 x height in cm) - (5.677 x age in years)
          bmr =  88.362 + (13.397 * parseFloat(weightBmr))+(4.799 * parseFloat(newHeight)) - (5.677*parseFloat(ageBmr));
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }else{
          //5 feet * 12 inches/foot = 60 inches
          //8 inches = 8 inches
          //height in inches, which is 60 + 8 = 68 inches.
          //bmr =  88.362 + (13.397 * (0.45359237 * parseFloat(weightBmr)))+(4.799 * (((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr)) *2.54) ) - (5.677 *parseFloat(ageBmr));
          bmr =  88.362 + (13.397 * parseFloat(weightInKg))+(4.799 * parseFloat(newHeight)) - (5.677*parseFloat(ageBmr));
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }
      }else{
        if(unitsChecked=="Metrics"){
        //BMR = 447.593 + (9.247 x weight in kg) + (3.098 x height in cm) - (4.330 x age in years)          
          bmr =   447.593 + (9.247 * parseFloat(weightBmr))+(3.098 * parseFloat(newHeight)) - (4.330*parseFloat(ageBmr));
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }else{
          //bmr =  447.593 + (9.247 * (0.45359237 * parseFloat(weightBmr)))+(3.098 * (((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr)) *2.54)) - (4.330*parseFloat(ageBmr));
          bmr =   447.593 + (9.247 * parseFloat(weightInKg))+(3.098 * parseFloat(newHeight)) - (4.330*parseFloat(ageBmr));
          TDEE = workoutDataValue * bmr;
          TotalCalories = TDEE +targetDataValue;
          proteinNumber = TotalCalories*((dietDataValue?.[0])/100); 
          fatNumber=TotalCalories*((dietDataValue?.[1])/100); 
          carbsNumber= TotalCalories*((dietDataValue?.[2])/100); 
        }
      }
    }else if(equaChecked=="Manual"){
      
      proteinNumber = proteinValue; 
      fatNumber=fatValue; 
      carbsNumber= carbsValue; 
      TotalCalories = caloriesResult;

    }
    const todayDate = new Date().toISOString().split('T')[0];
    const checkFutureDate = sentPassNewDate > todayDate ? true : false ;
    ////console.log('todayDate',checkFutureDate);
    ////console.log('TotalCalories',TotalCalories);
 
  const handleCalculateBmr = () => { 
    if(equaChecked == 'Manual' ){
      if(TotalCalories?.toString().trim() === '' || proteinNumber?.toString().trim() === '' || fatNumber?.toString().trim() === '' || carbsNumber?.toString().trim() === '' || weightKgToDatabase === "" ||  ageBmr?.toString().trim() === "" ||
    (!heightBmr?.toString().trim() && (heightFeetBmr?.toString().trim() === '' || heightInchesBmr?.toString().trim() === '')) ||
     selectedWorkout?.row === undefined || selectedTypeOfDiet?.row === undefined || selectedTarget?.row === undefined || equaChecked === undefined ) { 
      Alert.alert(`${t('All_fields_are_required')}`); 
      return;
    }
    }
    if(weightKgToDatabase === "" ||  ageBmr?.toString().trim() === "" ||
    (!heightBmr?.toString().trim() && (heightFeetBmr?.toString().trim() === '' || heightInchesBmr?.toString().trim() === '')) ||
     selectedWorkout?.row === undefined || selectedTypeOfDiet?.row === undefined || selectedTarget?.row === undefined || equaChecked === undefined ) { 
      Alert.alert(`${t('All_fields_are_required')}`); 
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
    //setTdeeResult(TDEE.toFixed(2));
    setCaloriesResult(parseFloat(TotalCalories)?.toFixed(0)); 
    setProteinValue(parseFloat(proteinNumber/4)?.toFixed(0));
    setFatValue(parseFloat(fatNumber/9)?.toFixed(0));
    setCarbsValue(parseFloat(carbsNumber/4)?.toFixed(0)); 
  };   
  const handleSubmitBmr = () => {
    //console.log('ageBmr',ageBmr);
    //console.log('TotalCalories?.toString().trim()',TotalCalories?.toString().trim());
    

    //console.log('typeof ageBmr',typeof ageBmr);
    //console.log('ageBmr?.toString().trim()',ageBmr?.toString().trim());
    if(equaChecked == 'Manual' ){
      if(TotalCalories?.toString().trim() === '' || proteinNumber?.toString().trim() === '' || fatNumber?.toString().trim() === '' || carbsNumber?.toString().trim() === '' || weightKgToDatabase === "" ||  ageBmr?.toString().trim() === "" ||
    (!heightBmr?.toString().trim() && (heightFeetBmr?.toString().trim() === '' || heightInchesBmr?.toString().trim() === '')) ||
     selectedWorkout?.row === undefined || selectedTypeOfDiet?.row === undefined || selectedTarget?.row === undefined || equaChecked === undefined || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
      Alert.alert(`${t('All_fields_are_required')}`); 
      return;
    }
    }
    
    if(weightKgToDatabase === "" ||  ageBmr?.toString().trim() === "" ||
    (!heightBmr?.toString().trim() && (heightFeetBmr?.toString().trim() === '' || heightInchesBmr?.toString().trim() === '')) ||
     selectedWorkout?.row === undefined || selectedTypeOfDiet?.row === undefined || selectedTarget?.row === undefined || equaChecked === undefined || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
      Alert.alert(`${t('All_fields_are_required')}`); 
      return;
    }
    if(weightKgToDatabase === 0 || weightKgToDatabase === '0' ){
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
    let userCalAndMeasurements ={};

    if(equaChecked == 'Manual' ){
       userCalAndMeasurements = {
        userId:userId,
        date: lastInsertedRowDate,
        calNam:"macroCal",
        methds:equaChecked,
        sFMthd:"",
        age:ageBmr,
        height:newHeight,
        weight: weightKgToDatabaseParsed,
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
        workot:displayWorkoutValue,
        target:displayTargetValue,
        ditTyp:displayTypeOfDietValue,
        result:"",
        bFPctg:"",
        bFMass:"",
        lBMass:"",
        calris:parseFloat(TotalCalories)?.toFixed(0),
        protin:parseFloat(proteinNumber)?.toFixed(0),
        fats:parseFloat(fatNumber)?.toFixed(0),
        carbs:parseFloat(carbsNumber)?.toFixed(0),
        isSync :'no',
      };
    
    }else{
       userCalAndMeasurements = {
        userId:userId,
        date: lastInsertedRowDate,
        calNam:"macroCal",
        methds:equaChecked,
        sFMthd:"",
        age:ageBmr,
        height:newHeight,
        weight: weightKgToDatabaseParsed,
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
        workot:displayWorkoutValue,
        target:displayTargetValue,
        ditTyp:displayTypeOfDietValue,
        result:"",
        bFPctg:"",
        bFMass:"",
        lBMass:"",
        calris:parseFloat(TotalCalories)?.toFixed(0),
        protin:parseFloat(proteinNumber/4)?.toFixed(0),
        fats:parseFloat(fatNumber/9)?.toFixed(0),
        carbs:parseFloat(carbsNumber/4)?.toFixed(0),
        isSync :'no',
      };
    }
    insertCalculatorsTable(userCalAndMeasurements).then((result)=>{
      ////console.log('result insert user calculators Measurements into database',result);
      if ( dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date){

        setUpdateLoading(false);
        setUpdateShowSuccess(true); // Show success message and animation
        // Delay to allow users to see the success message before closing the modal
        setTimeout(() => {
          setUpdateShowSuccess(false);

  
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
        <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/Macro_calculator.jpeg')} 
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
              <ServiceCloseInfoButtonText>{t("Macro_Calculator_desc")}</ServiceCloseInfoButtonText>
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
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="Manual"
                status={ equaChecked === 'Manual' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('Manual')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t("Manual")}</FormLabel>
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
              <CalendarMacroCalculator navigation={navigation}
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
              placeholder={`${unitsChecked === 'Metrics' ? `${t('Kg')}` : `${t('Pounds')}`}`}
              value={weightBmr} 
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightBmr(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Workout")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <GenderSelector
              selectedIndex={selectedWorkout}
              onSelect={(index) => setSelectedWorkout(index)}
              placeholder='List of Workouts'
              value={displayWorkoutValue}
              style={{width:"100%"}}
              status="newColor"
              size="customSizo"
            >
              {workoutData.map(renderWorkoutOption)}
            </GenderSelector>
            </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Target")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <GenderSelector
              selectedIndex={selectedTarget}
              onSelect={(index) => setSelectedTarget(index)}
              placeholder='Target'
              value={displayTargetValue}
              style={{width:"100%"}}
              status="newColor"
              size="customSizo"
            >
              {targetData.map(renderTargetOption)}
            </GenderSelector>
            </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Type_of_Diet")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <GenderSelector
              selectedIndex={selectedTypeOfDiet}
              onSelect={(index) => setSelectedTypeOfDiet(index)}
              placeholder={t("Type_of_Diet")}
              value={displayTypeOfDietValue}
              style={{width:"100%"}}
              status="newColor"
              size="customSizo" 
            >
              {typeOfDietData.map(renderTypeOfDietOption)}
            </GenderSelector>
            </FormInputView>
        </InputField>
      </Spacer>
      {(equaChecked !== 'Manual')?(   
        <View>
          <Spacer size="medium">
          <ResultsParentView >
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Calories")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{caloriesResult !== "NaN" ? caloriesResult : ''} {t("g_day")}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
            </ResultsHalfRowView>
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Protein")}:</FormLabel>
              </ResultsHalfRowLabelView> 
                <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{proteinValue !== "NaN" ? proteinValue : ''} {t("g_day")}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
            </ResultsHalfRowView>
          </ResultsParentView>
          </Spacer>
          <Spacer size="small">
          <ResultsParentView >
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Fats")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{fatValue !== "NaN" ? fatValue : ''} {t("g_day")}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
            </ResultsHalfRowView>
            <ResultsHalfRowView>
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Carbohydrates")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{carbsValue !== "NaN" ? carbsValue : ''} {t("g_day")}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
            </ResultsHalfRowView>
          </ResultsParentView>
          </Spacer>
        </View>
      ):(
        <>

        <Spacer size="medium">
        
          <ResultsParentView >
            {/* <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Calories")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <FormInput
                    placeholder={t("g_day")}
                    value={caloriesResult?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setCaloriesResult(u)}
                  />
                    
            </ResultsHalfRowView> */}
            
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Carbs")}:</FormLabel>
              </ResultsHalfRowLabelView> 
                <FormInput
                    placeholder={t("g_day")}
                    value={carbsValue?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setCarbsValue(u)}
                  />
            </ResultsHalfRowView>
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Protein")}:</FormLabel>
              </ResultsHalfRowLabelView> 
                <FormInput
                    placeholder={t("g_day")}
                    value={proteinValue?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setProteinValue(u)}
                  />
            </ResultsHalfRowView>
          </ResultsParentView>
          </Spacer>
          <Spacer size="medium">
          <ResultsParentView >
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Fats")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <FormInput
                    placeholder={t("g_day")}
                    value={fatValue?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setFatValue(u)}
                  />
                    
            </ResultsHalfRowView>
            <ResultsHalfRowView >
              <ResultsHalfRowLabelView>
                <FormLabel>{t("Calories")}:</FormLabel>
              </ResultsHalfRowLabelView>
                <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{caloriesResult !== "NaN" ? caloriesResult : ''} {t("g_day")}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
            </ResultsHalfRowView>
          </ResultsParentView>
          </Spacer>
         
        </>

      )}
      {(equaChecked !== 'Manual')?( 
      <>
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
      </>
      ):(
        <Spacer size="large">
                <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
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
        </Spacer>
      )}
      
    {/* <Spacer size="medium">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
    onPress={()=>navigation.goBack()}>
          <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView>
    </Spacer> */}
    <Spacer size="large"></Spacer>
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