import React, { useState,useEffect } from 'react';
import { ScrollView, Modal } from 'react-native';
import { FlatList } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import {
    Title,
    TitleView,
    PageContainer,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    ViewOverlay,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText
  
  } from "../components/account.styles";
  import { WorkedExercisesCalendarScreen } from "./worked_exercises_calendar.screen";
  import { TrainerTraineeWorkedExercisesCalendarScreen } from "./trainer_trainee_worked_exercises_calendar.screen";
  import "./i18n";
  import { useTranslation } from 'react-i18next';
  import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
  import { useFocusEffect } from '@react-navigation/native';
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import axios from 'axios';

export const TrainerTraineeDaysExercisesToStartScreen = ({navigation,route}) => {
const [modalVisible, setModalVisible] = useState(false);
const { publicWorkoutsPlanDayArrSent, publicWorkoutsPlanstableCon,publicWorkoutsPlanDayArrBeforeSeperateWrkArySent } = route.params;
    const [traineeData, setTraineeData] = useState({});    
    useFocusEffect(
      React.useCallback(() => {
      

      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
      AsyncStorage.getItem("currentUser").then((user) => {

          const storedUser = JSON.parse(user);
            axios.get('https://www.elementdevelops.com/api/get-trainee-side-data', {
              headers: {
                'Authorization': `Bearer ${res}`,
                'Content-Type': 'application/json',
              },
              })
              .then(response => {
                // Handle successful response
              console.log('trainee exercises----::',response.data?.['TraineesData']?.[0]);
    
               
                setTraineeData(response.data?.['TraineesData']?.[0]);
              })
              .catch(error => {
                // Handle error
                //console.log('Error fetching Trainee:', error);
              });
          
          })
          
      });

  
       
      
    }, []) // Depend on reload state
    );
  const publicPlansDataTableItemDayCon = publicWorkoutsPlanDayArrSent;
   ////// History Section
   const { t, i18n } = useTranslation();
   useEffect(() => {
    navigation.setOptions({ title: `${publicWorkoutsPlanstableCon?.plnNam}` });
   console.log('publicWorkoutsPlanstableCon',publicWorkoutsPlanstableCon);
  }, [publicWorkoutsPlanstableCon]);
   const [workouts, setWorkouts] = useState([
    { id: 1, workoutName:'STATIC 1',totalSets: 4, totalReps: 5 },
   { id: 2, workoutName:'STATIC 2',totalSets: 3, totalReps: 2 },
   { id: 3, workoutName:'STATIC LUNGE',totalSets: 6, totalReps: 4 },
   { id: 4, workoutName:'STATIC LUNGE',totalSets: 2, totalReps: 6 },
   { id: 5, workoutName:'STATIC LUNGE',totalSets: 7, totalReps: 7 },
   { id: 6, workoutName:'STATIC LUNGE',totalSets: 9, totalReps: 1 },

   ]);
   function isImageUrl(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
    const lowercasedUrl = url?.toLowerCase();
    return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
  } 
////console.log('publicPlansDataTableItemDayCon daysexercisestostart',publicPlansDataTableItemDayCon);
////console.log('publicWorkoutsPlanstableCon daysexercisestostart',publicWorkoutsPlanstableCon);

  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{publicWorkoutsPlanDayArrBeforeSeperateWrkArySent?.[0].dayNam}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                      onPress={() => {
                        navigation.navigate('TrainerTraineeStartExercisesWithTimer',{publicPlansDataTableItemDayCon:publicPlansDataTableItemDayCon,publicWorkoutsPlanstableCon:publicWorkoutsPlanstableCon,publicWorkoutsPlanDayArrBeforeSeperateWrkArySent:publicWorkoutsPlanDayArrBeforeSeperateWrkArySent,traineeData:traineeData})
                        //console.log('publicWorkoutsPlanDayArrBeforeSeperateWrkArySent days exer to start',publicWorkoutsPlanDayArrBeforeSeperateWrkArySent);
                        }}>
                    <CalendarFullSizePressableButtonText >{t('Start')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  {/* <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >{t('Calender')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <ViewOverlay>
          
                    <TrainerTraineeWorkedExercisesCalendarScreen 
                            onAddEntry={() => setModalVisible(false)}
                            publicWorkoutsPlanRowCon={publicWorkoutsPlanstableCon?.[0]}
                          />
                    </ViewOverlay>
                  </Modal>
                  </FormElemeentSizeButtonView> */}
                </FormElemeentSizeButtonParentView>
              </Spacer>
            <Spacer size="small">
                <FlatList
                    data={publicPlansDataTableItemDayCon}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>{
                    //console.log('item daysexercisestostart',item);

                    return(
                    <Spacer size="large">
                      <ExerciseParentView >
                        <ExerciseImageView >
                            {/* <ExerciseImageViewImage style={{height:80}} source={require('../../../../assets/gym-workout.png')}/> */}
                            {/* {(item.images !== '' && item.images !== undefined && item.images !== null) ? (
                            <>
                              {isImageUrl(item.images) && (
                                <ExerciseImageViewImage  style={{height:80}} 
                                  source={{ uri: `${item.images}` }}
                                />
                              )}
                            </>
                          ) : (
                            <ExerciseImageViewImage  style={{height:80}} source={require('../../../../assets/gym-workout.png')} />
                          )} */}
                          {/* <ExerciseImageViewImage 
                                      source={
                                    item?.images.startsWith('../../../../assets/images')
                                      ? mainWorkoutsData[item?.wrkKey-1]?.images
                                      : item?.images.startsWith('file:///data/user')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://www.elementdevelops.com')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                      ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                      : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                                      
                                      resizeMode="stretch" // Ensures the entire image is displayed
                                      /> */}
                                      <>
                                      {
                                      (isImageUrl(item?.images)) ? (
                                        
                                        <ExerciseImageViewImage 
                                          source={
                                          item?.images.startsWith('../../../../assets/images')
                                          ? mainWorkoutsData[item?.wrkKey-1]?.images
                                          : item?.images.startsWith('file:///data/user')
                                          ? { uri: item?.images }
                                          : item?.images.startsWith('https://www.elementdevelops.com')
                                          ? { uri: item?.images }
                                          : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                          ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                          : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                                          
                                          resizeMode="stretch" // Ensures the entire image is displayed
                                          />
                                              
                                        

                                      ) : (
                                        (() => {
                                          let parsedDataImages;

                                          try {
                                            parsedDataImages = JSON.parse(item?.images);
                                            {/* console.log("parsedData TRAINEEE-------:", parsedDataImages); */}
                                          } catch (error) {
                                            {/* console.error("Failed to parse item?.images:", error); */}
                                            parsedDataImages = null;
                                          }
                                          
                                          {/* console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl); */}

                                          
                                      if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null ) {
                                        return (
                                          <>
                                          {(isImageUrl(parsedDataImages?.CloudFlareImageUrl) )&& (
                                            <ExerciseImageViewImage
                                                    source={{
                                                      uri: parsedDataImages?.CloudFlareImageUrl.replace(
                                                        'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                                                        'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                                                      )
                                                    }}
                                                    resizeMode="stretch" // Ensures the entire image is displayed

                                                    />
                                            
                                          )}
                                        </>

                                        );
                                      } else if (parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
                                        return (
                                          <>
                                          {(isImageUrl(parsedDataImages?.LocalImageUrl))&& (
                                            <ExerciseImageViewImage
                                                    source={{
                                                      uri: parsedDataImages?.LocalImageUrl
                                                    }}
                                                    resizeMode="stretch" // Ensures the entire image is displayed

                                                    />
                                            
                                          )}
                                        </>

                                        );
                                      } else {
                                            return (
                                              <ExerciseImageViewImage
                                                source={require("../../../../assets/gym-workout.png")}
                                                resizeMode="stretch" // Ensures the entire image is displayed

                                                />
                                            );
                                          }
                                        })()
                                      )
                                      }
                                      </>
                        </ExerciseImageView>
                        <ExerciseInfoParentView>
                            <ExerciseInfoTextHead style={{fontSize:16}} >{item.wktNam}</ExerciseInfoTextHead>
                            <ExerciseInfoTextTag style={{fontSize:14}} >{parseFloat(item.wrkSts).toFixed(0)} Sets</ExerciseInfoTextTag>
                        </ExerciseInfoParentView>
                      </ExerciseParentView>
                    </Spacer>
                    );
                    }}
                />
            </Spacer>
            {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>  */}
            <Spacer size="large"></Spacer>
        </ScrollView>
      </PageContainer>
  );

};

const styles = {
  WorkoutNametabContainer: {
    width:"100%",
    backgroundColor:"#455357"
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:"100%",
    height:780,
    backgroundColor:"#455357"
  },
};