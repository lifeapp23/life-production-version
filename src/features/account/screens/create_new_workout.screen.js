
import React, { useState, useEffect, useCallback  } from 'react';
import { TouchableWithoutFeedback,Dimensions,Text,Modal,StyleSheet,Alert,TextInput,Image,TouchableOpacity,Animated  } from 'react-native'; 
import { ScrollView, RefreshControl,View} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { StackActions } from '@react-navigation/native';
import { Video } from 'expo-av';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
import AWS from 'aws-sdk';
import { Spinner, ProgressBar } from '@ui-kitten/components';
import axios from 'axios';
import * as SQLite from 'expo-sqlite'
import { addEventListener } from "@react-native-community/netinfo";


const database = SQLite.openDatabase('health.db');

import { Camera } from "expo-camera";
import * as VideoThumbnails from 'expo-video-thumbnails';
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
const { width } = Dimensions.get('window');

import { insertWorkouts,updateWorkout} from "../../../../database/workoutsTable";

import {
    Title,
    TitleView,
    InputField,
    FormInput,
    FormLabel,
    PageContainer,
    FormLabelView,
    FormInputView,
    DemoSectionImage,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    PageMainImage,
    ServicesPagesCardHeader,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FilterContainer,
    FilterTextView,
    FilterText,
    ClearFilterTextView,
    ClearFilterText,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,
    ViewOverlay,
    FullSizeButtonView,
    FullButton,
    AsteriskTitle,


  
  } from "../components/account.styles";
import { fetchWorkoutsTable} from "../../../../database/workoutsTable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import { useDate } from './DateContext'; // Import useDate from the context
// Define ExerciseParentView as a memoized component
const newWorkoutsImgDir = FileSystem.documentDirectory + 'images/workouts_thumbnails/';

const ensureNewWorkoutsImgDirExists = async () => {
const dirInfo = await FileSystem.getInfoAsync(newWorkoutsImgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newWorkoutsImgDir, { intermediates: true });
    }
};
const newWorkoutsVideosDir = FileSystem.documentDirectory + 'videos/';

const ensureNewWorkoutsVideosDirExists = async () => {
const dirInfo = await FileSystem.getInfoAsync(newWorkoutsVideosDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newWorkoutsVideosDir, { intermediates: true });
    }
};
export const AddNewEntryWorkoutScreen =({ navigation,route  })=>{
  
  const params = route.params || {};

  const { editedWorkoutEntry = {}, isEditWorkoutMode = false  ,userComeFromExercisePage=false,traineeData={} } = params;
  
  const [workoutArray, setWorkoutArray] = useState({});
  console.log('workoutArray!',workoutArray);

    const [workoutNameAddEntry, setWorkoutNameAddEntry] = useState("");
    const [performingWorkoutAddEntry,setPerformingWorkoutAddEntry] = useState("");
    const [newWorkoutSetupAddEntry,setNewWorkoutSetupAddEntry] = useState("");
    const [userIdNum, setUserIdNum] = useState('');
    const [userDataArray, setUserDataArray] = useState({});
    const {t} = useTranslation();//add this line

    const [triainerConnected,setTriainerConnected] =  useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
      setRefreshing(true);
  
      // Simulate a network request or any async operation
      setTimeout(() => {
        console.log('Data refreshed!');
        setRefreshing(false); // Stop the refreshing animation
      }, 2000); // Simulated delay
    };
    useEffect(() => {
      const unsubscribe = addEventListener(state => {
        //////console.log("Connection type--", state.type);
        //////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);

      });
      
      // Unsubscribe when the component unmounts
      return () => {
        unsubscribe();
    };
  
    }, [refreshing]);
    useFocusEffect(
        React.useCallback(() => {
        

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {
            const storedUser = JSON.parse(user);
            setUserIdNum(storedUser.id);
            setUserDataArray(storedUser);
            ////console.log('exercisessss user',storedUser);
            
           
              
            
            })
            
        });
       
        }, [])
      );
    
    ////////////// Start exerciseType//////////////// 
    const [selectedExerciseTypeNewEntry, setSelectedExerciseTypeNewEntry] = useState("");                       
    const exerciseTypeData = [
    "Compound",
    "Isolation",
    "Cardio",
    "Stability"
    ];
    const renderExerciseTypeOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayExerciseTypeValue = exerciseTypeData[selectedExerciseTypeNewEntry?.row];
    ////////////// End exerciseType//////////////// 

    ////////////// Start newEquipmentsData////////////////
    const [selectedNewEquipments, setSelectedNewEquipments] = useState("");                       
    const newEquipmentsData = [
    'Adjustable Bench',
    'Decline Bench',
    'Inclined Bench',
    'Squat Rack',
    'Flat Bench',
    'Bench Press Rack',
    'Decline Bench Rack',
    'Preacher Bench',
    'Butterfly',
    'Leg Extension',
    'Leg Press',
    'Smith Machine',
    'Cross Over Machine',
    'Bicep Machine',
    'Calves Machine',
    'Reverse Butterfly',
    'Leg Curl',
    'Chest Press',
    'Lat Pulldowns',
    'Cable Machine',
    'Tricep Machine',
    'Abs Machine',
    'Swimming',
    'Tennis',
    'Ping Pong',
    'Elliptical',
    'Exercise Bike',
    'Assault Air Bike',
    'Stair Master',
    'Squash',
    'Running Trac',
    'Martial Arts',
    'Tread mil',
    'Rowing Machine',
    'Assault Runner',
    'Pull-up Machine',
    'Hyper Extension Machine',
    'Parallel Bars'
    ];
    const renderNewEquipmentsOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewEquipmentsValue = newEquipmentsData[selectedNewEquipments?.row];
    ////////////// End newEquipmentsData////////////////

    ////////////// Start newWeightsUsedData////////////////
    const [selectedNewWeightsUsed, setSelectedNewWeightsUsed] = useState("");                       
    const newWeightsUsedData = [
    'dumbbells',
    'EZ barbell',
    'Traps bar',
    'Sand bag',
    'Ab wheel',
    'Exercise ball',
    'Plate',
    'Rings',
    'Jump box',
    'Parallettes',
    'kettle bells',
    'Resistance Band',
    'Weighted Belts',
    'Sled',
    'Bosu Ball',
    'Battle Rope',
    'Rope Climbing',
    'Tires',
    'Straight Bar',
    'Free Weight'
    ];
    const renderNewWeightsUsedOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewWeightsUsedValue = newWeightsUsedData[selectedNewWeightsUsed?.row];
    ////////////// End newWeightsUsedData////////////////
    ////////////// Start MajorMuscleOneData////////////////
    const [selectedNewMajorMuscleOne, setSelectedNewMajorMuscleOne] = useState("");                       
    const newMajorMuscleOneData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMajorMuscleOneOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMajorMuscleOneValue = newMajorMuscleOneData[selectedNewMajorMuscleOne?.row];
    ////////////// End newMajorMuscleOneData////////////////      
    ////////////// Start MajorMuscleTwoData////////////////
    const [selectedNewMajorMuscleTwo, setSelectedNewMajorMuscleTwo] = useState("");                       
    const newMajorMuscleTwoData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMajorMuscleTwoOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMajorMuscleTwoValue = newMajorMuscleTwoData[selectedNewMajorMuscleTwo?.row];
    ////////////// End newMajorMuscleTwoData////////////////
    ////////////// Start MajorMuscleThreeData////////////////
    const [selectedNewMajorMuscleThree, setSelectedNewMajorMuscleThree] = useState("");                       
    const newMajorMuscleThreeData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMajorMuscleThreeOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMajorMuscleThreeValue = newMajorMuscleThreeData[selectedNewMajorMuscleThree?.row];
    ////////////// End newMajorMuscleThreeData////////////////
    ////////////// Start MinorMuscleOneData////////////////
    const [selectedNewMinorMuscleOne, setSelectedNewMinorMuscleOne] = useState("");                       
    const newMinorMuscleOneData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMinorMuscleOneOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMinorMuscleOneValue = newMinorMuscleOneData[selectedNewMinorMuscleOne?.row];
    ////////////// End newMinorMuscleOneData////////////////
    ////////////// Start MinorMuscleTwoData////////////////
    const [selectedNewMinorMuscleTwo, setSelectedNewMinorMuscleTwo] = useState("");                       
    const newMinorMuscleTwoData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMinorMuscleTwoOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMinorMuscleTwoValue = newMinorMuscleTwoData[selectedNewMinorMuscleTwo?.row];
    ////////////// End newMajorMuscleTwoData////////////////
    ////////////// Start MajorMuscleThreeData////////////////
    const [selectedNewMinorMuscleThree, setSelectedNewMinorMuscleThree] = useState("");                       
    const newMinorMuscleThreeData = [
    'Upper Chest',
    'Middle Chest',
    'Lower Chest',
    "Serratus Anterior",
    "Lats",
    "Traps",
    "Rhomboids",
    "Erector Spinae",
    "Rear Delts",
    "Side Delts",
    "Front Delts",
    "Neck",
    
    "Rectus Abdominis",
    "Obliques",
    "Transverse Abdominis",
    
    "Brachialis",
    "Biceps Short Head",
    "Biceps Long Head",
    "Forearm",
    
    "Triceps Long Head",
    "Triceps Short Head",
    "Triceps Medial Head",
    
    "Glutes",
    "Adductors",
    "Quadriceps",
    "Hamstrings",
    "Calves",
    "Hip Flexor",
    "Iliopsoas",
    "Tensor Fasciae Latae",
    "Sartorius"
    ];
    const renderNewMinorMuscleThreeOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    let displayNewMinorMuscleThreeValue = newMinorMuscleThreeData[selectedNewMinorMuscleThree?.row];
    ////////////// End newMinorMuscleThreeData////////////////
    const hideModal = () => setModalVisible(false);
 

    //-------------- images options buttons -------------//
    const [newWorkoutImages,setNewWorkoutImages] = useState('');
    const [newWorkoutVideos,setNewWorkoutVideos] = useState('');
    const [newWorkoutThumbnailImages,setNewWorkoutThumbnailImages] = useState('');
    // console.log('newWorkoutImages live',newWorkoutImages);

   /// data coming from workout name to edit  current workout 
    useEffect(() => {
      //console.log('Route Params:', params);
      
  
      if (editedWorkoutEntry && isEditWorkoutMode) {
        // console.log('editedWorkoutEntry  useffect:', editedWorkoutEntry);
        //console.log('isEditWorkoutMode:', isEditWorkoutMode);
        setWorkoutArray(editedWorkoutEntry);
        setWorkoutNameAddEntry(editedWorkoutEntry?.wktNam);

        const exerciseTypeDataIndex = exerciseTypeData.indexOf(editedWorkoutEntry?.exrTyp);
        setSelectedExerciseTypeNewEntry(exerciseTypeDataIndex !== -1 ? new IndexPath(exerciseTypeDataIndex) : "");

        const newEquipmentsDataIndex = newEquipmentsData.indexOf(editedWorkoutEntry?.eqpUsd);
        setSelectedNewEquipments(newEquipmentsDataIndex !== -1 ? new IndexPath(newEquipmentsDataIndex) : "");


        const newWeightsUsedDataIndex = newWeightsUsedData.indexOf(editedWorkoutEntry?.witUsd);
        setSelectedNewWeightsUsed(newWeightsUsedDataIndex !== -1 ? new IndexPath(newWeightsUsedDataIndex) : "");


        setNewWorkoutSetupAddEntry(editedWorkoutEntry?.wktStp);
        setPerformingWorkoutAddEntry(editedWorkoutEntry?.pfgWkt);


        const newMajorMuscleOneDataIndex = newMajorMuscleOneData.indexOf(editedWorkoutEntry?.mjMsOn);
        //console.log('editedWorkoutEntry?.mjMsOn',editedWorkoutEntry?.mjMsOn);
        //console.log('newMajorMuscleOneDataIndex',newMajorMuscleOneDataIndex);

        setSelectedNewMajorMuscleOne(newMajorMuscleOneDataIndex !== -1 ? new IndexPath(newMajorMuscleOneDataIndex) : "");

        
        const newMajorMuscleTwoDataIndex = newMajorMuscleTwoData.indexOf(editedWorkoutEntry?.mjMsTw);
        setSelectedNewMajorMuscleTwo(newMajorMuscleTwoDataIndex !== -1 ? new IndexPath(newMajorMuscleTwoDataIndex) : "");


        const newMajorMuscleThreeDataIndex = newMajorMuscleThreeData.indexOf(editedWorkoutEntry?.mjMsTr);
        setSelectedNewMajorMuscleThree(newMajorMuscleThreeDataIndex !== -1 ? new IndexPath(newMajorMuscleThreeDataIndex) : "");

        

        const newMinorMuscleOneDataIndex = newMinorMuscleOneData.indexOf(editedWorkoutEntry?.mnMsOn);
        setSelectedNewMinorMuscleOne(newMinorMuscleOneDataIndex !== -1 ? new IndexPath(newMinorMuscleOneDataIndex) : "");

        const newMinorMuscleTwoDataIndex = newMinorMuscleTwoData.indexOf(editedWorkoutEntry?.mnMsTo);
        setSelectedNewMinorMuscleTwo(newMinorMuscleTwoDataIndex !== -1 ? new IndexPath(newMinorMuscleTwoDataIndex) : "");

        const newMinorMuscleThreeDataIndex = newMinorMuscleThreeData.indexOf(editedWorkoutEntry?.mnMsTr);
        setSelectedNewMinorMuscleThree(newMinorMuscleThreeDataIndex !== -1 ? new IndexPath(newMinorMuscleThreeDataIndex) : "");

        
        setNewWorkoutImages(editedWorkoutEntry?.images);
        // console.log('editedWorkoutEntry?.images',editedWorkoutEntry?.images);

        setNewWorkoutThumbnailImages(editedWorkoutEntry?.images);
        // console.log('setNewWorkoutThumbnailImages?.images',editedWorkoutEntry?.images);

        setNewWorkoutVideos(editedWorkoutEntry?.videos);
      } else {
        //console.log('editedWorkoutEntry is', editedWorkoutEntry);
        //console.log('isEditWorkoutMode is', isEditWorkoutMode);
      }
          //isEditWorkoutMode:true,editedWorkoutEntry

    }, [editedWorkoutEntry, isEditWorkoutMode,params]);
    

    const { showActionSheetWithOptions } = useActionSheet();
console.log('userDataArray',userDataArray);
        
    const onPressWorkoutMedia = () => { 
        const cancelButtonIndex = -1;
        if(userDataArray.role == "Trainee"){
            const options = [`${t("Upload_image")}`, `${t("Take_photo")}`];
            showActionSheetWithOptions({
                options,
                cancelButtonIndex,
                }, (selectedIndex) => {
                switch (selectedIndex) {
                case 0:
                pickNewWorkoutImage();
                break;
                case 1:
                // Take photo
                takeNewWorkoutPhoto();
                break;
                case cancelButtonIndex:
                // Canceled
                }});
        }else{
            const options = [`${t("Upload_image")}`, `${t("Take_photo")}`,`${t("Upload_video")}`, `${t("Take_video")}`];
            const disabledButtonIndices = options
            .map((option, index) => {
              if (index === 0 || index === 1) {
                // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
                if (index === 0 && !!newWorkoutImages) return index;
                if (index === 1 && !!newWorkoutImages) return index;
              }else if (index === 2 || index === 3) {
                // Check for newWorkoutImages and newWorkoutVideos to disable Upload options
                if (index === 2 && !!newWorkoutVideos) return index;
                if (index === 3 && !!newWorkoutVideos) return index;
              }
              return -1;
            })
            .filter(index => index !== -1);

            showActionSheetWithOptions({
            options,
            cancelButtonIndex,
            disabledButtonIndices,
            }, (selectedIndex) => {
            switch (selectedIndex) {
            case 0:
            pickNewWorkoutImage();
            break;
            case 1:
            // Take photo
            takeNewWorkoutPhoto();
            break;
            case 2:
            // Upload video
            pickNewWorkoutVideo();
            break;
            case 3:
            // Take video
            takeNewWorkoutVideo();
            break;
            case cancelButtonIndex:
            // Canceled
            }});
        }
    
    };
    const pickNewWorkoutImage = async () => {
    try {
    const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [16, 9],
    quality: 1,
    });

    if (!result.canceled) {
    // Handle the selected image URI
    ////console.log('Selected Image URI:', result.assets[0].uri);
    setNewWorkoutImages(result.assets[0].uri);
    // setNewWorkoutVideos('');
    // Implement your logic to upload the image
    }
    } catch (error) {
    //console.error('Error picking image:', error);
    }
    };

    const takeNewWorkoutPhoto = async () => {
    try {
    const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    aspect: [16, 9],
    quality: 1,
    });

        if (!result.canceled) {
        // Handle the taken photo URI
        ////console.log('Taken Photo URI:', result.assets[0].uri);
        setNewWorkoutImages(result.assets[0].uri);
        // setNewWorkoutVideos('');
        // Implement your logic to upload the photo
        }
    } catch (error) {
    //console.error('Error taking photo:', error);
    }
    };

    const pickNewWorkoutVideo = async () => {
    try {
    const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
    // Handle the selected video URI
    ////console.log('Selected Video URI:', result.assets[0].uri);
    setNewWorkoutVideos(result.assets[0].uri);

      const { uri } = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, {
        time: 5000,
      });
    setNewWorkoutThumbnailImages(uri);

    
    // Implement your logic to upload the video
    }
    } catch (error) {
    //console.error('Error picking video:', error);
    }
    };

    const takeNewWorkoutVideo = async () => {
    try {
    const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
    // Handle the taken video URI
    ////console.log('Taken Video URI:', result.assets[0].uri);
    setNewWorkoutVideos(result.assets[0].uri);
      const { uri } = await VideoThumbnails.getThumbnailAsync(result.assets[0].uri, {
        time: 5000,
      });
      setNewWorkoutThumbnailImages(uri);
    // Implement your logic to upload the video
    
    }
    
    } catch (error) {
    //console.error('Error taking video:', error);
    }
    };

    //--------------------- end images options button -------------/
    //--------- start file systemn save images ---////
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
  const MAX_VIDEO_SIZE_MB = 20;

const getVideoSize = async (videoUri) => {
  const fileInfo = await FileSystem.getInfoAsync(videoUri);
  const fileSizeInBytes = fileInfo.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to megabytes
  return fileSizeInMB;
};
   

  const saveNewWorkoutsImage = async (uri) => {
    await ensureNewWorkoutsImgDirExists();
  
    // Extract file extension from the URI
    const fileExtension = uri.split('.').pop() || 'jpeg';
  
    const filename = new Date().getTime() + `.${fileExtension}`;
    const dest = newWorkoutsImgDir + filename;
  
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  };
  const saveNewWorkoutsVideo = async (uri) => {
    await ensureNewWorkoutsVideosDirExists();
  
    // Extract file extension from the URI
    const fileExtension = uri.split('.').pop() || 'mp4';
  
    const filename = new Date().getTime() + `.${fileExtension}`;
    const dest = newWorkoutsVideosDir + filename;
  
    await FileSystem.copyAsync({ from: uri, to: dest });
    return dest;
  };
    
  
    //--------- end file systemn save images ---////
    //console.log('newWorkoutImages',newWorkoutImages);
    //console.log('newWorkoutVideos----',newWorkoutVideos);
    ////console.log('userIdNum---', userIdNum);
    
    useFocusEffect(
        useCallback(() => {
          const onBeforeRemove = (e) => {
            if(workoutNameAddEntry.toString().trim() || displayExerciseTypeValue || displayNewEquipmentsValue || displayNewWeightsUsedValue || newWorkoutSetupAddEntry || performingWorkoutAddEntry || displayNewMajorMuscleOneValue || displayNewMajorMuscleTwoValue || displayNewMajorMuscleThreeValue || displayNewMinorMuscleOneValue || displayNewMinorMuscleTwoValue || displayNewMinorMuscleThreeValue || newWorkoutImages || newWorkoutVideos ) { 
              e.preventDefault();
      
              Alert.alert(
                '',
                `${t("Are_you_sure_you_want_to_cancel_current_entries")}`,
                [
                  { text: 'Cancel', style: 'cancel', onPress: () => {} },
                  {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => navigation.dispatch(e.data.action),
                  },
                ]
              );
            }
          };
      
          navigation.addListener('beforeRemove', onBeforeRemove);
      
          return () => {
            navigation.removeListener('beforeRemove', onBeforeRemove);
          };
        }, [navigation,
            workoutNameAddEntry,
            displayExerciseTypeValue,
            displayNewEquipmentsValue,
            displayNewWeightsUsedValue,
            newWorkoutSetupAddEntry,
            performingWorkoutAddEntry,
            displayNewMajorMuscleOneValue,
            displayNewMajorMuscleTwoValue,
            displayNewMajorMuscleThreeValue,
            displayNewMinorMuscleOneValue,
            displayNewMinorMuscleTwoValue,
            displayNewMinorMuscleThreeValue,
            newWorkoutImages,
            newWorkoutVideos,])
      );
      
      useEffect(() => {
        const videoSizeAlertFunction = async () => {

        if (isVideoUrl(newWorkoutVideos)) {
          ////console.log('isVideoUrl(newWorkoutVideos)', isVideoUrl(newWorkoutVideos));
        
              const videoSize = await getVideoSize(newWorkoutVideos);
              ////console.log('videoSize', videoSize);
      
              if (videoSize > MAX_VIDEO_SIZE_MB) {
              ////console.log('Selected Video is within size limit:', newWorkoutVideos);
              Alert.alert(`${t('Selected_Video_exceeds_size_limit')}`);
              setNewWorkoutVideos('');
              setNewWorkoutImages('');
              return;
              } 
          
          }
        };
        videoSizeAlertFunction();
      }, [newWorkoutVideos]);

      // const [uploadCount, setUploadCount] = useState(0);
      // const [totalUploads, setTotalUploads] = useState(0);
      const [isUploading, setIsUploading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
      const progressAnimation = useState(new Animated.Value(0))[0];
      
      useEffect(() => {
        const progressPercentage = uploadProgress.current / uploadProgress.total;
        
        // Animate the progress from the current to the new percentage
        Animated.timing(progressAnimation, {
            toValue: progressPercentage,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [uploadProgress, progressAnimation]);
    // Adjust how progressPercentage is calculated to avoid NaN
    const progressPercentage = uploadProgress.total > 0
    ? ((uploadProgress.current / uploadProgress.total) * 100).toFixed(0)
    : 0; // Default to 0% when total is 0
//console.log('aseetoo outside',asseto);
      useEffect(() => {
        console.log('isUploading changed:', isUploading);
        // console.log('uploadCount:', uploadCount, 'totalUploads:', totalUploads);

      }, [isUploading]);
      // useEffect(() => {
      //   const totalItems = [newWorkoutImages, newWorkoutVideos].filter(Boolean).length;
      //   console.log('inside useEffect totalItems', totalItems);

      //   setTotalUploads(totalItems);
      // }, [newWorkoutImages,newWorkoutVideos]);

      const editNewWorkoutEntryHandler = async (workoutArray,workoutNameAddEntry, displayExerciseTypeValue,displayNewEquipmentsValue,displayNewWeightsUsedValue,newWorkoutSetupAddEntry,performingWorkoutAddEntry,displayNewMajorMuscleOneValue,displayNewMajorMuscleTwoValue,displayNewMajorMuscleThreeValue,displayNewMinorMuscleOneValue,displayNewMinorMuscleTwoValue,displayNewMinorMuscleThreeValue,newWorkoutImages,newWorkoutVideos) => {
        if(workoutNameAddEntry?.toString().trim() === '' && !displayExerciseTypeValue  && !displayNewMajorMuscleOneValue){ 
        Alert.alert(`${t('name_Exercise_Type_Major_Muscle_one_are_mandatory')}`); 
        return;
    }
// console.log('newWorkoutImages inside edit function', newWorkoutImages);
if(userDataArray.role == "Trainee"){

        let finalNewWorkoutImages = '';
        let finalNewWorkoutVideos = '';
        if(newWorkoutImages || newWorkoutVideos){
            if (isImageUrl(newWorkoutImages)) {
            ////console.log('isImageUrl(newWorkoutImages))', isImageUrl(newWorkoutImages));
             if(newWorkoutImages?.startsWith('file:///data/user/0/host.exp.exponent/cache/')){
              try {
                const savedNewWorkoutsImage = await saveNewWorkoutsImage(newWorkoutImages);
                // console.log('savedNewWorkoutsImage edit if', savedNewWorkoutsImage);
                finalNewWorkoutImages = savedNewWorkoutsImage;
              } catch (error) {
                  //console.error('Error saving image:', error);
              }
            }else if(newWorkoutImages?.startsWith('file:///data/user/0/host.exp.exponent/files/images/')){
              finalNewWorkoutImages = newWorkoutImages;
              // console.log('finalNewWorkoutImages edit else if', finalNewWorkoutImages);

            }else{
              finalNewWorkoutImages = newWorkoutImages;

            }
            }
            
            // console.log('finalNewWorkoutImages edit after ifs', finalNewWorkoutImages);

            if (isVideoUrl(newWorkoutVideos)) {
            ////console.log('isVideoUrl(newWorkoutVideos)', isVideoUrl(newWorkoutVideos));
            // if(newWorkoutVideos?.startsWith('https://life-pf.com/')){

            // }else if(){

            // }
            if(newWorkoutVideos?.startsWith('file:///data/user/0/host.exp.exponent/cache/')){
              try {
                const videoSize = await getVideoSize(newWorkoutVideos);
                ////console.log('videoSize', videoSize);
        
                if (videoSize <= MAX_VIDEO_SIZE_MB) {
                ////console.log('Selected Video is within size limit:', newWorkoutVideos);
                try {
                    const savedNewWorkoutsVideo = await saveNewWorkoutsVideo(newWorkoutVideos);
                    ////console.log('savedNewWorkoutsVideo', savedNewWorkoutsVideo);
                    finalNewWorkoutVideos = savedNewWorkoutsVideo;
                } catch (error) {
                    //console.error('Error saving video:', error);
                }
                } else {
                Alert.alert(`${t('Selected_Video_exceeds_size_limit')}`);
                return;
                // Handle case where the video size is too large
                }
            } catch (error) {
                //console.error('Error getting video size:', error);
            }
            }else if(newWorkoutVideos?.startsWith('file:///data/user/0/host.exp.exponent/files/videos/')){
              finalNewWorkoutVideos = newWorkoutVideos;

            }else {
              finalNewWorkoutVideos = newWorkoutVideos;

            }
            
            
            } else {
            ////console.log('nothing');
            }
        }
        //console.log('finalNewWorkoutImages', finalNewWorkoutImages);
        //console.log('finalNewWorkoutVideos', finalNewWorkoutVideos);
        ////console.log('userIdNum addNewWorkoutEntryHandler', userIdNum);

        if (workoutNameAddEntry.toString().trim() !== "") {
        const newWorkoutsData = {
        id:workoutArray.id,
        userId:workoutArray.userId,
        speKey:workoutArray.speKey,
        workoutName:workoutNameAddEntry ? workoutNameAddEntry : "",
        exerciseType:displayExerciseTypeValue ? displayExerciseTypeValue : "",
        equipmentUsed:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
        weightsUsed:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
        workoutSetup:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
        performingWorkout:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
        majorMuscleOne:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
        majorMuscleTwo:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
        majorMuscleThree:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
        minorMuscleOne:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
        minorMuscleTwo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
        minorMuscleThree:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
        images:finalNewWorkoutImages ? finalNewWorkoutImages : "",
        videos:finalNewWorkoutVideos ? finalNewWorkoutVideos : "",
        isSync:"no"

        };
        // console.log('update new workout newWorkoutsData',newWorkoutsData);

        updateWorkout(newWorkoutsData).then((result)=>{
            // console.log('result insert user new Workouts into database',result);
            

            //console.log('WorkoutNameAddEntry',workoutNameAddEntry);
            //console.log('displayExerciseTypeValue',displayExerciseTypeValue);
            //console.log('displayNewWeightsUsedValue',displayNewWeightsUsedValue);
            //console.log('newWorkoutSetupAddEntry',newWorkoutSetupAddEntry);
            //console.log('performingWorkoutAddEntry',performingWorkoutAddEntry);
            //console.log('displayNewMajorMuscleOneValue',displayNewMajorMuscleOneValue);
            //console.log('displayNewMajorMuscleTwoValue',displayNewMajorMuscleTwoValue);
            //console.log('displayNewMajorMuscleThreeValue',displayNewMajorMuscleThreeValue);
            //console.log('displayNewMinorMuscleOneValue',displayNewMinorMuscleOneValue);
            //console.log('displayNewMinorMuscleTwoValue',displayNewMinorMuscleTwoValue);
            //console.log('displayNewMinorMuscleThreeValue',displayNewMinorMuscleThreeValue);
            //console.log('newWorkoutImages',newWorkoutImages);
            //console.log('NewWorkoutVideos',newWorkoutVideos);

            Alert.alert(``,
            `${t('Your_New_Workouts_updated_successfully')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  //console.log('result===',result);
                  // navigation.navigate('WorkoutName', { item: result });
                  setWorkoutNameAddEntry('');
                  setSelectedExerciseTypeNewEntry(null);
                  setSelectedNewEquipments(null);
                  setSelectedNewWeightsUsed(null);
                  setNewWorkoutSetupAddEntry("");
                  setPerformingWorkoutAddEntry("");
                  setSelectedNewMajorMuscleOne(null);
                  setSelectedNewMajorMuscleTwo(null);
                  setSelectedNewMajorMuscleThree(null);
                  setSelectedNewMinorMuscleOne(null);
                  setSelectedNewMinorMuscleTwo(null);
                  setSelectedNewMinorMuscleThree(null);
                  setNewWorkoutImages('');
                  setNewWorkoutVideos('');

                  setTimeout(() => {
                    const popToAction = StackActions.replace('WorkoutName', { item: result,userComeFromExercisePage:userComeFromExercisePage,traineeData:traineeData });

                    navigation.dispatch(popToAction);
                    // navigation.popTo('WorkoutName', { item: result,userComeFromExercisePage:userComeFromExercisePage,traineeData:traineeData });

                }, 500); // 0.5 seconds delay

                },
                
              },
            ],
            { cancelable: false }
          );
          }).catch((error) => {
            Alert.alert('Error',
                `${t(error.message)}`);
          });
        ////console.log('add new workout newWorkoutsData',newWorkoutsData);

        }else{
        Alert.alert(`${t('Please_Fill_Workout_name_at_least')}`);
        } 
///////////////////////Trainer///////////////////       
      }else{
        if(triainerConnected){

            let TotalUploadsLet = 0;
            let UploadCountLet = 0;
            if (isImageUrl(newWorkoutImages) &&  isVideoUrl(newWorkoutVideos)){
              // setTotalUploads(4);
              TotalUploadsLet= 4;
              setIsUploading(true);

            }else if (isImageUrl(newWorkoutImages) && isVideoUrl(newWorkoutVideos) == false) {
              // setTotalUploads(2);
              TotalUploadsLet= 2;
              setIsUploading(true);

            }else if (isVideoUrl(newWorkoutVideos) && isImageUrl(newWorkoutImages) == false) {
              // setTotalUploads(2);
              TotalUploadsLet= 2;
              setIsUploading(true);

            }
    console.log('after setIsUploading(true)');
          let finalNewWorkoutImages = {};
          let finalNewWorkoutVideos = {};
          let LocalAndCloudflareimagesObjectFinal = '';
          let LocalAndCloudflareVideosObjectFinal = '';
  
          if(newWorkoutImages || newWorkoutVideos){
              if (isImageUrl(newWorkoutImages)) {
              ////console.log('isImageUrl(newWorkoutImages))', isImageUrl(newWorkoutImages));
               if(newWorkoutImages?.startsWith('file:///data/user/0/host.exp.exponent/cache/')){
                try {
                  const savedNewWorkoutsImage = await saveNewWorkoutsImage(newWorkoutImages);
                  // console.log('savedNewWorkoutsImage edit if', savedNewWorkoutsImage);
                  console.log('savedNewWorkoutsImage', savedNewWorkoutsImage);
  
                  let finalNewWorkoutImagesFirst = savedNewWorkoutsImage;
                  if (finalNewWorkoutImagesFirst) {
                    finalNewWorkoutImages.LocalImageUrl = finalNewWorkoutImagesFirst; // Key-value pair
                    // Increment upload counter
                    // setUploadCount((prev) => prev + 1);
                    UploadCountLet++;
                    setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
          
                  }
                  imageName = finalNewWorkoutImagesFirst.split('workouts_thumbnails/').pop();
                  imageExt = imageName.split('.').pop();   
                  console.log('finalNewWorkoutImagesFirst imageName', imageName);
                  console.log('finalNewWorkoutImagesFirst imageExt', imageExt);
  
                  // Configure AWS S3 for Cloudflare R2
                  const s3 = new AWS.S3({
                    accessKeyId: '44fe6894b7cc3d98780105d2ccfc6e3f', // Cloudflare R2 Access Key
                    secretAccessKey: 'f81c7a9610ab77ad5c4243058ef0313194bb0c9a2da71eb42ace38b56e4b138e', // Cloudflare R2 Secret Key
                    region: 'auto', // Example: 'us-east-1'
                    endpoint: 'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com', // Cloudflare R2 Endpoint
                    s3ForcePathStyle: true, // Required for Cloudflare R2
                });
                  // Read file as a Blob
                  const fileResponse = await fetch(finalNewWorkoutImagesFirst);
                  // console.log('finalNewWorkoutImagesFirst fileResponse', fileResponse);
  
                  const fileBlob = await fileResponse.blob();
                  // console.log('fileBlob size', fileBlob.size);
                  // console.log('fileBlob type', fileBlob.type);
                  const params = {
                      Bucket: 'lifeapp23', // Cloudflare R2 Bucket
                      Key: `images/trainers-workouts/${imageName}`, // Desired path in your bucket
                      Body: fileBlob,
                      ContentType: `image/${imageExt}`, // Static MIME type for images
                      ACL: 'public-read', // Optional: Make publicly accessible
                  };
  
                   // Upload to Cloudflare
                  const uploadResult = await s3.upload(params).promise();
                  const ImageUrlInCloudFlare = uploadResult.Location;
                  // Update UI with the upload result
                  console.log('Upload successful! File URL: ',ImageUrlInCloudFlare);
                  if (ImageUrlInCloudFlare) {
                    finalNewWorkoutImages.CloudFlareImageUrl = ImageUrlInCloudFlare; // Key-value pair
                    // Increment upload counter
                    // setUploadCount((prev) => prev + 1);
                    UploadCountLet++;
                    setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
  
                  }
                  LocalAndCloudflareimagesObjectFinal = Object.keys(finalNewWorkoutImages).length > 0 ? JSON.stringify(finalNewWorkoutImages) : '';
                  console.log('Upload LocalAndCloudflareimagesObjectFinal successful! File URL: ',LocalAndCloudflareimagesObjectFinal);
                  
                } catch (error) {
                    //console.error('Error saving image:', error);
                }
              }
              }else{
                  
                LocalAndCloudflareimagesObjectFinal = newWorkoutImages;
    
                
              }
              
              // console.log('finalNewWorkoutImages edit after ifs', finalNewWorkoutImages);
  
              if (isVideoUrl(newWorkoutVideos)) {
              ////console.log('isVideoUrl(newWorkoutVideos)', isVideoUrl(newWorkoutVideos));
              // if(newWorkoutVideos?.startsWith('https://life-pf.com/')){
  
              // }else if(){
  
              // }
                try {
                  const videoSize = await getVideoSize(newWorkoutVideos);
                  ////console.log('videoSize', videoSize);
          
                  if (videoSize <= MAX_VIDEO_SIZE_MB) {
                  ////console.log('Selected Video is within size limit:', newWorkoutVideos);
                  try {
                    const savedNewWorkoutsVideo = await saveNewWorkoutsVideo(newWorkoutVideos);
                    ////console.log('savedNewWorkoutsVideo', savedNewWorkoutsVideo);
                    // finalNewWorkoutVideos = savedNewWorkoutsVideo;
                    let finalNewWorkoutVideosFirst = savedNewWorkoutsVideo;
                    if (finalNewWorkoutVideosFirst) {
                      finalNewWorkoutVideos.LocalVideUrl = finalNewWorkoutVideosFirst; // Key-value pair
                      // Increment upload counter
                      // setUploadCount((prev) => prev + 1);
                      UploadCountLet++;
                      setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
        
                    }
                    console.log('finalNewWorkoutVideosFirst', finalNewWorkoutVideosFirst);
                    videoName = finalNewWorkoutVideosFirst.split('videos/').pop();
                    videoExt = videoName.split('.').pop();   
                    console.log('finalNewWorkoutVideosFirst videoName', videoName);
                    console.log('finalNewWorkoutVideosFirst videoExt', videoExt);
                
                    // Configure AWS S3 for Cloudflare R2
                    const s3 = new AWS.S3({
                        accessKeyId: '44fe6894b7cc3d98780105d2ccfc6e3f', // Cloudflare R2 Access Key
                        secretAccessKey: 'f81c7a9610ab77ad5c4243058ef0313194bb0c9a2da71eb42ace38b56e4b138e', // Cloudflare R2 Secret Key
                        region: 'auto', // Example: 'us-east-1'
                        endpoint: 'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com', // Cloudflare R2 Endpoint
                        s3ForcePathStyle: true, // Required for Cloudflare R2
                    });
                    // Read file as a Blob
                    const fileResponseVideo = await fetch(finalNewWorkoutVideosFirst);
                    // console.log('finalNewWorkoutVideosFirst fileResponse', fileResponse);
                
                    const fileBlobVideo = await fileResponseVideo.blob();
                    // console.log('fileBlob size', fileBlob.size);
                    // console.log('fileBlob type', fileBlob.type);
                    const paramsVideo = {
                        Bucket: 'lifeapp23', // Cloudflare R2 Bucket
                        Key: `videos/trainers-workouts/${videoName}`, // Desired path in your bucket
                        Body: fileBlobVideo,
                        ContentType: `video/${videoExt}`, // Static MIME type for videos
                        ACL: 'public-read', // Optional: Make publicly accessible
                    };
                    // console.log('finalNewWorkoutVideosFirst params', params);
                
                    // Upload to Cloudflare
                    const uploadResultVideo = await s3.upload(paramsVideo).promise();
                    const videoUrlInCloudFlare = uploadResultVideo.Location;
                    // Update UI with the upload result
                    console.log('Upload videoUrlInCloudFlare successful! File URL: ',videoUrlInCloudFlare);
                    if (videoUrlInCloudFlare) {
                      finalNewWorkoutVideos.CloudFlareVideUrl = videoUrlInCloudFlare; // Key-value pair
                    // Increment upload counter
                    // setUploadCount((prev) => prev + 1);
                    UploadCountLet++;
                    setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
        
                    }
                    LocalAndCloudflareVideosObjectFinal = Object.keys(finalNewWorkoutVideos).length > 0 ? JSON.stringify(finalNewWorkoutVideos) : '';
                    console.log('Upload LocalAndCloudflareVideosObjectFinal successful! File URL: ',LocalAndCloudflareVideosObjectFinal);
                    
                } catch (error) {
                      return;
  
                  }
                  } else {
                  Alert.alert(`${t('Selected_Video_exceeds_size_limit')}`);
                  return;
                  // Handle case where the video size is too large
                  }
              } catch (error) {
                return;
  
              }
              
             
              
              
              } else {
                LocalAndCloudflareVideosObjectFinal = newWorkoutVideos;
              }
          }
          console.log('workoutArray.speKey',workoutArray.speKey);

          if (workoutNameAddEntry.toString().trim() !== "") {
          const newWorkoutsData = {
          id:workoutArray.id,
          userId:workoutArray.userId,
          speKey:workoutArray.speKey,
          workoutName:workoutNameAddEntry ? workoutNameAddEntry : "",
          exerciseType:displayExerciseTypeValue ? displayExerciseTypeValue : "",
          equipmentUsed:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
          weightsUsed:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
          workoutSetup:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
          performingWorkout:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
          majorMuscleOne:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
          majorMuscleTwo:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
          majorMuscleThree:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
          minorMuscleOne:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
          minorMuscleTwo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
          minorMuscleThree:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
          images:LocalAndCloudflareimagesObjectFinal ? LocalAndCloudflareimagesObjectFinal : "",
          videos:LocalAndCloudflareVideosObjectFinal ? LocalAndCloudflareVideosObjectFinal : "",
          isSync:"yes"
  
          };

          const newWorkoutsDataForBackend = {
            userId:workoutArray.userId,
            speKey:workoutArray.speKey,
            wktNam:workoutNameAddEntry ? workoutNameAddEntry : "",
            exrTyp:displayExerciseTypeValue ? displayExerciseTypeValue : "",
            eqpUsd:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
            witUsd:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
            wktStp:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
            pfgWkt:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
            mjMsOn:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
            mjMsTw:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
            mjMsTr:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
            mnMsOn:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
            mnMsTo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
            mnMsTr:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
            images:LocalAndCloudflareimagesObjectFinal ? LocalAndCloudflareimagesObjectFinal : "",
            videos:LocalAndCloudflareVideosObjectFinal ? LocalAndCloudflareVideosObjectFinal : "",
            isSync:"yes"
    
            };
          console.log('update new workout newWorkoutsData',newWorkoutsData);
          setIsUploading(false);

          ///////////////start update local function/////////////
          updateWorkout(newWorkoutsData).then((result)=>{
              // console.log('result insert user new Workouts into database',result);
              
  
              //console.log('WorkoutNameAddEntry',workoutNameAddEntry);
              //console.log('displayExerciseTypeValue',displayExerciseTypeValue);
              //console.log('displayNewWeightsUsedValue',displayNewWeightsUsedValue);
              //console.log('newWorkoutSetupAddEntry',newWorkoutSetupAddEntry);
              //console.log('performingWorkoutAddEntry',performingWorkoutAddEntry);
              //console.log('displayNewMajorMuscleOneValue',displayNewMajorMuscleOneValue);
              //console.log('displayNewMajorMuscleTwoValue',displayNewMajorMuscleTwoValue);
              //console.log('displayNewMajorMuscleThreeValue',displayNewMajorMuscleThreeValue);
              //console.log('displayNewMinorMuscleOneValue',displayNewMinorMuscleOneValue);
              //console.log('displayNewMinorMuscleTwoValue',displayNewMinorMuscleTwoValue);
              //console.log('displayNewMinorMuscleThreeValue',displayNewMinorMuscleThreeValue);
              //console.log('newWorkoutImages',newWorkoutImages);
              //console.log('NewWorkoutVideos',newWorkoutVideos);
  
              
            }).catch((error) => {
              setIsUploading(false);
              Alert.alert('Error',
                  `${t(error.message)}`);
              return;
 
            });

            axios.post(`https://life-pf.com/api/workouts-insert-data-without-media`, newWorkoutsDataForBackend)
            .then((response) => {
              const result = response?.data?.["updatedRow"];
              console.log('result response?.data?.["updatedRow"]',result);
              if(UploadCountLet == TotalUploadsLet ){
                const timer = setTimeout(() => {
                  // setTotalUploads(0);
                  // setUploadCount(0);
                  setIsUploading(false);
                  setUploadProgress({ current: 0, total: 0 });
                }, 500); // 3 seconds
                const timerAlert = setTimeout(() => {
    
                  Alert.alert(``,
                    `${t('Your_New_Workouts_updated_successfully')}`,
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          //console.log('result===',result);
                          // navigation.navigate('WorkoutName', { item: result });
                          setWorkoutNameAddEntry('');
                          setSelectedExerciseTypeNewEntry(null);
                          setSelectedNewEquipments(null);
                          setSelectedNewWeightsUsed(null);
                          setNewWorkoutSetupAddEntry("");
                          setPerformingWorkoutAddEntry("");
                          setSelectedNewMajorMuscleOne(null);
                          setSelectedNewMajorMuscleTwo(null);
                          setSelectedNewMajorMuscleThree(null);
                          setSelectedNewMinorMuscleOne(null);
                          setSelectedNewMinorMuscleTwo(null);
                          setSelectedNewMinorMuscleThree(null);
                          setNewWorkoutImages('');
                          setNewWorkoutVideos('');
        
                          setTimeout(() => {
                            const popToAction = StackActions.replace('WorkoutName', { item: result,userComeFromExercisePage:userComeFromExercisePage,traineeData:traineeData });
        
                            navigation.dispatch(popToAction);
                            // navigation.popTo('WorkoutName', { item: result,userComeFromExercisePage:userComeFromExercisePage,traineeData:traineeData });
        
                        }, 500); // 0.5 seconds delay
        
                        },
                        
                      },
                    ],
                    { cancelable: false }
                  );
              },700); // 3 seconds
    
              }
      
            }).catch(error => {
                // Handle error
                if(UploadCountLet == TotalUploadsLet ){
                  const timer = setTimeout(() => {
                    // setTotalUploads(0);
                    // setUploadCount(0);
                    setIsUploading(false);
                    setUploadProgress({ current: 0, total: 0 });
                  }, 500); // 0.5 seconds
                  
        
                }
                const timer = setTimeout(() => {
                  Alert.alert(``,`${t(error?.response?.data?.message)}`);
    
                }, 700); // 0.7 seconds
    
              });
          //console.log('add new workout newWorkoutsData',newWorkoutsData);
  
          ///////////////end update local function/////////////
  
          }else{
          Alert.alert(`${t('Please_Fill_Workout_name_at_least')}`);
          } 
        }else{
          Alert.alert(``,
          `${t('You_must_be_connected_to_the_internet')}`);
  
         }
      }
      
      };




    const addNewWorkoutEntryHandler = async () => {
      // let totalUploads = 0;

      if(userDataArray.role == "Trainee"){
        /////////////Trainee///////////////
        if(workoutNameAddEntry?.toString().trim() === '' && !displayExerciseTypeValue  && !displayNewMajorMuscleOneValue){ 
        Alert.alert(`${t('name_Exercise_Type_Major_Muscle_one_are_mandatory')}`); 
        return;
          }
        let finalNewWorkoutImages = '';
        let finalNewWorkoutVideos = '';
        if(newWorkoutImages || newWorkoutVideos){
            if (isImageUrl(newWorkoutImages)) {
            ////console.log('isImageUrl(newWorkoutImages))', isImageUrl(newWorkoutImages));
            try {
                const savedNewWorkoutsImage = await saveNewWorkoutsImage(newWorkoutImages);
                ////console.log('savedNewWorkoutsImage', savedNewWorkoutsImage);
                finalNewWorkoutImages = savedNewWorkoutsImage;
            } catch (error) {
                //console.error('Error saving image:', error);
            }
            }
            if (isVideoUrl(newWorkoutVideos)) {
            ////console.log('isVideoUrl(newWorkoutVideos)', isVideoUrl(newWorkoutVideos));
            try {
                const videoSize = await getVideoSize(newWorkoutVideos);
                ////console.log('videoSize', videoSize);
        
                if (videoSize <= MAX_VIDEO_SIZE_MB) {
                ////console.log('Selected Video is within size limit:', newWorkoutVideos);
                try {
                    const savedNewWorkoutsVideo = await saveNewWorkoutsVideo(newWorkoutVideos);
                    ////console.log('savedNewWorkoutsVideo', savedNewWorkoutsVideo);
                    finalNewWorkoutVideos = savedNewWorkoutsVideo;
                } catch (error) {
                    //console.error('Error saving video:', error);
                }
                } else {
                Alert.alert(`${t('Selected_Video_exceeds_size_limit')}`);
                return;
                // Handle case where the video size is too large
                }
            } catch (error) {
                //console.error('Error getting video size:', error);
            }
            } else {
            ////console.log('nothing');
            }
        }
        //console.log('finalNewWorkoutImages', finalNewWorkoutImages);
        //console.log('finalNewWorkoutVideos', finalNewWorkoutVideos);

        ////console.log('userIdNum addNewWorkoutEntryHandler', userIdNum);

        if (workoutNameAddEntry.toString().trim() !== "") {
        const newWorkoutsData = {
        userId:userIdNum,
        speKey:userIdNum +'.' + new Date().getTime(),
        workoutName:workoutNameAddEntry ? workoutNameAddEntry : "",
        exerciseType:displayExerciseTypeValue ? displayExerciseTypeValue : "",
        equipmentUsed:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
        weightsUsed:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
        workoutSetup:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
        performingWorkout:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
        majorMuscleOne:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
        majorMuscleTwo:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
        majorMuscleThree:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
        minorMuscleOne:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
        minorMuscleTwo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
        minorMuscleThree:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
        images:finalNewWorkoutImages ? finalNewWorkoutImages : "",
        videos:finalNewWorkoutVideos ? finalNewWorkoutVideos : "",
        isSync:"no"
        };
        
        insertWorkouts(newWorkoutsData).then((result)=>{
            ////console.log('result insert user new Workouts into database',result);
           
            //console.log('WorkoutNameAddEntry',workoutNameAddEntry);
            //console.log('displayExerciseTypeValue',displayExerciseTypeValue);
            //console.log('displayNewWeightsUsedValue',displayNewWeightsUsedValue);
            //console.log('newWorkoutSetupAddEntry',newWorkoutSetupAddEntry);
            //console.log('performingWorkoutAddEntry',performingWorkoutAddEntry);
            //console.log('displayNewMajorMuscleOneValue',displayNewMajorMuscleOneValue);
            //console.log('displayNewMajorMuscleTwoValue',displayNewMajorMuscleTwoValue);
            //console.log('displayNewMajorMuscleThreeValue',displayNewMajorMuscleThreeValue);
            //console.log('displayNewMinorMuscleOneValue',displayNewMinorMuscleOneValue);
            //console.log('displayNewMinorMuscleTwoValue',displayNewMinorMuscleTwoValue);
            //console.log('displayNewMinorMuscleThreeValue',displayNewMinorMuscleThreeValue);
            //console.log('newWorkoutImages',newWorkoutImages);
            //console.log('NewWorkoutVideos',newWorkoutVideos);

            Alert.alert(``,
            `${t('Your_New_Workouts_added_successfully')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                 
                    setWorkoutNameAddEntry('');
                    setSelectedExerciseTypeNewEntry(null);
                    setSelectedNewEquipments(null);
                    setSelectedNewWeightsUsed(null);
                    setNewWorkoutSetupAddEntry("");
                    setPerformingWorkoutAddEntry("");
                    setSelectedNewMajorMuscleOne(null);
                    setSelectedNewMajorMuscleTwo(null);
                    setSelectedNewMajorMuscleThree(null);
                    setSelectedNewMinorMuscleOne(null);
                    setSelectedNewMinorMuscleTwo(null);
                    setSelectedNewMinorMuscleThree(null);
                    setNewWorkoutImages('');
                    setNewWorkoutVideos('');
                    setTimeout(() => {

                    navigation.dispatch(StackActions.pop(1));
                  }, 500); // 0.5 second delay
                },
              },
            ],
            { cancelable: false }
          );
          }).catch((error) => {
            Alert.alert('Error',
                `${t(error.message)}`);
          });
        ////console.log('add new workout newWorkoutsData',newWorkoutsData);

        }else{
        Alert.alert(`${t('Please_Fill_Workout_name_at_least')}`);
        }  
    }else{
      if(triainerConnected){
      /////////////Trainer///////////////
      let TotalUploadsLet = 0;
      let UploadCountLet = 0;
      if(workoutNameAddEntry?.toString().trim() === '' && !displayExerciseTypeValue  && !displayNewMajorMuscleOneValue){ 
        Alert.alert(`${t('name_Exercise_Type_Major_Muscle_one_are_mandatory')}`); 
        return;
        
          }
      const checkIFworkoutinLocalDatabase = async () => {

        const promise = new Promise((resolve, reject) => {
          database.transaction((tx) => {
            tx.executeSql(
              `SELECT * FROM workouts WHERE userId = ? AND wktNam = ?`,
              [userIdNum,workoutNameAddEntry],
              (_, selectResult) => {
                if (selectResult.rows.length > 0) {
                  // Workout with the same name exists for this user
                  Alert.alert(`${t('The_workout_name_is_already_in_the_database')}`); 
                  return;
                } else{
                    const insertWorkoutintoLocalDatabaseAndOnlineDatabase = async () => {
                              if (isImageUrl(newWorkoutImages) &&  isVideoUrl(newWorkoutVideos)){
                                // setTotalUploads(4);
                                TotalUploadsLet= 4;
                              }else if (isImageUrl(newWorkoutImages) && isVideoUrl(newWorkoutVideos) == false) {
                                // setTotalUploads(2);
                                TotalUploadsLet= 2;
                    
                              }else if (isVideoUrl(newWorkoutVideos) && isImageUrl(newWorkoutImages) == false) {
                                // setTotalUploads(2);
                                TotalUploadsLet= 2;
                    
                              }
                              setIsUploading(true);
                              console.log('after setIsUploading(true)');
                    
                            let finalNewWorkoutImages = {};
                            let finalNewWorkoutVideos = {};
                            let LocalAndCloudflareimagesObjectFinal = '';
                            let LocalAndCloudflareVideosObjectFinal = '';
                    
                            if(newWorkoutImages || newWorkoutVideos){
                                if (isImageUrl(newWorkoutImages)) {
                                ////console.log('isImageUrl(newWorkoutImages))', isImageUrl(newWorkoutImages));
                                try {
                                    const savedNewWorkoutsImage = await saveNewWorkoutsImage(newWorkoutImages);
                                    console.log('savedNewWorkoutsImage', savedNewWorkoutsImage);
                                    let finalNewWorkoutImagesFirst = savedNewWorkoutsImage;
                                    if (finalNewWorkoutImagesFirst) {
                                      finalNewWorkoutImages.LocalImageUrl = finalNewWorkoutImagesFirst; // Key-value pair
                                      // Increment upload counter
                                      // setUploadCount((prev) => prev + 1);
                                      UploadCountLet++;
                                      setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
                    
                                    }
                                    imageName = finalNewWorkoutImagesFirst.split('workouts_thumbnails/').pop();
                                    imageExt = imageName.split('.').pop();   
                                    console.log('finalNewWorkoutImagesFirst imageName', imageName);
                                    console.log('finalNewWorkoutImagesFirst imageExt', imageExt);
                    
                                  // Configure AWS S3 for Cloudflare R2
                                const s3 = new AWS.S3({
                                  accessKeyId: '44fe6894b7cc3d98780105d2ccfc6e3f', // Cloudflare R2 Access Key
                                  secretAccessKey: 'f81c7a9610ab77ad5c4243058ef0313194bb0c9a2da71eb42ace38b56e4b138e', // Cloudflare R2 Secret Key
                                  region: 'auto', // Example: 'us-east-1'
                                  endpoint: 'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com', // Cloudflare R2 Endpoint
                                  s3ForcePathStyle: true, // Required for Cloudflare R2
                              });
                                  // Read file as a Blob
                                  const fileResponse = await fetch(finalNewWorkoutImagesFirst);
                                  // console.log('finalNewWorkoutImagesFirst fileResponse', fileResponse);
                    
                                  const fileBlob = await fileResponse.blob();
                                  // console.log('fileBlob size', fileBlob.size);
                                  // console.log('fileBlob type', fileBlob.type);
                                  const params = {
                                      Bucket: 'lifeapp23', // Cloudflare R2 Bucket
                                      Key: `images/trainers-workouts/${imageName}`, // Desired path in your bucket
                                      Body: fileBlob,
                                      ContentType: `image/${imageExt}`, // Static MIME type for images
                                      ACL: 'public-read', // Optional: Make publicly accessible
                                  };
                                  // console.log('finalNewWorkoutImagesFirst params', params);
                    
                                  // Upload to Cloudflare
                                const uploadResult = await s3.upload(params).promise();
                                const ImageUrlInCloudFlare = uploadResult.Location;
                                // Update UI with the upload result
                                console.log('Upload successful! File URL: ',ImageUrlInCloudFlare);
                                if (ImageUrlInCloudFlare) {
                                  finalNewWorkoutImages.CloudFlareImageUrl = ImageUrlInCloudFlare; // Key-value pair
                                  // Increment upload counter
                                  // setUploadCount((prev) => prev + 1);
                                  UploadCountLet++;
                                  setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
                    
                                }
                                LocalAndCloudflareimagesObjectFinal = Object.keys(finalNewWorkoutImages).length > 0 ? JSON.stringify(finalNewWorkoutImages) : '';
                                console.log('Upload LocalAndCloudflareimagesObjectFinal successful! File URL: ',LocalAndCloudflareimagesObjectFinal);
                                
                                } catch (error) {
                                    //console.error('Error saving image:', error);
                                }
                                }
                                if (isVideoUrl(newWorkoutVideos)) {
                                ////console.log('isVideoUrl(newWorkoutVideos)', isVideoUrl(newWorkoutVideos));
                                try {
                                    const videoSize = await getVideoSize(newWorkoutVideos);
                                    ////console.log('videoSize', videoSize);
                            
                                    if (videoSize <= MAX_VIDEO_SIZE_MB) {
                                    ////console.log('Selected Video is within size limit:', newWorkoutVideos);
                                    try {
                                        const savedNewWorkoutsVideo = await saveNewWorkoutsVideo(newWorkoutVideos);
                                        ////console.log('savedNewWorkoutsVideo', savedNewWorkoutsVideo);
                                        // finalNewWorkoutVideos = savedNewWorkoutsVideo;
                                        let finalNewWorkoutVideosFirst = savedNewWorkoutsVideo;
                                        if (finalNewWorkoutVideosFirst) {
                                          finalNewWorkoutVideos.LocalVideUrl = finalNewWorkoutVideosFirst; // Key-value pair
                                          // Increment upload counter
                                          // setUploadCount((prev) => prev + 1);
                                          UploadCountLet++;
                                          setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
                    
                                        }
                                        console.log('finalNewWorkoutVideosFirst', finalNewWorkoutVideosFirst);
                                        videoName = finalNewWorkoutVideosFirst.split('videos/').pop();
                                        videoExt = videoName.split('.').pop();   
                                        console.log('finalNewWorkoutVideosFirst videoName', videoName);
                                        console.log('finalNewWorkoutVideosFirst videoExt', videoExt);
                                    
                                        // Configure AWS S3 for Cloudflare R2
                                        const s3 = new AWS.S3({
                                            accessKeyId: '44fe6894b7cc3d98780105d2ccfc6e3f', // Cloudflare R2 Access Key
                                            secretAccessKey: 'f81c7a9610ab77ad5c4243058ef0313194bb0c9a2da71eb42ace38b56e4b138e', // Cloudflare R2 Secret Key
                                            region: 'auto', // Example: 'us-east-1'
                                            endpoint: 'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com', // Cloudflare R2 Endpoint
                                            s3ForcePathStyle: true, // Required for Cloudflare R2
                                        });
                                        // Read file as a Blob
                                        const fileResponseVideo = await fetch(finalNewWorkoutVideosFirst);
                                        // console.log('finalNewWorkoutVideosFirst fileResponse', fileResponse);
                                    
                                        const fileBlobVideo = await fileResponseVideo.blob();
                                        // console.log('fileBlob size', fileBlob.size);
                                        // console.log('fileBlob type', fileBlob.type);
                                        const paramsVideo = {
                                            Bucket: 'lifeapp23', // Cloudflare R2 Bucket
                                            Key: `videos/trainers-workouts/${videoName}`, // Desired path in your bucket
                                            Body: fileBlobVideo,
                                            ContentType: `video/${videoExt}`, // Static MIME type for videos
                                            ACL: 'public-read', // Optional: Make publicly accessible
                                        };
                                        // console.log('finalNewWorkoutVideosFirst params', params);
                                    
                                        // Upload to Cloudflare
                                        const uploadResultVideo = await s3.upload(paramsVideo).promise();
                                        const videoUrlInCloudFlare = uploadResultVideo.Location;
                                        // Update UI with the upload result
                                        console.log('Upload videoUrlInCloudFlare successful! File URL: ',videoUrlInCloudFlare);
                                        if (videoUrlInCloudFlare) {
                                          finalNewWorkoutVideos.CloudFlareVideUrl = videoUrlInCloudFlare; // Key-value pair
                                        // Increment upload counter
                                        // setUploadCount((prev) => prev + 1);
                                        UploadCountLet++;
                                        setUploadProgress({ current: UploadCountLet, total: TotalUploadsLet });
                    
                                        }
                                        LocalAndCloudflareVideosObjectFinal = Object.keys(finalNewWorkoutVideos).length > 0 ? JSON.stringify(finalNewWorkoutVideos) : '';
                                        console.log('Upload LocalAndCloudflareVideosObjectFinal successful! File URL: ',LocalAndCloudflareVideosObjectFinal);
                                        
                                    } catch (error) {
                                      console.error('Error saving video');
                                        return;
                    
                                    }
                                    } else {
                                    Alert.alert(`${t('Selected_Video_exceeds_size_limit')}`);
                                    return;
                                    // Handle case where the video size is too large
                                    }
                                } catch (error) {
                                    //console.error('Error getting video size:', error);
                                    return;
                    
                                }
                                } else {
                                ////console.log('nothing');
                                // return;
                    
                                }
                            }
                            //console.log('finalNewWorkoutImages', finalNewWorkoutImages);
                            //console.log('finalNewWorkoutVideos', finalNewWorkoutVideos);
                    
                            ////console.log('userIdNum addNewWorkoutEntryHandler', userIdNum);
                            const speKeyForBoth = userIdNum +'.' + new Date().getTime();
                            if (workoutNameAddEntry.toString().trim() !== "") {
                            const newWorkoutsData = {
                            userId:userIdNum,
                            speKey:speKeyForBoth,
                            workoutName:workoutNameAddEntry ? workoutNameAddEntry : "",
                            exerciseType:displayExerciseTypeValue ? displayExerciseTypeValue : "",
                            equipmentUsed:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
                            weightsUsed:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
                            workoutSetup:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
                            performingWorkout:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
                            majorMuscleOne:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
                            majorMuscleTwo:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
                            majorMuscleThree:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
                            minorMuscleOne:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
                            minorMuscleTwo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
                            minorMuscleThree:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
                            images:LocalAndCloudflareimagesObjectFinal ? LocalAndCloudflareimagesObjectFinal : "",
                            videos:LocalAndCloudflareVideosObjectFinal ? LocalAndCloudflareVideosObjectFinal : "",
                            isSync:"yes"
                            };
                          console.log('userIdNum newWorkoutsData', newWorkoutsData);
                          
                          const newWorkoutsDataForBackend = {
                            userId:userIdNum,
                            speKey:speKeyForBoth,
                            wktNam:workoutNameAddEntry ? workoutNameAddEntry : "",
                            exrTyp:displayExerciseTypeValue ? displayExerciseTypeValue : "",
                            eqpUsd:displayNewEquipmentsValue ? displayNewEquipmentsValue : "",
                            witUsd:displayNewWeightsUsedValue ? displayNewWeightsUsedValue : "",
                            wktStp:newWorkoutSetupAddEntry ? newWorkoutSetupAddEntry : "",
                            pfgWkt:performingWorkoutAddEntry ? performingWorkoutAddEntry : "",
                            mjMsOn:displayNewMajorMuscleOneValue ? displayNewMajorMuscleOneValue : "",
                            mjMsTw:displayNewMajorMuscleTwoValue ? displayNewMajorMuscleTwoValue : "",
                            mjMsTr:displayNewMajorMuscleThreeValue ? displayNewMajorMuscleThreeValue : "",
                            mnMsOn:displayNewMinorMuscleOneValue ? displayNewMinorMuscleOneValue : "",
                            mnMsTo:displayNewMinorMuscleTwoValue ? displayNewMinorMuscleTwoValue : "",
                            mnMsTr:displayNewMinorMuscleThreeValue ? displayNewMinorMuscleThreeValue : "",
                            images:LocalAndCloudflareimagesObjectFinal ? LocalAndCloudflareimagesObjectFinal : "",
                            videos:LocalAndCloudflareVideosObjectFinal ? LocalAndCloudflareVideosObjectFinal : "",
                            isSync:"yes"
                            };
                            
                            insertWorkouts(newWorkoutsData).then((result)=>{
                                ////console.log('result insert user new Workouts into database',result);
                              
                                //console.log('WorkoutNameAddEntry',workoutNameAddEntry);
                                //console.log('displayExerciseTypeValue',displayExerciseTypeValue);
                                //console.log('displayNewWeightsUsedValue',displayNewWeightsUsedValue);
                                //console.log('newWorkoutSetupAddEntry',newWorkoutSetupAddEntry);
                                //console.log('performingWorkoutAddEntry',performingWorkoutAddEntry);
                                //console.log('displayNewMajorMuscleOneValue',displayNewMajorMuscleOneValue);
                                //console.log('displayNewMajorMuscleTwoValue',displayNewMajorMuscleTwoValue);
                                //console.log('displayNewMajorMuscleThreeValue',displayNewMajorMuscleThreeValue);
                                //console.log('displayNewMinorMuscleOneValue',displayNewMinorMuscleOneValue);
                                //console.log('displayNewMinorMuscleTwoValue',displayNewMinorMuscleTwoValue);
                                //console.log('displayNewMinorMuscleThreeValue',displayNewMinorMuscleThreeValue);
                                //console.log('newWorkoutImages',newWorkoutImages);
                                //console.log('NewWorkoutVideos',newWorkoutVideos);
                    
                              
                              }).catch((error) => {
                                setIsUploading(false);
                    
                                Alert.alert('Error',
                                    `${t(error.message)}`);
                                return;
                    
                              });
                            ////console.log('add new workout newWorkoutsData',newWorkoutsData);
                            axios.post(`https://life-pf.com/api/workouts-insert-data-without-media`, newWorkoutsDataForBackend)
                            .then((response) => {
                              if(UploadCountLet == TotalUploadsLet ){
                                const timer = setTimeout(() => {
                                  // setTotalUploads(0);
                                  // setUploadCount(0);
                                  setIsUploading(false);
                                  setUploadProgress({ current: 0, total: 0 });
                                }, 500); // 3 seconds
                                const timerAlert = setTimeout(() => {
                    
                                Alert.alert(``,
                                  `${t('Your_New_Workouts_added_successfully')}`,
                                  [
                                    {
                                      text: 'OK',
                                      onPress: () => {
                                      
                                          setWorkoutNameAddEntry('');
                                          setSelectedExerciseTypeNewEntry(null);
                                          setSelectedNewEquipments(null);
                                          setSelectedNewWeightsUsed(null);
                                          setNewWorkoutSetupAddEntry("");
                                          setPerformingWorkoutAddEntry("");
                                          setSelectedNewMajorMuscleOne(null);
                                          setSelectedNewMajorMuscleTwo(null);
                                          setSelectedNewMajorMuscleThree(null);
                                          setSelectedNewMinorMuscleOne(null);
                                          setSelectedNewMinorMuscleTwo(null);
                                          setSelectedNewMinorMuscleThree(null);
                                          setNewWorkoutImages('');
                                          setNewWorkoutVideos('');
                                          setTimeout(() => {
                      
                                          navigation.dispatch(StackActions.pop(1));
                                        }, 500); // 0.5 second delay
                                      },
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              },700); // 3 seconds
                    
                              }
                      
                            }).catch(error => {
                                // Handle error
                                if(UploadCountLet == TotalUploadsLet ){
                                  const timer = setTimeout(() => {
                                    // setTotalUploads(0);
                                    // setUploadCount(0);
                                    setIsUploading(false);
                                    setUploadProgress({ current: 0, total: 0 });
                                  }, 500); // 0.5 seconds
                                  
                        
                                }
                                const timer = setTimeout(() => {
                                  Alert.alert(``,`${t(error?.response?.data?.message)}`);
                    
                                }, 700); // 0.7 seconds
                    
                              });
                    
                            }else{
                            Alert.alert(`${t('Please_Fill_Workout_name_at_least')}`);
                            }  
                    };
                    insertWorkoutintoLocalDatabaseAndOnlineDatabase();
                }
                
              },
              (_, selectError) => {
                // Error occurred while checking for existing record
                console.log('Error checking for existing workout:', selectError);
                // reject(selectError);
              }
            );
          });
        });
        
        return promise;
        };
        checkIFworkoutinLocalDatabase();
      }else{
        Alert.alert(``,
        `${t('You_must_be_connected_to_the_internet')}`);

       }


    }
      };
const [isImageFullScreenVisible, setImageFullScreenVisible] = useState(false);
  const handleImagePress = () => {
    setImageFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setImageFullScreenVisible(false);
  };
  //zoom video playing
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const [isVideoFullScreenVisible, setVideoFullScreenVisible] = useState(false);
  const handleVideoImagePress = () => {
    setVideoFullScreenVisible(true);
  };

  const handleCloseVideoFullScreen = () => {
    // if (video?.current) {
    //   //await video?.current?.pauseAsync();
    //   // Optionally, you can also stop the video
    //    //await video?.current?.stopAsync();
       
    // }
    // Pause the video after the modal is closed
    setVideoFullScreenVisible(false);
    setTimeout(() => {
      if (video?.current) {
        if (status?.isPlaying === true){
          video?.current?.pauseAsync();
        }
      }
    }, 0);
    
  };
  
  const handleRemoveSmallVideo = () => {
    setNewWorkoutVideos('');
      
    setNewWorkoutThumbnailImages('');
  }
  const handleRemoveSmallImage = () => {
    setNewWorkoutImages('');
  }

console.log('newWorkoutImages',newWorkoutImages);
    return (
    <PageContainer  refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
    <ScrollView >
    <TitleView >
    <Title >Life</Title>
    </TitleView>
    <Modal animationType="fade" transparent={true} visible={isUploading}>
          <TouchableWithoutFeedback onPress={() => Alert.alert('', `${t('Do_you_want_to_close_the_loading_screen')}`, [
                    { text: `${t('Cancel')}`, style: 'cancel' },
                    { text: `${t('Yes')}`, onPress: () => {
                      setIsUploading(false);
                      setUploadProgress({ current: 0, total: 0 });

                    }},
                  ])}>
            <View style={styles.uploadModalContainer}>
            <TouchableWithoutFeedback>

                <View style={styles.uploadLoadingBox}>
                    <Text style={styles.uploadLoadingText}>Uploading workout</Text>

                    {/* Progress Bar Container */}
                    <View style={styles.uploadProgressBarContainer}>
                        <Animated.View
                            style={[
                                styles.uploadProgressBar,
                                { width: `${progressPercentage}%` }, // Animate width based on progress
                            ]}
                        />
                    </View>

                    {/* Display the percentage and file count */}
                    <Text style={styles.uploadPercentageText}>{progressPercentage}%</Text>
                    <Text style={styles.uploadProgressDetailsText}>
                        {`Uploading ${uploadProgress.current} ${t("of_one")} ${uploadProgress.total}`}
                    </Text>
                </View>
            </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>

      </Modal>
      
    {(newWorkoutImages)?(
      <ServicesPagesCardCover>
            
            {(isEditWorkoutMode)?(
              <>
              {userDataArray?.role === "Trainee" ? (
                <PageMainImage
                    source={
                      newWorkoutImages?.startsWith('../../../../assets/images')
                          ? (workoutArray?.wrkKey != undefined
                              ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                              : mainWorkoutsData[workoutArray?.id - 1]?.images
                            )
                          : newWorkoutImages?.startsWith('file:///data/user')
                          ? { uri: `${newWorkoutImages}` }
                          : require('../../../../assets/gym-workout.png')
                      }   
                      resizeMode="stretch" // Ensures the entire image is displayed

                  />
              ) : isImageUrl(newWorkoutImages) ? (
                <PageMainImage
                  source={
                    newWorkoutImages?.startsWith('../../../../assets/images')
                        ? (workoutArray?.wrkKey != undefined
                            ? mainWorkoutsData[workoutArray?.wrkKey - 1]?.images
                            : mainWorkoutsData[workoutArray?.id - 1]?.images
                          )
                        : newWorkoutImages?.startsWith('file:///data/user')
                        ? { uri: `${newWorkoutImages}` }
                        : require('../../../../assets/gym-workout.png')
                    }   
                    resizeMode="stretch" // Ensures the entire image is displayed

                />
              ) : (newWorkoutImages == "") ? (
                <PageMainImage
                      source={require("../../../../assets/gym-workout.png")}
                      resizeMode="stretch" // Ensures the entire image is displayed
                    />
              ) : (
              (() => {
                let parsedData;
                try {
                  // Parse newWorkoutImages
                  parsedData = JSON.parse(newWorkoutImages);
                  console.log("parsedData-------:", parsedData);

                } catch (error) {
                  console.error("Failed to parse newWorkoutImages:", error);
                  parsedData = null;
                }
                console.log("parsedData?.CloudFlareImageUrl-------:", parsedData?.CloudFlareImageUrl);

                // Use parsed data to determine which image to display
                if (parsedData?.CloudFlareImageUrl) {
                  // Use CloudFlareImageUrl if it exists
                  return (
                    <PageMainImage
                        source={{
                                uri: parsedData.CloudFlareImageUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                                  'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'),
                              }}
                          resizeMode="stretch" // Ensures the entire image is displayed

                      />
                  );
                } else if (parsedData?.LocalImageUrl) {
                  // Fallback to LocalImageUrl if CloudFlareImageUrl is not available
                  return (
                    <PageMainImage
                      source={{
                        uri: parsedData.LocalImageUrl,
                      }}
                        resizeMode="stretch" // Ensures the entire image is displayed

                    />
                  );
                } else {
                  // Fallback to default image if neither is available
                  return (
                    <PageMainImage
                      source={require("../../../../assets/gym-workout.png")}
                      resizeMode="stretch" // Ensures the entire image is displayed
                    />
                  );
                }
              })()

              )}
            </>
            ):(
              <PageMainImage
                source={{
                uri: `${newWorkoutImages}`
                }}
                resizeMode="stretch" // Ensures the entire image is displayed

            />
            )}
            </ServicesPagesCardCover>

            
    ):(
      <ServicesPagesCardCover>
    <ServicesPagesCardAvatarIcon icon="target-account">
    </ServicesPagesCardAvatarIcon>
    <ServicesPagesCardHeader>{isEditWorkoutMode ? `${t("Edit_Workout")}` : `${t("Add_new_Workout")}`}</ServicesPagesCardHeader>
    </ServicesPagesCardCover>
    )}
    


    <Spacer size="small">
    <InputField>
    <FormLabelView>
        <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Name")}:</FormLabel>
    </FormLabelView>
    <FormInputView>
        <FormInput
        placeholder={t("Name")}
        value={workoutNameAddEntry}
        keyboardType="default"
        theme={{colors: {primary: '#3f7eb3'}}}
        onChangeText={(u) => setWorkoutNameAddEntry(u)}
        />
    </FormInputView>
    </InputField>
    </Spacer>
    <Spacer size="large">
    <InputField>
    <FormLabelView>
        <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Exercise_Type')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedExerciseTypeNewEntry(index);
            }}
            
        placeholder={t('Select_ExerciseType')}
        value={displayExerciseTypeValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {exerciseTypeData.map(renderExerciseTypeOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Equipment')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewEquipments(index);
            }}
            
        placeholder={t('Select_NewEquipments')}
        value={displayNewEquipmentsValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newEquipmentsData.map(renderNewEquipmentsOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Weights_Used')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewWeightsUsed(index);
            }}
            
        placeholder={t('Select_New_Weights')}
        value={displayNewWeightsUsedValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newWeightsUsedData.map(renderNewWeightsUsedOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Major_Muscle_One')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMajorMuscleOne(index);
            }}
            
        placeholder={t('Select_Major_Muscle_One')}
        value={displayNewMajorMuscleOneValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMajorMuscleOneData.map(renderNewMajorMuscleOneOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Major_Muscle_Two')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMajorMuscleTwo(index);
            }}
            
        placeholder={t('Select_Major_Muscle_Two')}
        value={displayNewMajorMuscleTwoValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMajorMuscleTwoData.map(renderNewMajorMuscleTwoOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Major_Muscle_Three')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMajorMuscleThree(index);
            }}
            
        placeholder={t('Select_Major_Muscle_Three')}
        value={displayNewMajorMuscleThreeValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMajorMuscleThreeData.map(renderNewMajorMuscleThreeOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Minor_Muscle_One')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMinorMuscleOne(index);
            }}
            
        placeholder={t('Select_Minor_Muscle_One')}
        value={displayNewMinorMuscleOneValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMinorMuscleOneData.map(renderNewMinorMuscleOneOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Minor_Muscle_Two')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMinorMuscleTwo(index);
            }}
            
        placeholder={t('Select_Minor_Muscle_Two')}
        value={displayNewMinorMuscleTwoValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMinorMuscleTwoData.map(renderNewMinorMuscleTwoOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small"> 
    <InputField>
    <FormLabelView>
        <FormLabel>{t('Minor_Muscle_Three')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <Select
        onSelect={(index) => {
            setSelectedNewMinorMuscleThree(index);
            }}
            
        placeholder={t('Select_Minor_Muscle_Three')}
        value={displayNewMinorMuscleThreeValue}
        style={{marginBottom:10}}
        status="newColor"
        size="customSizo"
        >
        {newMinorMuscleThreeData.map(renderNewMinorMuscleThreeOption)}
        </Select>
    </FormInputView>  
    </InputField>
    </Spacer>
    <Spacer size="small">
    <InputField>
    <FormLabelView>
    <FormLabel style={{top:-58}}>{t('Workout_Setup')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <TextInput
    editable
    multiline
    numberOfLines={7}
    maxLength={300}
    placeholder={t('Workout_Setup')}
    value={newWorkoutSetupAddEntry}
    keyboardType="default"
    style={styles.descriptionTextArea}
    onChangeText={(u) => setNewWorkoutSetupAddEntry(u)}
    />
    </FormInputView>
    </InputField>
    </Spacer>
    <Spacer size="large">
    <InputField>
    <FormLabelView>
    <FormLabel style={{top:-58}}>{t('Performing_Workout')}:</FormLabel>
    </FormLabelView>
    <FormInputView>
    <TextInput
    editable
    multiline
    numberOfLines={7}
    maxLength={300}
    placeholder={t('Performing_Workout')}
    value={performingWorkoutAddEntry}
    keyboardType="default"
    style={styles.descriptionTextArea}
    onChangeText={(u) => setPerformingWorkoutAddEntry(u)}
    />
    </FormInputView>
    </InputField>
    </Spacer>
    <Spacer size="small">
    <InputField style={{marginTop:10}}
>
    <FormLabelView>
    <FormLabel style={{marginLeft:10}}
>{t('Add_Media')}:</FormLabel>
    <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
        <FormElemeentSizeButtonView style={{width:"100%",marginTop:5}}> 
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => onPressWorkoutMedia()}>
        <CalendarFullSizePressableButtonText >{t('Add_Media')}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonView>
    </FormElemeentSizeButtonParentView>
    </FormLabelView>
        <FormInputView>
        {(newWorkoutImages !== "")? (
            <>
            <TouchableOpacity onPress={handleImagePress}>
            <TouchableOpacity style={styles.closeSmallImageButton} onPress={handleRemoveSmallImage}>
                <View style={styles.closeImageButtonInner} >
                <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
            </TouchableOpacity>
            {(isEditWorkoutMode) ? (
                  <>
                    {userDataArray?.role === "Trainee" ? (
                      <Image
                        style={{
                          width: 180,
                          height: 165,
                          left: "15%",
                          borderRadius: 35,
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                        source={
                          newWorkoutImages?.startsWith("../../../../assets/images")
                            ? mainWorkoutsData[workoutArray?.id - 1]?.images
                            : newWorkoutImages?.startsWith("file:///data/user")
                            ? { uri: newWorkoutImages }
                            : require("../../../../assets/gym-workout.png")
                        }
                      />
                    ) : isImageUrl(newWorkoutImages) ? (
                      <Image
                        style={{
                          width: 180,
                          height: 165,
                          left: "15%",
                          borderRadius: 35,
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                        source={
                          newWorkoutImages?.startsWith("../../../../assets/images")
                            ? mainWorkoutsData[workoutArray?.id - 1]?.images
                            : newWorkoutImages?.startsWith("file:///data/user")
                            ? { uri: newWorkoutImages }
                            : require("../../../../assets/gym-workout.png")
                        }
                      />
                    ) : (newWorkoutImages == "") ? (
                      <Image
                        style={{
                          width: 180,
                          height: 165,
                          left: "15%",
                          borderRadius: 35,
                          marginBottom: 10,
                          marginTop: 10,
                        }}
                        source={require("../../../../assets/gym-workout.png")}
                      />
                    ) : (
                    (() => {
                      let parsedData;
                      try {
                        // Parse newWorkoutImages
                        parsedData = JSON.parse(newWorkoutImages);
                        console.log("parsedData-------:", parsedData);

                      } catch (error) {
                        console.error("Failed to parse newWorkoutImages:", error);
                        parsedData = null;
                      }
                      console.log("parsedData?.CloudFlareImageUrl-------:", parsedData?.CloudFlareImageUrl);

                      // Use parsed data to determine which image to display
                      if (parsedData?.CloudFlareImageUrl) {
                        // Use CloudFlareImageUrl if it exists
                        return (
                          <Image
                            style={{
                              width: 180,
                              height: 165,
                              left: "15%",
                              borderRadius: 35,
                              marginBottom: 10,
                              marginTop: 10,
                            }}
                            source={{
                              uri: parsedData.CloudFlareImageUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                                'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'),
                            }}
                          />
                        );
                      } else if (parsedData?.LocalImageUrl) {
                        // Fallback to LocalImageUrl if CloudFlareImageUrl is not available
                        return (
                          <Image
                            style={{
                              width: 180,
                              height: 165,
                              left: "15%",
                              borderRadius: 35,
                              marginBottom: 10,
                              marginTop: 10,
                            }}
                            source={{
                              uri: parsedData.LocalImageUrl,
                            }}
                          />
                        );
                      } else {
                        // Fallback to default image if neither is available
                        return (
                          <Image
                            style={{
                              width: 180,
                              height: 165,
                              left: "15%",
                              borderRadius: 35,
                              marginBottom: 10,
                              marginTop: 10,
                            }}
                            source={require("../../../../assets/gym-workout.png")}
                          />
                        );
                      }
                    })()

                    )}
                  </>
                ) : (
                  <Image
                    style={{
                      width: 180,
                      height: 165,
                      left: "15%",
                      borderRadius: 35,
                      marginBottom: 10,
                      marginTop: 10,
                    }}
                    source={{
                      uri: `${newWorkoutImages}`,
                    }}
                  />
                )}

            
            
            </TouchableOpacity>
            <Modal visible={isImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseFullScreen}>
            <View style={styles.modalImageOverlay}>
                <TouchableOpacity style={styles.closeImageButton} onPress={handleCloseFullScreen}>
                <View style={styles.closeImageButtonInner} >
                <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
                </TouchableOpacity>
                {(isEditWorkoutMode)?(
                  <>
                    {userDataArray?.role === "Trainee" ? (
                      <Image
                        style={styles.fullScreenImage}
                        source={
                          newWorkoutImages?.startsWith("../../../../assets/images")
                            ? mainWorkoutsData[workoutArray?.id - 1]?.images
                            : newWorkoutImages?.startsWith("file:///data/user")
                            ? { uri: newWorkoutImages }
                            : require("../../../../assets/gym-workout.png")
                        }
                      />
                    ) : isImageUrl(newWorkoutImages) ? (
                      <Image
                        style={styles.fullScreenImage}
                        source={
                          newWorkoutImages?.startsWith("../../../../assets/images")
                            ? mainWorkoutsData[workoutArray?.id - 1]?.images
                            : newWorkoutImages?.startsWith("file:///data/user")
                            ? { uri: newWorkoutImages }
                            : require("../../../../assets/gym-workout.png")
                        }
                      />
                    ) : (newWorkoutImages == "") ? (
                      <Image
                        style={styles.fullScreenImage}
                        source={require("../../../../assets/gym-workout.png")}
                      />
                    ) : (
                    (() => {
                      let parsedData;
                      try {
                        // Parse newWorkoutImages
                        parsedData = JSON.parse(newWorkoutImages);
                        console.log("parsedData-------:", parsedData);

                      } catch (error) {
                        console.error("Failed to parse newWorkoutImages:", error);
                        parsedData = null;
                      }
                      console.log("parsedData?.CloudFlareImageUrl-------:", parsedData?.CloudFlareImageUrl);

                      // Use parsed data to determine which image to display
                      if (parsedData?.CloudFlareImageUrl) {
                        // Use CloudFlareImageUrl if it exists
                        return (
                          <Image
                            style={styles.fullScreenImage}
                            source={{
                              uri: parsedData.CloudFlareImageUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                                'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'),
                            }}
                          />
                        );
                      } else if (parsedData?.LocalImageUrl) {
                        // Fallback to LocalImageUrl if CloudFlareImageUrl is not available
                        return (
                          <Image
                            style={styles.fullScreenImage}
                            source={{
                              uri: parsedData.LocalImageUrl,
                            }}
                          />
                        );
                      } else {
                        // Fallback to default image if neither is available
                        return (
                          <Image
                            style={styles.fullScreenImage}
                            source={require("../../../../assets/gym-workout.png")}
                          />
                        );
                      }
                    })()

                    )}
                  </>
              ):(
            <Image style={styles.fullScreenImage} source={{ uri: `${newWorkoutImages}` }} />

              )}
            </View>
            </Modal>
        </>
        ):(null)}
        {(newWorkoutVideos !== "" && newWorkoutThumbnailImages !== "")? (
            <>
            <TouchableOpacity onPress={handleVideoImagePress}>
            <TouchableOpacity style={styles.closeSmallImageButton} onPress={handleRemoveSmallVideo}>
                <View style={styles.closeImageButtonInner} >
                <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
            </TouchableOpacity>
            
            {(isEditWorkoutMode)?(
              <>
                {userDataArray?.role === "Trainee" ? (
                  <Image
                    style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                    source={
                      newWorkoutThumbnailImages?.startsWith("../../../../assets/images")
                        ? mainWorkoutsData[workoutArray?.id - 1]?.images
                        : newWorkoutThumbnailImages?.startsWith("file:///data/user")
                        ? { uri: newWorkoutThumbnailImages }
                        : require("../../../../assets/gym-workout.png")
                    }
                  />
                ) : isImageUrl(newWorkoutThumbnailImages) ? (
                  <Image
                    style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                    source={
                      newWorkoutThumbnailImages?.startsWith("../../../../assets/images")
                        ? mainWorkoutsData[workoutArray?.id - 1]?.images
                        : newWorkoutThumbnailImages?.startsWith("file:///data/user")
                        ? { uri: newWorkoutThumbnailImages }
                        : require("../../../../assets/gym-workout.png")
                    }
                  />
                ) : (newWorkoutThumbnailImages == "") ? (
                  <Image
                    style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                    source={require("../../../../assets/gym-workout.png")}
                  />
                ) : (
                (() => {
                  let parsedData;
                  try {
                    // Parse newWorkoutThumbnailImages
                    parsedData = JSON.parse(newWorkoutThumbnailImages);
                    console.log("parsedData-------:", parsedData);

                  } catch (error) {
                    console.error("Failed to parse newWorkoutThumbnailImages:", error);
                    parsedData = null;
                  }
                  console.log("parsedData?.CloudFlareImageUrl-------:", parsedData?.CloudFlareImageUrl);

                  // Use parsed data to determine which image to display
                  if (parsedData?.CloudFlareImageUrl) {
                    // Use CloudFlareImageUrl if it exists
                    return (
                      <Image
                        style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                        source={{
                          uri: parsedData.CloudFlareImageUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                            'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'),
                        }}
                      />
                    );
                  } else if (parsedData?.LocalImageUrl) {
                    // Fallback to LocalImageUrl if CloudFlareImageUrl is not available
                    return (
                      <Image
                        style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                        source={{
                          uri: parsedData.LocalImageUrl,
                        }}
                      />
                    );
                  } else {
                    // Fallback to default image if neither is available
                    return (
                      <Image
                        style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                        source={require("../../../../assets/gym-workout.png")}
                      />
                    );
                  }
                })()

                )}
              </>
              ):(
                <Image
                style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                source={{
                uri: `${newWorkoutThumbnailImages}`
                }}
                />
              )}
            </TouchableOpacity>
            <Modal visible={isVideoFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseVideoFullScreen}>
            <View style={styles.modalVideoImageOverlay}>
            <TouchableOpacity style={styles.closeVideoImageButton} onPress={handleCloseVideoFullScreen}>
                <View style={styles.closeVideoImageButtonInner}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    X
                  </Text>
                </View>
              </TouchableOpacity>
              {
                userDataArray?.role === "Trainee" ? (
                  <Video
                    ref={video}
                    style={styles.ImageVideoZoom}
                    source={{ uri: newWorkoutVideos }}
                    useNativeControls
                    resizeMode="stretch"
                    onPlaybackStatusUpdate={(status) => {
                      setStatus(status);
                    }}
                    onLoad={() => {
                      video.current.playAsync();
                    }}
                  />
                ) : isVideoUrl(newWorkoutVideos) ? (
                      <Video
                      ref={video}
                      style={styles.ImageVideoZoom}
                      source={{ uri: newWorkoutVideos }}
                      useNativeControls
                      resizeMode="stretch"
                      onPlaybackStatusUpdate={(status) => {
                        setStatus(status);
                      }}
                      onLoad={() => {
                        video.current.playAsync();
                      }}
                    />
                ) : (
                (() => {
                  let parsedDataNewWorkoutVideos;
                  try {
                    // Parse newWorkoutVideos
                    parsedDataNewWorkoutVideos = JSON.parse(newWorkoutVideos);
                    console.log("parsedDataNewWorkoutVideos-------:", parsedDataNewWorkoutVideos);

                  } catch (error) {
                    console.error("Failed to parse newWorkoutVideos:", error);
                    parsedDataNewWorkoutVideos = null;
                  }
                  console.log("parsedDataNewWorkoutVideos?.CloudFlareVideUrl-------:", parsedDataNewWorkoutVideos?.CloudFlareVideUrl);

                  // Use parsed data to determine which image to display
                  if (parsedDataNewWorkoutVideos?.CloudFlareVideUrl) {
                    // Use CloudFlareVideUrl if it exists
                    return (
                      <Video
                          ref={video}
                          style={styles.ImageVideoZoom}
                          source={{ uri: parsedDataNewWorkoutVideos?.CloudFlareVideUrl?.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                            'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }}
                          useNativeControls
                          resizeMode="stretch"
                          onPlaybackStatusUpdate={(status) => {
                            setStatus(status);
                          }}
                          onLoad={() => {
                            video.current.playAsync();
                          }}
                        />
                    );
                  } else if (parsedDataNewWorkoutVideos?.LocalVideUrl) {
                    // Fallback to LocalVideUrl if CloudFlareVideUrl is not available
                    return (
                      <Video
                          ref={video}
                          style={styles.ImageVideoZoom}
                          source={{ uri: parsedDataNewWorkoutVideos?.LocalVideUrl }}
                          useNativeControls
                          resizeMode="stretch"
                          onPlaybackStatusUpdate={(status) => {
                            setStatus(status);
                          }}
                          onLoad={() => {
                            video.current.playAsync();
                          }}
                        />
                    );
                  } else {
                    // Fallback to default image if neither is available
                    return (
                      <Image
                        style={styles.fullScreenImage}
                        source={require("../../../../assets/gym-workout.png")}
                      />
                    );
                  }
                })()

                )}

            </View>
            </Modal>
        </>
        ):(null)}
        {/* //<CameraFrontScreen isVisible={cameraFrontVisible} onClose={() => setCameraFrontVisible(false)} onTakeFrontBodyImage={handleFrontBodyImageCamera} /> */}
        </FormInputView>
    </InputField>
    </Spacer>
    <Spacer size="large">

        <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
            onPress={()=>{
                  if (isEditWorkoutMode) {
                  // If in edit mode, call the edit handler
                  editNewWorkoutEntryHandler(workoutArray,workoutNameAddEntry, displayExerciseTypeValue,displayNewEquipmentsValue,displayNewWeightsUsedValue,newWorkoutSetupAddEntry,performingWorkoutAddEntry,displayNewMajorMuscleOneValue,displayNewMajorMuscleTwoValue,displayNewMajorMuscleThreeValue,displayNewMinorMuscleOneValue,displayNewMinorMuscleTwoValue,displayNewMinorMuscleThreeValue,newWorkoutImages,newWorkoutVideos);
                  } else {
                    // If in add mode, call the add handler
                    addNewWorkoutEntryHandler();
                  }
                  }}>
            <CalendarFullSizePressableButtonText >{isEditWorkoutMode ? `${t("Edit_Workout")}` : `${t("Add_new_Workout")}`}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
    </Spacer>
    <Spacer size="large"></Spacer>
    <Spacer size="large"></Spacer>
    {/* <Spacer size="small">
    <FullSizeButtonView>
    <FullButton
    icon="arrow-down-left-bold"
    mode="contained"
    style={{fontSize:18}}
    onPress={()=>navigation.goBack()}
    >
    {t('Back')}
    </FullButton>
    </FullSizeButtonView>
    </Spacer> */}
    </ScrollView>

    </PageContainer>
    );
};
const styles = StyleSheet.create({
 descriptionTextArea: {
 // This property ensures that the text starts from the top
        backgroundColor:"white",
        borderRadius:6,
        padding:10,
        textAlignVertical: 'top',
        height:150,
        borderWidth:1,
        borderColor:"gray",
        
    },
    modalImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeImageButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  closeImageButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:"center",
    alignItems:"center",
  },
  closeSmallImageButton: {
    position: 'absolute',
    top: 20,
    right: 40,
    zIndex: 1,
  },
  
  modalVideoImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeVideoImageButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  closeVideoImageButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:"center",
    alignItems:"center",
  },
  ImageVideoZoom:{
    alignSelf: 'center',
    width: 350,
    height: 400,
  },
  
uploadModalContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
},
uploadLoadingBox: {
  width: 280,
  backgroundColor: '#1c1c1e',
  borderRadius: 12,
  paddingVertical: 20,
  paddingHorizontal: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.8,
  shadowRadius: 6,
  elevation: 5,
},
uploadLoadingText: {
  color: '#f0f0f5',
  fontSize: 22,
  fontWeight: '600',
  marginBottom: 10,
  textAlign: 'center',
},
uploadProgressBarContainer: {
  width: '100%',
  height: 10,
  backgroundColor: '#333',
  borderRadius: 7.5,
  overflow: 'hidden',
  marginVertical: 10,
},
uploadProgressBar: {
  height: '100%',
  backgroundColor: '#3f7eb3',
  borderRadius: 7.5,
},
uploadPercentageText: {
  fontSize: 20,
  fontWeight: '600',
  color: '#3f7eb3',
  marginTop: 2,
  textAlign: 'center',
},
uploadProgressDetailsText: {
  color: '#c7c7cc',
  fontSize: 16,
  textAlign: 'center',
  marginTop: 2,
},
  successText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  // uploadLoaderContainer: {
  //   alignItems: 'center',
  // },
  // uploadCounter: {
  //   fontSize: 16,
  //   marginBottom: 10,
  // },
  // uploadProgressBar: {
  //   width: '80%',
  //   marginVertical: 20,
  // },
});