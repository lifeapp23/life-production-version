import React, { useEffect, useContext,useState,useRef } from "react";
import { Switch,View, Text, Image,TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { StackActions } from '@react-navigation/native';
import { addEventListener } from "@react-native-community/netinfo";
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


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PlansCalendarScreen } from "./TrainerManageMyProfileCalendar";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const TrainerProfileCapacityScreen = ({ navigation,route }) => {
    const {t} = useTranslation();//add this line
    const params = route.params || {};
     //console.log('params',params);
    const { isAcceptSubscriptionsOnSentFromTMProfile = false,IsAcceptSubscriptionsOnForComparsionSentFromTMProfile =true, selectedDatesSentFromTMProfile = {},capacityNumberSentFromTMProfile = "",trainerTraineesCountSentFromTMProfile = ""} = params;

    const [selectedDates, setSelectedDates] = useState({});
    const [isAcceptSubscriptionsOn, setIsAcceptSubscriptionsOn] = useState(false);
    const [capacityNumber,setCapacityNumber]=useState("");
    const [trainerTraineesCount, setTrainerTraineesCount] = useState(trainerTraineesCountSentFromTMProfile || "");  
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [userId, setUserId] = useState("");  
    const [triainerConnected,setTriainerConnected] =  useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
        setShowInfo(!showInfo);
    };
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
                            if(isAcceptSubscriptionsOnSentFromTMProfile == true && IsAcceptSubscriptionsOnForComparsionSentFromTMProfile == false){
                                let updateisAccectpToFalseColumnData = {
                                    userId: userIdLet, // You still need to send the userId to identify the record
                                    acpSub: false,
                                  };
                                   if(state.isConnected){              
                                         axios.post(`https://life-pf.com/api/TrainerManageMyProfile-update-isAccept-To-False`, updateisAccectpToFalseColumnData, {
                                          headers: {
                                            Accept: "application/json",
                                            "Content-Type": "application/json", // Use application/json for non-multipart data
                                          }
                                        }).then((response) => {
                                            //console.log('isAccectp To False will be activated')
                                        }).catch((error) => {
                                            //console.log('Error updating isAccectp-To-False:', error);
                                        });
                                   }else{
                                    // Alert.alert(`${t('To_send_your_data_for_Approving')}`,
                                    // `${t('You_must_be_connected_to_the_internet')}`);
                                   }
                            }
                        });
                        unsubscribe();
                    });
                });
        try {
            // const start = await AsyncStorage.getItem('CapacityManageMyProfileStartDate');
            // const end = await AsyncStorage.getItem('CapacityManageMyProfileEndDate');
            const IsAcceptSubscriptionsOnAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');
            const CapacityManageMyProfileCapacityNumberAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileCapacityNumber');

            
            // const refundPolicyManageMyProfileAsyncStorage = await AsyncStorage.getItem('refundPolicyManageMyProfile');
            // //console.log('start:', start);
            // //console.log('end:', end);
            //console.log('IsAcceptSubscriptionsOn:', IsAcceptSubscriptionsOnAsyncStorage);
            //console.log('isAcceptSubscriptionsOnSentFromTMProfile:', isAcceptSubscriptionsOnSentFromTMProfile);
            
            // //console.log('refundPolicyManageMyProfile:', refundPolicyManageMyProfileAsyncStorage);
            // if (start !== null && end !== null) {
            //     setSelectedDates({ start, end });
            // }else{
            //     setSelectedDates(selectedDatesSentFromTMProfile);
            // }

            if (CapacityManageMyProfileCapacityNumberAsyncStorage !== null) {
                setCapacityNumber(CapacityManageMyProfileCapacityNumberAsyncStorage);
            }else{
                setCapacityNumber(capacityNumberSentFromTMProfile);
            }
            

              if (IsAcceptSubscriptionsOnAsyncStorage !== null) {
                // Parse the boolean value
                const parsedAcceptSubscriptions = JSON.parse(IsAcceptSubscriptionsOnAsyncStorage);
                setIsAcceptSubscriptionsOn(parsedAcceptSubscriptions);
              }else{
                if(isAcceptSubscriptionsOnSentFromTMProfile == true && IsAcceptSubscriptionsOnForComparsionSentFromTMProfile == false){
                    setIsAcceptSubscriptionsOn(IsAcceptSubscriptionsOnForComparsionSentFromTMProfile);

                }else{
                    setIsAcceptSubscriptionsOn(isAcceptSubscriptionsOnSentFromTMProfile);

                }
              }
        
            //   if (refundPolicyManageMyProfileAsyncStorage !== null) {
            //     setRefundPolicySentData(refundPolicyManageMyProfileAsyncStorage);
            //   }else{
            //     setRefundPolicySentData();
            //   }
        } catch (error) {
            //console.log('Error fetching data:', error);
          }
        
        })(); // Immediately invoked async function

        }, [])
    );

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
      useEffect(() => {
        (async () => {
            //console.log('isAcceptSubscriptionsOn useEffect(',isAcceptSubscriptionsOn);
        if(trainerTraineesCount == capacityNumber && isAcceptSubscriptionsOn || isAcceptSubscriptionsOn == true || isAcceptSubscriptionsOn == 'true' || isAcceptSubscriptionsOn == "yes"){
            setIsAcceptSubscriptionsOn(false);
            // const acceptStatus = isAcceptSubscriptionsOn == 1 || isAcceptSubscriptionsOn == true || isAcceptSubscriptionsOn == 'true'  ? true : false;
            // await AsyncStorage.setItem('CapacityManageMyProfileIsAcceptSubscriptionsOn', JSON.stringify(acceptStatus));
            let updateisAccectpToFalseColumnData = {
                userId: userId, // You still need to send the userId to identify the record
                acpSub: false,
              };
               if(triainerConnected){              
                     axios.post(`https://life-pf.com/api/TrainerManageMyProfile-update-isAccept-To-False`, updateisAccectpToFalseColumnData, {
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json", // Use application/json for non-multipart data
                      }
                    }).then((response) => {
                        //console.log('isAccectp To False will be activated')
                    }).catch((error) => {
                        //console.log('Error updating isAccectp-To-False:', error);
                    });
               }else{
                // Alert.alert(`${t('To_send_your_data_for_Approving')}`,
                // `${t('You_must_be_connected_to_the_internet')}`);
               }
              
            }
        })(); // Immediately invoke the async function
    }, [capacityNumber]);
    //   useEffect(() => {
    //     (async () => {
    //         const CapacityManageMyProfileStartDateAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileStartDate');
    //         const CapacityManageMyProfileEndDateAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileEndDate');
    //         const IsAcceptSubscriptionsOnAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');

    //         const refundPolicyManageMyProfileAsyncStorage = await AsyncStorage.getItem('refundPolicyManageMyProfile');
    //         //console.log('CapacityManageMyProfileStartDateAsyncStorage',CapacityManageMyProfileStartDateAsyncStorage);
    //         //console.log('CapacityManageMyProfileEndDateAsyncStorage',CapacityManageMyProfileEndDateAsyncStorage);
    //         //console.log('IsAcceptSubscriptionsOnAsyncStorage',IsAcceptSubscriptionsOnAsyncStorage);
    //         //console.log('refundPolicyManageMyProfileAsyncStorage',refundPolicyManageMyProfileAsyncStorage);

    //     })(); // Immediately invoke the async function

        
    // }, []);




    const sendCapacityData = async (selectedDates, isAcceptSubscriptionsOn) => {
        try {
        //   await AsyncStorage.setItem('CapacityManageMyProfileStartDate', selectedDates.start);
        //   await AsyncStorage.setItem('CapacityManageMyProfileEndDate', selectedDates.end);
          await AsyncStorage.setItem('CapacityManageMyProfileCapacityNumber', capacityNumber);

          const acceptStatus = isAcceptSubscriptionsOn == 1 ? true : false;
          await AsyncStorage.setItem('CapacityManageMyProfileIsAcceptSubscriptionsOn', JSON.stringify(acceptStatus));
              // navigation.dispatch(StackActions.pop(1));

          // Navigate back after successfully saving data
          navigation.goBack();
        } catch (error) {
          //console.log('Error saving data:', error);
        }
      };






  return (
    <PageContainer>
        <ScrollView>
        <TitleView >
            <Title >Life</Title>
        </TitleView>
        <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t("Capacity")}</ServicesPagesCardHeader>
        </ServicesPagesCardCover>
        <Spacer size="large">
            <ServiceInfoParentView >
            {showInfo ? (
                <ServiceCloseInfoButtonView>
                <ServiceCloseInfoButton onPress={toggleInfo}>
                    <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                </ServiceCloseInfoButton>
                <ServiceCloseInfoButtonTextView>
                    <ServiceCloseInfoButtonText>{t("trainer_profile_capacity_page_desc")}</ServiceCloseInfoButtonText>
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
        <FormInputView>
            <FormInput
            placeholder="Capacity"
            value={capacityNumber}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setCapacityNumber(u)}
            />
        </FormInputView>
        {/* <FormLabelDateRowView><FormLabelDateRowViewText>{capacityNumber}</FormLabelDateRowViewText></FormLabelDateRowView> */}
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
        {/* {(isAcceptSubscriptionsOn === true)?(
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
        ):(null)} */}
        <Spacer size="large">

            <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
            onPress={() => {sendCapacityData(selectedDates,isAcceptSubscriptionsOn);}}
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

 
  });