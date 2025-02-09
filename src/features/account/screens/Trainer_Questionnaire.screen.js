import React, { useState, useRef,useEffect} from 'react';

  import {Switch,ScrollView,Alert, Modal, StyleSheet, Pressable, View,TextInput,Text, Dimensions,Image} from 'react-native';
  import { SelectItem } from '@ui-kitten/components';
  import { useActionSheet } from "@expo/react-native-action-sheet";
  import * as ImagePicker from 'expo-image-picker';
  import * as FileSystem from 'expo-file-system';
  import { PlansCalendarScreen } from "./TrainerManageMyProfileCalendar";
  import {useNetInfo} from "@react-native-community/netinfo";
  import { addEventListener } from "@react-native-community/netinfo";
  import { insertTrainerManageMyProfile,fetchTrainerManageMyProfile} from "../../../../database/trainer_manage_my_profile";
  import "./i18n";
  import { useTranslation } from 'react-i18next';
  import { StackActions } from '@react-navigation/native';
  import Feather from 'react-native-vector-icons/Feather';
  
  import { Spinner } from '@ui-kitten/components';
  
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useFocusEffect } from '@react-navigation/native';
  
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
  SelectInfo,
  WriteInfo,
  InfoSelector,
  WriteInfoChild,
  InfoInput,
  SelectorTextField,
  InfoInputView,
  PageMainImage,
  AccountBackground,
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
import { Spacer } from "../../../components/spacer/spacer.component";
import {AntDesign} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

  
export const TrainerQuestionnaireScreen = ({navigation}) => {
  const { t, i18n } = useTranslation();

  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [userId, setUserId] = useState("");  
  const [newQuestionnaireTextValue,setNewQuestionnaireTextValue] =  useState([]);

  
    const [QuestionnaireBeforeEditing,setQuestionnaireBeforeEditing] =  useState("");



    // this will be attached with each input onChangeText
    const [QuestionnaireTextValue, setQuestionnaireTextValue] = useState(''); 
    // our number of inputs, we can add the length or decrease
    const [QuestionnaireNumInputs, setQuestionnaireNumInputs] = useState(1);

    // all our input fields are tracked with this array
    const QuestionnaireRefInputs = useRef([QuestionnaireTextValue]);

const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      ////console.log('tokeeen:',res);
    AsyncStorage.getItem("currentUser").then((user) => {
        ////console.log('tokeeen:',res);

        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
  
        
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
           
          if(state.isConnected){

                  axios.get(`https://life-pf.com/api/get-profile?userId=${storedUser.id}`, {
                    headers: {
                      'Authorization': `Bearer ${res}`,
                      'Content-Type': 'application/json',
                    },
                    })
                    .then(response => {
                      const { TrnQes} = response.data['$profile'];
                      //console.log('response.data profile',response.data['$profile']);

                      //console.log('TrnQes',TrnQes);

                      const TrnQesNew = TrnQes != null ? TrnQes : '';
                      const TrnQesArray = JSON.parse(TrnQesNew);
                      //console.log('TrnQesArray',TrnQesArray);

                      const TrnQesArrayLength = TrnQesArray.length;
                      //console.log('TrnQesArrayLength',TrnQesArrayLength);

                      setQuestionnaireNumInputs(TrnQesArrayLength)
                    
                      // Iterate over each object in the array
                      let updatedQuestionnaireTextValue = [...newQuestionnaireTextValue]; // Clone state outside loop
                      
                      TrnQesArray.forEach((obj, index) => {
                        updatedQuestionnaireTextValue[index] = obj;

                      });
                      //console.log('updatedQuestionnaireTextValue',updatedQuestionnaireTextValue);
                      setNewQuestionnaireTextValue(updatedQuestionnaireTextValue);

                    })
                    .catch(error => {
                      // Handle error
                      //////console.log('Error fetching profile:', error);
                      // setLoadingPageInfo(false);

                    });

            }else{
              Alert.alert(``,
              `${t('You_must_be_connected_to_the_internet')}`);

          }

        });
        
        // Unsubscribe
        unsubscribe();
      })
    });
   
  
  }, [])
  );
/////////////// Start Questionnaire functionalty///////////


const setQuestionnaireInputValue = (index,value)=>{
  // first we are storing input value to refInputs arrary to track them
  // const QuestionnaireInputs = QuestionnaireRefInputs.current;
  // QuestionnaireInputs[index]=value;
  // // we are also setting the text value to the inputs field onChangeText
  // setQuestionnaireTextValue(value);

  const newQuestionnaireInputs = [...newQuestionnaireTextValue];
  newQuestionnaireInputs[index] = value;

setNewQuestionnaireTextValue(newQuestionnaireInputs);
}

const addQuestionnaireInput =() =>{

  // increase the num   // // add a new element in out QuestionnaireRefSelects array
  // QuestionnaireRefSelects.current.push('');
  // // add a new element in out QuestionnaireRefInputs array
  // QuestionnaireRefInputs.current.push('');ber of inputs
  setQuestionnaireNumInputs(value => value +1);
}
const removeQuestionnaireInput = (i)=>{
  //remove from the array by index value
  //remove from the array by index value
  QuestionnaireRefInputs.current.splice(i,1)[0];

  // Create new arrays without the element to remove
  const newInputs = newQuestionnaireTextValue.filter((_, index) => index !== i);



  setNewQuestionnaireTextValue(newInputs);
  //decrease the number of inputs
  setQuestionnaireNumInputs(value => value -1);
}
const renderQuestionnaireOption = (title,i) => (
  <SelectItem key={i} title={title}  />
);
const QuestionnaireInfo =[];

const QuestionnaireInputsItems= [];
for (let i = 0; i < QuestionnaireNumInputs; i ++)
{
  QuestionnaireInputsItems.push(
    <View key={i} >
        <InfoField>
          
          <WriteInfo>
            <WriteInfoChild style={{flexDirection: 'row'}}>
            <InfoInputView style={{width:width-40,}}>        

            <TextInput
                  placeholder={t("Question")}
                  editable
                  multiline
                  numberOfLines={7}
                  maxLength={300}
                  style={styles.QuestionTextArea}

                  theme={{colors: {primary: '#3f7eb3'}}}
                  value={newQuestionnaireTextValue[i] ? newQuestionnaireTextValue[i] : ""}
                  textContentType="name"
                  autoCapitalize="none"
                  keyboardType="default"
                  onChangeText={value => setQuestionnaireInputValue(i,value)}
                />
            </InfoInputView> 
            <Pressable onPress={() => removeQuestionnaireInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
              <AntDesign name="minuscircleo" size={20} color="white" />
            </Pressable>
            </WriteInfoChild>
          </WriteInfo>
        </InfoField>
   
      
      
    </View>
  );
  // Update the QuestionnaireInfo state when the QuestionnaireInputs change
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]]);
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]] == "Other");

  if (newQuestionnaireTextValue[i] !== '' && newQuestionnaireTextValue[i] !== undefined && newQuestionnaireTextValue[i] !== 'undefined'){

    QuestionnaireInfo.push(newQuestionnaireTextValue?.[i]);

}

}
useEffect (() => {
  //console.log('QuestionnaireInfo',QuestionnaireInfo);
  //console.log('QuestionnaireInfo.length',QuestionnaireInfo.length);
  
}, [QuestionnaireInfo]);


const sendQuestionnaireData =  (QuestionnaireInfo) => {
  
  //console.log('QuestionnaireInfo sendQuestionnaireData',QuestionnaireInfo);
  //console.log('QuestionnaireInfo.length sendQuestionnaireData',QuestionnaireInfo.length);

  if(QuestionnaireInfo == undefined){
    Alert.alert(`${t('Please_Fill_at_least_one_field')}`);
    return;
  }
  if(QuestionnaireInfo.length == 0){
    Alert.alert(`${t('Please_Fill_at_least_one_field')}`);
    return;
  }
  const newData = {
    userId:userId,
    TrnQes:JSON.stringify(QuestionnaireInfo),
  };

  //console.log('newData: ',newData);
  

 if(triainerConnected){
  axios.post(`https://life-pf.com/api/TrainerManageMyProfile-trainer-Questionnaire-inserting-data`, newData)
  .then((response) => {
      ////console.log('response?.data?.value', response?.data?.value);
      Alert.alert(``,`${t('Questionnaire_data_updated_successfully')}`);

    }).catch(error => {
        // Handle error
        
        Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
      });


 }else{
  Alert.alert(`${t('To_Add_your_data')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
};
  return (
  
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>
                <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{t("Questionnaire")}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>
            </AccountBackground>
            <Spacer size="large">
                <ServiceInfoParentView >
                  {showInfo ? (
                    <ServiceCloseInfoButtonView>
                      <ServiceCloseInfoButton onPress={toggleInfo}>
                        <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                      </ServiceCloseInfoButton>
                      <ServiceCloseInfoButtonTextView>
                        <ServiceCloseInfoButtonText>{t("trainer_questionniare_page_desc")}</ServiceCloseInfoButtonText>
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
            <Spacer size="large">
              <InfoFieldParent>
                  <ScrollView>
                  {/* <SelectorTextField>
                      <FormLabel>{t("Certifications")}:</FormLabel>
                  </SelectorTextField> */}
                  <Pressable onPress={addQuestionnaireInput} style={{backgroundColor:'#000',borderRadius:30,width:40,height:40,}}>
                    <AntDesign name="pluscircleo" size={40} color="white" />
                </Pressable>
                  {QuestionnaireInputsItems}
                  </ScrollView>
              </InfoFieldParent>
            </Spacer>
            <Spacer size="large">
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}}
            onPress={()=>{sendQuestionnaireData(QuestionnaireInfo);}}
           >
                    <CalendarFullSizePressableButtonText >{t("Save")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
            </Spacer>
            <Spacer size="large"></Spacer>
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
  CoimngSoonViewContainer: {
      width: width - 20, // he screen width minus padding
      height: 200, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    imageCoimngSoon: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
    QuestionTextArea:{
        backgroundColor:"white",
        borderWidth:1,
        borderColor:'black',
        borderRadius:6,
        padding:10,
        textAlignVertical: 'top',
        height:150,
    },
  
});

