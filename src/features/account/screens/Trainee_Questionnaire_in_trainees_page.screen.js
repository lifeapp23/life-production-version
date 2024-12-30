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

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import {AntDesign} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const TrainerQuestionnaireInTraineesPageScreen = ({navigation,route}) => {
  const TrainerTraineeCameData = route.params?.TrainerTraineeSent;

  const { t, i18n } = useTranslation();

  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [userId, setUserId] = useState("");  
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);

  
   //console.log('TrainerTraineeCameData?.trneId TrainerQuestionnaireInTrainees:',TrainerTraineeCameData?.trneId);
   //console.log('TrainerTraineeCameData?.trnrId TrainerQuestionnaireInTrainees:',TrainerTraineeCameData?.trnrId);

    ////Traineer ////

    const [newTrainerQuestionnaireTextValue, setNewTrainerQuestionnaireTextValue] = useState([]); 

    // this will be attached with each input onChangeText
    const [TrainerQuestionnaireTextValue, setTrainerQuestionnaireTextValue] = useState(''); 
    // our number of inputs, we can add the length or decrease
    const [QuestionnaireNumInputs, setQuestionnaireNumInputs] = useState(0)

    // // all our input fields are tracked with this array
    // const QuestionnaireRefInputs = useRef([QuestionnaireTextValue]);

    ////Traineee ////
    const [newTraineeQuestionnaireTextValue, setNewTraineeQuestionnaireTextValue] = useState([]); 

    // this will be attached with each input onChangeText
    const [TraineeQuestionnaireTextValue, setTraineeQuestionnaireTextValue] = useState(''); 

    // // all our input fields are tracked with this array
    // const QuestionnaireRefInputs = useRef([QuestionnaireTextValue]);

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
            setLoadingPageInfo(true);

                  axios.get(`https://www.elementdevelops.com/api/get-Last-Questionnaire-For-Trainee?trneId=${TrainerTraineeCameData?.trneId}&trnrId=${TrainerTraineeCameData?.trnrId}`, {
                    headers: {
                      'Authorization': `Bearer ${res}`,
                      'Content-Type': 'application/json',
                    },
                    })
                    .then(response => {
                      const traineeQuestionnaireLastEntry = response.data['lastEntry'];
                      //console.log('traineeQuestionnaireLastEntry',traineeQuestionnaireLastEntry);

                      // Parse the JSON SocialMedia string into an array of objects
                      const traineeQuestionnaireLastEntryNew = traineeQuestionnaireLastEntry != null ? traineeQuestionnaireLastEntry : '';
                      //console.log('traineeQuestionnaireLastEntryNew',traineeQuestionnaireLastEntryNew);

                const traineeQuestionnaireLastEntryArray = JSON.parse(traineeQuestionnaireLastEntryNew?.['QesAns']);
                const traineeQuestionnaireLastEntryArrayLength = traineeQuestionnaireLastEntryArray.length;
                //console.log('traineeQuestionnaireLastEntryArray',traineeQuestionnaireLastEntryArray);
                //console.log('traineeQuestionnaireLastEntryArrayLength',traineeQuestionnaireLastEntryArrayLength);

                setQuestionnaireNumInputs(traineeQuestionnaireLastEntryArrayLength);


                // Clone states outside of the loop to avoid triggering re-renders in each iteration
                let updatedTrainerQuestionnaireTextValue = [...newTrainerQuestionnaireTextValue];
                let updatedTraineeQuestionnaireTextValue = [...newTraineeQuestionnaireTextValue];

                // Iterate over each object in the array
                traineeQuestionnaireLastEntryArray.forEach((obj, index) => {
                  for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                      const value = obj[key];

                     
                      // Update values
                      updatedTraineeQuestionnaireTextValue[index] = value;
                      updatedTrainerQuestionnaireTextValue[index] = key;
                    }
                  }
                });
              //console.log('updatedTrainerQuestionnaireTextValue',updatedTrainerQuestionnaireTextValue);
              //console.log('updatedTraineeQuestionnaireTextValue',updatedTraineeQuestionnaireTextValue);

                // Update states once after the loop
                setNewTrainerQuestionnaireTextValue(updatedTrainerQuestionnaireTextValue);
                setNewTraineeQuestionnaireTextValue(updatedTraineeQuestionnaireTextValue);
                setLoadingPageInfo(false);


                      // const TrnQesNew = TrnQes != null ? TrnQes : '';
                      // const TrnQesArray = JSON.parse(TrnQesNew);
                      // //console.log('TrnQesArray',TrnQesArray);

                      // const TrnQesArrayLength = TrnQesArray.length;
                      // //console.log('TrnQesArrayLength',TrnQesArrayLength);

                      // setQuestionnaireNumInputs(TrnQesArrayLength)
                    
                      // // Iterate over each object in the array
                      // let updatedQuestionnaireTextValue = [...newQuestionnaireTextValue]; // Clone state outside loop
                      
                      // TrnQesArray.forEach((obj, index) => {
                      //   updatedQuestionnaireTextValue[index] = obj;

                      // });
                      // //console.log('updatedQuestionnaireTextValue',updatedQuestionnaireTextValue);
                      // setNewQuestionnaireTextValue(updatedQuestionnaireTextValue);

                    })
                    .catch(error => {
                      // Handle error
                      //////console.log('Error fetching profile:', error);
                      // setLoadingPageInfo(false);
                      setLoadingPageInfo(false);

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


// const setQuestionnaireInputValue = (index,value)=>{
//   // first we are storing input value to refInputs arrary to track them
//   // const QuestionnaireInputs = QuestionnaireRefInputs.current;
//   // QuestionnaireInputs[index]=value;
//   // // we are also setting the text value to the inputs field onChangeText
//   // setQuestionnaireTextValue(value);

//   const newQuestionnaireInputs = [...newQuestionnaireTextValue];
//   newQuestionnaireInputs[index] = value;

// setNewQuestionnaireTextValue(newQuestionnaireInputs);
// }

// const addQuestionnaireInput =() =>{

//   // increase the num   // // add a new element in out QuestionnaireRefSelects array
//   // QuestionnaireRefSelects.current.push('');
//   // // add a new element in out QuestionnaireRefInputs array
//   // QuestionnaireRefInputs.current.push('');ber of inputs
//   setQuestionnaireNumInputs(value => value +1);
// }
// const removeQuestionnaireInput = (i)=>{
//   //remove from the array by index value
//   //remove from the array by index value
//   QuestionnaireRefInputs.current.splice(i,1)[0];

//   // Create new arrays without the element to remove
//   const newInputs = newQuestionnaireTextValue.filter((_, index) => index !== i);



//   setNewQuestionnaireTextValue(newInputs);
//   //decrease the number of inputs
//   setQuestionnaireNumInputs(value => value -1);
// }
// const renderQuestionnaireOption = (title,i) => (
//   <SelectItem key={i} title={title}  />
// );
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
            <View style={{width:"100%",marginBottom:5,paddingLeft:5,paddingRight:5,paddingTop:10,paddingBottom:10,borderRadius:10,backgroundColor:"#e1e3e1",}}><FormLabelDateRowViewText style={{fontSize:15,fontWeight:'bold'}}>{t("Q")}{i+1}. {newTrainerQuestionnaireTextValue?.[i] ? newTrainerQuestionnaireTextValue?.[i] : ""}</FormLabelDateRowViewText></View>
            <View style={{width:"100%",marginBottom:5,paddingLeft:5,paddingRight:5,paddingTop:10,paddingBottom:10,borderRadius:10,backgroundColor:"#e1e3e1",}}><FormLabelDateRowViewText style={{fontSize:15,fontWeight:'bold'}}>{t("A")}{i+1}. {newTraineeQuestionnaireTextValue?.[i] ? newTraineeQuestionnaireTextValue?.[i] : ""}</FormLabelDateRowViewText></View>

            
            </InfoInputView> 
            {/* <Pressable onPress={() => removeQuestionnaireInput(i)} style={{backgroundColor:'#000',borderRadius:10}}>
              <AntDesign name="minuscircleo" size={20} color="white" />
            </Pressable> */}
            </WriteInfoChild>
          </WriteInfo>
        </InfoField>
   
      
      
    </View>
  );
  // Update the QuestionnaireInfo state when the QuestionnaireInputs change
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]]);
  ////console.log('QuestionnaireData[newQuestionnaireSelectsValue[i]]',QuestionnaireData[newQuestionnaireSelectsValue[i]] == "Other");

//   if (newQuestionnaireTextValue[i] !== '' && newQuestionnaireTextValue[i] !== undefined && newQuestionnaireTextValue[i] !== 'undefined'){

//     QuestionnaireInfo.push(newQuestionnaireTextValue?.[i]);

// }

}
// useEffect (() => {
//   //console.log('QuestionnaireInfo',QuestionnaireInfo);
//   //console.log('QuestionnaireInfo.length',QuestionnaireInfo.length);
  
// }, [QuestionnaireInfo]);


// const sendQuestionnaireData =  (QuestionnaireInfo) => {
  
//   //console.log('QuestionnaireInfo sendQuestionnaireData',QuestionnaireInfo);
//   //console.log('QuestionnaireInfo.length sendQuestionnaireData',QuestionnaireInfo.length);

//   if(QuestionnaireInfo == undefined){
//     Alert.alert(`${t('Please_Fill_at_least_one_field')}`);
//     return;
//   }
//   if(QuestionnaireInfo.length == 0){
//     Alert.alert(`${t('Please_Fill_at_least_one_field')}`);
//     return;
//   }
//   const newData = {
//     userId:userId,
//     TrnQes:JSON.stringify(QuestionnaireInfo),
//   };

//   //console.log('newData: ',newData);
  

//  if(triainerConnected){
//   axios.post(`https://www.elementdevelops.com/api/TrainerManageMyProfile-trainer-Questionnaire-inserting-data`, newData)
//   .then((response) => {
//       ////console.log('response?.data?.value', response?.data?.value);
//       Alert.alert(``,`${t('Questionnaire_data_updated_successfully')}`);

//     }).catch(error => {
//         // Handle error
        
//         Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
//       });


//  }else{
//   Alert.alert(`${t('To_Add_your_data')}`,
//   `${t('You_must_be_connected_to_the_internet')}`);
//  }
// };
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
            <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}
                  // onRequestClose={() => {
                  //   setIsLoading(!isLoading);
                  // }}
                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
                </Modal>
            <Spacer size="large">
              <InfoFieldParent>
                  <ScrollView>
                  {/* <SelectorTextField>
                      <FormLabel>{t("Certifications")}:</FormLabel>
                  </SelectorTextField> */}
                  {/* <Pressable onPress={addQuestionnaireInput} style={{backgroundColor:'#000',borderRadius:30,width:40,height:40,}}>
                    <AntDesign name="pluscircleo" size={40} color="white" />
                </Pressable> */}
                  {QuestionnaireInputsItems}
                  </ScrollView>
              </InfoFieldParent>
            </Spacer>
            {/* <Spacer size="large">
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width: width - 20,marginLeft:10,marginRight:10}}
            onPress={()=>{sendQuestionnaireData(QuestionnaireInfo);}}
           >
                    <CalendarFullSizePressableButtonText >{t("Save")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
            </Spacer> */}
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
    modalContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        },
    loadingBox: {
      width: 150,
      height: 150,
      backgroundColor: '#333', // dark background for the loading box
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

