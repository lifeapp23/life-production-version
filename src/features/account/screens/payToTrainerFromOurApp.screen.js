import React, { useState } from 'react';
import { StyleSheet,ScrollView,View,Alert,Modal,TouchableOpacity,Text,ActivityIndicator,Pressable} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  FormInput,
  FormInputView,
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
import Feather from 'react-native-vector-icons/Feather';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { StackActions } from '@react-navigation/native';

import { Spacer } from "../../../components/spacer/spacer.component";
import { SelectItem  } from '@ui-kitten/components';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

export const PayToTrainerFromOurAppScreen = ({navigation,route}) => {
  const { trainer_countSent,curncySent,trnrIdSent,fNameSent,lNameSent,userTokenSent } = route.params;
  
  const [selectedPeriod,setSelectedPeriod] =useState("");
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [ourPersonalTrainers,setOurPersonalTrainers] =  useState([]);
  const [htmlContent, setHtmlContent] = useState("");  
  const [email, setEmail] = useState("");  
  const { t, i18n } = useTranslation();

  
  

    ////////////// Start periodData////////////////
    useFocusEffect(
      React.useCallback(() => {
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        //console.log('tokeeen:',res);
        setUserToken(res);

      AsyncStorage.getItem("currentUser").then((user) => {
    
          const storedUser = JSON.parse(user);
          setUserId(storedUser.id);
    
          
          const unsubscribe = addEventListener(state => {
            //console.log("Connection type--", state.type);
            //console.log("Is connected?---", state.isConnected);
            setTriainerConnected(state.isConnected);
         
        });
          
          // Unsubscribe
          unsubscribe();
        })
      });
     
    
    }, [])
    );

    ////////////// End periodData////////////////
    
  const sendRequestToTrainerPayments = async () => {

    
    if(!email){
      Alert.alert(`${t('you_must_enter_trainer_paypal_email')}`);
      return;
    }
       if(triainerConnected){
        axios.post(`https://www.elementdevelops.com/api/paymentsToTrainerFromOurApp`, {
         params:{
         trainer_amount:trainer_countSent,
         curncy:curncySent,
         trnrId:trnrIdSent,
         fName:fNameSent,
         lName:lNameSent,
         email:email
         },
        headers: {
            'Authorization': `Bearer ${userTokenSent}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
            //console.log('response?.data?.message', response?.data?.message);
            //setShowGateway(response?.data?.value)


            Alert.alert(`${t(' ')}`,`${t(response?.data?.message)}`,
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
              
              Alert.alert(`${t(' ')}`,error?.response?.data?.message);
            });
      
   
       }else{
        Alert.alert(`${t('To_send_your_Request')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
       }
      
    }
           

    

  const isArabic = i18n.language === 'ar';
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t('PayToTrainer')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
              <View style={styles.headerTrainerPricing}>
                <Text style={[styles.FromToViewText,styles.headerTraineFullNameText]}>{t('Trainer_name')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingNumber : styles.EnglishHeaderTrainerPricingNumber]}>{t('Amount')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCurrency : styles.EnglishHeaderTrainerPricingCurrency]}>{t('Currency')}</Text>

              </View>
                <View style={styles.viewContainer}>
                  <View style={styles.trainerPricingContainer}>  
                    <Text style={[styles.trainerPricingTextValues,styles.TraineFullNameText]}>{fNameSent || ''} {lNameSent || ''}</Text>   
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNumberText : styles.EnglishTrainerPricingNumberText]}>{trainer_countSent || ''}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrencyText : styles.EnglishTrainerPricingCurrencyText]}>{curncySent || ''}</Text>
                    
                  </View>
                  
                </View>
                
              
       
            
            <Spacer size="large">
              <InputField >
              <FormLabelView>
                <FormLabel>{t('Paypal_Email')}:</FormLabel>
              </FormLabelView>
              <FormInputView>
                <FormInput
                  placeholder={t('Paypal_Email')}
                  value={email}
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  theme={{colors: {primary: '#3f7eb3'}}}
                  onChangeText={(u) => setEmail(u)}
                />
              </FormInputView>
              </InputField>
            </Spacer>
            <Spacer size="medium">
              <View style={{marginLeft:10,marginRight:10,marginTop:30}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>sendRequestToTrainerPayments()}>
                  <CalendarFullSizePressableButtonText >{t('pay')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </View>
            </Spacer> 
            
        
        <Spacer size="medium">
          <View style={{marginLeft:10,marginRight:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
              <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
          </View>
        </Spacer>
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
  viewContainer: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 30,
    // marginLeft:10,
    // marginRight:10,
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
  },
  TraineFullNameText:{
    position:'absolute',
    left:"3%"
  },
  EnglishTrainerPricingCurrencyText:{
    position:'absolute',
    right:"22%"
  },
  ArabicTrainerPricingCurrencyText:{
    position:'absolute',
    right:"17%"
  },
  EnglishTrainerPricingNumberText:{
    position:'absolute',
    left:"40%"
  },
  ArabicTrainerPricingNumberText:{
    position:'absolute',
    left:"49%"
  },
  discountContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
  trainerPricingTextValues:{
    fontSize:14,
    color:"white",
    marginVertical: 15,
    flex: 1,
    },

  headerTrainerPricing:{
    flexDirection: 'row',
    justifyContent:'space-between',

  },
  EnglishHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'41%',
  },
  ArabicHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'50%',
  },
  headerTraineFullNameText:{ 
    position:'absolute',
  left:'5%',
},
EnglishHeaderTrainerPricingCurrency:{
    position:'absolute',
    right:'16%',
  },
  ArabicHeaderTrainerPricingCurrency:{
    position:'absolute',
    right:'16%',
  },

  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
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
});