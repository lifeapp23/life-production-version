import React, { useState, useEffect,useRef,useLayoutEffect  } from "react";
import { 
  ScrollView,
  View, Pressable, RefreshControl, Alert,Text,TouchableOpacity,StyleSheet,Modal, Animated, Easing} from "react-native";
import { RadioButton } from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";
import CountryPicker from 'react-native-country-picker-modal';
import PhoneNumber from 'libphonenumber-js';
import {  SelectItem } from '@ui-kitten/components';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {AntDesign} from '@expo/vector-icons';
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
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
  FormLabelView,
  FormInputView,
  InfoInputView,
  FullSizeButtonView,
  FullButton,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  WhitePageContainer,
  BlackTitle,
  AsteriskTitle,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import axios from 'axios';
import {BASE_URL} from '@env';
import "./i18n";
import { useTranslation } from 'react-i18next';
import parseMax from 'libphonenumber-js/mobile'
import { Checkbox } from 'react-native-paper';
import { Spinner } from '@ui-kitten/components';
import { addEventListener } from "@react-native-community/netinfo";

export const RegisterScreen = ({ navigation }) => {
  // const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGender, setSelectedGender] =  useState("");
  const { t, i18n } = useTranslation();
  const [readConditionAndPrivacyCheckBox, setReadConditionAndPrivacyCheckBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);
    const [triainerConnected,setTriainerConnected] =  useState(false);
    const [isAllowForeignTrainersOn, setIsAllowForeignTrainersOn] = useState(false);
  
  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or any async operation
    setTimeout(() => {
      console.log('Data refreshed!');
      setRefreshing(false); // Stop the refreshing animation
    }, 2000); // Simulated delay
  };
  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      //////console.log("Connection type--", state.type);
      //////console.log("Is connected?---", state.isConnected);
      setTriainerConnected(state.isConnected);
      AsyncStorage.getItem("sanctum_token")
        .then((res) => {
          ////console.log('tokeeen:',res);
              AsyncStorage.getItem("currentUser").then((user) => {
            
                  const storedUser = JSON.parse(user);
            
                  
                    ////console.log("Connection type--", state.type);
                    ////console.log("Is connected?---", state.isConnected);
                    ////console.log('---------------now online--------')
  
                      axios.get(`https://www.elementdevelops.com/api/Admin-Settings-App-Get-Data-From-Database`, {
                        headers: {
                          'Authorization': `Bearer ${res}`,
                          'Content-Type': 'application/json',
                        },
                        })
                        .then(response => {
                          // Handle successful response
                          if(Object.keys(response?.data["AdminSettingsAppRow"]).length > 0){
                            // //console.log(' Object.keys AdminSettingsAppRow length > 0::,',Object.keys(response?.data["AdminSettingsAppRow"]).length > 0);
                            //console.log('AdminSettingsAppRow::,',response?.data["AdminSettingsAppRow"]);
                            //console.log('AlFoTr == "1"::,',response?.data["AdminSettingsAppRow"]?.AlFoTr == "1");
  
                            // setAdminSettingsAppRowConst(response?.data["AdminSettingsAppRow"]);
                            // setAdminSettingsData(response?.data["AdminSettingsAppRow"]);
                            // setAdminCommissionNumber(response?.data["AdminSettingsAppRow"]?.admCom);
                            setIsAllowForeignTrainersOn((response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false);
                          }
                        })
                        .catch(error => {
                          // Handle error
                          ////console.log('Error fetching Meals:', error);
                          // setLoadingPageInfo(false);
            
                        });
  
                  
                })
              });
    });
    
    // Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
  };
  
  }, [refreshing]);
  console.log('isAllowForeignTrainersOn',isAllowForeignTrainersOn);
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
  const getFormattedDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const currentDate = new Date();
  const threeYearsAgo = new Date();
  threeYearsAgo.setFullYear(currentDate.getFullYear() - 3);

  const [date, setDate] = useState(threeYearsAgo);  // Initialize the date to the max date
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = React.useState('Trainee');
  const [country, setCountry] = useState("United States");
  const [countryCode, setCountryCode] = useState('US');
  const [phoneCountryCallingCode, setPhoneCountryCallingCode] = useState("1");
  const [phone, setPhone] = useState(`+${phoneCountryCallingCode}`);
  const [validMobile, setValidMobile] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  useEffect(() => {
    
    //console.log("isEmailValid",isEmailValid);

    // setPhone(`+${phoneCountryCallingCode}`);
    const number = PhoneNumber(phone, countryCode);
    if (number?.isValid() && (parseMax(phone)?.getType() === "MOBILE")) {
      // return true; // Phone number is valid.
      //console.log("Phone number is valid",phone);
      //console.log("Phone parseMax getType()()",parseMax(phone)?.getType() === "MOBILE");
      
      setValidMobile(true);

    } else {
      // return false; // Phone number is not valid.
      //console.log("Phone number is not valid",phone);
      //console.log("Phone getType()()",number?.getType());
      setValidMobile(false);

    }

  }, [phone, countryCode,isEmailValid]);
  // //console.log("validMobile === false",validMobile === false);

  const [showPhoneCountryPicker, setShowPhoneCountryPicker] = useState(false);
  //console.log("country top ==> ", country);
  const handlePhoneChange = (p) => {
    const sanitizedPhone = p.startsWith(`+${phoneCountryCallingCode}`)
      ? p
      : `+${phoneCountryCallingCode}${p.replace(/^\+?(\d+)/, '')}`;
      
    setPhone(sanitizedPhone);
  };
  // State variable to store the array of selected certificates and input values
  // const [certificatesInfo, setCertificatesInfo] = useState([]);
  

////console.log('date',date);
  ////console.log('getFormattedDate()',getFormattedDate());

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
    ////console.log('certificatesData[newCertificatesSelectsValue[i]]',certificatesData[newCertificatesSelectsValue[i]]);
    ////console.log('certificatesData[newCertificatesSelectsValue[i]]',certificatesData[newCertificatesSelectsValue[i]] == "Other");

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
    ////console.log('certificatesInfo',certificatesInfo);
    //////console.log('certificatesInfo.length',certificatesInfo.length);
    if (certificatesInfo.length === 0){
      //////console.log('000');
    }else{
      //////console.log('ffff');
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
  ////console.log('socialMediaRefSelects removeSocialMediaInputbefore',newSelectedSocialMedia);
  ////console.log('socialMediaRefInputs removeSocialMediaInputbefore',newSocialMediaTextValue);

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
////console.log('newSelects removeSocialMediaInput after',newSelects);  
////console.log('newInputs removeSocialMediaInput after',newInputs);
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
  //   ////console.log('selectedSocialMediaInfo insdie',selectedSocialMediaInfo);

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

useEffect (() => {
  
  

  ////console.log('selectedSocialMedia',selectedSocialMedia);
  ////console.log('socialMediaTextValue',socialMediaTextValue);
  ////console.log('newSelectedSocialMedia',newSelectedSocialMedia);
  ////console.log('newSocialMediaTextValue',newSocialMediaTextValue);

  
////console.log(selectedSocialMediaInfo);
////console.log('selectedSocialMediaInfo.length',selectedSocialMediaInfo.length);
if (selectedSocialMediaInfo.length === 0){
  ////console.log('selectedSocialMediaInfo000');
}else{
  ////console.log('selectedSocialMediaInfoffff');
}
}, [selectedSocialMediaInfo,newSelectedSocialMedia]);
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
////console.log('convertedDate',convertedDate);
// ////console.log('userName,firstName,lastName,email,password,repeatedPassword,phone,selectedGender,convertedDate,country,certificatesInfo,selectedSocialMediaInfo,type');
// ////console.log(userName,firstName,lastName,email,password,repeatedPassword,phone,displayGenderValue,convertedDate,country,certificatesInfo,selectedSocialMediaInfo,checked);

/////////////// End SocialMedia functionalty///////////

// const handleSubmit = async () => {
  
//   if (checked === 'Trainer'){
//     if (userName === '' || firstName === '' || lastName === '' || email === '' || password === '' || repeatedPassword === '' || phone === '' || displayGenderValue === undefined || convertedDate === '' || country === '' || certificatesInfo.length === 0 ||selectedSocialMediaInfo.length === 0){
//       Alert.alert('All Trainer fields are required');
//     }else {
//       if (password !== repeatedPassword) {
//         // Passwords don't match, show an error to the user
//         Alert.alert('Passwords do not match');
//         return;
//       }else{
//         // await axios.post('http://localhost:8001/api/signup',{userName:userName,firstName:firstName,lastName:lastName,email:email,password:password,repeatedPassword:repeatedPassword,phone:phone,gender:displayGenderValue,date:convertedDate,country:country,certificates:certificatesInfo,socialMedia:selectedSocialMediaInfo});
//       alert("Trainer Sign up Successful");
//       }
      
//     }
//   }else{
//     if (userName === '' || firstName === '' || lastName === '' || email === '' || password === '' || repeatedPassword === '' || phone === '' || displayGenderValue === undefined || convertedDate === '' || country === ''){
//       Alert.alert('All Trainee fields are required');
//         return;
//     }else {
//       if (password !== repeatedPassword) {
//         // Passwords don't match, show an error to the user
//         Alert.alert('Passwords do not match');
//         return;
//       }else{
//       // await axios.post('http://localhost:8001/api/signup',{userName:userName,firstName:firstName,lastName:lastName,email:email,password:password,repeatedPassword:repeatedPassword,phone:phone,gender:displayGenderValue,date:convertedDate,country:country});
//       alert("Trainee Sign up Successful");
//       }
//     }
//   }
// };  
// const [uNameError, setUNameError] = useState('');
const [emailError, setEmailError] = useState('');
const [crtfctError, setCrtfctError] = useState('');
const [crtfctDetails, setCrtfctDetails] = useState('');
const [socialMediaError, setSocialMediaError] = useState('');
const [socialMediaDetails, setSocialMediaDetails] = useState('');


const [passwordError, setPasswordError] = useState('');
const handleSubmit = async () => {
  
  
  if (!email || !password || !firstName || !lastName || !phone || !displayGenderValue || !convertedDate || !country) {
    Alert.alert(`${t('Please_fill_mandatory_fields')}`);
    return;
  }
if(checked === 'Trainer' && certificatesInfo.length == 0 && selectedSocialMediaInfo.length == 0){
  Alert.alert(`${t('You_must_add_at_least_one_certififcate_SocialMedia_Account')}`);
  return;
}

if(isEmailValid === false){
  Alert.alert(`${t('Please_enter_valid_email')}`);
  return;
}

// if(checked === 'Trainer' && selectedSocialMediaInfo.length == 0){
//   Alert.alert('You must add at least one SocialMedia Account');
//   return;
// }
  if (password !== repeatedPassword) {
    Alert.alert(`${t('Passwords_do_not_match')}`);
    return;
  }
  if(validMobile === false){
    Alert.alert(`${t('Please_enter_valid_mobile_number')}`);
    return;
  }
  if (!readConditionAndPrivacyCheckBox) {
    Alert.alert("",`${t('Please_confirm_that_you_agree_on_privacy_policy_and_terms_and_condtions')}`);
    return;
  }
  if(checked === 'Trainer' && isAllowForeignTrainersOn == false && country != "Egypt"){
  Alert.alert("",`${t('accept_trainers_just_from_egypt')}`);
  return;
}
  const is_approved = checked === 'Trainee' ? 'yes' : 'no';
  let userData={};
  if (checked === 'Trainee'){
    userData = {
      // uName: userName,
      fName: firstName,
      lName: lastName,
      email: email,
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
      // uName: userName,
      fName: firstName,
      lName: lastName,
      email: email,
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
      setLoading(true);
      setShowSuccess(false); // Reset success state

//console.log('userData',userData);
  try {
    const response = await axios.post(`https://www.elementdevelops.com/api/register`, userData);
    ////console.log('response.data:', response?.data);
    setLoading(false);
    setShowSuccess(true); // Show success message and animation
    setTimeout(() => {
      setShowSuccess(false);
     
    }, 2000); // 2 seconds delay
    setTimeout(() => {

    // Alert.alert(`${t(response?.data?.message)}`);
    
    navigation.navigate('Login');
  }, 2500); // 2.5 seconds delay

    // Handle success, e.g., show a success message to the user
  } catch (error) {
    setLoading(false);
    setShowSuccess(false); // Reset success state

    //setEmaillError setPasswordError
    const { errors, message } = error?.response?.data;
    const validationErrors = error?.response?.data?.errors;

    if (message) {
      ////console.log('Error Message:', message);
      // Handle error message, e.g., show an alert
    } else if (errors) {
      // if (error?.response?.data?.errors?.uName){
      //   setUNameError(error?.response?.data?.errors?.uName[0]);
      // }else{
      //   setUNameError('');
      // }
      const errorMessage = error?.response?.data?.errors?.crtfct?.message;
      const errorDetails = error?.response?.data?.errors?.crtfct?.details;
    
      if (errorMessage && errorDetails) {
        console.log('error?.response?.data?.errors?.crtfct[0]',error?.response?.data?.errors?.crtfct);

        setCrtfctError(t(errorMessage)); // Translate only the constant part
        setCrtfctDetails(errorDetails); // Keep details as-is
      } else {
        setCrtfctError('');
        setCrtfctDetails('');
      }
       
      const socMedErrorMessage = error?.response?.data?.errors?.socMed?.message;
      const socMedErrorDetails = error?.response?.data?.errors?.socMed?.details;
    
      if (socMedErrorMessage && socMedErrorDetails) {
        console.log('error?.response?.data?.errors?.socMed[0]',error?.response?.data?.errors?.socMed);

        setSocialMediaError(t(socMedErrorMessage)); // Translate only the constant part
        setSocialMediaDetails(socMedErrorDetails); // Keep details as-is
      } else {
        setSocialMediaError('');
        setSocialMediaDetails('');
      }

      if (error?.response?.data?.errors?.email){
        setEmailError(error?.response?.data?.errors?.email[0]);
      }else{
        setEmailError('');
      }
      if(error?.response?.data?.errors?.password){
        setPasswordError(error?.response?.data?.errors?.password[0]);
      }else{
        setPasswordError('');
      }
    } else {
      Alert.alert('Unknown Error:', error?.message);
      ////console.log('Unknown Error:', error);
      // Handle other unexpected errors
    }
  }
  // setTimeout(() => {
  //   setShowSuccess(false); // Reset success state

  //   setLoading(false);

  // }, 5000); // 2 seconds delay
};

// useEffect(() => {
//   ////console.log(uName:userName,fName:firstName,lName:lastName,email:email,password:password,password_confirmation:repeatedPassword,phone:phone,gender:displayGenderValue,date:convertedDate,country:country,role:checked);
// }, [newCertificatesInfo ]);
//certificatesInfo,selectedSocialMediaInfo
// Calculate the date 3 years ago from today

  return (
    <WhitePageContainer>
    <ScrollView refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
      <TitleView >
        <BlackTitle >Life</BlackTitle>
      </TitleView>
      {/* <Modal
            animationType="slide"
            transparent={true}
            visible={loading}

            >
            
            <View style={styles.modalContainer}>
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>Loading...</Text>
                <Spinner size="large" color="#fff" />
              </View>
            </View>
      </Modal> */}
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
                      <Text style={styles.successText}>{t('Account_created_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
        {/* <InputField>
        <FormLabelView>
          <FormLabel>{t('Username')}: <AsteriskTitle>*</AsteriskTitle></FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t('Username')}
            value={userName}
            keyboardType="default"
            autoCapitalize="none"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setUserName(u)}
          />  
          {uNameError && (<Text style={{color:'red',fontSize:14}}>{uNameError}</Text>)}
        </FormInputView>
        </InputField> */}
      <Spacer size="large">
        <InputField >
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('E_mail')}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t('E_mail')}
            value={email}
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => {
              setEmail(u);
              setIsEmailValid(validateEmail(u));
            }}
          />
          {emailError && (<Text style={{color:'red',fontSize:14}}>{emailError}</Text>)}
        </FormInputView>
        </InputField>
      </Spacer>
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
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("First_Name")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("First_Name")}
              value={firstName}
              keyboardType="default"
              autoCapitalize="none"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setFirstName(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="large">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Last_Name")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Last_Name")}
              value={lastName}
              keyboardType="default"
              autoCapitalize="none"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setLastName(u)}
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
              onSelect={nextDate => setDate(nextDate)}
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
              //console.log("COUNTERY ==> ", country);
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
    {(checked === 'Trainer') ? (
      <View>
        <Spacer size="large">
          <InfoFieldParent>
            <ScrollView>
              <SelectorTextField>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Certifications')}:</FormLabel>
              </SelectorTextField>
              {certificatesInputsItems}
              {crtfctError && (<Text style={{color:'red',fontSize:14,marginLeft:10,marginRight:10}}>{crtfctError}: {crtfctDetails}</Text>)}

            </ScrollView>
          </InfoFieldParent>
          </Spacer>
          
          <Spacer size="large">
          <InfoFieldParent>
            <ScrollView>
              <SelectorTextField>
                <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Social_Media_Presence')}:</FormLabel>
              </SelectorTextField>
              {socialMediaInputs}
              {socialMediaError && (<Text style={{color:'red',fontSize:14,marginLeft:10,marginRight:10}}>{socialMediaError}: {socialMediaDetails}</Text>)}
               
            </ScrollView>
            </InfoFieldParent>
          </Spacer>
      </View>
    ):( null)}

    <Spacer size="large">
        <InputField style={{flexWrap: 'wrap'}}><AsteriskTitle>*</AsteriskTitle>
        <Checkbox
          status={readConditionAndPrivacyCheckBox ? 'checked' : 'unchecked'}
          onPress={() => {
            setReadConditionAndPrivacyCheckBox(!readConditionAndPrivacyCheckBox);
            
          }}
          color="black"
          uncheckedColor="black"
        />
        <Text style={{fontSize:15,color:'#000',fontFamily:'OpenSans_400Regular',}}>{t('I_have_read_and_accept')}</Text><TouchableOpacity onPress={() => navigation.navigate("TermsAndConditionsPage")}><Text style={{color:"#1a54a9"}}> {t('the_Terms_Conditions')}</Text></TouchableOpacity><Text style={{fontSize:15,color:'#000',fontFamily:'OpenSans_400Regular',}}> {t('and')}</Text><TouchableOpacity onPress={() => navigation.navigate("PrivacyAndPolicyPage")}><Text style={{color:"#1a54a9"}}> {t('Privacy_Policy')}</Text></TouchableOpacity>
        </InputField>
    </Spacer>
      
   
    <Spacer size="large">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
    onPress={() => handleSubmit()}>
          <CalendarFullSizePressableButtonText >{t('Register')}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView>
    </Spacer>
    {/* <Spacer size="medium">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
    onPress={()=>navigation.goBack()}>
          <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView>
    </Spacer> */}
    <Spacer size="large"></Spacer>
    <Spacer size="large"></Spacer>

    </ScrollView>
    
    </WhitePageContainer>
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