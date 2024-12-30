import React, { useState,useEffect,useContext, useRef } from "react";
import { 
  ScrollView,View, Modal,Alert,Text, Animated, Easing,StyleSheet} from "react-native";
  import { Spinner } from '@ui-kitten/components';
  import {AntDesign} from '@expo/vector-icons';
  import { fetchbodyStatsAndMeasurementsLastInsertedRow,insertBodyStatsAndMeasurements } from "../../../../database/B_S_and_measurements"; 

  import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  AsteriskTitle,
  GenderSelector,
  FullSizeButtonView,
  NewFormLabelDateRowView,

  FullButton,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  FormElemeentSizeButton,
  FormInputSizeButton,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  PageMainImage,
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
import { Spacer } from "../../../components/spacer/spacer.component";
import { RadioButton} from "react-native-paper";
import { useDate } from './DateContext'; // Import useDate from the context
import { CalendarBodyFatCalculator } from "./calendar_body_fat_calculator";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';

import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchCalculatorsTable,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";

import { useFocusEffect } from '@react-navigation/native';

export const BodyFatAndLbmScreen = ({ navigation,route }) => {
  const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;
  
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
  const [heightBodyFatLbm, setHeightBodyFatLbm] = useState("");
  const [weightBodyFatLbm, setWeightBodyFatLbm] = useState("");
  const [neckBodyFatLbm, setNeckBodyFatLbm] = useState("");  
  const [torsoBodyFatLbm, setTorsoBodyFatLbm] = useState("");
  const [hipsBodyFatLbm, setHipsBodyFatLbm] = useState("");
  const {t} = useTranslation();//add this line

  const [heightFeetBodyFatLbm, setHeightFeetBodyFatLbm] = useState("");
  const [heightInchesBodyFatLbm, setHeightInchesBodyFatLbm] = useState("");
  const [neckFeetBodyFatLbm, setNeckFeetBodyFatLbm] = useState("");
  const [neckInchesBodyFatLbm, setNeckInchesBodyFatLbm] = useState("");
  const [torsoFeetBodyFatLbm, setTorsoFeetBodyFatLbm] = useState("");
  const [torsoInchesBodyFatLbm, setTorsoInchesBodyFatLbm] = useState("");
  const [hipsFeetBodyFatLbm, setHipsFeetBodyFatLbm] = useState("");
  const [hipsInchesBodyFatLbm, setHipsInchesBodyFatLbm] = useState("");
//(Chest, *Midaxillary, *Triceps, *Subscapular, Abdomen, *Suprailiac, *Thigh
  const[thighBodyFatLbm,setThighBodyFatLbm] = useState("");
  const[chestBodyFatLbm,setChestBodyFatLbm] = useState("");
  const[abdomenBodyFatLbm,setAbdomenBodyFatLbm] = useState("");
  const[tricepsBodyFatLbm,setTricepsBodyFatLbm] = useState("");
  const[axillaBodyFatLbm,setAxillaBodyFatLbm] = useState("");
  const[subscapulBodyFatLbm,setSubscapulBodyFatLbm] = useState("");
  const[supraliacBodyFatLbm,setSupraliacBodyFatLbm] = useState("");

  const [ageBodyFatLbm,setAgeBodyFatLbm] = useState("");
  const [equaChecked, setEquaChecked] = useState('Tape');

  const [bodyFatLbmResult, setBodyFatLbmResult] = useState(null);
  const [bodyFatMassResult, setBodyFatMassResult] = useState(null);
  const [leanBodyMassResult, setLeanBodyMassResult] = useState(null);
  const[skinFoldMethodsChecked,setSkinFoldMethodsChecked] = useState("ThreeSiteFormula");
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
  const [calculatorsTableLastInsertedRow,setCalculatorsTableLastInsertedRow] = useState({});

  const [dateFromDb,setDateFromDb] = useState("");

  











  const [userId,setUserId] = useState('');
  const context = useContext(AuthGlobal);
  const { selectedDate } = useDate(); // Access sentPassNewDate from the context
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  
  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: calculatorsTableLastInsertedRow?.date;
  // //console.log('lastInsertedRowDate is', lastInsertedRowDate);

  const [modalVisible, setModalVisible] = useState(false);
  function cmToFeetAndInches(cm) {
    const feet = Math.floor(cm / 30.48);
  
    // How to have inches match up?
    const inches = ((cm - feet * 30.48) * 0.393701)?.toFixed(2);
    return { feet, inches };
  }
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      ////console.log('Body Fat Lbm calculator user---->>>',storedUser);
      setUserId(storedUser.id);
      const loadData = async () => {
        const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(storedUser.id);

  
        if(Object.keys(context.stateUser.userPublicSettings).length > 0){
          setUnitsChecked(context.stateUser.userPublicSettings.units);
          setAgeBodyFatLbm(context.stateUser.userPublicSettings.age);
          setGenderChecked(context.stateUser.userProfile.gender);
          setGenderCheckedToCompare(context.stateUser.userProfile.gender);

          const genderIndex = genderData.indexOf(context.stateUser.userProfile.gender);
          //console.log('genderIndex userPublicSettings',genderIndex);
          setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));
          fetchCalculatorsTableLastInsertedRow(storedUser.id,"bodyFatCal").then((calculatorsResults) => {
            ////console.log('Body Fat calculatorsResults-->',calculatorsResults);
            setCalculatorsTableLastInsertedRow(calculatorsResults);
            setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Tape');
            setSkinFoldMethodsChecked(calculatorsResults?.methds === 'SkinFold' ? calculatorsResults?.sFMthd : 'ThreeSiteFormula');
            
            const weightComeFromtDBToPounds = parseFloat(calculatorsResults?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.weight)?.toFixed(0) : weightComeFromtDBToPounds?.toFixed(2);
            const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
           ////weight from bodyStatsRow table
           const weightComeFromtDBToPoundsFromBodyStatsRow = parseFloat(bodyStatsRow?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
           const weightComeFromDatabaseFromBodyStatsRow  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(bodyStatsRow?.weight)?.toFixed(0) : weightComeFromtDBToPoundsFromBodyStatsRow?.toFixed(2);
           const weightComeFromDatabaseWithoutNaNFromBodyStatsRow = !isNaN(weightComeFromDatabaseFromBodyStatsRow) ? weightComeFromDatabaseFromBodyStatsRow?.toString() : "";
           
           
            ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
            setWeightBodyFatLbm(weightComeFromDatabaseWithoutNaN ? weightComeFromDatabaseWithoutNaN : weightComeFromDatabaseWithoutNaNFromBodyStatsRow ? weightComeFromDatabaseWithoutNaNFromBodyStatsRow : "");
            let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : context.stateUser.userPublicSettings?.height?.toFixed(2);

            const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches
            const heightComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
            ////console.log('heightComeFromDatabase',heightComeFromDatabase);

            const torsoComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.torso)?.toFixed(2)); // Convert kg to feet and inches
            const torsoComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.torso)?.toFixed(2) : torsoComeFromtDBToFeetAndInches;
            ////torso from bodyStatsRow table
            const torsoComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.torso)?.toFixed(2)); // Convert kg to feet and inches
            const torsoComeFromDatabaseFromBodyStatsRow  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(bodyStatsRow?.torso)?.toFixed(2) : torsoComeFromtDBToFeetAndInchesFromBodyStatsRow;

            
            ////console.log('torsoComeFromDatabase',torsoComeFromDatabase);
            const neckComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.neck)?.toFixed(2)); // Convert kg to feet and inches
            const neckComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.neck)?.toFixed(2) : neckComeFromtDBToFeetAndInches;
            ////neck from bodyStatsRow table
            const neckComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.neck)?.toFixed(2)); // Convert kg to feet and inches
            const neckComeFromDatabaseFromBodyStatsRow  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(bodyStatsRow?.neck)?.toFixed(2) : neckComeFromtDBToFeetAndInchesFromBodyStatsRow;
            
            
            
            ////console.log('neckComeFromDatabase',neckComeFromDatabase);
            const hipsComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.hips)?.toFixed(2)); // Convert kg to feet and inches
            const hipsComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.hips)?.toFixed(2) : hipsComeFromtDBToFeetAndInches;
            ////console.log('hipsComeFromDatabase',hipsComeFromDatabase);
                  
            const thighComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.thigh) ? calculatorsResults?.thigh?.toString() : "";
            const chestComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.chest) ? calculatorsResults?.chest?.toString() : "";
            const abdomenComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.abdmen) ? calculatorsResults?.abdmen?.toString() : "";
            const tricepsComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.tricep) ? calculatorsResults?.tricep?.toString() : "";
            const axillaComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.axilla) ? calculatorsResults?.axilla?.toString() : "";
            const subscapulComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.subcpl) ? calculatorsResults?.subcpl?.toString() : "";
            const supraliacComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.sprlic) ? calculatorsResults?.sprlic?.toString() : "";
            ////console.log('thighComeFromDatabaseWithoutNaN',thighComeFromDatabaseWithoutNaN);
        
            setThighBodyFatLbm(thighComeFromDatabaseWithoutNaN);
            setChestBodyFatLbm(chestComeFromDatabaseWithoutNaN);
            setAbdomenBodyFatLbm(abdomenComeFromDatabaseWithoutNaN);
            setTricepsBodyFatLbm(tricepsComeFromDatabaseWithoutNaN);
            setAxillaBodyFatLbm(axillaComeFromDatabaseWithoutNaN);
            setSubscapulBodyFatLbm(subscapulComeFromDatabaseWithoutNaN);
            setSupraliacBodyFatLbm(supraliacComeFromDatabaseWithoutNaN);

            if(context.stateUser.userPublicSettings.units =="Metrics"){
              const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
              const torsoComeFromDatabaseWithoutNaN = !isNaN(torsoComeFromDatabase) ? torsoComeFromDatabase?.toString() :!isNaN(torsoComeFromDatabaseFromBodyStatsRow) ? torsoComeFromDatabaseFromBodyStatsRow?.toString() : "";
              const neckComeFromDatabaseWithoutNaN = !isNaN(neckComeFromDatabase) ? neckComeFromDatabase?.toString() : !isNaN(neckComeFromDatabaseFromBodyStatsRow) ? neckComeFromDatabaseFromBodyStatsRow?.toString() : "";
              const hipsComeFromDatabaseWithoutNaN = !isNaN(hipsComeFromDatabase) ? hipsComeFromDatabase?.toString() : "";
              
              //console.log('if ---- heightComeFromDatabaseWithoutNaN',heightComeFromDatabaseWithoutNaN);
              ////console.log('if ---- torsoComeFromDatabaseWithoutNaN',torsoComeFromDatabaseWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseWithoutNaN',neckComeFromDatabaseWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseWithoutNaN',hipsComeFromDatabaseWithoutNaN);

              setHeightBodyFatLbm(heightComeFromDatabaseWithoutNaN);
              setTorsoBodyFatLbm(torsoComeFromDatabaseWithoutNaN);
              setNeckBodyFatLbm(neckComeFromDatabaseWithoutNaN);
              setHipsBodyFatLbm(hipsComeFromDatabaseWithoutNaN);

            }else{
             
              const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
              const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
              


              
            


              const torsoComeFromDatabaseFeetWithoutNaN = !isNaN(torsoComeFromDatabase.feet) ? torsoComeFromDatabase.feet?.toString() : !isNaN(torsoComeFromDatabaseFromBodyStatsRow.feet) ? torsoComeFromDatabaseFromBodyStatsRow.feet?.toString() : "";
              const torsoComeFromDatabaseInchesWithoutNaN = !isNaN(torsoComeFromDatabase.inches) ? torsoComeFromDatabase.inches?.toString() : !isNaN(torsoComeFromDatabaseFromBodyStatsRow.inches) ? torsoComeFromDatabaseFromBodyStatsRow.inches?.toString() : "";
              




              const neckComeFromDatabaseFeetWithoutNaN = !isNaN(neckComeFromDatabase.feet) ? neckComeFromDatabase.feet?.toString() : !isNaN(neckComeFromDatabaseFromBodyStatsRow.feet) ? neckComeFromDatabaseFromBodyStatsRow.feet?.toString() : "";
              const neckComeFromDatabaseInchesWithoutNaN = !isNaN(neckComeFromDatabase.inches) ? neckComeFromDatabase.inches?.toString() : !isNaN(neckComeFromDatabaseFromBodyStatsRow.inches) ? neckComeFromDatabaseFromBodyStatsRow.inches?.toString() : "";
              
              
              
              
              
              
              const hipsComeFromDatabaseFeetWithoutNaN = !isNaN(hipsComeFromDatabase.feet) ? hipsComeFromDatabase.feet?.toString() : "";
              const hipsComeFromDatabaseInchesWithoutNaN = !isNaN(hipsComeFromDatabase.inches) ? hipsComeFromDatabase.inches?.toString() : "";
              
              ////console.log('if ---- torsoComeFromDatabaseFeetWithoutNaN',torsoComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- torsoComeFromDatabaseInchesWithoutNaN',torsoComeFromDatabaseInchesWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseFeetWithoutNaN',neckComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseInchesWithoutNaN',neckComeFromDatabaseInchesWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseFeetWithoutNaN',hipsComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseInchesWithoutNaN',hipsComeFromDatabaseInchesWithoutNaN);

              setHeightFeetBodyFatLbm(heightComeFromDatabaseFeetWithoutNaN);
              setHeightInchesBodyFatLbm(heightComeFromDatabaseInchesWithoutNaN);
              setTorsoFeetBodyFatLbm(torsoComeFromDatabaseFeetWithoutNaN);
              setTorsoInchesBodyFatLbm(torsoComeFromDatabaseInchesWithoutNaN);
              setNeckFeetBodyFatLbm(neckComeFromDatabaseFeetWithoutNaN);
              setNeckInchesBodyFatLbm(neckComeFromDatabaseInchesWithoutNaN);
              setHipsFeetBodyFatLbm(hipsComeFromDatabaseFeetWithoutNaN); 
              setHipsInchesBodyFatLbm(hipsComeFromDatabaseInchesWithoutNaN);
            }    
              
            setBodyFatLbmResult(parseFloat(calculatorsResults?.bFPctg)?.toFixed(1));
            const BodyFatMassComeFromtDBToPounds = parseFloat(calculatorsResults?.bFMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const BodyFatMassComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.bFMass)?.toFixed(0) : BodyFatMassComeFromtDBToPounds?.toFixed(1);
            const BodyFatMassComeFromDatabaseWithoutNaN = !isNaN(BodyFatMassComeFromDatabase) ? BodyFatMassComeFromDatabase?.toString() : "";
            ////console.log('inside BodyFatMassComeFromDatabaseWithoutNaN',BodyFatMassComeFromDatabaseWithoutNaN);
            setBodyFatMassResult(BodyFatMassComeFromDatabaseWithoutNaN);
            const LeanBodyMassComeFromtDBToPounds = parseFloat(calculatorsResults?.lBMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const LeanBodyMassComeFromDatabase  =  context.stateUser.userPublicSettings.units =="Metrics" ? parseFloat(calculatorsResults?.lBMass)?.toFixed(0) : LeanBodyMassComeFromtDBToPounds?.toFixed(1);
            const LeanBodyMassComeFromDatabaseWithoutNaN = !isNaN(LeanBodyMassComeFromDatabase) ? LeanBodyMassComeFromDatabase?.toString() : "";
            ////console.log('inside LeanBodyMassComeFromDatabaseWithoutNaN',LeanBodyMassComeFromDatabaseWithoutNaN);
            setLeanBodyMassResult(LeanBodyMassComeFromDatabaseWithoutNaN);
            
            });
        }else{
          fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
            // setHeightBodyFatLbm(PSettingsResults[0].height);
            setUnitsChecked(PSettingsResults[0].units);
            setAgeBodyFatLbm(PSettingsResults[0].age);
            setGenderChecked(storedUser?.gender);
            setGenderCheckedToCompare(storedUser?.gender);

            const genderIndex = genderData.indexOf(storedUser?.gender);
            //console.log('genderIndex fetchPublicSettings',genderIndex);
            setSelectedGender(genderIndex !== -1 ? new IndexPath(genderIndex) : new IndexPath(0));
            fetchCalculatorsTableLastInsertedRow(storedUser.id,"bodyFatCal").then((calculatorsResults) => {
            ////console.log('Body Fat calculatorsResults-->',calculatorsResults);
            setCalculatorsTableLastInsertedRow(calculatorsResults);
            setEquaChecked(calculatorsResults?.methds !== undefined ? calculatorsResults?.methds : 'Tape');
            setSkinFoldMethodsChecked(calculatorsResults?.methds === 'SkinFold' ? calculatorsResults?.sFMthd : 'ThreeSiteFormula');
            const weightComeFromtDBToPounds = parseFloat(calculatorsResults?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.weight)?.toFixed(0) : weightComeFromtDBToPounds?.toFixed(2);
            const weightComeFromDatabaseWithoutNaN = !isNaN(weightComeFromDatabase) ? weightComeFromDatabase?.toString() : "";
            /// weight come from bodyStatsRow
            const weightComeFromtDBToPoundsFromBodyStatsRow = parseFloat(bodyStatsRow?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const weightComeFromDatabaseFromBodyStatsRow  =  PSettingsResults[0].units =="Metrics" ? parseFloat(bodyStatsRow?.weight)?.toFixed(0) : weightComeFromtDBToPoundsFromBodyStatsRow?.toFixed(2);
            const weightComeFromDatabaseWithoutNaNFromBodyStatsRow = !isNaN(weightComeFromDatabaseFromBodyStatsRow) ? weightComeFromDatabaseFromBodyStatsRow?.toString() : "";

            
            
            
            ////console.log('inside weightComeFromDatabaseWithoutNaN',weightComeFromDatabaseWithoutNaN);
            setWeightBodyFatLbm(weightComeFromDatabaseWithoutNaN ? weightComeFromDatabaseWithoutNaN : weightComeFromDatabaseWithoutNaNFromBodyStatsRow);
            //console.log(' before if PSettingsResult PSettingsResults[0]?.height?.toFixed(2)',PSettingsResults[0]?.height?.toFixed(2));

            
            
            let heightComeFromDbOrSaved = calculatorsResults?.height ? parseFloat(calculatorsResults?.height)?.toFixed(2) : PSettingsResults[0]?.height?.toFixed(2);
            const heightComeFromtDBToFeetAndInches = cmToFeetAndInches(heightComeFromDbOrSaved); // Convert kg to feet and inches

            //console.log(' before if PSettingsResult heightComeFromDbOrSaved',heightComeFromDbOrSaved);

            const heightComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? heightComeFromDbOrSaved : heightComeFromtDBToFeetAndInches;
            //console.log(' before if PSettingsResult heightComeFromDatabase',heightComeFromDatabase);

            const torsoComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.torso)?.toFixed(2)); // Convert kg to feet and inches
            const torsoComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.torso)?.toFixed(2) : torsoComeFromtDBToFeetAndInches;
            /// torso come from bodyStatsRow
            const torsoComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.torso)?.toFixed(2)); // Convert kg to feet and inches
            const torsoComeFromDatabaseFromBodyStatsRow  =  PSettingsResults[0].units =="Metrics" ? parseFloat(bodyStatsRow?.torso)?.toFixed(2) : torsoComeFromtDBToFeetAndInchesFromBodyStatsRow;
           
           
           
            ////console.log('torsoComeFromDatabase',torsoComeFromDatabase);
            const neckComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.neck)?.toFixed(2)); // Convert kg to feet and inches
            const neckComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.neck)?.toFixed(2) : neckComeFromtDBToFeetAndInches;
            /// neck come from bodyStatsRow
            const neckComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.neck)?.toFixed(2)); // Convert kg to feet and inches
            const neckComeFromDatabaseFromBodyStatsRow  =  PSettingsResults[0].units =="Metrics" ? parseFloat(bodyStatsRow?.neck)?.toFixed(2) : neckComeFromtDBToFeetAndInchesFromBodyStatsRow;
            
            
            
            ////console.log('neckComeFromDatabase',neckComeFromDatabase);
            const hipsComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(calculatorsResults?.hips)?.toFixed(2)); // Convert kg to feet and inches
            const hipsComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.hips)?.toFixed(2) : hipsComeFromtDBToFeetAndInches;
            ////console.log('hipsComeFromDatabase',hipsComeFromDatabase);
                  
            const thighComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.thigh) ? calculatorsResults?.thigh?.toString() : "";
            const chestComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.chest) ? calculatorsResults?.chest?.toString() : "";
            const abdomenComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.abdmen) ? calculatorsResults?.abdmen?.toString() : "";
            const tricepsComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.tricep) ? calculatorsResults?.tricep?.toString() : "";
            const axillaComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.axilla) ? calculatorsResults?.axilla?.toString() : "";
            const subscapulComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.subcpl) ? calculatorsResults?.subcpl?.toString() : "";
            const supraliacComeFromDatabaseWithoutNaN = !isNaN(calculatorsResults?.sprlic) ? calculatorsResults?.sprlic?.toString() : "";
            ////console.log('thighComeFromDatabaseWithoutNaN',thighComeFromDatabaseWithoutNaN);
        
            setThighBodyFatLbm(thighComeFromDatabaseWithoutNaN);
            setChestBodyFatLbm(chestComeFromDatabaseWithoutNaN);
            setAbdomenBodyFatLbm(abdomenComeFromDatabaseWithoutNaN);
            setTricepsBodyFatLbm(tricepsComeFromDatabaseWithoutNaN);
            setAxillaBodyFatLbm(axillaComeFromDatabaseWithoutNaN);
            setSubscapulBodyFatLbm(subscapulComeFromDatabaseWithoutNaN);
            setSupraliacBodyFatLbm(supraliacComeFromDatabaseWithoutNaN);

            if(PSettingsResults[0].units =="Metrics"){
              const heightComeFromDatabaseWithoutNaN = !isNaN(heightComeFromDatabase) ? heightComeFromDatabase?.toString() : "";
              const torsoComeFromDatabaseWithoutNaN = !isNaN(torsoComeFromDatabase) ? torsoComeFromDatabase?.toString() : "";
              
              
            
              const neckComeFromDatabaseWithoutNaN = !isNaN(neckComeFromDatabase) ? neckComeFromDatabase?.toString() : !isNaN(neckComeFromDatabaseFromBodyStatsRow) ? neckComeFromDatabaseFromBodyStatsRow?.toString() : "";
              const hipsComeFromDatabaseWithoutNaN = !isNaN(hipsComeFromDatabase) ? hipsComeFromDatabase?.toString() : !isNaN(torsoComeFromDatabaseFromBodyStatsRow) ? torsoComeFromDatabaseFromBodyStatsRow?.toString() : "";

              //console.log('if PSettingsResults ---- heightComeFromDatabase',heightComeFromDatabase); 
              ////console.log('if ---- torsoComeFromDatabaseWithoutNaN',torsoComeFromDatabaseWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseWithoutNaN',neckComeFromDatabaseWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseWithoutNaN',hipsComeFromDatabaseWithoutNaN);

              setHeightBodyFatLbm(heightComeFromDatabaseWithoutNaN);
              setTorsoBodyFatLbm(torsoComeFromDatabaseWithoutNaN);
              setNeckBodyFatLbm(neckComeFromDatabaseWithoutNaN);
              setHipsBodyFatLbm(hipsComeFromDatabaseWithoutNaN);

            }else{
             
              const heightComeFromDatabaseFeetWithoutNaN = !isNaN(heightComeFromDatabase.feet) ? heightComeFromDatabase.feet?.toString() : "";
              const heightComeFromDatabaseInchesWithoutNaN = !isNaN(heightComeFromDatabase.inches) ? heightComeFromDatabase.inches?.toString() : "";
              
              const torsoComeFromDatabaseFeetWithoutNaN = !isNaN(torsoComeFromDatabase.feet) ? torsoComeFromDatabase.feet?.toString() : "";
              const torsoComeFromDatabaseInchesWithoutNaN = !isNaN(torsoComeFromDatabase.inches) ? torsoComeFromDatabase.inches?.toString() : "";
              
               
              const neckComeFromDatabaseFeetWithoutNaN = !isNaN(neckComeFromDatabase.feet) ? neckComeFromDatabase.feet?.toString() : !isNaN(neckComeFromDatabaseFromBodyStatsRow.feet) ? neckComeFromDatabaseFromBodyStatsRow.feet?.toString() : "";
              const neckComeFromDatabaseInchesWithoutNaN = !isNaN(neckComeFromDatabase.inches) ? neckComeFromDatabase.inches?.toString() : !isNaN(torsoComeFromDatabaseFromBodyStatsRow.inches) ? torsoComeFromDatabaseFromBodyStatsRow.inches?.toString() : "";
              const hipsComeFromDatabaseFeetWithoutNaN = !isNaN(hipsComeFromDatabase.feet) ? hipsComeFromDatabase.feet?.toString() : "";
              const hipsComeFromDatabaseInchesWithoutNaN = !isNaN(hipsComeFromDatabase.inches) ? hipsComeFromDatabase.inches?.toString() : "";
              
              ////console.log('if ---- torsoComeFromDatabaseFeetWithoutNaN',torsoComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- torsoComeFromDatabaseInchesWithoutNaN',torsoComeFromDatabaseInchesWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseFeetWithoutNaN',neckComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- neckComeFromDatabaseInchesWithoutNaN',neckComeFromDatabaseInchesWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseFeetWithoutNaN',hipsComeFromDatabaseFeetWithoutNaN);
              ////console.log('if ---- hipsComeFromDatabaseInchesWithoutNaN',hipsComeFromDatabaseInchesWithoutNaN);

              setHeightFeetBodyFatLbm(heightComeFromDatabaseFeetWithoutNaN);
              setHeightInchesBodyFatLbm(heightComeFromDatabaseInchesWithoutNaN);
              setTorsoFeetBodyFatLbm(torsoComeFromDatabaseFeetWithoutNaN);
              setTorsoInchesBodyFatLbm(torsoComeFromDatabaseInchesWithoutNaN);
              setNeckFeetBodyFatLbm(neckComeFromDatabaseFeetWithoutNaN);
              setNeckInchesBodyFatLbm(neckComeFromDatabaseInchesWithoutNaN);
              setHipsFeetBodyFatLbm(hipsComeFromDatabaseFeetWithoutNaN); 
              setHipsInchesBodyFatLbm(hipsComeFromDatabaseInchesWithoutNaN);
            }    
              
            setBodyFatLbmResult(parseFloat(calculatorsResults?.bFPctg)?.toFixed(1));
            const BodyFatMassComeFromtDBToPounds = parseFloat(calculatorsResults?.bFMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const BodyFatMassComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.bFMass)?.toFixed(0) : BodyFatMassComeFromtDBToPounds?.toFixed(1);
            const BodyFatMassComeFromDatabaseWithoutNaN = !isNaN(BodyFatMassComeFromDatabase) ? BodyFatMassComeFromDatabase?.toString() : "";
            ////console.log('inside BodyFatMassComeFromDatabaseWithoutNaN',BodyFatMassComeFromDatabaseWithoutNaN);
            setBodyFatMassResult(BodyFatMassComeFromDatabaseWithoutNaN);
            const LeanBodyMassComeFromtDBToPounds = parseFloat(calculatorsResults?.lBMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
            const LeanBodyMassComeFromDatabase  =  PSettingsResults[0].units =="Metrics" ? parseFloat(calculatorsResults?.lBMass)?.toFixed(0) : LeanBodyMassComeFromtDBToPounds?.toFixed(1);
            const LeanBodyMassComeFromDatabaseWithoutNaN = !isNaN(LeanBodyMassComeFromDatabase) ? LeanBodyMassComeFromDatabase?.toString() : "";
            ////console.log('inside LeanBodyMassComeFromDatabaseWithoutNaN',LeanBodyMassComeFromDatabaseWithoutNaN);
            setLeanBodyMassResult(LeanBodyMassComeFromDatabaseWithoutNaN);
            
                     });
          });
        }
      };
      // Call the loadData function when your component mounts or on an event
loadData();
      
      });

      const timer = setTimeout(() => {
        setLoadingPageInfo(false);
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
       
    }, [AsyncStorage,fetchPublicSettings,fetchCalculatorsTableLastInsertedRow])
    );


    useEffect(() => {
      //console.log('Route Params:', params);
      
      //console.log('Route Object.keys(dayWorkoutWorkedTask).length:', Object.keys(dayWorkoutWorkedTask).length);
      const useEffectLoadData = async () => {
        const bodyStatsRow = await fetchbodyStatsAndMeasurementsLastInsertedRow(userId);

      if (sentPassNewDate) {
        
        // if (Object.keys(dayWorkoutWorkedTask).length !== 0 && dayWorkoutWorkedTask !== "undefined" && dayWorkoutWorkedTask !== undefined && sentPassNewDate) {

        //console.log('dayWorkoutWorkedTask if:', dayWorkoutWorkedTask);
        //console.log('sentPassNewDate: if ', sentPassNewDate);

        //console.log('sentPassNewDate: if dayWorkoutWorkedTask?.methds', dayWorkoutWorkedTask?.methds);

        //console.log('sentPassNewDate: if dayWorkoutWorkedTask?.sFMthd', dayWorkoutWorkedTask?.sFMthd);

        setEquaChecked(dayWorkoutWorkedTask?.methds !== undefined ? dayWorkoutWorkedTask?.methds : 'Tape');
        setSkinFoldMethodsChecked(dayWorkoutWorkedTask?.methds === 'SkinFold' ? dayWorkoutWorkedTask?.sFMthd : 'ThreeSiteFormula');

        // setCalculatorsTableLastInsertedRow(dayWorkoutWorkedTask);
  
        // setLastInsertedRow(dayWorkoutWorkedTask);
        let weightComeFromtDBToPounds = parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
        let newWeight = unitsChecked=="Metrics" ? `${parseFloat(dayWorkoutWorkedTask?.weight)?.toFixed(0)}` : `${weightComeFromtDBToPounds?.toFixed(3)}`;
        //weight come from bodyStatsRow
        console.log('newWeight',newWeight);
        console.log('bodyStatsRow?.weight',bodyStatsRow?.weight);

        let weightComeFromtDBToPoundsFromBodyStatsRow = parseFloat(bodyStatsRow?.weight)?.toFixed(0) * 2.20462; // Convert kg to pounds
        console.log('weightComeFromtDBToPoundsFromBodyStatsRow',weightComeFromtDBToPoundsFromBodyStatsRow);

        let newWeightFromBodyStatsRow = unitsChecked=="Metrics" ? `${parseFloat(bodyStatsRow?.weight)?.toFixed(0)}` : `${weightComeFromtDBToPoundsFromBodyStatsRow?.toFixed(3)}`;
        console.log('newWeightFromBodyStatsRow',newWeightFromBodyStatsRow);


        setWeightBodyFatLbm(!isNaN(newWeight) ? newWeight.toString() : !isNaN(newWeightFromBodyStatsRow) ? newWeightFromBodyStatsRow.toString() : "");
        
  
        let bodyFatMassComeFromtDBToPounds = parseFloat(dayWorkoutWorkedTask?.bFMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
        //console.log('dayWorkoutWorkedTask if dayWorkoutWorkedTask?.bFMass:', dayWorkoutWorkedTask?.bFMass);

        let newBodyFatMass = unitsChecked=="Metrics" ? `${parseFloat(dayWorkoutWorkedTask?.bFMass)?.toFixed(0)}` : `${bodyFatMassComeFromtDBToPounds?.toFixed(3)}`;
        setBodyFatMassResult(!isNaN(newBodyFatMass) ? newBodyFatMass.toString() : "");
  
        let leanBodyMassComeFromtDBToPounds = parseFloat(dayWorkoutWorkedTask?.lBMass)?.toFixed(0) * 2.20462; // Convert kg to pounds
        //console.log('dayWorkoutWorkedTask if dayWorkoutWorkedTask?.lBMass:', dayWorkoutWorkedTask?.lBMass);
        //console.log('dayWorkoutWorkedTask if dayWorkoutWorkedTask?.bFPctg:', dayWorkoutWorkedTask?.bFPctg);

        setBodyFatLbmResult(!isNaN(dayWorkoutWorkedTask?.bFPctg) ? (parseFloat(dayWorkoutWorkedTask?.bFPctg)?.toFixed(1)).toString() : "");

        let newLeanBodyMass = unitsChecked=="Metrics" ? `${parseFloat(dayWorkoutWorkedTask?.lBMass)?.toFixed(0)}` : `${leanBodyMassComeFromtDBToPounds?.toFixed(3)}`;
        setLeanBodyMassResult(!isNaN(newLeanBodyMass) ? newLeanBodyMass.toString() : "");
  
  
        function cmToFeetAndInches(cm) {
          const feet = Math.floor(cm / 30.48);
        
          // How to have inches match up?
          const inches = ((cm - feet * 30.48) * 0.393701)?.toFixed(2);
          return { feet, inches };
        }
  
         //values come from data base into inputs
        let convertedHeightFromDataBaseWithoutNanFeet = '';
        let convertedHeightFromDataBaseWithoutNanInches = '';
        
        
        let convertedTorsoFromDataBaseWithoutNanFeet = '';
        let convertedTorsoFromDataBaseWithoutNanInches = '';
        //Torso come from bodyStatsRow
        let convertedTorsoFromDataBaseWithoutNanFeetFromBodyStatsRow = '';
        let convertedTorsoFromDataBaseWithoutNanInchesFromBodyStatsRow = '';
  
        let convertedNeckFromDataBaseWithoutNanFeet = '';
        let convertedNeckFromDataBaseWithoutNanInches = '';
        //Neck come from bodyStatsRow
        let convertedNeckFromDataBaseWithoutNanFeetFromBodyStatsRow = '';
        let convertedNeckFromDataBaseWithoutNanInchesFromBodyStatsRow = '';
  
        let convertedHipsFromDataBaseWithoutNanFeet = '';
        let convertedHipsFromDataBaseWithoutNanInches = '';
        // //weight come from bodyStatsRow
        // let convertedHipsFromDataBaseWithoutNanFeetFromBodyStatsRow = '';
        // let convertedHipsFromDataBaseWithoutNanInchesFromBodyStatsRow = '';
  
  
        if(unitsChecked=="Metrics"){
          if(!isNaN(dayWorkoutWorkedTask?.height) && dayWorkoutWorkedTask?.height != ""){
            let heightComeFromDatabaseWithoutNaN = !isNaN(dayWorkoutWorkedTask?.height) ? `${parseFloat(dayWorkoutWorkedTask?.height)?.toFixed(0)}` : "";
            setHeightBodyFatLbm(heightComeFromDatabaseWithoutNaN);
          }
          
  
          let neckComeFromDatabaseWithoutNaN = !isNaN(dayWorkoutWorkedTask?.neck) ? `${parseFloat(dayWorkoutWorkedTask?.neck)?.toFixed(0)}` : "";
          //Neck come from bodyStatsRow
          let neckComeFromDatabaseWithoutNaNFromBodyStatsRow = !isNaN(bodyStatsRow?.neck) ? `${parseFloat(bodyStatsRow?.neck)?.toFixed(0)}` : "";

          setNeckBodyFatLbm(!isNaN(neckComeFromDatabaseWithoutNaN) ? neckComeFromDatabaseWithoutNaN.toString() : !isNaN(neckComeFromDatabaseWithoutNaNFromBodyStatsRow) ? neckComeFromDatabaseWithoutNaNFromBodyStatsRow.toString() : "");


          let torsoComeFromDatabaseWithoutNaN = !isNaN(dayWorkoutWorkedTask?.torso) ? `${parseFloat(dayWorkoutWorkedTask?.torso)?.toFixed(0)}` : "";
          //torso come from bodyStatsRow
          let torsoComeFromDatabaseWithoutNaNFromBodyStatsRow = !isNaN(bodyStatsRow?.torso) ? `${parseFloat(bodyStatsRow?.torso)?.toFixed(0)}` : "";


          setTorsoBodyFatLbm(!isNaN(torsoComeFromDatabaseWithoutNaN) ? torsoComeFromDatabaseWithoutNaN.toString() : !isNaN(torsoComeFromDatabaseWithoutNaN) ? torsoComeFromDatabaseWithoutNaN.toString() : "");
          let hipsComeFromDatabaseWithoutNaN = !isNaN(dayWorkoutWorkedTask?.hips) ? `${parseFloat(dayWorkoutWorkedTask?.hips)?.toFixed(0)}` : "";
          setHipsBodyFatLbm(hipsComeFromDatabaseWithoutNaN || "");
  
  
        }else{
        //values come from data base into inputs
        let convertedHeightFromDataBase = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.height)?.toFixed(2));
        convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet?.toString() : '';
        convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches?.toString() : '';
        setHeightFeetBodyFatLbm(convertedHeightFromDataBaseWithoutNanFeet);
        setHeightInchesBodyFatLbm(convertedHeightFromDataBaseWithoutNanInches);
  
        
        
        let torsoComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.torso)?.toFixed(2)); // Convert kg to feet and inches
        convertedTorsoFromDataBaseWithoutNanFeet = !isNaN(torsoComeFromtDBToFeetAndInches.feet) ? torsoComeFromtDBToFeetAndInches.feet?.toString() : '';
        convertedTorsoFromDataBaseWithoutNanInches = !isNaN(torsoComeFromtDBToFeetAndInches.inches) ? torsoComeFromtDBToFeetAndInches.inches?.toString() : '';
        //torso come from bodyStatsRow
        let torsoComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.torso)?.toFixed(2)); // Convert kg to feet and inches
        convertedTorsoFromDataBaseWithoutNanFeetFromBodyStatsRow = !isNaN(torsoComeFromtDBToFeetAndInchesFromBodyStatsRow.feet) ? torsoComeFromtDBToFeetAndInchesFromBodyStatsRow.feet?.toString() : '';
        convertedTorsoFromDataBaseWithoutNanInchesFromBodyStatsRow = !isNaN(torsoComeFromtDBToFeetAndInchesFromBodyStatsRow.inches) ? torsoComeFromtDBToFeetAndInchesFromBodyStatsRow.inches?.toString() : '';
        

        setTorsoFeetBodyFatLbm(!isNaN(convertedHeightFromDataBaseWithoutNanFeet) ? convertedHeightFromDataBaseWithoutNanFeet.toString() : !isNaN(convertedTorsoFromDataBaseWithoutNanFeetFromBodyStatsRow) ? convertedTorsoFromDataBaseWithoutNanFeetFromBodyStatsRow.toString() : "");
        setTorsoInchesBodyFatLbm(!isNaN(convertedHeightFromDataBaseWithoutNanInches) ? convertedHeightFromDataBaseWithoutNanInches.toString() : !isNaN(convertedTorsoFromDataBaseWithoutNanInchesFromBodyStatsRow) ? convertedTorsoFromDataBaseWithoutNanInchesFromBodyStatsRow.toString() : "");
  
        let neckComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.neck)?.toFixed(2)); // Convert kg to feet and inches
        convertedNeckFromDataBaseWithoutNanFeet = !isNaN(neckComeFromtDBToFeetAndInches.feet) ? neckComeFromtDBToFeetAndInches.feet?.toString() : '';
        convertedNeckFromDataBaseWithoutNanInches = !isNaN(neckComeFromtDBToFeetAndInches.inches) ? neckComeFromtDBToFeetAndInches.inches?.toString() : '';
        //Neck come from bodyStatsRow
        let neckComeFromtDBToFeetAndInchesFromBodyStatsRow = cmToFeetAndInches(parseFloat(bodyStatsRow?.neck)?.toFixed(2)); // Convert kg to feet and inches
        convertedNeckFromDataBaseWithoutNanFeetFromBodyStatsRow = !isNaN(neckComeFromtDBToFeetAndInchesFromBodyStatsRow.feet) ? neckComeFromtDBToFeetAndInchesFromBodyStatsRow.feet?.toString() : '';
        convertedNeckFromDataBaseWithoutNanInchesFromBodyStatsRow = !isNaN(neckComeFromtDBToFeetAndInchesFromBodyStatsRow.inches) ? neckComeFromtDBToFeetAndInchesFromBodyStatsRow.inches?.toString() : '';


        setNeckFeetBodyFatLbm(!isNaN(convertedNeckFromDataBaseWithoutNanFeet) ? convertedNeckFromDataBaseWithoutNanFeet.toString() : !isNaN(convertedNeckFromDataBaseWithoutNanFeetFromBodyStatsRow) ? convertedNeckFromDataBaseWithoutNanFeetFromBodyStatsRow.toString() : "");
        setNeckInchesBodyFatLbm(!isNaN(convertedNeckFromDataBaseWithoutNanInches) ? convertedNeckFromDataBaseWithoutNanInches.toString() : !isNaN(convertedNeckFromDataBaseWithoutNanInchesFromBodyStatsRow) ? convertedNeckFromDataBaseWithoutNanInchesFromBodyStatsRow.toString() :"");
  
        let hipsComeFromtDBToFeetAndInches = cmToFeetAndInches(parseFloat(dayWorkoutWorkedTask?.hips)?.toFixed(2)); // Convert kg to feet and inches
        convertedHipsFromDataBaseWithoutNanFeet = !isNaN(hipsComeFromtDBToFeetAndInches.feet) ? hipsComeFromtDBToFeetAndInches.feet?.toString() : '';
        convertedHipsFromDataBaseWithoutNanInches = !isNaN(hipsComeFromtDBToFeetAndInches.inches) ? hipsComeFromtDBToFeetAndInches.inches?.toString() : '';
        setHipsFeetBodyFatLbm(convertedHipsFromDataBaseWithoutNanFeet || "");
        setHipsInchesBodyFatLbm(convertedHipsFromDataBaseWithoutNanInches || "");
  
                
        }
  
        setDateFromDb(dayWorkoutWorkedTask?.date || "");
        setAbdomenBodyFatLbm(dayWorkoutWorkedTask?.abdmen?.toString() || "");
        setChestBodyFatLbm(dayWorkoutWorkedTask?.chest?.toString() || "");
        setTricepsBodyFatLbm(dayWorkoutWorkedTask?.tricep?.toString() || "");
        setSupraliacBodyFatLbm(dayWorkoutWorkedTask?.sprlic?.toString() || "");
        setSubscapulBodyFatLbm(dayWorkoutWorkedTask?.subcpl?.toString() || "");  
        setThighBodyFatLbm(dayWorkoutWorkedTask?.thigh?.toString() || "");
        setAxillaBodyFatLbm(dayWorkoutWorkedTask?.axilla?.toString() || ""); 
      }
    //   else if(Object.keys(dayWorkoutWorkedTask).length == 0 && sentPassNewDate){
    //       setWeightBodyFatLbm("");
    //       setBodyFatMassResult("");
    //       setBodyFatLbmResult("");
    //       setLeanBodyMassResult("");
    //       if(unitsChecked=="Metrics"){
    //           setNeckBodyFatLbm("");
    //           setTorsoBodyFatLbm("");
    //           setHipsBodyFatLbm("");

    //       }else{

    //           setTorsoFeetBodyFatLbm("");
    //           setTorsoInchesBodyFatLbm("");

    //           setNeckFeetBodyFatLbm("");
    //           setNeckInchesBodyFatLbm("");

    //           setHipsFeetBodyFatLbm("");
    //           setHipsInchesBodyFatLbm("");

    //           }


    //           setDateFromDb("");
    //           setAbdomenBodyFatLbm("");
    //           setChestBodyFatLbm("");
    //           setTricepsBodyFatLbm("");
    //           setSupraliacBodyFatLbm("");
    //           setSubscapulBodyFatLbm("");
    //           setThighBodyFatLbm("");
    //           setAxillaBodyFatLbm("");



    //     //console.log('herrrrrree is empty');


    //  }

    };
     useEffectLoadData();

    }, [params]);


  const CalculateFunc = () => { 
    console.log('Metrics Him before ', heightBodyFatLbm);
    console.log('Metrics Him weightBodyFatLbm ', weightBodyFatLbm);
    console.log('Metrics Him neckBodyFatLbm ', neckBodyFatLbm);
    console.log('Metrics Him torsoBodyFatLbm ', torsoBodyFatLbm);

    if(equaChecked=="Tape"){
      if(unitsChecked=="Metrics"){
        if(genderChecked=='Him'){
          //console.log('Metrics Him heightBodyFatLbm after', heightBodyFatLbm);
          //console.log('Metrics Him weightBodyFatLbm ', weightBodyFatLbm);
          //console.log('Metrics Him neckBodyFatLbm ', neckBodyFatLbm);
          //console.log('Metrics Him torsoBodyFatLbm ', torsoBodyFatLbm);

          if (!heightBodyFatLbm || !weightBodyFatLbm || !neckBodyFatLbm || !torsoBodyFatLbm ) { 
            alert(`${t('All_fields_are_required')}`); 
          } else { 
            // BFP =(495/(1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height))) - 450
            BFP =(495/(1.0324 - (0.19077* Math.log10(parseFloat(torsoBodyFatLbm)-parseFloat(neckBodyFatLbm))) + (0.15456* Math.log10(parseFloat(heightBodyFatLbm))) )) - 450;
            BodyFatMass =(weightBodyFatLbm*BFP)/100;
            LeanBodyMass = weightBodyFatLbm - BodyFatMass;
            // // Set the setBodyFatLbmResult result 
            setBodyFatLbmResult(BFP?.toFixed(2)); 
            setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
            setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
          }
        }else{
          if (!heightBodyFatLbm || !weightBodyFatLbm || !neckBodyFatLbm || !torsoBodyFatLbm || !hipsBodyFatLbm) { 
            alert(`${t('All_fields_are_required')}`); 
          } else { 
            //BFP =(495/(1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)))- 450
            BFP =(495/(1.29579 - (0.35004*Math.log10(parseFloat(torsoBodyFatLbm)+parseFloat(hipsBodyFatLbm)-parseFloat(neckBodyFatLbm))) + (0.22100*Math.log10(parseFloat(heightBodyFatLbm))) ))- 450;
            BodyFatMass =(weightBodyFatLbm*BFP)/100;
            LeanBodyMass = weightBodyFatLbm - BodyFatMass;
            // // Set the setBodyFatLbmResult result 
            setBodyFatLbmResult(BFP?.toFixed(2)); 
            setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
            setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
          }
        }
      }else{
        //5 feet * 12 inches/foot = 60 inches
        //8 inches = 8 inches
        //height in inches, which is 60 + 8 = 68 inches.
        // ((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr))
        if(genderChecked=='Him'){
          if (!heightFeetBodyFatLbm || !heightInchesBodyFatLbm || !weightBodyFatLbm || !neckFeetBodyFatLbm || !neckInchesBodyFatLbm || !torsoFeetBodyFatLbm || !torsoInchesBodyFatLbm ) { 
            alert(`${t('All_fields_are_required')}`); 
          } else {
            //BFP = 86.010×log10(abdomen-neck) - 70.041×log10(height) + 36.76
            BFP = (86.010* Math.log10(((parseInt(torsoFeetBodyFatLbm)* 12) + parseFloat(torsoInchesBodyFatLbm))-((parseInt(neckFeetBodyFatLbm)* 12) + parseFloat(neckInchesBodyFatLbm)))) - (70.041* Math.log10(((parseInt(heightFeetBodyFatLbm)* 12) + parseFloat(heightInchesBodyFatLbm)))) + 36.76;
            BodyFatMass =(weightBodyFatLbm*BFP)/100;
            LeanBodyMass = weightBodyFatLbm - BodyFatMass;
            // // Set the setBodyFatLbmResult result 
            setBodyFatLbmResult(BFP?.toFixed(2)); 
            setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
            setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
          }
        }else{
          if (!heightFeetBodyFatLbm || !heightInchesBodyFatLbm || !weightBodyFatLbm || !neckFeetBodyFatLbm || !neckInchesBodyFatLbm || !torsoFeetBodyFatLbm || !torsoInchesBodyFatLbm ||!hipsFeetBodyFatLbm || !hipsInchesBodyFatLbm) { 
            alert(`${t('All_fields_are_required')}`); 
          } else { 
            //BFP = 163.205×log10(waist+hip-neck) - 97.684×(log10(height)) - 78.387
            BFP = (163.205* Math.log10(((parseFloat(torsoFeetBodyFatLbm)* 12) + parseFloat(torsoInchesBodyFatLbm)) + ((parseFloat(hipsFeetBodyFatLbm)* 12) + parseFloat(hipsInchesBodyFatLbm))-((parseFloat(neckFeetBodyFatLbm)* 12) + parseFloat(neckInchesBodyFatLbm)))) - (97.684* Math.log10((parseFloat(heightFeetBodyFatLbm)* 12) + parseFloat(heightInchesBodyFatLbm))) - 78.387;
            BodyFatMass =(weightBodyFatLbm*BFP)/100;
            LeanBodyMass = weightBodyFatLbm - BodyFatMass;
            // // Set the setBodyFatLbmResult result 
            setBodyFatLbmResult(BFP?.toFixed(2)); 
            setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
            setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
          }
        }
      }

    }else{
        if((genderChecked=='Him') && (skinFoldMethodsChecked === 'ThreeSiteFormula')){
          if(!abdomenBodyFatLbm || !thighBodyFatLbm || !chestBodyFatLbm){
            alert(`${t('All_fields_are_required')}`); 
          }else{
          //Three-Site Formulas (Chest, Abdomen, Thigh)
          //Body density = 1.109380 – (0.0008267 × sum of three skinfolds) + (0.0000016 × [sum of three skinfolds]2) – (0.000257 × age)
          BodyDensity = 1.109380 - (0.0008267 *(parseFloat(abdomenBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.0000016 * (parseFloat(abdomenBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.000257 * ageBodyFatLbm);
          BFP = (495/ BodyDensity) - 450;
          BodyFatMass =(weightBodyFatLbm*BFP)/100;
          LeanBodyMass = weightBodyFatLbm - BodyFatMass;
          // Set the setBodyFatLbmResult result 
          setBodyFatLbmResult(BFP?.toFixed(2)); 
          setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
          setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
        }
        }
        if((genderChecked=='Her') && (skinFoldMethodsChecked === 'ThreeSiteFormula')){
          if(!tricepsBodyFatLbm || !thighBodyFatLbm || !supraliacBodyFatLbm){
            alert(`${t('All_fields_are_required')}`); 
          }else{
          //Three-Site Formulas (Triceps, Suprailiac, Thigh
          //Body density = 1.0994921 – (0.0009929 × sum of three skinfolds) + (0.0000023 × [sum of three skinfolds]2) – (0.0001392 × age)
          
          BodyDensity = 1.0994921 - (0.0009929 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)))+ (0.0000023 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm))**2) - (0.0001392 * ageBodyFatLbm);
          BFP = (495/ BodyDensity) - 450;
          BodyFatMass =(weightBodyFatLbm*BFP)/100;
          LeanBodyMass = weightBodyFatLbm - BodyFatMass;
          // Set the setBodyFatLbmResult result 
          setBodyFatLbmResult(BFP?.toFixed(2)); 
          setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
          setLeanBodyMassResult(LeanBodyMass?.toFixed(2));  
          }
        }
        
        if(genderChecked=='Him'){
          
          if((skinFoldMethodsChecked === 'FourSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm){
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //Four-Site Formula (Abdomen, Suprailiac, Triceps, Thigh)
              //% Body fat = (0.29288 × sum of four skinfolds) – (0.0005 × [sum of four skinfolds]2) + (0.15845 × age) – 5.76377
              BFP = (0.29288 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)))- (0.0005 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm))**2) + (0.15845 * ageBodyFatLbm)-5.76377;
              BodyFatMass =(weightBodyFatLbm*BFP)/100;
              LeanBodyMass = weightBodyFatLbm - BodyFatMass;
              // Set the setBodyFatLbmResult result 
              setBodyFatLbmResult(BFP?.toFixed(2)); 
              setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
              setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
            }
          }
          if((skinFoldMethodsChecked === 'SevenSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm || !subscapulBodyFatLbm || !axillaBodyFatLbm || !chestBodyFatLbm){  
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //MALES
              //Seven-Site Formula (Chest, Midaxillary, Triceps, Subscapular, Abdomen, Suprailiac, Thigh)
              //Body density = 1.112 – (0.00043499 × sum of seven skinfolds) + (0.00000055 × [sum of seven skinfolds]2) – (0.00028826 × age)
              
              BodyDensity = 1.112 - (0.00043499 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.00000055 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.00028826 * ageBodyFatLbm);
              BFP = (495/ BodyDensity) - 450;
              BodyFatMass =(weightBodyFatLbm*BFP)/100;
              LeanBodyMass = weightBodyFatLbm - BodyFatMass;
              // Set the setBodyFatLbmResult result 
              setBodyFatLbmResult(BFP?.toFixed(2)); 
              setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
              setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
            }
          }
        
        }else{
          //FEMALES
          if((skinFoldMethodsChecked === 'FourSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm){
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //Four-Site Formula (Abdomen, Suprailiac, Triceps, Thigh)
              //% Body fat = (0.29669 × sum of four skinfolds) – (0.00043 × [sum of four skinfolds]2) + (0.02963 × age) + 1.4072
              BFP = (0.29669 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)))- (0.00043 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm))**2) + (0.02963 * ageBodyFatLbm)+1.4072;
              BodyFatMass =(weightBodyFatLbm*BFP)/100;
              LeanBodyMass = weightBodyFatLbm - BodyFatMass;
              // Set the setBodyFatLbmResult result 
              setBodyFatLbmResult(BFP?.toFixed(2)); 
              setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
              setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
            }
          }
          if((skinFoldMethodsChecked === 'SevenSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm || !subscapulBodyFatLbm || !axillaBodyFatLbm || !chestBodyFatLbm){  
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //MALES
              //Seven-Site Formula (Chest, Midaxillary, Triceps, Subscapular, Abdomen, Suprailiac, Thigh)
              //Body density = 1.0970 – (0.00046971 × sum of seven skinfolds) + (0.00000056 × [sum of seven skinfolds]2) – (0.00012828 × age)
          
              BodyDensity = 1.0970 - (0.00046971 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.00000056 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.00012828 * ageBodyFatLbm);
              BFP = (495/ BodyDensity) - 450;
              BodyFatMass =(weightBodyFatLbm*BFP)/100;
              LeanBodyMass = weightBodyFatLbm - BodyFatMass;
              // Set the setBodyFatLbmResult result 
              setBodyFatLbmResult(BFP?.toFixed(2)); 
              setBodyFatMassResult(BodyFatMass?.toFixed(2)); 
              setLeanBodyMassResult(LeanBodyMass?.toFixed(2)); 
            }
          }
           
          }

    }
    
  }; 
  //values come from data base into inputs
  let convertedHeightFromDataBaseWithoutNanFeet = '';
  let convertedHeightFromDataBaseWithoutNanInches = '';
  // converted values will go into database as cm values
  let convertedHeightInCmWithoutNaN = "";
  let convertedNeckInCmWithoutNaN = "";
  let convertedTorsoInCmWithoutNaN = "";
  let convertedHipsInCmWithoutNaN = "";
  function cmToFeetAndInches(cm) {
    const feet = Math.floor(cm / 30.48);
  
    // How to have inches match up?
    const inches = ((cm - feet * 30.48) * 0.393701)?.toFixed(2);
    return { feet, inches };
  }
  function feetAndInchesToCm(feet, inches) {
    const newInches = inches || 0;
    const cmTotal = feet * 30.48 + newInches * 2.54;
    return cmTotal;
  }
  const weightInKg = weightBodyFatLbm !=="" ? 0.45359237 * parseFloat(weightBodyFatLbm) : ""; // convert weight from pounds to kg
  const weightKgToDatabase = unitsChecked=="Metrics" ? weightBodyFatLbm : weightInKg;
  const weightKgToDatabaseParsed =parseFloat(weightKgToDatabase)?.toFixed(0);
  const todayDate = new Date().toISOString().split('T')[0];
  const checkFutureDate = sentPassNewDate > todayDate ? true : false ;
  ////console.log('todayDate',checkFutureDate);
  const SubmitFunc = () => { 
  let userCalAndMeasurements = "";
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

    if(equaChecked=="Tape"){
      if(unitsChecked=="Metrics"){
        if(genderChecked=='Him'){
          if (!heightBodyFatLbm || !weightBodyFatLbm || !neckBodyFatLbm || !torsoBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
            Alert.alert(`${t("All_fields_are_required")}`); 
          } else { 
            // BFP =(495/(1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height))) - 450
            BFP =parseFloat((495/(1.0324 - (0.19077* Math.log10(parseFloat(torsoBodyFatLbm)-parseFloat(neckBodyFatLbm))) + (0.15456* Math.log10(parseFloat(heightBodyFatLbm))) )) - 450)?.toFixed(1);
            BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
            LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
            // // Set the setBodyFatLbmResult result 
            userCalAndMeasurements = {
              userId:userId,
              date: lastInsertedRowDate,
              calNam:"bodyFatCal",
              methds:equaChecked,
              sFMthd:"",
              age:ageBodyFatLbm,
              height:heightBodyFatLbm,
              weight: weightBodyFatLbm,
              neck:neckBodyFatLbm,
              torso:torsoBodyFatLbm,
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
              result:"",
              bFPctg:BFP,
              bFMass:BodyFatMass,
              lBMass:LeanBodyMass,
              calris:"",
              protin:"",
              fats:"",
              carbs:"",
              isSync :'no',
            }; 
            ////console.log("tape Metric Male",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

          }
        }else{
          if (!heightBodyFatLbm || !weightBodyFatLbm || !neckBodyFatLbm || !torsoBodyFatLbm || !hipsBodyFatLbm  || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
            alert(`${t('All_fields_are_required')}`); 
          } else { 
            //BFP =(495/(1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)))- 450
            BFP =parseFloat((495/(1.29579 - (0.35004*Math.log10(parseFloat(torsoBodyFatLbm)+parseFloat(hipsBodyFatLbm)-parseFloat(neckBodyFatLbm))) + (0.22100*Math.log10(parseFloat(heightBodyFatLbm))) ))- 450)?.toFixed(1);
            BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
            LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
            // // Set the setBodyFatLbmResult result 
            userCalAndMeasurements = {
              userId:userId,
              date: lastInsertedRowDate,
              calNam:"bodyFatCal",
              methds:equaChecked,
              sFMthd:"",
              age:ageBodyFatLbm,
              height:heightBodyFatLbm,
              weight: weightBodyFatLbm,
              neck:neckBodyFatLbm,
              torso:torsoBodyFatLbm,
              hips:hipsBodyFatLbm,
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
              result:"",
              bFPctg:BFP,
              bFMass:BodyFatMass,
              lBMass:LeanBodyMass,
              calris:"",
              protin:"",
              fats:"",
              carbs:"",
              isSync :'no',
            }; 
            ////console.log("tape Metric Female",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

          }
          
        }
      }else{
        //5 feet * 12 inches/foot = 60 inches
        //8 inches = 8 inches
        //height in inches, which is 60 + 8 = 68 inches.
        // ((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr))
        if(genderChecked=='Him'){
          if (!heightFeetBodyFatLbm || !heightInchesBodyFatLbm || !weightBodyFatLbm || !neckFeetBodyFatLbm || !neckInchesBodyFatLbm || !torsoFeetBodyFatLbm || !torsoInchesBodyFatLbm  || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
            alert(`${t('All_fields_are_required')}`); 
          } else {
            //BFP = 86.010×log10(abdomen-neck) - 70.041×log10(height) + 36.76

            // // Set the setBodyFatLbmResult result 
            // converted values will go into database as cm values
            // const heightFeetValue = heightFeetBodyFatLbm !=='' ? heightFeetBodyFatLbm : convertedHeightFromDataBaseWithoutNanFeet;
            // const heightInchesValue = heightInchesWorkoutSettings !=='' ? heightInchesWorkoutSettings : convertedHeightFromDataBaseWithoutNanInches;
            // ////console.log('heightFeetValue-----',heightFeetValue);
            // ////console.log('heightInchesValue-----',heightInchesValue);
            const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
            convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";
            const convertedTorsoInCm = feetAndInchesToCm(parseInt(torsoFeetBodyFatLbm), parseFloat(torsoInchesBodyFatLbm));
            convertedTorsoInCmWithoutNaN = !isNaN(convertedTorsoInCm) ? parseFloat(convertedTorsoInCm)?.toFixed(1) : "";
            const convertedNeckInCm = feetAndInchesToCm(parseInt(neckFeetBodyFatLbm), parseFloat(neckInchesBodyFatLbm));
            convertedNeckInCmWithoutNaN = !isNaN(convertedNeckInCm) ? parseFloat(convertedNeckInCm)?.toFixed(1) : "";
            
            BFP =parseFloat((495/(1.0324 - (0.19077* Math.log10(parseFloat(convertedTorsoInCmWithoutNaN)-parseFloat(convertedNeckInCmWithoutNaN))) + (0.15456* Math.log10(parseFloat(convertedHeightInCmWithoutNaN))) )) - 450)?.toFixed(1);
            BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
            LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);
            ////console.log("tape imperial Male",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);
            ////console.log("tape imperial Male",'convertedHeightInCmWithoutNaN',convertedHeightInCmWithoutNaN,'convertedTorsoInCmWithoutNaN',convertedTorsoInCmWithoutNaN,'convertedNeckInCmWithoutNaN',convertedNeckInCmWithoutNaN);

            userCalAndMeasurements = {
              userId:userId,
              date: lastInsertedRowDate,
              calNam:"bodyFatCal",
              methds:equaChecked,
              sFMthd:"",
              age:ageBodyFatLbm,
              height:convertedHeightInCmWithoutNaN,
              weight: weightKgToDatabaseParsed,
              neck:convertedNeckInCmWithoutNaN,
              torso:convertedTorsoInCmWithoutNaN,
              hips:'',
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
              result:"",
              bFPctg:BFP,
              bFMass:BodyFatMass,
              lBMass:LeanBodyMass,
              calris:"",
              protin:"",
              fats:"",
              carbs:"",
              isSync :'no',
            }; 
          }
        }else{
          if (!heightFeetBodyFatLbm || !heightInchesBodyFatLbm || !weightBodyFatLbm || !neckFeetBodyFatLbm || !neckInchesBodyFatLbm || !torsoFeetBodyFatLbm || !torsoInchesBodyFatLbm ||!hipsFeetBodyFatLbm || !hipsInchesBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date) { 
            alert(`${t('All_fields_are_required')}`); 
          } else { 
            //BFP = 163.205×log10(waist+hip-neck) - 97.684×(log10(height)) - 78.387
            const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
            convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? convertedHeightInCm : "";
            const convertedTorsoInCm = feetAndInchesToCm(parseInt(torsoFeetBodyFatLbm), parseFloat(torsoInchesBodyFatLbm));
            convertedTorsoInCmWithoutNaN = !isNaN(convertedTorsoInCm) ? parseFloat(convertedTorsoInCm)?.toFixed(1) : "";
            const convertedNeckInCm = feetAndInchesToCm(parseInt(neckFeetBodyFatLbm), parseFloat(neckInchesBodyFatLbm));
            convertedNeckInCmWithoutNaN = !isNaN(convertedNeckInCm) ? parseFloat(convertedNeckInCm)?.toFixed(1) : "";
            const convertedHipsInCm = feetAndInchesToCm(parseInt(hipsFeetBodyFatLbm), parseFloat(hipsInchesBodyFatLbm));
            convertedHipsInCmWithoutNaN = !isNaN(convertedHipsInCm) ? parseFloat(convertedHipsInCm)?.toFixed(1) : "";
            
            BFP =parseFloat((495/(1.29579 - (0.35004*Math.log10(parseFloat(convertedTorsoInCmWithoutNaN)+parseFloat(convertedHipsInCmWithoutNaN)-parseFloat(convertedNeckInCmWithoutNaN))) + (0.22100*Math.log10(parseFloat(convertedHeightInCmWithoutNaN))) ))- 450)?.toFixed(1);
            BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
            LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);
            // // Set the setBodyFatLbmResult result 
            ////console.log("tape imperial Female",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);
            ////console.log("tape imperial Female",'convertedHeightInCmWithoutNaN',convertedHeightInCmWithoutNaN,'convertedTorsoInCmWithoutNaN',convertedTorsoInCmWithoutNaN,'convertedNeckInCmWithoutNaN',convertedNeckInCmWithoutNaN,'convertedHipsInCmWithoutNaN',convertedHipsInCmWithoutNaN);
           

            userCalAndMeasurements = {
              userId:userId,
              date: lastInsertedRowDate,
              calNam:"bodyFatCal",
              methds:equaChecked,
              sFMthd:"",
              age:ageBodyFatLbm,
              height:convertedHeightInCmWithoutNaN,
              weight: weightKgToDatabaseParsed,
              neck:convertedNeckInCmWithoutNaN,
              torso:convertedTorsoInCmWithoutNaN,
              hips:convertedHipsInCmWithoutNaN,
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
              result:"",
              bFPctg:BFP,
              bFMass:BodyFatMass,
              lBMass:LeanBodyMass,
              calris:"",
              protin:"",
              fats:"",
              carbs:"",
              isSync :'no',
            }; 
          }
        }
      }

    }else if (equaChecked=="SkinFold"){
        if((genderChecked=='Him') && (skinFoldMethodsChecked === 'ThreeSiteFormula')){
          if(!abdomenBodyFatLbm || !thighBodyFatLbm || !chestBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){
            alert(`${t('All_fields_are_required')}`); 
          }else{
          //Three-Site Formulas (Chest, Abdomen, Thigh)
          //Body density = 1.109380 – (0.0008267 × sum of three skinfolds) + (0.0000016 × [sum of three skinfolds]2) – (0.000257 × age)
          const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
          convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1): "";

          BodyDensity = 1.109380 - (0.0008267 *(parseFloat(abdomenBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.0000016 * (parseFloat(abdomenBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.000257 * ageBodyFatLbm)?.toFixed(1);
          BFP = parseFloat((495/ BodyDensity) - 450);
          if(unitsChecked=="Metrics"){
          BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
          LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
          }else{
          BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
          LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}
          ////console.log("Male ThreeSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

          // Set the setBodyFatLbmResult result 
          userCalAndMeasurements = {
            userId:userId,
            date: lastInsertedRowDate,
            calNam:"bodyFatCal",
            methds:equaChecked,
            sFMthd:"ThreeSiteFormula",
            age:ageBodyFatLbm,
            height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
            weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
            neck:'',
            torso:'',
            hips:'',
            chest:chestBodyFatLbm,
            sprlic:"",
            tricep:"",
            thigh:thighBodyFatLbm,
            abdmen:abdomenBodyFatLbm,
            axilla:"",
            subcpl:"",
            workot:"",
            target:"",
            ditTyp:"",
            result:"",
            bFPctg:BFP,
            bFMass:BodyFatMass,
            lBMass:LeanBodyMass,
            calris:"",
            protin:"",
            fats:"",
            carbs:"",
            isSync :'no',
          }; 
        }
        }
        if((genderChecked=='Her') && (skinFoldMethodsChecked === 'ThreeSiteFormula')){
          if(!tricepsBodyFatLbm || !thighBodyFatLbm || !supraliacBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){
            alert(`${t('All_fields_are_required')}`); 
          }else{
          //Three-Site Formulas (Triceps, Suprailiac, Thigh
          //Body density = 1.0994921 – (0.0009929 × sum of three skinfolds) + (0.0000023 × [sum of three skinfolds]2) – (0.0001392 × age)
          const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
          convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";

          BodyDensity = 1.0994921 - (0.0009929 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)))+ (0.0000023 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm))**2) - (0.0001392 * ageBodyFatLbm);
          BFP = parseFloat((495/ BodyDensity) - 450)?.toFixed(1);
          if(unitsChecked=="Metrics"){
          BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
          LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
          }else{
          BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
          LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}
          // Set the setBodyFatLbmResult result 
          ////console.log("Female ThreeSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

          userCalAndMeasurements = {
            userId:userId,
            date: lastInsertedRowDate,
            calNam:"bodyFatCal",
            methds:equaChecked,
            sFMthd:"ThreeSiteFormula",
            age:ageBodyFatLbm,
            height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
            weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
            neck:'',
            torso:'',
            hips:'',
            chest:"",
            sprlic:supraliacBodyFatLbm,
            tricep:tricepsBodyFatLbm,
            thigh:thighBodyFatLbm,
            abdmen:"",
            axilla:"",
            subcpl:"",
            workot:"",
            target:"",
            ditTyp:"",
            result:"",
            bFPctg:BFP,
            bFMass:BodyFatMass,
            lBMass:LeanBodyMass,
            calris:"",
            protin:"",
            fats:"",
            carbs:"",
            isSync :'no',
          }; 
          }
        }
        
        if(genderChecked=='Him'){
          
          if((skinFoldMethodsChecked === 'FourSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm  || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //Four-Site Formula (Abdomen, Suprailiac, Triceps, Thigh)
              //% Body fat = (0.29288 × sum of four skinfolds) – (0.0005 × [sum of four skinfolds]2) + (0.15845 × age) – 5.76377
              const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
              convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";

              BFP = parseFloat((0.29288 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)))- (0.0005 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm))**2) + (0.15845 * ageBodyFatLbm)-5.76377)?.toFixed(1);
              if(unitsChecked=="Metrics"){
              BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
              }else{
              BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}
              ////console.log("Male FourSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

              // Set the setBodyFatLbmResult result 
              userCalAndMeasurements = {
                userId:userId,
                date: lastInsertedRowDate,
                calNam:"bodyFatCal",
                methds:equaChecked,
                sFMthd:"FourSiteFormula",
                age:ageBodyFatLbm,
                height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
                weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
                neck:'',
                torso:'',
                hips:'',
                chest:"",
                sprlic:supraliacBodyFatLbm,
                tricep:tricepsBodyFatLbm,
                thigh:thighBodyFatLbm,
                abdmen:abdomenBodyFatLbm,
                axilla:"",
                subcpl:"",
                workot:"",
                target:"",
                ditTyp:"",
                result:"",
                bFPctg:BFP,
                bFMass:BodyFatMass,
                lBMass:LeanBodyMass,
                calris:"",
                protin:"",
                fats:"",
                carbs:"",
                isSync :'no',
              }; 
            }
          }
          if((skinFoldMethodsChecked === 'SevenSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm || !subscapulBodyFatLbm || !axillaBodyFatLbm || !chestBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){  
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //MALES
              //Seven-Site Formula (Chest, Midaxillary, Triceps, Subscapular, Abdomen, Suprailiac, Thigh)
              //Body density = 1.112 – (0.00043499 × sum of seven skinfolds) + (0.00000055 × [sum of seven skinfolds]2) – (0.00028826 × age)
              const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
              convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";

              BodyDensity = 1.112 - (0.00043499 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.00000055 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.00028826 * ageBodyFatLbm);
              BFP = parseFloat((495/ BodyDensity) - 450)?.toFixed(1);
              if(unitsChecked=="Metrics"){
              BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
              }else{
              BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}
              ////console.log("Male SevenSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

              // Set the setBodyFatLbmResult result 
              userCalAndMeasurements = {
                userId:userId,
                date: lastInsertedRowDate,
                calNam:"bodyFatCal",
                methds:equaChecked,
                sFMthd:"SevenSiteFormula",
                age:ageBodyFatLbm,
                height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
                weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
                neck:'',
                torso:'',
                hips:'',
                chest:chestBodyFatLbm,
                sprlic:supraliacBodyFatLbm,
                tricep:tricepsBodyFatLbm,
                thigh:thighBodyFatLbm,
                abdmen:abdomenBodyFatLbm,
                axilla:axillaBodyFatLbm,
                subcpl:subscapulBodyFatLbm,
                workot:"",
                target:"",
                ditTyp:"",
                result:"",
                bFPctg:BFP,
                bFMass:BodyFatMass,
                lBMass:LeanBodyMass,
                calris:"",
                protin:"",
                fats:"",
                carbs:"",
                isSync :'no',
              }; 
            }
          }
        
        }else{
          //FEMALES
          if((skinFoldMethodsChecked === 'FourSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //Four-Site Formula (Abdomen, Suprailiac, Triceps, Thigh)
              //% Body fat = (0.29669 × sum of four skinfolds) – (0.00043 × [sum of four skinfolds]2) + (0.02963 × age) + 1.4072
              const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
              convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";

              BFP = parseFloat((0.29669 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)))- (0.00043 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm))**2) + (0.02963 * ageBodyFatLbm)+1.4072)?.toFixed(1);
              if(unitsChecked=="Metrics"){
              BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
              }else{
              BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}

              ////console.log("FeMale FourSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);

              // Set the setBodyFatLbmResult result 
              userCalAndMeasurements = {
                userId:userId,
                date: lastInsertedRowDate,
                calNam:"bodyFatCal",
                methds:equaChecked,
                sFMthd:"FourSiteFormula",
                age:ageBodyFatLbm,
                height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
                weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
                neck:'',
                torso:'',
                hips:'',
                chest:"",
                sprlic:supraliacBodyFatLbm,
                tricep:tricepsBodyFatLbm,
                thigh:thighBodyFatLbm,
                abdmen:abdomenBodyFatLbm,
                axilla:"",
                subcpl:"",
                workot:"",
                target:"",
                ditTyp:"",
                result:"",
                bFPctg:BFP,
                bFMass:BodyFatMass,
                lBMass:LeanBodyMass,
                calris:"",
                protin:"",
                fats:"",
                carbs:"",
                isSync :'no',
              }; 
            }
          }
          if((skinFoldMethodsChecked === 'SevenSiteFormula')){
            if(!abdomenBodyFatLbm || !thighBodyFatLbm || !tricepsBodyFatLbm || !supraliacBodyFatLbm || !subscapulBodyFatLbm || !axillaBodyFatLbm || !chestBodyFatLbm || !sentPassNewDate && !calculatorsTableLastInsertedRow?.date){  
              alert(`${t('All_fields_are_required')}`); 
            }else{
              //FEMALES
              //Seven-Site Formula (Chest, Midaxillary, Triceps, Subscapular, Abdomen, Suprailiac, Thigh)
              //Body density = 1.0970 – (0.00046971 × sum of seven skinfolds) + (0.00000056 × [sum of seven skinfolds]2) – (0.00012828 × age)
              const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
              convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? parseFloat(convertedHeightInCm)?.toFixed(1) : "";

              BodyDensity = 1.0970 - (0.00046971 *(parseFloat(tricepsBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm)))+ (0.00000056 * (parseFloat(tricepsBodyFatLbm)+parseFloat(thighBodyFatLbm)+parseFloat(supraliacBodyFatLbm)+parseFloat(abdomenBodyFatLbm)+parseFloat(subscapulBodyFatLbm)+parseFloat(axillaBodyFatLbm)+parseFloat(chestBodyFatLbm))**2) - (0.00012828 * ageBodyFatLbm);
              BFP = parseFloat((495/ BodyDensity) - 450)?.toFixed(1);
              if(unitsChecked=="Metrics"){
              BodyFatMass =parseFloat((weightBodyFatLbm*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightBodyFatLbm - BodyFatMass)?.toFixed(1);
              }else{
              BodyFatMass =parseFloat((weightKgToDatabaseParsed*BFP)/100)?.toFixed(1);
              LeanBodyMass = parseFloat(weightKgToDatabaseParsed - BodyFatMass)?.toFixed(1);}

              ////console.log("FeMale SevenSiteFormula",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);
              ////console.log("FeMale SevenSiteFormula convertedHeightInCmWithoutNaN",convertedHeightInCmWithoutNaN);

              // Set the setBodyFatLbmResult result 
              userCalAndMeasurements = {
                userId:userId,
                date: lastInsertedRowDate,
                calNam:"bodyFatCal",
                methds:equaChecked,
                sFMthd:"SevenSiteFormula",
                age:ageBodyFatLbm,
                height:unitsChecked=="Metrics" ?  heightBodyFatLbm : convertedHeightInCmWithoutNaN,
                weight: unitsChecked=="Metrics" ?  weightBodyFatLbm : weightKgToDatabaseParsed,
                neck:'',
                torso:'',
                hips:'',
                chest:chestBodyFatLbm,
                sprlic:supraliacBodyFatLbm,
                tricep:tricepsBodyFatLbm,
                thigh:thighBodyFatLbm,
                abdmen:abdomenBodyFatLbm,
                axilla:axillaBodyFatLbm,
                subcpl:subscapulBodyFatLbm,
                workot:"",
                target:"",
                ditTyp:"",
                result:"",
                bFPctg:BFP,
                bFMass:BodyFatMass,
                lBMass:LeanBodyMass,
                calris:"",
                protin:"",
                fats:"",
                carbs:"",
                isSync :'no',
              }; 
            }
          }
           
          }

    }else if (equaChecked=="Manual"){
      if(unitsChecked=="Metrics"){
        userCalAndMeasurements = {
          userId:userId,
          date: lastInsertedRowDate,
          calNam:"bodyFatCal",
          methds:equaChecked,
          sFMthd:"",
          age:ageBodyFatLbm,
          height:heightBodyFatLbm,
          weight: weightBodyFatLbm,
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
          result:"",
          bFPctg:bodyFatLbmResult,
          bFMass:bodyFatMassResult,
          lBMass:leanBodyMassResult,
          calris:"",
          protin:"",
          fats:"",
          carbs:"",
          isSync :'no',
        };
      }else{
        //5 feet * 12 inches/foot = 60 inches
        //8 inches = 8 inches
        //height in inches, which is 60 + 8 = 68 inches.
        // ((parseFloat(heightFeetBmr)* 12) + parseFloat(heightInchesBmr))
        //BFP = 163.205×log10(waist+hip-neck) - 97.684×(log10(height)) - 78.387
        const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetBodyFatLbm), parseFloat(heightInchesBodyFatLbm));
        convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? convertedHeightInCm : "";
        const convertedTorsoInCm = feetAndInchesToCm(parseInt(torsoFeetBodyFatLbm), parseFloat(torsoInchesBodyFatLbm));
        convertedTorsoInCmWithoutNaN = !isNaN(convertedTorsoInCm) ? parseFloat(convertedTorsoInCm)?.toFixed(1) : "";
        const convertedNeckInCm = feetAndInchesToCm(parseInt(neckFeetBodyFatLbm), parseFloat(neckInchesBodyFatLbm));
        convertedNeckInCmWithoutNaN = !isNaN(convertedNeckInCm) ? parseFloat(convertedNeckInCm)?.toFixed(1) : "";
        const convertedHipsInCm = feetAndInchesToCm(parseInt(hipsFeetBodyFatLbm), parseFloat(hipsInchesBodyFatLbm));
        convertedHipsInCmWithoutNaN = !isNaN(convertedHipsInCm) ? parseFloat(convertedHipsInCm)?.toFixed(1) : "";
        
        const bodyFatMassInKg = bodyFatMassResult !=="" ? 0.45359237 * parseFloat(bodyFatMassResult) : ""; // convert weight from pounds to kg
        const bodyFatMassKgToDatabase = unitsChecked=="Metrics" ? bodyFatMassResult : bodyFatMassInKg;
        const bodyFatMassKgToDatabaseParsed =parseFloat(bodyFatMassKgToDatabase)?.toFixed(0);
        
        const leanBodyMassInKg = leanBodyMassResult !=="" ? 0.45359237 * parseFloat(leanBodyMassResult) : ""; // convert weight from pounds to kg
        const leanBodyMassKgToDatabase = unitsChecked=="Metrics" ? leanBodyMassResult : leanBodyMassInKg;
        const leanBodyMassKgToDatabaseParsed =parseFloat(leanBodyMassKgToDatabase)?.toFixed(0);
         
        // // Set the setBodyFatLbmResult result 
        // ////console.log("tape imperial Female",'BFP',BFP,'BodyFatMass',BodyFatMass,'LeanBodyMass',LeanBodyMass);
        // ////console.log("tape imperial Female",'convertedHeightInCmWithoutNaN',convertedHeightInCmWithoutNaN,'convertedTorsoInCmWithoutNaN',convertedTorsoInCmWithoutNaN,'convertedNeckInCmWithoutNaN',convertedNeckInCmWithoutNaN,'convertedHipsInCmWithoutNaN',convertedHipsInCmWithoutNaN);
        userCalAndMeasurements = {
          userId:userId,
          date: lastInsertedRowDate,
          calNam:"bodyFatCal",
          methds:equaChecked,
          sFMthd:"",
          age:ageBodyFatLbm,
          height:convertedHeightInCmWithoutNaN,
          weight: weightKgToDatabaseParsed,
          neck:convertedNeckInCmWithoutNaN,
          torso:convertedTorsoInCmWithoutNaN,
          hips:convertedHipsInCmWithoutNaN,
          chest:chestBodyFatLbm,
          sprlic:supraliacBodyFatLbm,
          tricep:tricepsBodyFatLbm,
          thigh:thighBodyFatLbm,
          abdmen:abdomenBodyFatLbm,
          axilla:axillaBodyFatLbm,
          subcpl:subscapulBodyFatLbm,
          workot:"",
          target:"",
          ditTyp:"",
          result:"",
          bFPctg:bodyFatLbmResult,
          bFMass:bodyFatMassKgToDatabaseParsed,
          lBMass:leanBodyMassKgToDatabaseParsed,
          calris:"",
          protin:"",
          fats:"",
          carbs:"",
          isSync :'no',
        }; 
      }
      
    }
    /// i need to  three values for the results inputs 
    ////console.log('equaChecked',equaChecked);
    ////console.log('userCalAndMeasurements',userCalAndMeasurements);
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
      // Alert.alert(`${t(' ')}`,
      //   `${t('Record_has_been_updated_successfully')}`,
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
      }else{
        setLoading(false);
        setShowSuccess(true); // Show success message and animation
        setTimeout(() => {
          setShowSuccess(false);
          // navigation.navigate('OurServices');
              //         navigation.navigate('OurServices');
  
        }, 2000); // 2 seconds delay
        
        // Alert.alert(`${t(' ')}`,
        //     `${t('Your_measurements_added_successfully')}`,
        //     [
        //       {
        //         text: 'OK',
        //         onPress: () => {
        //           navigation.navigate('OurServices');
        //         },
        //       },
        //     ],
        //     { cancelable: false }
        //   );
      }
          
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
            source={require('../../../../assets/Body_Fat.jpeg')} 
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
              <ServiceCloseInfoButtonText>{t("Body_Fat_LBM_desc")}</ServiceCloseInfoButtonText>
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
    <Spacer>
        <TraineeOrTrainerField>
            <FormLabelView style={{width:"40%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Measurements")}:</FormLabel>
            </FormLabelView>
          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="Tape"
                status={ equaChecked === 'Tape' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('Tape')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t("Tape")}</FormLabel>
          </TraineeOrTrainerButtonField>
            <TraineeOrTrainerButtonField>
              <RadioButton
                value="SkinFold"
                status={ equaChecked === 'SkinFold' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('SkinFold')}
                uncheckedColor={"#000"}
                color={'#000'}
              />
              <FormLabel>{t("Skin_Fold")}</FormLabel>
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

    {(equaChecked === 'SkinFold')?(
    <Spacer >
        <TraineeOrTrainerField>
            <FormLabelView>
            <FormLabel>{t("SkinFold_methods")}:</FormLabel>
            </FormLabelView>
          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="SevenSiteFormula"
                status={ skinFoldMethodsChecked === 'SevenSiteFormula' ? 'checked' : 'unchecked' }
                onPress={() => setSkinFoldMethodsChecked('SevenSiteFormula')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t("Seven_Site_Formula")}</FormLabel>
            </TraineeOrTrainerButtonField>
            <TraineeOrTrainerButtonField>
              <RadioButton
                value="FourSiteFormula"
                status={ skinFoldMethodsChecked === 'FourSiteFormula' ? 'checked' : 'unchecked' }
                onPress={() => setSkinFoldMethodsChecked('FourSiteFormula')}
                uncheckedColor={"#000"}
                color={'#000'}
              />
              <FormLabel>{t("Four_Site_Formula")}</FormLabel>
            </TraineeOrTrainerButtonField>
            <TraineeOrTrainerButtonField>
              <RadioButton
                value="ThreeSiteFormula"
                status={ skinFoldMethodsChecked === 'ThreeSiteFormula' ? 'checked' : 'unchecked' }
                onPress={() => setSkinFoldMethodsChecked('ThreeSiteFormula')}
                uncheckedColor={"#000"}
                color={'#000'}
              />
              <FormLabel>{t("Three_Site_Formula")}</FormLabel>
            </TraineeOrTrainerButtonField>
        </TraineeOrTrainerButtonsParentField>
      </TraineeOrTrainerField>
    </Spacer>
    ):(null)}

      <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
              
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Select_Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <CalendarBodyFatCalculator navigation={navigation}
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
    </Spacer>
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {(unitsChecked=="Metrics")?(`${t("Weight")} ${t("Kg")}`):(`${t("Weight")} ${t("lb")}`)}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={(unitsChecked=="Metrics")?(`${t("Kg")}`):(`${t("Pounds")}`)}
            value={weightBodyFatLbm} 
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setWeightBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
  {(equaChecked === 'Tape')?(   
    <View>
    
      {(unitsChecked=="Metrics")?(
      <View>

      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Neck")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Cm")}
              value={neckBodyFatLbm}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setNeckBodyFatLbm(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Torso")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Cm")}
            value={torsoBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      {(genderChecked=='Her')?(
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Cm")}
            value={hipsBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      ):(null)}
      </View>
      ):(
    <View>
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Neck")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={neckFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setNeckFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={neckInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setNeckInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
        </InputField>
      </Spacer>
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Torso")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={torsoFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={torsoInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
      </InputField>
      </Spacer>
      {(genderChecked=='Her')?(
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={hipsFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={hipsInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
      </InputField>
      </Spacer>
      ):(null)}
    </View>
      )}
    </View>
    ):(null)}
      {(equaChecked === 'SkinFold')?(
      <View>
      {(((genderChecked=='Him') && (skinFoldMethodsChecked === 'ThreeSiteFormula')) || skinFoldMethodsChecked === 'SevenSiteFormula')?(
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Chest")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={chestBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setChestBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      ):(null)}
    {(skinFoldMethodsChecked === 'FourSiteFormula' || skinFoldMethodsChecked === 'SevenSiteFormula'|| ((genderChecked=='Her') && (skinFoldMethodsChecked === 'ThreeSiteFormula')))?(
      <View>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Supraliac")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("mm")}
              value={supraliacBodyFatLbm}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setSupraliacBodyFatLbm(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Triceps")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("mm")}
              value={tricepsBodyFatLbm}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setTricepsBodyFatLbm(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
      </View>
      ):(null)}
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Thigh")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={thighBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setThighBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      {(skinFoldMethodsChecked === 'FourSiteFormula' || skinFoldMethodsChecked === 'SevenSiteFormula'|| ((genderChecked=='Him') && (skinFoldMethodsChecked === 'ThreeSiteFormula')))?(
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Abdomen")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={abdomenBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAbdomenBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      ):(null)}
    {( skinFoldMethodsChecked === 'SevenSiteFormula')?(
      <View>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Axilla")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={axillaBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAxillaBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Subscapul")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={subscapulBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setSubscapulBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      </View>
      ):(null)}
      </View>
      ):(null)}
      {(equaChecked === 'Manual')?(   
      <View>
{/*     
      {(unitsChecked=="Metrics")?(
      <View>

      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>{t("Neck")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Cm")}
              value={neckBodyFatLbm}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setNeckBodyFatLbm(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Torso")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Cm")}
            value={torsoBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      {(genderChecked=='Her')?(
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Cm")}
            value={hipsBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      ):(null)}
      </View>
      ):(
    <View>
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel>{t("Neck")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={neckFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setNeckFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={neckInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setNeckInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
        </InputField>
      </Spacer>
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel>{t("Torso")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={torsoFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={torsoInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTorsoInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
      </InputField>
      </Spacer>
      {(genderChecked=='Her')?(
      <Spacer size="medium">
      <InputField>
        <FormLabelView>
          <FormLabel>{t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormHalfInputView>
          <FormHalfInput
            placeholder={t("Feet")}
            value={hipsFeetBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsFeetBodyFatLbm(u)}
            />
          <FormHalfInput
            placeholder={t("Inches")}
            value={hipsInchesBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsInchesBodyFatLbm(u)}
          />
        </FormHalfInputView> 
      </InputField>
      </Spacer>
      ):(null)}
    </View>
      )}
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Chest")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={chestBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setChestBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Supraliac")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={supraliacBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setSupraliacBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Triceps")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={tricepsBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setTricepsBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Thigh")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={thighBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setThighBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Abdomen")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={abdomenBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAbdomenBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Axilla")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={axillaBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAxillaBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t("Subscapul")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("mm")}
            value={subscapulBodyFatLbm}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setSubscapulBodyFatLbm(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer> */}
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel>{t("Body_Fat_Percentage")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("mm")}
              value={bodyFatLbmResult !="NaN" ? bodyFatLbmResult : ""}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setBodyFatLbmResult(u)}
            />
          </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel>{t("Body_Fat_Mass")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("mm")}
              value={bodyFatMassResult}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setBodyFatMassResult(u)}
            />
          </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel>{t("Lean_Body_Mass")}:</FormLabel>
          </FormLabelView> 
          <FormInputView>
            <FormInput
              placeholder={t("mm")}
              value={leanBodyMassResult}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setLeanBodyMassResult(u)}
            />
          </FormInputView>
        </InputField>
      </Spacer>
    </View>
    ):(
      <View>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel style={{marginLeft:10}}>{t("Body_Fat_Percentage")}:</FormLabel>
          </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{bodyFatLbmResult !="NaN" ? bodyFatLbmResult : ""}%</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel style={{marginLeft:10}}>{t("Body_Fat_Mass")}:</FormLabel>
          </FormLabelView>
            <FormLabelDateRowView><FormLabelDateRowViewText>{bodyFatMassResult}{(unitsChecked=="Metrics")?(` ${t("Kg")}`):(` ${t("lb")}`)}</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField >
          <FormLabelView>
            <FormLabel style={{marginLeft:10}}>{t("Lean_Body_Mass")}:</FormLabel>
          </FormLabelView> 
            <FormLabelDateRowView><FormLabelDateRowViewText>{leanBodyMassResult}{(unitsChecked=="Metrics")?(` ${t("Kg")}`):(` ${t("lb")}`)}</FormLabelDateRowViewText></FormLabelDateRowView>
        </InputField>
      </Spacer>
      </View>
    )}
      
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
        {(equaChecked !== 'Manual')?(  
          <>
          <FormElemeentSizeButtonView style={{width:"48%"}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
      onPress={CalculateFunc}>
            <CalendarFullSizePressableButtonText >{t("Calculate")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
          <FormElemeentSizeButtonView style={{width:"48%"}}> 

          {(dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              SubmitFunc();
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
              SubmitFunc();
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

          </> 
        ):(
          <FormElemeentSizeButtonView style={{width:"100%"}}> 

          {(dateFromDb == sentPassNewDate ||sentPassNewDate == calculatorsTableLastInsertedRow?.date)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
          onPress={() => {
          if(genderChecked == genderCheckedToCompare){
              //console.log("genderChecked == genderCheckedToCompare",genderChecked == genderCheckedToCompare);
              SubmitFunc();
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
              SubmitFunc();
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
        )}


        
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