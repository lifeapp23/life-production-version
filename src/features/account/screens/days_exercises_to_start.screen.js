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
  import "./i18n";
  import { useTranslation } from 'react-i18next';
  import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
const isImageInMemory = async (fileUri) => {
  try {
    

    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    // Return true if the file exists
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
};
export const DaysExercisesToStartScreen = ({navigation,route}) => {
const [modalVisible, setModalVisible] = useState(false);
const {t} = useTranslation();
const params = route.params || {};

  const { publicWorkoutsPlanRowCon = {}, publicWorkoutsPlanDayArrSent = [] } = params;
  
  const publicPlansDataTableItemDayCon = route.params?.publicWorkoutsPlanDayArrSent;
   
  ////// History Section
   useEffect(() => {
    navigation.setOptions({ title: `${publicWorkoutsPlanRowCon?.plnNam}` });
   console.log('publicWorkoutsPlanRowCon',publicWorkoutsPlanRowCon);
  }, [publicWorkoutsPlanRowCon]);
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

  const SelectedExerciseListItem = ({ item, t }) => {
    const [localInsideCompImageInMemory, setLocalInsideCompImageInMemory] = useState(false);
  
    useEffect(() => {
      const checkImageInMemory = async () => {
        let parsedDataImages = null;
        try {
          parsedDataImages = JSON.parse(item?.images);
        } catch (error) {
          // console.error("Failed to parse item?.images:", error);
        }
  
        if (parsedDataImages?.LocalImageUrl) {
          const exists = await isImageInMemory(parsedDataImages.LocalImageUrl);
          setLocalInsideCompImageInMemory(exists);
        }
      };
  
      checkImageInMemory();
    }, [item?.images]);


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
              <>
                {
                (isImageUrl(item?.images)) ? (
                    
                    <ExerciseImageViewImage
                            source={
                            item?.images?.startsWith('../../../../assets/images')
                                ? mainWorkoutsData[item?.wrkKey-1]?.images
                                : item?.images?.startsWith('file:///data/user')
                                ? { uri: item?.images }
                                : item?.images.startsWith('https://www.elementdevelops.com')
                                ? { uri: item?.images }
                                : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                : require('../../../../assets/gym-workout.png')
                            }   
                            resizeMode="stretch" // Ensures the entire image is displayed

                        />
                        
                    

                ) : (
                    (() => {
                    let parsedDataImages;

                    try {
                        parsedDataImages = JSON.parse(item?.images);
                        console.log("parsedData TRAINEEE-------:", parsedDataImages);
                    } catch (error) {
                        {/* console.error("Failed to parse item?.images:", error); */}
                        parsedDataImages = null;
                    }
                    
                    console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl);

                    
                if (localInsideCompImageInMemory == true && parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
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
                }else if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null ) {
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
                <ExerciseInfoTextTag style={{fontSize:14}} >{parseFloat(item.wrkSts).toFixed(0)} {t("Sets")}</ExerciseInfoTextTag>
            </ExerciseInfoParentView>
          </ExerciseParentView>
        </Spacer>
        );
}
////console.log('publicPlansDataTableItemDayCon',publicPlansDataTableItemDayCon);
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{publicPlansDataTableItemDayCon[0].dayNam}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                      onPress={() => navigation.navigate('StartExercisesWithTimer',{publicPlansDataTableItemDayCon:publicPlansDataTableItemDayCon})}>
                    <CalendarFullSizePressableButtonText >{t("Start")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  {/* <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => setModalVisible(true)}>
                    <CalendarFullSizePressableButtonText >{t("Calender")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  <Modal visible={modalVisible} transparent={true} animationType="fade">
                    <ViewOverlay>
                    <WorkedExercisesCalendarScreen 
                          onAddEntry={() => setModalVisible(false)} publicPlansDataTableItemDayCon={publicPlansDataTableItemDayCon}
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
                    renderItem={({ item }) => (
                        <SelectedExerciseListItem
                          item={item}
                          t={t}
                        />
                      )}
                />
            </Spacer>
            {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
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