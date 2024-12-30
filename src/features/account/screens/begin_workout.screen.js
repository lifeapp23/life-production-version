import React, { useState,useContext,useEffect } from 'react';
import { StyleSheet,
  Text,
  ScrollView,
View, Modal} from "react-native";
import { WorkedExercisesCalendarScreen } from "./worked_exercises_calendar.screen";
import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  ViewOverlay,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,


} from "../components/account.styles";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
 
import { Spacer } from "../../../components/spacer/spacer.component";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable } from "../../../../database/public_workouts_plan_days";
import { fetchPublicSettings} from "../../../../database/workout_settings";

import { useSelector } from 'react-redux';
import { getPlansForCurrentDate } from "../../../../database/public_workouts_plans";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { checkTodayWorkouts } from "../../../../database/start_workout_db";


export const BeginWorkoutScreen = ({navigation,route }) => {

    const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
    const [modalVisible, setModalVisible] = useState(false);

    const [publicPlansDataTable, setPublicPlansDataTable] = useState(publicPlansDataArr);
    const [userId,setUserId] = useState('');
  // Create an object to store the summation, dayNam, and length for each speKey
  const [resultMap,setResultMap] = useState({});
  const context = useContext(AuthGlobal);
  const {t} = useTranslation();//add this line

  
  const [publicWorkoutsPlanDaysTable,setPublicWorkoutsPlanDaysTable] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      //console.log('publicWorkoutsPlanDays user---->>>',storedUser);
      setUserId(storedUser.id);
      getPlansForCurrentDate(storedUser.id)
      .then((result) => {
        //console.log('publicWorkoutsPlanDays result---->>>',result);

        ////console.log('Plan Days for the current date:', result);
        fetchPublicWorkoutsPlanDaysWithoutDeleting(storedUser.id,result[0]?.speKey).then((publicWorkoutsPlanDaysTableResults) => {
          ////console.log('publicWorkoutsPlanDay Table array',publicWorkoutsPlanDaysTableResults);
          setPublicWorkoutsPlanDaysTable(publicWorkoutsPlanDaysTableResults);
        });
      })
      .catch((error) => {
        //console.error('Error retrieving plans:', error);
      });
      // deletePublicWorkoutsPlanDaysTable().then((deletePublicWorkoutsPlanDaysTableResults) => {
      //   //console.log('deletePublicWorkoutsPlanDaysTableResults',deletePublicWorkoutsPlanDaysTableResults);

      // });
      
      });
    }, [AsyncStorage])
    );
    useEffect(() => {
      if(Object.keys(context.stateUser.userPublicSettings).length > 0){
        // //console.log('context.stateUser.userPublicSettings',context.stateUser.userPublicSettings);
        // //console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);

        
          // Iterate through the array and calculate the summation, dayNam, and length
         // Create an object to store the summation, dayNam, and length for each speKey
          const newResultMap = {};
  
          // Iterate through the array and calculate the summation, dayNam, and length
          publicWorkoutsPlanDaysTable.forEach((item) => {
            const { speKey, wrkSts, dayNam,exrTyp } = item;
  
            // Initialize the object if not exists
            if (!newResultMap[speKey]) {
              newResultMap[speKey] = {
                summation: 0,
                dayNam: '', // Initialize as an empty string
                length: 0,
                expectedTime:0,
              };
            }
            // 'Compound',
            // 'Cardio',
            // 'Isolation',
            // 'Stability',
            // Update the values
            newResultMap[speKey].summation += parseInt(wrkSts);
            newResultMap[speKey].dayNam = dayNam; // Assign directly to the value of dayNam
            newResultMap[speKey].length++;
            if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
              newResultMap[speKey].expectedTime += ((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.cardio/60);
            }else if (exrTyp ==='Isolation'){
              newResultMap[speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.isoltn/60);
            }else if(exrTyp ==='Compound'){
              newResultMap[speKey].expectedTime +=((30 * wrkSts)/60) + (context.stateUser.userPublicSettings.compnd/60);
            }
          });
  
            // Set the state with the new resultMap
            setResultMap(newResultMap);
      
      }else{
        fetchPublicSettings(userId).then((PSettingsResults) => {
          // //console.log('PSettingsResults',PSettingsResults);
          // //console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);

            // Iterate through the array and calculate the summation, dayNam, and length
           // Create an object to store the summation, dayNam, and length for each speKey
            const newResultMap = {};
    
            // Iterate through the array and calculate the summation, dayNam, and length
            publicWorkoutsPlanDaysTable.forEach((item) => {
              const { speKey, wrkSts, dayNam,exrTyp } = item;
    
              // Initialize the object if not exists
              if (!newResultMap[speKey]) {
                newResultMap[speKey] = {
                  summation: 0,
                  dayNam: '', // Initialize as an empty string
                  length: 0,
                  expectedTime:0,
                };
              }
    
              // Update the values
              newResultMap[speKey].summation += parseInt(wrkSts);
              newResultMap[speKey].dayNam = dayNam; // Assign directly to the value of dayNam
              newResultMap[speKey].length++;
              if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
                newResultMap[speKey].expectedTime += parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].cardio/60)).toFixed(2));

              }else if (exrTyp ==='Isolation'){
                newResultMap[speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].isoltn/60)).toFixed(2));

              }else if(exrTyp ==='Compound'){
                newResultMap[speKey].expectedTime +=parseFloat((((30 * wrkSts)/60) + (PSettingsResults[0].compnd/60)).toFixed(2));

              }
            });
    
              // Set the state with the new resultMap
              setResultMap(newResultMap);

        });
        
      }
    }, [publicWorkoutsPlanDaysTable]);     
    
    
      
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
              <PageMainImage
              source={require('../../../../assets/Begin_Workout.jpeg')} 
                // style={{width:"100%",height:"100%",borderRadius:30}}
              />            
            </ServicesPagesCardCover>
            <View style={styles.container}> 
            {(publicWorkoutsPlanDaysTable.length > 0) ? (
                <View style={styles.FromToView}>
                  <Text style={styles.totalSets}>{t("Sets")}</Text>
                  <Text style={styles.totalExercises}>{t("Exercises")}</Text>
                  <Text style={styles.ExpectedTime}>{t("Expected_Time")}</Text>
                </View>
              ):null}
             
              {Object.keys(resultMap).map((speKey) => {
                  const view = resultMap[speKey];
                  ////console.log('view--',view);
                  const publicWorkoutsPlanDayArr =publicWorkoutsPlanDaysTable.filter(item => item.speKey === speKey);
                  //console.log('publicWorkoutsPlanDayArr',publicWorkoutsPlanDayArr);
                  ////console.log(checkTodayWorkouts(publicWorkoutsPlanDayArr[0]?.userId,publicWorkoutsPlanDayArr[0]?.speKey));
                  return (
                    <View key={speKey} style={styles.viewContainer}>
                      <View style={styles.leftContainer}>
                        <CalendarFullSizePressableButton style={{ backgroundColor: '#000', padding: 5, width: 90, height: 'auto', minHeight: 49 }}  onPress={() => {
                          checkTodayWorkouts(publicWorkoutsPlanDayArr[0]?.userId,publicWorkoutsPlanDayArr[0]?.speKey,navigation,publicWorkoutsPlanDayArr);
                          
                          }}>
                          <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{view.dayNam}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                      <View style={styles.rightContainer}>
                        <Text style={styles.rightContainerText}>{parseFloat(view.summation).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view.length).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view.expectedTime).toFixed(1)}</Text>
                        {/* Add more properties as needed */}
                      </View>
                    </View>
                  );
                })}
            <Spacer size="medium">
            <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>

            <FormElemeentSizeButtonView style={{width:"100%"}}> 
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
      onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Open_Calendar")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <WorkedExercisesCalendarScreen 
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormElemeentSizeButtonView>
            </FormElemeentSizeButtonParentView>

            </Spacer>

            {(publicWorkoutsPlanDaysTable.length > 0) ? (
              null
            ):(
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}

                    onPress={() => navigation.navigate('AddEntryPlans')}>

                    <CalendarFullSizePressableButtonText >{t('Add_New_plans')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
            )}
            <Spacer size="medium">
              <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
                  <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </FormElemeentSizeButtonParentView>
            </Spacer>
            </View>
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
    marginVertical: 10,
    marginLeft:10,
    marginRight:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:50,
  },
  rightContainerText:{
    fontSize:14,
    color:"white",
    marginVertical: 15,
  },
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    
  },
  
  totalExercises:{
    fontSize:16,
    color:"white",
    marginRight:10,
    marginLeft:5,
  },
  totalSets:{
    fontSize:16,
    color:"white",
    marginRight:20,
    marginLeft:90
  },
  ExpectedTime:{
    fontSize:16,
    color:"white",
    marginRight:0
  },
  removeButtonContainer: {
    marginLeft: 10,
  },
  removeButtonContainerButton:
  {
    backgroundColor:'#000',
    paddingRight:8,
    paddingLeft:8,
    borderRadius:6,
  },
});


