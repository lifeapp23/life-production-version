import React, { useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Select, SelectItem  } from '@ui-kitten/components';
import { StyleSheet,ScrollView,View,Alert,Text,TextInput,Modal,Pressable,TouchableOpacity} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Spinner } from '@ui-kitten/components';

import {
    Title,
    TitleView,
    InputField,
    AsteriskTitle,
    FormInput,
    FormLabel,
    PageContainer,
    FormLabelView,
    FormInputView,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    FormElemeentSizeButtonView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FilterContainer,
    FilterTextView,
    FilterText,
    ClearFilterTextView,
    ClearFilterText,
    FormElemeentSizeButtonParentView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,
    BlackLineOnePixel,
    BlackLineTwoPixel,
    TraineeOrTrainerField,
    TraineeOrTrainerButtonsParentField,
    TraineeOrTrainerButtonField,
    ClearFilterTouchableOpacity,
  
  } from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
import { StackActions } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';

import { insertPlansPublicWorkoutsPlanDays} from "../../../../database/public_workouts_plan_days";

import { fetchWorkoutsTable} from "../../../../database/workoutsTable";
import { useFocusEffect } from '@react-navigation/native';
import { fetchPublicWorkoutsPlanDaysWithoutDeleting } from "../../../../database/public_workouts_plan_days";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import { fetchPublicSettings} from "../../../../database/workout_settings";


const MemoizedExerciseParentView = React.memo(({ item, navigation,filteredData,dayNameInput,userId,publicWorkoutsPlanRowConArr, setGettedSelectedExercises ,gettedSelectedExercises,fetchPublicSettingsData  }) => {
  const [thumbnailUri, setThumbnailUri] = React.useState(null);
  const [selectedExerciseView, setSelectedExerciseView] = useState(null);
      const [numberOfExercisesView, setNumberOfExercisesView] = useState(0);
      const [showSetInputView, setShowSetInputView] = useState(false);
      const [setsInput, setSetsInput] = useState('');
      const [selectedExercises, setSelectedExercises] = useState([]);
      const [isDayNameModalVisible, setIsDayNameModalVisible] = useState(false);
      const [selectedExerciseRows, setSelectedExerciseRows] = useState({});
      const { t, i18n } = useTranslation();

  function isImageUrl(url) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
    const lowercasedUrl = url?.toLowerCase();
    return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
  }
  
  function isVideoUrl(url) {
    // List of common video file extensions
    const videoExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.ogg', 'wmv', 'm4v'];
  
    // Extract the file extension from the URL
    const urlWithoutQueryParams = url.split('?')[0];
    const urlParts = urlWithoutQueryParams.split('.');
    const extension = `.${urlParts[urlParts.length - 1]}`;
  
    // Check if the extension is in the list of video extensions
    return videoExtensions.includes(extension);
  }
  

  const generateVideoThumbnailAsync = async (videoPath) => {
    try {
      let thumbnailUri = '';
  
      if (videoPath.startsWith('http://')) {
        // Convert asset path to file URI
        //////console.log('asset before', asset);
        //await asset.downloadAsync();
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
          time: 5000,
        });
        thumbnailUri = uri;
        //////console.log('thumbnailUri', thumbnailUri);
      } else if (videoPath.startsWith('file:///data/user')) {
        // The video is already a file URI
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
          time: 5000,
        });
        thumbnailUri = uri;
      }
  
      setThumbnailUri(thumbnailUri);
      //////console.log('uri', thumbnailUri);
    } catch (e) {
      //console.error('Error generating video thumbnail:', e);
    }
  };
  const handleItemPress = (item) => {
    const exerciseKey = item.speKey;
    ////console.log('exerciseKey',exerciseKey);

    // Check if the exercise is already selected
    const indexToRemove  = gettedSelectedExercises.findIndex((exercise) => exercise.wrkKey === exerciseKey);
    ////console.log('indexToRemove',indexToRemove);

    if (indexToRemove  !== -1) {
      // Exercise is already selected, remove it
      //const updatedSelectedExercises = [...selectedExercises];
      //updatedSelectedExercises.splice(index, 1);
      
      ////console.log('index',indexToRemove );
     

    setGettedSelectedExercises((prevSelectedExercises) =>
      prevSelectedExercises?.filter((_, index) => index !== indexToRemove)
    );
    } else {
      // Exercise is not selected, show the set input view
      setShowSetInputView(true);
      setSetsInput('');
      setSelectedExerciseView(item);
    }
  };


  const handleOkPress = (selectedExerciseView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises,fetchPublicSettingsData) => {
    const exerciseKey = selectedExerciseView.speKey;

    let exrTim = '';
    
    // if (selectedExerciseView.exrTyp === 'Cardio' || selectedExerciseView.exrTyp === 'Stability'){
    //   exrTim = fetchPublicSettingsData?.cardio;
    // }else if (selectedExerciseView.exrTyp ==='Isolation'){
    //   exrTim = fetchPublicSettingsData?.isoltn;
    // }else if(selectedExerciseView.exrTyp ==='Compound'){
    //   exrTim = fetchPublicSettingsData?.compnd;
    // }

    const enteredSets = parseInt(setsInput, 10) || 0;
    if(enteredSets ==0 || enteredSets == ""){
      Alert.alert(`${t("you_must_enter_number")}`);
      return;
    } 
    if(enteredSets >50){
      Alert.alert(`${t("maximum_sets_should_be_fifty")}`);
      return;
    } 

      setGettedSelectedExercises((prevSelectedExercises) => [
        ...prevSelectedExercises,
        {
          wrkSts: enteredSets,
          wrkKey: selectedExerciseView.speKey,
          wktNam:selectedExerciseView.wktNam,
          exrTyp:selectedExerciseView.exrTyp,
          exrTim:exrTim,
          lstUpd:"",
          exrStu:"active",
          eqpUsd:selectedExerciseView.eqpUsd,
          witUsd:selectedExerciseView.witUsd,
          wktStp:selectedExerciseView.wktStp,
          pfgWkt:selectedExerciseView.pfgWkt,
          mjMsOn:selectedExerciseView.mjMsOn,
          mjMsTw:selectedExerciseView.mjMsTw,
          mjMsTr:selectedExerciseView.mjMsTr,
          mnMsOn:selectedExerciseView.mnMsOn,
          mnMsTo:selectedExerciseView.mnMsTo,
          mnMsTr:selectedExerciseView.mnMsTr,
          images:selectedExerciseView.images,
          videos:selectedExerciseView.videos

        }  
      ]);
      setNumberOfExercisesView(gettedSelectedExercises.length);
      setShowSetInputView(false);
  };
  

  const isExerciseSelected = (exrSpeKey) =>
    gettedSelectedExercises.some((exercise) => exercise.wrkKey === exrSpeKey);
    //console.log('item',item );

  return (
    <>
    {!isExerciseSelected(item.speKey) && 

    <Pressable onPress={() => handleItemPress(item)}>
      <ExerciseParentView>
        <ExerciseImageView>
          {/* {(item.images !== '' && item.images !== undefined && item.images !== null) ? (
            <>
              {isImageUrl(item.images) && (
                <ExerciseImageViewImage
                  source={{ uri: `${item.images}` }}
                />
              )} */}
  {/* 
              {isVideoUrl(item.wktMda) && thumbnailUri !== null && (
                <ExerciseImageViewImage source={require('../../../../assets/gym-workout.png')} />
              )} */}
            {/* </>
          ) : (
            <ExerciseImageViewImage source={require('../../../../assets/gym-workout.png')} />
          )} */}
          {/* <ExerciseImageViewImage source={
                                    item?.images.startsWith('../../../../assets/images')
                                      ? mainWorkoutsData[item?.id-1]?.images
                                      : item?.images.startsWith('file:///data/user')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://www.elementdevelops.com')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                      ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                      : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                                      /> */}
                    <>
                    {
                      (isImageUrl(item?.images)) ? (
                        
                        <ExerciseImageViewImage
                                source={
                                  item?.images?.startsWith('../../../../assets/images')
                                      ? mainWorkoutsData[item?.id-1]?.images
                                      : item?.images?.startsWith('file:///data/user')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://www.elementdevelops.com')
                                      ? { uri: item?.images }
                                      : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                      ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                      : require('../../../../assets/gym-workout.png')
                                  }   
                        
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
                                    />
                            
                          )}
                        </>
                      
                        );
                      } else {
                            return (
                              <ExerciseImageViewImage
                                source={require("../../../../assets/gym-workout.png")}
                                />
                            );
                          }
                        })()
                      )
                    }
                    </>
        </ExerciseImageView>
        <ExerciseInfoParentView>
          <ExerciseInfoTextHead style={{fontSize:16}}>{item.wktNam}</ExerciseInfoTextHead>
          {(item.mjMsOn) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsOn}</ExerciseInfoTextTag>) : (null)}
          {(item.mjMsTw) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTw}</ExerciseInfoTextTag>) : (null)}
          {(item.mjMsTr) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTr}</ExerciseInfoTextTag>) : (null)}
          {(item.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.eqpUsd}</ExerciseInfoTextTag>) : (null)}
          {(item.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14,color:"#000", fontWeight:"bold" }}>{item.eqpUsd}</ExerciseInfoTextTag>) : (null)}

        </ExerciseInfoParentView>
          {isExerciseSelected(item.speKey) && <Text style={{ color: 'green',marginVertical:15 }}>✔</Text>}
            <Modal transparent visible={showSetInputView} >
            <View style={{ flexDirection: 'row', alignItems: 'center',width:260,height:260, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
              <Text style={{ color: 'white',marginRight:5 }}>{t("Sets_number")}: </Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                placeholder={t("Sets")}
                keyboardType="numeric"
                value={setsInput}
                onChangeText={(text) => setSetsInput(text)}
              />
              <Pressable onPress={() => handleOkPress(selectedExerciseView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises,fetchPublicSettingsData)}>
                <Text style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5,padding:9 }}>OK</Text>
              </Pressable>
              <Pressable onPress={() => setShowSetInputView(false)}>
                <Text style={{ color: 'white',borderWidth: 1,marginLeft:10, borderColor: 'white', borderRadius: 5,padding:9 }}>X</Text>
              </Pressable>
            </View>
            </Modal>
      </ExerciseParentView>
    </Pressable>
      }
    </>
  );
});
export const TrainerPredefinedWorkoutSelectDayExercisesScreen = ({ navigation,route}) => {
      //const publicWorkoutsPlanRowConArr = route.params?.publicWorkoutsPlanRowCon;
      const { publicWorkoutsPlanRowConArr, sentDaySpeKey } = route.params;
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      const [selectedFilter, setSelectedFilter] = useState(''); // State to manage the selected filter
      const [fetchPublicSettingsData, setFetchPublicSettingsData] = useState({}); // State to manage the selected filter
      const [loadingPageInfo, setLoadingPageInfo] = useState(true);
      const [addNewWorkout, setAddNewWorkout] = useState(false);
      const [storedUserConst, setStoredUserConst] = useState('');
  const [loading, setLoading] = useState(false);

      ////console.log('publicWorkoutsPlanRowConArr',publicWorkoutsPlanRowConArr);
      ////console.log('sentDaySpeKey',sentDaySpeKey);

      const [fetchedData, setFetchedData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);      
      const [searchQuery, setSearchQuery] = useState('');
      const [showFilter, setShowFilter] = useState(false); // New state for filter visibility
      const [userId,setUserId] = useState('');
      const [gettedSelectedExercises,setGettedSelectedExercises] = useState([]);
      const [gettedSelectedExercisesBeforeChanging,setGettedSelectedExercisesBeforeChanging] = useState([]);
      const [dayNameInputBeforeChanging,setDayNameInputBeforeChanging] = useState('');
      const [dayNameInput, setDayNameInput] = useState('');

      
      useFocusEffect(
        useCallback(() => {
          //console.log("!addNewWorkout",addNewWorkout);
          const onBeforeRemove = (e) => {
            const hasChanges = compareArrays(gettedSelectedExercisesBeforeChanging, gettedSelectedExercises);
            const hasChangesInWorkoutName = compareWorkoutNames(dayNameInputBeforeChanging, dayNameInput);

            if(!addNewWorkout){
           
              if(hasChanges || hasChangesInWorkoutName) { 
                e.preventDefault();
        
                Alert.alert(
                  '',
                  `${t("Are_you_sure_you_want_to_exit_without_saving")}`,
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
            } 
            
          };
      
          navigation.addListener('beforeRemove', onBeforeRemove);
      
          return () => {
            navigation.removeListener('beforeRemove', onBeforeRemove);
          };
          
        }, [gettedSelectedExercisesBeforeChanging, gettedSelectedExercises,addNewWorkout])
      );
      const compareArrays = (oldArray, newArray) => {
        // Check if both arrays are the same length
        if (oldArray.length !== newArray.length) {
          return true; // Arrays are different if their lengths differ
        }
      
        // Compare each object in the arrays
        for (let i = 0; i < oldArray.length; i++) {
          const oldItem = oldArray[i];
          const newItem = newArray[i];
      
          // Check each key in the object
          for (const key in oldItem) {
            if (oldItem[key] !== newItem[key]) {
              return true; // If any value differs, arrays are different
            }
          }
        }
      
        return false; // Arrays are the same
      };
      const compareWorkoutNames = (oldName, newName) => {
        if (oldName !== newName) {
          return true; // Names are different
        }
        return false; // Names are the same
      };
      const [triainerConnected,setTriainerConnected] =  useState(false);

      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      const [setsSelectedInput, setSetsSelectedInput] = useState('');
      const [selectedExerciseSelectedView, setSelectedExerciseSelectedView] = useState(null);

      const [numberOfSelectedExercisesView, setNumberOfSelectedExercisesView] = useState(0);
      const [showSetInputSelectedView, setShowSetInputSelectedView] = useState(false);

      useFocusEffect(
        React.useCallback(() => {
        

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {

            const storedUser = JSON.parse(user);
            setStoredUserConst(storedUser);

            setUserId(storedUser.id);
            fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
              //console.log('PSettingsResults',PSettingsResults?.[0]);

              // Set the state with the new resultMap
              setFetchPublicSettingsData(PSettingsResults?.[0]);
          
            });
            ////console.log('select day exer user',storedUser);
            // fetchPublicWorkoutsPlanDaysWithoutDeleting(storedUser.id,publicWorkoutsPlanRowConArr?.speKey).then((publicWorkoutsPlanDaysTableResults) => {
              
            //   const filteredArray = publicWorkoutsPlanDaysTableResults?.filter(item => item.speKey === sentDaySpeKey);

            //     ////console.log('filteredArray>>>---',filteredArray);
            //     setGettedSelectedExercises(filteredArray ? filteredArray : []);
            //     setDayNameInput(filteredArray[0]?.dayNam ? filteredArray[0]?.dayNam: "");
            // });
            const unsubscribe = addEventListener(state => {
              ////console.log("Connection type--", state.type);
              ////console.log("Is connected?---", state.isConnected);
              setTriainerConnected(state.isConnected);
              if(state.isConnected){
                ////console.log('---------------now online--------')
                ////console.log('my plan Days page',publicWorkoutsPlanRowConArr);
        
        
                axios.get(`https://www.elementdevelops.com/api/get-trainer-workouts-predefined-plan-days?trainerId=${publicWorkoutsPlanRowConArr?.trnrId}&planId=${publicWorkoutsPlanRowConArr?.id}`, {
                headers: {
                  'Authorization': `Bearer ${res}`,
                  'Content-Type': 'application/json',
                },
                })
                .then(response => {
                  // Handle successful response
                  ////console.log('Plan Day response::',response?.data);

                  ////console.log('Plan Day Workouts::',response?.data?.["getTraineePlanDays"]);
                  //setPublicWorkoutsPlanDaysTable(response.data["getTraineePlanDays"]);
                  const filteredArray = response?.data?.["TrainerWorkoutsPredefinedPlanDays"]?.filter(item => item?.speKey === sentDaySpeKey);

                  //console.log('filteredArray>>>---',filteredArray);
                  const filteredArrayWrkAry = filteredArray?.[0]?.['wrkAry'];
                  ////console.log('filteredArrayWrkAry-)>>>---',filteredArrayWrkAry);

                  const newFilteredArray  =JSON.parse(filteredArrayWrkAry);
                  //console.log('newFilteredArray-)>>>---',newFilteredArray);

                  setGettedSelectedExercises(newFilteredArray ? newFilteredArray : []);
                  setGettedSelectedExercisesBeforeChanging(newFilteredArray ? newFilteredArray : []);

                  setDayNameInput(filteredArray[0]?.dayNam ? filteredArray[0]?.dayNam: "");
                  setDayNameInputBeforeChanging(filteredArray[0]?.dayNam ? filteredArray[0]?.dayNam: "");
                })
                .catch(error => {
                  // Handle error
                  ////console.log('Error fetching Days:', error);
                });
        
              }else{
                ////console.log('else no internet ahmed');
                Alert.alert(`${t('To_see_Plan_s_days')}`,
                    `${t("You_must_be_connected_to the_internet")}`);
                      
        
              }
    
            });
            
            // Unsubscribe
            unsubscribe();

            fetchWorkoutsTable(storedUser.id).then((WResults) => {
              setFetchedData(WResults);
              setFilteredData(WResults);
                }).catch((error) => {
                //console.error('Error fetching WorkoutsTable:', error);
                });
           
              
            
            })
            
        });
        const timer = setTimeout(() => {
          setLoadingPageInfo(false);
        }, 3000); // 3 seconds
    
        return () => clearTimeout(timer); // Cleanup the timer on component unmount
         
        }, [])
      );
     
      // //const daySpeKey = userId + '.' + new Date().getTime();

      // // Store the value in another constant
      // const anotherConstant = daySpeKey;
      
      // // Convert it to a string
      // const stringValue = daySpeKey.toString();
      // const updateSelectedExercises = (updatedExercises) => {
      //   const daySpeKey = userId + '.' + new Date().getTime();
      //   ////console.log('updateSelectedExercises',updateSelectedExercises)
      //   // Map over the updatedExercises array and update the dayNam property
      //   const updatedExercisesWithDayName = updatedExercises.map((exercise) => ({
      //     ...exercise,
      //     dayNam: dayNameInput, // Update dayNam with the value of dayNameInput
      //     speKey:daySpeKey,
      //   }));
      
      //   // Set the state with the updated exercises
      //   setGettedSelectedExercises(updatedExercisesWithDayName);
      // };
      
    ///////console.log('gettedSelectedExercises after',gettedSelectedExercises);

      const toggleFilter = () => {
        setShowFilter(!showFilter);
      };
      ////////////// Start equipmentsData////////////////
      const [ selectedEquipments,setSelectedEquipments] =useState("");
      const equipmentsData = [
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
      const renderEquipmentsOption = (title,i) => (
        <SelectItem title={title} key={i} />
      );
      const displayEquipmentsValue = equipmentsData[selectedEquipments.row];
      ////////////// End equipmentsData////////////////
      ////////////// Start musclesData////////////////
      const [selectedMuscles,setSelectedMuscles] = useState("");
      const musclesData = [
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
      const renderMusclesOption = (title,i) => (
        <SelectItem title={title} key={i} />
      );
      const displayMusclesValue = musclesData[selectedMuscles.row];
      ////////////// End musclesData////////////////
        
    ////////////// Start weightsData////////////////
    const [selectedWeights,setSelectedWeights] = useState("");
    const weightsData = [
    "dumbbells",
    "EZ barbell",
    "Traps bar",
    "Sand bag",
    "Ab wheel",
    "Exercise ball",
    "Plate",
    "Jumping Rope",
    "Rings",
    "Jump box",
    "Parallettes",
    "kettle bells",
    "Resistance Band",
    "Weighted Belts",
    "Sled",
    "Bosu Ball",
    "Battle Rope",
    "Rope Climbing",
    "Tires",
    "Straight Bar",
    "Free Weight",
    ];
    const renderWeightsOption = (title,i) => (
    <SelectItem title={title} key={i} />
    );
    const displayWeightsValue = weightsData[selectedWeights.row];
    ////////////// End weightsData////////////////
    ////////////// Start exerciseTypeData////////////////
    const [ selectedExerciseType,setSelectedExerciseType] =useState("");
    const exerciseTypeData = [
      'Compound',
      'Cardio',
      'Isolation',
      'Stability',
    ];
    const renderExerciseTypeOption = (title,i) => (
      <SelectItem title={title} key={i} />
    );
    const displayExerciseTypeValue = exerciseTypeData[selectedExerciseType.row];
    ////////////// End exerciseTypeData////////////////
    // ////////////// Start benchesAndRacksData////////////////
    // const [ selectedBenchesAndRacks,setSelectedBenchesAndRacks] =useState("");
    // const benchesAndRacksData = [
    //   'benche_one',
    //   'benche_two',
    //   'benche_three'
    // ];
    // const renderBenchesAndRacksOption = (title,i) => (
    //   <SelectItem title={title} key={i} />
    // );
    // const displayBenchesAndRacksValue = benchesAndRacksData[selectedBenchesAndRacks.row];
    // ////////////// End benchesAndRacksData////////////////

      
       //const workout = workouts.find((workout) => workout.workoutName === workoutName);
       useEffect(() => {
        filterData(); // Apply initial filtering
      }, [fetchedData,selectedFilter, searchQuery, displayEquipmentsValue,displayMusclesValue,displayWeightsValue,displayExerciseTypeValue]);
    
      
        const filterData = () => {
          const filtered = fetchedData?.filter((item) => {

            const nameMatches = item.wktNam.toLowerCase().includes(searchQuery.toLowerCase());
            
          
            const equipmentsFilterMatches = displayEquipmentsValue ? item.eqpUsd === displayEquipmentsValue : true;

            const itemMajorMuscleGroupOne = displayMusclesValue ? item.mjMsOn === displayMusclesValue : true;
            const itemMajorMuscleGroupTwo = displayMusclesValue ? item.mjMsTw === displayMusclesValue : true;
            const itemMajorMuscleGroupThree = displayMusclesValue ? item.mjMsTr === displayMusclesValue : true;

            const weightsFilterMatches = displayWeightsValue ? item.witUsd === displayWeightsValue : true;
            
            const exerciseTypeFilterMatches = displayExerciseTypeValue ? item.exrTyp === displayExerciseTypeValue : true;
             // filter by userID
             const filterByUserId = () => {
              if (selectedFilter === 'ourWorkouts') {
                return item.userId == "appAssets";
              } else if (selectedFilter === 'yourWorkouts') {
                return item.userId == userId;
              }
              return true;
            };
            // const benchesAndRacksFilterMatches = displayBenchesAndRacksValue ? item.benchesAndRacks === displayBenchesAndRacksValue : true;
            if(nameMatches || equipmentsFilterMatches || itemMajorMuscleGroupOne || itemMajorMuscleGroupTwo || itemMajorMuscleGroupThree || weightsFilterMatches || exerciseTypeFilterMatches|| filterByUserId()){
              setCurrentPage(1);
            }
            // Return true if the Workout matches all selected criteria
            return nameMatches && equipmentsFilterMatches && (itemMajorMuscleGroupOne || itemMajorMuscleGroupTwo || itemMajorMuscleGroupThree) && weightsFilterMatches && exerciseTypeFilterMatches && filterByUserId();
  
            });
        
            setTotalItems(filtered?.length);
            ////console.log('filtered?.length',filtered?.length);
            setTotalPages(Math.ceil(filtered?.length / pageSize));
            ////console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));
            setFilteredData(filtered);
            ////console.log('filtered',filtered);
            ////console.log('currentPage inside',currentPage);

          };
        const clearFilter = () => {
          setSelectedMuscles(''); 
          setSelectedEquipments('');
          setSelectedWeights('');
          setSelectedExerciseType('');
          setSelectedFilter('');

          // setSelectedBenchesAndRacks('');
        };
      

        useEffect(() => {
          filterData();
        }, [selectedFilter,searchQuery, displayEquipmentsValue,displayMusclesValue,displayWeightsValue,displayExerciseTypeValue]);     
        const handlePageChange = (page) => {
          setCurrentPage(page);
        };
        ////console.log('currentPage outside',currentPage);
        // Calculate the range of page numbers to display
        const minPage = Math.max(1, currentPage - 2);
        const maxPage = Math.min(totalPages, currentPage + 2);


        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const visibleData = filteredData.slice(startIdx, endIdx);  

        // Render the pagination buttons
        const renderPaginationButtons = () => {
          const buttons = [];
          if ((currentPage - 5) >= 1) {
            buttons.push(
              (isArabic)?(
              <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              ):(
                <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              )
            );
          }
          // Render button for previous page
          if (currentPage > 1) {
            buttons.push(
              (isArabic)?(
                <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                  <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                  <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                )
              
            );
          }

          // Render buttons for pages before the current page
          for (let i = minPage; i < currentPage; i++) {
            buttons.push(
              <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                <Text style={{color:'#000'}}>{i}</Text>
              </TouchableOpacity>
            );
          }

          // Render button for current page
          buttons.push(
            <TouchableOpacity  style={{backgroundColor:'transparent',borderWidth:2,borderColor:"#3f7eb3",width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={currentPage} disabled>
              <Text style={{color:'#3f7eb3'}}>{currentPage}</Text>
            </TouchableOpacity>
          );

          // Render buttons for pages after the current page
          for (let i = currentPage + 1; i <= maxPage; i++) {
            buttons.push(
              <TouchableOpacity style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                <Text style={{color:'#000'}}>{i}</Text>
              </TouchableOpacity>
            );
          }

          // Render button for next page
          if (currentPage < totalPages) {
            buttons.push(
              (isArabic)?(
                <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                  <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                  <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                    <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                  </TouchableOpacity>
                )
              
            );
          }
          if (currentPage+5 <= totalPages) {
            buttons.push(
              (isArabic)?(
              <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              ):(
                <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
              </TouchableOpacity>
              )
            );
          }
          return buttons;
        };


        // const handleSendingSetsExerData = () => {
        //   // Navigate to the desired page and pass route parameters
        //   const updatedTotalSets = Object.values(selectedExercises).reduce((totalSets, exercise) => totalSets + exercise.sets, 0);
        //   const updatedTotalExercises = Object.keys(selectedExercises).length;
        //   onSelectGetExerAndSetsData(updatedTotalSets, updatedTotalExercises,dayNameInput,selectedExerciseRows);
        //   onClose();
        // };
      const [hideButtonClicks, setHideButtonClicks] = useState(false);

      function isImageUrl(url) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
        const lowercasedUrl = url?.toLowerCase();
        return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
      }
      consFun=()=>{
        const daySpeKey = publicWorkoutsPlanRowConArr?.trnrId + '.' + new Date().getTime();
        let updatedExercisesWithDayName=[];
        if (gettedSelectedExercises?.length > 0 ){
          if(dayNameInput === "" || dayNameInput.trim() === "") { 
            Alert.alert(`${t('You_didn_t_enter_day_s_name')}`);
            return;
          }
         //setHideButtonClicks(true);
         setLoading(true);

        //  const updatedExercisesWithDayName = gettedSelectedExercises.map((exercise) => ({
        //     ...exercise,
        //     dayNam: dayNameInput, // Update dayNam with the value of dayNameInput
        //     speKey:sentDaySpeKey ? sentDaySpeKey : daySpeKey,
        //   }));
          const newSpeKey = sentDaySpeKey ? sentDaySpeKey : daySpeKey;
          const updatedExercisesWithDayName ={trnrId:publicWorkoutsPlanRowConArr?.trnrId,planId:publicWorkoutsPlanRowConArr?.id,speKey:newSpeKey,dayNam: dayNameInput,wrkAry:newWrkAry};
          // insertPlansPublicWorkoutsPlanDays(updatedExercisesWithDayName).then((result)=>{
          //   ////console.log('insertPlansPublicWorkoutsPlanDays into database successfully',result);
          //   Alert.alert(' ',
          //   'Your exercises added successfully ',
          //   [
          //     {
          //       text: 'OK',
          //       onPress: () => {
          //         navigation.navigate('WorkoutPlans');
          //       },
          //     },
          //   ],
          //   { cancelable: false }
          // );
          // }).catch((error) => {
          //   Alert.alert('Error',
          //   error);
          //   setHideButtonClicks(false);
          // });
          //console.log('gettedSelectedExercises',gettedSelectedExercises);

          
          //console.log('updatedExercisesWithDayName',updatedExercisesWithDayName);
          // gettedSelectedExercises.forEach(async workoutData => {
          //   let WorkoutsFormData = new FormData();
           
            
          //   let workoutInfo = {
          //     wrkSts: workoutData.wrkSts,
          //     wrkKey: workoutData.speKey,
          //     wktNam:workoutData.wktNam,
          //     exrTyp:workoutData.exrTyp,
          //     exrTim:workoutData.exrTim,
          //     lstUpd:workoutData.lstUpd,
          //     exrStu:workoutData.exrStu,
          //     eqpUsd:workoutData.eqpUsd,
          //     witUsd:workoutData.witUsd,
          //     wktStp:workoutData.wktStp,
          //     pfgWkt:workoutData.pfgWkt,
          //     mjMsOn:workoutData.mjMsOn,
          //     mjMsTw:workoutData.mjMsTw,
          //     mjMsTr:workoutData.mjMsTr,
          //     mnMsOn:workoutData.mnMsOn,
          //     mnMsTo:workoutData.mnMsTo,
          //     mnMsTr:workoutData.mnMsTr,
          //     imageName:(imageName) ? imageName : '',  
          //   };
          //   let wrkArystringified = JSON.stringify(workoutInfo);

          // })
          const updatedExercises = gettedSelectedExercises.map((workoutData) => {
            // Assuming imageName is a variable you already have, otherwise set it to null or an empty string.
            // let imageUri = workoutData?.images;
            // let imageName = "";
            
            // if(imageUri.startsWith('file:///data/user')){
            //   // let imageExt = "";
            //   if(imageUri){
            //     //   // Access local image file
            //     imageName = imageUri.split('workouts_thumbnails/').pop();
            //     // imageExt = imageUri.split('.').pop();   
            //   } 
            
            // }else if(imageUri.startsWith('../../../../assets/images')){
            //   imageName = imageUri;
            // }else if(imageUri.startsWith('https://www.elementdevelops.com')){
            //   imageName = imageUri;
            // }else if(imageUri.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')){
            //       imageName = imageUri;
            //     }
                
            //     let videoUri = workoutData?.videos;
            //     let videoName = "";
            //     let videoExt = "";
            //     if(videoUri && storedUserConst?.['role'] == "Trainer"){
            //       if(videoUri){
    
            //       //   // Access local image file
            //       if(videoUri.startsWith('file:///data/user')){
            //         // let imageExt = "";
            //           //   // Access local image file
            //           videoName = videoUri.split('videos/').pop();
            //           videoExt = videoName.split('.').pop();   
    
            //         }else if(videoUri.startsWith('https://www.elementdevelops.com')){
            //           videoName = videoUri;
            //         }else if(videoUri.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')){
            //           videoName = videoUri;
            //         }
                  
            //       }
            //     }
            //console.log('imageName',imageName);
            // //console.log('imageUri',imageUri);
            // //console.log('imageExt',imageExt);
        
            let workoutInfo = {
              wrkSts: workoutData.wrkSts,
              wrkKey: workoutData.wrkKey,  // Using wrkKey from the original object
              wktNam: workoutData.wktNam,
              exrTyp: workoutData.exrTyp,
              exrTim: workoutData.exrTim,
              lstUpd: workoutData.lstUpd,
              exrStu: workoutData.exrStu,
              eqpUsd: workoutData.eqpUsd,
              witUsd: workoutData.witUsd,
              wktStp: workoutData.wktStp,
              pfgWkt: workoutData.pfgWkt,
              mjMsOn: workoutData.mjMsOn,
              mjMsTw: workoutData.mjMsTw,
              mjMsTr: workoutData.mjMsTr,
              mnMsOn: workoutData.mnMsOn,
              mnMsTo: workoutData.mnMsTo,
              mnMsTr: workoutData.mnMsTr,
              images: workoutData?.images,
              videos:workoutData?.videos,
              // videos: (videoName && storedUserConst?.['role'] == "Trainer") ? videoName : '',
              // images: imageName || '',  // Use imageName if it exists, otherwise set it to an empty string
            };
          
            return workoutInfo;
          });
          
          //console.log('updatedExercises',updatedExercises);
          const newWrkAry = JSON.stringify(updatedExercises);

          // const WorkoutsFormData = new FormData();
          // WorkoutsFormData.append('trnrId', publicWorkoutsPlanRowConArr?.trnrId);
          // WorkoutsFormData.append('planId', publicWorkoutsPlanRowConArr?.id);
          // WorkoutsFormData.append('speKey', sentDaySpeKey ? sentDaySpeKey : daySpeKey);
          // WorkoutsFormData.append('dayNam', dayNameInput);
          // WorkoutsFormData.append('wrkAry', newWrkAry);
          // Append each image to the FormData
          // gettedSelectedExercises.forEach((workout, index) => {
            
          //   let imageUri = workout?.images;
          //   let imageName = "";
          //   let imageExt = "";
              
          //     if(imageUri){
          //       if(imageUri.startsWith('file:///data/user')){

          //         // Access local image file
          //         imageName = imageUri.split('workouts_thumbnails/').pop();
          //         imageExt = imageUri.split('.').pop();   

          //         WorkoutsFormData.append(`images[${index}]`, {
          //           uri:imageUri,
          //           name: `${imageName}`,
          //           type: `image/${imageExt}` // Adjust type based on your images' format

          //         });
          //       }
          //     }
            
          //   let videoUri = workout?.videos;
          //   let videoName = "";
          //   let videoExt = "";
          //   console.log('videoUri index',index,videoUri);

          //     //   // Access local image file
          //     if(videoUri){

          //     if(videoUri.startsWith('file:///data/user')){
          //       // let imageExt = "";
          //         //   // Access local image file
          //         videoName = videoUri.split('videos/').pop();
          //         videoExt = videoName.split('.').pop();   
          //         WorkoutsFormData.append(`videos[${index}]`, {
          //           uri: videoUri,
          //           name:  `${videoName}`,
          //           type: `video/${videoExt}`
          //         });

          //       } 
          //     }
            
          // });
          const WorkoutsObjectData = {
            trnrId:publicWorkoutsPlanRowConArr?.trnrId,
            planId:publicWorkoutsPlanRowConArr?.id,
            speKey:sentDaySpeKey ? sentDaySpeKey : daySpeKey,
            dayNam:dayNameInput,
            wrkAry:newWrkAry,
          };
          // console.log('WorkoutsObjectData',WorkoutsObjectData);

          if(triainerConnected) {
            axios.post(`https://www.elementdevelops.com/api/trainer-workouts-predefined-plan-day-insert`,WorkoutsObjectData)
            .then((response) => {
              setAddNewWorkout(true);
              setLoading(false);
              setTimeout(() => {

              Alert.alert(`${t(' ')}`,`${t("Your_Day_s_Workouts_added_to_Database_successfully")}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.dispatch(StackActions.pop(1));
                    },
                  },
                ],
                { cancelable: false }
              );
            }, 500); // .5 seconds delay

            })
            .catch(error => {
              //console.log('error');
              //console.log('error',error);
              setLoading(false);
              setTimeout(() => {
                Alert.alert(error?.response?.data?.message);
              }, 500); // .5 seconds delay

            });
          } else {
            setLoading(false);

            Alert.alert(`${t('To_Add_your_data')}`, `${t('You_must_be_connected_to_the_internet')}`);
          }
          
          // if(triainerConnected){
            //   axios.post(`https://www.elementdevelops.com/api/trainer-trainee-plan-day-insert`, updatedExercisesWithDayName)
            //   .then((response) => {
            //       ////console.log('Trainer plan day data sent to online Database', response?.data?.message);
            //       setAddNewWorkout(true);
            //       Alert.alert(`${t(' ')}`,`${t("Your_Day_s_Workouts_added_to_Database_successfully")}`,
            //                 [
            //                 {
            //                     text: 'OK',
            //                     onPress: () => {
            //                       navigation.dispatch(StackActions.pop(1));
            //                     },
            //                 },
            //                 ],
            //                 { cancelable: false }
            //             );
                    
            //           })
            //           .catch(error => {
            //             // Handle error
            //             Alert.alert(error?.response?.data?.message);
            //           });
            
            //   // insertTrainerPricingCurrency(newData).then((response) => {
            //   //   ////console.log('Trainer Pricing data sent to offline database', response);
            //   //       }).catch(error => {
            //   //         // Handle error
            //   //         //console.error('Error inserting Trainer Pricing:', error);
            //   //       });   
            // }else{
            //   Alert.alert(`${t('To_Add_your_data')}`,
            //   `${t('You_must_be_connected_to_the_internet')}`);
            // }
        }else{
          Alert.alert(`${t("You_didn_t_select_any_exercises")}`);
        }
      }
      ////console.log('gettedSelectedExercises', gettedSelectedExercises);
      const isExerciseSelected = (exrSpeId) =>
        gettedSelectedExercises.some((exercise) => exercise.id === exrSpeId);
      const handleUnselectOneSelectedExercisesPress = (item) => {
        const exercisewrkKey = item.wrkKey;
        //console.log('exercisewrkKey',exercisewrkKey);
        //console.log('item exerciseKey',item);

        // Check if the exercise is already selected
        const indexToRemove  = gettedSelectedExercises.findIndex((exercise) => exercise.wrkKey === exercisewrkKey);
        //console.log('indexToRemove',indexToRemove);
    
        if (indexToRemove  !== -1) {
          // Exercise is already selected, remove it
          //const updatedSelectedExercises = [...selectedExercises];
          //updatedSelectedExercises.splice(index, 1);
          
          //console.log('index',indexToRemove );
         
    
        setGettedSelectedExercises((prevSelectedExercises) =>
          prevSelectedExercises.filter((_, index) => index !== indexToRemove)
        );
        } 
      };
      const handleOpenSelectedExercisesView = (item) => {
        //console.log("handleOpenSelectedExercisesView item",item);
        Alert.alert(
          ``,
          `${t('Choose_an_action_for_the_selected_exercise')}`,
          [
            {
              text: `${t('Edit_Sets')}`,
              onPress: () => {
                setShowSetInputSelectedView(true);
                setSetsSelectedInput('');
                setSelectedExerciseSelectedView(item);
              },
            },
            {
              text: `${t('Unselect')}`,
              onPress: () => {
                handleUnselectOneSelectedExercisesPress(item);
              },
            },
            {
              text: `${t('Cancel')}`,
              onPress: () => {},
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      };
      const handleOneSelectedExercisesOkPress = (selectedExerciseSelectedView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises) => {
        
        const exerciseWrkKey = selectedExerciseSelectedView.wrkKey;
    
        const enteredSets = parseInt(setsSelectedInput, 10) || 0;
        if(enteredSets ==0 || enteredSets == ""){
          Alert.alert(`${t("you_must_enter_number")}`);
          return;
        } 
        if(enteredSets >50){
          Alert.alert(`${t("maximum_sets_should_be_fifty")}`);
          return;
        } 
        //console.log('exerciseWrkKey handleOneSelectedExercisesOkPress',exerciseWrkKey);
        //console.log('gettedSelectedExercises handleOneSelectedExercisesOkPress',gettedSelectedExercises);

        //console.log('selectedExerciseSelectedView handleOneSelectedExercisesOkPress',selectedExerciseSelectedView);
        setGettedSelectedExercises((prevSelectedExercises) => {
          const updatedExercises = prevSelectedExercises.map((exercise) => {
            if (exercise.wrkKey === exerciseWrkKey) {
              // Update the existing exercise
              //console.log('exercise.wrkKey === exerciseWrkKey',exercise.wrkKey);
              return {
                ...exercise,
                wrkSts: enteredSets,
                wrkKey: selectedExerciseSelectedView.wrkKey,
                wktNam: selectedExerciseSelectedView.wktNam,
                exrTyp: selectedExerciseSelectedView.exrTyp,
                exrTim:selectedExerciseSelectedView.exrTim,
                lstUpd:selectedExerciseSelectedView.lstUpd,
                exrStu:selectedExerciseSelectedView.exrStu,
                eqpUsd: selectedExerciseSelectedView.eqpUsd,
                witUsd: selectedExerciseSelectedView.witUsd,
                wktStp: selectedExerciseSelectedView.wktStp,
                pfgWkt: selectedExerciseSelectedView.pfgWkt,
                mjMsOn: selectedExerciseSelectedView.mjMsOn,
                mjMsTw: selectedExerciseSelectedView.mjMsTw,
                mjMsTr: selectedExerciseSelectedView.mjMsTr,
                mnMsOn: selectedExerciseSelectedView.mnMsOn,
                mnMsTo: selectedExerciseSelectedView.mnMsTo,
                mnMsTr: selectedExerciseSelectedView.mnMsTr,
                images: selectedExerciseSelectedView.images,
                videos:selectedExerciseSelectedView.videos


              };
            }
            return exercise;
          });
          return updatedExercises;
        }); 
          setNumberOfSelectedExercisesView(gettedSelectedExercises?.length);
          setShowSetInputSelectedView(false);
      };
      
    return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
             <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loading}

                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
            </Modal>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>
                  {/* <View>
                    <Text>Total Sets: {Object.values(selectedExercises).reduce((totalSets, exercise) => totalSets + exercise.sets, 0)}</Text>
                    <Text>Total Exercises: {Object.keys(selectedExercises).length}</Text>
                  </View> */}
                  {t("Day_s_Exercises")}
                </ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                <FormElemeentSizeButtonView style={{width:"100%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>consFun()}>
                      <CalendarFullSizePressableButtonText >{t("Add_Workout_s_Exercises")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  {/* <FormElemeentSizeButtonView style={{width:"40%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}>
                      <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView> */}
                </FormElemeentSizeButtonParentView>
              </Spacer>
              <Spacer>
                <InputField style={{marginTop:10,marginBottom:10}}>
                  <FormLabelView style={{width:"40%"}}>
                    <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Workout_Name")}:</FormLabel>
                  </FormLabelView>
                  <FormInputView style={{width:"60%"}}>
                    <FormInput
                      placeholder={t("Workout_Name")}
                      value={dayNameInput}
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(text) => setDayNameInput(text)}
                    />
                  </FormInputView>
                </InputField>
              </Spacer>
            <View style={{marginBottom:20,marginRight:10,marginLeft:10}}>
              <FormInput
                placeholder={t("Search")}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                theme={{colors: {primary: '#3f7eb3'}}}
              />
              <FilterTextView >
                <FilterText onPress={()=>
                  {toggleFilter();
                    clearFilter();
                  }} >{t("Filter")}</FilterText>
              </FilterTextView>
              {showFilter && (
                <FilterContainer >
                  <InputField>
                    <FormLabelView>
                      <FormLabel>{t("Machines")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                    <Select
                        onSelect={(index) => {
                          setSelectedEquipments(index);
                          }}
                        placeholder={t('Select_Machine')}
                        value={displayEquipmentsValue}
                        style={{marginBottom:10}}
                        status="newColor"
                        size="customSizo"
                      >
                        {equipmentsData.map(renderEquipmentsOption)}
                      </Select>
                    </FormInputView>  
                  </InputField>
                  <InputField>
                    <FormLabelView>
                      <FormLabel>{t('Muscles')}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                      <Select
                        onSelect={(index) => {
                          setSelectedMuscles(index);
                          }}
                        placeholder={t('Select_Muscles')}
                        value={displayMusclesValue}
                        status="newColor"
                        size="customSizo"
                      >
                        {musclesData.map(renderMusclesOption)}
                      </Select>
                    </FormInputView>  
                  </InputField>
                <Spacer size="medium">
                  <InputField>
                    <FormLabelView >
                        <FormLabel >{t('Weights')}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                    <Select
                        onSelect={(index) => {
                            setSelectedWeights(index);
                            }}
                        placeholder={t('Select_Weights')}
                        value={displayWeightsValue}
                        style={{marginBottom:10}}
                        status="newColor"
                        size="customSizo"
                        >
                        {weightsData.map(renderWeightsOption)}
                        </Select>
                    </FormInputView>  
                  </InputField>
                </Spacer>
                <Spacer size="small">
                  <InputField>
                    <FormLabelView >
                        <FormLabel >{t('Exercise_Type')}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                    <Select
                        onSelect={(index) => {
                          setSelectedExerciseType(index);
                            }}
                        placeholder={t("Select_ExerciseType")}
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
                {/* <Spacer size="medium">
                  <InputField>
                    <FormLabelView >
                        <FormLabel >Benches & Racks:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                    <Select
                        onSelect={(index) => {
                          setSelectedBenchesAndRacks(index);
                            }}
                        placeholder='Select Benches & Racks'
                        value={displayBenchesAndRacksValue}
                        style={{marginBottom:10}}
                        >
                        {benchesAndRacksData.map(renderBenchesAndRacksOption)}
                        </Select>
                    </FormInputView>  
                  </InputField>
                </Spacer> */}
                <Spacer size="medium">
                        <TraineeOrTrainerField>
                            <FormLabelView>
                            <FormLabel>{t("Workouts")}:</FormLabel>
                            </FormLabelView>
                          <TraineeOrTrainerButtonsParentField style={{top:-5}}>
                            <TraineeOrTrainerButtonField >
                              <RadioButton
                                value="ourWorkouts"
                                status={ selectedFilter === 'ourWorkouts' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('ourWorkouts')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                                
                              />
                              <FormLabel>{t("our_workouts")}</FormLabel>
                          </TraineeOrTrainerButtonField>
                            <TraineeOrTrainerButtonField>
                              <RadioButton
                                value="yourWorkouts"
                                status={ selectedFilter === 'yourWorkouts' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('yourWorkouts')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                              />
                              <FormLabel>{t("your_workouts")}</FormLabel>
                            </TraineeOrTrainerButtonField>
                        </TraineeOrTrainerButtonsParentField>
                      </TraineeOrTrainerField>
                    </Spacer>
                    <ClearFilterTextView>
                    <ClearFilterTouchableOpacity onPress={clearFilter}>
                      <ClearFilterText>{t('Clear_Filter')}</ClearFilterText>
                      </ClearFilterTouchableOpacity>
                    </ClearFilterTextView>
                    
                    
                </FilterContainer>
              )}
              
              {gettedSelectedExercises.length !=0 && 
              <>
              <FormLabelView style={{width:"100%"}}>
                  <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Selected_exercises')}</FormLabel>
              </FormLabelView> 
              <BlackLineOnePixel></BlackLineOnePixel>
              <FlatList
                    data={gettedSelectedExercises}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                    <Pressable onPress={() => handleOpenSelectedExercisesView(item)}>

                      <ExerciseParentView>
                          <ExerciseImageView>
                            
                            
                                      <>
                                          {
                                            (isImageUrl(item?.images)) ? (
                                              
                                              <ExerciseImageViewImage source={
                                                    item?.images.startsWith('../../../../assets/images')
                                                      ? mainWorkoutsData[item?.wrkKey-1]?.images
                                                      : item?.images.startsWith('file:///data/user')
                                                      ? { uri: item?.images }
                                                      : item?.images.startsWith('https://www.elementdevelops.com')
                                                      ? { uri: item?.images }
                                                      : item?.images.startsWith('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23')
                                                      ? { uri: item?.images.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev') }
                                                      : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
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
                                                          />
                                                  
                                                )}
                                              </>
                                            
                                              );
                                            } else {
                                                  return (
                                                    <ExerciseImageViewImage
                                                      source={require("../../../../assets/gym-workout.png")}
                                                      />
                                                  );
                                                }
                                              })()
                                            )
                                          }
                                          </>
                          </ExerciseImageView>
                          <ExerciseInfoParentView>
                            <ExerciseInfoTextHead style={{fontSize:16}}>{item.wktNam}</ExerciseInfoTextHead>
                            {(item.mjMsOn) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsOn}</ExerciseInfoTextTag>) : (null)}
                            {(item.mjMsTw) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTw}</ExerciseInfoTextTag>) : (null)}
                            {(item.mjMsTr) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTr}</ExerciseInfoTextTag>) : (null)}
                            {(item.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14 ,color:"#000", fontWeight:"bold"}}>{item.eqpUsd}</ExerciseInfoTextTag>) : (null)}
                            {(item.wrkSts) ? (<ExerciseInfoTextTag style={{ fontSize: 15,color:"#000", fontWeight:"bold"}}>Sets: {parseInt(item.wrkSts)}</ExerciseInfoTextTag>) : (null)}
                          </ExerciseInfoParentView>
                            {isExerciseSelected(item.id) && <Text style={{ color: 'green',marginVertical:10,fontSize:20 }}>✔</Text>}
                            <Modal transparent visible={showSetInputSelectedView} >
                              <View style={{ flexDirection: 'row', alignItems: 'center',width:260,height:260, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                                <Text style={{ color: 'white',marginRight:5 }}>{t('Sets_number')}</Text>
                                <TextInput
                                  style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                                  placeholder={t("Sets")}
                                  keyboardType="numeric"
                                  value={setsSelectedInput}
                                  onChangeText={(text) => setSetsSelectedInput(text)}
                                />
                                <Pressable onPress={() => handleOneSelectedExercisesOkPress(selectedExerciseSelectedView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises)}>
                                  <Text style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5,padding:9 }}>{t("OK")}</Text>
                                </Pressable>
                                <Pressable onPress={() => setShowSetInputSelectedView(false)}>
                                  <Text style={{ color: 'white',borderWidth: 1,marginLeft:10, borderColor: 'white', borderRadius: 5,padding:9 }}>X</Text>
                                </Pressable>
                              </View>
                            </Modal>
                        </ExerciseParentView>
                    </Pressable>
                    }
                />
              </>
              }

              {
                (loadingPageInfo)?(
                <View style={{height:640, alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>{t('Loading')}...</Text>
                    {/* <ActivityIndicator size="large" /> */}
                </View>
            ):(
              <>
              <FormLabelView style={{width:"100%"}}>
                  <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,marginTop:10}}>{t('Exercises')}</FormLabel>
              </FormLabelView> 
              
              <BlackLineOnePixel></BlackLineOnePixel>
              {
                (filteredData.length == 0)?(
                  <View style={{height:640, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>0 Workouts</Text>
                    {/* <ActivityIndicator size="large" /> */}
                  </View>
                ):(
                  <>
              <Spacer size="medium">
              <FlatList
                data={visibleData}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <MemoizedExerciseParentView item={item} navigation={navigation} filteredData={filteredData} dayNameInput={dayNameInput} userId={userId} publicWorkoutsPlanRowConArr={publicWorkoutsPlanRowConArr} setGettedSelectedExercises={setGettedSelectedExercises} gettedSelectedExercises={gettedSelectedExercises} fetchPublicSettingsData={fetchPublicSettingsData}/>}
                removeClippedSubviews={true}
                
              />
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginTop:20 }}>
                {renderPaginationButtons()}
              </View>
              </Spacer> 
              </>
              )
              }
              </>
            )
              }
              
              {/* <Modal transparent visible={isDayNameModalVisible} >
             <TextInput
                    style={{borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, width:100,marginRight: 10, backgroundColor: 'white' }}
                    placeholder="Day Name"
                    value={dayNameInput}
                    onChangeText={(text) => setDayNameInput(text)}
                  />   <View style={{ flexDirection: 'row', alignItems: 'center',width:250,height:250, backgroundColor:'#455357',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                
                  <Pressable  onPress={()=>{
                    if (dayNameInput.trim() !== ''){
                      handleSendingSetsExerData();
                    }else{
                      Alert.alert("You must fill the Day name field");
                      }
                    
                    }}>
                    <Text style={{ color: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 9 }}>OK</Text>
                  </Pressable>
                  <Pressable onPress={() => setIsDayNameModalVisible(false)}>
                    <Text style={{ color: 'white', borderWidth: 1, marginLeft: 10, borderColor: 'white', borderRadius: 5, padding: 9 }}>X</Text>
                  </Pressable>
                </View>
                </Modal> */}
              
            </View>
        </ScrollView>
      </PageContainer>
        );
      };  
const styles = StyleSheet.create({

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

});