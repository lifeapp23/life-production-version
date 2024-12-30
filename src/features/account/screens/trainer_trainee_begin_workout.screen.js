import React, { useState,useContext,useEffect } from 'react';
import { StyleSheet,
  Text,
  ScrollView,
View, Modal,Alert} from "react-native";
import { TrainerTraineeWorkedExercisesCalendarScreen } from "./trainer_trainee_worked_exercises_calendar.screen";

import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  ViewOverlay,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,


} from "../components/account.styles";

import { Spacer } from "../../../components/spacer/spacer.component";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,deletePublicWorkoutsPlanDaysTable } from "../../../../database/public_workouts_plan_days";
import { fetchPublicSettings} from "../../../../database/workout_settings";

import { useSelector } from 'react-redux';
import { getPlansForCurrentDate } from "../../../../database/public_workouts_plans";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { checkTodayWorkouts } from "../../../../database/start_workout_db";
import { addEventListener } from "@react-native-community/netinfo";
import axios from 'axios';
import "./i18n";
import { useTranslation } from 'react-i18next';


export const TrainerTraineeBeginWorkoutScreen = ({navigation,route }) => {
  const publicWorkoutsPlanstableCon = route.params?.publicWorkoutsPlanstable;

    const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
    const [modalVisible, setModalVisible] = useState(false);
    const [triainerConnected,setTriainerConnected] =  useState(false);
    const { t, i18n } = useTranslation();

    const [publicPlansDataTable, setPublicPlansDataTable] = useState(publicPlansDataArr);
    const [userId,setUserId] = useState('');
  // Create an object to store the summation, dayNam, and length for each speKey
  const [resultMap,setResultMap] = useState({});
  const context = useContext(AuthGlobal);
  const [userToken,setUserToken] = useState('');
  
  
  
  const [publicWorkoutsPlanDaysTable,setPublicWorkoutsPlanDaysTable] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
    AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        setUserToken(res);
      AsyncStorage.getItem("currentUser").then((user) => {
      const storedUser = JSON.parse(user);
      //console.log('publicWorkoutsPlanDays user---->>>',storedUser);
      setUserId(storedUser.id);
      const fetchData = async () => { 
      const unsubscribe = addEventListener(state => {
        //console.log("Connection type--", state.type);
        //console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        //console.log('---------------now online--------')
        //console.log('my begin workout Days page',publicWorkoutsPlanstableCon);


        axios.get(`https://www.elementdevelops.com/api/get-trainer-trainee--current-plan-days?traineeId=${publicWorkoutsPlanstableCon?.[0]?.trneId}&trainerId=${publicWorkoutsPlanstableCon?.[0]?.trnrId}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
        .then(response => {
          // Handle successful response
          //console.log('Plan Days::',response.data);
          setPublicWorkoutsPlanDaysTable(response?.data?.["getTraineeCurrentPlanDays"]);
          const daysData = response?.data?.["getTraineeCurrentPlanDays"];
          const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
          //console.log('userPublicSettings:', userPublicSettings);

          
          let newResultMap = {};
          //let { speKey, dayNam,wrkAry } = publicWorkoutsPlanDaysTable?.[0];
          

 
          daysData?.forEach((dayData) => {

            const wrkAry =  dayData?.wrkAry;
            let newafterJsonWrk = [];         
            if (wrkAry && typeof wrkAry !== 'undefined' ) {
              newafterJsonWrk = JSON.parse(wrkAry);
             //console.log('newafterJsonWrk:', newafterJsonWrk);
   
               }
          // Iterate through the array and calculate the summation, dayNam, and length
          newafterJsonWrk?.forEach((item) => {

            let { wrkSts, exrTyp } = item;
            //console.log('wrkSts, exrTyp--',wrkSts, exrTyp);
             // Initialize the object if not exists
             if (!newResultMap?.[dayData?.speKey]) {
               newResultMap[dayData?.speKey] = {
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
             newResultMap[dayData?.speKey].summation += parseInt(wrkSts);
             newResultMap[dayData?.speKey].dayNam = dayData?.dayNam; // Assign directly to the value of dayNam
             newResultMap[dayData?.speKey].length++;
             if (exrTyp === 'Cardio' || exrTyp === 'Stability'){
               newResultMap[dayData?.speKey].expectedTime += ((30 * wrkSts)/60) + (userPublicSettings?.cardio/60);
             }else if (exrTyp ==='Isolation'){
               newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (userPublicSettings?.isoltn/60);
             }else if(exrTyp ==='Compound'){
               newResultMap[dayData?.speKey].expectedTime +=((30 * wrkSts)/60) + (userPublicSettings?.compnd/60);
             }
           });
          });
             // Set the state with the new resultMap
             setResultMap(newResultMap);
        
        })
        .catch(error => {
          // Handle error
          //console.log('Error fetching Days:', error);
        });

      }else{
        //console.log('else no internet ahmed');
        Alert.alert(`${t("To_see_begin_workout_s_data")}`,
            `${t("You_must_be_connected_to_the_internet")}`);
              

      }

      });
      
      // Unsubscribe
      unsubscribe();
    };
    fetchData();
      
      });
    });
    }, [AsyncStorage])
    );  
    
    
//console.log('publicWorkoutsPlanDaysTable',publicWorkoutsPlanDaysTable);
let allWorkouts = [];
// Iterate over each object in the dataArray
publicWorkoutsPlanDaysTable?.forEach(item => {
  // Parse the wrkAry string to convert it into an array
  const wrkAryArray = JSON.parse(item.wrkAry);
  // Add the desired keys and values to each object in the wrkAryArray
  const updatedWrkAryArray = wrkAryArray.map(workout => {
    return {
      ...workout,
      created_at: item.created_at,
      dayNam: item.dayNam,
      id: item.id,
      planId: item.planId,
      speKey: item.speKey,
      trneId: item.trneId,
      trnrId: item.trnrId,
      updated_at: item.updated_at
    };
  });
  // Concatenate the updatedWrkAryArray to the allWorkouts array
  allWorkouts = allWorkouts.concat(updatedWrkAryArray);
});
const handleCheckTodayWorkouts = (trnrId,trneId, speKey,publicWorkoutsPlanDayArr,publicWorkoutsPlanstableCon) => {
    
  if(triainerConnected){
    axios.get(`https://www.elementdevelops.com/api/check-today-workouts?traineeId=${trneId}&trainerId=${trnrId}&speKey=${speKey}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        })
    .then((response) => {
        //console.log('response?.data?.addingAllowed', response?.data?.addingAllowed);
        // setPlansDataTable(response?.data?.getTraineePlanDays);

        if(response?.data?.addingAllowed == true){
          //console.log('yesss');
          navigation.navigate('TrainerTraineeDaysExercisesToStart',{publicWorkoutsPlanDayArrSent:publicWorkoutsPlanDayArr,publicWorkoutsPlanstableCon:publicWorkoutsPlanstableCon});

        }


        // Alert.alert('Your Plan Deleted from Database successfully');

      })
      .catch(error => {
        // Handle error 
        Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
      });

 
   }else{
    Alert.alert(`${t('To_Delete_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
};
//console.log('allWorkouts---',allWorkouts);
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t("Begin_Workout")}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <View style={styles.container}> 
            {(publicWorkoutsPlanDaysTable?.length > 0) ? (
                <View style={styles.FromToView}>
                  <Text style={styles.totalSets}>{t("Sets")}</Text>
                  <Text style={styles.totalExercises}>{t("Exercises")}</Text>
                  <Text style={styles.ExpectedTime}>{t("Expected_Time")}</Text>
                </View>
              ):null}
             
              {Object.keys(resultMap).map((speKey) => {
                  const view = resultMap?.[speKey];
                  ////console.log('view--',view);
                  const publicWorkoutsPlanDayArr =allWorkouts.filter(item => item.speKey === speKey);
                  //console.log('publicWorkoutsPlanDayArr',publicWorkoutsPlanDayArr);
                  ////console.log(checkTodayWorkouts(publicWorkoutsPlanDayArr[0]?.userId,publicWorkoutsPlanDayArr[0]?.speKey));
                  return (
                    <View key={speKey} style={styles.viewContainer}>
                      <View style={styles.leftContainer}>
                        <CalendarFullSizePressableButton style={{ backgroundColor: '#000', padding: 5, width: 90, height: 'auto', minHeight: 49 }}  onPress={() => {
                          //checkTodayWorkouts(publicWorkoutsPlanDayArr[0]?.userId,publicWorkoutsPlanDayArr[0]?.speKey,navigation,publicWorkoutsPlanDayArr);
                          handleCheckTodayWorkouts(publicWorkoutsPlanDayArr[0]?.trnrId,publicWorkoutsPlanDayArr[0]?.trneId,speKey,publicWorkoutsPlanDayArr,publicWorkoutsPlanstableCon)
                          }}>
                          <CalendarFullSizePressableButtonText style={{ justifyContent: 'center', textAlign: 'center' }}>{view.dayNam}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </View>
                      <View style={styles.rightContainer}>
                        <Text style={styles.rightContainerText}>{parseFloat(view?.summation).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view?.length).toFixed(0)}</Text>
                        <Text style={styles.rightContainerText}>{parseFloat(view?.expectedTime).toFixed(1)}</Text>
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
              <TrainerTraineeWorkedExercisesCalendarScreen 
                            onAddEntry={() => setModalVisible(false)}
                            publicWorkoutsPlanRowCon={publicWorkoutsPlanstableCon?.[0]}
                          />
              </ViewOverlay>
            </Modal>
            </FormElemeentSizeButtonView>
            </FormElemeentSizeButtonParentView>

            </Spacer>
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


