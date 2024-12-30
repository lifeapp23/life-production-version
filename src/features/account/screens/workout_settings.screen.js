import React, { useState,useEffect,useContext,useRef } from "react";
import {ScrollView,
  View, Pressable, Alert,Text,Image, Dimensions} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import { RadioButton } from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";
import CountryPicker from 'react-native-country-picker-modal';
import PhoneNumber from 'libphonenumber-js';
import parseMax from 'libphonenumber-js/mobile'
const { height,width } = Dimensions.get('window');

import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
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
  WorkoutSettingsWeightIntervals,
  WorkoutSettingsWeightIntervalsText,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  FormHalfInputView,
  FormHalfInput,
  WhitePageContainer,
  BlackTitle,
  AsteriskTitle,
  GenderSelector,
  CountryPickerView,
  DatePickerSelector,
  InfoFieldParent,
  InfoField,
  InfoFieldColumn,
  SelectInfo,
  WriteInfo,
  InfoSelector,
  WriteInfoChild,
  InfoInput,
  SelectorTextField,
  TraineeOrTrainerField,
  TraineeOrTrainerButtonField,
  TraineeOrTrainerButtonsParentField,
  CountryParent,
  InfoInputView,
  PageMainImage,
} from "../components/account.styles";
import axios from 'axios';
import { Spacer } from "../../../components/spacer/spacer.component";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 
import { fetchPublicSettings,insertOrUpdatePublicSettings,fetchPublicSettingsLastInsertedRow} from "../../../../database/workout_settings";
import AuthGlobal from "../Context/store/AuthGlobal";
import { setCurrentUser } from "../Context/actions/Auth.actions";
import { deleteToken } from "../../../../database/tokensTable"; 
import "./i18n";
import { useTranslation } from 'react-i18next';

export const WorkoutSettingsScreen = ({navigation,route,onLayout}) => {
  const [publicSettingsLastInsertedRow, setPublicSettingsLastInsertedRow] = useState(null);
  const [userIdNum, setUserIdNum] = useState('');
  const[ageWorkoutSettings,setAgeWorkoutSettings]=useState('');
  const context = useContext(AuthGlobal);
  const [hideButtonClicks, setHideButtonClicks] = useState(false);
  const {t} = useTranslation();

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [passwordError, setPasswordError] = useState('');
  const [selectedGender, setSelectedGender] =  useState("");
  const currentDate = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

  const [date, setDate] = useState(threeYearsAgo);  // Initialize the date to the max date


  const [checked, setChecked] = React.useState('Trainee');
  const [country, setCountry] = useState("United States");
  const [countryCode, setCountryCode] = useState('US');
  const [phoneCountryCallingCode, setPhoneCountryCallingCode] = useState("1");
  const [phone, setPhone] = useState(`+${phoneCountryCallingCode}`);
  const [validMobile, setValidMobile] = useState(false);
  
  const[dataCameFromDB,setDataCameFromDB]=useState(false);


  const[heightCmWorkoutSettings,setHeightCmWorkoutSettings]=useState('');
  const[heightFeetWorkoutSettings,setHeightFeetWorkoutSettings]=useState('');
  const[heightInchesWorkoutSettings,setHeightInchesWorkoutSettings]=useState('');
  // const [height, setHeight] = useState(600);  // Initialize with 0 to avoid NaN

  ///// page full height 
  const [pageFullHeight, setPageFullHeight] = useState(600);  // Track the height of the component
  const [socialMediaFullHeight, setSocialMediaFullHeight] = useState(100);  // Track the height of the component
  const [certificatesFullHeight, setCertificatesFullHeight] = useState(100);  // Track the height of the component

  // Handle layout changes
  const handleLayoutChange = (event) => {
    const newHeight = event.nativeEvent.layout.height;
    //console.log('workouts seetings newHeight handleLayoutChange',newHeight);
    setPageFullHeight(newHeight);  // Update the height state with the new value
  };
  const onsocialMediaLayout = (event) => setSocialMediaFullHeight(event.nativeEvent.layout.height);
  const oncertificatesLayout = (event) => setCertificatesFullHeight(event.nativeEvent.layout.height);

  useEffect(() => {
      if (onLayout && height) {
        let sentHeight;
        // Send the height to the parent whenever it changes
        if(context?.stateUser?.userProfile?.role == ""){
          if(checked === 'Trainer'){
            if(height > 750){
              sentHeight = 800 + height + socialMediaFullHeight + certificatesFullHeight;
            // console.log('1######');
            }else{
               sentHeight = 800 + 1000 + socialMediaFullHeight + certificatesFullHeight;
              //  console.log('2######');

            }
            //console.log('workouts seetings height useEffect  trainer',height);
  
        //console.log('workouts seetings socialMediaFullHeight inside if useEffect  trainer',socialMediaFullHeight);
        //console.log('workouts seetings certificatesFullHeight  inside if useEffect  trainer',certificatesFullHeight);
        //console.log('workouts seetings certificatesFullHeight  inside if useEffect  trainer',certificatesFullHeight);
        //console.log('workouts seetings sentHeight  insideif useEffect  trainer',sentHeight);
  
            onLayout({ nativeEvent: { layout: { sentHeight } } });
          }else{
            if(height > 750){
             sentHeight = 800 + height;
            //  console.log('3######');

             } else{
             sentHeight = 800 + 1000;
            //  console.log('4######');

            }
            //console.log('workouts seetings height useEffect trainee',height);
  
        //console.log('workouts seetings socialMediaFullHeight inside if useEffect trainee',socialMediaFullHeight);
        //console.log('workouts seetings certificatesFullHeight  inside if useEffect trainee',certificatesFullHeight);
        //console.log('workouts seetings certificatesFullHeight  inside if useEffect trainee',certificatesFullHeight);
        //console.log('workouts seetings sentHeight  insideif useEffect  trainee',sentHeight);
  
            onLayout({ nativeEvent: { layout: { sentHeight } } });
          }
          
        }else{ 
          if(height > 750){
            // sentHeight = 800 + height;
            sentHeight =  height -200;

            // console.log('5######');

            } else{
            sentHeight = 800 + 1000;
            // console.log('6######');

           }          //console.log('workouts seetings sentHeight  inside else useEffect ',sentHeight);

          onLayout({ nativeEvent: { layout: { sentHeight } } });
        }
        
      }
      
      
  }, [height,pageFullHeight,socialMediaFullHeight,certificatesFullHeight,checked]);
  /////// start select Units Data/////////////
const [selectedUnits,setSelectedUnits] = useState();
const unitsData = [
  "Metrics",
  "Imperial",
];
const renderUnitsOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayUnitsValue = unitsData[selectedUnits?.row];
/////// end select Units Data/////////////
  


  useEffect(() => {
    

    // setPhone(`+${phoneCountryCallingCode}`);
    const number = PhoneNumber(phone, countryCode);
    if (number?.isValid() && (parseMax(phone)?.getType() === "MOBILE")) {
      // return true; // Phone number is valid.
      ////console.log("Phone number is valid",phone);
      ////console.log("Phone parseMax getType()()",parseMax(phone)?.getType() === "MOBILE"
      // );
      
      setValidMobile(true);

    } else {
      // return false; // Phone number is not valid.
      ////console.log("Phone number is not valid",phone);
      ////console.log("Phone getType()()",number?.getType());
      setValidMobile(false);

    }

  }, [phone, countryCode]);
  // ////console.log("validMobile === false",validMobile === false);

  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  ////console.log("country top ==> ", country);
  const handlePhoneChange = (p) => {
    const sanitizedPhone = p.startsWith(`+${phoneCountryCallingCode}`)
      ? p
      : `+${phoneCountryCallingCode}${p.replace(/^\+?(\d+)/, '')}`;
      
    setPhone(sanitizedPhone);
  };
  // State variable to store the array of selected certificates and input values
  // const [certificatesInfo, setCertificatesInfo] = useState([]);
  

//////console.log('date',date);
  //////console.log('getFormattedDate()',getFormattedDate());

  ////////////// Start genderData////////////////
  const genderData = [
    'Him',
    'Her',
  ];
  const renderGenderOption = (title,i) => (
    <SelectItem title={title} key={i} />
  );
  const displayGenderValue = genderData[selectedGender.row];
  ////////////// End genderData////////////////
  ////////////// Start certificateData////////////////
  const certificatesData = [
    'American College of Sports Medicine (ACSM)',
    'American Council on Exercise (ACE)',
    'International Sports Sciences Association (ISSA)',
    'National Academy of Sports Medicine (NASM)',
    'National Council on Strength and Fitness (NCSF)',
    'National Federation of Professional Trainers (NFPT)',
    'National Strength and Conditioning Association (NSCA)',
    'American Fitness Professionals & Associates (AFPA)',
    'National Personal Training Institute (NPTI)',
    'International Fitness Professionals Association (IFPA)',
    'National Exercise Trainers Association (NETA)',
    'Other'
  ];
  ////////////// End certificateData////////////////


  /////////////// Start Certificates functionalty///////////
  const [newCertificatesSelectsValue,setNewCertificatesSelectsValue] =  useState([]);

  const [newCertificatesTextValue,setNewCertificatesTextValue] =  useState([]);
  const [newCertificatesNameTextValue,setNewCertificatesNameTextValue] =  useState([]);

  const [certificatesNames,setCertificatesNames] =  useState("");
  
  const [selectedCertificates,setSelectedCertificates] =  useState("");

  // this will be attached with each input onChangeText
  const [certificatesTextValue, setCertificatesTextValue] = useState(''); 
  // our number of inputs, we can add the length or decrease
  const [certificatesNumInputs, setCertificatesNumInputs] = useState(1);
  // all our SELECT fields are tracked with this array
  const certificatesRefSelects = useRef([selectedCertificates]);
  // all our input fields are tracked with this array
  const certificatesRefInputs = useRef([certificatesTextValue]);
  
  const setCertificatesSelectValue = (index,value)=>{
    // first we are storing Select value to refInputs arrary to track them
    // const certificatesSelects = certificatesRefSelects.current;
    // certificatesSelects[index]=value;
    // // we are also setting the select value to the select onselect
    // setSelectedCertificates(value);
    const newCertificatesSelects = [...newCertificatesSelectsValue];
    newCertificatesSelects[index] = value;
  
    setNewCertificatesSelectsValue(newCertificatesSelects);
  }
  const setCertificatesInputValue = (index,value)=>{
    // first we are storing input value to refInputs arrary to track them
    // const certificatesInputs = certificatesRefInputs.current;
    // certificatesInputs[index]=value;
    // // we are also setting the text value to the inputs field onChangeText
    // setCertificatesTextValue(value);

    const newCertificatesInputs = [...newCertificatesTextValue];
    newCertificatesInputs[index] = value;
  
  setNewCertificatesTextValue(newCertificatesInputs);
  }
  const setCertificatesNameInputValue = (index,value)=>{
   
    const newCertificatesNameInputs = [...newCertificatesNameTextValue];
    newCertificatesNameInputs[index] = value;
  
  setNewCertificatesNameTextValue(newCertificatesNameInputs);
  }
  const addCertificatesInput =() =>{
 
    // increase the num   // // add a new element in out certificatesRefSelects array
    // certificatesRefSelects.current.push('');
    // // add a new element in out certificatesRefInputs array
    // certificatesRefInputs.current.push('');ber of inputs
    setCertificatesNumInputs(value => value +1);
  }
  const removeCertificatesInput = (i)=>{
    //remove from the array by index value
    certificatesRefSelects.current.splice(i,1)[0];
    //remove from the array by index value
    certificatesRefInputs.current.splice(i,1)[0];

    // Create new arrays without the element to remove
    const newSelects = newCertificatesSelectsValue.filter((_, index) => index !== i);
    const newInputs = newCertificatesTextValue.filter((_, index) => index !== i);
    const newNameInputs = newCertificatesNameTextValue.filter((_, index) => index !== i);



    setNewCertificatesSelectsValue(newSelects);
    setNewCertificatesTextValue(newInputs);
    setNewCertificatesNameTextValue(newNameInputs);
    //decrease the number of inputs
    setCertificatesNumInputs(value => value -1);
  }
  const renderCertificatesOption = (title,i) => (
    <SelectItem key={i} title={title}  />
  );
  const displayCertificatesValue = certificatesData[selectedCertificates.row];
  const certificatesInfo =[];

  const certificatesInputsItems= [];
  for (let i = 0; i < certificatesNumInputs; i ++)
  {
    certificatesInputsItems.push(
      <View key={i} >

      
        {(certificatesData[newCertificatesSelectsValue[i]] == "Other")?(
          <InfoFieldColumn>
            <SelectInfo style={{width:"100%"}}>
                <InfoSelector
                  style={{width:"43%"}}
                  value={certificatesData[newCertificatesSelectsValue[i]]}
                  onSelect={value => setCertificatesSelectValue(i,value-1)} 
                  placeholder={t('Select_one')}
                  status="newColor"
                >
                  

                  {certificatesData.map(renderCertificatesOption)}
                </InfoSelector>
            </SelectInfo> 
            
          <WriteInfo style={{width:"100%",marginTop:10}}>
            <WriteInfoChild  style={{flexDirection: 'row'}}>
            <InfoInputView style={{width:"42%",marginRight:15}}>
              <InfoInput
                    
                    placeholder={t("Certificate_name")}
                    theme={{colors: {primary: '#3f7eb3'}}}
                    value={newCertificatesNameTextValue[i] ? newCertificatesNameTextValue[i] : ""}
                    textContentType="name"
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={value => setCertificatesNameInputValue(i,value)}
                  />
            </InfoInputView> 
            <InfoInputView style={{width:"44%"}}>
              <InfoInput
                    placeholder={t("Reference_ID")}
                    theme={{colors: {primary: '#3f7eb3'}}}
                    value={newCertificatesTextValue[i] ? newCertificatesTextValue[i] : ""}
                    textContentType="name"
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={value => setCertificatesInputValue(i,value)}
                  />
            </InfoInputView> 
              {(i == certificatesNumInputs-1) ? (
              <Pressable onPress={addCertificatesInput} style={{backgroundColor:'#000',borderRadius:10}}>
                <AntDesign name="pluscircleo" size={20} color="white" />
            </Pressable>):( <Pressable onPress={() => removeCertificatesInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
              <AntDesign name="minuscircleo" size={20} color="white" />
            </Pressable>)}
            </WriteInfoChild>
          </WriteInfo>
          </InfoFieldColumn>
        ):(
          <InfoField>
            <SelectInfo >
                <InfoSelector
                  value={certificatesData[newCertificatesSelectsValue[i]]}
                  onSelect={value => setCertificatesSelectValue(i,value-1)} 
                  placeholder={t('Select_one')}
                  status="newColor"
                >
                  

                  {certificatesData.map(renderCertificatesOption)}
                </InfoSelector>
            </SelectInfo> 
            <WriteInfo>
              <WriteInfoChild>
              <InfoInputView>
              <InfoInput
                    placeholder={t("Reference_ID")}
                    theme={{colors: {primary: '#3f7eb3'}}}
                    value={newCertificatesTextValue[i] ? newCertificatesTextValue[i] : ""}
                    textContentType="name"
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={value => setCertificatesInputValue(i,value)}
                  />
              </InfoInputView> 
                {(i == certificatesNumInputs-1) ? (
                <Pressable onPress={addCertificatesInput} style={{backgroundColor:'#000',borderRadius:10}}>
                  <AntDesign name="pluscircleo" size={20} color="white" />
              </Pressable>):( <Pressable onPress={() => removeCertificatesInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
                <AntDesign name="minuscircleo" size={20} color="white" />
              </Pressable>)}
              </WriteInfoChild>
            </WriteInfo>
          </InfoField>
        )}  
        
        
      </View>
    );
    // Update the certificatesInfo state when the certificatesInputs change
    //////console.log('certificatesData[newCertificatesSelectsValue[i]]',certificatesData[newCertificatesSelectsValue[i]]);
    //////console.log('certificatesData[newCertificatesSelectsValue[i]]',certificatesData[newCertificatesSelectsValue[i]] == "Other");

    if (certificatesData[newCertificatesSelectsValue[i]] !== undefined  && newCertificatesTextValue[i] !== '' && newCertificatesTextValue[i] !== undefined && newCertificatesTextValue[i] !== 'undefined'){
      if(certificatesData[newCertificatesSelectsValue[i]] != "Other"){
        certificatesInfo.push({ [certificatesData?.[newCertificatesSelectsValue?.[i]]]: newCertificatesTextValue?.[i] });

      }else{
        certificatesInfo.push({ [certificatesData?.[newCertificatesSelectsValue?.[i]]]: JSON.stringify({
          [newCertificatesTextValue?.[i]]: newCertificatesNameTextValue?.[i]
      }) });

      }

    }

  }
  /////////////// End Certificates functionalty///////////
  useEffect (() => {
    //////console.log('certificatesInfo',certificatesInfo);
    ////////console.log('certificatesInfo.length',certificatesInfo.length);
    if (certificatesInfo.length === 0){
      ////////console.log('000');
    }else{
      ////////console.log('ffff');
    }
  }, [certificatesInfo]);
  ////////////// Start SocialMedia////////////////
 const socialMediaData = [
  'Facebook',
  'Instagram',
  'X',
  'Linkedin',
  'TikTok',
  'Snapchat',
  'Other'
];

////////////// End SocialMediaData////////////////

/////////////// Start SocialMedia functionalities///////////
// this will be attached with each Select onSelect
const [newSelectedSocialMedia,setNewSelectedSocialMedia] =  useState([]);
const [newSocialMediaTextValue, setNewSocialMediaTextValue] = useState([]); 
const [newSocialMediaNameTextValue,setNewSocialMediaNameTextValue] =  useState([]);
const [selectedSocialMedia,setSelectedSocialMedia] =  useState("");
// this will be attached with each input onChangeText
const [socialMediaTextValue, setSocialMediaTextValue] = useState(''); 
// our number of inputs, we can add the length or decrease
const [socialMediaNumInputs, setSocialMediaNumInputs] = useState(1)
// all our SELECT fields are tracked with this array
const socialMediaRefSelects = useRef([selectedSocialMedia]);
// all our input fields are tracked with this array
const socialMediaRefInputs = useRef([socialMediaTextValue]);

const setSocialMediaSelectValue = (index,value)=>{
  // first we are storing Select value to refInputs arrary to track them
  const socialMediaSelects = socialMediaRefSelects.current;
  socialMediaSelects[index]=value;
  // we are also setting the text value to the inputs field onChangeText
  const newSocialMediaSelected = [...newSelectedSocialMedia];
  newSocialMediaSelected[index] = value;
  setSelectedSocialMedia(value);
  
  setNewSelectedSocialMedia(newSocialMediaSelected);
  
}
const setSocialMediaInputValue = (index,value)=>{
  // first we are storing input value to refInputs arrary to track them
  // const socialMediaInputs = socialMediaRefInputs.current;
  // socialMediaInputs[index]=value;
  // we are also setting the text value to the inputs field onChangeText
  //setSocialMediaTextValue(value);
  const newSocialMediaInputs = [...newSocialMediaTextValue];
  newSocialMediaInputs[index] = value;
  
  setNewSocialMediaTextValue(newSocialMediaInputs);
}
const setSocialMediaNameInputValue = (index,value)=>{
   
  const newSocialMediaNameInputs = [...newSocialMediaNameTextValue];
  newSocialMediaNameInputs[index] = value;

setNewSocialMediaNameTextValue(newSocialMediaNameInputs);
}  

const addSocialMediaInput =() =>{
  // add a new element in out socialMediaRefSelects array
  // socialMediaRefSelects.current.push('');
  // // add a new element in out refInputs array
  // socialMediaRefInputs.current.push('');
  // increase the number of inputs
    setSocialMediaNumInputs(value => value +1);
}
const removeSocialMediaInput = (i)=>{
  //remove from the array by index value
  //////console.log('socialMediaRefSelects removeSocialMediaInputbefore',newSelectedSocialMedia);
  //////console.log('socialMediaRefInputs removeSocialMediaInputbefore',newSocialMediaTextValue);

  //socialMediaRefSelects.current.splice(i,1)[0];
  //remove from the array by index value
  //socialMediaRefInputs.current.splice(i,1)[0];
  

// Create new arrays without the element to remove
const newSelects = newSelectedSocialMedia.filter((_, index) => index !== i);
const newInputs = newSocialMediaTextValue.filter((_, index) => index !== i);

// Update the state with the new arrays
// socialMediaRefSelects.current = newSelects;
// socialMediaRefInputs.current = newInputs;

setNewSelectedSocialMedia(newSelects);
setNewSocialMediaTextValue(newInputs);
//////console.log('newSelects removeSocialMediaInput after',newSelects);  
//////console.log('newInputs removeSocialMediaInput after',newInputs);
  //decrease the number of inputs
  setSocialMediaNumInputs(value => value -1);
}
const renderSocialMediaOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displaySocialMediaValue = socialMediaData[selectedSocialMedia.row];
const selectedSocialMediaInfo= [];
const socialMediaInputs= [];
  for (let i = 0; i < socialMediaNumInputs; i ++)
  {
    socialMediaInputs.push(
      <View key={i} >
      {(socialMediaData[newSelectedSocialMedia[i]] == "Other")?(
          <InfoFieldColumn>
            <SelectInfo style={{width:"100%"}}>
                <InfoSelector
                  style={{width:"43%"}}
                  value={socialMediaData[newSelectedSocialMedia[i]]}
                  onSelect={value => setSocialMediaSelectValue(i,value-1)} 
                  placeholder={t('Select_one')}
                  status="newColor"
                >
                  {socialMediaData.map(renderSocialMediaOption)}
                </InfoSelector>
            </SelectInfo> 
            
          <WriteInfo style={{width:"100%",marginTop:10}}>
            <WriteInfoChild  style={{flexDirection: 'row'}}>
            <InfoInputView style={{width:"42%",marginRight:15}}>
              <InfoInput
                    
                    placeholder={t("socialmedia_name")}
                    theme={{colors: {primary: '#3f7eb3'}}}
                    value={newSocialMediaNameTextValue[i] ? newSocialMediaNameTextValue[i] : ""}
                    textContentType="name"
                    autoCapitalize="none"
                    keyboardType="default"
                    onChangeText={value => setSocialMediaNameInputValue(i,value)}
                  />
            </InfoInputView> 
            <InfoInputView style={{width:"44%"}}>
                  <InfoInput
                            
                  theme={{colors: {primary: '#3f7eb3'}}}
                  placeholder={t("Link")}
                  textContentType="name"
                  value={newSocialMediaTextValue[i] ? newSocialMediaTextValue[i] : ""}
                  onChangeText={value => setSocialMediaInputValue(i,value)}
                  autoCapitalize="none"
                  keyboardType="default"
                />
            </InfoInputView> 
            {(i == socialMediaNumInputs-1) ? (
              <Pressable onPress={addSocialMediaInput} style={{backgroundColor:'#000',borderRadius:10}}>
                <AntDesign name="pluscircleo" size={20} color="white" />
               </Pressable>):( <Pressable onPress={() => removeSocialMediaInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
              <AntDesign name="minuscircleo" size={20} color="white" />
            </Pressable>)}
            </WriteInfoChild>
          </WriteInfo>
          </InfoFieldColumn>
        ):(
          <InfoField>
            <SelectInfo >
                <InfoSelector
                  value={socialMediaData[newSelectedSocialMedia[i]]}
                  onSelect={value => setSocialMediaSelectValue(i,value-1)} 
                  placeholder={t('Select_one')}
                  status="newColor"
                >
                  {socialMediaData.map(renderSocialMediaOption)}
                </InfoSelector>
    
            </SelectInfo>   
            <WriteInfo>
              <WriteInfoChild>
                <InfoInputView>
                  <InfoInput
                          
                          theme={{colors: {primary: '#3f7eb3'}}}
                          placeholder={t("Link")}
                          textContentType="name"
                          value={newSocialMediaTextValue[i] ? newSocialMediaTextValue[i] : ""}
                          onChangeText={value => setSocialMediaInputValue(i,value)}
                          autoCapitalize="none"
                          keyboardType="default"
                        />
                </InfoInputView>
                  {(i == socialMediaNumInputs-1) ? (
                  <Pressable onPress={addSocialMediaInput} style={{backgroundColor:'#000',borderRadius:10}}>
                    <AntDesign name="pluscircleo" size={20} color="white" />
                  </Pressable>):( <Pressable onPress={() => removeSocialMediaInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
                  <AntDesign name="minuscircleo" size={20} color="white" />
                </Pressable>)}
              </WriteInfoChild>
            </WriteInfo>
          </InfoField>
        )}  
      </View>
    );
   // Update the selectedSocialMediaInfo state when the socialMediaRefInputs change
  //  if (socialMediaData[newSelectedSocialMedia[i]] !== undefined && newSocialMediaTextValue[i] !== '' && newSocialMediaTextValue[i] !== undefined && newSocialMediaTextValue[i] !== 'undefined'){
  //   selectedSocialMediaInfo.push({ [socialMediaData[newSelectedSocialMedia[i]]]: newSocialMediaTextValue[i] });
  //   //////console.log('selectedSocialMediaInfo insdie',selectedSocialMediaInfo);

  // }
  if (socialMediaData[newSelectedSocialMedia[i]] !== undefined  && newSocialMediaTextValue[i] !== '' && newSocialMediaTextValue[i] !== undefined && newSocialMediaTextValue[i] !== 'undefined'){
    if(socialMediaData[newSelectedSocialMedia[i]] != "Other"){
      selectedSocialMediaInfo.push({ [socialMediaData?.[newSelectedSocialMedia?.[i]]]: newSocialMediaTextValue?.[i] });

    }else{
      selectedSocialMediaInfo.push({ [socialMediaData?.[newSelectedSocialMedia?.[i]]]: JSON.stringify({
        [newSocialMediaTextValue?.[i]]: newSocialMediaNameTextValue?.[i]
    }) });

    }

  }

}

/////////////// End SocialMedia functionalty///////////

function convertDateFormat(inputDate) {
  // Check if the inputDate is a valid Date object
  if (!(inputDate instanceof Date) || isNaN(inputDate)) {
    return ''; // Return an empty string or handle the error as needed
  }

  // Split the input date into parts using '/'
  const dateParts = inputDate.toLocaleDateString().split('/');
  const currentDate = inputDate;
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  //return `${year}-${month}-${day}`;
  // Create a new Date object with the parts in the desired order
  const formattedDate = new Date(`${year}-${month}-${day}`);

  // Use toISOString() to get the formatted date string
  const result = formattedDate.toISOString().split('T')[0];

  return result;
}
const convertedDate = convertDateFormat(date);






const [barbelInput,setBarbelInput] = useState();

// /////// start select Barbell/////////////
// const barbellData = [
//   "5 KG",
//   "10 KG",
//   "15 KG",
//   "20 KG",
//   "25 KG",
//   "30 KG",
// ];
// const [selectedBarbell,setSelectedBarbell] = useState();
/////// end select Barbell/////////////
const [dumbellInput,setDumbellInput] = useState();

/////// start select dumbell Data/////////////

// const dumbellData = [
//   "5 KG",
//   "10 KG",
//   "15 KG",
//   "20 KG",
//   "25 KG",
//   "30 KG",
// ];
// const [selectedDumbell,setSelectedDumbell] = useState();
// /////// end select dumbell Data/////////////
//bands FreWit
const [bandsInput,setBandsInput] = useState();

/////// start select Bands Data/////////////
// const bandsData = [
//   "5 KG",
//   "10 KG",
//   "15 KG",
//   "20 KG",
//   "25 KG",
//   "30 KG",
// ];
// const [selectedBands,setSelectedBands] = useState();
/////// end select Bands Data/////////////
const [FreWitInput,setFreWitInput] = useState();

/////// start select FreWit Data/////////////
// const FreWitData = [
//   "5 KG",
//   "10 KG",
//   "15 KG",
//   "20 KG",
//   "25 KG",
//   "30 KG",
// ];
// const [selectedFreWitData,setSelectedFreWitData] = useState();

/////// end select FreWit Data/////////////

//// start height ///////

////////////// Start compoundData////////////////
const [selectedCompound,setSelectedCompound] = useState("");

////////////// End compoundData////////////////

////////////// Start isolationData////////////////
const [selectedIsolation,setSelectedIsolation] = useState("");
////////////// End isolationData////////////////

////////////// Start cardioData////////////////
const [selectedCardio,setSelectedCardio] = useState("");
////////////// End cardioData////////////////
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

if (displayUnitsValue === "Imperial"){
  //values come from data base into inputs
  const convertedHeightFromDataBase = cmToFeetAndInches(publicSettingsLastInsertedRow?.height);
  convertedHeightFromDataBaseWithoutNanFeet = !isNaN(convertedHeightFromDataBase.feet) ? convertedHeightFromDataBase.feet : '';
  convertedHeightFromDataBaseWithoutNanInches = !isNaN(convertedHeightFromDataBase.inches) ? convertedHeightFromDataBase.inches : '';
  // converted values will go into database as cm values
  const heightFeetValue = heightFeetWorkoutSettings !=='' ? heightFeetWorkoutSettings : convertedHeightFromDataBaseWithoutNanFeet;
  const heightInchesValue = heightInchesWorkoutSettings !=='' ? heightInchesWorkoutSettings : convertedHeightFromDataBaseWithoutNanInches;
  //////console.log('heightFeetValue-----',heightFeetValue);
  //////console.log('heightInchesValue-----',heightInchesValue);

  const convertedHeightInCm = feetAndInchesToCm(parseInt(heightFeetValue), parseFloat(heightInchesValue));
  convertedHeightInCmWithoutNaN = !isNaN(convertedHeightInCm) ? convertedHeightInCm : "";

}
//////console.log('convertedHeightInCmWithoutNaN-----',convertedHeightInCmWithoutNaN);

let newHeight='';
if(displayUnitsValue === "Metrics"){
  newHeight = heightCmWorkoutSettings !== '' ? heightCmWorkoutSettings : publicSettingsLastInsertedRow?.height?.toString();
}else{
  newHeight = convertedHeightInCmWithoutNaN;
}
//////console.log('newHeight-----',newHeight);
// if (!publicSettingsLastInsertedRow?.height){
//   //////console.log('wrong');
//   //////console.log('publicSettingsLastInsertedRow?.height?.toString()',publicSettingsLastInsertedRow?.height?.toString());
// }else{
//   //////console.log('Not undefined',publicSettingsLastInsertedRow?.height?.toString());
// }

///// end height //////
useFocusEffect(
  React.useCallback(() => {
    // Fetch the latest data or update the state here
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      // Extract the ID part from the token and convert it to a number
      const tokenIDPart = parseInt(res.split('|')[0], 10);
      getUserIdFromTokenId(tokenIDPart)
        .then((userId) => {
          setUserIdNum(userId);
          fetchPublicSettingsLastInsertedRow(userId)
          .then((row) => {
            setPublicSettingsLastInsertedRow(row);
            ////console.log('row---===----===',row);
            if (context?.stateUser?.userProfile?.role !== "" && row == null) {
              let age = calculateAge(context?.stateUser?.userProfile?.bdate);
              ////console.log('age---===----===',age);

              setAgeWorkoutSettings(age?.toString());
            }
            let convertedHeightFromDataBaseWithoutNanFeetDirect= '';
            let convertedHeightFromDataBaseWithoutNanInchesDirect= '';
            if(row?.units === "Metrics"){
              setHeightCmWorkoutSettings(row?.height);
            }else{
              const convertedHeightFromDataBaseDirect = cmToFeetAndInches(row?.height);
            convertedHeightFromDataBaseWithoutNanFeetDirect = !isNaN(convertedHeightFromDataBaseDirect.feet) ? convertedHeightFromDataBaseDirect.feet : '';
            convertedHeightFromDataBaseWithoutNanInchesDirect = !isNaN(convertedHeightFromDataBaseDirect.inches) ? convertedHeightFromDataBaseDirect.inches : '';
            setHeightFeetWorkoutSettings(convertedHeightFromDataBaseWithoutNanFeetDirect);
            setHeightInchesWorkoutSettings(convertedHeightFromDataBaseWithoutNanInchesDirect);

            }
            // const barbelIndex = barbellData.indexOf(row?.barBel);
            // setSelectedBarbell(barbelIndex !== -1 ? new IndexPath(barbelIndex) : new IndexPath(0));
            setBarbelInput(row?.barBel);
            
            // const dumbelIndex = dumbellData.indexOf(row?.dumbel);
            // setSelectedDumbell(dumbelIndex !== -1 ? new IndexPath(dumbelIndex) : new IndexPath(0));
            setDumbellInput(row?.dumbel);
            
            // const bandsIndex = bandsData.indexOf(row?.bands);
            // setSelectedBands(bandsIndex !== -1 ? new IndexPath(bandsIndex) : new IndexPath(0));
            setBandsInput(row?.bands);

            // const FreWitIndex = FreWitData.indexOf(row?.FreWit);
            // setSelectedFreWitData(FreWitIndex !== -1 ? new IndexPath(FreWitIndex) : new IndexPath(0));
            setFreWitInput(row?.FreWit);
            
            const unitsIndex = unitsData.indexOf(row?.units);
            setSelectedUnits(unitsIndex !== -1 ? new IndexPath(unitsIndex) : new IndexPath(0));
            setSelectedCompound(row?.compnd);
            setSelectedCardio(row?.cardio);
            setSelectedIsolation(row?.isoltn);
            setDataCameFromDB(true);

          })
          .catch((error) => {
            ////console.error('Error fetching last inserted row:', error);
          });
        })
    }); 
    if (context?.stateUser?.userProfile?.role === "") {
      let age = calculateAge(date);
      setAgeWorkoutSettings(age?.toString());
    }  
  }, [AsyncStorage,getUserIdFromTokenId,fetchPublicSettingsLastInsertedRow,setPublicSettingsLastInsertedRow])
);
useEffect (() => {
  
  ////console.log('dataCameFromDB',dataCameFromDB);
  ////console.log('heightCmWorkoutSettings ',heightCmWorkoutSettings);

  if(dataCameFromDB){

 

  let convertedHeightFromDataBaseWithoutNanFeetToInput = '';
  let convertedHeightFromDataBaseWithoutNanInchesToInput = '';
  let convertedHeightInCmWithoutNaNToInput="";
  if (displayUnitsValue === "Imperial"){
    const convertedHeightFromDataBaseToInput = cmToFeetAndInches(heightCmWorkoutSettings);
    convertedHeightFromDataBaseWithoutNanFeetToInput = !isNaN(convertedHeightFromDataBaseToInput.feet) ? convertedHeightFromDataBaseToInput.feet : '';
    convertedHeightFromDataBaseWithoutNanInchesToInput = !isNaN(convertedHeightFromDataBaseToInput.inches) ? convertedHeightFromDataBaseToInput.inches : '';
  ////console.log('heightCmWorkoutSettings',heightCmWorkoutSettings);
  ////console.log('convertedHeightFromDataBaseWithoutNanFeetToInput',convertedHeightFromDataBaseWithoutNanFeetToInput);
  ////console.log('convertedHeightFromDataBaseWithoutNanInchesToInput',convertedHeightFromDataBaseWithoutNanInchesToInput);

    setHeightFeetWorkoutSettings(convertedHeightFromDataBaseWithoutNanFeetToInput);
    setHeightInchesWorkoutSettings(convertedHeightFromDataBaseWithoutNanInchesToInput);
  }else{
    if(heightFeetWorkoutSettings  && heightInchesWorkoutSettings){

    
      const convertedHeightInCmToInput = feetAndInchesToCm(parseInt(heightFeetWorkoutSettings), parseFloat(heightInchesWorkoutSettings));
    convertedHeightInCmWithoutNaNToInput= !isNaN(convertedHeightInCmToInput) ? convertedHeightInCmToInput.toFixed(0) : "";
    ////console.log('heightFeetWorkoutSettings',heightFeetWorkoutSettings);
    ////console.log('heightInchesWorkoutSettings',heightInchesWorkoutSettings);
    ////console.log('convertedHeightInCmWithoutNaNToInput-----',convertedHeightInCmWithoutNaNToInput);
    
    setHeightCmWorkoutSettings(convertedHeightInCmWithoutNaNToInput);

    }
}
}
}, [displayUnitsValue,heightCmWorkoutSettings,heightFeetWorkoutSettings,heightInchesWorkoutSettings]);
// ////////////// Start barbellData////////////////

// const renderBarbellOption = (title,i) => (
//   <SelectItem title={title} key={i} />
// );
// const displayBarbellValue = barbellData[selectedBarbell?.row];
//////console.log('displayBarbellValue',displayBarbellValue);
////////////// End dumbellData////////////////

////////////// Start dumbellData////////////////

// const renderDumbellOption = (title,i) => (
//   <SelectItem title={title} key={i} />
// );

// const displayDumbellValue = dumbellData[selectedDumbell?.row];
////////////// End dumbellData////////////////

////////////// Start bandsData////////////////
// const renderBandsOption = (title,i) => (
//   <SelectItem title={title} key={i} />
// );
// const displayBandsValue = bandsData[selectedBands?.row];

////////////// End BandsData////////////////

////////////// Start FreWitData////////////////
// const renderFreWitOption = (title,i) => (
//   <SelectItem title={title} key={i} />
// );
// const displayFreWitValue = FreWitData[selectedFreWitData?.row];

////////////// End FreWitData////////////////


//////console.log('context.stateUser workout settings',context.stateUser);
const handlePublicSettingsSubmit = async () => {

  if (!displayUnitsValue || !newHeight && !publicSettingsLastInsertedRow?.height?.toString() || !ageWorkoutSettings && !publicSettingsLastInsertedRow?.age?.toString() ||  !selectedCompound && !publicSettingsLastInsertedRow?.compnd?.toString() || !selectedIsolation && !publicSettingsLastInsertedRow?.isoltn?.toString() || !selectedCardio && !publicSettingsLastInsertedRow?.cardio?.toString() ) {
    Alert.alert(`${t('All_fields_are_required')}`);
    return false;
  }
  if(newHeight == "0" || publicSettingsLastInsertedRow?.height === 0 || selectedCompound == "0" || publicSettingsLastInsertedRow?.compnd == 0 || selectedIsolation == "0" || publicSettingsLastInsertedRow?.isoltn == 0 || selectedCardio == "0" || publicSettingsLastInsertedRow?.cardio == 0){
    Alert.alert(`${t('Height_Compound_Isolation_Cardio_must_be_greater_than_zero')}`); 
    return false;
  }
  //////console.log('newHeight-----',newHeight);
  const userPublicSettings = {
    user_id :userIdNum,
    height:newHeight,
    age:ageWorkoutSettings !== "" ? ageWorkoutSettings : publicSettingsLastInsertedRow?.age?.toString(),
    units: displayUnitsValue,
    dumbel: dumbellInput ? dumbellInput : "",
    barBel: barbelInput ? barbelInput : "",
    bands: bandsInput ? bandsInput : "",
    FreWit: FreWitInput ? FreWitInput : "",
    compnd: selectedCompound !== "" ? selectedCompound : publicSettingsLastInsertedRow?.compnd?.toString(),
    isoltn: selectedIsolation !== "" ? selectedIsolation : publicSettingsLastInsertedRow?.isoltn?.toString(),
    cardio: selectedCardio !== "" ? selectedCardio : publicSettingsLastInsertedRow?.cardio?.toString(),
    is_sync :'no',
  };
  const is_approved = checked === 'Trainee' ? 'yes' : 'yes';

  let originalUserProfile= context.stateUser.userProfile;
  if(context?.stateUser?.userProfile?.role === ""){
    originalUserProfile = {
      id:context.stateUser.userProfile.id,
      fName:context.stateUser.userProfile.fName,
      lName:context.stateUser.userProfile.lName,
      email:context.stateUser.userProfile.email,
      phone: phone,
      gender: displayGenderValue,
      bdate: convertedDate,
      country: country,
      role: checked,
      athRol:'user',
      isAppro : is_approved
      
    };
  
  }
  try {
    await insertOrUpdatePublicSettings(userPublicSettings);
    Alert.alert(
      ``,
      `${t('Your_publicSettings_added_successfully')}`,
      [
        {
          text: 'OK',
          onPress: () => {
            context.dispatch(setCurrentUser(context.stateUser.token, originalUserProfile, userPublicSettings));
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabNavigator' }],
            });
          },
        },
      ],
      { cancelable: false }
    );
    return true;
  } catch (error) {
    Alert.alert(` `, error.message);
    return false;
  }
};
////console.log("context.stateUser.userProfile.role",context?.stateUser?.userProfile);

////console.log("context.stateUser.userPublicSettings",context.stateUser.userPublicSettings);
const handleSignout = async () => {
  try {
    setHideButtonClicks(true);
    
    // Make a request to the signout endpoint `${BASE_URL}/api/signout`
    const response = await axios.post(`https://www.elementdevelops.com/api/signout`, {token:context.stateUser.token});
    ////////console.log("signout response.data.message",response.data.message);
    
    // Split the token string using the '|' character
    const tokenParts = context.stateUser.token?.split('|');

    // The first part (index 0) will be the ID
    const tokenId = parseInt(tokenParts[0], 10);
    
    deleteToken(tokenId).then(()=>{
      //////console.log('workout Settings token row deleted successfully');
    });
    AsyncStorage.removeItem("sanctum_token");
    AsyncStorage.removeItem("currentUser");
    AsyncStorage.removeItem("userPublicSettings");

    context.dispatch(setCurrentUser('',{},{}));
    // Handle the response, e.g., show a message to the user
    // alert(response.data.message);

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AccountNavigator',
        },
      ],
    });
  } catch (error) {
    // Handle errors, e.g., show an error message
    //////console.log(error);
    // Split the token string using the '|' character
    if(context.stateUser.token){
      const tokenParts = context.stateUser.token.split('|');

    // The first part (index 0) will be the ID
    const tokenId = parseInt(tokenParts[0], 10);
    
    deleteToken(tokenId).then(()=>{
      //////console.log('result token row deleted successfully');
    });
    }
    
    AsyncStorage.removeItem("sanctum_token");
    AsyncStorage.removeItem("currentUser");
    AsyncStorage.removeItem("userPublicSettings");

    context.dispatch(setCurrentUser('',{},{}));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AccountNavigator',
        },
      ],
    });
  }
};
//////console.log('publicSettingsLastInsertedRow',publicSettingsLastInsertedRow);
//////console.log('heightFeetWorkoutSettings',heightFeetWorkoutSettings);
//////console.log('heightInchesWorkoutSettings',heightInchesWorkoutSettings);

const handleUpdateSubmit = async () => {
  if (!password || !phone || !displayGenderValue || !convertedDate || !country) {
    Alert.alert(`${t('Please_fill_mandatory_fields')}`);
    return false;
  }
if(checked === 'Trainer' && certificatesInfo.length == 0 && selectedSocialMediaInfo.length == 0){
  Alert.alert(`${t('You_must_add_at_least_one_certififcate_SocialMedia_Account')}`);
  return false;
}



// if(checked === 'Trainer' && selectedSocialMediaInfo.length == 0){
//   Alert.alert('You must add at least one SocialMedia Account');
//   return;
// }
  if (password !== repeatedPassword) {
    Alert.alert(`${t('Passwords_do_not_match')}`);
    return false;
  }
  if(validMobile === false){
    Alert.alert(`${t('Please_enter_valid_mobile_number')}`);
    return false;
  }
  const is_approved = checked === 'Trainee' ? 'yes' : 'yes';
  let userData={};
  if (checked === 'Trainee'){
    userData = {
      password: password,
      password_confirmation: repeatedPassword,
      phone: phone,
      gender: displayGenderValue,
      bdate: convertedDate,
      country: country,
      role: checked,
      athRol:'user',
      isAppro : is_approved
      
    };
  }else{
    userData = {
      password: password,
      password_confirmation: repeatedPassword,
      phone: phone,
      gender: displayGenderValue,
      bdate: convertedDate,
      country: country,
      role: checked,
      isAppro : is_approved,
      userId:'',
      speKey:"",
      about:'',
      crtfct:JSON.stringify(certificatesInfo),
      socMed:JSON.stringify(selectedSocialMediaInfo),
      images:'',
      rfnPlc:'',
      acpSub:true,
      strDat:'',
      endDat:'',
      aprovd:"yes",
      athRol:'user',
      isSync:'no'
    };
  }
  let sentId = context.stateUser.userProfile.id; 
////console.log('userData',userData);
  try {
    const response = await axios.put(`https://www.elementdevelops.com/api/users/${sentId}`, userData);
    //////console.log('response.data:', response?.data);
    //Alert.alert(`${t(response?.data?.message)}`);
    
    return true;
    // Handle success, e.g., show a success message to the user
  } catch (error) {
    //setEmaillError setPasswordError
    const { errors, message } = error?.response?.data;
    const validationErrors = error?.response?.data?.errors;

    if (message) {
      //////console.log('Error Message:', message);
      // Handle error message, e.g., show an alert
    } else if (errors) {
      // if (error?.response?.data?.errors?.uName){
      //   setUNameError(error?.response?.data?.errors?.uName[0]);
      // }else{
      //   setUNameError('');
      // }

      if(error?.response?.data?.errors?.password){
        setPasswordError(error?.response?.data?.errors?.password[0]);
      }else{
        setPasswordError('');
      }
    } else {
      Alert.alert('Unknown Error:', error?.message);
      //////console.log('Unknown Error:', error);
      // Handle other unexpected errors
    }
    return false;
  }
};
const calculateAge = (birthDate) => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
};
  return (
    <WhitePageContainer  onLayout={handleLayoutChange}  // Listen for layout changes
>
            {/* <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/Workout_Settings_two.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover> */}
            {/* <Spacer size="small">
            <WorkoutSettingsWeightIntervals >
              <WorkoutSettingsWeightIntervalsText>{t('Settings')}</WorkoutSettingsWeightIntervalsText>
            </WorkoutSettingsWeightIntervals>
          </Spacer> */}
            
            {
              (context?.stateUser?.userProfile?.role === "")?(
                <>
                <Spacer size="large">
                  <InputField >
                  <FormLabelView>
                    <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Password')}:</FormLabel>
                  </FormLabelView>
                  <FormInputView>
                    <FormInput
                      placeholder={t('Password')}
                      value={password}
                      textContentType="password"
                      secureTextEntry
                      autoCapitalize="none"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(p) => setPassword(p)}
                    />
                    {passwordError && (<Text style={{color:'red',fontSize:14}}>{passwordError}</Text>)}
                  </FormInputView>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField >
                  <FormLabelView>
                    <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Confirm_Password')}:</FormLabel>
                  </FormLabelView>
                  <FormInputView>
                    <FormInput
                      placeholder={t("Repeat_Password")}
                      value={repeatedPassword}
                      textContentType="password"
                      secureTextEntry
                      autoCapitalize="none"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(p) => setRepeatedPassword(p)}
                    />
                  </FormInputView>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Gender")}:</FormLabel>
                    </FormLabelView>
                      <GenderSelector
                        selectedIndex={selectedGender}
                        onSelect={(index) => setSelectedGender(index)}
                        placeholder={t('Select_Gender')}
                        value={displayGenderValue}
                        status="newColor"
                        size="customSizo"
                      >
                        {genderData.map(renderGenderOption)}
                      </GenderSelector>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField >
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Birthdate')}:</FormLabel>
                    </FormLabelView>
                      <DatePickerSelector
                        date={date}
                        onSelect={nextDate => {
                          setDate(nextDate);
                          if (context?.stateUser?.userProfile?.role === "") {
                            let age = calculateAge(nextDate);
                            setAgeWorkoutSettings(age?.toString());
                          }
                        }}
                        placement="top end"
                        min={new Date('1920-01-01')}
                        max={threeYearsAgo}
                        status="datepickerCustomColor"
                        size="datepickerCutomSize"
                      />
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                  <CountryParent>
                      <FormLabelView>
                        <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Country')}:</FormLabel>
                      </FormLabelView>
                    <CountryPickerView >
                      <CountryPicker 
                        withFilter
                        withFlag
                        withCountryNameButton
                        // theme={{
                        //   primaryColor: 'red',
                        //   primaryColorVariant: 'yellow',
                        //   backgroundColor: '#ffffff',
                        //   }}
                        countryCode={countryCode}
                        visible={showPhoneCountryPicker}
                        onSelect={(country) => {
                        ////console.log("COUNTERY ==> ", country);
                          setCountry(country.name);
                          setCountryCode(country.cca2);
                          setPhoneCountryCallingCode(country.callingCode);
                          setPhone(`+${country.callingCode}`)
                          setShowPhoneCountryPicker(false);
                                        }}
                          
                        value = {country.name}
                      />
                    </CountryPickerView>
                    </CountryParent>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField >
                  <FormLabelView>
                    <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Mobile')}:</FormLabel>
                  </FormLabelView>
                  <FormInputView>
                    <FormInput
                      placeholder={t('Mobile')}
                      value={phone}
                      textContentType="telephoneNumber"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={handlePhoneChange}
                    />
                  </FormInputView>
                  </InputField>
                </Spacer>
                <Spacer>
                  <TraineeOrTrainerField>
                      <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('User_Type')}:</FormLabel>
                      </FormLabelView>
                    <TraineeOrTrainerButtonsParentField>
                      <TraineeOrTrainerButtonField>
                        <RadioButton
                          value="Trainer"
                          status={ checked === 'Trainer' ? 'checked' : 'unchecked' }
                          onPress={() => setChecked('Trainer')}
                          uncheckedColor={"#000"}
                          color={'#000'}
                          
                        />
                        <FormLabel>{t('Trainer')}</FormLabel>
                    </TraineeOrTrainerButtonField>
                      <TraineeOrTrainerButtonField>
                        <RadioButton
                          value="Trainee"
                          status={ checked === 'Trainee' ? 'checked' : 'unchecked' }
                          onPress={() => setChecked('Trainee')}
                          uncheckedColor={"#000"}
                          color={'#000'}
                        />
                        <FormLabel>{t('Trainee')}</FormLabel>
                      </TraineeOrTrainerButtonField>
                  </TraineeOrTrainerButtonsParentField>
                </TraineeOrTrainerField>
              </Spacer>
              <>
              {(checked === 'Trainer') ? (
                <View>
                  <Spacer size="large">
                    <InfoFieldParent onLayout={oncertificatesLayout}>
                      <ScrollView>
                        <SelectorTextField>
                          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Certifications')}:</FormLabel>
                        </SelectorTextField>
                        {certificatesInputsItems}
                      </ScrollView>
                    </InfoFieldParent>
                    </Spacer>
                    
                    <Spacer size="large">
                    <InfoFieldParent  onLayout={onsocialMediaLayout}>
                      <ScrollView>
                        <SelectorTextField>
                          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Social_Media_Presence')}:</FormLabel>
                        </SelectorTextField>
                        {socialMediaInputs}
                      </ScrollView>
                      </InfoFieldParent>
                    </Spacer>
                </View>
              ):( null)}
              </>
                </>
              ):(null)
            }
            <WorkoutSettingsWeightIntervals >
              <WorkoutSettingsWeightIntervalsText>{t('Personal_Settings')}</WorkoutSettingsWeightIntervalsText>
            </WorkoutSettingsWeightIntervals>
            <Spacer size="medium">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Units')}: </FormLabel>
              </FormLabelView>
              <FormInputView>
              <Select
                  onSelect={(index) => {
                    setSelectedUnits(index);
                    }}
                  placeholder={t('Select_Units')}
                  value={displayUnitsValue}
                  style={{marginBottom:10}}
                  status="newColor"
                >
                  {unitsData.map(renderUnitsOption)}
                </Select>
              </FormInputView>  
            </InputField>
            </Spacer>
            {(displayUnitsValue === "Metrics")?(
              <View>
              <Spacer size="medium">
                <InputField>
                <FormLabelView>
                  <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Height')}:</FormLabel>
                </FormLabelView>
                <FormInputView>
                  <FormInput
                    placeholder={t("Cm")}
                    value={heightCmWorkoutSettings?.toString()}
                    keyboardType="numeric"
                    theme={{colors: {primary: '#3f7eb3'}}}
                    onChangeText={(u) => setHeightCmWorkoutSettings(u)}
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
                      value={heightFeetWorkoutSettings?.toString()}
                      keyboardType="numeric"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(u) => setHeightFeetWorkoutSettings(u)}
                      />
                    <FormHalfInput
                      placeholder={t("Inches")}
                      value={heightInchesWorkoutSettings?.toString()}
                      keyboardType="numeric"
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(u) => setHeightInchesWorkoutSettings(u)}
                    />
                  </FormHalfInputView> 
                  </InputField>
                </Spacer>
              </View>
            )}
     
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Age")}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder={t("Age")}
                  value={ageWorkoutSettings !== "" ? ageWorkoutSettings : publicSettingsLastInsertedRow?.age?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setAgeWorkoutSettings(u)}
                />
              </FormInputView>
            </InputField>
          </Spacer>
          {/* <WorkoutSettingsWeightIntervals >
            <WorkoutSettingsWeightIntervalsText>{t("Weight_Intervals")}</WorkoutSettingsWeightIntervalsText>
          </WorkoutSettingsWeightIntervals>
          <Spacer size="large">
            <InputField>
              <FormLabelView style={{justifyContent:"center"}}>
                <FormLabel style={{justifyContent:"center"}}><AsteriskTitle>*</AsteriskTitle> {t("Barbell")}:</FormLabel>
              </FormLabelView>
              <FormInputView> */}
              {/* <Select
                  onSelect={(index) => {
                    setSelectedBarbell(index);
                    }}
                  placeholder={t('Select_Interval')}
                  value={displayBarbellValue}
                  style={{marginBottom:10}}
                  status="newColor"
                >
                  {barbellData.map(renderBarbellOption)}
                </Select> */}
                {/* <FormInput
                  placeholder={t("Kg")}
                  value={barbelInput?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setBarbelInput(u)}
                />
              </FormInputView>  
            </InputField>
          </Spacer>
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Dumbell')}:</FormLabel>
              </FormLabelView>
              <FormInputView> */}
              {/* <Select
                  onSelect={(index) => {
                    setSelectedDumbell(index);
                    }}
                  placeholder={t('Select_Interval')}
                  value={displayDumbellValue}
                  style={{marginBottom:10}}
                  status="newColor"
                >
                  {dumbellData.map(renderDumbellOption)}
                </Select> */}
                {/* <FormInput
                  placeholder={t("Kg")}
                  value={dumbellInput?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setDumbellInput(u)}
                />
              </FormInputView>  
            </InputField>
          </Spacer>
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Bands')}:</FormLabel>
              </FormLabelView>
              <FormInputView> */}
              {/* <Select
                  onSelect={(index) => {
                    setSelectedBands(index);
                    }}
                  placeholder={t('Select_Interval')}
                  value={displayBandsValue}
                  style={{marginBottom:10}}
                  status="newColor"
                >
                  {bandsData.map(renderBandsOption)}
                </Select> */}
{/*                 
                <FormInput
                  placeholder={t("Kg")}
                  value={bandsInput?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setBandsInput(u)}
                />
              </FormInputView>  
            </InputField>
          </Spacer>
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('free_weight')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
              <FormInput
                  placeholder={t("Kg")}
                  value={FreWitInput?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setFreWitInput(u)}
                /> */}
              
              {/* <Select
                  onSelect={(index) => {
                    setSelectedFreWitData(index);
                    }}
                  placeholder={t('Select_Interval')}
                  value={displayFreWitValue}
                  style={{marginBottom:10}}
                  status="newColor"
                >
                  {FreWitData.map(renderFreWitOption)}
                </Select> */}
              {/* </FormInputView>  
            </InputField>
          </Spacer> */}
          
            <Spacer size="small">
            <WorkoutSettingsWeightIntervals >
              <WorkoutSettingsWeightIntervalsText>{t('Timer')}</WorkoutSettingsWeightIntervalsText>
            </WorkoutSettingsWeightIntervals>
          </Spacer>
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Compound')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder={t("Time_in_seconds")}
                  value={selectedCompound?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setSelectedCompound(u)}
                />
              </FormInputView>
            </InputField>
          </Spacer>
          <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Isolation")}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder={t("Time_in_seconds")}
                  value={selectedIsolation?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setSelectedIsolation(u)}
                />
              </FormInputView>
            </InputField>
            </Spacer>
            <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Cardio")}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder={t("Time_in_seconds")}
                  value={selectedCardio?.toString()}
                  keyboardType="numeric"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setSelectedCardio(u)}
                />
              </FormInputView>  
            </InputField>
            </Spacer>
            <Spacer size="large"></Spacer>
          <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:width-20}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={async () => {
                                let updateSubmitted = false;
                                
                                if (context?.stateUser?.userProfile?.role === "") {
                                  updateSubmitted = await handleUpdateSubmit();
                                }

                                if (updateSubmitted !== false || context?.stateUser?.userProfile?.role !== "") {
                                  await handlePublicSettingsSubmit();
                                }
                      }}>
                    <CalendarFullSizePressableButtonText >{t("Update_Settings")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  
                  {
                    (Object.keys(context.stateUser.userPublicSettings).length > 0)?(
                          
                        null
                    ):(
                        <FormElemeentSizeButtonView style={{width:width-20,marginTop:5}}> 
                          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} disabled={hideButtonClicks} onPress={hideButtonClicks ? null : handleSignout}>
                              <CalendarFullSizePressableButtonText >{t("Sign_Out")}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton> 
                        </FormElemeentSizeButtonView>
                    )
                  }
                  
                  
                </FormElemeentSizeButtonParentView>
            </Spacer>
          <Spacer size="large"></Spacer>
  </WhitePageContainer>
  );
};
