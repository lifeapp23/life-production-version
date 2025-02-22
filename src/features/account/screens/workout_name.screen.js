import React, { useState, useEffect,useRef } from 'react';
import { Dimensions,View, ScrollView, Modal,TouchableOpacity,Button,ActivityIndicator,Text } from 'react-native';
import { Layout, Tab, TabView } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { fetchWorkoutsTable} from "../../../../database/workoutsTable";
import { fetchSpecificWorkoutWithoutDeleting} from "../../../../database/start_workout_db";
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');
import axios from 'axios';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Asset } from 'expo-asset';
import { Video } from 'expo-av';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";

import { FlatList } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import {
    Title,
    TitleView,
    InputField,
    FormLabel,
    PageContainer,
    FormLabelView,
    FormInputView,
    PageMainImage,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    FullSizeButtonView,
    FullButton,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    DataTableTitleKey, 
    DataTableCellKey, 
    DataTableCellValue,
    DataTableTitleKeyText,
    ViewOverlay,
    DataTableCellKeyText,
    DataTableCellValueText,
    FormLabelDateRowView,
    FormLabelDateRowViewText,
    TargetSectionMuscleContainer,
    TargetSectionAnatomyImage,
    DemoSectionViewImage,
    DemoSectionImage,
    DemoSectionTextView,
    DemoSectionExplanationText,
    DataTableDateTextView,
    DataTableDateText,
    DemoPlayIcon

  
  } from "../components/account.styles";
  import Slider from '@react-native-community/slider';

const isFileInMemory = async (fileUri) => {
  try {
    

    // Check if the file exists
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    // Return true if the file exists
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
};
export const WorkoutNameScreen = ({navigation,route}) => {
  const params = route.params || {};
//console.log("params WorkoutNameScreen",params);
  const { item = {}, userComeFromExercisePage = false,traineeData={} } = params;
  // console.log("traineeData WorkoutNameScreen",traineeData);

  const itemParam = item;
  // console.log('itemParam workname',itemParam);

  //console.log('traineeData workname',traineeData);
  const [selectedTapIndex, setSelectedTapIndex] = React.useState(0);
  const [workoutArray, setWorkoutArray] = useState(itemParam);
  const [workoutWorkedObject, setWorkoutWorkedObject] = useState({});
  const [userId, setUserId] = useState("");
  const { t, i18n } = useTranslation();
  //const {width} = Dimensions.get("window")
  
  
   // Separate state for tab visibility
   const [isTargetMuscleTabVisible, setIsTargetMuscleTabVisible] = useState(true);
   const [isDemoTabVisible, setIsDemoTabVisible] = useState(false);
   const [isHistoryTabVisible, setIsHistoryTabVisible] = useState(false);
   const [thumbnailUri, setThumbnailUri] = React.useState(null);

   const [showThumbnail, setShowThumbnail] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPausedNewController, setIsPausedNewController] = useState(false);
    const [progressNewController, setProgressNewController] = useState(0);
    const handlePausePlayNewController = () => {
      if (status?.isPlaying === true){
        setTimeout(() => {
          video.current.stopAsync();
        
      }, 0);
        //video.current.pauseAsync();
        setIsPausedNewController(true);

      } else {
          video.current.playAsync();
          setIsPausedNewController(false);
      }
  };

  const handleStopNewController = async () => {
    if (status?.isPlaying === true){
      setTimeout(() => {
        video.current.stopAsync();
      
    }, 0);
      //video.current.pauseAsync();
      
    }
  
    setIsPausedNewController(true);

      setProgressNewController(0);
  };

  const handleSliderChangeNewController = async (value) => {
      const position = value * status.durationMillis;
      await video.current.setPositionAsync(position);
  };
  // Separate state for video playback visibility
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // reference to the Video component
  const [videoRef, setVideoRef] = useState(null);
  const [isPressDisabled, setPressDisabled] = useState(false);
  const handleTabSelect = (index) => {
    
    //console.log('index',index);
    
    if (isPressDisabled) return;
    
    setPressDisabled(true);
    if(index == 0 || index == 2){
      if(video?.current){
          if (status?.isPlaying === true){
            setTimeout(() => {
              video?.current?.pauseAsync();
            
          }, 0);
            //video.current.pauseAsync();
            
            setShowThumbnail(true);
          }else{
            setShowThumbnail(true);
          }
        }
    }
    
    setSelectedTapIndex(index);
    
    setTimeout(() => {
      setPressDisabled(false);
    }, 300); // Disable press for 300ms to prevent quick successive presses
  };
  

//////console.log('asssets ',Asset.fromModule(require('../../../../assets/videos/DUMBBELL_STRAIGHT_LEG_DEADLIFT.mp4')));
   useEffect(() => {
    setWorkoutArray(itemParam);
     // Update tab visibility states when the selectedTabIndex changes
     setIsTargetMuscleTabVisible(selectedTapIndex === 0);
     setIsDemoTabVisible(selectedTapIndex === 1);
     setIsHistoryTabVisible(selectedTapIndex === 2);
     if(isTargetMuscleTabVisible){
      setShowThumbnail(true);
     }
     if(isHistoryTabVisible){
      setShowThumbnail(true);
     }
   }, [selectedTapIndex,itemParam]);
   useFocusEffect(
    React.useCallback(() => {
    

    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
    AsyncStorage.getItem("currentUser").then(async (user) => {
      // setSearchQuery('');
      // setSelectedMuscles(''); 
      // setSelectedEquipments('');
        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
        ////console.log('exercisessss user',storedUser);
         // Fetch online data
         ///fetch online data for history
         //console.log('itemParam?.speKey',itemParam?.speKey);
      const onlineDataResponse = await axios.get(
        "https://life-pf.com/api/fetch-specific-workout-without-deleting",
        {
          params: {
            traineeId: traineeData?.trneId,
            trainerId: traineeData?.trnrId,
            wrkKey:itemParam?.speKey ? itemParam?.speKey : itemParam?.wrkKey,
          },
          headers: {
            Authorization: `Bearer ${res}`,
            "Content-Type": "application/json",
          },
        }
      );

      const onlineDataTrainerUser =
        onlineDataResponse?.data?.workoutAllEntries || [];
        // //console.log(
        //   "Fetched online data:",
        //   onlineDataTrainerUser
        // );
 const wrkSpekey = workoutArray?.speKey ? workoutArray?.speKey : workoutArray?.wrkKey;
        const offlineDataNormalUser = await fetchSpecificWorkoutWithoutDeleting(storedUser.id,wrkSpekey);
        // //console.log(
        //   "Fetched offline data:",
        //   offlineDataNormalUser
        // );
        if (traineeData) {

         
          const today = new Date();

          // Safely check if `data` exists and has `strDat` and `endDat`
          if (traineeData?.strDat && traineeData?.endDat) {
            const strDat = new Date(traineeData?.strDat);
            const endDat = new Date(traineeData?.endDat);

            // Check if today is between `strDat` and `endDat`
            if (today >= strDat && today <= endDat) {
              const mixedOnlineAndOfflineHistoryData = [
                ...(onlineDataTrainerUser || []),
                ...(offlineDataNormalUser || []),
              ];
              let groupedData = {};
          // //console.log('workname WResults', WResults);

          // Group rows by date and then by dayKey within each date
          mixedOnlineAndOfflineHistoryData.forEach(row => {
                  const date = row.date;
                  const dayKey = row.dayKey;
                  
                  // If the date doesn't exist in the groupedData object, create an empty object for it
                  if (!groupedData[date]) {
                    groupedData[date] = {};
                  }
                  
                  // If the dayKey doesn't exist in the date object, create an empty array for it
                  if (!groupedData[date][dayKey]) {
                    groupedData[date][dayKey] = [];
                  }
                  
                  // Push the row into the array for the corresponding date and dayKey
                  groupedData[date][dayKey].push(row);
                });
                //console.log('workname mixedOnlineAndOfflineHistoryData groupedData', groupedData);

                setWorkoutWorkedObject(groupedData);
              
            } else {
              let groupedData = {};
              // //console.log('workname WResults', WResults);

              // Group rows by date and then by dayKey within each date
              offlineDataNormalUser.forEach(row => {
                const date = row.date;
                const dayKey = row.dayKey;
                
                // If the date doesn't exist in the groupedData object, create an empty object for it
                if (!groupedData[date]) {
                  groupedData[date] = {};
                }
                
                // If the dayKey doesn't exist in the date object, create an empty array for it
                if (!groupedData[date][dayKey]) {
                  groupedData[date][dayKey] = [];
                }
                
                // Push the row into the array for the corresponding date and dayKey
                groupedData[date][dayKey].push(row);
              });

              //console.log('workname offlineDataNormalUser groupedData', groupedData);

            setWorkoutWorkedObject(groupedData);
            }
          } else {
            let groupedData = {};
              // //console.log('workname WResults', WResults);

              // Group rows by date and then by dayKey within each date
              offlineDataNormalUser.forEach(row => {
                const date = row.date;
                const dayKey = row.dayKey;
                
                // If the date doesn't exist in the groupedData object, create an empty object for it
                if (!groupedData[date]) {
                  groupedData[date] = {};
                }
                
                // If the dayKey doesn't exist in the date object, create an empty array for it
                if (!groupedData[date][dayKey]) {
                  groupedData[date][dayKey] = [];
                }
                
                // Push the row into the array for the corresponding date and dayKey
                groupedData[date][dayKey].push(row);
              });

              //console.log('workname offlineDataNormalUser groupedData', groupedData);

            setWorkoutWorkedObject(groupedData);
          }

        } else {
          let groupedData = {};
              // //console.log('workname WResults', WResults);

              // Group rows by date and then by dayKey within each date
              offlineDataNormalUser.forEach(row => {
                const date = row.date;
                const dayKey = row.dayKey;
                
                // If the date doesn't exist in the groupedData object, create an empty object for it
                if (!groupedData[date]) {
                  groupedData[date] = {};
                }
                
                // If the dayKey doesn't exist in the date object, create an empty array for it
                if (!groupedData[date][dayKey]) {
                  groupedData[date][dayKey] = [];
                }
                
                // Push the row into the array for the corresponding date and dayKey
                groupedData[date][dayKey].push(row);
              });

              //console.log('workname offlineDataNormalUser groupedData', groupedData);

            setWorkoutWorkedObject(groupedData);
        }
        // fetchSpecificWorkoutWithoutDeleting(storedUser.id,workoutArray.speKey).then((WResults) => {
        //   ////console.log('WorkoutsDataArray',WResults);
        //   // Create an object to group rows by date
        //     // const groupedData = {};
        //     // //console.log('workname WResults',WResults);

        //     // // Group rows by date
        //     // WResults.forEach(row => {
        //     //   // Extract the date from the row
        //     //   const date = row.date;
              
        //     //   // If the date doesn't exist in the groupedData object, create an empty array for it
        //     //   if (!groupedData[date]) {
        //     //     groupedData[date] = [];
        //     //   }
              
        //     //   // Push the row into the array for the corresponding date
        //     //   groupedData[date].push(row);
        //     // });
        //     const groupedData = {};
        //   // //console.log('workname WResults', WResults);

        //   // Group rows by date and then by dayKey within each date
        //   WResults.forEach(row => {
        //     const date = row.date;
        //     const dayKey = row.dayKey;
            
        //     // If the date doesn't exist in the groupedData object, create an empty object for it
        //     if (!groupedData[date]) {
        //       groupedData[date] = {};
        //     }
            
        //     // If the dayKey doesn't exist in the date object, create an empty array for it
        //     if (!groupedData[date][dayKey]) {
        //       groupedData[date][dayKey] = [];
        //     }
            
        //     // Push the row into the array for the corresponding date and dayKey
        //     groupedData[date][dayKey].push(row);
        //   });

        //   //console.log('workname groupedData', groupedData);

        //     setWorkoutWorkedObject(groupedData);
        //     }).catch((error) => {
        //     //console.error('Error fetching WorkoutsTable:', error);
        //     });
       
          
        
        })
        
    });
   
    }, [])
  );
    React.useEffect(() => {


    ////console.log('workoutWorkedObject',workoutWorkedObject);
  }, [workoutWorkedObject]);
///---------------------- image or video and make thumbanils functions --------------///
const newLink ='../../../../assets/videos/DUMBBELL_STRAIGHT_LEG_DEADLIFT.mp4';
// const newarr ={"eqpUsd": "Decline Bench", "exrTyp": "Compound", "id": 573, "isSync": "no", "mjMsOn": "Chest", "mjMsTr": "Middle Chest", "mjMsTw": "Upper Chest", "minorMuscleOne": "Lower Chest", "mnMsTr": "Back", "minorMuscleTwo": "Serratus Anterior", "performingWorkout": "Ggg", "speKey": "0.21768789034243965-2024-01-20", "userId": 20, "weightsUsed": "dumbbells",
//  "wktMda": "../../assets/videos/DUMBBELL_STRAIGHT_LEG_DEADLIFT.mp4", "workoutName": "Mahmoud", "workoutSetup": "FFF"}
// ////console.log('newarr',newarr);
// Enclose newarr.wktMda value in single quotes
// const wktMdaValueInQuotes = `'${newarr['wktMda']}'`;
// const assetPath = `'${newarr['wktMda']}'`;

// // Using require with the dynamically constructed path
// //const arassetPath = Asset.fromModule(require(assetPath));
// const ar = Asset.fromModule(require(`../${assetPath}`)).uri;
// ////console.log('ar', ar);
// //////console.log('arassetPath', arassetPath);

// ////console.log('wktMdaValueInQuotes',wktMdaValueInQuotes);
// Use wktMda with Asset.fromModule
//const asset = Asset.fromModule(require(wktMdaValueInQuotes));
//////console.log('Asset.fromModule URI:', asset.uri);
  function isImageUrl(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
    const lowercasedUrl = url?.toLowerCase();
    return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
  }
  
  function isVideoUrl(url) {
    const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v'];
    const lowercasedUrl = url?.toLowerCase();
    return videoExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
  }
  const generateVideoThumbnailAsync = async (videoPath) => {
    try {
      let thumbnailUri = '';
  
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
        time: 5000,
      });
      thumbnailUri = uri;
  
      setThumbnailUri(thumbnailUri);
      //////console.log('uri', thumbnailUri);
    } catch (e) {
      //console.error('Error generating video thumbnail:', e);
    }
  };
  

  

  // React.useEffect(() => {


  //   if (isVideoUrl(workoutArray?.wktMda)) {
  //     generateVideoThumbnailAsync(workoutArray?.wktMda);
  //   }
  // }, [workoutArray.wktMda]);


////-----------------------------------------------------------------------------------------////
   ////// History Section

  const tasks = [
    {
      key: 1,
      date: '2023-10-26',
      sets: 1,
      weight: 10,
      reps: 12,
    },
    {
      key: 2,
      date: '2023-10-26',
      sets: 2,
      weight: 12.5,
      reps: 10,
    },
    {
      key: 3,
      date: '2023-10-26',
      sets: 3,
      weight: 15,
      reps: 8,
    },
    {
      key: 4,
      date: '2023-10-27',
      sets: 1,
      weight: 20,
      reps: 12,
    },
    {
      key: 5,
      date: '2023-10-27',
      sets: 2,
      weight: 16.5,
      reps: 10,
    },
    {
      key: 6,
      date: '2023-10-27',
      sets: 3,
      weight: 17,
      reps: 8,
    },
   ];
   const workouts = [
    {
    workoutName:"STATIC LUNGE",
    excerciseType:'stability',
    majorMuscleGroupOne:'Quadriceps',
    majorMuscleGroupTwo:'Hamstrings',
    majorMuscleGroupThree:'Calves',
    minorMuscleGroupOne:'iliacus',
    minorMuscleGroupTwo:"pectineus",
    minorMuscleGroupThree:"psoas major",
    workoutType:'easy_type',
    complexity:'easy_type'},
    {
    workoutName:"STANDING LEG CIRCLES",
    excerciseType:'cardio',
    majorMuscleGroupOne:'Glutes',
    majorMuscleGroupTwo:'Adductors',
    majorMuscleGroupThree:'Calves',
    minorMuscleGroupOne:'Hip Flexor',
    minorMuscleGroupTwo:"Iliopsoas",
    minorMuscleGroupThree:"Sartorius",
    workoutType:'easy_type',
    complexity:'easy_type'},
    {
    workoutName:"NAVY SEAL BURPEE",
    excerciseType:'isolation',
    majorMuscleGroupOne:'Quadriceps',
    majorMuscleGroupTwo:'Hamstrings',
    majorMuscleGroupThree:'Brachialis',
    minorMuscleGroupOne:'Lats',
    minorMuscleGroupTwo:"Traps",
    minorMuscleGroupThree:"psoas major",
    workoutType:'easy_type',
    complexity:'easy_type'},
   ];
   //const workout = workouts.find((workout) => workout.wktNam === workoutName);

  const groupedTasks = tasks.reduce((group, task) => {
    if (!group[task.date]) {
      group[task.date] = [];
    }
    group[task.date].push(task);
    return group;
  }, {});

  const [modalVisible, setModalVisible] = useState(false);
  ///---------------handlePlayVideo--------------//
  // handlePlayVideo function with updated logic
  // Update the handlePlayVideo function
// Update the handlePlayVideo function
const handlePlayVideo = async (video) => {

 // Update state to indicate video is playing
 setShowThumbnail(false);

};
////console.log('workoutArray---',workoutArray);
// if(workoutArray?.videos?.startsWith('../../../../assets/videos')){
//   ////console.log('mainWorkoutsData[workoutArray?.id-1]?.workoutMedia',mainWorkoutsData[workoutArray?.id-1]?.workoutMedia);
// }else if (workoutArray?.videos?.startsWith('file:///data/user')){
//   ////console.log('workoutArray?.videos',workoutArray?.videos);
// }

// //console.log('workoutArray',workoutArray);
//console.log('workoutArray?.videos',workoutArray?.videos);

// //console.log('mainWorkoutsData[workoutArray?.wrkKey-1]?.images',mainWorkoutsData[workoutArray?.wrkKey-1]?.images);
// //console.log('mainWorkoutsData[workoutArray?.id - 1]?.images',mainWorkoutsData[workoutArray?.id - 1]?.images);
useEffect(() => {
    navigation.setOptions({ title: `${workoutArray.wktNam}` });
   
}, [workoutArray]);
//////////////Start check if the image in the local database////
const [localImageInMemory, setLocalImageInMemory] = useState(false);

  useEffect(() => {
    const checkImageInMemory = async () => {
      let parsedDataImages = null;
      try {
        parsedDataImages = JSON.parse(workoutArray?.images);
      } catch (error) {
        // console.error("Failed to parse workoutArray?.images:", error);
      }

      if (parsedDataImages?.LocalImageUrl) {
        const exists = await isFileInMemory(parsedDataImages.LocalImageUrl);
        setLocalImageInMemory(exists);
      }
    };

    checkImageInMemory();
  }, [workoutArray?.images]);

//////////////End check if the image in the local database////

//////////////Start check if the image in the local database////
const [localVideoInMemory, setLocalVideoInMemory] = useState(false);

  useEffect(() => {
    const checkVideoInMemory = async () => {
      let parsedDataVideos = null;
      try {
        parsedDataVideos = JSON.parse(workoutArray?.videos);
      } catch (error) {
        // console.error("Failed to parse workoutArray?.videos:", error);
      }

      if (parsedDataVideos?.LocalImageUrl) {
        const exists = await isFileInMemory(parsedDataVideos?.LocalImageUrl);
        setLocalVideoInMemory(exists);
      }
    };

    checkVideoInMemory();
  }, [workoutArray?.videos]);

//////////////End check if the image in the local database////
// State to manage if the video exists in local storage
const [videoInLocalStorage, setVideoInLocalStorage] = React.useState(false);

// Extract the image name and remove the extension
const imageName = workoutArray?.images?.split('workouts_thumbnails/').pop();
const nameWithoutExtension = imageName?.split('.').slice(0, -1).join('.');

// Create the new URL
const videoPath = FileSystem.documentDirectory + 'public/videos/workouts/' + nameWithoutExtension + '.mp4';
// console.log('videoPath',videoPath);
//"videos": "file:///data/user/0/host.exp.exponent/files/public/videos/workouts/Standing_Leg_Circles.mp4",
//"Path": file:///data/user/0/host.exp.exponent/files/videos/workouts/Standing_Leg_Circles.mp4
// Check if the video exists in local storage
React.useEffect(() => {
  (async () => {
    if (videoPath) {
      const fileInfo = await FileSystem.getInfoAsync(videoPath);
      // console.log('fileInfo.exists',fileInfo.exists);

      setVideoInLocalStorage(fileInfo.exists);
    }
  })();
}, [videoPath]); // Runs when `videoPath` changes


return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            {/* <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader style={{textAlign:"center"}}>{workoutArray.wktNam}</ServicesPagesCardHeader>
            </ServicesPagesCardCover> */}
            <ServicesPagesCardCover>
            
                <>
                  {
                    (isImageUrl(workoutArray?.images)) ? (
                      
                      <PageMainImage
                              source={
                                workoutArray?.images?.startsWith('../../../../assets/images')
                                    ? (workoutArray?.wrkKey != undefined
                                        ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                                        : mainWorkoutsData[workoutArray?.id - 1]?.images
                                      )
                                    : workoutArray?.images?.startsWith('file:///data/user')
                                    ? { uri: workoutArray?.images }
                                    : workoutArray?.images.startsWith('https://life-pf.com')
                                    ? { uri: workoutArray?.images }
                                    : workoutArray?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                    ? { uri: workoutArray?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                    : require('../../../../assets/gym-workout.png')
                                }   
                                resizeMode="stretch" // Ensures the entire image is displayed
                      
                            />
                            
                      

                    ) : (
                      (() => {
                        let parsedDataImages;

                        try {
                          parsedDataImages = JSON.parse(workoutArray?.images);
                         // //console.log("parsedData TRAINEEE-------:", parsedDataImages);
                        } catch (error) {
                          {/* console.error("Failed to parse workoutArray?.images:", error); */}
                          parsedDataImages = null;
                        }
                        
                       // //console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl);

                         if (localImageInMemory && parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
                      return (
                        <>
                        {(isImageUrl(parsedDataImages?.LocalImageUrl))&& (
                          <PageMainImage
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
                          <PageMainImage
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
                    }else {
                          return (
                            <PageMainImage
                              source={require("../../../../assets/gym-workout.png")}
                              resizeMode="stretch" // Ensures the entire image is displayed
                              />
                          );
                        }
                      })()
                    )
                  }
                </>

            </ServicesPagesCardCover>
            <Spacer size="large">
            {(workoutArray?.userId != "appAssets" && userComeFromExercisePage == true)?(
              <FormElemeentSizeButtonView style={{width:width-20,marginBottom:10,marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
        onPress={() => navigation.navigate('AddNewEntryWorkout',{isEditWorkoutMode:true,editedWorkoutEntry:workoutArray,userComeFromExercisePage:userComeFromExercisePage,traineeData:traineeData})}>
                <CalendarFullSizePressableButtonText >{t("Edit_Workout")}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </FormElemeentSizeButtonView>
            ):(null)}
            </Spacer>
            <TabView 
                selectedIndex={selectedTapIndex}
                onSelect={handleTabSelect}
              >
              <Tab title={t('Target_Muscle')} style={{paddingVertical: 5,paddingHorizontal: 20,borderTopColor:"#000",borderTopWidth:1}}>
                <Layout style={[styles.WorkoutNametabContainer]}>
                {isTargetMuscleTabVisible && (
                <View style={styles.navContainer}>
                  <TargetSectionMuscleContainer style={styles.TargetSectionMuscleContainer}>
                    
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Workout_Name')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.wktNam}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Exercise_Type')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.exrTyp}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Major_Muscle_One')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mjMsOn}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Major_Muscle_Two')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mjMsTw}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Major_Muscle_Three')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mjMsTr}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Minor_Muscle_One')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mnMsOn}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Minor_Muscle_Two')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mnMsTo}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Minor_Muscle_Three')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.mnMsTr}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Equipment_Used')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.eqpUsd}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Weights_Used')}:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workoutArray.witUsd}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer>
                    {/* <Spacer size="medium">
                      <InputField >
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>Complexity:</FormLabel>
                        </FormLabelView>
                          <FormLabelDateRowView><FormLabelDateRowViewText>{workout.complexity}</FormLabelDateRowViewText></FormLabelDateRowView>
                      </InputField>
                    </Spacer> */}
                    {/* <Spacer size="large">
                      <InputField>
                        <FormLabelView style={{width:"45%"}}>
                          <FormLabel>{t('Anatomy')}:</FormLabel>
                        </FormLabelView>
                        <FormInputView>
                          <TargetSectionAnatomyImage
                            source={require('../../../../assets/gym-workout.png')} // Replace with your image source
                            style={styles.TargetSectionAnatomyImage}
                          />
                        </FormInputView>
                      </InputField>
                    </Spacer> */}
                    <Spacer size="large">
                          <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                        onPress={() => {
                            navigation.navigate('SimilarExercises', { workout: workoutArray });
                            setShowThumbnail(true);
                            }}>
                              <CalendarFullSizePressableButtonText >{t('Similar')}</CalendarFullSizePressableButtonText>
                            </CalendarFullSizePressableButton>
                          </FormElemeentSizeButtonParentView>
                        {/* <Modal visible={modalVisible} transparent={true} animationType="fade">
                        <ViewOverlay>
                        <SimilarExercises workout={workoutArray} updateWorkoutArray={(newArray) => {
                          setWorkoutArray(newArray);
                          ////console.log('newArray',newArray);
                        }}/>
                        </ViewOverlay>
                      </Modal> */}
                    </Spacer>
                  </TargetSectionMuscleContainer>
                </View>
                )}
                </Layout>
              </Tab>
              <Tab title={t('Demo')} style={{paddingVertical: 5,paddingHorizontal: 20,borderTopColor:"#000",borderTopWidth:1}}>
                <Layout style={styles.WorkoutNametabContainer}>
                {isDemoTabVisible && (
                <View style={styles.navContainer}>
                  <DemoSectionViewImage style={{marginLeft:15,marginRight:15}}>
                  <>
                      {
                        (isImageUrl(workoutArray?.images) || isVideoUrl(workoutArray?.videos)) ? (
                          <>
                          {(workoutArray?.images !== '' && workoutArray?.images !== undefined && workoutArray?.images !== null || workoutArray?.videos !== '' && workoutArray?.videos !== undefined && workoutArray?.videos !== null) ? (
                            <>
                              {/* {(isImageUrl(workoutArray?.images) && (workoutArray?.videos === '' || workoutArray?.videos === undefined || workoutArray?.videos === null))&& (
                                <DemoSectionImage
                                source={
                                      workoutArray?.images?.startsWith('../../../../assets/images')
                                          ? (workoutArray?.wrkKey != undefined
                                              ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                                              : mainWorkoutsData[workoutArray?.id - 1]?.images
                                            )
                                          : workoutArray?.images?.startsWith('file:///data/user')
                                          ? { uri: workoutArray?.images }
                                          : workoutArray?.images.startsWith('https://life-pf.com')
                                          ? { uri: workoutArray?.images }
                                          : workoutArray?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                          ? { uri: workoutArray?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                          : require('../../../../assets/gym-workout.png')
                                  }
                                  style={styles.DemoSectionImage}
                                />
                                
                              )} */}
                              {(isImageUrl(workoutArray?.images) && (workoutArray?.videos === '' || workoutArray?.videos === undefined || workoutArray?.videos === null)) && (
                                      (() => {
                                        // Return the appropriate view
                                        if (videoInLocalStorage) {
                                          return showThumbnail ? (
                                            <>
                                              <TouchableOpacity
                                                onPress={() => {
                                                  handlePlayVideo();
                                                }}
                                              >
                                                <DemoSectionImage
                                                  style={styles.DemoSectionImage}
                                                  source={
                                                    workoutArray?.images?.startsWith('../../../../assets/images')
                                                      ? workoutArray?.wrkKey !== undefined
                                                        ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                                                        : mainWorkoutsData[workoutArray?.id - 1]?.images
                                                      : require('../../../../assets/gym-workout.png')
                                                  }
                                                />
                                                <DemoPlayIcon icon="play-circle" size={70} style={styles.playIcon} />
                                              </TouchableOpacity>
                                            </>
                                          ) : (
                                            <>
                                              <Video
                                                ref={video}
                                                style={styles.video}
                                                source={{ uri: videoPath }}
                                                useNativeControls
                                                resizeMode="stretch"
                                                onPlaybackStatusUpdate={(status) => {
                                                  setStatus(() => status);
                                                }}
                                                onLoad={() => {
                                                  video.current.playAsync();
                                                }}
                                              />
                                            </>
                                          );
                                        }else{
                                          // Default view when the video file does not exist
                                        return (
                                          <DemoSectionImage
                                            source={
                                              workoutArray?.images?.startsWith('../../../../assets/images')
                                                ? workoutArray?.wrkKey !== undefined
                                                  ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                                                  : mainWorkoutsData[workoutArray?.id - 1]?.images
                                                : workoutArray?.images?.startsWith('file:///data/user')
                                                ? { uri: workoutArray?.images }
                                                : workoutArray?.images.startsWith('https://life-pf.com')
                                                ? { uri: workoutArray?.images }
                                                : workoutArray?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                                ? {
                                                    uri: workoutArray?.images.replace(
                                                      'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                                                      'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                                                    ),
                                                  }
                                                : require('../../../../assets/gym-workout.png')
                                            }
                                            style={styles.DemoSectionImage}
                                          />
                                        );
                                        }

                                        
                                      })()
                                    )}

                          
                              {(isVideoUrl(workoutArray?.videos) && workoutArray?.videos !== '' && workoutArray?.videos !== undefined && workoutArray?.videos !== null) && (
                                  <View>
                                    {showThumbnail ? (
                                      <>
                                      <TouchableOpacity onPress={() => {
                                        handlePlayVideo();}}>
                          
                                          <DemoSectionImage style={styles.DemoSectionImage} 
                                          source={
                                              workoutArray?.images?.startsWith('../../../../assets/images')
                                                  ? (workoutArray?.wrkKey != undefined
                                                      ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                                                      : mainWorkoutsData[workoutArray?.id - 1]?.images
                                                    )
                                                  : workoutArray?.images?.startsWith('file:///data/user')
                                                  ? { uri: workoutArray?.images }
                                                  : workoutArray?.images.startsWith('https://life-pf.com')
                                                  ? { uri: workoutArray?.images }
                                                  : workoutArray?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                                  ? { uri: workoutArray?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                                  : require('../../../../assets/gym-workout.png')
                                                }
                                              />
                                        
                                        
                                        <DemoPlayIcon icon="play-circle" size={70} style={styles.playIcon} />
                                      </TouchableOpacity>
                          
                                      </>
                                    ) : (
                                      <>
                          
                                      <Video
                                          ref={video}
                                          style={styles.video}
                                          source={
                                            workoutArray?.videos?.startsWith('../../../../assets/videos')
                                              ? mainWorkoutsData[workoutArray?.id-1]?.workoutMedia
                                              : workoutArray?.videos?.startsWith('file:///data/user')
                                              ? { uri: workoutArray?.videos }
                                              : workoutArray?.videos.startsWith('https://life-pf.com')
                                              ? { uri: workoutArray?.videos }
                                              : workoutArray?.videos.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                              ? { uri: workoutArray?.videos.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                              : null // Set an appropriate default or handle other cases
                                          }                           
                                          useNativeControls
                                          resizeMode="stretch"
                                          onPlaybackStatusUpdate={status => {setStatus(() => status);
                                          
                                          }}
                                          onLoad={() => {video.current.playAsync();}}
                                      />
                                      {/* Progress Slider */}
                                      {/* <Slider
                                          style={styles.sliderNewController}
                                          minimumValue={0}
                                          maximumValue={1}
                                          value={progressNewController}
                                          minimumTrackTintColor="#4CD964"
                                          maximumTrackTintColor="#ccc"
                                          thumbTintColor="#4CD964"
                                          onValueChange={handleSliderChangeNewController}
                                      /> */}
                          
                                      {/* Control Buttons */}
                                      {/* <View style={styles.controlsNewController}>
                                          <Button
                                              title={isPausedNewController ? "Play" : "Pause"}
                                              onPress={handlePausePlayNewController}
                                          />
                                          <Button title="Stop" onPress={handleStopNewController} />
                                      </View> */}
                                        {/* <Button title="Play from 5s" onPress={() => video.current.playFromPositionAsync(5000)} /> */}
                          
                                      </>
                                    )}
                                  </View>
                          
                              )}
                          
                            </>
                          ) : (
                            <DemoSectionImage source={require('../../../../assets/gym-workout.png')} style={styles.DemoSectionImage}/>
                          )}
                            



                          </>

                        ) : (
                          (() => {
                            let parsedDataImages;
                            let parsedDataVideos;

                            try {
                              parsedDataImages = JSON.parse(workoutArray?.images);
                             // //console.log("parsedData TRAINEEE-------:", parsedDataImages);
                            } catch (error) {
                              {/* console.error("Failed to parse workoutArray?.images:", error); */}
                              parsedDataImages = null;
                            }
                            try {
                              parsedDataVideos = JSON.parse(workoutArray?.videos);
                             // //console.log("parsedData TRAINEEE-------:", parsedDataVideos);
                            } catch (error) {
                              {/* console.error("Failed to parse workoutArray?.images:", error); */}
                              parsedDataVideos = null;
                            }
                           // //console.log("parsedData?.CloudFlareImageUrl TRAINEEE-------:", parsedDataImages?.CloudFlareImageUrl);

                        if (localImageInMemory && parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null || localVideoInMemory && parsedDataVideos?.LocalVideUrl !== '' && parsedDataVideos?.LocalVideUrl !== undefined && parsedDataVideos?.LocalVideUrl !== null) {
                          return (
                            <>
                            {(isImageUrl(parsedDataImages?.LocalImageUrl) && (parsedDataVideos?.LocalVideUrl === '' || parsedDataVideos?.LocalVideUrl === undefined || parsedDataVideos?.LocalVideUrl === null))&& (
                              <DemoSectionImage
                                      source={{
                                        uri: parsedDataImages?.LocalImageUrl
                                      }}
                                      style={styles.DemoSectionImage}
                                    />
                              
                            )}
                        
                            {(isVideoUrl(parsedDataVideos?.LocalVideUrl) && parsedDataVideos?.LocalVideUrl !== '' && parsedDataVideos?.LocalVideUrl !== undefined && parsedDataVideos?.LocalVideUrl !== null) && (
                                <View>
                                  {showThumbnail ? (
                                    <>
                                    <TouchableOpacity onPress={() => {
                                      handlePlayVideo();}}>
                        
                                        <DemoSectionImage
                                      source={{
                                        uri: parsedDataImages?.LocalImageUrl
                                      }}
                                      style={styles.DemoSectionImage}
                                    />
                                      
                                      
                                      <DemoPlayIcon icon="play-circle" size={70} style={styles.playIcon} />
                                    </TouchableOpacity>
                        
                                    </>
                                  ) : (
                                    <>
                        
                                    <Video
                                        ref={video}
                                        style={styles.video}
                                        source={{ uri: parsedDataVideos?.LocalVideUrl }}                           
                                        useNativeControls
                                        resizeMode="stretch"
                                        onPlaybackStatusUpdate={status => {setStatus(() => status);
                                        
                                        }}
                                        onLoad={() => {video.current.playAsync();}}
                                    />
                                    
                                    </>
                                  )}
                                </View>
                        
                            )}
                        
                          </>
                        
                          );
                        }  else if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null || parsedDataVideos?.CloudFlareVideUrl !== '' && parsedDataVideos?.CloudFlareVideUrl !== undefined && parsedDataVideos?.CloudFlareVideUrl !== null) {
                          return (
                            <>
                            {(isImageUrl(parsedDataImages?.CloudFlareImageUrl) && (parsedDataVideos?.CloudFlareVideUrl === '' || parsedDataVideos?.CloudFlareVideUrl === undefined || parsedDataVideos?.CloudFlareVideUrl === null))&& (
                              <DemoSectionImage
                                      source={{
                                        uri: parsedDataImages?.CloudFlareImageUrl.replace(
                                          'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                                          'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                                        )
                                      }}
                                      style={styles.DemoSectionImage}
                                    />
                              
                            )}
                        
                            {(isVideoUrl(parsedDataVideos?.CloudFlareVideUrl) && parsedDataVideos?.CloudFlareVideUrl !== '' && parsedDataVideos?.CloudFlareVideUrl !== undefined && parsedDataVideos?.CloudFlareVideUrl !== null) && (
                                <View>
                                  {showThumbnail ? (
                                    <>
                                    <TouchableOpacity onPress={() => {
                                      handlePlayVideo();}}>
                        
                                        <DemoSectionImage
                                      source={{
                                        uri: parsedDataImages?.CloudFlareImageUrl.replace(
                                          'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                                          'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                                        )
                                      }}
                                      style={styles.DemoSectionImage}
                                    />
                                      
                                      
                                      <DemoPlayIcon icon="play-circle" size={70} style={styles.playIcon} />
                                    </TouchableOpacity>
                        
                                    </>
                                  ) : (
                                    <>
                        
                                    <Video
                                        ref={video}
                                        style={styles.video}
                                        source={{ uri: parsedDataVideos?.CloudFlareVideUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }}                           
                                        useNativeControls
                                        resizeMode="stretch"
                                        onPlaybackStatusUpdate={status => {setStatus(() => status);
                                        
                                        }}
                                        onLoad={() => {video.current.playAsync();}}
                                    />
                                    
                                    </>
                                  )}
                                </View>
                        
                            )}
                        
                          </>
                        
                          );
                        } else {
                              return (
                                <DemoSectionImage
                                  source={require("../../../../assets/gym-workout.png")}
                                  style={styles.DemoSectionImage}
                                />
                              );
                            }
                          })()
                        )
                      }
                    </>

                  </DemoSectionViewImage>
                  <DemoSectionTextView style={styles.DemoSectionTextView}>
                        <FormLabelView style={{width:"100%"}}>
                          <FormLabel style={{marginBottom:5}}>{t('Workout_Setup')}:</FormLabel>
                        </FormLabelView>
                        <DemoSectionExplanationText style={styles.DemoSectionExplanationText}>{workoutArray.wktStp}</DemoSectionExplanationText>
                  </DemoSectionTextView>
                  <DemoSectionTextView style={styles.DemoSectionTextView}>
                        <FormLabelView style={{width:"100%"}}>
                          <FormLabel  style={{marginBottom:5}}>{t('Performing_Workout')}:</FormLabel>
                        </FormLabelView>
                        <DemoSectionExplanationText style={styles.DemoSectionExplanationText}>{workoutArray.pfgWkt}</DemoSectionExplanationText>
                  </DemoSectionTextView>
                </View>
                )}
                </Layout>
              </Tab>
              <Tab title={t('History')}  style={{paddingVertical: 5,paddingHorizontal: 20,borderTopColor:"#000",borderTopWidth:1}}>
                <Layout style={styles.WorkoutNametabContainer}>
                {isHistoryTabVisible && (
                  <ScrollView style={styles.navContainer}>
                  {(Object.keys(workoutWorkedObject).length === 0)?
                    (
                      <View>
                      <DataTable>
                        <DataTableDateTextView>
                          <DataTableDateText>{t('No_History_Found')}</DataTableDateText>
                        </DataTableDateTextView>
                        </DataTable>
                      </View>
                    ):(
                      <>
                      {Object.keys(workoutWorkedObject).map(date => (
                      <View key={date}>
                        <DataTable>
                          <DataTableDateTextView>
                            <DataTableDateText>{t('Date')}: {date}</DataTableDateText>
                          </DataTableDateTextView>
                          
                          {Object.keys(workoutWorkedObject[date]).map(dayKey => 
                          {
                            console.log("workoutWorkedObject?.[date]?.[dayKey]",workoutWorkedObject?.[date]?.[dayKey]);
                          return(
                            <>
                            <DataTableDateTextView>
                              <DataTableDateText>{t('Workout_Name')}: {workoutWorkedObject?.[date]?.[dayKey]?.[0]?.dayNam}</DataTableDateText>
                            </DataTableDateTextView>
                            <DataTable.Header>
                            <DataTableTitleKey><DataTableTitleKeyText>{t('Sets')}</DataTableTitleKeyText></DataTableTitleKey>
                            {workoutArray.exrTyp === 'Cardio' || workoutArray.exrTyp === 'Stability' ? (
                              <DataTableTitleKey><DataTableTitleKeyText>{t('Time')}</DataTableTitleKeyText></DataTableTitleKey>
                            ) : workoutArray.exrTyp === '' ? (
                              <DataTableTitleKey><DataTableTitleKeyText>{t('Loading')}...</DataTableTitleKeyText></DataTableTitleKey>
                            ) : (
                              <>
                              <DataTableTitleKey><DataTableTitleKeyText>{t('Weight')}</DataTableTitleKeyText></DataTableTitleKey>
                            <DataTableTitleKey><DataTableTitleKeyText>{t('Reps')}</DataTableTitleKeyText></DataTableTitleKey>
                              </>
                            )}
                            
                          </DataTable.Header>
                          <FlatList

                            keyExtractor={(item, index) => `${index}-${date}-${item.dayKey}-${item.sets}`}
                            data={workoutWorkedObject[date][dayKey]}
                            scrollEnabled={false}
                            renderItem={({ item }) =>{
                              // console.log('`${item.date}-${item.dayKey}-${item.sets}`',`${item.date}-${item.dayKey}-${item.sets}`);

                              return(
                                <DataTable.Row key={`${item.date}-${item.dayKey}-${item.sets}`}>
                                <DataTableCellKey><DataTableCellKeyText>{parseInt(item.sets, 10)}</DataTableCellKeyText></DataTableCellKey>
                                {workoutArray.exrTyp === 'Cardio' || workoutArray.exrTyp === 'Stability' ? (
                                <DataTableCellValue><DataTableCellValueText>{item.casTim} {t('Seconds')}</DataTableCellValueText></DataTableCellValue>
                                ) : workoutArray.exrTyp === '' ? (
                                <DataTableCellValue><DataTableCellValueText>{t('Loading')}...</DataTableCellValueText></DataTableCellValue>
                                ) : (
                                <>
                                <DataTableCellValue><DataTableCellValueText>{item.weight} {t('Kg')}</DataTableCellValueText></DataTableCellValue>
                                <DataTableCellValue><DataTableCellValueText>{item.reps}</DataTableCellValueText></DataTableCellValue>
                                </>
                                )}
                              </DataTable.Row>
                              );
                            }
                              
                            }
                          />
                          </>
                          );
                          }
                          )
                          }
                        </DataTable>
                      </View>
                    ))}
                    </>
                    )}
                    

                  </ScrollView>
                  )}
                </Layout>
              </Tab>
            </TabView>
          </ScrollView>
      </PageContainer>
  );

};

const styles = {
  WorkoutNametabContainer: {
    width:"100%",
    backgroundColor:"#fff",
    minHeight:400,
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:"100%",
    height:780,
    backgroundColor:"#fff"
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30, // Adjust this based on your play icon size
    marginTop: -30, // Adjust this based on your play icon size
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  DemoSectionImage:{
    width:width-30,
    height: 400,
    borderRadius:10,
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 400,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderNewController: {
    width: '90%',
    marginTop: 15,
},
controlsNewController: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 15,
},
};
