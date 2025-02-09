import React, { useState, useContext } from 'react';
import { Pressable,StyleSheet,ScrollView,View,Alert,Modal,TouchableOpacity,Text,ActivityIndicator} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  PageContainer,
  FormLabelView,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  ServiceCloseInfoButtonText,
  ServiceCloseInfoButtonTextView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  GenderSelector,

} from "../components/account.styles";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Feather from 'react-native-vector-icons/Feather';
import "./i18n";
import { useTranslation } from 'react-i18next';

import { Spacer } from "../../../components/spacer/spacer.component";
import { SelectItem  } from '@ui-kitten/components';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { useDate } from './DateContext'; // Import useDate from the context
// Context API
import AuthGlobal from "../Context/store/AuthGlobal";
import { setCurrentUser } from "../Context/actions/Auth.actions";

export const SubscribePageScreen = ({navigation,route}) => {
  // const newPersonalTrainerRow = route.params?.newPersonalTrainer;
  const context = useContext(AuthGlobal);

  const params = route.params || {};

  const { newPersonalTrainer = {}, existingTrainerPricingCont = [],AdminSettingsAppRowConst={} } = params;
  const newPersonalTrainerRow = newPersonalTrainer;
  const AdminSettingsAppRow = AdminSettingsAppRowConst;

  const [OnePriceConstSubscribe,setOnePriceConstSubscribe] =useState("");
  
  const [selectedPeriod,setSelectedPeriod] =useState("");
  const [countPlusPeriod,SetCountPlusPeriod] =useState("");
  const [newNetPriceAferDiscountPeriodCheck,SetNewNetPriceAferDiscountPeriodCheck] =useState("");
  const [youRecieveFinalResult,setYouRecieveFinalResult] =useState("");
  const [ourCommissionResult, setOurCommissionResult] = useState('');
  const [xpayEgCommissionNumber, setXpayEgCommissionNumber] = useState('');
  const [xpayForeignCommissionNumber, setXpayForeignCommissionNumber] = useState('');
  const [bankCommissionResult, setBankCommissionResult] = useState('');
    
  const [newStartDateForSub, setNewStartDateForSub] = useState('');
  const [newEndDateForSub, setNewEndDateForSub] = useState('');

 
  
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [showGateway, setShowGateway] = useState(false);
  const [showPaymobGateway, setShowPaymobGateway] = useState(false);
  const [showXPayGateway, setShowXPayGateway] = useState(false);

  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const { t, i18n } = useTranslation();

//console.log('newPersonalTrainerRow?.userId subscribe',newPersonalTrainerRow?.userId);
//console.log('newPersonalTrainerRow subscribe',newPersonalTrainerRow);
//console.log('AdminSettingsAppRow subscribe',AdminSettingsAppRow);

//console.log('existingTrainerPricingCont',existingTrainerPricingCont);
//console.log('newPersonalTrainerRow.country',newPersonalTrainerRow?.country);
//console.log("context.stateUser?.userProfile?.country subscribe",context.stateUser?.userProfile?.country);

if(newPersonalTrainerRow?.TrnQes){
  //console.log('newPersonalTrainerRow.TrnQes',newPersonalTrainerRow?.TrnQes);
  //console.log('true');

}else{
  //console.log('false');

}


const isArabic = i18n.language === 'ar';

    ////////////// Start periodData////////////////
    useFocusEffect(
      React.useCallback(() => {
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        ////console.log('tokeeen:',res);
        setUserToken(res);
      AsyncStorage.getItem("currentUser").then((user) => {
    
          const storedUser = JSON.parse(user);
          setUserId(storedUser.id);
    
          
          const unsubscribe = addEventListener(state => {
            ////console.log("Connection type--", state.type);
            ////console.log("Is connected?---", state.isConnected);
            setTriainerConnected(state.isConnected);
            if(newPersonalTrainerRow?.TrSpCm){
              setOurCommissionResult(parseFloat((newPersonalTrainerRow?.TrSpCm/100)?.toFixed(4)));

            }else{
              setOurCommissionResult(parseFloat((AdminSettingsAppRow?.admCom/100)?.toFixed(4)));
            }
            if(AdminSettingsAppRow?.xpyEgCom){
              setXpayEgCommissionNumber(parseFloat((AdminSettingsAppRow?.xpyEgCom/100)?.toFixed(4)));

            }else{
              setXpayEgCommissionNumber(0);
            }
            if(AdminSettingsAppRow?.xpyForCom){
              setXpayForeignCommissionNumber(parseFloat((AdminSettingsAppRow?.xpyForCom/100)?.toFixed(4)));

            }else{
              setXpayForeignCommissionNumber(0);
            }
            if(AdminSettingsAppRow?.bnkCom){
              setBankCommissionResult(parseFloat((AdminSettingsAppRow?.bnkCom/100)?.toFixed(4)));

            }else{
              setBankCommissionResult(0);
            }

          });
          
          // Unsubscribe
          unsubscribe();
        })
      });
     
    
    }, [])
    );
    const periodData = [
      '30','60','90','120','150','180','210','240','270','300','330','360'
    ];
    const renderPeriodOption = (title,i) => (
      <SelectItem title={`${(title/30).toString()} ${t('Month')}`} key={i} />
    );
    const displayPeriodValue = periodData[selectedPeriod.row];
    ////////////// End periodData////////////////
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
    const selectedDatesStart=selectedDates.start;
    const selectedDatesEnd=selectedDates.end;

    const subscribeToTrainerFunc = async (newPersonalTrainerRow,onePrice) => {
      console.log("subscribeToTrainerFunc newPersonalTrainerRow",newPersonalTrainerRow);
     console.log("subscribeToTrainerFunc onePrice",onePrice);

      // if(!displayPeriodValue || !selectedDatesStart || !selectedDatesEnd){
      //   Alert.alert(`${t('please_select_period_start_and_end_dates')}`);
      //   return;
      // }
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
          setShowGateway(response?.data?.value)
          }).catch(error => {
            // Handle error
            
            Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
          });
    
 
     }else{
      Alert.alert(`${t('To_Add_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
    }

    const freeSubscribeToTrainerFunc = async () => {
      if(!displayPeriodValue || !selectedDatesStart || !selectedDatesEnd){
        Alert.alert(`${t('please_select_period_start_and_end_dates')}`);
        return;
      }
      const newData = {
        traineeToken:userToken,
        trainerId:newPersonalTrainerRow?.userId,
        status:'active',
        period:displayPeriodValue,
        strDat:selectedDates.start,
        endDat:selectedDates.end,
        
      };

      ////console.log('newData: ',newData);
      
    
     if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-subscribe-free`, newData)
      .then((response) => {
          //console.log('response?.data?.messag', response?.data?.message);
          //setShowGateway(response?.data?.value)
          Alert.alert(`${t(' ')}`,`${t(response?.data?.message)}`);
          }).catch(error => {
            // Handle error
            
            Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
          });
    
 
     }else{
      Alert.alert(`${t('To_Add_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
    }

    const subscribeToTrainerFuncWithPayMob = async (newPersonalTrainerRow,onePrice) => {
     console.log("subscribeToTrainerFuncWithPayMob newPersonalTrainerRow",newPersonalTrainerRow);
     console.log("subscribeToTrainerFuncWithPayMob onePrice",onePrice);

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
      axios.post(`https://life-pf.com/api/trainer-subscribe-with-paymob`, newData)
      .then((response) => {
          ////console.log('response?.data?.value', response?.data?.value);
          setShowPaymobGateway(response?.data?.value)
          }).catch(error => {
            // Handle error
            
            Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
          });
    
 
     }else{
      Alert.alert(`${t('To_Add_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
    }

    const subscribeToTrainerFuncWithXPay = async (newPersonalTrainerRow,onePrice) => {
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
           setShowXPayGateway(response?.data?.value)
           }).catch(error => {
             // Handle error
             
             Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
           });
     
  
      }else{
       Alert.alert(`${t('To_Add_your_data')}`,
       `${t('You_must_be_connected_to_the_internet')}`);
      }
     }

    const traineeId = newPersonalTrainerRow?.trneId;
  const trainerId = newPersonalTrainerRow?.trnrId;
  //console.log('newPersonalTrainerRow price',newPersonalTrainerRow.price == 0);
        // userToken:userToken,
        // trnrId:newPersonalTrainerRow?.userId,
        // status:'active',
        // period:displayPeriodValue,
        // strDat:selectedDates.start,
        // endDat:selectedDates.end,
        const getPeriodOfSubscribe =  (count,period) => {
          //console.log('period + count',`${count} ${period}`);
          SetCountPlusPeriod(`${count} ${period}`);

        }
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
          <input type="hidden" name="curncy" value="${OnePriceConstSubscribe?.curncy}">

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
          <input type="hidden" name="curncy" value="${OnePriceConstSubscribe?.curncy}">

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
        <input type="hidden" name="curncy" value="${OnePriceConstSubscribe?.curncy}">

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

// Step 1: Check if there's a matching price row for the user's country
const matchingCountryPrice = existingTrainerPricingCont?.find(onePrice => onePrice?.ctryNm === context.stateUser?.userProfile?.country);
  //console.log('matchingCountryPrice',matchingCountryPrice);
const fallbackWorldwidePrice = existingTrainerPricingCont?.find(onePrice => !onePrice?.ctryNm && (onePrice?.wrldwd == "1" || onePrice?.wrldwd == 1 || onePrice?.wrldwd == true || onePrice?.wrldwd == "true" ) );
//console.log('fallbackWorldwidePrice',fallbackWorldwidePrice);
const isTodayWithinDiscountPeriod = (startDate, endDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return today >= start && today <= end;
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


const SubscriptionNewStartAndEndDate = (onePrice) =>{


    const selectedPeriod = onePrice?.period;
    const count = onePrice?.count;
    console.log('selectedPeriod SubscriptionNewStartAndEndDate',selectedPeriod)
    console.log('count SubscriptionNewStartAndEndDate',count)

    // Create a new Date object for the start date
    // const today = new Date();
    const startDate = new Date();
    const startDateNew = new Date().toISOString().split('T')[0];

    console.log('startDateNew:', startDateNew);

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
  console.log('currentMonth:', currentMonth);

  const newMonth = parseInt(currentMonth) + parseInt(count);
  console.log('newMonth:', newMonth);

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

    console.log('endDateNew:', endDateNew);
    setNewStartDateForSub(startDateNew);
    setNewEndDateForSub(endDateNew);

    // setEndDateBoolean(endDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD


};
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t("Subscribe")}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          {(existingTrainerPricingCont?.length >= 1) ? (
              <View style={styles.headerTrainerPricing}>
              {
                (
                  matchingCountryPrice != undefined || fallbackWorldwidePrice != undefined
                )?(
                  <>
                    {/* <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCountry : styles.EnglishHeaderTrainerPricingCountry]}>{t('Country')}</Text> */}
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCurrency : styles.EnglishHeaderTrainerPricingCurrency]}>{t('Currency')}</Text>

                
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingNetPrice : styles.EnglishHeaderTrainerPricingNetPrice]}>{t('Net_Price')}</Text>

                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingPeriod : styles.EnglishHeaderTrainerPricingPeriod]}>{t('Period')}</Text>

                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCount : styles.EnglishHeaderTrainerPricingCount]}>{t('Count')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingInformations : styles.EnglishHeaderTrainerPricingInformations]}>{t('Informations')}</Text>
                {/* <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingDiscount : styles.EnglishHeaderTrainerPricingDiscount]}>{t('Discount')}</Text> */}

                  </>
                ):(null)
              }
                
              </View>
            ):null}
            
            {existingTrainerPricingCont?.map((onePrice) => {
              //console.log('onePrice?.ctryNm',onePrice?.ctryNm);  // This will log 'hello' every time the map function iterates over onePrice
              // Check if today is within the discount period
            {/* const isWithinDiscount = isTodayWithinDiscountPeriod(onePrice?.dsStDat, onePrice?.dsEnDat); */}
            //console.log('isWithinDiscount',isWithinDiscount);  // This will log 'hello' every time the map function iterates over onePrice
            //console.log('onePrice?.dsStDat',onePrice?.dsStDat);  // This will log 'hello' every time the map function iterates over onePrice
            //console.log('onePrice?.dsEnDat',onePrice?.dsEnDat);  // This will log 'hello' every time the map function iterates over onePrice
            //console.log('onePrice?.NetPrc',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
            //console.log('onePrice?.price',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice
              {/* if(isWithinDiscount){
                //console.log('onePrice?.NetPrc if',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
              }else{
                //console.log('onePrice?.price if ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

              } */}

             
              return(
              <>
              <View key={onePrice?.speKey} style={styles.viewContainer}>
              
              {(onePrice?.ctryNm == context.stateUser?.userProfile?.country)?(
                  <View style={styles.trainerPricingContainer}>     
                    {/* <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCountry : styles.EnglishTrainerPricingCountry]}>{(onePrice?.wrldwd == "1" || onePrice?.wrldwd == "yes" || onePrice?.wrldwd == "true" || onePrice?.wrldwd == true) ? ("Worldwide ") : (onePrice?.ctryNm ? onePrice?.ctryNm : '')}</Text> */}
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrency : styles.EnglishTrainerPricingCurrency]}>{onePrice?.curncy || '0'}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNetPrice : styles.EnglishTrainerPricingNetPrice]}>{onePrice?.NetPrc}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingPeriod : styles.EnglishTrainerPricingPeriod]}>{onePrice?.period || '0'}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCount : styles.EnglishTrainerPricingCount]}>{onePrice?.count || ''}</Text>
                    <TouchableOpacity style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingInformations : styles.EnglishTrainerPricingInformations]} onPress={() => navigation.navigate('TrainerPricingInfoInSubscribe', { onePrice: onePrice })}>
                      <MaterialCommunityIcons name="eye-settings" size={24} color="black"  style={{textAlign:'center'}}/>
                    </TouchableOpacity>
                    {/* <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingDiscount : styles.EnglishTrainerPricingDiscount]}>{onePrice?.disVal || '0'}</Text> */}
                    
                    {(
                      newPersonalTrainerRow?.TrnQes != null && newPersonalTrainerRow?.TrnQes != ""
                    )?(
                      <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>navigation.navigate('QuestionnaireBeforeSubscribe',{trainer_pricing:onePrice,trainer_info:newPersonalTrainerRow})}>

                      <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                    </TouchableOpacity>
                    ):(
                      <>
                        {/* {(
                         onePrice?.curncy == "EGP"
                        )?(
                          <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                            subscribeToTrainerFuncWithXPay(newPersonalTrainerRow,onePrice);
                            SubscriptionNewStartAndEndDate(onePrice);
                            setOnePriceConstSubscribe(onePrice);
                            getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                            SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult,xpayCommissionResult,bankCommissionResult);
                            // if(isWithinDiscount){
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            //     TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult);
                            //     //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                            //   }else{
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);
                            //     TrainerRecievedPrice(onePrice?.price,onePrice?.curncy,ourCommissionResult);

                            //     //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                            //   }
                            }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                        ):(
                          <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                          subscribeToTrainerFunc(newPersonalTrainerRow,onePrice);
                          SubscriptionNewStartAndEndDate(onePrice);

                          setOnePriceConstSubscribe(onePrice);
                          getPeriodOfSubscribe(onePrice?.count,onePrice?.period);
                          SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);

                          // if(isWithinDiscount){
                          //       SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                          //       //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                          //     }else{
                          //       SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);

                          //       //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                          //     }
                          }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                        )} */}
                        <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                            subscribeToTrainerFuncWithXPay(newPersonalTrainerRow,onePrice);
                            SubscriptionNewStartAndEndDate(onePrice);
                            setOnePriceConstSubscribe(onePrice);
                            getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                            SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionResult);
                            // if(isWithinDiscount){
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            //     TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult);
                            //     //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                            //   }else{
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);
                            //     TrainerRecievedPrice(onePrice?.price,onePrice?.curncy,ourCommissionResult);

                            //     //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                            //   }
                            }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                      </>
                    )}
                    {/* <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                    subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
                    setOnePriceConstSubscribe(onePrice);
                    getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                    }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}m</CalendarFullSizePressableButtonText>
                          </TouchableOpacity> */}



                    {/* <View style={[isArabic ? styles.ArabicTrainerPricingDiscount : styles.EnglishTrainerPricingDiscount]}>{onePrice?.disVal ? 
                        <Text style={{ color: 'black',fontSize:17, height:25}}>✔</Text>
                     : ''}</View> */}
                  
                  </View>
                  
              ):(
                <>
                  {(
                    !onePrice?.ctryNm && (onePrice?.wrldwd == "1" || onePrice?.wrldwd == 1 || onePrice?.wrldwd == true || onePrice?.wrldwd == "true" )&& !matchingCountryPrice
                  )?(
                  <View style={styles.trainerPricingContainer}>     
                    {/* <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCountry : styles.EnglishTrainerPricingCountry]}>{(onePrice?.wrldwd == "1" || onePrice?.wrldwd == "yes" || onePrice?.wrldwd == "true" || onePrice?.wrldwd == true) ? ("Worldwide ") : (onePrice?.ctryNm ? onePrice?.ctryNm : '')}</Text> */}
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrency : styles.EnglishTrainerPricingCurrency]}>{onePrice?.curncy || '0'}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNetPrice : styles.EnglishTrainerPricingNetPrice]}>{onePrice?.NetPrc}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingPeriod : styles.EnglishTrainerPricingPeriod]}>{onePrice?.period || '0'}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCount : styles.EnglishTrainerPricingCount]}>{onePrice?.count || ''}</Text>
                    <TouchableOpacity style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingInformations : styles.EnglishTrainerPricingInformations]} onPress={() => navigation.navigate('TrainerPricingInfoInSubscribe', { onePrice: onePrice })}>
                      <MaterialCommunityIcons name="eye-settings" size={24} color="black"  style={{textAlign:'center'}}/>
                    </TouchableOpacity>
                    {/* <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingDiscount : styles.EnglishTrainerPricingDiscount]}>{onePrice?.disVal || '0'}</Text> */}
                    
                    {(
                      newPersonalTrainerRow?.TrnQes != null && newPersonalTrainerRow?.TrnQes != ""
                    )?(
                      <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>navigation.navigate('QuestionnaireBeforeSubscribe',{trainer_pricing:onePrice,trainer_info:newPersonalTrainerRow})}>

                      <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                    </TouchableOpacity>
                    ):(
                      <>
                        {/* {(
                         onePrice?.curncy == "EGP"
                        )?(
                          <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                            // subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
                            subscribeToTrainerFuncWithXPay(newPersonalTrainerRow,onePrice);

                            SubscriptionNewStartAndEndDate(onePrice);
                            setOnePriceConstSubscribe(onePrice);
                            getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                            SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult,xpayCommissionResult,bankCommissionResult);
                            // if(isWithinDiscount){
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            //     TrainerRecievedPrice(onePrice?.NetPrc,ourCommissionResult);
                            //     //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                            //   }else{
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);
                            //     TrainerRecievedPrice(onePrice?.price,ourCommissionResult);

                            //     //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                            //   }
                            }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                        ):(
                          <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                          subscribeToTrainerFunc(newPersonalTrainerRow,onePrice);
                          SubscriptionNewStartAndEndDate(onePrice);
                          setOnePriceConstSubscribe(onePrice);
                          getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                          SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);

                          // if(isWithinDiscount){
                          //       SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                          //       //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                          //     }else{
                          //       SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);

                          //       //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                          //     }
                          }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                        )} */}
                        <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                            // subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
                            subscribeToTrainerFuncWithXPay(newPersonalTrainerRow,onePrice);

                            SubscriptionNewStartAndEndDate(onePrice);
                            setOnePriceConstSubscribe(onePrice);
                            getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                            SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            TrainerRecievedPrice(onePrice?.NetPrc,onePrice?.curncy,ourCommissionResult,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionResult);
                            // if(isWithinDiscount){
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.NetPrc);
                            //     TrainerRecievedPrice(onePrice?.NetPrc,ourCommissionResult);
                            //     //console.log('onePrice?.NetPrc TouchableOpacity',onePrice?.NetPrc);  // This will log 'hello' every time the map function iterates over onePrice
                            //   }else{
                            //     SetNewNetPriceAferDiscountPeriodCheck(onePrice?.price);
                            //     TrainerRecievedPrice(onePrice?.price,ourCommissionResult);

                            //     //console.log('onePrice?.price TouchableOpacity ',onePrice?.price);  // This will log 'hello' every time the map function iterates over onePrice

                            //   }
                            }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}</CalendarFullSizePressableButtonText>
                          </TouchableOpacity>
                      </>
                    )}
                    {/* <TouchableOpacity style={{backgroundColor:'#000',height:50,width:84,borderRadius:35,justifyContent:'center',alignItems:'center',position:'absolute',right:'4%',textAlign:"center"}} onPress={()=>{
                    subscribeToTrainerFuncWithPayMob(newPersonalTrainerRow,onePrice);
                    setOnePriceConstSubscribe(onePrice);
                    getPeriodOfSubscribe(onePrice?.count,onePrice?.period)
                    }}>

                            <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('subscribe')}m</CalendarFullSizePressableButtonText>
                          </TouchableOpacity> */}



                    {/* <View style={[isArabic ? styles.ArabicTrainerPricingDiscount : styles.EnglishTrainerPricingDiscount]}>{onePrice?.disVal ? 
                        <Text style={{ color: 'black',fontSize:17, height:25}}>✔</Text>
                     : ''}</View> */}
                  
                  </View>
                  
                  ):(
                    null
                  )}
                </>
              )}
              </View> 
              </>
              );
            })}
          {/* <Spacer size="large">
            <InputField>
              <FormLabelView>
                <FormLabel>{t("Period")}:</FormLabel>
              </FormLabelView>
                <GenderSelector
                  selectedIndex={selectedPeriod}
                  onSelect={(index) => setSelectedPeriod(index)}
                  placeholder={t('Select_Period')}
                  value={displayPeriodValue ? `${(displayPeriodValue/30).toString()} ${t('Month')}` : ""}
                >
                  {periodData.map(renderPeriodOption)}
                </GenderSelector>
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
                <FormLabelView>
                  <FormLabel>{t('Select_Dates')}:</FormLabel>
                </FormLabelView>
                <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
          onPress={handleOpenCalendar}>
                  <CalendarFullSizePressableButtonText >{t('Select_Dates')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              <PlansCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onSelectDateRange={handleSelectDateRange} />
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('Start_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.start ? selectedDates.start : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('End_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.end ? selectedDates.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer> */}
        {/* {
          (
            newPersonalTrainerRow?.noRfn
          )?(null):(
            <Spacer size="large">
              <View style={{flex:1,flexDirection:"column",}}>
                <FormLabelView style={{width:"100%"}}>
                  <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Refund_Policy')}</FormLabel>
                </FormLabelView>
                <ServiceCloseInfoButtonTextView style={{marginLeft:10,marginRight:10,}}>
                  <ServiceCloseInfoButtonText>{newPersonalTrainerRow?.rfnPlc}</ServiceCloseInfoButtonText>
                </ServiceCloseInfoButtonTextView>
              </View>
            </Spacer>
          )

        } */}
        
        {/* <Spacer size="large">
          <View style={{flex:1}}>
            <FormLabelView style={{width:"100%"}}>
              <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('PT_avaiable_slots')}</FormLabel>
            </FormLabelView>
          </View>
        </Spacer> */}
        {/* <Spacer size="small">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('From')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{newPersonalTrainerRow?.strDat}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer> */}
        {/* <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('To')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{newPersonalTrainerRow?.endDat}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer> */}
          {/* <Spacer size="large">
          <View style={{marginLeft:10,marginRight:10,}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>freeSubscribeToTrainerFunc()}>
              <CalendarFullSizePressableButtonText >{t('Subscribe')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
          </View>
        </Spacer> */}
        
          
              {/* <Spacer size="large">
              <View style={{marginLeft:10,marginRight:10,}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>subscribeToTrainerFunc()}>
                  <CalendarFullSizePressableButtonText >{t('Subscribe_with_paypal')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </View>
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
            {/* <Spacer size="medium">
              <View style={{marginLeft:10,marginRight:10,}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>subscribeToTrainerFuncWithPayMob()}>
                  <CalendarFullSizePressableButtonText >{t('Subscribe_with_paymob')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </View>
            </Spacer> */}
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
        {/* <Spacer size="medium">
          <View style={{marginLeft:10,marginRight:10,}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
              <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
          </View>
        </Spacer> */}
        <Spacer size="large"></Spacer>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  btnCon: {
    height: 45,
    width: '70%',
    elevation: 1,
    backgroundColor: '#00457C',
    borderRadius: 3,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 18,
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    
  },
  viewContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    marginBottom:25,
    
    
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  trainerPricingContainer:{
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    // marginLeft:10,
    marginBottom:50,
  },
 
  discountContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
 
  discountCountryText:{
    width:60,
    flexWrap: 'wrap',
    marginRight:4,
  },
  discountTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    },
  headerTrainerPricing:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 20,
    width:"100%",
    // backgroundColor:"yellow",
  },
  
  FromToViewDiscount:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 15,
    width:"100%",
  },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"black",
    // marginBottom: 10,
    //  flex: 1,
    
  },
//   ArabicHeaderTrainerPricingCountry :{
// position:'absolute',
//     left:'4%',
//   },
// EnglishHeaderTrainerPricingCountry :{
// position:'absolute',
//     left:'1%',
// },
  ArabicHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'4%',
    
  },
  EnglishHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'1%',
    
  },
  ArabicHeaderTrainerPricingDiscount :{
position:'absolute',
    left:'20%',
 
},
EnglishHeaderTrainerPricingDiscount:{
  position:'absolute',
    left:'17%',
  
},
ArabicHeaderTrainerPricingInformations :{
  position:'absolute',
    left:'60%',
   
  },
  EnglishHeaderTrainerPricingInformations:{
    position:'absolute',
      left:'58%',
    
  },

  ArabicHeaderTrainerPricingNetPrice :{
    
    position:'absolute',
    left:'22%',

    // left:'63%',
    width:50,
    marginVertical: -6

  },
EnglishHeaderTrainerPricingNetPrice:{
  
  position:'absolute',
  left:'19%',

  // left:'61%',
    width:50,
    marginVertical: -6
},
ArabicHeaderTrainerPricingPeriod :{
  position:'absolute',
    left:'39%',

}, 
EnglishHeaderTrainerPricingPeriod:{
position:'absolute',
    left:'45%',
    
},
ArabicHeaderTrainerPricingCount :{
  position:'absolute',
    left:'49%',

},
EnglishHeaderTrainerPricingCount:{
  position:'absolute',
    left:'32%',

},


  ArabicHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'69%',
  },
  EnglishHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'61%',
  },
  trainerPricingTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    flex: 1,
    },

// ArabicTrainerPricingCountry :{
// position:'absolute',
//     left:'4%',
//     flexWrap: 'wrap',
//       flex:1,
//       width:60,
//   },
// EnglishTrainerPricingCountry :{
// position:'absolute',
//     left:'1%',
//     flexWrap: 'wrap',
//       flex:1,
//       width:60,
// },
  ArabicTrainerPricingCurrency:{
    position:'absolute',
    left:'4%',
    width:50,

    flexWrap: 'wrap',
      flex:1,
  },
  EnglishTrainerPricingCurrency:{
    position:'absolute',
    left:'3%',
    width:50,
    flexWrap: 'wrap',
      flex:1,
  },

ArabicTrainerPricingPeriod :{
  position:'absolute',
    left:'52%',
}, 
EnglishTrainerPricingPeriod:{
  
position:'absolute',
    left:'47%',

},
ArabicTrainerPricingCount :{
  
    position:'absolute',
    left:'41%',


},
EnglishTrainerPricingCount:{
  position:'absolute',
    left:'35%',
},
ArabicTrainerPricingDiscount :{
  
    position:'absolute',
    left:'22%',
  //   borderColor:'black',
  // borderWidth:1,
  // borderRadius:5,


  // width:25,
  // height:25,
  // alignItems: 'center',
  // justifyContent: 'center',
  // marginVertical:13,
},
EnglishTrainerPricingDiscount:{
  position:'absolute',
  left:'19%',
  
  // backgroundColor:'yellow',
  // borderColor:'black',
  // borderWidth:1,
  // borderRadius:5,
  // width:25,
  // height:25,
  // alignItems: 'center',
  // justifyContent: 'center',
  // marginVertical:13,
},
ArabicTrainerPricingInformations :{
  
    position:'absolute',
    left:'66%',
  //   borderColor:'black',
  // borderWidth:1,
  // borderRadius:5,


  // width:25,
  // height:25,
  // alignItems: 'center',
  // justifyContent: 'center',
  // marginVertical:13,
},
EnglishTrainerPricingInformations:{
  position:'absolute',
  left:'62%',
  // backgroundColor:'yellow',
  // borderColor:'black',
  // borderWidth:1,
  // borderRadius:5,
  // width:25,
  // height:25,
  // alignItems: 'center',
  // justifyContent: 'center',
  // marginVertical:13,
},
ArabicTrainerPricingNetPrice :{
 position:'absolute',
    // left:'66%',
    left:'22%',

  width:50,
},
EnglishTrainerPricingNetPrice:{

position:'absolute',
  left:'19%',
  width:50,
},

    ArabicTrainerPricingNumberText:{
      position:'absolute',
      left:'71%',
    },
    EnglishTrainerPricingNumberText:{
      position:'absolute',
      left:'76%',
    },
  ArabicHeaderDiscountDiscountPercentText:{
    position:'absolute',
    left:'7%',
  },
  EnglishHeaderDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  ArabicHeaderDiscountStartDateText:{
    position:'absolute',
    left:'30%',
  },
  EnglishHeaderDiscountStartDateText:{
    position:'absolute',
    left:'30%',
  },
  ArabicHeaderDiscountEndDateText:{
    position:'absolute',
    left:'55%',
  },
  EnglishHeaderDiscountEndDateText:{
    position:'absolute',
    left:'55%',
  },
  ArabicDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  EnglishDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  ArabicDiscountStartDateText:{
    position:'absolute',
    left:'25%',
  },
  EnglishDiscountStartDateText:{
    position:'absolute',
    left:'25%',
  },
  ArabicDiscountEndDateText:{
    position:'absolute',
    left:'52%',
  },
  EnglishDiscountEndDateText:{
    position:'absolute',
    left:'52%',
  },
  headerDiscountDiscountPercentText:{
    marginLeft:0,
  },
  discountDiscountPercentText:{
    marginLeft:0,
  },
  headerDiscountStartDateText:{
    marginLeft:-40,
  },
  discountStartDateText:{
    marginLeft:26,
  },
  headerDiscountEndDateText:{
    marginLeft:-20,
  },
  discountEndDateText:{
    marginRight:29,
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


});