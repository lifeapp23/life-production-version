
import React, { useState, useEffect } from 'react';
import { ScrollView,Animated ,FlatList,Modal,StyleSheet,Alert,ActivityIndicator,Pressable,Text,TouchableOpacity,View } from 'react-native'; 
import { Select, SelectItem  } from '@ui-kitten/components';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton} from "react-native-paper";
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';
import { Spacer } from "../../../components/spacer/spacer.component";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Camera } from "expo-camera";
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Asset } from 'expo-asset';
import { mainWorkoutsData } from "../../../../main_data/main_workouts_data";
import { mainWorkoutsDataWithoutRequire } from "../../../../main_data/main_workouts_data_without_require";
import * as SQLite from 'expo-sqlite';
import { addEventListener } from "@react-native-community/netinfo";
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
    PageMainImage,
    ServicesPagesCardAvatarIcon,
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
    FilterTextPressable,
    ClearFilterTextView,
    ClearFilterTouchableOpacity,
    ClearFilterText,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,
    ViewOverlay,
    FullSizeButtonView,
    FullButton,
    TraineeOrTrainerField,
    TraineeOrTrainerButtonsParentField,
    TraineeOrTrainerButtonField,
    FormInputSizeButton,
    ServiceInfoParentView,
    ServiceCloseInfoButtonView,
    ServiceCloseInfoButton,
    ServiceCloseInfoButtonAvatarIcon,
    ServiceCloseInfoButtonText,
    ServiceInfoButtonView,
    ServiceInfoButton,
    ServiceInfoButtonAvatarIcon,
    ServiceCloseInfoButtonTextView,

  
  } from "../components/account.styles";
import { fetchWorkoutsTable} from "../../../../database/workoutsTable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
 
import { useDate } from './DateContext'; // Import useDate from the context
// Define ExerciseParentView as a memoized component

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

const MemoizedExerciseParentView = React.memo(({ item, navigation ,traineeData,userDataArray}) => {
  const [thumbnailUri, setThumbnailUri] = React.useState(null);
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
        ////console.log('asset before', asset);
        //await asset.downloadAsync();
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
          time: 5000,
        });
        thumbnailUri = uri;
        ////console.log('thumbnailUri', thumbnailUri);
      } else if (videoPath.startsWith('file:///data/user')) {
        // The video is already a file URI
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoPath, {
          time: 5000,
        });
        thumbnailUri = uri;
      }
  
      setThumbnailUri(thumbnailUri);
      //console.log('uri4444', thumbnailUri);
    } catch (e) {
      //console.log('Error generating video thumbnail:', e);
    }
  };
  
  
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


  
// convert item video into thumbnails
  // React.useEffect(() => {

  //   if (isVideoUrl(item.wktMda)) {
  //     generateVideoThumbnailAsync(item.wktMda);
  //   }
  // }, [item]);
//console.log('item===',item);


  return (
    <Pressable style={{marginBottom:10}}  onPress={() => navigation.navigate('WorkoutName', { item: item,userComeFromExercisePage:true,traineeData:traineeData })}>

      <ExerciseParentView >

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
                                        
                                        resizeMode="stretch" // Ensures the entire image is displayed
                                        /> */}
              <>
            { isImageUrl(item?.images) ? (
              <ExerciseImageViewImage source={
                  item?.images.startsWith('../../../../assets/images')
                    ? mainWorkoutsData[item?.id-1]?.images
                    : item?.images.startsWith('file:///data/user')
                    ? { uri: item?.images }
                    : require('../../../../assets/gym-workout.png')} // Set an appropriate default or handle other cases
                    
                    resizeMode="stretch" // Ensures the entire image is displayed
                    />
            ) :(
            (() => {
              let parsedData;
              try {
                // Parse item?.images
                parsedData = JSON.parse(item?.images);
                console.log("parsedData-------:", parsedData);

              } catch (error) {
                {/* console.error("Failed to parse item?.images:", error); */}
                parsedData = null;
              }
              console.log("parsedData?.CloudFlareImageUrl-------:", parsedData?.CloudFlareImageUrl);

              // Use parsed data to determine which image to display
              if (localImageInMemory == true && parsedData?.LocalImageUrl !== '' && parsedData?.LocalImageUrl !== undefined && parsedData?.LocalImageUrl !== null) {
                // Fallback to LocalImageUrl if CloudFlareImageUrl is not available
                return (
                  <ExerciseImageViewImage
                    source={{
                      uri: parsedData.LocalImageUrl,
                    }}
                    resizeMode="stretch" // Ensures the entire image is displayed
                  />
                );
              }else if (parsedData?.CloudFlareImageUrl) {
                // Use CloudFlareImageUrl if it exists
                return (
                  <ExerciseImageViewImage
                    source={{
                      uri: parsedData.CloudFlareImageUrl.replace('https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23', 
                        'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'),
                    }}
                    resizeMode="stretch" // Ensures the entire image is displayed
                  />
                );
              }  else {
                // Fallback to default image if neither is available
                return (
                  <ExerciseImageViewImage
                    source={require("../../../../assets/gym-workout.png")}
                    resizeMode="stretch" // Ensures the entire image is displayed

                  />
                );
              }
            })()

            )}
          </>
          
          </ExerciseImageView>
          <ExerciseInfoParentView>
            <ExerciseInfoTextHead style={{ fontSize: 16 }}>
              {item.wktNam}
            </ExerciseInfoTextHead>
            {(item.mjMsOn) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsOn}</ExerciseInfoTextTag>) : (null)}
            {(item.mjMsTw) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTw}</ExerciseInfoTextTag>) : (null)}
            {(item.mjMsTr) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item.mjMsTr}</ExerciseInfoTextTag>) : (null)}
            {(item.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14 ,color:"#000", fontWeight:"bold"}}>{item.eqpUsd}</ExerciseInfoTextTag>) : (null)}
          </ExerciseInfoParentView>
        
      </ExerciseParentView>
    </Pressable>
  );
});

  export const ExercisesScreen = ({navigation,route}) => {
      const [fetchedData, setFetchedData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
      const [searchQuery, setSearchQuery] = useState('');
      const [showFilter, setShowFilter] = useState(false); // New state for filter visibility
      const [ selectedEquipments,setSelectedEquipments] =useState("");
      const [selectedMuscles,setSelectedMuscles] = useState("");
      const [userIdNum, setUserIdNum] = useState('');
      const [userDataArray, setUserDataArray] = useState({});
      const [modalVisible,setModalVisible] = useState('');
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      const [isTwoLoading, setIsTwoLoading] = useState(false);
      const [triainerConnected,setTriainerConnected] =  useState(false);
      const [selectedFilter, setSelectedFilter] = useState(''); // State to manage the selected filter
      const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
      const progressAnimation = useState(new Animated.Value(0))[0];
      
      const [showInfo, setShowInfo] = useState(false);

      const toggleInfo = () => {
        setShowInfo(!showInfo);
      };
      useEffect(() => {
        const progressPercentage = downloadProgress.current / downloadProgress.total;
        
        // Animate the progress from the current to the new percentage
        Animated.timing(progressAnimation, {
            toValue: progressPercentage,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [downloadProgress, progressAnimation]);

      // Adjust how progressPercentage is calculated to avoid NaN
      const progressPercentage = downloadProgress.total > 0
          ? ((downloadProgress.current / downloadProgress.total) * 100).toFixed(0)
          : 0; // Default to 0% when total is 0
//console.log('aseetoo outside',asseto);
    const [reload, setReload] = useState(false);
    const [loadingPageInfo, setLoadingPageInfo] = useState(true);
    const [traineeData, setTraineeData] = useState({});    

      const toggleFilter = () => {
        setShowFilter(!showFilter);
      };
      useFocusEffect(
        React.useCallback(() => {
        

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {
          // setSearchQuery('');
          // setSelectedMuscles(''); 
          // setSelectedEquipments('');
          const unsubscribe = addEventListener(state => {
            //console.log("Connection type--", state.type);
            //console.log("Is connected?---", state.isConnected);
            setTriainerConnected(state.isConnected);

          });
          unsubscribe();
            const storedUser = JSON.parse(user);
            setUserIdNum(storedUser.id);
            setUserDataArray(storedUser);
            //console.log('exercisessss user',storedUser);
            fetchWorkoutsTable(storedUser.id).then((WResults) => {
              setFetchedData(WResults);
              setFilteredData(WResults);
              setLoadingPageInfo(false);

                }).catch((error) => {
                //console.log('Error fetching WorkoutsTable:', error);
                setLoadingPageInfo(false);

              });
           
              axios.get('https://www.elementdevelops.com/api/get-trainee-side-data', {
                headers: {
                  'Authorization': `Bearer ${res}`,
                  'Content-Type': 'application/json',
                },
                })
                .then(response => {
                  // Handle successful response
                  // console.log('trainee exercises----::',response.data?.['TraineesData']?.[0]);
      
                 
                  setTraineeData(response.data?.['TraineesData']?.[0]);
                })
                .catch(error => {
                  // Handle error
                  //console.log('Error fetching Trainee:', error);
                });
            
            })
            
        });
        const timer = setTimeout(() => {
          setLoadingPageInfo(false);
        }, 3000); // 3 seconds
    
        // return () => clearTimeout(timer); // Cleanup the timer on component unmount
         
        
      }, [reload]) // Depend on reload state
      );
      ////////////// Start equipmentsData////////////////
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
        // const fetchData = async () => {
        //   try {
        //     const response = await fetch(
        //       'https://raw.githubusercontent.com/mdn/learning-area/main/javascript/apis/fetching-data/can-store/products.json'
        //     );
        //     const data = await response.json();
        //     setFetchedData(data);
        //     setFilteredData(data);
        //   } catch (error) {
        //     //console.log('Error fetching data:', error);
        //   }
        // };
      
  useEffect(() => {
    filterData(); // Apply initial filtering
  }, [fetchedData,selectedFilter, searchQuery, displayEquipmentsValue, displayMusclesValue]);

        const filterData = () => {
          const filtered = fetchedData.filter((item) => {
            const nameMatches = item?.wktNam?.toLowerCase().includes(searchQuery?.toLowerCase());
            const equipmentsFilterMatches = displayEquipmentsValue ? item?.eqpUsd === displayEquipmentsValue : true;

            const majorMuscleOneFilterMatches = displayMusclesValue ? item?.mjMsOn === displayMusclesValue : true;
            const majorMuscleTwoFilterMatches = displayMusclesValue ? item?.mjMsTw === displayMusclesValue : true;
            const majorMuscleThreeFilterMatches = displayMusclesValue ? item?.mjMsTr === displayMusclesValue : true;
            // filter by userID
            const filterByUserId = () => {
              if (selectedFilter === 'ourWorkouts') {
                return item.userId == "appAssets";
              } else if (selectedFilter === 'yourWorkouts') {
                return item.userId == userIdNum;
              }
              return true;
            };

            if(nameMatches || majorMuscleOneFilterMatches || majorMuscleTwoFilterMatches || majorMuscleThreeFilterMatches || equipmentsFilterMatches || filterByUserId()){
              setCurrentPage(1);
            }
            return nameMatches && (majorMuscleOneFilterMatches || majorMuscleTwoFilterMatches || majorMuscleThreeFilterMatches) && equipmentsFilterMatches && filterByUserId();
            // Return true if the Workout matches all selected criteria
            });
        
            setTotalItems(filtered?.length);
            //console.log('filtered?.length',filtered?.length);
            setTotalPages(Math.ceil(filtered?.length / pageSize));
            //console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));
            setFilteredData(filtered);
            //console.log('filtered',filtered);
            //setCurrentPage(currentPage ? currentPage : 1);
            
            //console.log('currentPage inside',currentPage);
             // Reset current page to 1 when filtering
          };
        const clearFilter = () => {
          setSelectedMuscles(''); 
          setSelectedEquipments('');
          setSelectedFilter('');
        };
      
       
        useEffect(() => {
          filterData();
        }, [selectedFilter,searchQuery, displayEquipmentsValue,displayMusclesValue]);     
        const handlePageChange = (page) => {
          setCurrentPage(page);
        };
        //console.log('currentPage outside',currentPage);

        // Calculate the range of page numbers to display
        const minPage = Math.max(1, currentPage - 2);
        const maxPage = Math.min(totalPages, currentPage + 2);


        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const visibleData = filteredData.slice(startIdx, endIdx);  

        // Render the pagination buttons
        const renderPaginationButtons = () => {
          const buttons = [];

          // <MaterialCommunityIcons name="food-variant" color={color} size={28} />
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
        const database = SQLite.openDatabase('health.db');
  const ensureDirectoryExists = async (dir) => {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  };
   const addMainWorkoutsVideosToDatabase = async (dataArray) => {
    console.log('Starting addWorkoutRowsToDatabase');
  try {
    const totalVideos = 495;
    let downloadedVideos = 0;
    const promises = dataArray.map(async (rowData) => {
      const { userId, speKey,replacedVideos } = rowData;
      let workoutDownloadedVideo = "";
      if (replacedVideos) {
        const videoName = replacedVideos.split('workouts/').pop();
        await ensureDirectoryExists(FileSystem.documentDirectory + 'public/videos/workouts');

        const fileUri = FileSystem.documentDirectory + 'public/videos/workouts/' + videoName;

        // Ensure the directory exists

        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
          const downloadResult = await FileSystem.downloadAsync(replacedVideos, fileUri);
          workoutDownloadedVideo = downloadResult.uri;
        } else {
          workoutDownloadedVideo = fileUri;
        }
        console.log('workoutDownloadedVideo', workoutDownloadedVideo);
      }
      return new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            `
            SELECT * FROM workouts
            WHERE userId = ? AND speKey = ?
            `,
            [userId, speKey],
            (_, selectResult) => {
              if (selectResult.rows.length > 0) {
                const existingRow = selectResult.rows.item(0);
                console.log('existingRow.videos',existingRow.videos);
                // Check if videos column is empty
                if (!existingRow.videos || existingRow.videos.toString().trim() === '') {
                  // Videos column is empty, update the existing row
                  tx.executeSql(
                    `
                    UPDATE workouts
                    SET 
                      wktNam = ?,
                      exrTyp = ?,
                      eqpUsd = ?,
                      witUsd = ?,
                      wktStp = ?,
                      pfgWkt = ?,
                      mjMsOn = ?,
                      mjMsTw = ?,
                      mjMsTr = ?,
                      mnMsOn = ?,
                      mnMsTo = ?,
                      mnMsTr = ?,
                      images = ?,
                      videos = ?,
                      isSync = ?
                    WHERE userId = ? AND speKey = ?
                    `,
                    [
                      rowData.workoutName,
                      rowData.exerciseType,
                      rowData.equipmentUsed,
                      rowData.weightsUsed,
                      rowData.workoutSetup,
                      rowData.performingWorkout,
                      rowData.majorMuscleOne,
                      rowData.majorMuscleTwo,
                      rowData.majorMuscleThree,
                      rowData.minorMuscleOne,
                      rowData.minorMuscleTwo,
                      rowData.minorMuscleThree,
                      rowData.images,
                      workoutDownloadedVideo,
                      rowData.isSync,
                      userId,
                      speKey
                    ],
                    (_, updateResult) => {
                      console.log('Row updated in the database:', updateResult);
                      downloadedVideos++;
                      setDownloadProgress({ current: downloadedVideos, total: totalVideos });
                      resolve();
                    },
                    (_, updateError) => {
                      console.log('Error updating row in the database:', updateError);
                      reject(updateError);
                    }
                  );
                } else {
                  // Videos column is not empty, skipping update
                  downloadedVideos++;
                  setDownloadProgress({ current: downloadedVideos, total: totalVideos });
                  console.log('Video already in workouts table, skipping update.');
                  resolve();
                }
              } else {
                // Entry doesn't exist, add it to the database
                tx.executeSql(
                  `
                  INSERT INTO workouts (
                    userId,
                    speKey,
                    wktNam,
                    exrTyp,
                    eqpUsd,
                    witUsd,
                    wktStp,
                    pfgWkt,
                    mjMsOn,
                    mjMsTw,
                    mjMsTr,
                    mnMsOn,
                    mnMsTo,
                    mnMsTr,
                    images,
                    videos,
                    isSync)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  `,
                  [
                    rowData.userId,
                    rowData.speKey,
                    rowData.workoutName,
                    rowData.exerciseType,
                    rowData.equipmentUsed,
                    rowData.weightsUsed,
                    rowData.workoutSetup,
                    rowData.performingWorkout,
                    rowData.majorMuscleOne,
                    rowData.majorMuscleTwo,
                    rowData.majorMuscleThree,
                    rowData.minorMuscleOne,
                    rowData.minorMuscleTwo,
                    rowData.minorMuscleThree,
                    rowData.images,
                    workoutDownloadedVideo,
                    rowData.isSync
                  ],
                  (_, insertResult) => {
                    console.log('Row added to the database:', insertResult);
                    downloadedVideos++;
                    setDownloadProgress({ current: downloadedVideos, total: totalVideos });
                    resolve();
                  },
                  (_, insertError) => {
                    console.log('Error adding row to the database:', insertError);
                    reject(insertError);
                  }
                );
              }
            },
            (_, selectError) => {
              console.log('Error checking database for existing row:', selectError);
              reject(selectError);
            }
          );
        });
      });
      
    });
  
    await Promise.all(promises);
    console.log('Finished addWorkoutRowsToDatabase');
    setDownloadProgress({ current: 0, total: 0 });

  } catch (error) {
    console.log('Error in addWorkoutRowsToDatabase:', error);
  }
  }; 

  const handleDDownloadWorkoutsPress = async () => {
    if (triainerConnected) {
      setIsTwoLoading(true); // Show activity indicator
      //await handleWorkoutsDataImport();
      await addMainWorkoutsVideosToDatabase(mainWorkoutsDataWithoutRequire);
      setReload(!reload);  // Trigger reload
      setIsTwoLoading(false); // Hide activity indicator after operation is complete
    } else {
      Alert.alert(`${t('To_Download_your_Data')}`,
        `${t('You_must_be_connected_to_the_internet')}`);
    }
  };
        return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/Exercises_page.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover>
            {(userDataArray.role == "Trainer")?(
              <ServiceInfoParentView >

                  {showInfo ? (
                      <ServiceCloseInfoButtonView>
                        <ServiceCloseInfoButton onPress={toggleInfo}>
                          <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                        </ServiceCloseInfoButton>
                        <ServiceCloseInfoButtonTextView>
                          <ServiceCloseInfoButtonText>{t("exercise_page_info")}</ServiceCloseInfoButtonText>
                        </ServiceCloseInfoButtonTextView>
                      </ServiceCloseInfoButtonView>
                    ) : (
                      <ServiceInfoButtonView>
                        <ServiceInfoButton onPress={toggleInfo}>
                        <ServiceInfoButtonAvatarIcon icon="information" size={60} />
                        </ServiceInfoButton>
                      </ServiceInfoButtonView>
                    )}
              </ServiceInfoParentView>
            ):(null)}
          

            <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%",marginBottom:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={handleDDownloadWorkoutsPress}>
                    <CalendarFullSizePressableButtonText >{t("Download_our_workouts_videos")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <Modal animationType="fade" transparent={true} visible={isTwoLoading}>
                      <View style={styles.modalContainer}>
                          <View style={styles.loadingBox}>
                              <Text style={styles.loadingText}>{t("Downloading_Workouts")}</Text>

                              {/* Progress Bar Container */}
                              <View style={styles.progressBarContainer}>
                                  <Animated.View
                                      style={[
                                          styles.progressBar,
                                          { width: `${progressPercentage}%` }, // Animate width based on progress
                                      ]}
                                  />
                              </View>

                              {/* Display the percentage and file count */}
                              <Text style={styles.percentageText}>{progressPercentage}%</Text>
                              <Text style={styles.progressDetailsText}>
                                  {`${t("Downloaded")} ${downloadProgress.current} ${t("of_one")} ${downloadProgress.total}`}
                              </Text>
                          </View>
                      </View>
                  </Modal>
                  <FormElemeentSizeButtonView style={{width:"100%",marginBottom:10}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('AddNewEntryWorkout')}>
                    <CalendarFullSizePressableButtonText >{t("Add_new_Workout")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
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
                      <FormLabel>{t("Equipments")}:</FormLabel>
                    </FormLabelView>
                    <FormInputView>
                    <Select
                        onSelect={(index) => {
                          setSelectedEquipments(index);
                          }}
                        placeholder={t('Select_Equipment')}
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
                      <FormLabel>{t("Muscles")}:</FormLabel>
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
              
              {
                (loadingPageInfo)?(
                  <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}

                  >
                  
                      <View style={styles.modalContainerPageLoading}>
                        <View style={styles.loadingBoxPageLoading}>
                          <Text style={styles.loadingTextPageLoading}>Loading...</Text>
                          <Spinner size="large" color="#fff" />
                        </View>
                      </View>
                </Modal>
            ):(
                (filteredData.length == 0)?(
                  <View style={{height:640, alignItems: 'center', justifyContent: 'center',}}>
                  <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>0 Workouts</Text>
                    {/* <ActivityIndicator size="large" /> */}
                  </View>
                ):(
                <Spacer size="medium">
                <FlatList
                  data={visibleData}
                  scrollEnabled={false}
                  initialNumToRender={5}
                  keyExtractor={(item, index) => index.toString()}
                  windowSize={10} //If you have scroll stuttering but working fine when 'disableVirtualization = true' then use this windowSize, it fix the stuttering problem.
                  maxToRenderPerBatch={10}
                  updateCellsBatchingPeriod={5}
                  disableVirtualization={true}
                  removeClippedSubviews={true}
                  renderItem={({ item }) => <MemoizedExerciseParentView item={item} navigation={navigation} traineeData={traineeData} userDataArray={userDataArray}/>}

                />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' ,marginTop:20}}>
                  {renderPaginationButtons()}
                </View>
                </Spacer> 
                )
            )
                }
            </View>
        </ScrollView>
      </PageContainer>
        );
      };
  const styles = StyleSheet.create({
        descriptionTextArea: {
     // This property ensures that the text starts from the top
            backgroundColor:"#000",
            borderRadius:6,
            padding:10,
            textAlignVertical: 'top',
            height:150,
            
        },
        modalContainerPageLoading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    loadingBoxPageLoading: {
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
    loadingTextPageLoading: {
      color: '#fff',
      fontSize: 20,
      marginBottom: 15,
    },
        modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    loadingBox: {
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
    loadingText: {
        color: '#f0f0f5',
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#333',
        borderRadius: 7.5,
        overflow: 'hidden',
        marginVertical: 10,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3f7eb3',
        borderRadius: 7.5,
    },
    percentageText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#3f7eb3',
        marginTop: 2,
        textAlign: 'center',
    },
    progressDetailsText: {
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
    });