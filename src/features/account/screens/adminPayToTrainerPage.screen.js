import React, { useState,useRef,useEffect } from 'react';
import { StyleSheet,ScrollView,View,Alert,Modal,TouchableOpacity,Text,ActivityIndicator,Pressable,TextInput, Animated, Easing} from "react-native";
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
import Feather from 'react-native-vector-icons/Feather';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import { Spacer } from "../../../components/spacer/spacer.component";
import { SelectItem  } from '@ui-kitten/components';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { WebView } from 'react-native-webview';

export const AdminPayToTrainerPageScreen = ({navigation,route}) => {
  const [selectedPeriod,setSelectedPeriod] =useState("");
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [ourPersonalTrainers,setOurPersonalTrainers] =  useState([]);
  const [htmlContent, setHtmlContent] = useState("");  
  const { t, i18n } = useTranslation();
  const [showPaymentAmountInputSelectedView, setShowPaymentAmountInputSelectedView] = useState(false);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [ourOnePersonalTrainerState, setOurOnePersonalTrainerState] = useState(null); // Holds the trainer data

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
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
  const [showGateway, setShowGateway] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
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
          if(state.isConnected){
            //console.log('---------------now online--------')
            axios.post('https://www.elementdevelops.com/api/getTrainersGroubedByCurrencyAndAmountWithDebitAndCredit', {
              headers: {
                'Authorization': `Bearer ${res}`,
                'Content-Type': 'application/json',
                'Connection':"keep-alive",
              },
              })
              .then(response => {
                // Handle successful response
                //console.log('TrainerCurrencyAmountCount::',response.data['TrainerCurrencyAmountCount']);
                setOurPersonalTrainers(response.data['TrainerCurrencyAmountCount']);
              })
              .catch(error => {
                // Handle error
                //console.log('Error fetching TrainerCurrencyAmountCount');
              });
          }else{
            //console.log('else no internet ahmed');
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
    const periodData = [
      '30','60','90','120','150','180','210','240','270','300','330','360'
    ];
    const renderPeriodOption = (title,i) => (
      <SelectItem title={`${(title/30).toString()} ${t('Month')}`} key={i} />
    );
    const displayPeriodValue = periodData[selectedPeriod.row];
    ////////////// End periodData////////////////
    
    const subscribeToTrainerFunc = async (trainer_count,curncy,trnrId,fName,lName) => {
      if(!trainer_count || !curncy || !trnrId || !fName || !lName){
        Alert.alert(`${t('there_are_no_Trainer_info')}`);
        return;
      }
      setHtmlContent(`
    <html>
      <body>
        <form id="myForm" action="https://www.elementdevelops.com/api/checkingFunctionBeforePay" method="post">
          <input type="hidden" name="trainer_count" value="${trainer_count}">
          <input type="hidden" name="curncy" value="${curncy}">
          <input type="hidden" name="trnrId" value="${trnrId}">
          <input type="hidden" name="fName" value="${fName}">
          <input type="hidden" name="lName" value="${lName}">
          <input type="hidden" name="userToken" value="${userToken}">
        </form>
        <script>
          // Submit the form automatically when the page loads
          document.getElementById("myForm").submit();
        </script>
      </body>
    </html>
  `);
  setShowGateway(true)
     
    }
           // params: {
              //   trainer_count:trainer_count,
              //   curncy:curncy,
              //   trnrId:trnrId,
              //   fName:fName,
              //   lName:lName,
              // },

    
  function handleMessage(e) {
    let data = JSON.parse(e.nativeEvent.data);
    //const message = JSON.parse(event.nativeEvent.data);
    //console.log('e>>>',e);
    //console.log('Received data:', data);
    if (data !== undefined) {
      setShowGateway(data.setShowGateway);
      setOurPersonalTrainers(data.TrainerCurrencyAmountCount);

    }
  };
  const isArabic = i18n.language === 'ar';


  const payToTrainerPayments = async (trainerInputAmount,originalAmount,curncySent,trnrIdSent,userTokenSent) => {
    console.log('trainerInputAmount',trainerInputAmount);
    console.log('originalAmount',originalAmount);

    if(trainerInputAmount > originalAmount){
      Alert.alert(`${t('you_cant_pay_amount_bigger_than_the_trainer_balance')} ${originalAmount}`);
      return;
    }
  

    const trainerInfoData={
         trainer_amount:trainerInputAmount,
         curncy:curncySent,
         trnrId:trnrIdSent,
         
         }
         console.log('trainerInfoData',trainerInfoData);
       if(triainerConnected){
        setLoading(true);

        axios.post('https://www.elementdevelops.com/api/xpay-to-trainer-pay-his-money', trainerInfoData, {
          headers: {
            'Authorization': `Bearer ${userTokenSent}`,
            'Content-Type': 'application/json',
          },
              })
        .then((response) => {
          setLoading(false);
          setShowSuccess(true); // Show success message and animation
          setOurPersonalTrainers(response.data['TrainerCurrencyAmountCount']);

          setTimeout(() => {
            setShowSuccess(false);
            setShowPaymentAmountInputSelectedView(false);

          }, 2000); // 2 seconds delay
            //console.log('response?.data?.message', response?.data?.message);
            //setShowGateway(response?.data?.value)


        //     Alert.alert(`${t(' ')}`,`${t(response?.data?.message)}`,
        //     [
        //     {
        //         text: 'OK',
        //         onPress: () => {
        //           navigation.dispatch(StackActions.pop(1));
        //         },
        //     },
        //     ],
        //     { cancelable: false }
        // );

            }).catch(error => {
              // Handle error
              setLoading(false);
              setShowSuccess(false); // Reset success state
              setShowPaymentAmountInputSelectedView(false);
              setTimeout(() => {
                Alert.alert(`${t(' ')}`,error?.response?.data?.message);
               
              }, 500); // 0.5 seconds delay
            });
      
   
       }else{
        setLoading(false);
        setShowSuccess(false); // Reset success state

        Alert.alert(`${t('To_send_your_Request')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
       }
      
    }
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t('Admin_Wallet')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
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
                      <Text style={styles.successText}>{t('payment_to_trainer_done_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
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
                    {/* <Text style={[styles.trainerPricingTextValues,styles.TraineFullNameText]}>{ourPersonalTrainer?.trnrId || ''}</Text>    */}

                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNumberText : styles.EnglishTrainerPricingNumberText]}>{parseFloat(ourPersonalTrainer?.trainer_count?.toFixed(2)) || ''}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrencyText : styles.EnglishTrainerPricingCurrencyText]}>{ourPersonalTrainer?.curncy || ''}</Text>
                    {(ourPersonalTrainer?.curncy == "EGP")?(
                      <>
                      <Pressable style={{backgroundColor:'#000',height:50,width:70,paddingRight:5,paddingLeft:5,borderRadius:35,justifyContent:'center',alignItems:'center',marginVertical:3,position:'absolute',right:'7%',textAlign:"center"}}
                       onPress={() => {
                          setOurOnePersonalTrainerState(ourPersonalTrainer); // Save the current trainer
                          setShowPaymentAmountInputSelectedView(true); // Show modal
                        }}
                      >

                      <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('pay')}</CalendarFullSizePressableButtonText>
                    </Pressable>
                    <Modal transparent visible={showPaymentAmountInputSelectedView} >
                      <View style={{ flexDirection: 'row', alignItems: 'center',width:260,height:260, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                        <Text style={{ color: 'white',marginRight:5 }}>{t('Amount')}</Text>
                        <TextInput
                          style={{ borderWidth: 1, borderColor: 'white',width:90, borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                          placeholder={t("Amount")}
                          keyboardType="numeric"
                          value={paymentAmountInput}
                          onChangeText={(text) => setPaymentAmountInput(text)}
                        />
                        <Pressable   onPress={()=>payToTrainerPayments(paymentAmountInput,ourOnePersonalTrainerState?.trainer_count,ourOnePersonalTrainerState?.curncy,ourOnePersonalTrainerState?.trnrId,userToken)}>
                          <Text style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5,padding:9 }}>{t("OK")}</Text>
                        </Pressable>
                        <Pressable onPress={() => setShowPaymentAmountInputSelectedView(false)}>
                          <Text style={{ color: 'white',borderWidth: 1,marginLeft:10, borderColor: 'white', borderRadius: 5,padding:9 }}>X</Text>
                        </Pressable>
                      </View>
                    </Modal>
                        </>
                    ):(
                      null
                    )}
                    {/* Paypal pay button will take you to payment button which you will enter trainer paypal email to pay by it */}
                    {/* <Pressable style={{backgroundColor:'#000',height:50,width:70,paddingRight:5,paddingLeft:5,borderRadius:35,justifyContent:'center',alignItems:'center',marginVertical:3,position:'absolute',right:'7%',textAlign:"center"}} onPress={()=>navigation.navigate('PayToTrainerFromOurApp',{trainer_countSent:ourPersonalTrainer?.trainer_count,curncySent:ourPersonalTrainer?.curncy,trnrIdSent:ourPersonalTrainer?.trnrId,fNameSent:ourPersonalTrainer?.fName,lNameSent:ourPersonalTrainer?.lName,userTokenSent:userToken})}>

                      <CalendarFullSizePressableButtonText style={{textAlign:"center"}}>{t('payment_page')}</CalendarFullSizePressableButtonText>
                    </Pressable> */}

                    
                  </View>
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
                                
                </View>
                
              ))}
        {/* <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>End Date:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.end ? selectedDates.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer> */}
       
        

        
        <Spacer size="medium">
          <View style={{marginLeft:10,marginRight:10,marginTop:30}}>
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
    marginBottom:10,
  },
  TraineFullNameText:{
    width:90,
    position:'absolute',
    left:"3%"
  },
  ArabicTrainerPricingCurrencyText:{
    position:'absolute',
    right:"29%"
  },
  EnglishTrainerPricingCurrencyText:{
    position:'absolute',
    right:"34%"
  },
  ArabicTrainerPricingNumberText:{
    position:'absolute',
    left:"46%"
  },
  EnglishTrainerPricingNumberText:{
    position:'absolute',
    left:"38%"
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

  },
  ArabicHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'47%',
  },
  EnglishHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'40%',
  },
  headerTraineFullNameText:{ 
    position:'absolute',
  left:'5%',
},
ArabicHeaderTrainerPricingCurrency:{
    position:'absolute',
    right:'28%',
  },
  EnglishHeaderTrainerPricingCurrency:{
    position:'absolute',
    right:'28%',
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