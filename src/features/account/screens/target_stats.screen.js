import React, { useState,useEffect, useRef } from "react";
import { ScrollView,Modal,Alert,StyleSheet,View,Text, Animated, Easing} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  FullSizeButtonView,
  FullButton,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormInputSizeButton,
  ViewOverlay,
  FormLabelDateRowView,
  NewFormLabelDateRowView,
  FormLabelDateRowViewText,
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  AsteriskTitle,

} from "../components/account.styles";
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

import { Spacer } from "../../../components/spacer/spacer.component";
import { useDate } from './DateContext'; // Import useDate from the context
import { TargetsCalendarScreen } from "./targets_calendar";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 
import { fetchTargetStats,insertOrUpdateTargetStats,fetchTargetStatsLastInsertedRow} from "../../../../database/target_stats";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line


export const TargetStatsScreen = ({ navigation,route }) => {
  const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;


  const [weightTargetStats, setWeightTargetStats] = useState("");
  const [neckTargetStats, setNeckTargetStats] = useState("");  
  const [shoulderTargetStats, setShoulderTargetStats] = useState("");
  const [chestTargetStats, setChestTargetStats] = useState("");
  const [armTargetStats, setArmTargetStats] = useState(""); 
  const [forearmTargetStats, setForearmTargetStats] = useState("");
  const [torsoTargetStats, setTorsoTargetStats] = useState("");
  const [highHipsTargetStats, setHighHipsTargetStats] = useState("");  
  const [hipsTargetStats, setHipsTargetStats] = useState("");
  const [thighTargetStats, setThighTargetStats] = useState("");
  const [calvesTargetStats, setCalvesTargetStats] = useState(""); 
  const { selectedDate } = useDate(); // Access selectedDate from the context
  const [modalVisible, setModalVisible] = useState(false);
  const [targetStatsLastInsertedRow, setTargetStatsLastInsertedRow] = useState(null);
  const [userIdNum, setUserIdNum] = useState('');
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;

  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: targetStatsLastInsertedRow?.date;

  let targetStatsLastInsertedRowRowHasData = "";
  if(targetStatsLastInsertedRow != null){
    targetStatsLastInsertedRowRowHasData = Object.values(targetStatsLastInsertedRow).some(value => value !== "");

  }
  const {t} = useTranslation();//add this line
  useEffect(() => {
    //console.log('Route Params:', params);
    

    if (dayWorkoutWorkedTask && sentPassNewDate) {
      //console.log('dayWorkoutWorkedTask:', dayWorkoutWorkedTask);
      //console.log('sentPassNewDate:', sentPassNewDate);
      setWeightTargetStats(dayWorkoutWorkedTask.weight?.toString() || "");
      setNeckTargetStats(dayWorkoutWorkedTask.neck?.toString() || "");
      setShoulderTargetStats(dayWorkoutWorkedTask.should?.toString() || "");
      setChestTargetStats(dayWorkoutWorkedTask.chest?.toString() || "");
      setArmTargetStats(dayWorkoutWorkedTask.arm?.toString() || "");
      setForearmTargetStats(dayWorkoutWorkedTask.forarm?.toString() || "");
      setTorsoTargetStats(dayWorkoutWorkedTask?.torso?.toString() || "");
      setHighHipsTargetStats(dayWorkoutWorkedTask?.hHips?.toString() || "");  
      setHipsTargetStats(dayWorkoutWorkedTask?.hips ?.toString() || "");
      setThighTargetStats(dayWorkoutWorkedTask?.thigh?.toString() || "");
      setCalvesTargetStats(dayWorkoutWorkedTask?.calves?.toString() || ""); 
      // setLoadingPageInfo(false);

    } else {
      //console.log('dayWorkoutWorkedTask is', dayWorkoutWorkedTask);
      //console.log('sentPassNewDate is', sentPassNewDate);
      // setLoadingPageInfo(false);

    }
  }, [params]);

useFocusEffect(
  React.useCallback(() => {
    // Fetch the latest data or update the state here
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      // Extract the ID part from the token and convert it to a number
      const tokenIDPart = parseInt(res.split('|')[0], 10);
      getUserIdFromTokenId(tokenIDPart)
        .then((userId) => {
          setUserIdNum(userId);
          fetchTargetStatsLastInsertedRow(userId)
          .then((row) => {
            setTargetStatsLastInsertedRow(row);
            setLoadingPageInfo(false);

          })
          .catch((error) => {
            setLoadingPageInfo(false);

            //console.error('Error fetching last inserted row:', error);
          });
        })
    });   

    const timer = setTimeout(() => {
      setLoadingPageInfo(false);
    }, 2000); // 2 seconds
    // return () => clearTimeout(timer); // Cleanup the timer on component unmount

  }, [AsyncStorage,getUserIdFromTokenId])
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
  const todayDate = new Date().toISOString().split('T')[0];
  const checkPastDate = selectedDate <= todayDate ? true : false ;
  ////console.log('checkPastDate',checkPastDate);
  const handleTargetStatsSubmit = async () => {
    
    if (!weightTargetStats && !targetStatsLastInsertedRow?.weight?.toString() || !selectedDate && !lastInsertedRowDate) {
      Alert.alert(`${t('weight_Date_fields_are_required')}`);
      return;
    }
    if(weightTargetStats == "0" || targetStatsLastInsertedRow?.weight === 0 ){
      Alert.alert(`${t('Weight_must_be_greater_than_zero')}`); 
      return;
    }
    if(checkPastDate && selectedDate !== ""){
      Alert.alert(`${t("You_should_select_date_in_the_Future")}`);
      return;
    }
    setLoading(true);

    const userTargetStats = {
      user_id :userIdNum,
      date: selectedDate !== "" ? selectedDate : lastInsertedRowDate,
      weight: weightTargetStats !== "" ? weightTargetStats : targetStatsLastInsertedRow?.weight?.toString(),
      neck: neckTargetStats !== "" ? neckTargetStats : targetStatsLastInsertedRow?.neck?.toString() || "",
      shoulder: shoulderTargetStats !== "" ? shoulderTargetStats : targetStatsLastInsertedRow?.should?.toString() || "",
      chest: chestTargetStats !== "" ? chestTargetStats : targetStatsLastInsertedRow?.chest?.toString() || "",
      arm: armTargetStats !== "" ? armTargetStats : targetStatsLastInsertedRow?.arm?.toString() || "",
      forearm: forearmTargetStats !== "" ? forearmTargetStats : targetStatsLastInsertedRow?.forarm?.toString() || "",
      torso: torsoTargetStats !== "" ? torsoTargetStats : targetStatsLastInsertedRow?.torso?.toString() || "",
      h_hips: highHipsTargetStats !== "" ?  highHipsTargetStats : targetStatsLastInsertedRow?.hHips?.toString() || "",
      hips: hipsTargetStats !== "" ? hipsTargetStats : targetStatsLastInsertedRow?.hips?.toString() || "",
      thigh: calvesTargetStats !== "" ? calvesTargetStats : targetStatsLastInsertedRow?.calves?.toString() || "",
      calves: thighTargetStats !== "" ? thighTargetStats : targetStatsLastInsertedRow?.thigh?.toString() || "",
      is_sync :'no',
    };

    insertOrUpdateTargetStats(userTargetStats).then((result)=>{
      ////console.log('result insert user TargetStats into database',result);
      setLoading(false);
      setShowSuccess(true); // Show success message and animation
      // Delay to allow users to see the success message before closing the modal
      setTimeout(() => {
        setShowSuccess(false);
            //         navigation.navigate('OurServices');

      }, 2000); // 2 seconds delay

    //   Alert.alert(`${t(' ')}`,
    //   `${t('Your_TargetStats_added_successfully')}`,
    //   [
    //     {
    //       text: 'OK',
    //       onPress: () => {
    //         navigation.navigate('OurServices');
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
    }).catch((error) => {
      setLoading(false);
      setShowSuccess(false); // Reset success state
      Alert.alert(` `,
        `${t(error.message)}`);
    });
  };

  return (
    <PageContainer>
    <ScrollView >

            <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}

                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
            </Modal>
        {/* <Spacer size="medium">
          <InputField >
          <FormLabelView>
            <FormLabel>{t("Achieved_Plan")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInputSizeButton
              icon="calendar-account"
              mode="contained"
              onPress={() => setModalVisible(true)}
            >{t("Date")}</FormInputSizeButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <TargetsCalendarScreen  navigation={navigation} 
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
          </FormInputView>
        </InputField>
      </Spacer> */}
      <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
               <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Select_Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
              <Modal visible={modalVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                <TargetsCalendarScreen  navigation={navigation} 
                      onAddEntry={() => setModalVisible(false)}
                    />
                </ViewOverlay>
              </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{selectedDate !== "" ? selectedDate : lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Weight")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Weight")}
              value={weightTargetStats !== '' ? weightTargetStats : targetStatsLastInsertedRow?.weight?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Neck")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Neck")}
              value={neckTargetStats !== '' ? neckTargetStats : targetStatsLastInsertedRow?.neck?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setNeckTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Shoulder")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Shoulder")}
            value={shoulderTargetStats !== '' ? shoulderTargetStats : targetStatsLastInsertedRow?.should?.toString()}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setShoulderTargetStats(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Chest")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Chest")}
              value={chestTargetStats !== '' ? chestTargetStats : targetStatsLastInsertedRow?.chest?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setChestTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Arm")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Arm")}
              value={armTargetStats !== '' ? armTargetStats : targetStatsLastInsertedRow?.arm?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setArmTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Forearm")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Forearm")}
            value={forearmTargetStats !== '' ? forearmTargetStats : targetStatsLastInsertedRow?.forarm?.toString()}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setForearmTargetStats(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Torso")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Torso")}
              value={torsoTargetStats !== '' ? torsoTargetStats : targetStatsLastInsertedRow?.torso?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setTorsoTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      {/* <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>{t("High_Hips")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("High_Hips")}
              value={highHipsTargetStats !== '' ? highHipsTargetStats : targetStatsLastInsertedRow?.hHips?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setHighHipsTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer> */}
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Hips")}
            value={hipsTargetStats !== '' ? hipsTargetStats : targetStatsLastInsertedRow?.hips?.toString()}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsTargetStats(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Thigh")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Thigh")}
              value={thighTargetStats !== '' ? thighTargetStats : targetStatsLastInsertedRow?.thigh?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setThighTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Calves")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Calves")}
              value={calvesTargetStats !== '' ? calvesTargetStats : targetStatsLastInsertedRow?.calves?.toString()}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setCalvesTargetStats(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      
    <Spacer size="large">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>

        {(!targetStatsLastInsertedRowRowHasData)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={() => handleTargetStatsSubmit()}>
          <CalendarFullSizePressableButtonText >{t("Add_Entry")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
          ):(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={() => handleTargetStatsSubmit()}>
          <CalendarFullSizePressableButtonText >{t("Update_Entry")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
          )
          }
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
                      <Text style={styles.successText}>{t('Your_TargetStats_added_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
      </FormElemeentSizeButtonParentView>
    </Spacer>
    {/* <Spacer size="medium">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={()=>navigation.goBack()}>
          <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView>
    </Spacer> */}
    </ScrollView>
    
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  FormLabelDateRowViewContainer: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 3,
    flex:0,
  },
  text: {
    // Add any specific styles for the text here if needed
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