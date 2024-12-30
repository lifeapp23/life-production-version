import React, { useState, useRef,useEffect} from 'react';
import {Dimensions,Switch,ScrollView,Alert, Animated, Easing, Modal, StyleSheet, Pressable, View,TextInput,Text} from 'react-native';
import { SelectItem } from '@ui-kitten/components';
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { PlansCalendarScreen } from "./TrainerManageMyProfileCalendar";
import {useNetInfo} from "@react-native-community/netinfo";
import { addEventListener } from "@react-native-community/netinfo";
import { insertTrainerManageMyProfile,fetchTrainerManageMyProfile} from "../../../../database/trainer_manage_my_profile";
import "./i18n";
import { useTranslation } from 'react-i18next';
import { StackActions } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
const { width } = Dimensions.get('window');

import { Spinner } from '@ui-kitten/components';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

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
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
    ViewOverlay,
    FormLabelDateRowView,
    FormLabelDateRowViewText,
    InfoFieldParent,
    InfoField,
    InfoFieldColumn,
    SelectInfo,
    WriteInfo,
    InfoSelector,
    WriteInfoChild,
    InfoInput,
    SelectorTextField,
    InfoInputView,
    PageMainImage,
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
import {AntDesign} from '@expo/vector-icons';

const newProfileImageImgDir = FileSystem.documentDirectory + 'images/';

const ensureNewProfileImageImgDirExists = async () => {
const dirInfo = await FileSystem.getInfoAsync(newProfileImageImgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newProfileImageImgDir, { intermediates: true });
    }
}; 
export const ManageMyProfileScreen = ({navigation}) => {
    const [aboutMeAddEntry, setAboutMeAddEntry] = useState("");  
    const [photoProfileImage, setPhotoProfileImage] = useState(null);
    const [photoProfileImageComeFromDB, setPhotoProfileImageComeFromDB] = useState(null);
    const [photoProfileImageComeFromDBBeforeEdit, setPhotoProfileImageComeFromDBBeforeEdit] = useState(null);

    const [refundPolicySentData, setRefundPolicySentData] = useState("");  
    const [acceptSubscriptionsSentData, setAcceptSubscriptionsSentData] = useState("");  
    const [subscriptionsStartDateSentData, setSubscriptionsStartDateSentData] = useState("");  
    const [subscriptionsEndDateSentData, setSubscriptionsEndDateSentData] = useState("");  
    const [modalRefundPolicyVisible,setModalRefundPolicyVisible] = useState('');
    const [modalCapacityVisible,setModalCapacityVisible] = useState('');
    const [capacityNumber,setCapacityNumber]=useState();
    const [isAcceptSubscriptionsOn, setIsAcceptSubscriptionsOn] = useState(false);
    const [isAcceptSubscriptionsOnForComparsion, setIsAcceptSubscriptionsOnForComparsion] = useState(true);

    const [noRefund, setNoRefund] = useState(false);
    const [approvedStatus, setApprovedStatus] = useState('approved');
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [userId, setUserId] = useState("");  
    const [userToken, setUserToken] = useState("");  
    const netInfo = useNetInfo();
    const speKey = userId + '.' + new Date().getTime();
    const { t, i18n } = useTranslation();
    const [trainerTraineesCount, setTrainerTraineesCount] = useState("");  
    const [loadingPageInfo, setLoadingPageInfo] = useState(true);
    const [hasImagesChangedResultToButtonState, setHasImagesChangedResultToButtonState] = useState(false);
    const [hasCrtfctChangedResultToButtonState, setHasCrtfctChangedResultToButtonState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const checkmarkAnimation = useRef(new Animated.Value(0)).current;
    const [updateShowSuccess, setUpdateShowSuccess] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
      const toggleInfo = () => {
        setShowInfo(!showInfo);
      };
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
  
//   useEffect (() => {
//    // Subscribe
// const unsubscribe = addEventListener(state => {
//   //////console.log("Connection type", state.type);
//   //////console.log("Is connected?", state.isConnected);
// // if(state.isConnected){
// //   axios.get('https://3a5d-62-114-9-225.ngrok-free.app/api/get-profile', {
// //     headers: {
// //       'Authorization': `Bearer ${userToken}`,
// //       'Content-Type': 'application/json',
// //     },
// //     })
// //     .then(response => {
// //       // Handle successful response
// //       //////console.log('Profile data:', response.data);
// //     })
// //     .catch(error => {
// //       // Handle error
// //       ////console.log('Error fetching profile:', error);
// //     });
// // }else{

// // }
  

// });

// // Unsubscribe
// unsubscribe();
//   }, [addEventListener]);
    const { showActionSheetWithOptions } = useActionSheet();
    const onPressProfileImageMedia = () => { 
      const cancelButtonIndex = -1;
      const options = [`${t('Upload_image')}`, `${t('Take_photo')}`];
      showActionSheetWithOptions({
          options,
          }, (selectedIndex) => {
          switch (selectedIndex) {
          case 0:
          pickImageAddEntry();
          break;
          case 1:
          // Take photo
          takeProfileImagePhoto();
          break;
          case cancelButtonIndex:
          // Canceled
          }});
  
  };
    // Select image from mobile
    const pickImageAddEntry = async () => {
      // No permissions request is necessary for launching the image library
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
        });
    
        if (!result.canceled) {
        // Handle the selected image URI
        //////console.log('Selected Image URI:', result.assets[0].uri);
        setPhotoProfileImage(result.assets[0].uri);
        // Implement your logic to upload the image
        }
      } catch (error) {
      ////console.log('Error picking image:', error);
      }
    };
    const takeProfileImagePhoto = async () => {
      try {
      const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
      });
  
        if (!result.canceled) {
        // Handle the taken photo URI
        //////console.log('Taken Photo URI:', result.assets[0].uri);
        setPhotoProfileImage(result.assets[0].uri);
        
        }
      } catch (error) {
      ////console.log('Error taking photo:', error);
      }
      };
    const saveNewProfileImageImage = async (uri) => {
      await ensureNewProfileImageImgDirExists();
    
      // Extract file extension from the URI
      const fileExtension = uri.split('.').pop() || 'jpeg';
    
      const filename = new Date().getTime() + `.${fileExtension}`;
      const dest = newProfileImageImgDir + filename;
    
      await FileSystem.copyAsync({ from: uri, to: dest });
      return dest;
    };

    const ourPersonalTrainers= [
        {id:1,name:"Mohamed Al-Durrah",country:"Egypt",gender:'Him',ratings:"4.4",trainees:"6",price:"150",currency:"EGP",discount:"10%",status:"open",certificates:[{id:1,name:"ISSA",refernce_id:'1234'},{id:2,name:"RGA",refernce_id:'123456'}],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com",tiktok:"https://tiktok.com"},about:"Mohamed al Duurah was reaised in Egypt, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
        {id:2,name:"Sarah Kenndy",country:"United Stated",gender:'Her',ratings:"1",trainees:"7",price:"100",currency:"USD",discount:"7.5%",status:"closed",certificates:[{id:1,name:"RGA",refernce_id:'1234'},{id:2,name:"ISSA",refernce_id:'12345'},{id:3,name:"CfA",refernce_id:'12356'},{id:4,name:'CNA',refernce_id:'12345678'}],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Sarah Kenndy was reaised in United States, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
        {id:3,name:"Mario Elves",country:"Ireland",gender:'Him',ratings:"3.5",trainees:"10",price:"10",currency:"USD",discount:"0",status:"open",certificates:[{id:1,name:"RGA",refernce_id:'1234'},{id:2,name:"ISSA",refernce_id:'12345'},{id:3,name:"CfA",refernce_id:'12356'},],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3","Arnold Pro4"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Mario Elves was reaised in Ireland, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
        {id:4,name:"Moataz Fahmy",country:"Germany",gender:'Him',ratings:"5",trainees:"9",price:"30",currency:"USD",discount:"15%",status:"closed",certificates:[{id:1,name:"RGA",refernce_id:'1234'}],achievments:["Arnold Pro1"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Moataz Fahmy was reaised in Germany, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
        {id:5,name:"Peter Becker",country:"United Kingdom",gender:'Him',ratings:"2.3",trainees:"5",price:"80",currency:"USD",status:"closed",discount:"0",certificates:[{id:1,name:"RGA",refernce_id:'1234'},{id:2,name:"ISSA",refernce_id:'12345'}],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Peter Becker was reaised in United Kingdom, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
    ];
    const selectedTrainerName = "Mohamed Al-Durrah";
    const trainer_row = ourPersonalTrainers.find((trainer_row) => trainer_row.name === selectedTrainerName);
    
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

  
  const [certificatesBeforeEditing,setCertificatesBeforeEditing] =  useState("");

  const [certificatesNames,setCertificatesNames] =  useState("");
  
  const [selectedCertificates,setSelectedCertificates] =  useState("");

  // this will be attached with each input onChangeText
  const [certificatesTextValue, setCertificatesTextValue] = useState(''); 
  // our number of inputs, we can add the length or decrease
  const [certificatesNumInputs, setCertificatesNumInputs] = useState(2);
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
  'Twitter',
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
const [socialMediaNumInputs, setSocialMediaNumInputs] = useState(2)
// all our SELECT fields are tracked with this array
const socialMediaRefSelects = useRef([selectedSocialMedia]);
// all our input fields are tracked with this array
const socialMediaRefInputs = useRef([socialMediaTextValue]);

const setSocialMediaSelectValue = (index,value)=>{
  // first we are storing Select value to refInputs arrary to track them
  // const socialMediaSelects = socialMediaRefSelects.current;
  // socialMediaSelects[index]=value;
  // we are also setting the text value to the inputs field onChangeText
  const newSocialMediaSelected = [...newSelectedSocialMedia];
  newSocialMediaSelected[index] = value;
  // setSelectedSocialMedia(value);
  
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
const newNameInputs = newSocialMediaNameTextValue.filter((_, index) => index !== i);

// Update the state with the new arrays
// socialMediaRefSelects.current = newSelects;
// socialMediaRefInputs.current = newInputs;

setNewSelectedSocialMedia(newSelects);
setNewSocialMediaTextValue(newInputs);
setNewCertificatesNameTextValue(newNameInputs);

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
  
  

  //////console.log('selectedSocialMedia',selectedSocialMedia);
  //////console.log('socialMediaTextValue',socialMediaTextValue);
  //////console.log('newSelectedSocialMedia',newSelectedSocialMedia);
  //////console.log('newSocialMediaTextValue',newSocialMediaTextValue);
  //////console.log('refundPolicySentData',refundPolicySentData);

  
//////console.log(selectedSocialMediaInfo);
//////console.log('selectedSocialMediaInfo.length',selectedSocialMediaInfo.length);
if (selectedSocialMediaInfo.length === 0){
  //////console.log('selectedSocialMediaInfo000');
}else{
  //////console.log('selectedSocialMediaInfoffff');
}
}, [selectedSocialMediaInfo,newSelectedSocialMedia]);
/////////////// End SocialMedia functionalty///////////
const [triainerConnected,setTriainerConnected] =  useState(false);

//************************************************************** */
useFocusEffect(
  React.useCallback(() => {
  AsyncStorage.getItem("sanctum_token")
  .then((res) => {
    //////console.log('tokeeen:',res);
    setUserToken(res);
  AsyncStorage.getItem("currentUser").then((user) => {

      const storedUser = JSON.parse(user);
      setUserId(storedUser.id);
      setLoadingPageInfo(true);

      const startTime = Date.now(); // Capture the start time
      //console.log('Page opened, start time:', startTime);
      const unsubscribe = addEventListener(state => {
        //////console.log("Connection type--", state.type);
        //////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        //////console.log('---------------now online--------')
        axios.get(`https://www.elementdevelops.com/api/get-profile?userId=${storedUser.id}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            const endTime = Date.now(); // Capture the time when the data is received
            const timeDifference = (endTime - startTime) / 1000; // Calculate the time difference in seconds
            //console.log('Data fetched at:', endTime);
            //console.log(`Time taken to fetch data: ${timeDifference} seconds`);

            // Handle successful response
            //console.log("response.data['$profile']:", response.data['$profile']);
            //console.log("response.data['$TrainerSubscriptionsRowCount']:", response.data['$TrainerSubscriptionsRowCount']);

            //console.log('--------------------------------:');
            let TraineesCountLet = response.data['$TrainerSubscriptionsRowCount'];
            setTrainerTraineesCount(TraineesCountLet);
            const { userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,noRfn,aprovd,aprstu,isSync} = response.data['$profile'];
            const aboutNew = about != null ? about : '';
            const crtfctNew = crtfct != null ? crtfct : '';
            const socMedNew = socMed != null ? socMed : '';
            const imagesNew = images != null ? images : '';
            // const rfnPlcNew = rfnPlc != null ? rfnPlc : '';
            const capctyNew = capcty != null ? capcty : '';
            const acpSubNew = acpSub != null ? acpSub : '';
            // const strDatNew = strDat != null ? strDat : '';
            // const endDatNew = endDat != null ? endDat : '';
            // const noRfnNew = noRfn != null ? noRfn : '';
            const aprovdNew = aprovd != null ? aprovd : '';
            const aprstuNew =  aprstu != null ?  aprstu : '';

           
            const isSyncNew = isSync != null ? isSync : '';
            // const start = strDatNew;
            // const end = endDatNew;

            const startTimeBeforeAboutM = Date.now(); // Capture the start time
            //console.log('Page opened, startTimeBeforeAboutM:', startTimeBeforeAboutM);
            setAboutMeAddEntry(aboutNew);
            setPhotoProfileImageComeFromDB(imagesNew);
            setPhotoProfileImageComeFromDBBeforeEdit(imagesNew);
            const startTimeAferAboutM = Date.now(); // Capture the start time
            //console.log('Page opened, startTimeAferAboutM:', startTimeAferAboutM);
            const timeDifferenceferAboutM  = (startTimeAferAboutM - startTimeBeforeAboutM) / 1000; // Calculate the time difference in seconds
            //console.log(`Time taken timeDifferenceferAboutM ${timeDifferenceferAboutM} seconds`);

            //console.log('--------------------------------:');

            const startTimeBeforesocMedArray= Date.now(); // Capture the start time
            //console.log('Page opened, startTimeBeforesocMedArray:', startTimeBeforesocMedArray);
            // Create a lookup map to avoid calling indexOf repeatedly
            const socialMediaDataLookup = socialMediaData.reduce((map, item, idx) => {
              map[item] = idx;
              return map;
            }, {});
            // Parse the JSON SocialMedia string into an array of objects
            const socMedArray = JSON.parse(socMedNew);
            const socMedArrayLength = socMedArray.length;
            setSocialMediaNumInputs(socMedArrayLength)
            //////console.log("Length of socMedArray:", socMedArrayLength);
            // Iterate over each object in the array
            let updatedSocialMediaTextValue = [...newSocialMediaTextValue]; // Clone state outside loop
            let updatedSelectedSocialMedia = [...newSelectedSocialMedia]; // Clone state outside loop
            let updatedSocialMediaNameTextValue = [...newSocialMediaNameTextValue]; // Clone state outside loop

            socMedArray.forEach((obj, index) => {
              for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                  const value = obj[key];

                  if (key !== "Other") {
                    // Use lookup map for SocialMediaDataIndex
                    const SocialMediaDataIndex = socialMediaDataLookup[key] !== undefined ? socialMediaDataLookup[key] : -1;
                    updatedSocialMediaTextValue[index] = value;
                    updatedSelectedSocialMedia[index] = SocialMediaDataIndex;
                  } else {
                    // Ensure JSON is parsed only when needed
                    let SocialMediaNameAndNumber = JSON.parse(value);
                    let SocialMediaObjectKey = Object.keys(SocialMediaNameAndNumber)[0];
                    let SocialMediaObjectValue = Object.values(SocialMediaNameAndNumber)[0];

                    updatedSocialMediaTextValue[index] = SocialMediaObjectKey;
                    updatedSocialMediaNameTextValue[index] = SocialMediaObjectValue;

                    const SocialMediaDataIndex = socialMediaDataLookup[key] !== undefined ? socialMediaDataLookup[key] : -1;
                    updatedSelectedSocialMedia[index] = SocialMediaDataIndex;
                  }
                }
              }
            });

          // Update states once after the loop
          setNewSocialMediaTextValue(updatedSocialMediaTextValue);
          setNewSelectedSocialMedia(updatedSelectedSocialMedia);
          setNewSocialMediaNameTextValue(updatedSocialMediaNameTextValue);

            const startTimeAfersocMedArray = Date.now(); // Capture the start time
            //console.log('Page opened, startTimeAfersocMedArray:', startTimeAfersocMedArray);
            const timeDifferencefersocMedArray  = (startTimeAfersocMedArray - startTimeBeforesocMedArray) / 1000; // Calculate the time difference in seconds
            //console.log(`Time taken timeDifferencefersocMedArray ${timeDifferencefersocMedArray} seconds`);
            //console.log('--------------------------------:');

            //console.log('--------------------------------:');

                const startTimeBeforescrtfctArray = Date.now(); // Capture the start time
                //console.log('Page opened, startTimeBeforescrtfctArray:', startTimeBeforescrtfctArray);

                // Parse the JSON SocialMedia string into an array of objects
                const crtfctArray = JSON.parse(crtfctNew);
                const crtfctArrayLength = crtfctArray.length;
                setCertificatesNumInputs(crtfctArrayLength);
                setCertificatesBeforeEditing(crtfctNew);

                // Create lookup map (if necessary, for efficiency)
                const certificatesDataLookup = certificatesData.reduce((map, item, idx) => {
                  map[item] = idx;
                  return map;
                }, {});

                // Clone states outside of the loop to avoid triggering re-renders in each iteration
                let updatedCertificatesTextValue = [...newCertificatesTextValue];
                let updatedCertificatesSelectsValue = [...newCertificatesSelectsValue];
                let updatedCertificatesNameTextValue = [...newCertificatesNameTextValue];

                // Iterate over each object in the array
                crtfctArray.forEach((obj, index) => {
                  for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                      const value = obj[key];

                      if (key !== "Other") {
                        // Use lookup map for certificatesDataIndex
                        const certificatesDataIndex = certificatesDataLookup[key] !== undefined ? certificatesDataLookup[key] : -1;
                        
                        // Update values
                        updatedCertificatesTextValue[index] = value;
                        updatedCertificatesSelectsValue[index] = certificatesDataIndex;

                      } else {
                        // Parse JSON only when needed
                        let crtifictNameAndNumber = JSON.parse(value);
                        let objectKey = Object.keys(crtifictNameAndNumber)[0];
                        let objectValue = Object.values(crtifictNameAndNumber)[0];

                        // Update values for "Other"
                        updatedCertificatesTextValue[index] = objectKey;
                        updatedCertificatesNameTextValue[index] = objectValue;

                        const certificatesDataIndex = certificatesDataLookup[key] !== undefined ? certificatesDataLookup[key] : -1;
                        updatedCertificatesSelectsValue[index] = certificatesDataIndex;
                      }
                    }
                  }
                });

                // Update states once after the loop
                setNewCertificatesTextValue(updatedCertificatesTextValue);
                setNewCertificatesSelectsValue(updatedCertificatesSelectsValue);
                setNewCertificatesNameTextValue(updatedCertificatesNameTextValue);

                const startTimeAfercrtfctArray = Date.now(); // Capture the end time
                //console.log('Page opened, startTimeAfercrtfctArray:', startTimeAfercrtfctArray);
                const timeDifferenceferscrtfctArray = (startTimeAfercrtfctArray - startTimeBeforescrtfctArray) / 1000; // Calculate the time difference in seconds
                //console.log(`Time taken timeDifferenceferscrtfctArray ${timeDifferenceferscrtfctArray} seconds`);
                //console.log('--------------------------------:');

              // setRefundPolicySentData(rfnPlcNew);
              setCapacityNumber(capctyNew);
              // setNoRefund(noRfnNew);
              setApprovedStatus(aprstuNew);
              if(TraineesCountLet == capctyNew){
                setIsAcceptSubscriptionsOn(acpSubNew == 'yes' || acpSubNew == true || acpSubNew == 'true' ? true : false);
                setIsAcceptSubscriptionsOnForComparsion(false)
              }else{
                setIsAcceptSubscriptionsOn(acpSubNew == 'yes' || acpSubNew == true || acpSubNew == 'true' ? true : false);

              }
              // setSelectedDates({start,end});
              setLoadingPageInfo(false);

            // const dataComeFromDBAfterEdits={
            //   userId : userId,
            //   speKey : speKey,
            //   about : aboutNew,
            //   crtfct : crtfctNew,
            //   socMed : socMedNew,
            //   images : imagesNew,
            //   rfnPlc : rfnPlcNew,
            //   capcty : capctyNew,
            //   acpSub : acpSubNew,
            //   strDat : strDatNew,
            //   endDat : endDatNew,
            //   aprovd : aprovdNew,
            //   isSync : isSyncNew,
            // }
            // insertTrainerManageMyProfile(dataComeFromDBAfterEdits)
            // .then(response => {
            //   //////console.log('inserting data profile into offline database successfully:', response);

            // })
            // .catch(error => {
            //   // Handle error
            //   //////console.log('Error inserting data profile into offline database:', error);
            // });
          })
          .catch(error => {
            // Handle error
            //////console.log('Error fetching profile:', error);
            setLoadingPageInfo(false);

          });
      }else{
        //////console.log('else no internet ahmed');
        //////console.log('storedUser.id here --- ',storedUser.id);
        // fetchTrainerManageMyProfile(storedUser.id).then(response => {
        //   //////console.log('Traner Manage My profile:', response);
        // const { userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,aprovd,isSync} = response[0];
        // //////console.log('hereee-----------',userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,aprovd,isSync);
        //       const start = strDat;
        //       const end = endDat;
        //       setAboutMeAddEntry(about);
        //       setPhotoProfileImage(images);
        //       setRefundPolicySentData(rfnPlc);
        //       setCapacityNumber(capcty);
        //       setIsAcceptSubscriptionsOn(acpSub == 'yes' ? true : false);
        //       setSelectedDates({start,end});
        //       // Parse the JSON SocialMedia string into an array of objects
        //       const socMedArray = JSON.parse(socMed);
        //       const socMedArrayLength = socMedArray.length;
        //       setSocialMediaNumInputs(socMedArrayLength)
        //       //////console.log("Length of socMedArray:", socMedArrayLength);
        //       // Iterate over each object in the array
        //       socMedArray.forEach((obj, index) => {
        //           // Extract the key and value pair from each object
        //           for (let key in obj) {
        //               if (obj.hasOwnProperty(key)) {
        //                   const value = obj[key];
        //                   //////console.log(`index ${index}: Key: ${key}, Value: ${value}`);
        //                   setNewSocialMediaTextValue(prevState => {
        //                     const updatedState = [...prevState]; // Create a copy of the previous state
        //                     updatedState[index] = value; // Update the value at the current index
        //                     return updatedState; // Return the updated state
        //                 });
        //                 const SocialMediaDataIndex = socialMediaData.indexOf(key);
              
        //                 setNewSelectedSocialMedia(prevState => {
        //                   const updatedState = [...prevState]; // Create a copy of the previous state
        //                   updatedState[index] = SocialMediaDataIndex; // Update the value at the current index
        //                   return updatedState; // Return the updated state
        //               });
                        
        //               }
        //           }
        //       });
        //         // Parse the JSON SocialMedia string into an array of objects
        //         const crtfctArray = JSON.parse(crtfct);
        //         const crtfctArrayLength = crtfctArray.length;
        //         setCertificatesNumInputs(crtfctArrayLength);
        //         //////console.log("Length of crtfctArrayLength:", crtfctArrayLength);
        //         // Iterate over each object in the array
        //         crtfctArray.forEach((obj, index) => {
        //             // Extract the key and value pair from each object
        //             for (let key in obj) {
        //                 if (obj.hasOwnProperty(key)) {
        //                     const value = obj[key];
        //                     //////console.log(`crtfctArray index ${index}: Key: ${key}, Value: ${value}`);
        //                     setNewCertificatesTextValue(prevState => {
        //                       const updatedState = [...prevState]; // Create a copy of the previous state
        //                       updatedState[index] = value; // Update the value at the current index
        //                       return updatedState; // Return the updated state
        //                   });
        //                   const certificatesDatIndex = certificatesData.indexOf(key);

        //                   setNewCertificatesSelectsValue(prevState => {
        //                     const updatedState = [...prevState]; // Create a copy of the previous state
        //                     updatedState[index] = certificatesDatIndex; // Update the value at the current index
        //                     return updatedState; // Return the updated state
        //                 });
                          
        //                 }
        //             }
        //         });



        // }).catch(error => {
        //     // Handle error
        //     //////console.log('Error fetching Trainer Manage My profile:', error);
        //   });
        setLoadingPageInfo(false);

        Alert.alert(``,
          `${t('You_must_be_connected_to_the_internet')}`);

      }
      
      
      });
      
      // Unsubscribe
      unsubscribe();
    })
  });
 
  return () => {
    // When the page is unfocused (i.e., user navigates back), remove the data from AsyncStorage.
    // AsyncStorage.removeItem('CapacityManageMyProfileStartDate');
    // AsyncStorage.removeItem('CapacityManageMyProfileEndDate');
    // AsyncStorage.removeItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');

    // AsyncStorage.removeItem('refundPolicyManageMyProfile');

    
    // //console.log('Data removed from AsyncStorage');
  };
}, [])
);
// useFocusEffect(
//   React.useCallback(() => {
//     // When the page is focused, do nothing.

//     return () => {
//       // When the page is unfocused (i.e., user navigates back), remove the data from AsyncStorage.
//       AsyncStorage.removeItem('CapacityManageMyProfileStartDate');
//       AsyncStorage.removeItem('CapacityManageMyProfileEndDate');
//       AsyncStorage.removeItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');

//       //console.log('Data removed from AsyncStorage');
//     };
//   }, [])
// );
////console.log('photoProfileImage',photoProfileImage);
function hasCrtfctChanged(originalData, updatedData) {
    // Parse the original crtfct JSON string
    let originalCrtfct = JSON.parse(originalData);
    // Parse the updated crtfct JSON string
    let updatedCrtfct = JSON.parse(updatedData);

    // Convert both arrays to strings for comparison (ignoring order and extra whitespace)
    const originalCrtfctString = JSON.stringify(originalCrtfct);
    const updatedCrtfctString = JSON.stringify(updatedCrtfct);

    // Return true if they are different
    return originalCrtfctString !== updatedCrtfctString;
}
function hasImagesChanged(originalData, updatedData) {    
    // Return true if they are different
    return originalData !== updatedData;
}

///save or submitforApprovalButton effects////
useEffect(() => {

let finalProfileImageImagesToButton = '';

let certificatesAfterEditingToButton = JSON.stringify(certificatesInfo);
    //console.log('certificatesBeforeEditing: ',certificatesBeforeEditing);
    //console.log('certificatesAfterEditingToButton: ',certificatesAfterEditingToButton);
let hasCrtfctChangedResultToButton;
  if(certificatesInfo && certificatesInfo?.length  > 0 && certificatesBeforeEditing && certificatesBeforeEditing?.length > 0){
    hasCrtfctChangedResultToButton = hasCrtfctChanged(certificatesBeforeEditing, certificatesAfterEditingToButton);

    //console.log('hasCrtfctChangedResultToButton: ',hasCrtfctChangedResultToButton);
  
}


    if(photoProfileImageComeFromDB){
      finalProfileImageImagesToButton = photoProfileImageComeFromDB;
    ////console.log('finalProfileImageImages', finalProfileImageImages);

    }
    if(photoProfileImage){
      finalProfileImageImagesToButton = photoProfileImage;
          ////console.log('savedNewProfileImageImageConst', savedNewProfileImageImageConst);

    }
    //console.log('photoProfileImageComeFromDBBeforeEdit before: ',photoProfileImageComeFromDBBeforeEdit);

    //console.log('photoProfileImage after: ',photoProfileImage);

const hasImagesChangedResultToButton = hasImagesChanged(photoProfileImageComeFromDBBeforeEdit, finalProfileImageImagesToButton);
  
  //console.log('hasImagesChangedResultToButton: ',hasImagesChangedResultToButton);
  
    
    setHasImagesChangedResultToButtonState(hasImagesChangedResultToButton);
    setHasCrtfctChangedResultToButtonState(hasCrtfctChangedResultToButton);
}, [photoProfileImage,certificatesInfo]);


  const addEntryHandler = async () => {
    let finalProfileImageImages = '';
    // const start = await AsyncStorage.getItem('CapacityManageMyProfileStartDate');
    // const end = await AsyncStorage.getItem('CapacityManageMyProfileEndDate');
    const IsAcceptSubscriptionsOnAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');
    const CapacityManageMyProfileCapacityNumberAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileCapacityNumber');

    
    // const refundPolicyManageMyProfileAsyncStorage = await AsyncStorage.getItem('refundPolicyManageMyProfile');
    // const noRefundManageMyProfileAsyncStorage = await AsyncStorage.getItem('noRefundManageMyProfile');

    
    // //console.log('start AsyncStorage:', start);
    // //console.log('end AsyncStorage:', end);
    //console.log('IsAcceptSubscriptionsOn AsyncStorage:', IsAcceptSubscriptionsOnAsyncStorage);
    //console.log('refundPolicyManageMyProfile AsyncStorage:', refundPolicyManageMyProfileAsyncStorage);
    //console.log('noRefundManageMyProfileAsyncStorage AsyncStorage:', noRefundManageMyProfileAsyncStorage);

let certificatesAfterEditing = JSON.stringify(certificatesInfo);
//console.log('certificatesAfterEditing: ',certificatesAfterEditing);
    //console.log('certificatesBeforeEditing: ',certificatesBeforeEditing);

const hasCrtfctChangedResult = hasCrtfctChanged(certificatesBeforeEditing, certificatesAfterEditing);
  
  //console.log('hasCrtfctChangedResult: ',hasCrtfctChangedResult);


    if(photoProfileImageComeFromDB){
     finalProfileImageImages = photoProfileImageComeFromDB;
    ////console.log('finalProfileImageImages', finalProfileImageImages);

    }
    if(photoProfileImage){
          const savedNewProfileImageImageConst = await saveNewProfileImageImage(photoProfileImage);
          finalProfileImageImages = savedNewProfileImageImageConst;
          ////console.log('savedNewProfileImageImageConst', savedNewProfileImageImageConst);

    }

    //console.log('finalProfileImageImages after: ',finalProfileImageImages);
    //console.log('photoProfileImageComeFromDBBeforeEdit before: ',photoProfileImageComeFromDBBeforeEdit);

const hasImagesChangedResult = hasImagesChanged(photoProfileImageComeFromDBBeforeEdit, finalProfileImageImages);
  
  //console.log('hasImagesChangedResult: ',hasImagesChangedResult);


    


    let imageName = "";
    let imageExt = "";
if(finalProfileImageImages){
  imageName = finalProfileImageImages.split('images/').pop();
  imageExt = finalProfileImageImages.split('.').pop(); 
  

}
 
  // //console.log('usersTrainerManageMyProfilFormData newDataForTrainerManageMyProfile: ',usersTrainerManageMyProfilFormData['_parts'][0][1]);
  // //console.log('usersTrainerManageMyProfilFormData image: ',usersTrainerManageMyProfilFormData['_parts'][1]);

if(hasImagesChangedResult || hasCrtfctChangedResult){
//console.log('one updated');
   let usersTrainerManageMyProfilFormData = new FormData();

  let newDataForTrainerManageMyProfile = {
    userId:userId,
    about:aboutMeAddEntry ? aboutMeAddEntry : "",
    crtfct:certificatesInfo.length > 0 ? JSON.stringify(certificatesInfo) : "",
    socMed:selectedSocialMediaInfo.length > 0 ? JSON.stringify(selectedSocialMediaInfo) : "",
    imageName:imageName ? imageName : '',    
    // rfnPlc: refundPolicyManageMyProfileAsyncStorage ? refundPolicyManageMyProfileAsyncStorage : refundPolicySentData ? refundPolicySentData : "",
    rfnPlc: "",
    acpSub: IsAcceptSubscriptionsOnAsyncStorage ? IsAcceptSubscriptionsOnAsyncStorage : isAcceptSubscriptionsOn ? true :false,
    capcty:CapacityManageMyProfileCapacityNumberAsyncStorage ? CapacityManageMyProfileCapacityNumberAsyncStorage : capacityNumber ? capacityNumber :"",
    // strDat: start ? start : selectedDates.start ? selectedDates.start : "",
    // endDat: end ? end : selectedDates.end ? selectedDates.end : "",
    // noRfn:noRefundManageMyProfileAsyncStorage ? noRefundManageMyProfileAsyncStorage : noRefund ? noRefund :"",
    noRfn:"",
    aprovd:"no",
    aprstu:"waiting",
    isSync:'no'
  };
  //console.log('newDataForTrainerManageMyProfile: ',newDataForTrainerManageMyProfile);

  usersTrainerManageMyProfilFormData.append('newDataForTrainerManageMyProfile', {
    "string": JSON.stringify(newDataForTrainerManageMyProfile), //This is how it works :)
    type: 'application/json'
  });
  if(finalProfileImageImages){

  usersTrainerManageMyProfilFormData.append('image', {
    uri: finalProfileImageImages ? finalProfileImageImages : "",
    name:  imageName ? `${imageName}` : "",
    type: imageExt ? `image/${imageExt}`: "",
  });
    // //console.log('finalProfileImageImages: ',finalProfileImageImages);

}
let updateApprovedStatusColumnData = {
  userId: userId, // You still need to send the userId to identify the record
  aprstu: "waiting",
};
 if(triainerConnected){
  setLoading(true);
  setShowSuccess(false); // Reset success state

  axios.post(`https://www.elementdevelops.com/api/TrainerManageMyProfile-sendTMPForAppove`, usersTrainerManageMyProfilFormData, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
  }
}).then((response) => {
      // //console.log('Trainer Manage My Profile  axios data sent to backend', response);
      setLoading(false);

      setShowSuccess(true); // Show success message and animation
        setTimeout(() => {
          setShowSuccess(false);
         
        }, 2000); // 2 seconds delay
        setTimeout(() => {
          navigation.dispatch(StackActions.pop(1));
         
        }, 2500); // 2 seconds delay


      // Alert.alert(`${t('Your_Updates_will_be_applied')}`,
      // `${t('After_the_admin_approve_on_it')}`,
      //             [
      //             {
      //                 text: 'OK',
      //                 onPress: () => {
      //                   navigation.dispatch(StackActions.pop(1));
      //                 },
      //             },
      //             ],
      //             { cancelable: false }
      //         );
          }).catch((error) => {
            setLoading(false);
            setShowSuccess(false); // Reset success state
      //console.log('Error fetching trainer manage:', error);
       });


       axios.post(`https://www.elementdevelops.com/api/TrainerManageMyProfile-update-Approved-Status`, updateApprovedStatusColumnData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", // Use application/json for non-multipart data
        }
      }).then((response) => {
          //console.log('waiting status will be activated')
      }).catch((error) => {
          //console.log('Error updating trainer profile:', error);
          setLoading(false);
          setUpdateLoading(false);
          setShowSuccess(false); // Reset success state
          setUpdateShowSuccess(false); // Reset success state

      });
 }else{
  setLoading(false);
     
  Alert.alert(`${t('To_send_your_data_for_Approving')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }


}else{
//console.log('no updated');
let newDataForTrainerManageMyProfileWithoutMailing = {
    userId:userId,
    about:aboutMeAddEntry ? aboutMeAddEntry : "",
    crtfct:certificatesInfo.length > 0 ? JSON.stringify(certificatesInfo) : "",
    socMed:selectedSocialMediaInfo.length > 0 ? JSON.stringify(selectedSocialMediaInfo) : "",
    images:finalProfileImageImages ? finalProfileImageImages : '',    
    // rfnPlc: refundPolicyManageMyProfileAsyncStorage ? refundPolicyManageMyProfileAsyncStorage : refundPolicySentData ? refundPolicySentData : "",
    rfnPlc: "",
    acpSub: IsAcceptSubscriptionsOnAsyncStorage ? IsAcceptSubscriptionsOnAsyncStorage : isAcceptSubscriptionsOn ? true :false,
    capcty:CapacityManageMyProfileCapacityNumberAsyncStorage ? CapacityManageMyProfileCapacityNumberAsyncStorage : capacityNumber ? capacityNumber :"",
    // strDat: start ? start : selectedDates.start ? selectedDates.start : "",
    // endDat: end ? end : selectedDates.end ? selectedDates.end : "",
    // noRfn:noRefundManageMyProfileAsyncStorage ? noRefundManageMyProfileAsyncStorage : noRefund ? noRefund :"",
    noRfn:"",
    aprovd:"no",
    isSync:'no'
  };
 if(triainerConnected){
  setUpdateLoading(true);
  setUpdateShowSuccess(false); // Reset success state

  axios.post(`https://www.elementdevelops.com/api/TrainerManageMyProfile-insert-data-without-mailing`, newDataForTrainerManageMyProfileWithoutMailing, {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
  }
}).then((response) => {
  
      setUpdateLoading(false);
      setUpdateShowSuccess(true); // Show success message and animation
      // Delay to allow users to see the success message before closing the modal
      setTimeout(() => {
        setUpdateShowSuccess(false);

      }, 2000); // 2 seconds delay
      setTimeout(() => {
        navigation.dispatch(StackActions.pop(1));
       
      }, 2500); // 2 seconds delay
      // //console.log('Trainer Manage My Profile  axios data sent to backend', response);
      // Alert.alert(``,
      // `${t('Your_Updates_will_be_applied')}`,
      //             [
      //             {
      //                 text: 'OK',
      //                 onPress: () => {
      //                   navigation.dispatch(StackActions.pop(1));
      //                 },
      //             },
      //             ],
      //             { cancelable: false }
      //         );
          }).catch((error) => {
            setLoading(false);
            setUpdateLoading(false);
            setShowSuccess(false); // Reset success state
            setUpdateShowSuccess(false); // Reset success state

      //console.log('Error fetching trainer manage:', error);
       });
 }else{
  setUpdateLoading(false);
  setUpdateShowSuccess(false); // Reset success state

  Alert.alert(`${t('To_send_your_data_for_Approving')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
}




 ////console.log('usersTrainerManageMyProfilFormData',usersTrainerManageMyProfilFormData); 
 ////console.log('usersTrainerManageMyProfilFormData_parts',usersTrainerManageMyProfilFormData['_parts']); 

};

//************************************************************** */

  ///// Refund Policy Page /////
  
  const showRefundPolicyModal = () => {
    setModalRefundPolicyVisible(true);
  };
  const hideRefundPolicyModal = () => {
    setModalRefundPolicyVisible(false);
  };

  // const RefundPolicyPage =({hideModal,setRefundPolicySentData})=>{
  //   const [refundPolicyAddEntry,setRefundPolicyAddEntry]=useState('');
    

  //   return(
      
  //   );
  // };
  const sendRefundPolicyData = () => {
    //setRefundPolicySentData(refundPolicyAddEntry);
    Alert.alert(`${t('Press_next_on_Send_Data_for_Approve')}`,
  `${t('then_Please_wait_for_Admin_approving_on_the_Updates')}`,
            [
            {
                text: 'OK',
                onPress: () => {
                  hideRefundPolicyModal();
                },
            },
            ],
            { cancelable: false }
        );
    
  };
  ////// Capacity Page ////////
  
  const showCapacityModal = () => {
    setModalCapacityVisible(true);
  };
  const hideCapacityModal = () => {
    setModalCapacityVisible(false);
  };
  // const CapacitySectionPage =({trainer_info_row,hideModal})=>{
    
  //   return(
      
  //   );
  // };
   
//////console.log('selectedDates',selectedDates);
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
    const sendCapacityData = () => {
      
      
      Alert.alert(`${t('Press_next_on_Send_Data_for_Approve')}`,
  `${t('then_Please_wait_for_Admin_approving_on_the_Updates')}`,
      [
      {
          text: 'OK',
          onPress: () => {
            hideCapacityModal();
          },
      },
      ],
      { cancelable: false }
  );
    };
    
    // useEffect(() => {
    //   (async () => {
    //     try {
    //       const start = await AsyncStorage.getItem('CapacityManageMyProfileStartDate');
    //       const end = await AsyncStorage.getItem('CapacityManageMyProfileEndDate');
    //       const IsAcceptSubscriptionsOnAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');
    //       const refundPolicyManageMyProfileAsyncStorage = await AsyncStorage.getItem('refundPolicyManageMyProfile');
    //       //console.log('start:', start);
    //       //console.log('end:', end);
    //       //console.log('IsAcceptSubscriptionsOn:', IsAcceptSubscriptionsOnAsyncStorage);
    //       //console.log('refundPolicyManageMyProfile:', refundPolicyManageMyProfileAsyncStorage);
    
    //       if (start !== null && end !== null) {
    //         setSelectedDates({ start, end });
    //       }
    
    //       if (IsAcceptSubscriptionsOnAsyncStorage !== null) {
    //         // Parse the boolean value
    //         const parsedAcceptSubscriptions = JSON.parse(IsAcceptSubscriptionsOnAsyncStorage);
    //         setIsAcceptSubscriptionsOn(parsedAcceptSubscriptions);
    //       }
    
    //       if (refundPolicyManageMyProfileAsyncStorage !== null) {
    //         setRefundPolicySentData(refundPolicyManageMyProfileAsyncStorage);
    //       }
    
          
    //     } catch (error) {
    //       //console.log('Error fetching data:', error);
    //     }
    //   })(); // Immediately invoked async function
    // }, []);
    
  //To remove the data from AsyncStorage only when the user presses the back arrow at the top left 
  useEffect(() => {
    const removeDataOnBackPress = (e) => {
      // Check if the action is of type 'beforeRemove', which indicates the user is navigating back
      if (e.data.action.type === 'POP' || e.data.action.type === 'NAVIGATE') {
        // Remove the data from AsyncStorage
        // AsyncStorage.removeItem('CapacityManageMyProfileStartDate');
        // AsyncStorage.removeItem('CapacityManageMyProfileEndDate');
        AsyncStorage.removeItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');
        AsyncStorage.removeItem('CapacityManageMyProfileCapacityNumber');


        // AsyncStorage.removeItem('refundPolicyManageMyProfile');
        // AsyncStorage.removeItem('noRefundManageMyProfile');

        //console.log('Data removed from AsyncStorage on back press');
      }
    };
  
    // Add the event listener for back navigation
    const unsubscribe = navigation.addListener('beforeRemove', removeDataOnBackPress);
  
    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [navigation]);
  

    return (
        <PageContainer>
          <ScrollView>
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
                      <Text style={styles.successText}>{t('Your_Updates_will_be_applied')} {t('After_the_admin_approve_on_it')}</Text>
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
                      <Text style={styles.successText}>{t('Your_Updates_will_be_applied')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
              {/* <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{t("Manage_My_Profile")}</ServicesPagesCardHeader>
              </ServicesPagesCardCover> */}
              <ServicesPagesCardCover>
              {
                (
                  photoProfileImageComeFromDB != "" && photoProfileImageComeFromDB != "null" && photoProfileImageComeFromDB != null
                )?
                (
                  <PageMainImage
                source={{
                  uri: `${photoProfileImageComeFromDB}`
                }}
              />
                ):(
                  <PageMainImage
                  source={require('../../../../assets/trainer_manage_my_profile_section.jpeg')} 
                    // style={{width:"100%",height:"100%",borderRadius:30}}
                  />
                )
              }
                
              </ServicesPagesCardCover>
              <Spacer size="large">
                  <ServiceInfoParentView >
                    {showInfo ? (
                      <ServiceCloseInfoButtonView>
                        <ServiceCloseInfoButton onPress={toggleInfo}>
                          <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                        </ServiceCloseInfoButton>
                        <ServiceCloseInfoButtonTextView>
                          <ServiceCloseInfoButtonText>{t("trainer_manage_my_profile_desc")}</ServiceCloseInfoButtonText>
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
              <View>
                {approvedStatus === 'waiting' && (
                  <View style={[styles.flagContainer, styles.waitingFlag]}>
                    <Text style={styles.flagText}><Feather name="loader" size={20} color="white" /> {t("Updates_waiting_for_approval")}</Text>
                  </View>
                )}
                {/* {approvedStatus === 'rejected' && (
                  <View style={[styles.flagContainer, styles.rejectedFlag]}>
                    <Text style={styles.flagText}>{t("Last_Updates_not_approved")}</Text>
                  </View>
                )} */}
              </View>
              </Spacer>
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}
                  // onRequestClose={() => {
                  //   setIsLoading(!isLoading);
                  // }}
                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
                </Modal>
              <Spacer size="medium">
                <InputField>
                <FormLabelView>
                <FormLabel style={{top:-58}}>{t("About_me")}:</FormLabel>
                </FormLabelView>
                <FormInputView>
                <TextInput
                    editable
                    multiline
                    numberOfLines={7}
                    maxLength={300}
                    placeholder={t("About_me")}
                    value={aboutMeAddEntry}
                    keyboardType="default"
                    style={styles.aboutMeTextArea}
                    onChangeText={(u) => setAboutMeAddEntry(u)}
                />
                </FormInputView>
                </InputField>
              </Spacer>
              <Spacer size="large">
                <InfoFieldParent>
                    <ScrollView>
                    <SelectorTextField>
                        <FormLabel>{t("Certifications")}:</FormLabel>
                    </SelectorTextField>
                    {certificatesInputsItems}
                    </ScrollView>
                </InfoFieldParent>
              </Spacer>
              <Spacer size="large">
                <InfoFieldParent>
                    <ScrollView>
                    <SelectorTextField>
                        <FormLabel>{t("Social_Media_Presence")}:</FormLabel>
                    </SelectorTextField>
                    {socialMediaInputs}
                    </ScrollView>
                    </InfoFieldParent>
              </Spacer>
              <Spacer size="large">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={onPressProfileImageMedia}>
                    <CalendarFullSizePressableButtonText >{t("Upload_image")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView>
                    
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:"100%"}}
              onPress={()=>{
                navigation.navigate('TrainerQuestionnaire')
                // ,{
                //   capacityNumberSentFromTMProfile:capacityNumber,
                //   isAcceptSubscriptionsOnSentFromTMProfile:isAcceptSubscriptionsOn,
                //   IsAcceptSubscriptionsOnForComparsionSentFromTMProfile:isAcceptSubscriptionsOnForComparsion,
                //   // selectedDatesSentFromTMProfile:selectedDates,
                //   trainerTraineesCountSentFromTMProfile:trainerTraineesCount
                //   })

              }}>
                        <CalendarFullSizePressableButtonText >{t("Questionnaire")}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('TrainerManageWorkouts')}>
                    <CalendarFullSizePressableButtonText >{t("Manage_Workouts")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('TrainerManageMeals')}>
                    <CalendarFullSizePressableButtonText >{t("Manage_Meals")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView  style={{width: width - 20}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={()=>{
            navigation.navigate('TrainerProfileCapacity',{
              capacityNumberSentFromTMProfile:capacityNumber,
              isAcceptSubscriptionsOnSentFromTMProfile:isAcceptSubscriptionsOn,
              IsAcceptSubscriptionsOnForComparsionSentFromTMProfile:isAcceptSubscriptionsOnForComparsion,
              // selectedDatesSentFromTMProfile:selectedDates,
              trainerTraineesCountSentFromTMProfile:trainerTraineesCount
              })

           }}>
                    <CalendarFullSizePressableButtonText >{t("Capacity")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  {/* <Modal visible={modalCapacityVisible} transparent={true} animationType="fade">
                    <ViewOverlay>
                  
                    <PageContainer>
                      <ScrollView>
                        <TitleView >
                            <Title >Life</Title>
                        </TitleView>
                        <ServicesPagesCardCover>
                            <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                            <ServicesPagesCardHeader>{t("Capacity")}</ServicesPagesCardHeader>
                        </ServicesPagesCardCover>
                        <Spacer size="medium">
                          <InputField >
                          <FormLabelView>
                              <FormLabel>{t("Current_Clients")}:</FormLabel>
                          </FormLabelView>
                              <FormLabelDateRowView><FormLabelDateRowViewText>{trainerTraineesCount ? trainerTraineesCount : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                          </InputField>
                      </Spacer>
                      <Spacer size="medium">
                        <InputField>
                        <FormLabelView>
                          <FormLabel>{t("Capacity")}:</FormLabel>
                        </FormLabelView>
                  
                        <FormLabelDateRowView><FormLabelDateRowViewText>{capacityNumber}</FormLabelDateRowViewText></FormLabelDateRowView>
                        </InputField>
                      </Spacer>
                      <Spacer size="medium">
                        <InputField>
                          <FormLabelView>
                            <FormLabel>{t("Accept_Subscriptions")}:</FormLabel>
                          </FormLabelView>
                          <Switch
                            value={isAcceptSubscriptionsOn}
                            onValueChange={() => setIsAcceptSubscriptionsOn(!isAcceptSubscriptionsOn)}
                            trackColor={{ false: '#767577', true: '#000' }}
                            thumbColor={isAcceptSubscriptionsOn ? '#d0d7dd' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                          />
                        </InputField>
                      </Spacer>
                      {(isAcceptSubscriptionsOn === true)?(
                        <>
                        <Spacer size="medium">
                            <InputField>
                                <FormLabelView>
                                  <FormLabel>{t("Select_Dates")}:</FormLabel>
                                </FormLabelView>
                                <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
                          onPress={handleOpenCalendar}>
                                  <CalendarFullSizePressableButtonText >{t("Select_Dates")}</CalendarFullSizePressableButtonText>
                                </CalendarFullSizePressableButton>
                              <PlansCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onSelectDateRange={handleSelectDateRange} />
                            </InputField>
                          </Spacer>
                          <Spacer size="medium">
                            <InputField >
                            <FormLabelView>
                                <FormLabel>{t("Start_Date")}:</FormLabel>
                            </FormLabelView>
                                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.start ? selectedDates.start : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                            </InputField>
                        </Spacer>
                        <Spacer size="medium">
                            <InputField >
                            <FormLabelView>
                                <FormLabel>{t("End_Date")}:</FormLabel>
                            </FormLabelView>
                                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.end ? selectedDates.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                            </InputField>
                        </Spacer>
                        </>
                      ):(null)}
                        <Spacer size="large">
                              <FormElemeentSizeButtonParentView>
                                <FormElemeentSizeButtonView>
                                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                                    onPress={() => {sendCapacityData();}}
                                  >
                                  <CalendarFullSizePressableButtonText >{t("Save")}</CalendarFullSizePressableButtonText>
                                </CalendarFullSizePressableButton>
                                </FormElemeentSizeButtonView>
                                <FormElemeentSizeButtonView>
                                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                        onPress={hideCapacityModal}>
                                  <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                                </CalendarFullSizePressableButton>
                                </FormElemeentSizeButtonView>
                              </FormElemeentSizeButtonParentView>
                            </Spacer>
                        <Spacer size="large"></Spacer>
                      </ScrollView>
                    </PageContainer>
                    </ViewOverlay>
                  </Modal> */}
                  </FormElemeentSizeButtonView>

                  {/* <FormElemeentSizeButtonView>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={()=>{
            navigation.navigate('TrainerProfileRefundPolicy',{
              refundPolicySentData:refundPolicySentData,
              noRefund:noRefund,
              })

           }}>
                    <CalendarFullSizePressableButtonText >{t('Refund_Policy')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView> */}
                </FormElemeentSizeButtonParentView>
                {/* <Modal visible={modalRefundPolicyVisible} transparent={true} animationType="fade">
                  <ViewOverlay>
                  <PageContainer>
                      <ScrollView>
                        <TitleView >
                            <Title >Life</Title>
                        </TitleView>
                        <ServicesPagesCardCover>
                            <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                            <ServicesPagesCardHeader>{t('Refund_Policy')}</ServicesPagesCardHeader>
                        </ServicesPagesCardCover>
                        <Spacer size="medium">
                          <InputField>
                          <FormLabelView>
                          <FormLabel style={{top:-58}}>{t('Refund_Policy')}:</FormLabel>
                          </FormLabelView>
                          <FormInputView>
                          <TextInput
                              editable
                              multiline
                              numberOfLines={7}
                              maxLength={300}
                              placeholder={t('Refund_Policy')}
                              value={refundPolicySentData}
                              keyboardType="default"
                              style={styles.aboutMeTextArea}
                              onChangeText={(u) => setRefundPolicySentData(u)}
                          />
                          </FormInputView>
                          </InputField>
                        </Spacer>
                        <Spacer size="large">
                            <FormElemeentSizeButtonParentView>
                              <FormElemeentSizeButtonView>
                                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                                  onPress={() => {
                                      if (refundPolicySentData) {
                                      sendRefundPolicyData();
                                      
                                      } else {
                                        Alert.alert(`${t('You_must_fill_Refund_Policy_field')}`);
                                      }
                                    }}>
                                <CalendarFullSizePressableButtonText >{t('Save')}</CalendarFullSizePressableButtonText>
                              </CalendarFullSizePressableButton>
                              </FormElemeentSizeButtonView>
                              <FormElemeentSizeButtonView>
                                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                      onPress={hideRefundPolicyModal}>
                                <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                              </CalendarFullSizePressableButton>
                              </FormElemeentSizeButtonView>
                            </FormElemeentSizeButtonParentView>
                          </Spacer>
                    </ScrollView>
                  </PageContainer>
                  </ViewOverlay>
                </Modal> */}
              </Spacer>
              <Spacer size="medium">
              <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}}
           onPress={addEntryHandler}>
                    <CalendarFullSizePressableButtonText >{hasImagesChangedResultToButtonState || hasCrtfctChangedResultToButtonState ?  t("Send_for_Approval") : t("Save")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
              </Spacer>

              <Spacer size="large"></Spacer>
              <Spacer size="large"></Spacer>
            </ScrollView>
        </PageContainer>
    );
}
const styles = StyleSheet.create({
    aboutMeTextArea: {
 // This property ensures that the text starts from the top
        backgroundColor:"white",
        borderWidth:1,
        borderColor:'black',
        borderRadius:6,
        padding:10,
        textAlignVertical: 'top',
        height:150,
        
    },
    modalContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        },
        loadingBox: {
          width: 200,
          height: 200,
          backgroundColor: '#333', // dark background for the loading box
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
        flagContainer: {
        padding: 10,
        borderRadius: 25,
        marginBottom: 10,
        alignSelf: 'center',
      },
      waitingFlag: {
        backgroundColor: '#FFD700', // Gold color for "waiting"
      },
      rejectedFlag: {
        backgroundColor: '#FF4500', // Orange-Red color for "rejected"
      },
      flagText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
      },
});