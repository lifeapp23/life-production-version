import React, { useState, useEffect,useRef } from 'react';
import { Dimensions,View, ScrollView, Modal,TouchableOpacity,Button,ActivityIndicator,Text ,Pressable} from 'react-native';
import { Layout, Tab, TabView } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { fetchWorkoutsTable} from "../../../../database/workoutsTable";
import { fetchSpecificWorkoutWithoutDeleting} from "../../../../database/start_workout_db";
import "./i18n";
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

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
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    FullSizeButtonView,
    FullButton,
    FormElemeentSizeButtonParentView,
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
    ServiceInfoButtonAvatarIcon

  
  } from "../components/account.styles";









export const  SimilarExercisesScreen =({ navigation ,route})=>{
    const workout = route.params?.workout;
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [loadingPageInfo, setLoadingPageInfo] = useState(true);

    const MemoizedExerciseParentView = React.memo(({ item, navigation }) => {
  const [similarThumbnailUri, setSimilarThumbnailUri] = React.useState(null);
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
      ////console.log('uri', thumbnailUri);
    } catch (e) {
      //console.error('Error generating video thumbnail:', e);
    }
  };
 
  
// convert item video into thumbnails
  // React.useEffect(() => {

  //   if (isVideoUrl(item?.wktMda)) {
  //     generateVideoThumbnailAsync(item?.wktMda);
  //   }
  // }, [item]);
// //console.log('item',item);
  return (
    <Pressable style={{marginBottom:10}}  onPress={() => navigation.navigate('WorkoutName', { item: item })}>

    <ExerciseParentView>
      <ExerciseImageView>
        {/* {(item?.images !== '' && item?.images !== undefined && item?.images !== null) ? (
          <>
            {isImageUrl(item?.images) && (
              <ExerciseImageViewImage
                source={{ uri: `${item?.images}` }}
              />
            )}

          </>
        ) : (
          <ExerciseImageViewImage source={require('../../../../assets/gym-workout.png')} />
        )} */}
        {/* <ExerciseImageViewImage style={styles.DemoSectionImage} source={
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
                                                    style={styles.DemoSectionImage}
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
                                                // console.log("parsedData TRAINEEE-------:", parsedDataImages);
                                              } catch (error) {
                                                {/* console.error("Failed to parse item?.images:", error); */}
                                                parsedDataImages = null;
                                              }
                                              
                                              // console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl);

                                              
                                          if (parsedDataImages?.CloudFlareImageUrl !== '' && parsedDataImages?.CloudFlareImageUrl !== undefined && parsedDataImages?.CloudFlareImageUrl !== null ) {
                                            return (
                                              <>
                                              {(isImageUrl(parsedDataImages?.CloudFlareImageUrl) )&& (
                                                <ExerciseImageViewImage
                                                  style={styles.DemoSectionImage}
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
                                                        style={styles.DemoSectionImage}
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
                                                    style={styles.DemoSectionImage}
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
        <ExerciseInfoTextHead style={{fontSize:16}} >{item?.wktNam}</ExerciseInfoTextHead>

        {(item?.mjMsOn) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item?.mjMsOn}</ExerciseInfoTextTag>) : (null)}
        {(item?.mjMsTw) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item?.mjMsTw}</ExerciseInfoTextTag>) : (null)}
        {(item?.mjMsTr) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item?.mjMsTr}</ExerciseInfoTextTag>) : (null)}
        {(item?.eqpUsd) ? (<ExerciseInfoTextTag style={{ fontSize: 14 }}>{item?.eqpUsd}</ExerciseInfoTextTag>) : (null)}
      </ExerciseInfoParentView>
    </ExerciseParentView>

    </Pressable>
  );
});
    const hideModal = () => setModalVisible(false);
    const [filteredData, setFilteredData] = useState([]);
    const [userIdNum, setUserIdNum] = useState('');
    const [userDataArray, setUserDataArray] = useState({});
    const [workoutsDataArray,setWorkoutsDataArray] = useState([]);

    let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10); // Number of items per page
    let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);


    useFocusEffect(
      React.useCallback(() => {
      

      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
      AsyncStorage.getItem("currentUser").then((user) => {
        // setSearchQuery('');
        // setSelectedMuscles(''); 
        // setSelectedEquipments('');
          const storedUser = JSON.parse(user);
          setUserIdNum(storedUser.id);
          setUserDataArray(storedUser);
          //console.log('exercisessss user',storedUser);
          fetchWorkoutsTable(storedUser.id).then((WResults) => {
            setWorkoutsDataArray(WResults);
              }).catch((error) => {
              //console.error('Error fetching WorkoutsTable:', error);
              });
         
            
          
          })
          
      });
      const timer = setTimeout(() => {
        setLoadingPageInfo(false);
      }, 2000); // 2 seconds
  
      return () => clearTimeout(timer); // Cleanup the timer on component unmount
       
      }, [])
    );
    ////console.log('workout similar',workout);
     // convert item video into thumbnails
   const [thumbnailUri, setThumbnailUri] = React.useState(null);

    const filterData = () => {
      const filtered = workoutsDataArray.filter((item) => {
        const majorMuscleGroupOneFilteredData = workout?.mjMsOn !== "" ? item?.mjMsOn === workout?.mjMsOn : false;
        const majorMuscleGroupTwoFilteredData =  workout?.mjMsTw !== "" ? item?.mjMsTw === workout?.mjMsTw : false;
        const majorMuscleGroupThreeFilteredData =  workout.mjMsTr !== "" ? item?.mjMsTr === workout.mjMsTr : false;
        // //console.log('majorMuscleGroupOneFilteredData',majorMuscleGroupOneFilteredData);
        // //console.log('majorMuscleGroupTwoFilteredData',majorMuscleGroupTwoFilteredData);
        // //console.log('majorMuscleGroupThreeFilteredData',majorMuscleGroupThreeFilteredData);
        ////console.log('ahly majorMuscleGroupOneFilteredData',majorMuscleGroupOneFilteredData,'majorMuscleGroupTwoFilteredData',majorMuscleGroupTwoFilteredData,'majorMuscleGroupThreeFilteredData',majorMuscleGroupThreeFilteredData);
        if(majorMuscleGroupOneFilteredData || majorMuscleGroupTwoFilteredData || majorMuscleGroupThreeFilteredData){
            setCurrentPage(1);
          }
       
        return majorMuscleGroupOneFilteredData || majorMuscleGroupTwoFilteredData || majorMuscleGroupThreeFilteredData;
        

        });
        setTotalItems(filtered?.length);
        //console.log('filtered?.length',filtered?.length);
        setTotalPages(Math.ceil(filtered?.length / pageSize));
        //console.log('Math.ceil(filtered?.length / pageSize)',Math.ceil(filtered?.length / pageSize));

        ////console.log('filtered',filtered);
        setFilteredData(filtered);
      };
      useEffect(() => {
        filterData();
      }, [workoutsDataArray,workout]); 
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
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
    return (
      <View style={styles.centeredView}>
        <ScrollView>
        
         {/* make ActivityIndicator when similar page open  */}
        {/* {//console.log('filteredData.length',filteredData.length)} */}
        {
            (loadingPageInfo)?(
                <View style={{height:640, alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>{t('Loading')}...</Text>
                    {/* <ActivityIndicator size="large" /> */}
                </View>
            ):(
                (filteredData.length == 0)?(
                    <View style={{height:640, alignItems: 'center', justifyContent: 'center',}}>
                    <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>0 Workouts</Text>
                        {/* <ActivityIndicator size="large" /> */}
                    </View>
                    ):(
                        <>
                        <TitleView >
                            <Title >{totalItems} Workout</Title>
                        </TitleView>
                    <Spacer size="large">
                        <FlatList
                            data={visibleData}
                            scrollEnabled={false}
                            initialNumToRender={5}
                            windowSize={10} //If you have scroll stuttering but working fine when 'disableVirtualization = true' then use this windowSize, it fix the stuttering problem.
                            maxToRenderPerBatch={10}
                            updateCellsBatchingPeriod={5}
                            disableVirtualization={true}
                            removeClippedSubviews={true}
                            keyExtractor={(major, index) => index.toString()}
                            renderItem={({ item: major }) => <MemoizedExerciseParentView item={major} navigation={navigation} />}

                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' ,marginTop:20}}>
                            {renderPaginationButtons()}
                            </View>
                    </Spacer>
                    </> 
                    )
            )
            
            
        }
          
          {/* <Spacer size="large">
            <FullSizeButtonView>
              <FullButton
                icon="email"
                mode="contained"
                onPress={()=>{
                  hideModal();
                  setShowThumbnail(true);
                  }}
                style={{fontSize:18}}
              >
                {t('Back_To_Workout_Name_Page')}
              </FullButton>
              
            </FullSizeButtonView>
          </Spacer> */}
        </ScrollView>
      </View>

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
      marginLeft: -25, // Adjust this based on your play icon size
      marginTop: -25, // Adjust this based on your play icon size
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
  };