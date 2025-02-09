import React, { useEffect, useContext,useState,useRef } from "react";
import { Modal,Switch,View, Text, Image,TextInput, StyleSheet, ScrollView, Dimensions,Alert, Animated, Easing } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { StackActions } from '@react-navigation/native';
import { addEventListener } from "@react-native-community/netinfo";
import axios from 'axios';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

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
    PageMainImage,

} from "../components/account.styles";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlansCalendarScreen } from "./TrainerManageMyProfileCalendar";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const AdminSettingsAppScreen = ({ navigation,route }) => {
    const {t} = useTranslation();//add this line
   
    

    const [isAllowForeignTrainersOn, setIsAllowForeignTrainersOn] = useState(false);
    const [adminCommissionNumber,setAdminCommissionNumber]=useState("");
    const [xpayEgCommissionNumber,setXpayEgCommissionNumber]=useState("");
    const [xpayForeignCommissionNumber,setXpayForeignCommissionNumber]=useState("");

    const [bankCommissionNumber,setBankommissionNumber]=useState("");


    

    const [AdminSettingsData,setAdminSettingsData]=useState({});
   
    const [userId, setUserId] = useState("");  
    const [triainerConnected,setTriainerConnected] =  useState(false);
    const speKey = userId + '.' + new Date().getTime();

    const [loading, setLoading] = useState(false);
      const [loadingPageInfo, setLoadingPageInfo] = useState(true);
      const [showSuccess, setShowSuccess] = useState(false);
      const checkmarkAnimation = useRef(new Animated.Value(0)).current;
    useFocusEffect(
        React.useCallback(() => {
            
            (async () => {
                AsyncStorage.getItem("sanctum_token")
            .then((res) => {
                    //////console.log('tokeeen:',res);
                    AsyncStorage.getItem("currentUser").then((user) => {
                
                        const storedUser = JSON.parse(user);
                        setUserId(storedUser.id);
                        let userIdLet = storedUser.id;
                        const unsubscribe = addEventListener(state => {
                            //////console.log("Connection type--", state.type);
                            //////console.log("Is connected?---", state.isConnected);
                            setTriainerConnected(state.isConnected);
                            if(state.isConnected){
                                ////console.log('---------------now online--------')
                                // setLoadingPageInfo(true);
                    
                                axios.get(`https://life-pf.com/api/Admin-Settings-App-Get-Data-From-Database`, {
                                headers: {
                                  'Authorization': `Bearer ${res}`,
                                  'Content-Type': 'application/json',
                                },
                                })
                                .then(response => {
                                  // Handle successful response
                                  if(Object.keys(response?.data["AdminSettingsAppRow"]).length > 0){
                                    //console.log(' Object.keys AdminSettingsAppRow length > 0::,',Object.keys(response?.data["AdminSettingsAppRow"]).length > 0);
                                    //console.log('AdminSettingsAppRow::,',response?.data["AdminSettingsAppRow"]);
                                    //console.log('AlFoTr == "1"::,',response?.data["AdminSettingsAppRow"]?.AlFoTr == "1");


                                    setAdminSettingsData(response?.data["AdminSettingsAppRow"]);
                                    setAdminCommissionNumber(response?.data["AdminSettingsAppRow"]?.admCom);
                                    setXpayEgCommissionNumber(response?.data["AdminSettingsAppRow"]?.xpyEgCom);
                                    setXpayForeignCommissionNumber(response?.data["AdminSettingsAppRow"]?.xpyForCom);
                                    setBankommissionNumber(response?.data["AdminSettingsAppRow"]?.bnkCom);
                                    setIsAllowForeignTrainersOn((response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false);
                                }
                                })
                                .catch(error => {
                                  // Handle error
                                  ////console.log('Error fetching Meals:', error);
                                  // setLoadingPageInfo(false);
                    
                                });
                          
                              }else{
                                ////console.log('else no internet ahmed');
                               
                                // setLoadingPageInfo(false);
                       
                          
                              }
                            
                        });
                        unsubscribe();
                    });
                });
        
        
        })(); // Immediately invoked async function

        }, [])
    );

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
    const sendAdminSettingsAppData = async (AdminSettingsData,adminCommissionNumber,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionNumber,isAllowForeignTrainersOn) => {
        if(adminCommissionNumber == undefined){
            Alert.alert(`${t("you_must_fill_Commission_Number")}`);
            return;
          }
          
          if (adminCommissionNumber?.trim() == "") {
            Alert.alert(`${t("you_must_fill_Commission_Number")}`);
            return;
          };

          if(xpayEgCommissionNumber == undefined){
            Alert.alert('',`${t("you_must_fill_xpay_Eg_Commission_Number")}`);
            return;
          }
          
          if (xpayEgCommissionNumber?.trim() == "") {
            Alert.alert('',`${t("you_must_fill_xpay_Eg_Commission_Number")}`);
            return;
          };
          if(xpayForeignCommissionNumber == undefined){
            Alert.alert('',`${t("you_must_fill_xpay_foreign_Commission_Number")}`);
            return;
          }
          
          if (xpayForeignCommissionNumber?.trim() == "") {
            Alert.alert('',`${t("you_must_fill_xpay_foreign_Commission_Number")}`);
            return;
          };
          if(bankCommissionNumber == undefined){
            Alert.alert(`${t("you_must_fill_bank_Commission_Number")}`);
            return;
          }
          
          if (bankCommissionNumber?.trim() == "") {
            Alert.alert(`${t("you_must_fill_bank_Commission_Number")}`);
            return;
          };


        let updateAdminSettingsData= {
            speKey:AdminSettingsData?.speKey ? AdminSettingsData?.speKey: speKey,
            admCom: adminCommissionNumber, 
            xpyEgCom: xpayEgCommissionNumber, 
            xpyForCom: xpayForeignCommissionNumber, 
            bnkCom: bankCommissionNumber, 
            AlFoTr: isAllowForeignTrainersOn,
          };		
console.log('updateAdminSettingsData',updateAdminSettingsData);
           if(triainerConnected){   
                setLoading(true);
                setShowSuccess(false); // Reset success state           
                 axios.post(`https://life-pf.com/api/AdminSettingsApp-update-data-into-database`, updateAdminSettingsData, {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json", // Use application/json for non-multipart data
                  }
                }).then((response) => {
                    //console.log('AdminSettingsApp-insert-data updated succesfully')
                    setLoading(false);
                    setShowSuccess(true); // Show success message and animation
                    // Delay to allow users to see the success message before closing the modal
                    setTimeout(() => {
                        setShowSuccess(false);
                    }, 2000); // 2 seconds delay
                }).catch((error) => {
                    setLoading(false);
                    setShowSuccess(false); // Reset success state
                    //console.log('Error updating AdminSettingsApp:', error);
                });
           }else{
            setLoading(false);
            setShowSuccess(false); // Reset success state
            // Alert.alert(`${t('To_send_your_data_for_Approving')}`,
            // `${t('You_must_be_connected_to_the_internet')}`);
           }
      };






  return (
    <PageContainer>
        <ScrollView>
        <TitleView >
            <Title >Life</Title>
        </TitleView>
        {/* <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t("Capacity")}</ServicesPagesCardHeader>
        </ServicesPagesCardCover> */}
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
                      <Text style={styles.successText}>{t('Admin_settings_updated_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
        <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/home_App_Settings.png')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
        </ServicesPagesCardCover>
        <Spacer size="medium">
        <InputField>
        <FormLabelView>
            <FormLabel>{t("Commission")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
            <FormInput
            placeholder="%"
            value={adminCommissionNumber}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setAdminCommissionNumber(u)}
            />
        </FormInputView>
        </InputField>
        </Spacer>
        <Spacer size="medium">
        <InputField>
        <FormLabelView>
            <FormLabel>{t("xpay_Commission_Eg")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
            <FormInput
            placeholder="%"
            value={xpayEgCommissionNumber}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setXpayEgCommissionNumber(u)}
            />
        </FormInputView>
        </InputField>
        </Spacer>
        <Spacer size="medium">
        <InputField>
        <FormLabelView>
            <FormLabel>{t("xpay_Commission_for")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
            <FormInput
            placeholder="%"
            value={xpayForeignCommissionNumber}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setXpayForeignCommissionNumber(u)}
            />
        </FormInputView>
        </InputField>
        </Spacer>
        <Spacer size="medium">
        <InputField>
        <FormLabelView>
            <FormLabel>{t("bank_Commission")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
            <FormInput
            placeholder="%"
            value={bankCommissionNumber}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setBankommissionNumber(u)}
            />
        </FormInputView>
        </InputField>
        </Spacer>
        <Spacer size="medium">
        <InputField>
            <FormLabelView style={{width:"50%"}}>
            <FormLabel>{t("Foreign_trainers")}:</FormLabel>
            </FormLabelView>
            <Switch
            value={isAllowForeignTrainersOn}
            onValueChange={() => setIsAllowForeignTrainersOn(!isAllowForeignTrainersOn)}
            trackColor={{ false: '#767577', true: '#000' }}
            thumbColor={isAllowForeignTrainersOn ? '#d0d7dd' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            />
        </InputField>
        </Spacer>
        <Spacer size="medium">
        <View  style={{flex:1,flexDirection:"column",}}>
        {/* <FormLabelView  style={{width:width-20,marginLeft:10,marginRight:10}}>
            <FormLabel>{t("Trainers_specific_Commissions")}:</FormLabel>
        </FormLabelView> */}
        <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
            onPress={() => {navigation.navigate('TrainersSpecificCommissions');}}
            >
                
                <CalendarFullSizePressableButtonText >{t("Trainers_specific_Commissions")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </View>
        </Spacer>
        <Spacer size="large">

            <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
            onPress={() => {sendAdminSettingsAppData(AdminSettingsData,adminCommissionNumber,xpayEgCommissionNumber,xpayForeignCommissionNumber,bankCommissionNumber,isAllowForeignTrainersOn);}}
            >
                
                <CalendarFullSizePressableButtonText >{t("Save")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
                {/* <FormElemeentSizeButtonView>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
        onPress={hideCapacityModal}>
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView> */}
            </Spacer>
        <Spacer size="large"></Spacer>
        </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    width: width - 20, // he screen width minus padding
    height: 400, // Adjust as needed
    marginBottom: 10,
    position: 'relative',
  },
 
  image: {
    width: '100%',
    height: '100%',
    borderRadius:30,

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