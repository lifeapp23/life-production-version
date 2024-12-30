import React, { useState, useEffect, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Select, SelectItem  } from '@ui-kitten/components';
import { ScrollView,View,Alert,Text,TextInput,Modal,Pressable,Button,TouchableOpacity, Dimensions } from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton} from "react-native-paper";
import { fetchPublicSettings} from "../../../../database/workout_settings";

import {
    Title,
    TitleView,
    AsteriskTitle,
    InputField,
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
    FilterTextPressable,
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

const MemoizedExerciseParentView = React.memo(({ item, navigation,filteredData,dayNameInput,userId,publicWorkoutsPlanRowConArr, setGettedSelectedExercises ,gettedSelectedExercises,fetchPublicSettingsData  }) => {
  const [thumbnailUri, setThumbnailUri] = React.useState(null);
  const [selectedExerciseView, setSelectedExerciseView] = useState(null);
      const [numberOfExercisesView, setNumberOfExercisesView] = useState(0);
      const [showSetInputView, setShowSetInputView] = useState(false);
      const [setsInput, setSetsInput] = useState('');
      const [selectedExercises, setSelectedExercises] = useState([]);
      const [isDayNameModalVisible, setIsDayNameModalVisible] = useState(false);
      const [selectedExerciseRows, setSelectedExerciseRows] = useState({});
      const {t} = useTranslation();

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
  
//////////////Start check if the image in the local database////
const [localImageInMemory, setLocalImageInMemory] = useState(false);

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
        setLocalImageInMemory(exists);
      }
    };

    checkImageInMemory();
  }, [item?.images]);

//////////////End check if the image in the local database////


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

    // Check if the exercise is already selected
    const indexToRemove  = gettedSelectedExercises.findIndex((exercise) => exercise.wrkKey === exerciseKey);
    ////console.log('indexToRemove',indexToRemove);

    if (indexToRemove  !== -1) {
      // Exercise is already selected, remove it
      //const updatedSelectedExercises = [...selectedExercises];
      //updatedSelectedExercises.splice(index, 1);
      
      ////console.log('index',indexToRemove );
     

    setGettedSelectedExercises((prevSelectedExercises) =>
      prevSelectedExercises.filter((_, index) => index !== indexToRemove)
    );
    } else {
      // Exercise is not selected, show the set input view
      setShowSetInputView(true);
      setSetsInput('');
      setSelectedExerciseView(item);
      //console.log("setSelectedExerciseView(item)",item);
    }
  };


  const handleOkPress = (selectedExerciseView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises,fetchPublicSettingsData) => {
    const exerciseKey = selectedExerciseView.speKey;
    //console.log('fetchPublicSettingsData handleOkPress',fetchPublicSettingsData);

    let exrTim = '';
    
    if (selectedExerciseView.exrTyp === 'Cardio' || selectedExerciseView.exrTyp === 'Stability'){
      exrTim = fetchPublicSettingsData?.cardio;
    }else if (selectedExerciseView.exrTyp ==='Isolation'){
      exrTim = fetchPublicSettingsData?.isoltn;
    }else if(selectedExerciseView.exrTyp ==='Compound'){
      exrTim = fetchPublicSettingsData?.compnd;
    }
    // fetchPublicSettingsData
    const enteredSets = parseInt(setsInput, 10) || 0;
    //console.log('selectedExerciseView',selectedExerciseView);

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
          id: selectedExerciseView.id,
          userId: userId,
          dayNam: "",
          speKey: "",
          plnKey: publicWorkoutsPlanRowConArr.speKey,
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
          deleted: 'no',
          isSync: 'no',
        }  
      ]);
      setNumberOfExercisesView(gettedSelectedExercises.length);
      setShowSetInputView(false);
  };
  

  const isExerciseSelected = (exrSpeKey) =>
    gettedSelectedExercises.some((exercise) => exercise.wrkKey === exrSpeKey);

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
                      console.log("parsedData TRAINEEE-------:", parsedDataImages);
                    } catch (error) {
                      {/* console.error("Failed to parse item?.images:", error); */}
                      parsedDataImages = null;
                    }
                    
                    console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl);

                     
                if (localImageInMemory == true && parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
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
          {(item.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14,color:"#000", fontWeight:"bold" }}>{item.eqpUsd}</ExerciseInfoTextTag>) : (null)}
        </ExerciseInfoParentView>
          {isExerciseSelected(item.speKey) && <Text style={{ color: 'green',marginVertical:15 }}>✔</Text>}
            <Modal transparent visible={showSetInputView} >
            <View style={{ flexDirection: 'row', alignItems: 'center',width:260,height:260, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
              <Text style={{ color: 'white',marginRight:5 }}>{t('Sets_number')}</Text>
              <TextInput
                style={{ borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                placeholder={t("Sets")}
                keyboardType="numeric"
                value={setsInput}
                onChangeText={(text) => setSetsInput(text)}
              />
              <Pressable onPress={() => handleOkPress(selectedExerciseView,userId,publicWorkoutsPlanRowConArr,gettedSelectedExercises,fetchPublicSettingsData)}>
                <Text style={{ color: 'white',borderWidth: 1, borderColor: 'white', borderRadius: 5,padding:9 }}>{t("OK")}</Text>
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
export const SelectDayExercisesScreen = ({ navigation,route}) => {
      //const publicWorkoutsPlanRowConArr = route.params?.publicWorkoutsPlanRowCon;
      const { publicWorkoutsPlanRowConArr, sentDaySpeKey } = route.params;
      const [selectedFilter, setSelectedFilter] = useState(''); // State to manage the selected filter
      const [fetchPublicSettingsData, setFetchPublicSettingsData] = useState({}); // State to manage the selected filter
      
      ////console.log('publicWorkoutsPlanRowConArr',publicWorkoutsPlanRowConArr);
      ////console.log('sentDaySpeKey',sentDaySpeKey);
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      const [loadingPageInfo, setLoadingPageInfo] = useState(true);
      const [addNewWorkout, setAddNewWorkout] = useState(false);

      
      const [fetchedData, setFetchedData] = useState([]);
      const [filteredData, setFilteredData] = useState([]); 
      const [searchQuery, setSearchQuery] = useState('');
      const [showFilter, setShowFilter] = useState(false); // New state for filter visibility
      const [userId,setUserId] = useState('');
      const [gettedSelectedExercises,setGettedSelectedExercises] = useState([]);
      const [gettedSelectedExercisesBeforeChanging,setGettedSelectedExercisesBeforeChanging] = useState([]);

      

      useFocusEffect(
        useCallback(() => {
          //console.log("!addNewWorkout",addNewWorkout);
          const onBeforeRemove = (e) => {
            const hasChanges = compareArrays(gettedSelectedExercisesBeforeChanging, gettedSelectedExercises);
            if(!addNewWorkout){
           
              if(hasChanges) { 
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
      //let totalItems = filteredData?.length > 0 ? filteredData?.length : 1; // Total number of items in the dataset (can be obtained from the backend)
      //setTotalPages(Math.ceil(filteredData?.length / pageSize));
      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      const [dayNameInput, setDayNameInput] = useState('');
      
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
            setUserId(storedUser.id);
            fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
                //console.log('PSettingsResults',PSettingsResults?.[0]);

                // Set the state with the new resultMap
                setFetchPublicSettingsData(PSettingsResults?.[0]);
            
              });
            ////console.log('select day exer user',storedUser);
            fetchPublicWorkoutsPlanDaysWithoutDeleting(storedUser.id,publicWorkoutsPlanRowConArr.speKey).then((publicWorkoutsPlanDaysTableResults) => {
              
              const filteredArray = publicWorkoutsPlanDaysTableResults.filter(item => item.speKey === sentDaySpeKey);

                //console.log('filteredArray>>>---',filteredArray);
                setGettedSelectedExercises(filteredArray ? filteredArray : []);

                setGettedSelectedExercisesBeforeChanging(filteredArray ? filteredArray : []);

                
                setDayNameInput(filteredArray[0]?.dayNam ? filteredArray[0]?.dayNam: "");
            });

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
      //let totalItems = filteredData?.length; // Total number of items in the dataset (can be obtained from the backend)
      //let totalPages = Math.ceil(totalItems / pageSize);
      //setTotalPages(Math.ceil(totalItems / pageSize));
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
          

          const filtered = fetchedData.filter((item) => {

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
            if(nameMatches || equipmentsFilterMatches || itemMajorMuscleGroupOne || itemMajorMuscleGroupTwo || itemMajorMuscleGroupThree || weightsFilterMatches || exerciseTypeFilterMatches || filterByUserId()){
              setCurrentPage(1);
            }
            // Return true if the Workout matches all selected criteria
            return nameMatches && equipmentsFilterMatches && (itemMajorMuscleGroupOne || itemMajorMuscleGroupTwo || itemMajorMuscleGroupThree) && weightsFilterMatches && exerciseTypeFilterMatches && filterByUserId();
  
            });
            // setCurrentPage("");
            //totalItems = filtered?.length; // Total number of items in the dataset (can be obtained from the backend)
            setTotalItems(filtered?.length);
            ////console.log('filtered?.length',filtered?.length);
            setTotalPages(Math.ceil(filtered?.length / pageSize));
            ////console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));
            setFilteredData(filtered);
            ////console.log('filtered',filtered);
            //setCurrentPage(currentPage ? currentPage : 1);
            
            ////console.log('currentPage inside',currentPage);
             // Reset current page to 1 when filtering
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
       // Assuming filteredData is the array of data after filtering

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
      const [isPressDisabled, setPressDisabled] = useState(false);

      const consFun=()=>{
        

        const daySpeKey = userId + '.' + new Date().getTime();
        let updatedExercisesWithDayName=[];
        if (gettedSelectedExercises.length > 0 ){
          if(dayNameInput === "" || dayNameInput.trim() === "") { 
            Alert.alert(`${t("You_didn_t_enter_day_s_name")}`);
            return;
          }
          // if (isPressDisabled) return;
          // setPressDisabled(true);
         const updatedExercisesWithDayName = gettedSelectedExercises.map((exercise) => ({
            ...exercise,
            dayNam: dayNameInput, // Update dayNam with the value of dayNameInput
            speKey:sentDaySpeKey ? sentDaySpeKey : daySpeKey,
          }));
          
          insertPlansPublicWorkoutsPlanDays(updatedExercisesWithDayName).then((result)=>{
            ////console.log('insertPlansPublicWorkoutsPlanDays into database successfully',result);
            setAddNewWorkout(true);
            Alert.alert(`${t(' ')}`,
            `${t('Your_exercises_added_successfully')}`,
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
          }).catch((error) => {
            Alert.alert(` `,
            error);
          });
          // setTimeout(() => {
          //   setPressDisabled(false);
          // }, 2000); // Disable press for 300ms to prevent quick successive presses
          // ////console.log('updatedExercisesWithDayName',updatedExercisesWithDayName);
        }else{
          Alert.alert(`${t("You_didn_t_select_any_exercises")}`);
        }
      }
      //console.log('gettedSelectedExercises', gettedSelectedExercises);
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
        const exerciseId = selectedExerciseSelectedView.id;
    
        const enteredSets = parseInt(setsSelectedInput, 10) || 0;
        if(enteredSets ==0 || enteredSets == ""){
          Alert.alert(`${t("you_must_enter_number")}`);
          return;
        } 
        if(enteredSets >50){
          Alert.alert(`${t("maximum_sets_should_be_fifty")}`);
          return;
        } 
        //console.log('selectedExerciseSelectedView.exrTyp handleOneSelectedExercisesOkPress',selectedExerciseSelectedView.exrTyp);

        setGettedSelectedExercises((prevSelectedExercises) => {
          const updatedExercises = prevSelectedExercises.map((exercise) => {
            if (exercise.id === exerciseId) {
              // Update the existing exercise
              return {
                ...exercise,
                userId: userId,
                dayNam: "",
                speKey: "",
                plnKey: publicWorkoutsPlanRowConArr.speKey,
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
                deleted: 'no',
                isSync: 'no',
              };
            }
            return exercise;
          });
          return updatedExercises;
        }); 
          setNumberOfSelectedExercisesView(gettedSelectedExercises?.length);
          setShowSetInputSelectedView(false);
      };

const SelectedExerciseListItem = ({ item, handleOpenSelectedExercisesView, isExerciseSelected, handleOneSelectedExercisesOkPress, setsSelectedInput, setSetsSelectedInput, t, showSetInputSelectedView, setShowSetInputSelectedView }) => {
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
    <Pressable onPress={() => handleOpenSelectedExercisesView(item)}>

      <ExerciseParentView>
          <ExerciseImageView>
            
            {/* <ExerciseImageViewImage source={
              item?.images.startsWith('../../../../assets/images')
                ? mainWorkoutsData[item?.wrkKey-1]?.images
                : item?.images.startsWith('file:///data/user')
                ? { uri: item?.images }
                : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                /> */}
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
      );

    
    }
      //console.log('fetchPublicSettingsData out',fetchPublicSettingsData);
    return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
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
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}  onPress={()=>consFun()}>
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
              <FilterTextPressable  onPress={()=>
                  {toggleFilter();
                    clearFilter();
                  }}>
                <FilterText>{t("Filter")}</FilterText>
                </FilterTextPressable>
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
                        placeholder={t('Select_Exercise_Type')}
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
                    renderItem={({ item }) => (
                        <SelectedExerciseListItem
                          item={item}
                          handleOpenSelectedExercisesView={handleOpenSelectedExercisesView}
                          isExerciseSelected={isExerciseSelected}
                          handleOneSelectedExercisesOkPress={handleOneSelectedExercisesOkPress}
                          setsSelectedInput={setsSelectedInput}
                          setSetsSelectedInput={setSetsSelectedInput}
                          t={t}
                          showSetInputSelectedView={showSetInputSelectedView}
                          setShowSetInputSelectedView={setShowSetInputSelectedView}
                        />
                      )}
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
                  />   <View style={{ flexDirection: 'row', alignItems: 'center',width:250,height:250, backgroundColor:'#000',justifyContent:'center',left:70,top:"60%",borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                
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