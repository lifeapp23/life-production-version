import React, { useState, useRef,useEffect} from 'react';

  import {Switch,ScrollView,Alert, Modal, StyleSheet,ActivityIndicator, Pressable, Animated, Easing ,TouchableOpacity, View,TextInput,Text, Dimensions,Image} from 'react-native';
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
  import WebView from 'react-native-webview';

  
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
  AccountBackground,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import {AntDesign} from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';

const { width } = Dimensions.get('window');

  
export const QuestionnaireBeforeSubscribeScreen = ({navigation,route}) => {

  const params = route.params || {};

  const { trainer_pricing = {}, trainer_info = {} } = params;

  let onePrice = trainer_pricing;
  let newPersonalTrainerRow = trainer_info;
//console.log('newPersonalTrainerRow QuestionnaireBeforeSubscribeScreen ?.userId---',newPersonalTrainerRow?.userId);
//console.log('onePrice.curncy QuestionnaireBeforeSubscribeScreen ---',onePrice.curncy);


  const { t, i18n } = useTranslation();
  const [showXPayGateway, setShowXPayGateway] = useState(false);

  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  

  const speKey = newPersonalTrainerRow?.userId + '.' + userId + '.' +  new Date().getTime();

  const [showGateway, setShowGateway] = useState(false);
  const [showPaymobGateway, setShowPaymobGateway] = useState(false);

  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const [countPlusPeriod,SetCountPlusPeriod] =useState("");
  const [youRecieveFinalResult,setYouRecieveFinalResult] =useState("");
  const [ourCommissionResult, setOurCommissionResult] = useState('');
  const [newStartDateForSub, setNewStartDateForSub] = useState('');
  const [newEndDateForSub, setNewEndDateForSub] = useState('');
const [xpayEgCommissionNumber, setXpayEgCommissionNumber] = useState('');
  const [xpayForeignCommissionNumber, setXpayForeignCommissionNumber] = useState('');
  const [bankCommissionResult, setBankCommissionResult] = useState('');
    
 
  
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  const [newNetPriceAferDiscountPeriodCheck,SetNewNetPriceAferDiscountPeriodCheck] =useState("");


  ///// traineee qustions /////////////

  const [newTrainerQuestionnaireTextValue,setNewTrainerQuestionnaireTextValue] =  useState([]);

  
  const [TrainerQuestionnaireBeforeEditing,setTrainerQuestionnaireBeforeEditing] =  useState("");



    // this will be attached with each input onChangeText
    const [TrainerQuestionnaireTextValue, setTrainerQuestionnaireTextValue] = useState(''); 
    // our number of inputs, we can add the length or decrease
    const [QuestionnaireNumInputs, setQuestionnaireNumInputs] = useState(1);

    // all our input fields are tracked with this array
    const TrainerQuestionnaireRefInputs = useRef([TrainerQuestionnaireTextValue]);

    ///// traineee answers /////////////
    const [newTraineeQuestionnaireTextValue,setNewTraineeQuestionnaireTextValue] =  useState([]);

  
    const [TraineeQuestionnaireBeforeEditing,setTraineeQuestionnaireBeforeEditing] =  useState("");



    // this will be attached with each input onChangeText
    const [QuestionnaireTraineeTextValue, setQuestionnaireTraineeTextValue] = useState(''); 
    // our number of inputs, we can add the length or decrease
    const [QuestionnaireTraineeNumInputs, setQuestionnaireTraineeNumInputs] = useState(1);

    // all our input fields are tracked with this array
    const QuestionnaireTraineeRefInputs = useRef([QuestionnaireTraineeTextValue]);


  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      ////console.log('tokeeen:',res);
      setUserToken(res);

    AsyncStorage.getItem("currentUser").then((user) => {
        ////console.log('tokeeen:',res);

        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
  
        
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
           
          if(state.isConnected){

                  axios.get(`https://life-pf.com/api/get-profile?userId=${newPersonalTrainerRow?.userId}`, {
                    headers: {
                      'Authorization': `Bearer ${res}`,
                      'Content-Type': 'application/json',
                    },
                    })
                    .then(response => {
                      const { TrnQes} = response.data['$profile'];
                      //console.log('response.data profile',response.data['$profile']);
                      //console.log('response.data ?.TrSpCm/100 profile',response.data['$profile']?.TrSpCm);

                      //console.log('response.data AdminSettingsAppRow',response.data['AdminSettingsAppRow']);
                      if(response?.data["$profile"]?.TrSpCm){
                        setOurCommissionResult(parseFloat((response?.data["$profile"]?.TrSpCm/100)?.toFixed(3)));
          
                      }else{
                        setOurCommissionResult(parseFloat((response?.data["AdminSettingsAppRow"]?.admCom/100)?.toFixed(3)));
                      }
                      if(response?.data["AdminSettingsAppRow"]?.xpyEgCom){
                        setXpayEgCommissionNumber(parseFloat((response?.data["AdminSettingsAppRow"]?.xpyEgCom/100)?.toFixed(3)));
          
                      }else{
                        setXpayEgCommissionNumber(0);
                      }
                      if(response?.data["AdminSettingsAppRow"]?.xpyForCom){
                        setXpayForeignCommissionNumber(parseFloat((response?.data["AdminSettingsAppRow"]?.xpyForCom/100)?.toFixed(3)));
          
                      }else{
                        setXpayForeignCommissionNumber(0);
                      }
                      if(response?.data["AdminSettingsAppRow"]?.bnkCom){
                        setBankCommissionResult(parseFloat((response?.data["AdminSettingsAppRow"]?.bnkCom/100)?.toFixed(3)));
          
                      }else{
                        setBankCommissionResult(0);
                      }
                      //console.log('TrnQes',TrnQes);

                      const TrnQesNew = TrnQes != null ? TrnQes : '';
                      const TrnQesArray = JSON.parse(TrnQesNew);
                      //console.log('TrnQesArray',TrnQesArray);

                      const TrnQesArrayLength = TrnQesArray.length;
                      //console.log('TrnQesArrayLength',TrnQesArrayLength);

                      setQuestionnaireNumInputs(TrnQesArrayLength)
                    
                      // Iterate over each object in the array
                      let updatedTrainerQuestionnaireTextValue = [...newTrainerQuestionnaireTextValue]; // Clone state outside loop
                      
                      TrnQesArray.forEach((obj, index) => {
                        updatedTrainerQuestionnaireTextValue[index] = obj;

                      });
                      //console.log('updatedTrainerQuestionnaireTextValue',updatedTrainerQuestionnaireTextValue);
                      setNewTrainerQuestionnaireTextValue(updatedTrainerQuestionnaireTextValue);

                    })
                    .catch(error => {
                      // Handle error
                      //////console.log('Error fetching profile:', error);
                      // setLoadingPageInfo(false);

                    });

            }else{
              Alert.alert(``,
              `${t('You_must_be_connected_to_the_internet')}`);

          }

        });
        
        // Unsubscribe
        unsubscribe();
      })
    });
   
  
  }, [])
  );
/////////////// Start Questionnaire functionalty///////////


const setQuestionnaireInputValue = (index,value)=>{
  // first we are storing input value to refInputs arrary to track them
  // const QuestionnaireInputs = QuestionnaireRefInputs.current;
  // QuestionnaireInputs[index]=value;
  // // we are also setting the text value to the inputs field onChangeText
  // setQuestionnaireTextValue(value);

  const newTraineeQuestionnaireInputs = [...newTraineeQuestionnaireTextValue];
  newTraineeQuestionnaireInputs[index] = value;

  setNewTraineeQuestionnaireTextValue(newTraineeQuestionnaireInputs);
}

const addQuestionnaireInput =() =>{

  // increase the num   // // add a new element in out QuestionnaireRefSelects array
  // QuestionnaireRefSelects.current.push('');
  // // add a new element in out QuestionnaireRefInputs array
  // QuestionnaireRefInputs.current.push('');ber of inputs
  setQuestionnaireNumInputs(value => value +1);
}
const removeQuestionnaireInput = (i)=>{
  //remove from the array by index value
  //remove from the array by index value
  QuestionnaireRefInputs.current.splice(i,1)[0];

  // Create new arrays without the element to remove
  const newInputs = newQuestionnaireTextValue.filter((_, index) => index !== i);



  setNewQuestionnaireTextValue(newInputs);
  //decrease the number of inputs
  setQuestionnaireNumInputs(value => value -1);
}
const renderQuestionnaireOption = (title,i) => (
  <SelectItem key={i} title={title}  />
);
const QuestionnaireInfo =[];

const QuestionnaireInputsItems= [];
for (let i = 0; i < QuestionnaireNumInputs; i ++)
{
  QuestionnaireInputsItems.push(
    <View key={i} >
        <InfoField>
          
          <WriteInfo>
            <WriteInfoChild style={{flexDirection: 'column',width:width-20,}}>
            <View style={{width:"100%",marginBottom:5,paddingLeft:5,paddingRight:5,paddingTop:10,paddingBottom:10,borderRadius:10,backgroundColor:"#e1e3e1",}}><FormLabelDateRowViewText>{i+1}. {newTrainerQuestionnaireTextValue?.[i] ? newTrainerQuestionnaireTextValue?.[i] : ""}</FormLabelDateRowViewText></View>

            <InfoInputView style={{width:"100%"}}>        

            <TextInput
                  placeholder={t("Answer")}
                  editable
                  multiline
                  numberOfLines={7}
                  maxLength={300}
                  style={styles.QuestionTextArea}

                  theme={{colors: {primary: '#3f7eb3'}}}
                  value={newTraineeQuestionnaireTextValue?.[i] ? newTraineeQuestionnaireTextValue?.[i] : ""}
                  textContentType="name"
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={value => setQuestionnaireInputValue(i,value)}
                />
            </InfoInputView> 
            {/* <Pressable onPress={() => removeQuestionnaireInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
              <AntDesign name="minuscircleo" size={20} color="white" />
            </Pressable> */}
            </WriteInfoChild>
          </WriteInfo>
        </InfoField>
   
      
      
    </View>
  );
  // Update the QuestionnaireInfo state when the QuestionnaireInputs change
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]]);
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]] == "Other");

  if (newTrainerQuestionnaireTextValue[i] !== '' && newTrainerQuestionnaireTextValue[i] !== undefined && newTrainerQuestionnaireTextValue[i] !== 'undefined'
    && newTraineeQuestionnaireTextValue[i] !== '' && newTraineeQuestionnaireTextValue[i] !== undefined && newTraineeQuestionnaireTextValue[i] !== 'undefined'
  ){
  
    QuestionnaireInfo.push({ [newTrainerQuestionnaireTextValue?.[i]]: newTraineeQuestionnaireTextValue?.[i] });
  
  }

}
useEffect (() => {
  //console.log('QuestionnaireInfo',QuestionnaireInfo);
  //console.log('QuestionnaireInfo.length',QuestionnaireInfo.length);
  
}, [QuestionnaireInfo]);
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

const sendSubscriptionDataWithQuestionnaireData =  (QuestionnaireInfo,newPersonalTrainerRow,onePrice,userToken,userId,speKey) => {
  getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
  SubscriptionNewStartAndEndDate(onePrice);
  // if (onePrice.curncy === "EGP") {
  //   // subscribeToTrainerFuncWithPayMob(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);
    
  //   subscribeToTrainerFuncWithXPay(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);

  //   //console.log('Egypt:--');
  // } else {
  //   subscribeToTrainerFunc(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);
  //   //console.log('Worldwide:---');
  // }
  subscribeToTrainerFuncWithXPay(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);

  //console.log('QuestionnaireInfo sendQuestionnaireData',QuestionnaireInfo);
  //console.log('QuestionnaireInfo.length sendQuestionnaireData',QuestionnaireInfo.length);

  
  

  //console.log('newData: ',newData);
  


};
const sendQuestionnaireData =  (QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey) => {
  if(QuestionnaireInfo == undefined){
    Alert.alert(`${t('All_fields_are_required')}`);
    return;
  }
  if(QuestionnaireInfo.length == 0){
    Alert.alert(`${t('All_fields_are_required')}`);
    return;
  }
  if(QuestionnaireInfo.length < QuestionnaireNumInputs){
    Alert.alert(`${t('All_fields_are_required')}`);
    return;
  }

  const newData = {
    trnrId:newPersonalTrainerRow?.userId,
    trneId:userId,
    speKey:speKey,
    QesAns:JSON.stringify(QuestionnaireInfo),
  };
  if(triainerConnected){
    setLoading(true);
    setShowSuccess(false); // Reset success state           
  
    axios.post(`https://life-pf.com/api/trainer-trainee-Questionnaire-answers-insert`, newData)
    .then((response) => {
        ////console.log('response?.data?.value', response?.data?.value);
        // Alert.alert(``, `${t('Questionnaire_data_updated_successfully')}`);
        setLoading(false);
        setShowSuccess(true); // Show success message and animation
        // Delay to allow users to see the success message before closing the modal
        setTimeout(() => {
            setShowSuccess(false);
        }, 1000); // 2 seconds delay
  
  
      //   setTimeout(() => {
      //     // Automatically trigger the subscription function after a successful response
      //     getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
  
      //     if (newPersonalTrainerRow.curncy === "EGP") {
      //       subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow, onePrice);
      //       //console.log('Egypt:--');
      //     } else {
      //       subscribeToTrainerFunc(newPersonalTrainerRow, onePrice);
      //       //console.log('Worldwide:---');
      //     }
      // }, 2000); // 2 seconds delay
          
        
      }).catch(error => {
          // Handle error
          setLoading(false);
          setShowSuccess(false); // Reset success state
          Alert.alert(``,`${t(error?.response?.data?.message)}`);
        });
  
  
   }else{
    setLoading(false);
    setShowSuccess(false); // Reset success state
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
};
/////subscribtion function //////
const subscribeToTrainerFunc = async (QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey) => {
  // if(!displayPeriodValue || !selectedDatesStart || !selectedDatesEnd){
  //   Alert.alert(`${t('please_select_period_start_and_end_dates')}`);
  //   return;
  // }
  console.log("subscribeToTrainerFunc newPersonalTrainerRow QuestionnaireInfo",newPersonalTrainerRow);
     console.log("subscribeToTrainerFunc onePrice QuestionnaireInfo",onePrice);

  const newData = {
    traineeToken:userToken,
    trainerId:newPersonalTrainerRow?.userId,
    status:'active',
    newPersonalTrainerRow:newPersonalTrainerRow,
    onePrice:onePrice,
    
  };

  //console.log('newData : subscribeToTrainerFunc',newData);
  

 if(triainerConnected){
  axios.post(`https://life-pf.com/api/trainer-subscribe`, newData)
  .then((response) => {
      ////console.log('response?.data?.value', response?.data?.value);
      sendQuestionnaireData(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);
      setTimeout(() => {
      setShowGateway(response?.data?.value)
    }, 2000); // 2 seconds delay

      }).catch(error => {
        // Handle error
        setLoading(false);
        setShowSuccess(false);

        Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
      });


 }else{
  setLoading(false);
  setShowSuccess(false);
  Alert.alert(`${t('To_Add_your_data')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
}
const subscribeToTrainerFuncWithXPay = async (QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey) => {
  console.log("subscribeToTrainerFuncWithXPay newPersonalTrainerRow",newPersonalTrainerRow);
  console.log("subscribeToTrainerFuncWithXPay onePrice",onePrice);

   // if(!displayPeriodValue || !selectedDatesStart || !selectedDatesEnd){
   //   Alert.alert(`${t('please_select_period_start_and_end_dates')}`);
   //   return;
   // }
   const newData = {
     // traineeToken:userToken,
     // trainerId:newPersonalTrainerRow?.userId,
     // status:'active',
     // period:displayPeriodValue,
     // strDat:selectedDates.start,
     // endDat:selectedDates.end,

     traineeToken:userToken,
     trainerId:newPersonalTrainerRow?.userId,
     status:'active',
     newPersonalTrainerRow:newPersonalTrainerRow,
     onePrice:onePrice,
   };
   

   ////console.log('newData: ',newData);
   
 
  if(triainerConnected){
   axios.post(`https://life-pf.com/api/trainer-subscribe-with-xpay`, newData)
       .then((response) => {
        ////console.log('response?.data?.value', response?.data?.value);
        //console.log('newData subscribeToTrainerFuncWithPayMob success: ');
  
        sendQuestionnaireData(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);
        setTimeout(() => {
          setShowXPayGateway(response?.data?.value);
        }, 2000); // 2 seconds delay
        }).catch(error => {
          // Handle error
          setLoading(false);
          setShowSuccess(false);
          Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
        });
  
  
   }else{
    setLoading(false);
    setShowSuccess(false);
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
 }
const subscribeToTrainerFuncWithPayMob = async (QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey) => {
  // if(!displayPeriodValue || !selectedDatesStart || !selectedDatesEnd){
  //   Alert.alert(`${t('please_select_period_start_and_end_dates')}`);
  //   return;
  // }
  //console.log('subscribeToTrainerFuncWithPayMob inside it');
  console.log("subscribeToTrainerFuncWithPayMob newPersonalTrainerRow QuestionnaireInfo",newPersonalTrainerRow);
  console.log("subscribeToTrainerFuncWithPayMob onePrice QuestionnaireInfo",onePrice);

  const newData = {
    // traineeToken:userToken,
    // trainerId:newPersonalTrainerRow?.userId,
    // status:'active',
    // period:displayPeriodValue,
    // strDat:selectedDates.start,
    // endDat:selectedDates.end,

    traineeToken:userToken,
    trainerId:newPersonalTrainerRow?.userId,
    status:'active',
    newPersonalTrainerRow:newPersonalTrainerRow,
    onePrice:onePrice,
  };

  //console.log('newData subscribeToTrainerFuncWithPayMob inside it: ',newData);
  

 if(triainerConnected){
  axios.post(`https://life-pf.com/api/trainer-subscribe-with-paymob`, newData)
  .then((response) => {
      ////console.log('response?.data?.value', response?.data?.value);
      //console.log('newData subscribeToTrainerFuncWithPayMob success: ');

      sendQuestionnaireData(QuestionnaireInfo,newPersonalTrainerRow, onePrice,userToken,userId,speKey);
      setTimeout(() => {
        setShowPaymobGateway(response?.data?.value);
      }, 2000); // 2 seconds delay
      }).catch(error => {
        // Handle error
        setLoading(false);
        setShowSuccess(false);
        Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
      });


 }else{
  setLoading(false);
  setShowSuccess(false);
  Alert.alert(`${t('To_Add_your_data')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
}


const getPeriodOfSubscribe =  (count,period) => {
  //console.log('period + count',`${count} ${period}`);
  SetCountPlusPeriod(`${count} ${period}`);

}
  console.log('newNetPriceAferDiscountPeriodCheck',newNetPriceAferDiscountPeriodCheck);


const htmlContent = `
    <html>
      <body>
        <form id="myForm" action="https://life-pf.com/api/paymentsToTrainer" method="post">
          <input type="hidden" name="traineeToken" value="${userToken}">
          <input type="hidden" name="trainerId" value="${newPersonalTrainerRow?.userId}">
          <input type="hidden" name="status" value="active">
          
          <input type="hidden" name="period" value="${countPlusPeriod}">

          <input type="hidden" name="strDat" value="${newStartDateForSub}">
          <input type="hidden" name="endDat" value="${newEndDateForSub}">
          <input type="hidden" name="NetPrc" value="${newNetPriceAferDiscountPeriodCheck}">
          <input type="hidden" name="curncy" value="${onePrice?.curncy}">

        </form>
        <script>
          // Submit the form automatically when the page loads
          document.getElementById("myForm").submit();
        </script>
      </body>
    </html>
  `;
  function handleMessage(e) {
    let data = e.nativeEvent.data;
    //const message = JSON.parse(event.nativeEvent.data);
    ////console.log('e>>>',e);
    if (data !== undefined) {
      setShowGateway(data);
    }
  };

  const htmlPaymobContent = `
  <html>
    <body>
      <form id="myForm" action="https://life-pf.com/api/payWithPayMob" method="get">
        <input type="hidden" name="traineeToken" value="${userToken}">
          <input type="hidden" name="trainerId" value="${newPersonalTrainerRow?.userId}">
          <input type="hidden" name="status" value="active">
          
          <input type="hidden" name="period" value="${countPlusPeriod}">
          <input type="hidden" name="youRecieve" value="${youRecieveFinalResult}">

          

          <input type="hidden" name="strDat" value="${newStartDateForSub}">
          <input type="hidden" name="endDat" value="${newEndDateForSub}">
          <input type="hidden" name="NetPrc" value="${newNetPriceAferDiscountPeriodCheck}">
          <input type="hidden" name="curncy" value="${onePrice?.curncy}">

      </form>
      <script>
        // Submit the form automatically when the page loads
        document.getElementById("myForm").submit();
      </script>
    </body>
  </html>
`;
const newPersonalTrainerRowStringified = JSON.stringify(newPersonalTrainerRow);
const escapedNewPersonalTrainerRow = encodeURIComponent(newPersonalTrainerRowStringified);

console.log('escapedNewPersonalTrainerRow:', escapedNewPersonalTrainerRow);

const htmlXPayContent = `
<html>
  <body>
    <form id="myForm" action="https://life-pf.com/api/payWithXPay" method="post">
      <input type="hidden" name="traineeToken" value="${userToken}">
        <input type="hidden" name="trainerId" value="${newPersonalTrainerRow?.userId}">
        <input type="hidden" name="trneId" value="${userId}">
        <input type="hidden" name="newPersonalTrainerRow" value="${escapedNewPersonalTrainerRow}">
        <input type="hidden" name="status" value="active">
        
        <input type="hidden" name="period" value="${countPlusPeriod}">
        <input type="hidden" name="ourCommissionResult" value="${ourCommissionResult}">
        <input type="hidden" name="xpayEgCommissionNumber" value="${xpayEgCommissionNumber}">
        <input type="hidden" name="xpayForeignCommissionNumber" value="${xpayForeignCommissionNumber}">

        <input type="hidden" name="bankCommissionResult" value="${bankCommissionResult}">

        <input type="hidden" name="strDat" value="${newStartDateForSub}">
        <input type="hidden" name="endDat" value="${newEndDateForSub}">
        <input type="hidden" name="NetPrc" value="${newNetPriceAferDiscountPeriodCheck}">
        <input type="hidden" name="curncy" value="${onePrice?.curncy}">

    </form>
    <script>
      // Submit the form automatically when the page loads
      document.getElementById("myForm").submit();
    </script>
  </body>
</html>
`;
function handlePaymobMessage(e) {
  let data = e.nativeEvent.data;
  //const message = JSON.parse(event.nativeEvent.data);
  ////console.log('e>>>',e);
  if (data !== undefined) {
    setShowPaymobGateway(data);
  }
};
function handleXPayMessage(e) {
  let data = e.nativeEvent.data;
  //const message = JSON.parse(event.nativeEvent.data);
  ////console.log('e>>>',e);
  if (data !== undefined) {
    setShowXPayGateway(data);
  }
};
const TrainerRecievedPrice = (netPriceResult,countryCurrency,ourCommissionResult,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionResult) => {
  if(countryCurrency == "EGP"){
    // let Percentage_BANK = 0.002*netPriceResult;
    let Percentage_BANK = bankCommissionResult*netPriceResult;

    let Percentage_BANK_Final;

    if(Percentage_BANK < 40){
      Percentage_BANK_Final = 40;
    }else if(Percentage_BANK > 350){
      Percentage_BANK_Final = 350;

    }else{
      Percentage_BANK_Final = Percentage_BANK;

    }
    let Transfer_fees = Percentage_BANK_Final + 15;
        // let Payment_Gateway = (0.025 * netPriceResult) + 2;
    let Payment_Gateway = (xpayEgCommissionNumber * netPriceResult) + 2;
    //console.log('ourCommissionResult',ourCommissionResult);
    let Our_fees = ourCommissionResult * netPriceResult;
    //console.log('Our_fees',Our_fees);
    let You_Recieve = netPriceResult - (Transfer_fees + Our_fees + Payment_Gateway);
    //console.log('You_Recieve',You_Recieve);
    setYouRecieveFinalResult(You_Recieve);
  }else{
    // let Percentage_BANK = 0.002*netPriceResult;
    let Percentage_BANK = bankCommissionResult*netPriceResult;

    let Percentage_BANK_Final;

    if(Percentage_BANK < 40){
      Percentage_BANK_Final = 40;
    }else if(Percentage_BANK > 350){
      Percentage_BANK_Final = 350;

    }else{
      Percentage_BANK_Final = Percentage_BANK;

    }
    let Transfer_fees = Percentage_BANK_Final + 15;
        // let Payment_Gateway = (0.025 * netPriceResult) + 2;
    let Payment_Gateway = (xpayForeignCommissionNumber * netPriceResult) + 2;
    //console.log('ourCommissionResult',ourCommissionResult);
    let Our_fees = ourCommissionResult * netPriceResult;
    //console.log('Our_fees',Our_fees);
    let You_Recieve = netPriceResult - (Transfer_fees + Our_fees + Payment_Gateway);
    //console.log('You_Recieve',You_Recieve);
    setYouRecieveFinalResult(You_Recieve);
  }
};
/////subscribtion function //////
const isTodayWithinDiscountPeriod = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return today >= start && today <= end;
};
const SubscriptionNewStartAndEndDate = (onePrice) =>{


  const selectedPeriod = onePrice?.period;
  const count = onePrice?.count;
  console.log('selectedPeriod SubscriptionNewStartAndEndDatet questionare page',selectedPeriod)
  console.log('count SubscriptionNewStartAndEndDatet questionare page',count)

  // Create a new Date object for the start date
  // const today = new Date();
  const startDate = new Date();
  const startDateNew = new Date().toISOString().split('T')[0];

  console.log('startDateNewt questionare page:', startDateNew);

let endDate;

// Determine the end date based on the selectedPeriod
if (selectedPeriod === "Day") {
// Add the count to the current date for days
endDate = new Date(startDate);
endDate.setDate(parseInt(startDate.getDate()) + parseInt(count));
} else if (selectedPeriod === "Month") {
// Add the count to the current date for months
endDate = new Date(startDate);
const currentMonth = startDate.getMonth();
console.log('currentMontht questionare page:', currentMonth);

const newMonth = parseInt(currentMonth) + parseInt(count);
console.log('newMontht questionare page:', newMonth);

endDate.setMonth(newMonth); // JS will handle year overflow automatically
} else if (selectedPeriod === "Year") {
// Add the count to the current date for years
endDate = new Date(startDate);
endDate.setFullYear(parseInt(startDate.getFullYear()) + parseInt(count));
}

  //console.log('selectedPeriod',selectedPeriod);
  //console.log('count',count);

  //console.log('startDateBoolean',startDateBoolean);
  //console.log('endDate.toISOString',endDate.toISOString().split('T')[0])

  // Set the end date in the state
  // console.log('endDate.toISOString SubscriptionNewStartAndEndDate',endDate.toISOString().split('T')[0])
  const endDateNew = endDate.toISOString().split('T')[0];

  console.log('endDateNewt questionare page:', endDateNew);
  setNewStartDateForSub(startDateNew);
  setNewEndDateForSub(endDateNew);

  // setEndDateBoolean(endDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD


};
// const isWithinDiscount = isTodayWithinDiscountPeriod(onePrice?.dsStDat, onePrice?.dsEnDat);
//console.log('isWithinDiscount questionare page',isWithinDiscount);  // This will log 'hello' every time the map function iterates over onePrice
  return (
  
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>
                <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{t("Questionnaire")}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>
            </AccountBackground>
            <Spacer size="large">
              <InfoFieldParent>
                  <ScrollView>
                  {/* <SelectorTextField>
                      <FormLabel>{t("Certifications")}:</FormLabel>
                  </SelectorTextField> */}
                  {/* <Pressable onPress={addQuestionnaireInput} style={{backgroundColor:'#000',borderRadius:30,width:40,height:40,}}>
                    <AntDesign name="pluscircleo" size={40} color="white" />
                </Pressable> */}
                  {QuestionnaireInputsItems}
                  </ScrollView>
              </InfoFieldParent>
            </Spacer>
            <Modal
              animationType="slide"
              transparent={true}
              visible={loading || showSuccess} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loading && !showSuccess && (
                    <>
                      <Text style={styles.loadingText}>{t('Loading_with_dots')}</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {showSuccess && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      <Text style={styles.successText}>{t('َQuestionnaire_data_saved_successfully_and_you_will_be_directed_to_subscription_page')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
            <Spacer size="large">
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}}
            onPress={()=>{
            // if(onePrice.curncy === "EGP"){
            //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
            //     TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult,xpayCommissionResult,bankCommissionResult);
            //   //   if(isWithinDiscount){
            //   //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
            //   //   TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult);
            //   //   //console.log('onePrice?.NetPrc question page',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
            //   // }else{
            //   //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price,ourCommissionResult);
            //   //   TrainerRecievedPrice(onePrice?.price,onePrice?.curncy);
            //   //   //console.log('onePrice?.price question page ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

            //   // }
            // }else{
            //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);

            //   // if(isWithinDiscount){
            //   //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
            //   //   // TrainerRecievedPrice(onePrice?.NetPrc);
            //   //   //console.log('onePrice?.NetPrc question page',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
            //   // }else{
            //   //   SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);
            //   //   // TrainerRecievedPrice(onePrice?.price);
            //   //   //console.log('onePrice?.price question page ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

            //   // }
            // }
              SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);

              sendSubscriptionDataWithQuestionnaireData(QuestionnaireInfo,newPersonalTrainerRow,onePrice,userToken,userId,speKey);
              }}
           >
                    <CalendarFullSizePressableButtonText >{t("Save_and_subscribe")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
            </Spacer>
            {/* <Spacer size="large">
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}}
            onPress={()=>{
              subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
              getPeriodOfSubscribe(onePrice?.count,onePrice?.period)

              }}
           >
                    <CalendarFullSizePressableButtonText >{t("Save_and_subscribe")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
            </Spacer> */}
            {showGateway ? (
            <Modal
              visible={showGateway}
              onDismiss={() => setShowGateway(false)}
              onRequestClose={() => setShowGateway(false)}
              animationType={"fade"}
              transparent>
              <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                  <TouchableOpacity
                    style={{padding: 13}}
                    onPress={() => setShowGateway(false)}>
                    <Feather name={'x'} size={24} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#00457C',
                    }}>
                    {t('PayPal_GateWay')}
                  </Text>
                  <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                    <ActivityIndicator size={24} color={progClr} />
                  </View>
                </View>
                <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent }}
                style={{ flex: 1 }}
                onMessage={handleMessage}
              />
              </View>
            </Modal>
          ) : null}
          {showPaymobGateway ? (
            <Modal
              visible={showPaymobGateway}
              onDismiss={() => setShowPaymobGateway(false)}
              onRequestClose={() => setShowPaymobGateway(false)}
              animationType={"fade"}
              transparent>
              <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                  <TouchableOpacity
                    style={{padding: 13}}
                    onPress={() => setShowPaymobGateway(false)}>
                    <Feather name={'x'} size={24} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#00457C',
                    }}>
                    {t('PayMob_GateWay')}
                  </Text>
                  <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                    <ActivityIndicator size={24} color={progClr} />
                  </View>
                </View>
                <WebView
                originWhitelist={['*']}
                source={{ html: htmlPaymobContent }}
                style={{ flex: 1 }}
                onMessage={handlePaymobMessage}
              />
              </View>
            </Modal>
          ) : null}
          {showXPayGateway ? (
            <Modal
              visible={showXPayGateway}
              onDismiss={() => setShowXPayGateway(false)}
              onRequestClose={() => setShowXPayGateway(false)}
              animationType={"fade"}
              transparent>
              <View style={styles.webViewCon}>
                <View style={styles.wbHead}>
                  <TouchableOpacity
                    style={{padding: 13}}
                    onPress={() => setShowXPayGateway(false)}>
                    <Feather name={'x'} size={24} />
                  </TouchableOpacity>
                  <Text
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#00457C',
                    }}>
                    {t('XPay_GateWay')}
                  </Text>
                  <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                    <ActivityIndicator size={24} color={progClr} />
                  </View>
                </View>
                <WebView
                originWhitelist={['*']}
                source={{ html: htmlXPayContent }}
                style={{ flex: 1 }}
                onMessage={handleXPayMessage}
              />
              </View>
            </Modal>
          ) : null}
            {/* <>
                        {(
                          newPersonalTrainerRow.country == "Egypt"
                        )?(
                          <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}} onPress={()=>{
                            subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
                            setOnePriceConstSubscribe(onePrice);
                            getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                            }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}m</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                        ):(
                          <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}} onPress={()=>{
                          subscribeToTrainerFunc(newPersonalTrainerRow,onePrice);
                          setOnePriceConstSubscribe(onePrice);
                          getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                          }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}p</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                        )}
                      </> */}
            <Spacer size="large"></Spacer>
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
  CoimngSoonViewContainer: {
      width: width - 20, // he screen width minus padding
      height: 200, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    imageCoimngSoon: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
    QuestionTextArea:{
        backgroundColor:"white",
        borderWidth:1,
        borderColor:'black',
        borderRadius:6,
        padding:10,
        textAlignVertical: 'top',
        height:150,
    },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
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

