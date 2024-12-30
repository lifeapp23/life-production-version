import React, { useState,useContext,useEffect } from 'react';
import { ScrollView,View,Text,TouchableOpacity,TextInput, Modal,Alert,StyleSheet,Pressable} from "react-native";
import { Spinner } from '@ui-kitten/components';

import {AntDesign} from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';
import CountryPicker from 'react-native-country-picker-modal';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';

import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  NewFormLabelDateRowView,
  FormInputView,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  CountryParent,
  CountryPickerView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addTrainerPricingEntry,editTrainerPricingEntry, removeTrainerPricingEntry, addDiscountEntry,editDiscountEntry,removeDiscountEntry} from './trainer_pricing_store';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import CurrencyPicker from "react-native-currency-picker";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { insertTrainerPricingCurrency,fetchTrainerPricingCurrency,deleteTrainerPricingCurrencyRow} from "../../../../database/trainer_pricing_currency";
import { insertTrainerDiscount,fetchTrainerDiscount,deleteTrainerDiscountRow} from "../../../../database/trainer_pricing_discount";
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-native-paper';
import { PricingCalendarScreen } from "./pricing_custom_calendar";
import { DiscountCalendarScreen } from "./discount_custom_calendar";

import axios from 'axios';
import AuthGlobal from "../Context/store/AuthGlobal";

export const TrainerAddEditPricingScreen = ({navigation,route}) => {
  const context = useContext(AuthGlobal);
  const params = route.params || {};

  const { editedEntry = {}, isEditMode = false } = params;

  const [priceAddEntry, setPriceAddEntry] = useState("");     
  const [countryCurrency, setCountryCurrency] = useState('');
  const [editedSpeKey, setEditedSpeKey] = useState('');
  const [views, setViews] = useState([]);
  // const [editedEntry, setEditedEntry] = useState(null);
  // const [isEditMode, setIsEditMode] = useState(false);
  
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [dataTrainerPricing, setDataTrainerPricing] = useState([]);
  const [discountDataTable, setDiscountDataTable] = useState([]);
  const [AdminSettingsData,setAdminSettingsData]=useState({});
  const [isAllowForeignTrainersOn, setIsAllowForeignTrainersOn] = useState(false);
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [countryName, setCountryName] = useState(null);
  const [countryCode, setCountryCode] = useState(null); // Ensure countryCode is initially null
  const [selectedNumbersIndex, setSelectedNumbersIndex] = useState('');
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState('');
  const [WorldWideCheckBox, setWorldWideCheckBox] = useState(false); // Limited or Unlimited
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  const [startDateBoolean,setStartDateBoolean] = useState(null);
  const [endDateBoolean,setEndDateBoolean] = useState(null);
  const [selectingStartDate, setSelectingStartDate] = useState(false);
  ///discount/////
  const [selectedDiscountTypesIndex, setSelectedDiscountTypesIndex] = useState('');
  const [discountValueAddEntry, setDiscountValueAddEntry] = useState('');
const [discountStartDateBoolean,setDiscountStartDateBoolean] = useState(null);
  const [discountEndDateBoolean,setDiscountEndDateBoolean] = useState(null);
  const [discountSelectingStartDate, setDiscountSelectingStartDate] = useState(false);
  const [isDiscountCalendarVisible, setDiscountCalendarVisible] = useState(false);
  const [netPackageNameResult, setNetPackageNameResult] = useState('');
  const [netPackageDescriptionResult, setNetPackageDescriptionResult] = useState('');
  const [netPriceFinalResult, setNetPriceFinalResult] = useState('');

  const [youRecieveFinalResult, setYouRecieveFinalResult] = useState('');
  const [ourCommissionResult, setOurCommissionResult] = useState('');
  const [xpayEgCommissionNumber, setXpayEgCommissionNumber] = useState('');
  const [xpayForeignCommissionNumber, setXpayForeignCommissionNumber] = useState('');

  const [bankCommissionResult, setBankCommissionResult] = useState('');
  
  const [discountSubtractedValueConst, setDiscountSubtractedValueConst] = useState('');
  

  const openStartDateSelector = () => {
    setSelectingStartDate(true);
    setCalendarVisible(true);
  };
  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };
  const handleDateSelect = (date) => {
    if (selectingStartDate) {
      setStartDateBoolean(date);
    } 
    // else {
    //   setEndDateBoolean(date);
    // }
  };
////////////// Start PeriodsNames////////////////
const PeriodsNames = [
  'Day',
  'Month',
  'Year'
];
const renderPeriodsOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayPeriodValue = PeriodsNames[selectedPeriodIndex.row];
////////////// End PeriodsNames////////////////
  
  // Generate the list dynamically based on the input number
  const generateOptions = () => {
    let NumberOfPeriodsOptions = [];
    for (let i = 0; i <= 99; i++) {
  
      // if (i ==0 ){
      //   options.push('custom weight');  // Option titles will start from 0
  
      // }
      if (i >0 && i<=99 ){
          // options.push({ title: `${(i-1) * num}` });// Option titles will start from 0
          NumberOfPeriodsOptions.push(`${(i)}`);
        }
    }
    return NumberOfPeriodsOptions;
  };
  const NumberOfPeriodsOptions = generateOptions();
  let displayNumberOfPeriodsOptions = NumberOfPeriodsOptions[selectedNumbersIndex.row]
  // //console.log('NumberOfPeriodsOptions',NumberOfPeriodsOptions);
////////////// Start discountTypes////////////////
const discountTypes = [
  'Absolute Amount',
  'Percentage',
];
const renderDiscountTypesOption = (title,i) => (
  <SelectItem title={title} key={i} />
);
const displayDiscountTypesValue = discountTypes[selectedDiscountTypesIndex.row];
////////////// End discountTypes////////////////
const openDiscountStartDateSelector = () => {
  setDiscountSelectingStartDate(true);
  setDiscountCalendarVisible(true);
};
const openDiscountEndDateSelector = () => {
  setDiscountSelectingStartDate(false);
  setDiscountCalendarVisible(true);
};
const handleDiscountCloseCalendar = () => {
  setDiscountCalendarVisible(false);
};
const handleDiscountDateSelect = (date) => {
  if (discountSelectingStartDate) {
    setDiscountStartDateBoolean(date);
  } 
  else {
    setDiscountEndDateBoolean(date);
  }
};




///////////End of Discount///////////////
   // Calculate End Date when the user clicks a button or after both period and count are selected
  //  useEffect(() => {
  //   if (!startDateBoolean || selectedPeriodIndex === '' || selectedNumbersIndex === '') {
  //     // alert('Please select a start date, period, and count.');
  //     return;
  //   }

  //   const selectedPeriod = PeriodsNames[selectedPeriodIndex.row];
  //   const count = parseInt(NumberOfPeriodsOptions[selectedNumbersIndex.row], 10); // Convert count to number

  //   // Create a new Date object for the start date
  //   const startDate = new Date(startDateBoolean);

  //   // Calculate the end date based on the selected period and count
  //   let endDate = new Date(startDate);

  //   if (selectedPeriod === "Day") {

  //     endDate.setDate(startDate.getDate() + count);
  //   } else if (selectedPeriod === "Month") {
  //     endDate.setMonth(startDate.getMonth() + count);
  //   } else if (selectedPeriod === "Year") {
  //     endDate.setFullYear(startDate.getFullYear() + count);
  //   }
  //   //console.log('selectedPeriod',selectedPeriod);
  //   //console.log('count',count);

  //   //console.log('startDateBoolean',startDateBoolean);
  //   //console.log('endDate.toISOString',endDate.toISOString().split('T')[0])

  //   // Set the end date in the state
  //   setEndDateBoolean(endDate.toISOString().split('T')[0]); // Format the date as YYYY-MM-DD
  // }, [startDateBoolean,selectedPeriodIndex, selectedNumbersIndex]);

  const { t, i18n } = useTranslation();

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
        if(state.isConnected){
          setLoadingPageInfo(true);

          ////console.log('---------------now online--------')
          ////console.log('---------------now online--------')
        axios.get('https://www.elementdevelops.com/api/get-trainer-price', {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            //console.log('context?.stateUser?.userProfile?.country:', context?.stateUser?.userProfile?.country);
            
            //console.log('user_info:', response?.data["user_info"]);
            //console.log('TrainerManageMyProfileRow:', response?.data["TrainerManageMyProfileRow"]);
            //console.log('TrainerManageMyProfileRow?.TrSpCm:', response?.data["TrainerManageMyProfileRow"]?.TrSpCm/100);
            //console.log('AdminSettingsAppRow?.admCom:', response?.data["AdminSettingsAppRow"]?.admCom/100);
            if(response?.data["TrainerManageMyProfileRow"]?.TrSpCm){
              setOurCommissionResult(parseFloat((response?.data["TrainerManageMyProfileRow"]?.TrSpCm/100)?.toFixed(3)));
            console.log('parseFloat(response?.data["TrainerManageMyProfileRow"]?.TrSpCm)/100:', parseFloat((response?.data["TrainerManageMyProfileRow"]?.TrSpCm/100)?.toFixed(3)));

            }else{
              setOurCommissionResult(parseFloat((response?.data["AdminSettingsAppRow"]?.admCom/100)?.toFixed(3)));
              console.log('parseFloat(response?.data["AdminSettingsAppRow"]?.admCom)/100:', parseFloat((response?.data["AdminSettingsAppRow"]?.admCom/100)?.toFixed(3)));

            }
            if(response?.data["AdminSettingsAppRow"]?.xpyEgCom){
              console.log('parseFloat(response?.data["AdminSettingsAppRow"]?.xpyEgCom)/100:', parseFloat((response?.data["AdminSettingsAppRow"]?.xpyEgCom/100)?.toFixed(3)));

              setXpayEgCommissionNumber(parseFloat((response?.data["AdminSettingsAppRow"]?.xpyEgCom/100)?.toFixed(3)));
            }else{ 
              setXpayEgCommissionNumber(0);
            }
            if(response?.data["AdminSettingsAppRow"]?.xpyForCom){
              console.log('parseFloat(response?.data["AdminSettingsAppRow"]?.xpyForCom)/100:', parseFloat((response?.data["AdminSettingsAppRow"]?.xpyForCom/100)?.toFixed(3)));

              setXpayForeignCommissionNumber(parseFloat((response?.data["AdminSettingsAppRow"]?.xpyForCom/100)?.toFixed(3)));
            }else{ 
              setXpayForeignCommissionNumber(0);
            }
            if(response?.data["AdminSettingsAppRow"]?.bnkCom){
              console.log('parseFloat(response?.data["AdminSettingsAppRow"]?.bnkCom)/100:', parseFloat((response?.data["AdminSettingsAppRow"]?.bnkCom/100)?.toFixed(3)));

              setBankCommissionResult(parseFloat((response?.data["AdminSettingsAppRow"]?.bnkCom/100)?.toFixed(3)));
              
            }else{
              setBankCommissionResult(0);
            }
            //console.log('AdminSettingsAppRow:', response?.data["AdminSettingsAppRow"]);
            // response?.data["AdminSettingsAppRow"]
            let AllowForeignTrainers = (response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false
            //console.log('AllowForeignTrainers:', AllowForeignTrainers);

            if(response?.data["user_info"]?.country != "Egypt" && AllowForeignTrainers == false){
              setLoadingPageInfo(false);

              Alert.alert(``,`${t('Application_does_not_support_you_country_as_a_trainer_please_come_back_later')}`,
        [
        {
            text: 'OK',
            onPress: () => {
              navigation.dispatch(StackActions.pop(1));
            },
        },
        ],
        { cancelable: false }
    );
    
        }else{
              setLoadingPageInfo(false);

              setAdminSettingsData(response?.data["AdminSettingsAppRow"]);
              setIsAllowForeignTrainersOn((response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false);

              setDataTrainerPricing(response?.data["profile"]);
            }
            
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching profile:', error);
            setLoadingPageInfo(false);

          });

          axios.get('https://www.elementdevelops.com/api/get-trainer-discount', {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            ////console.log('discount data:', response?.data);
            setDiscountDataTable(response?.data);
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching discount:', error);
          });

        }else{
          setLoadingPageInfo(false);

          ////console.log('else no internet ahmed');
        //   fetchTrainerPricingCurrency(storedUser.id).then((response) => {
        //     ////console.log('Trainer Pricing without internet coming from offline database', response?.data.message);
        //     setDataTrainerPricing(response);    
        //   }).catch(error => {
        //           // Handle error
        //           //console.error('Error inserting Trainer Pricing:', error);
        //         });
        // fetchTrainerDiscount(storedUser.id).then((response) => {
        //   ////console.log('Trainer Discount without internet coming from offline database', response?.data.message);
        //   setDiscountDataTable(response);    
        // }).catch(error => {
        //         // Handle error
        //         //console.error('Error inserting Trainer Discount:', error);
        //       });       
                

        }

        });
        
        // Unsubscribe
        unsubscribe();
      })
    });
   
  
  }, [])
  );

  const showEditModal = (entry) => {
    setModalNewPriceVisible(true);
    setIsEditMode(true);
    setEditedEntry(entry);
  };
  const hideNewPriceModal = () => {
    setModalNewPriceVisible(false);
    setIsEditMode(false);
    setEditedEntry(null);
  };


    

    // const [changeCountryCurrency, setChangeCountryCurrency] = useState('');     
   // const changeCurrency = () =>{
  //   if (countryCurrency === ""){
  //     setChangeCountryCurrency('');
  //   }
  //   else if (countryCurrency === "EGP"){
  //     setChangeCountryCurrency('EGP');
  //   }else{
  //     setChangeCountryCurrency('USD');
  //   }
  // }
  // useEffect(() => {
  //   changeCurrency();
  // }, [countryCurrency]);  
  const addTrainerPricingEntryHandler = async () => {
    if ( !displayPeriodValue || !displayNumberOfPeriodsOptions ||  !countryCurrency || !priceAddEntry ) {
      Alert.alert(`${t('Please_select_period_and_count_currency_price')}`);
       return;
     }
     if (!countryName && !countryCode && !WorldWideCheckBox)  {
       Alert.alert(`${t('Please_select_country_or_WorldWide')}`);
        return;
      }
  const newData = {
    userId:userId,
    speKey:speKey, 
    pacNam:netPackageNameResult,
    pacDes:netPackageDescriptionResult,
    strDat:"",
    period:displayPeriodValue,
    count:displayNumberOfPeriodsOptions,
    endDat:"",
    ctryNm:countryName,
    ctryCd:countryCode,
    wrldwd:WorldWideCheckBox,
    curncy:countryCurrency,
    price:parseFloat(priceAddEntry),
    disTyp:displayDiscountTypesValue,
    disVal:discountValueAddEntry,
    dsStDat:"",
    dsEnDat:"",
    NetPrc:netPriceFinalResult,
    TrnRec:youRecieveFinalResult ? youRecieveFinalResult : "",
    deleted:"no",
    isSync:'no'
  };
  //console.log('newData: ',newData);
  

 if(triainerConnected){
  axios.post(`https://www.elementdevelops.com/api/TrainerPricingCurrencyByPressing-insert-data`, newData)
  .then((response) => {
      ////console.log('Trainer Pricing data sent to online Database', response?.data?.message);
      // setDataTrainerPricing(response?.data?.newData)
      Alert.alert(`${t(' ')}`,`${t('Your_Pricing_added_to_Database_successfully')}`,
                [
                {
                    text: 'OK',
                    onPress: () => {
                      navigation.dispatch(StackActions.pop(1));

                    },
                },
                ],
                { cancelable: false }
            );
        
          }).catch(error => {
            // Handle error
            
            // //console.log('error.response:', error.response);
            // //console.log('error.response.data:', error.response.data);
            // //console.log('error.response.data.message:', error.response.data.message);

            // //console.log('Error :', error);

            Alert.alert(``,`${t(error.response.data.message)}`);

          });

  // insertTrainerPricingCurrency(newData).then((response) => {
  //   ////console.log('Trainer Pricing data sent to offline database', response);
  //       }).catch(error => {
  //         // Handle error
  //         //console.error('Error inserting Trainer Pricing:', error);
  //       });   
 }else{
  Alert.alert(`${t('To_Add_your_data')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
  

};
    // const addTrainerPricingEntryHandler = () => {
    //   if (countryCurrency && priceAddEntry) {
    //     const newTrainerPricingData = {
    //       id: getNextTrainerPricingId(),
    //       currency:countryCurrency,
    //       pricing:(parseFloat(priceAddEntry).toFixed(2)).toString(),
    //     };

    //     dispatch(addTrainerPricingEntry(newTrainerPricingData));
    //     setDataTrainerPricing((prevData) => [...prevData, newTrainerPricingData]); // Update the local state
    //     // Update total values
        
    //   }
    // };
    useEffect(() => {
      if (isEditMode) {
        navigation.setOptions({ title: `${t("Edit_Price")}` });
        //console.log('editedEntry',editedEntry);
        // If in edit mode, populate the form fields with the data from the edited entry
        // setStartDateBoolean(editedEntry?.strDat);
        const periodIndex = PeriodsNames?.indexOf(editedEntry?.period);
        setSelectedPeriodIndex(periodIndex !== -1 ? new IndexPath(periodIndex) : '');

        const NumberOfPeriodsIndex = NumberOfPeriodsOptions?.indexOf(editedEntry?.count);
        setSelectedNumbersIndex(NumberOfPeriodsIndex !== -1 ? new IndexPath(NumberOfPeriodsIndex) : '');

        // setEndDateBoolean(editedEntry?.endDat);
        setCountryName(editedEntry?.ctryNm);
        setCountryCode(editedEntry?.ctryCd);

        setWorldWideCheckBox(editedEntry?.wrldwd == "1" || editedEntry?.wrldwd == "yes" || editedEntry?.wrldwd == true || editedEntry?.wrldwd == "true" ? true : false);

        setCountryCurrency(editedEntry?.curncy);
        setPriceAddEntry(editedEntry?.price);
        setEditedSpeKey(editedEntry?.speKey);


        const discountTypesIndex = discountTypes?.indexOf(editedEntry?.disTyp);
        setSelectedDiscountTypesIndex(discountTypesIndex !== -1 ? new IndexPath(discountTypesIndex) : '');

        setDiscountValueAddEntry(editedEntry?.disVal);
        // setDiscountStartDateBoolean(editedEntry?.dsStDat);
        // setDiscountEndDateBoolean(editedEntry?.dsEnDat);
        setNetPackageNameResult(editedEntry?.pacNam);
         setNetPackageDescriptionResult(editedEntry?.pacDes);
         setNetPriceFinalResult(editedEntry?.NetPrc);

        setYouRecieveFinalResult(editedEntry?.TrnRec);




      }
    }, [isEditMode, editedEntry]);
    const editTrainerPricingEntryHandler = () => {
      if ( !displayPeriodValue || !displayNumberOfPeriodsOptions || !countryCurrency || !priceAddEntry ) {
       Alert.alert(`${t('Please_select_period_and_count_currency_price')}`);
        return;
      }
      if (!countryName && !countryCode && !WorldWideCheckBox)  {
        Alert.alert(`${t('Please_select_country_or_WorldWide')}`);
         return;
       }
      if (editedEntry) {
          
        const newData = {
          userId:userId,
          speKey:editedSpeKey,
          pacNam:netPackageNameResult,
          pacDes:netPackageDescriptionResult,
          strDat:"",
          period:displayPeriodValue,
          count:displayNumberOfPeriodsOptions,
          endDat:"",
          ctryNm:countryName,
          ctryCd:countryCode,
          wrldwd:WorldWideCheckBox,
          curncy:countryCurrency,
          price:parseFloat(priceAddEntry),
          disTyp:displayDiscountTypesValue,
          disVal:discountValueAddEntry,
          dsStDat:"",
          dsEnDat:"",
          NetPrc:netPriceFinalResult,
          TrnRec:youRecieveFinalResult ? youRecieveFinalResult : "",
          deleted:"no",
          isSync:'no'
        };
        //console.log('newData edited: ',newData);
        
      
          if(triainerConnected){
            axios.post(`https://www.elementdevelops.com/api/TrainerPricingCurrencyByPressing-update-data`, newData)
            .then((response) => {
                ////console.log('Trainer Pricing editing data sent to online Database', response?.data?.message);
                ////console.log('Trainer Pricing new edited data', response?.data?.newData);
                setDataTrainerPricing(response?.data?.newData)
                Alert.alert(`${t(' ')}`,
                  `${t('Your_Pricing_updated_in_Database_successfully')}`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Clear the edited entry state
                        navigation.dispatch(StackActions.pop(1));

                        // Close the modal
                      },
                    },
                  ],
                  { cancelable: false }
                );   
        
                }).catch(error => {
                  // Handle error
                  
                  // //console.log('error.response:', error.response);
                  // //console.log('error.response.data:', error.response.data);
                  // //console.log('error.response.data.message:', error.response.data.message);
      
                  // //console.log('Error :', error);
      
                  Alert.alert(``,`${t(error.response.data.message)}`);
      
                });
                

            // insertTrainerPricingCurrency(newData).then((response) => {
            //   ////console.log('Trainer Pricing editing data sent to offline database', response);
            //       }).catch(error => {
            //         // Handle error
            //         ////console.log('Error inserting Trainer Pricing:', error);
            //       });   
          }else{
            Alert.alert(`${t('To_update_your_data')}`,
            `${t('You_must_be_connected_to_the_internet')}`);
          }
        }
      
    
      
    };
    useEffect(() => {
      if (!priceAddEntry) {
        // alert('Please select a start date, period, and count.');
        return;
      }
      if(priceAddEntry.trim() === "" ) { 
          return;
      }
      // parseFloat((rowData.weight /100).toFixed(4))
      let priceAddEntryParsed = parseFloat(priceAddEntry)
      let discountSubtractedValue=0;
      let netPriceResult = priceAddEntry;
  // Calculate the net Price Result based on the selected discount type
  
  if (displayDiscountTypesValue === "Absolute Amount" && discountValueAddEntry != null && discountValueAddEntry.trim() != "") {
    discountSubtractedValue =  discountValueAddEntry; 
    netPriceResult = priceAddEntryParsed - discountSubtractedValue;
  
  } else if (displayDiscountTypesValue === "Percentage" && discountValueAddEntry != null && discountValueAddEntry.trim() != "") {
    let discountValueAddEntryPercented= parseFloat(discountValueAddEntry) /100;
    let PriceMultipliedDiscountValueAddEntryPercented = priceAddEntryParsed * discountValueAddEntryPercented;
    discountSubtractedValue = PriceMultipliedDiscountValueAddEntryPercented;
    netPriceResult = priceAddEntryParsed - discountSubtractedValue;
  
  
  }
  
  //console.log('displayDiscountTypesValue',displayDiscountTypesValue);
  
  //console.log('priceAddEntryParsed',priceAddEntryParsed);
  //console.log('discountSubtractedValue',discountSubtractedValue);
  
  //console.log('netPriceResult',netPriceResult);
  //console.log('countryCurrency',countryCurrency);

  
  
  
  
     
      // Set the netPriceResult in the state
      setNetPriceFinalResult(netPriceResult); // Format the date as YYYY-MM-DD
        // let Percentage_BANK = 0.002*netPriceResult;
        let Percentage_BANK = bankCommissionResult*netPriceResult;
        console.log('xpayEgCommissionNumber',xpayEgCommissionNumber);
        console.log('xpayForeignCommissionNumber',xpayForeignCommissionNumber);

        console.log('bankCommissionResult',bankCommissionResult);
        console.log('ourCommissionResult',ourCommissionResult);
        let xpayCommissionResultFinal;
        if(countryCurrency == "EGP"){
        xpayCommissionResultFinal = xpayEgCommissionNumber ;
        }else{
        xpayCommissionResultFinal = xpayForeignCommissionNumber;


        }
        console.log('xpayCommissionResultFinal',xpayCommissionResultFinal);

        let Percentage_BANK_Final;

        if(Percentage_BANK < 40){
          Percentage_BANK_Final = 40;
        }else if(Percentage_BANK > 350){
          Percentage_BANK_Final = 350;

        }else{
          Percentage_BANK_Final = Percentage_BANK;

        }
        let Transfer_fees = Percentage_BANK_Final + 15;
        console.log('Transfer_fees',Transfer_fees);
        console.log('netPriceResult',netPriceResult);

        // let Payment_Gateway = (0.025 * netPriceResult) + 2;
        let Payment_Gateway = (xpayCommissionResultFinal * netPriceResult) + 2;
        console.log('Payment_Gateway',Payment_Gateway);

        let Our_fees = ourCommissionResult * netPriceResult;
        console.log('Our_fees',Our_fees);
        let You_Recieve = netPriceResult - (Transfer_fees + Our_fees + Payment_Gateway);
        console.log('You_Recieve',You_Recieve);
        setYouRecieveFinalResult(parseFloat(You_Recieve.toFixed(2)));


      
      
    }, [priceAddEntry,displayDiscountTypesValue,discountValueAddEntry,ourCommissionResult,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionResult]);
  

    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{isEditMode ? `${t('Edit_Price')}` : `${t('Add_New_Price')}`}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Pricing')}</FormLabel>
          </FormLabelView> 
          <Spacer size="medium">
            <InputField>
            <FormLabelView>
              <FormLabel>{t('Package_name')}:</FormLabel>
            </FormLabelView>
            <FormInputView>
              <FormInput
                placeholder={t('Package_name')}
                value={netPackageNameResult}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setNetPackageNameResult(u)}
              />
              </FormInputView>
              </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
            <FormLabelView>
                <FormLabel style={{top:-58}}>{t("Description")}:</FormLabel>
            </FormLabelView>
            <FormInputView>
              <TextInput
                placeholder={t('Description')}
                editable
                multiline
                numberOfLines={7}
                maxLength={300}
                style={styles.DescriptionTextArea}
                value={netPackageDescriptionResult}
                textContentType="name"
                autoCapitalize="none"
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setNetPackageDescriptionResult(u)}
              />
              </FormInputView>
              </InputField>
          </Spacer>
          {/* <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <CalendarFullSizePressableButton
          onPress={openStartDateSelector} 
          style={{ width: "48%", }}
          >
            <CalendarFullSizePressableButtonText >{t("Start_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{startDateBoolean ? startDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
            <PricingCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onDateSelect={handleDateSelect} />

        </Spacer> */}
          <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('Period')}:</FormLabel>
              </FormLabelView>
              <Select style={{width:"67%"}}
                  selectedIndex={selectedPeriodIndex}
                  onSelect={(index) => setSelectedPeriodIndex(index)}
                  placeholder={t('Select_Period')}
                  value={PeriodsNames[selectedPeriodIndex.row]}
                  status="newColor"
                  size="customSizo"

                  >
                  {PeriodsNames.map((option, index) => (
                    <SelectItem key={index} title={option.toString()} />
                  ))}
              </Select>
          </InputField>
          </Spacer>
          <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('Count')}:</FormLabel>
              </FormLabelView>
              <Select style={{width:"67%"}}
                selectedIndex={selectedNumbersIndex}
                placeholder={t('Select_Count')}

                onSelect={(index) => setSelectedNumbersIndex(index)}
                value={NumberOfPeriodsOptions[selectedNumbersIndex.row]}
                status="newColor"
              >
                {NumberOfPeriodsOptions.map((option, index) => (
                  <SelectItem key={index} title={option.toString()} />
                ))}
              </Select>
          </InputField>
          </Spacer>
          
        {/* <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>
                <FormLabelView style={{marginLeft:0 }}>
                  <FormLabel >{t('End_Date')}:</FormLabel>
                </FormLabelView>
                <NewFormLabelDateRowView style={{ width:"67%" }}><FormLabelDateRowViewText>{endDateBoolean ? endDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer> */}
        
      <Spacer size="medium">
        <InputField>
          <CountryParent>
              <FormLabelView>
                <FormLabel>{t("Country")}:</FormLabel>
              </FormLabelView>
            <CountryPickerView >
              <CountryPicker 
                withFilter
                withFlag
                {...(countryName ? { withCountryNameButton: true } : {})}  // Conditional prop for withCountryNameButton
                // theme={{
                //   primaryColor: 'red',
                //   primaryColorVariant: 'yellow',
                //   backgroundColor: '#ffffff',
                //   }}
                countryCode={countryCode}  // Properly set countryCode to null when cleared
                onSelect={(country) => {
                  setCountryName(country?.name);
                  setCountryCode(country?.cca2);
                  setWorldWideCheckBox(false);

                                }}
                // value = {countryName != null ? countryName : 'Select Country'}
                placeholder={<View><Text style={{marginLeft:3,fontSize:15}}>Select Country </Text></View>}
              />
            </CountryPickerView>
            </CountryParent>
        </InputField>
      </Spacer>
      <Spacer size="medium">
            <InputField>
              <FormLabelView style={{width:"50%"}}>
                <FormLabel>{t("WorldWide")}:</FormLabel>
              </FormLabelView>
              <Checkbox
                  status={WorldWideCheckBox ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setWorldWideCheckBox(!WorldWideCheckBox);
                    if(WorldWideCheckBox != true){
                      setCountryCode('');
                      setCountryName('');

                    }
                  }}
                  color="black"
                  uncheckedColor="black"
                />
           </InputField>
           </Spacer>
           <Spacer size="medium">
        <InputField>
          <CountryParent>
              <FormLabelView>
                <FormLabel>{t('Currency')}:</FormLabel>
              </FormLabelView>
            <CountryPickerView >
            <CurrencyPicker
              enable={true}
              currencyCode={countryCurrency} // Set to null when no currency is selected
              showFlag={false}
              darkMode={false}
              showCurrencyName={false}
              showCurrencyCode={true} 
              onSelectCurrency={(data) => { setCountryCurrency(data.code); }}
              showNativeSymbol={false}
              showSymbol={false}
              containerStyle={{
                container: {marginLeft:-7,},
                flagWidth: 25,
                currencyCodeStyle: { color: countryCurrency ? "black" : "rgba(127, 120, 120, 0.3)", fontSize: 14 }, // Set color to gray for "Select Currency"
                currencyNameStyle: {},
                symbolStyle: {},
                symbolNativeStyle: {},
              }}
              modalStyle={{
                container: {backgroundColor:'#fff'},
                searchStyle: {color:"black"},
                tileStyle: {color:"black"},
                itemStyle: {
                  itemContainer: {backgroundColor:'#fff'},
                  flagWidth: 25,
                  currencyCodeStyle: {color:"black"},
                  currencyNameStyle: {color:"black"},
                  symbolStyle: {},
                  symbolNativeStyle: {color:"black"},
                },
              }}
              title={t('Currency')}
              searchPlaceholder={t('Search')}
              showCloseButton={true}
              showModalTitle={true}
            />
            {/* {!countryCurrency && (
              <TouchableOpacity style={{position:"absolute",marginVertical:-5}}>
                <Text style={{ color: "gray", fontSize: 14, marginLeft: 8 }}>
                  {t("Select_Currency")}
                </Text>
              </TouchableOpacity>

  )} */}
          </CountryPickerView>
          </CountryParent>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t('Price')}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t('Price')}
            value={priceAddEntry}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setPriceAddEntry(u)}
          />
          </FormInputView>
          </InputField>
        </Spacer>
      <FormLabelView style={{width:"100%"}}>
          <FormLabel style={{fontSize:20,marginLeft:10,marginTop:20}}>{t('Discounts')}</FormLabel>
      </FormLabelView>
      <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('Discount_Type')}:</FormLabel>
              </FormLabelView>
              <Select style={{width:"67%"}}
                  selectedIndex={selectedDiscountTypesIndex}
                  onSelect={(index) => setSelectedDiscountTypesIndex(index)}
                  placeholder={t('Select_Type')}
                  value={discountTypes[selectedDiscountTypesIndex.row]}
                  status="newColor"
                  size="customSizo"

                  >
                  {discountTypes.map((option, index) => (
                    <SelectItem key={index} title={option.toString()} />
                  ))}
              </Select>
          </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
            <FormLabelView>
              <FormLabel>{t('Discount_value')}:</FormLabel>
            </FormLabelView>
            <FormInputView>
              <FormInput
                placeholder={t('Discount_value')}
                value={discountValueAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setDiscountValueAddEntry(u)}
              />
              </FormInputView>
              </InputField>
          </Spacer>
          
        {/* <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <CalendarFullSizePressableButton
          onPress={openDiscountStartDateSelector} 
          style={{ width: "48%", }}
          >
            <CalendarFullSizePressableButtonText >{t("Start_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{discountStartDateBoolean ? discountStartDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>

        </Spacer> */}
        {/* <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <CalendarFullSizePressableButton
          onPress={openDiscountEndDateSelector} 
          style={{ width: "48%", }}
          >
            <CalendarFullSizePressableButtonText >{t("End_Date")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
                <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText>{discountEndDateBoolean ? discountEndDateBoolean : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
            <DiscountCalendarScreen isVisible={isDiscountCalendarVisible} onClose={handleDiscountCloseCalendar} onDateSelect={handleDiscountDateSelect} />

        </Spacer> */}
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>
                <FormLabelView style={{marginLeft:0 }}>
                  <FormLabel >{t('Net_Price')}:</FormLabel>
                </FormLabelView>
                <NewFormLabelDateRowView style={{ width:"67%" }}><FormLabelDateRowViewText>{netPriceFinalResult ? netPriceFinalResult : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

                <FormLabelView style={{marginLeft:0 }}>
                  <FormLabel >{t('You_Recieve')}:</FormLabel>
                </FormLabelView>
                <NewFormLabelDateRowView style={{ width:"67%" }}><FormLabelDateRowViewText>{youRecieveFinalResult ? youRecieveFinalResult : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>

      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{ backgroundColor: '#000' }} onPress={() => {
                if (isEditMode) {
                  // If in edit mode, call the edit handler
                  editTrainerPricingEntryHandler();
                } else {
                  // If in add mode, call the add handler
                  addTrainerPricingEntryHandler();
                }
                
              
            }}>
              <CalendarFullSizePressableButtonText>
                {isEditMode ? `${t('Edit_Price')}` : `${t('Add_New_Pricing')}`}
              </CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      {/* <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} >
            <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer> */}
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
    marginLeft:10,
    marginBottom:10,
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
    marginBottom: 15,
    width:"100%",
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
    marginBottom: 10,
    flex: 1,
    
  },
  ArabicHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'10%',
  },
  EnglishHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'7%',
  },
  ArabicHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'48%',
  },
  EnglishHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'47%',
  },
  trainerPricingTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    flex: 1,
    },

    ArabicTrainerPricingCurrencyText:{
      position:'absolute',
      left:'8%',
      flexWrap: 'wrap',
      flex:1,
    },
    EnglishTrainerPricingCurrencyText:{
      position:'absolute',
      left:'8%',
      flexWrap: 'wrap',
      flex:1,
    },
    ArabicTrainerPricingNumberText:{
      position:'absolute',
      left:'47%',
    },
    EnglishTrainerPricingNumberText:{
      position:'absolute',
      left:'47%',
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
         DescriptionTextArea:{
          backgroundColor:"white",
          borderWidth:1,
          borderColor:'black',
          borderRadius:6,
          padding:10,
          textAlignVertical: 'top',
          height:150,
        },
});

