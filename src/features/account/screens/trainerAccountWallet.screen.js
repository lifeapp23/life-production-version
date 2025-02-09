import React, { useState } from 'react';
import { Dimensions,StyleSheet,TextInput,ScrollView,View,Alert,Modal,TouchableOpacity,Text,ActivityIndicator,Pressable} from "react-native";
import CountryPicker from 'react-native-country-picker-modal';
import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  FormInput,
  FormInputView,
  PageContainer,
  FormLabelView,
  CountryPickerView,
  CountryParent,

  ServicesPagesCardCover,
  TraineeOrTrainerField,
  TraineeOrTrainerButtonsParentField,
  TraineeOrTrainerButtonField,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  GenderSelector,
  PageMainImage,
  AsteriskTitle,
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
const { width } = Dimensions.get('window');
import { RadioButton} from "react-native-paper";

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

export const TrainerAccountWalletPageScreen = ({navigation,route}) => {
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
  const [equaChecked, setEquaChecked ] = useState('Paypal');

  const [country, setCountry] = useState("United States");
  const [countryCode, setCountryCode] = useState('US');
  const [bankName, setBankName] = useState("");
  const [branchAddress, setBranchAddress] = useState("");  
  const [cityName, setCityName] = useState("");  
  const [bankCodeSWIFT, setBankCodeSWIFT] = useState("");  
  const [accountNumber, setAccountNumber] = useState("");  
  const [IBANNumber, setIBANNumber] = useState("");  
  
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  const [showInfo, setShowInfo] = useState(false);

  console.log('ourPersonalTrainers my wallet',ourPersonalTrainers);
    const toggleInfo = () => {
      setShowInfo(!showInfo);
    };
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
          if(state.isConnected){
            ////console.log('---------------now online--------')
            axios.post('https://life-pf.com/api/getOneTrainerGroubedByCurrencyAndAmountWithCreditAndDebit', {
              headers: {
                'Authorization': `Bearer ${res}`,
                'Content-Type': 'application/json',
                'Connection':"keep-alive",
              },
              })
              .then(response => {
                // Handle successful response
                ////console.log('TrainerCurrencyAmountCount::',response.data['TrainerCurrencyAmountCount']);
                setOurPersonalTrainers(response.data['TrainerCurrencyAmountCount']);
              })
              .catch(error => {
                // Handle error
                ////console.log('Error fetching TrainerCurrencyAmountCount');
              });
          }else{
            ////console.log('else no internet ahmed');
            Alert.alert(`${t(' ')}`,
            `${t('Please_Connect_to_the_internet_To_see_the_Wallet')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                 
                },
              },
            ],
            { cancelable: false }
          );

          }
        });
          
          // Unsubscribe
          unsubscribe();
        })
      });
     
    
    }, [])
    );

    ////////////// End periodData////////////////
    
  const sendRequestForTrainerPayments = async () => {

       
      
       if(triainerConnected){
        // if( equaChecked === 'BankTransfer'){
        //   if (country.trim() == "" || bankName.trim() == "" || branchAddress.trim() == "" || cityName.trim() == "" || bankCodeSWIFT.trim() == "" || accountNumber.trim() == "" || IBANNumber.trim() == "") {
        //     Alert.alert(`${t("All_fields_are_required")}`);
        //     return;
        //   };
        //   if (bankName.length < 2) {
        //     Alert.alert(`${t("Bank_name_must_be_at_least_two_characters")}`);
        //     return;
        //   };
        //   if (bankCodeSWIFT.length < 4) {
        //     Alert.alert(`${t("Bank_code_SWIFT_must_be_at_least_four_characters")}`);
        //     return;
        //   };
        //   if (IBANNumber.length < 15) {
        //     Alert.alert(`${t("IBANNumber_must_be_at_least_fiveteen_characters")}`);
        //     return;
        //   };
        //   console.log('country',country);
        //     console.log(' bankName',bankName);
        //      console.log('branchAddress',branchAddress);
        //      console.log('cityName',cityName);
        //      console.log('bankCodeSWIFT',bankCodeSWIFT);
        //      console.log('accountNumber',accountNumber);
        //      console.log('IBANNumber',IBANNumber);
        //   axios.post(`https://life-pf.com/api/send-Trainer-Payments-Request-With-Bank-Option`, {
        //     params:{
        //      country:country,
        //      bankName:bankName,
        //      branchAddress:branchAddress,
        //      cityName:cityName,
        //      bankCodeSWIFT:bankCodeSWIFT,
        //      accountNumber:accountNumber,
        //      IBANNumber:IBANNumber,
        //     },
        //    headers: {
        //        'Authorization': `Bearer ${userToken}`,
        //        'Content-Type': 'application/json',
        //      },
        //    })
        //    .then((response) => {
        //        console.log('response?.data?.value', response?.data?.value);
        //       //  setShowGateway(response?.data?.value)
   
        //        Alert.alert(`${t(' ')}`,`${t('your_request_sent_to_admin_successfully')}`);
   
   
        //        }).catch(error => {
        //          // Handle error
                 
        //          Alert.alert(`${t(' ')}`,error?.response?.data?.message);
        //        });
         
        // }else if ( equaChecked === 'Paypal') {
        //   if (email.trim() == "") {
        //     Alert.alert(`${t("You_must_fill_email_field")}`);
        //     return;
        //   };
        //   axios.post(`https://life-pf.com/api/sendTrainerPaymentsRequest`, {
        //     params:{
        //      email:email,
        //     },
        //    headers: {
        //        'Authorization': `Bearer ${userToken}`,
        //        'Content-Type': 'application/json',
        //      },
        //    })
        //    .then((response) => {
        //        ////console.log('response?.data?.value', response?.data?.value);
        //        setShowGateway(response?.data?.value)
   
        //        Alert.alert(`${t(' ')}`,`${t('your_request_sent_to_admin_successfully')}`);
   
   
        //        }).catch(error => {
        //          // Handle error
                 
        //          Alert.alert(`${t(' ')}`,error?.response?.data?.message);
        //        });
        // }
       
       
          if (country.trim() == "" || bankName.trim() == "" || branchAddress.trim() == "" || cityName.trim() == "" || bankCodeSWIFT.trim() == "" || accountNumber.trim() == "" || IBANNumber.trim() == "") {
            Alert.alert(`${t("All_fields_are_required")}`);
            return;
          };
          if (bankName.length < 2) {
            Alert.alert(`${t("Bank_name_must_be_at_least_two_characters")}`);
            return;
          };
          if (bankCodeSWIFT.length < 4) {
            Alert.alert(`${t("Bank_code_SWIFT_must_be_at_least_four_characters")}`);
            return;
          };
          if (IBANNumber.length < 15) {
            Alert.alert(`${t("IBANNumber_must_be_at_least_fiveteen_characters")}`);
            return;
          };
          console.log('country',country);
            console.log(' bankName',bankName);
             console.log('branchAddress',branchAddress);
             console.log('cityName',cityName);
             console.log('bankCodeSWIFT',bankCodeSWIFT);
             console.log('accountNumber',accountNumber);
             console.log('IBANNumber',IBANNumber);
          axios.post(`https://life-pf.com/api/send-Trainer-Payments-Request-With-Bank-Option`, {
            params:{
             country:country,
             bankName:bankName,
             branchAddress:branchAddress,
             cityName:cityName,
             bankCodeSWIFT:bankCodeSWIFT,
             accountNumber:accountNumber,
             IBANNumber:IBANNumber,
            },
           headers: {
               'Authorization': `Bearer ${userToken}`,
               'Content-Type': 'application/json',
             },
           })
           .then((response) => {
               console.log('response?.data?.value', response?.data?.value);
              //  setShowGateway(response?.data?.value)
   
               Alert.alert(`${t(' ')}`,`${t('your_request_sent_to_admin_successfully')}`);
   
   
               }).catch(error => {
                 // Handle error
                 
                 Alert.alert(`${t(' ')}`,error?.response?.data?.message);
               });
         
        
   
       }else{
        Alert.alert(`${t('To_send_your_Request')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
       }
      
    }
           

    
  function handleMessage(e) {
    let data = e.nativeEvent.data;
    //const message = JSON.parse(event.nativeEvent.data);
    ////console.log('e>>>',e);
    if (data !== undefined) {
      setShowGateway(data);
    }
  };
  const isArabic = i18n.language === 'ar';
  //console.log('parseFloat((ourPersonalTrainers?.trainer_count).toFixed(2))',parseFloat((ourPersonalTrainers?.[0]?.trainer_count)?.toFixed(2)));
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          {/* <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t('my_Wallet')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover> */}
          <ServicesPagesCardCover>
          <PageMainImage
            source={require('../../../../assets/my_wallet_section.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
          </ServicesPagesCardCover>
          <Spacer size="large">
              <ServiceInfoParentView >
                {showInfo ? (
                  <ServiceCloseInfoButtonView>
                    <ServiceCloseInfoButton onPress={toggleInfo}>
                      <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                    </ServiceCloseInfoButton>
                    <ServiceCloseInfoButtonTextView>
                      <ServiceCloseInfoButtonText>{t("trainer_account_wallet_page_desc")}</ServiceCloseInfoButtonText>
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
          {/* <ServiceCloseInfoButtonTextView style={{marginLeft:10,marginRight:10,marginBottom:20,}}>
              <ServiceCloseInfoButtonText>{t('Note_There_are_fees_will_be_excluded_for_the_App_and_paypal')}</ServiceCloseInfoButtonText>
            </ServiceCloseInfoButtonTextView> */}
            {
              (
                parseFloat((ourPersonalTrainers?.[0]?.trainer_count)?.toFixed(2)) > 0
              )?(
                <>
                {(ourPersonalTrainers?.length >= 1) ? (
              <View style={styles.headerTrainerPricing}>
                <Text style={[styles.FromToViewText,styles.headerTraineFullNameText]}>{t('Trainer_name')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingNumber : styles.EnglishHeaderTrainerPricingNumber]}>{t('Amount')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCurrency : styles.EnglishHeaderTrainerPricingCurrency]}>{t('Currency')}</Text>

              </View>
            ):null}
            {ourPersonalTrainers?.map((ourPersonalTrainer,index) => (
                <View key={index} style={styles.viewContainer}>
                  <View style={styles.trainerPricingContainer}>  
                    <Text style={[styles.trainerPricingTextValues,styles.TraineFullNameText]}>{ourPersonalTrainer?.fName || ''} {ourPersonalTrainer?.lName || ''}</Text>   
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNumberText : styles.EnglishTrainerPricingNumberText]}>{parseFloat((ourPersonalTrainer?.trainer_count)?.toFixed(2)) || ''}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrencyText : styles.EnglishTrainerPricingCurrencyText]}>{ourPersonalTrainer?.curncy || ''}</Text>
                    
                  </View>
                  
                </View>
                
              ))}
       
          {(ourPersonalTrainers?.length >= 1) ? (
            <>
            {/* <Spacer size="large">
        <TraineeOrTrainerField style={{marginTop:40}}>
            <FormLabelView style={{width:"50%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Payment_Method")}:</FormLabel>
            </FormLabelView>
            
          <TraineeOrTrainerButtonsParentField style={{top:-5,width:"50%"}}>
            <TraineeOrTrainerButtonField >
              <RadioButton
                value="Paypal"
                status={ equaChecked === 'Paypal' ? 'checked' : 'unchecked' }
                onPress={() => setEquaChecked('Paypal')}
                uncheckedColor={"#000"}
                color={'#000'}
                
              />
              <FormLabel>{t("Paypal")}</FormLabel>
                </TraineeOrTrainerButtonField>
                  <TraineeOrTrainerButtonField>
                    <RadioButton
                      value="BankTransfer"
                      status={ equaChecked === 'BankTransfer' ? 'checked' : 'unchecked' }
                      onPress={() => setEquaChecked('BankTransfer')}
                      uncheckedColor={"#000"}
                      color={'#000'}
                    />
                    <FormLabel>{t("Bank_transfer")}</FormLabel>
                  </TraineeOrTrainerButtonField>
              </TraineeOrTrainerButtonsParentField>
            </TraineeOrTrainerField>
          </Spacer> */}
            {/* {(
              equaChecked === 'BankTransfer'
            )?(
              <>
              <Spacer size="large">
                  <InputField >
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
                        visible={false}
                        onSelect={(country) => {
                        //console.log("COUNTERY ==> ", country);
                          setCountry(country.name);
                          setCountryCode(country.cca2);
                          
                                        }}
                          
                        value = {country.name}
                      />
                    </CountryPickerView>
                    </CountryParent>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Bank_Name")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Bank_Name")}
                        value={bankName}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setBankName(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                <InputField>
                <FormLabelView>
                <FormLabel style={{top:-58}}><AsteriskTitle>*</AsteriskTitle> {t("Branch_address")}:</FormLabel>
                </FormLabelView>
                <FormInputView>
                <TextInput
                    editable
                    multiline
                    numberOfLines={7}
                    maxLength={300}
                    placeholder={t("Branch_address")}
                    value={branchAddress}
                    keyboardType="default"
                    style={styles.branchAddress}
                    onChangeText={(u) => setBranchAddress(u)}
                />
                </FormInputView>
                </InputField>
              </Spacer>
              <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("City")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("City")}
                        value={cityName}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setCityName(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Bank_Code_SWIFT")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Bank_Code_SWIFT")}
                        value={bankCodeSWIFT}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setBankCodeSWIFT(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Account_Number")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Account_Number")}
                        value={accountNumber}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setAccountNumber(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("IBAN")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("IBAN")}
                        value={IBANNumber}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setIBANNumber(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
              </>
            ):(
                <>
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
              </>
            )} */}
            <>
              <Spacer size="large">
                  <InputField >
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
                        visible={false}
                        onSelect={(country) => {
                        //console.log("COUNTERY ==> ", country);
                          setCountry(country.name);
                          setCountryCode(country.cca2);
                          
                                        }}
                          
                        value = {country.name}
                      />
                    </CountryPickerView>
                    </CountryParent>
                  </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Bank_Name")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Bank_Name")}
                        value={bankName}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setBankName(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                <InputField>
                <FormLabelView>
                <FormLabel style={{top:-58}}><AsteriskTitle>*</AsteriskTitle> {t("Branch_address")}:</FormLabel>
                </FormLabelView>
                <FormInputView>
                <TextInput
                    editable
                    multiline
                    numberOfLines={7}
                    maxLength={300}
                    placeholder={t("Branch_address")}
                    value={branchAddress}
                    keyboardType="default"
                    style={styles.branchAddress}
                    onChangeText={(u) => setBranchAddress(u)}
                />
                </FormInputView>
                </InputField>
              </Spacer>
              <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("City")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("City")}
                        value={cityName}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setCityName(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Bank_Code_SWIFT")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Bank_Code_SWIFT")}
                        value={bankCodeSWIFT}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setBankCodeSWIFT(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Account_Number")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("Account_Number")}
                        value={accountNumber}
                        keyboardType="numeric"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setAccountNumber(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
                <Spacer size="large">
                  <InputField>
                    <FormLabelView>
                      <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("IBAN")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <FormInput
                        placeholder={t("IBAN")}
                        value={IBANNumber}
                        keyboardType="default"
                        autoCapitalize="none"
                        theme={{colors: {primary: '#3f7eb3'}}}
                        onChangeText={(u) => setIBANNumber(u)}
                      />
                    </FormInputView>
                    </InputField>
                </Spacer>
              </>

            
            
            <Spacer size="medium">
              <View style={{marginLeft:10,marginRight:10,marginTop:30}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>sendRequestForTrainerPayments()}>
                  <CalendarFullSizePressableButtonText >{t('Send_request_to_withdraw_Payments')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </View>
            </Spacer> 
            </>
            ):null}
                </>
              ):(
                <Text style={{width: width - 20,color:'black',fontSize:22,marginTop:50 ,textAlign:"center",marginLeft:10,marginRight:10}}>{t('Wallet_is_empty')}</Text>
              )
            }
          


        
        {/* <Spacer size="medium">
          <View style={{marginLeft:10,marginRight:10}}>
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
    left:"40%",
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
    color:"black",
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
    color:"black",
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
  branchAddress: {
 // This property ensures that the text starts from the top
        backgroundColor:"white",
        borderWidth:1,
        borderColor:'black',
        borderRadius:6,
        padding:10,
        textAlignVertical: 'top',
        height:150,
        
    },
});