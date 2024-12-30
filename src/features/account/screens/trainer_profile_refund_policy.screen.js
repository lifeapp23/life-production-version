import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Alert,Image,TextInput, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { StackActions } from '@react-navigation/native';
import { Checkbox } from 'react-native-paper';


import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  InputField,
    FormInput,
    FormLabel,
    FormLabelView,
    FormInputView,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
} from "../components/account.styles";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const TrainerProfileRefundPolicyScreen = ({ navigation,route }) => {
    const {t} = useTranslation();//add this line
    const params = route.params || {};
    //console.log('params',params);

  const { refundPolicySentData = "",noRefund=false } = params;

    const [refundPolicySentDataFromRoute, setRefundPolicySentDataFromRoute] = useState("");  
    const [noRefundSentDataFromRoute, setNoRefundSentDataFromRoute] = useState(false);

    useFocusEffect(
      React.useCallback(() => {
          (async () => {
      try {
          // const start = await AsyncStorage.getItem('CapacityManageMyProfileStartDate');
          // const end = await AsyncStorage.getItem('CapacityManageMyProfileEndDate');
          // const IsAcceptSubscriptionsOnAsyncStorage = await AsyncStorage.getItem('CapacityManageMyProfileIsAcceptSubscriptionsOn');
          const refundPolicyManageMyProfileAsyncStorage = await AsyncStorage.getItem('refundPolicyManageMyProfile');
          const noRefundManageMyProfileAsyncStorage = await AsyncStorage.getItem('noRefundManageMyProfile');

          
          // //console.log('start:', start);
          // //console.log('end:', end);
          // //console.log('IsAcceptSubscriptionsOn:', IsAcceptSubscriptionsOnAsyncStorage);
          //console.log('refundPolicyManageMyProfile:', refundPolicyManageMyProfileAsyncStorage);
          //console.log('noRefundManageMyProfileAsyncStorage:', noRefundManageMyProfileAsyncStorage);

          // if (start !== null && end !== null) {
          //     setSelectedDates({ start, end });
          // }else{
          //     setSelectedDates(selectedDatesSentFromTMProfile);
          // }
      
          //   if (IsAcceptSubscriptionsOnAsyncStorage !== null) {
          //     // Parse the boolean value
          //     const parsedAcceptSubscriptions = JSON.parse(IsAcceptSubscriptionsOnAsyncStorage);
          //     setIsAcceptSubscriptionsOn(parsedAcceptSubscriptions);
          //   }else{
          //     setIsAcceptSubscriptionsOn(isAcceptSubscriptionsOnSentFromTMProfile);
          //   }
      
            if (refundPolicyManageMyProfileAsyncStorage !== null) {
              setRefundPolicySentDataFromRoute(refundPolicyManageMyProfileAsyncStorage);
            }else{
              setRefundPolicySentDataFromRoute(refundPolicySentData);
            }
            if (noRefundManageMyProfileAsyncStorage !== null) {
              setNoRefundSentDataFromRoute(noRefundManageMyProfileAsyncStorage);
            }else{
              setNoRefundSentDataFromRoute(noRefund);
            }

      } catch (error) {
          //console.log('Error fetching data:', error);
        }
      
      })(); // Immediately invoked async function

      }, [])
  );


//console.log('noRefundSentDataFromRoute',noRefundSentDataFromRoute);







const sendRefundPolicyData = async (refundPolicySentDataFromRoute,noRefundSentDataFromRoute) => {
    await AsyncStorage.setItem('refundPolicyManageMyProfile', refundPolicySentDataFromRoute);
    
          
    await AsyncStorage.setItem('noRefundManageMyProfile', JSON.stringify(noRefundSentDataFromRoute));

    // navigation.dispatch(StackActions.pop(1));
    navigation.goBack();
};





  return (
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
                <FormLabel>{t("noRefund")}:</FormLabel>
              </FormLabelView>
              <Checkbox
                  status={noRefundSentDataFromRoute ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setNoRefundSentDataFromRoute(!noRefundSentDataFromRoute);
                  }}
                  color="black"
                  uncheckedColor="black"
                />
           </InputField>
          </Spacer>
        <Spacer size="medium">
            <InputField>
            <FormLabelView>
            <FormLabel style={{top:-58}}>{t('Refund_Policy')}:</FormLabel>
            </FormLabelView>
            <FormInputView>
            <TextInput
                disabled={noRefundSentDataFromRoute ? true: false}
                editable={!noRefundSentDataFromRoute} // editable if noRefundSentDataFromRoute is false
                multiline
                numberOfLines={7}
                maxLength={300}
                placeholder={t('Refund_Policy')}
                value={refundPolicySentDataFromRoute}
                keyboardType="default"
                style={styles.aboutMeTextArea}
                onChangeText={(u) => setRefundPolicySentDataFromRoute(u)}
            />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="large">
                <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
                    onPress={() => {
                        if (refundPolicySentDataFromRoute) {
                        sendRefundPolicyData(refundPolicySentDataFromRoute,noRefundSentDataFromRoute);
                        
                        } else {
                        Alert.alert(`${t('All_fields_are_required')}`);
                        }
                    }}>
                <CalendarFullSizePressableButtonText >{t('Save')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                {/* <FormElemeentSizeButtonView>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
        onPress={hideRefundPolicyModal}>
                <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView> */}
            </Spacer>
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
 
  });