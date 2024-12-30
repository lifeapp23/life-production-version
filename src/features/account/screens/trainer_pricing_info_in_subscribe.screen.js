import React, { useState,useContext,useEffect } from 'react';
import { ScrollView,View,Text,TouchableOpacity, Modal,Alert,StyleSheet,Pressable} from "react-native";
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

export const TrainerPricingInfoInSubscribeScreen = ({navigation,route}) => {
  const context = useContext(AuthGlobal);
  const params = route.params || {};

  const { onePrice = {} } = params;
  //console.log('pricing inf onePrice',onePrice);

  const [priceAddEntry, setPriceAddEntry] = useState("");     
  const [countryCurrency, setCountryCurrency] = useState('');
  const [editedSpeKey, setEditedSpeKey] = useState('');
  const [views, setViews] = useState([]);
  // const [onePrice, setonePrice] = useState(null);
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
  const [netPriceFinalResult, setNetPriceFinalResult] = useState('');
  const [discountSubtractedValueConst, setDiscountSubtractedValueConst] = useState('');
  

 
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
          
  
  
         
        }else{
          setLoadingPageInfo(false);

                

        }

        });
        
        // Unsubscribe
        unsubscribe();
      })
    });
   
  
  }, [])
  );

    



    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t('Pricing')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Pricing')}</FormLabel>
          </FormLabelView> 
          <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <FormLabelView>
                <FormLabel>{t('Package_name')}:</FormLabel>
            </FormLabelView>
                <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.pacNam ? onePrice?.pacNam : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>

        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <FormLabelView>
                <FormLabel>{t('Description')}:</FormLabel>
            </FormLabelView>
                <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.pacDes ? onePrice?.pacDes : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>

        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

            <FormLabelView>
                <FormLabel>{t('Start_Date')}:</FormLabel>
            </FormLabelView>
                <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.strDat ? onePrice?.strDat : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>

        </Spacer>
          <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('Period')}:</FormLabel>
              </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.period ? onePrice?.period : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

          </InputField>
          </Spacer>
          <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('Count')}:</FormLabel>
              </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.count ? onePrice?.count : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

          </InputField>
          </Spacer>
          
          <Spacer size="medium">
          <InputField>
              <FormLabelView>
                <FormLabel>{t('End_Date')}:</FormLabel>
              </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.endDat ? onePrice?.endDat : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

              
          </InputField>
          </Spacer>
        
      <Spacer size="medium">
        <InputField>
          <CountryParent>
              <FormLabelView>
                <FormLabel>{t("Country")}:</FormLabel>
              </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.ctryNm ? onePrice?.ctryNm : "Worldwide"}</FormLabelDateRowViewText></NewFormLabelDateRowView>

            </CountryParent>
        </InputField>
      </Spacer>
      
           <Spacer size="medium">
        <InputField>
          <CountryParent>
              <FormLabelView>
                <FormLabel>{t('Currency')}:</FormLabel>
              </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.curncy ? onePrice?.curncy : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

          </CountryParent>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t('Price')}:</FormLabel>
        </FormLabelView>
        <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.price ? onePrice?.price : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

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
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.disTyp ? onePrice?.disTyp : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

          </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField>
            <FormLabelView>
              <FormLabel>{t('Discount_value')}:</FormLabel>
            </FormLabelView>
            <FormInputView>
            <NewFormLabelDateRowView ><FormLabelDateRowViewText>{onePrice?.disVal ? onePrice?.disVal : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>

              </FormInputView>
              </InputField>
          </Spacer>
          <Spacer size="medium">

          <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

          <FormLabelView>
              <FormLabel>{t('Start_Date')}:</FormLabel>
          </FormLabelView>
              <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.dsStDat ? onePrice?.dsStDat : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
          </InputField>
          </Spacer>

        <Spacer size="medium">
        <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>

        <FormLabelView>
            <FormLabel>{t('End_Date')}:</FormLabel>
        </FormLabelView>
            <NewFormLabelDateRowView style={{ width: "67%", }}><FormLabelDateRowViewText>{onePrice?.dsEnDat ? onePrice?.dsEnDat : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField  style={{justifyContent:'space-between', flexDirection: 'row' }}>
                <FormLabelView style={{marginLeft:0 }}>
                  <FormLabel >{t('Net_Price')}:</FormLabel>
                </FormLabelView>
                <NewFormLabelDateRowView style={{ width:"67%" }}><FormLabelDateRowViewText>{onePrice?.NetPrc ? onePrice?.NetPrc : ""}</FormLabelDateRowViewText></NewFormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="large"></Spacer>
        <Spacer size="large"></Spacer>

       
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
});

