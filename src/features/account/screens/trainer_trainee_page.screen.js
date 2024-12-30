import React, { useState,useEffect} from 'react';
import {ScrollView,View,Dimensions} from "react-native";
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
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';


export const TraineePageScreen = ({navigation,route}) => {
    const TrainerTraineeCameData = route.params?.TrainerTraineeSent;
    const [firstMeasurement, setFirstMeasurement] = useState({});  
    const [lastMeasurement, setLastMeasurement] = useState({});
    const { t, i18n } = useTranslation();
    const { width } = Dimensions.get('window');

    // const currentInactiveTraineeParam = route.params?.TrainerInactiveTrainee;
    // const traineeNewRowConst = currentActiveTraineeParam || currentInactiveTraineeParam || ''; // Use an empty string as a fallback
    //console.log('TrainerTraineeCameData',TrainerTraineeCameData);
    const traineesData = [
        {
          id: 1,
          name: 'Mohamed Al-DurrahT',
          measurements: [
            { date: '2023-11-01', weight: '79kg' },
            { date: '2023-11-27', weight: '76.5kg' },
            { date: '2023-11-28', weight: '75kg' },
          ],
        },
        {
          id: 2,
          name: 'Sarah KenndyT',
          measurements: [
            { date: '2023-01-30', weight: '64.5kg' },
            { date: '2023-11-27', weight: '58.5kg' },
            { date: '2023-11-28', weight: '54kg' },
          ],
        },
        {
            id: 3,
            name: 'Mario ElvesT',
            measurements: [
              { date: '2023-01-30', weight: '64.5kg' },
              { date: '2023-11-27', weight: '78.5kg' },
              { date: '2023-11-28', weight: '78kg' },
            ],
          },
          {
            id: 4,
            name: 'Moataz FahmyT',
            measurements: [
              { date: '2023-01-30', weight: '64.5kg' },
              { date: '2023-11-27', weight: '60kg' },
              { date: '2023-11-28', weight: '59kg' },
            ],
          },
          {
            id: 5,
            name: 'Peter BeckerT',
            measurements: [
              { date: '2023-01-30', weight: '64.5kg' },
              { date: '2023-11-27', weight: '60.5kg' },
              { date: '2023-11-28', weight: '58kg' },
            ],
          },
        // ... Add more trainees as needed
      ];
      useFocusEffect(
        React.useCallback(() => {
        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
          //console.log('tokeeen:',res);
        AsyncStorage.getItem("currentUser").then((user) => {
      
            const storedUser = JSON.parse(user);
            //setUserId(storedUser.id);
      
            
            const unsubscribe = addEventListener(state => {
              //console.log("Connection type--", state.type);
              //console.log("Is connected?---", state.isConnected);
              //setTriainerConnected(state.isConnected);
            if(state.isConnected){
              //console.log('---------------now online--------')
              //console.log('TrainerTraineeCameData.trneId::',TrainerTraineeCameData.trneId);

              const newData = {'userId':TrainerTraineeCameData.trneId};
              //console.log('TrainerTraineeCameData.newData::',newData);
              axios.get(`https://www.elementdevelops.com/api/trainee-plans-measurements?userId=${TrainerTraineeCameData.trneId}`, {
                headers: {
                  'Authorization': `Bearer ${res}`,
                  'Content-Type': 'application/json',
                },
                })
                .then(response => {
                  // Handle successful response
                  //console.log('measurements::',response.data);
                  
                  //console.log('first_measurement:',response.data["first_measurement"]);
                  //console.log('last_measurement::',response.data["last_measurement"]);
                  setFirstMeasurement(response.data["first_measurement"]);
                  setLastMeasurement(response.data["last_measurement"]);
                  //setOurPersonalTrainers(response.data["trainers"]);
                })
                .catch(error => {
                  // Handle error
                  //console.log('Error fetching Trainers:', error);
                });
            }else{
              //console.log('else no internet ahmed');
              Alert.alert(`${t(' ')}`,
              `${t('Please_Connect_to_the_internet_To_see_the Trainee_info')}`,
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
      //const currentTraineeRow = traineesData.find((traineeData) => traineeData.name === traineeNewRowConst);

  return (
    <PageContainer>
      <ScrollView >
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover >
                <ServicesPagesCardAvatarIcon icon="tape-measure">
                </ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader style={{textAlign:'center',}}>{`${TrainerTraineeCameData.trainee.fName } ${TrainerTraineeCameData.trainee.lName }` || ''}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                {/* <InputField >
                    <FormLabelView>
                        <FormLabel>{t('Workout_Plans')}:</FormLabel>
                    </FormLabelView>
                    <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerManageWorkouts', { TrainerTraineeSent: TrainerTraineeCameData})}
>
                        <CalendarFullSizePressableButtonText >{t('Workout_Plans')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </View>
                </InputField> */}
                <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerManageWorkouts', { TrainerTraineeSent: TrainerTraineeCameData})}
>
                    <CalendarFullSizePressableButtonText >{t('Workout_Plans')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </View>
            </Spacer>
            
            <Spacer size="medium">
                {/* <InputField >
                    <FormLabelView>
                        <FormLabel>{t('Meal_Plans')}:</FormLabel>
                    </FormLabelView>
                    <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerManageMeals', { TrainerTraineeSent: TrainerTraineeCameData})}>
                        <CalendarFullSizePressableButtonText >{t('Meal_Plans')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </View>
                </InputField> */}
                <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerManageMeals', { TrainerTraineeSent: TrainerTraineeCameData})}>
                        <CalendarFullSizePressableButtonText >{t('Meal_Plans')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </View>
            </Spacer>
            <Spacer size="medium">
                {/* <InputField >
                    <FormLabelView>
                        <FormLabel>{t('Questionnaire')}:</FormLabel>
                    </FormLabelView>
                    <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerQuestionnaireInTraineesPage', { TrainerTraineeSent: TrainerTraineeCameData})}
>
                        <CalendarFullSizePressableButtonText >{t('Questionnaire')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </View>
                </InputField> */}
                <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerQuestionnaireInTraineesPage', { TrainerTraineeSent: TrainerTraineeCameData})}
>
                    <CalendarFullSizePressableButtonText >{t('Questionnaire')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </View>
            </Spacer>
            <Spacer size="medium">
                <InputField >
                <FormLabelView>
                    <FormLabel>{t('Start_Weight')}:</FormLabel>
                </FormLabelView> 
                    <FormLabelDateRowView><FormLabelDateRowViewText>{firstMeasurement?.weight ? firstMeasurement?.weight : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                </InputField>
            </Spacer>
            <Spacer size="medium">
                <InputField >
                <FormLabelView>
                    <FormLabel>{t('Date')}:</FormLabel>
                </FormLabelView>
                    <FormLabelDateRowView><FormLabelDateRowViewText>{firstMeasurement?.date ? firstMeasurement?.date : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                </InputField>
            </Spacer>
            <Spacer size="small">
                <InputField >
                <FormLabelView>
                    <FormLabel>{t('Current_Weight')}:</FormLabel>
                </FormLabelView>
                    <FormLabelDateRowView><FormLabelDateRowViewText>{lastMeasurement?.weight ? lastMeasurement?.weight : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                </InputField>
            </Spacer>
            <Spacer size="small">
                <InputField >
                <FormLabelView>
                    <FormLabel>{t('Last_Weighted')}:</FormLabel>
                </FormLabelView>
                    <FormLabelDateRowView><FormLabelDateRowViewText>{lastMeasurement?.date ? lastMeasurement?.date : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
                </InputField>
            </Spacer>
            {/* <Spacer size="medium">
                <InputField >
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
                        <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                </InputField>
            </Spacer> */}
           
        <Spacer size="large"></Spacer>
      </ScrollView>
    </PageContainer>
  );
};