import React, { useCallback, useRef, useState, useEffect  } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Camera } from "expo-camera";
import styled from "styled-components/native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

import { StyleSheet,
  ScrollView,
View,Modal,Image,TouchableOpacity,Text,Alert, ActivityIndicator, Animated, Easing} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  FullSizeButtonView,
  FullButton,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  FormElemeentSizeButton,
  FormInputSizeButton,
  ViewOverlay,
  FormLabelDateRowView,
  NewFormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  AsteriskTitle,
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
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import { Spacer } from "../../../components/spacer/spacer.component";
import { PlansScreen } from "./plans.screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDate } from './DateContext'; // Import useDate from the context
import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 
import { fetchbodyStatsAndMeasurementsLastInsertedRow,insertBodyStatsAndMeasurements } from "../../../../database/B_S_and_measurements"; 

const imgDir = FileSystem.documentDirectory + 'images/';

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
  };

export const BodyStatsAndMeasurementsScreen = ({ navigation,route }) => {
  
  const params = route.params || {};

  const { dayWorkoutWorkedTask = {}, sentPassNewDate = '' } = params;
  

  const [lastInsertedRow, setLastInsertedRow] = useState(null);
  const [heightBms, setHeightBms] = useState("");
  const [weightBms, setWeightBms] = useState("");
  const [neckBms, setNeckBms] = useState("");
  const [shoulderBms, setShoulderBms] = useState("");
  const [chestBms, setChestBms] = useState("");
  
  const [armBms, setArmBms] = useState(""); 
  const [forearmBms, setForearmBms] = useState("");
  const [torsoBms, setTorsoBms] = useState("");
  const [highHipsBms, setHighHipsBms] = useState("");  
  const [hipsBms, setHipsBms] = useState("");
  const [thighBms, setThighBms] = useState("");
  const [calvesBms, setCalvesBms] = useState(""); 
  const [photoBmsFront, setPhotoBmsFront] = useState('');
  const [photoBmsSide, setPhotoBmsSide] = useState('');
  const [photoBmsBack, setPhotoBmsBack] = useState('');
  const { selectedDate } = useDate(); // Access selectedDate from the context
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();//add this line
   const [showInfo, setShowInfo] = useState(false);
    const toggleInfo = () => {
      setShowInfo(!showInfo);
    };
  useEffect(() => {
    //console.log('Route Params:', params);
    

    if (dayWorkoutWorkedTask && sentPassNewDate) {
      console.log('dayWorkoutWorkedTask:', dayWorkoutWorkedTask);
      //console.log('sentPassNewDate:', sentPassNewDate);
      setLastInsertedRow(dayWorkoutWorkedTask);
      setHeightBms(dayWorkoutWorkedTask.height?.toString() || "");
      setWeightBms(dayWorkoutWorkedTask.weight?.toString() || "");
      setNeckBms(dayWorkoutWorkedTask.neck?.toString() || "");
      setShoulderBms(dayWorkoutWorkedTask.should?.toString() || "");
      setChestBms(dayWorkoutWorkedTask.chest?.toString() || "");
      setArmBms(dayWorkoutWorkedTask.arm?.toString() || "");
      setForearmBms(dayWorkoutWorkedTask.forarm?.toString() || "");
      setTorsoBms(dayWorkoutWorkedTask?.torso?.toString() || "");
      setHighHipsBms(dayWorkoutWorkedTask?.hHips?.toString() || "");  
      setHipsBms(dayWorkoutWorkedTask?.hips ?.toString() || "");
      setThighBms(dayWorkoutWorkedTask?.thigh?.toString() || "");
      setCalvesBms(dayWorkoutWorkedTask?.calves?.toString() || ""); 
      if(dayWorkoutWorkedTask?.images){
        const imagesData = JSON.parse(dayWorkoutWorkedTask?.images);

      // Step 2: Check each key and print the values if they exist
      if (imagesData.photoBmsFront) {
          console.log('photoBmsFront exists:', imagesData.photoBmsFront);
          setPhotoBmsFront(imagesData.photoBmsFront);
      }else{
        setPhotoBmsFront('');

      }

      if (imagesData.photoBmsSide) {
          console.log('photoBmsSide exists:', imagesData.photoBmsSide);
          setPhotoBmsSide(imagesData.photoBmsSide);
      } else{
        setPhotoBmsSide('');

      }
      if (imagesData.photoBmsBack) {
          console.log('photoBmsBack exists:', imagesData.photoBmsBack);
          setPhotoBmsBack(imagesData.photoBmsBack);
      } else{
        setPhotoBmsBack('');

      }
      }
      else{
        setPhotoBmsFront('');

        setPhotoBmsSide('');

        setPhotoBmsBack('');

      }
    } else {
      //console.log('dayWorkoutWorkedTask is', dayWorkoutWorkedTask);
      //console.log('sentPassNewDate is', sentPassNewDate);
    }
  }, [params]);
  const [loading, setLoading] = useState(false);
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;


  const [cameraFrontVisible, setCameraFrontVisible] = useState(false);
  const [cameraSideVisible, setCameraSideVisible] = useState(false);
  const [cameraBackVisible, setCameraBackVisible] = useState(false);
  
  const [userIdNum, setUserIdNum] = useState('');
  const handleRemoveSmallImageFront = () => {
    setPhotoBmsFront('');
    }
    const handleRemoveSmallImageSide = () => {
      setPhotoBmsSide('');
    }
    const handleRemoveSmallImageBack = () => {
      setPhotoBmsBack('');
    }
  
  const [hasPermission, setHasPermission] = useState(null);

  let lastInsertedRowDate = sentPassNewDate != "" ? sentPassNewDate: lastInsertedRow?.date;
  //console.log('lastInsertedRowDate is', lastInsertedRowDate);

// const cleanedString = lastInsertedRow?.images.replace(/^\[|\]$/g, '').split(',');
// const cleanedImagesArray = cleanedString?.map(item => item.toString().trim());

useFocusEffect(
  React.useCallback(() => {
    // Fetch the latest data or update the state here

    
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      // Extract the ID part from the token and convert it to a number
      const tokenIDPart = parseInt(res.split('|')[0], 10);
      getUserIdFromTokenId(tokenIDPart)
        .then((userId) => {
          setUserIdNum(userId);
          fetchbodyStatsAndMeasurementsLastInsertedRow(userId)
            .then((row) => {
              setLastInsertedRow(row);
              if (row) {
                console.log('row',row);
                setHeightBms(row.height?.toString() || "");
                setWeightBms(row.weight?.toString() || "");
                setNeckBms(row.neck?.toString() || "");
                setShoulderBms(row.should?.toString() || "");
                setChestBms(row.chest?.toString() || "");
                setArmBms(row.arm?.toString() || "");
                setForearmBms(row.forarm?.toString() || "");
                setTorsoBms(row?.torso?.toString() || "");
                setHighHipsBms(row?.hHips?.toString() || "");  
                setHipsBms(row?.hips ?.toString() || "");
                setThighBms(row?.thigh?.toString() || "");
                setCalvesBms(row?.calves?.toString() || ""); 
                if(row?.images){
                  const imagesData = JSON.parse(row?.images);
          
                // Step 2: Check each key and print the values if they exist
                if (imagesData.photoBmsFront) {
                    console.log('photoBmsFront exists:', imagesData.photoBmsFront);
                    setPhotoBmsFront(imagesData.photoBmsFront);
                } 
          
                if (imagesData.photoBmsSide) {
                    console.log('photoBmsSide exists:', imagesData.photoBmsSide);
                    setPhotoBmsSide(imagesData.photoBmsSide);
                } 
                if (imagesData.photoBmsBack) {
                    console.log('photoBmsBack exists:', imagesData.photoBmsBack);
                    setPhotoBmsBack(imagesData.photoBmsBack);
                } 
                
                }
                // Step 1: Parse the images string into an object

                setLoadingPageInfo(false);
              }
            })
            .catch((error) => {
              ////console.log('Error fetching last inserted row:', error);
              setLoadingPageInfo(false);
            });
        })
    });  
    const timer = setTimeout(() => {
      setLoadingPageInfo(false);
    }, 2000); // 2 seconds

    // return () => clearTimeout(timer); // Cleanup the timer on component unmount
      
  }, [])
);
useEffect(() => {
  if (showSuccess) {
    Animated.timing(checkmarkAnimation, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  } else {
    checkmarkAnimation.setValue(0); // Reset animation
  }
}, [showSuccess]);
// Empty dependency array means this effect runs once when the component mounts
  ////console.log('userIdNum',userIdNum);


  // Select image from mobile
  const pickImageBmsFront = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoBmsFront(result.assets[0].uri);
    }
  };
  const pickImageBmsSide = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoBmsSide(result.assets[0].uri);
    }
  };
  const pickImageBmsBack = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      setPhotoBmsBack(result.assets[0].uri);
    }
  };
//------- Upload images from Camera -------/

  const CameraFrontScreen = ({ isVisible, onClose, onTakeFrontBodyImage }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const cameraFrontRef = useRef();
    
    const ProfileCamera = styled(Camera)`
    width: 100%;
    height: 100%;
    flex: 1;
    `;
    
    const InnerSnap = styled.View`
    width: 100%;
    height: 100%;
    z-index: 999;
    `;
    const snapFront = async () => {
      if (cameraFrontRef) {
        const photoFront = await cameraFrontRef.current.takePictureAsync();
        // setPhotoBmsFront(photoFront.uri);
        onTakeFrontBodyImage(photoFront);
        onClose();
      }
    };
    // useEffect(() => {
    //   if (isVisible) {
    //     (async () => {
    //       const { status } = await Camera.requestCameraPermissionsAsync();
    //       setHasPermission(status === "granted");
    //     })();
    //   }
    // }, [isVisible]);
  
    // if (hasPermission === null) {
    //   return <View />;
    // }
    // if (hasPermission === false) {
    //   return <Text>No access to camera</Text>;
    // }
    return (
      <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <ProfileCamera
        ref={(camera) => (cameraFrontRef.current = camera)}
        type={Camera.Constants.Type.back}
      >
        <TouchableOpacity onPress={snapFront}>
          <InnerSnap />
        </TouchableOpacity>
      </ProfileCamera>
      </Modal>
    );
  };
  const CameraSideScreen = ({ isVisible, onClose, onTakeSideBodyImage }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const cameraSideRef = useRef();
    const ProfileCamera = styled(Camera)`
    width: 100%;
    height: 100%;
    flex: 1;
    `;
    
    const InnerSnap = styled.View`
    width: 100%;
    height: 100%;
    z-index: 999;
    `;
    const snapSide = async () => {
      if (cameraSideRef) {
        const photoSide = await cameraSideRef.current.takePictureAsync();
        // setPhotoBmsSide(photoSide.uri);
        onTakeSideBodyImage(photoSide);
        onClose();  
    };
  };
    
  // useEffect(() => {
  //   if (isVisible) {
  //     (async () => {
  //       const { status } = await Camera.requestCameraPermissionsAsync();
  //       setHasPermission(status === "granted");
  //     })();
  //   }
  // }, [isVisible]);
  
  //   if (hasPermission === null) {
  //     return <View />;
  //   }
  //   if (hasPermission === false) {
  //     return <Text>No access to camera</Text>;
  //   }
    return (
      <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <ProfileCamera
        ref={(camera) => (cameraSideRef.current = camera)}
        type={Camera.Constants.Type.back}
      >
        <TouchableOpacity onPress={snapSide}>
          <InnerSnap />
        </TouchableOpacity>
      </ProfileCamera>
      </Modal>
    );
  };
  const CameraBackScreen = ({ isVisible, onClose, onTakeBackBodyImage }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const cameraBackRef = useRef();

    const ProfileCamera = styled(Camera)`
    width: 100%;
    height: 100%;
    flex: 1;
    `;
    
    const InnerSnap = styled.View`
    width: 100%;
    height: 100%;
    z-index: 999;
    `;
    const snapBack = async () => {
      if (cameraBackRef) {
        const photoBack = await cameraBackRef.current.takePictureAsync();
        // setPhotoBmsBack(photoBack.uri);
        onTakeBackBodyImage(photoBack);
        onClose();
      }
    };
  
    // useEffect(() => {
    //   if (isVisible) {
    //     (async () => {
    //       const { status } = await Camera.requestCameraPermissionsAsync();
    //       setHasPermission(status === "granted");
    //     })();
    //   }
    // }, [isVisible]);
  
    // if (hasPermission === null) {
    //   return <View />;
    // }
    // if (hasPermission === false) {
    //   return <Text>No access to camera</Text>;
    // }
    return (
      <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <ProfileCamera
        ref={(camera) => (cameraBackRef.current = camera)}
        type={Camera.Constants.Type.back}
      >
        <TouchableOpacity onPress={snapBack}>
          <InnerSnap />
        </TouchableOpacity>
      </ProfileCamera>
      </Modal>
    );
  };
 // ---------- end Upload images from Camera ----/  
  
  //--------- start file systemn save images ---////
  const [imagesArray, setImagesArray] = useState([]);
  const [imagesLoadArray, setImagesLoadArray] = useState([]);
  

	// Load images from file system
	const loadImages = async () => {
		await ensureDirExists();
		const files = await FileSystem.readDirectoryAsync(imgDir);
		if (files.length > 0) {
			setImagesArray(files.map((f) => imgDir + f));
		}
	};
  const saveImage = async (uri) => {
    await ensureDirExists();
  console.log('uri',uri);
  if(uri?.startsWith('file:///data/user/0/host.exp.exponent/files/images/')){
 // Check if the URI is already a file in storage
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (fileInfo.exists) {
        // If the file already exists, log it and return the existing file path
        console.log('Image already exists, not saving:', uri);
        return uri; // Return the existing file path
    }
  }
 
    // Extract file extension from the URI
    const fileExtension = uri.split('.').pop() || 'jpeg';
    console.log('Image not exists, and i continue:');

    const filename = new Date().getTime() + `.${fileExtension}`;
    const dest = imgDir + filename;
  
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImagesArray([...imagesArray, dest]);
    return dest;
  };
  const newImagePath = async (uri) => {
    await ensureDirExists();
  
    // Extract file extension from the URI
    const fileExtension = uri.split('.').pop() || 'jpeg';
  
    const filename = new Date().getTime() + `.${fileExtension}`;
    const dest = imgDir + filename;
    return dest;
  };
    //--------- end file systemn save images ---////

  const handleFrontBodyImageCamera = (photoFront) => {
    setPhotoBmsFront(photoFront.uri); 
    setCameraFrontVisible(false);
  };
  const takeNewWorkoutPhotoFront = async () => {
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
        setPhotoBmsFront(result.assets[0].uri);
        // setNewWorkoutVideos('');
        // Implement your logic to upload the photo
        }
    } catch (error) {
    //console.error('Error taking photo:', error);
    }
    };
  const handleSideBodyImageCamera = (photoSide) => {
    setPhotoBmsSide(photoSide.uri); 
    setCameraSideVisible(false);
  };
  const takeNewWorkoutPhotoSide = async () => {
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
        setPhotoBmsSide(result.assets[0].uri);
        // setNewWorkoutVideos('');
        // Implement your logic to upload the photo
        }
    } catch (error) {
    //console.error('Error taking photo:', error);
    }
    };
  const handleBackBodyImageCamera = (photoBack) => {
    setPhotoBmsBack(photoBack.uri); 
    setCameraBackVisible(false);
  };
  const takeNewWorkoutPhotoBack = async () => {
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
        setPhotoBmsBack(result.assets[0].uri);
        // setNewWorkoutVideos('');
        // Implement your logic to upload the photo
        }
    } catch (error) {
    //console.error('Error taking photo:', error);
    }
    };
  const todayDate = new Date().toISOString().split('T')[0];
  checkFutureDate = selectedDate > todayDate ? true : false ;
  //console.log('lastInsertedRow',lastInsertedRow);
  let lastInsertedRowHasData = "";
  if(lastInsertedRow != null){
    lastInsertedRowHasData = Object.values(lastInsertedRow).some(value => value !== "");

  }

  const handleBSAndMeasurementsSubmit = async () => {
    
    if (!heightBms && !lastInsertedRow?.height?.toString() || !weightBms && !lastInsertedRow?.weight?.toString() || !selectedDate && !lastInsertedRowDate) {
      Alert.alert(`${t("height_weight_Date_fields_are_required")}`);
      return;
    }
    if(weightBms == "0" || lastInsertedRow?.weight === 0 ){
      Alert.alert(`${t("Weight_must_be_greater_than_zero")}`); 
      return;
    }
    if(checkFutureDate){
      Alert.alert(`${t("You_can_t_select_date_in_the_Future")}`);
      return;
    }
    setLoading(true);
    setShowSuccess(false); // Reset success state

// Assuming photoBmsFront, photoBmsSide, and photoBmsBack are variables with image URLs

  // const imagesSelectedArray = [];

  //   if (photoBmsFront) {
  //     const photoBmsFrontNew = await saveImage(photoBmsFront);
      
  //     imagesSelectedArray.push(photoBmsFrontNew);
  //   }
    
  //   if (photoBmsSide) {
  //     const photoBmsSideNew = await saveImage(photoBmsSide);
    
  //     imagesSelectedArray.push(photoBmsSideNew);
  //   }
    
  //   if (photoBmsBack) {
  //     const photoBmsBackNew = await saveImage(photoBmsBack);
    
  //     imagesSelectedArray.push(photoBmsBackNew);
  //   }
// Create an object to hold image links with descriptive keys
const imagesSelectedObject = {};

// Check for each image and assign the link to its corresponding key
if (photoBmsFront) {
    const photoBmsFrontNew = await saveImage(photoBmsFront);
    imagesSelectedObject.photoBmsFront = photoBmsFrontNew; // Key-value pair
}

if (photoBmsSide) {
    const photoBmsSideNew = await saveImage(photoBmsSide);
    imagesSelectedObject.photoBmsSide = photoBmsSideNew; // Key-value pair
}

if (photoBmsBack) {
    const photoBmsBackNew = await saveImage(photoBmsBack);
    imagesSelectedObject.photoBmsBack = photoBmsBackNew; // Key-value pair
}
    const imagesObjectFinal = Object.keys(imagesSelectedObject).length > 0 ? JSON.stringify(imagesSelectedObject) : '';

    // const imagesArrayFinal = imagesSelectedArray.length > 0 ? (JSON.stringify(imagesSelectedArray)) : '';
    console.log('imagesObjectFinal: ',imagesObjectFinal);
    const userBSAndMeasurements = {
      user_id :userIdNum,
      date: selectedDate !== "" ? selectedDate : lastInsertedRowDate,
      height: heightBms,
      weight: weightBms,
      neck: neckBms,
      shoulder: shoulderBms,
      chest: chestBms,
      arm: armBms,
      forearm: forearmBms,
      torso: torsoBms,
      h_hips: highHipsBms,
      hips: hipsBms,
      thigh: calvesBms,
      calves: thighBms,
      images: imagesObjectFinal,
      is_sync :'no',
    };
    console.log('userBSAndMeasurements: ',userBSAndMeasurements);

    insertBodyStatsAndMeasurements(userBSAndMeasurements).then((result)=>{
      ////console.log('result insert user Measurements into database',result);
      setLoading(false);
      setShowSuccess(true); // Show success message and animation
      // Delay to allow users to see the success message before closing the modal
      setTimeout(() => {
        setShowSuccess(false);
            //         navigation.navigate('OurServices');

      }, 2000); // 2 seconds delay

    //   Alert.alert(`${t(' ')}`,
    //   `${t('Your_measurements_added_successfully')}`,
    //   [
    //     {
    //       text: 'OK',
    //       onPress: () => {
    //         navigation.navigate('OurServices');
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
    }).catch((error) => {
      setLoading(false);
      setShowSuccess(false); // Reset success state
console.log('error',error);
      Alert.alert(` `,
      `${t(error.message)}`);
    });
    
  };
  useEffect(() => {
		loadImages();
	}, []);

  

  
  

//-------------- images options buttons -------------//
const { showActionSheetWithOptions } = useActionSheet();

const onPressFront = () => { 
  const cancelButtonIndex = -1;
  const options = [`${t("Take_photo")}`, `${t("Upload_image")}`];


  showActionSheetWithOptions({
    options,
    cancelButtonIndex,
  }, (selectedIndex) => {
    switch (selectedIndex) {
      case 0:
        
        // (async () => {
        //   const { status } = await Camera.requestCameraPermissionsAsync();
        //   if(status === "granted"){
        //     setCameraFrontVisible(status === "granted");
        //   }
          
        // })();
        takeNewWorkoutPhotoFront();
        break;

      case 1:
        pickImageBmsFront();
        break;

      case cancelButtonIndex:
        // Canceled
    }});
};
const onPressSide = () => { 
  const options = [`${t("Take_photo")}`, `${t("Upload_image")}`];
  const cancelButtonIndex = -1;

  showActionSheetWithOptions({
    options,
    cancelButtonIndex,
  }, (selectedIndex) => {
    switch (selectedIndex) {
      case 0:
        
        // (async () => {
        //   const { status } = await Camera.requestCameraPermissionsAsync();
        //   if(status === "granted"){
        //     setCameraSideVisible(status === "granted");
        //   }
          
        // })();
        takeNewWorkoutPhotoSide();
        break;

      case 1:
        pickImageBmsSide();
        break;

      case cancelButtonIndex:
        // Canceled
    }});
};
const onPressBack = () => { 
  const options = [`${t("Take_photo")}`, `${t("Upload_image")}`];
  const cancelButtonIndex = -1;

  showActionSheetWithOptions({
    options,
    cancelButtonIndex,
  }, (selectedIndex) => {
    switch (selectedIndex) {
      case 0:
        // (async () => {
        //   const { status } = await Camera.requestCameraPermissionsAsync();
        //   if(status === "granted"){
        //     setCameraBackVisible(status === "granted");
        //   }
          
        // })();
        takeNewWorkoutPhotoBack();
        break;

      case 1:
        pickImageBmsBack();
        break;

      case cancelButtonIndex:
        // Canceled
    }});
};
//zoom Front 
const [isFrontImageFullScreenVisible, setFrontImageFullScreenVisible] = useState(false);

  const handleFrontImagePress = () => {
    setFrontImageFullScreenVisible(true);
  };

  const handleCloseFrontFullScreen = () => {
    setFrontImageFullScreenVisible(false);
  };
//zoom Side 
const [isSideImageFullScreenVisible, setSideImageFullScreenVisible] = useState(false);

  const handleSideImagePress = () => {
    setSideImageFullScreenVisible(true);
  };

  const handleCloseSideFullScreen = () => {
    setSideImageFullScreenVisible(false);
  };
  //zoom Back 
const [isBackImageFullScreenVisible, setBackImageFullScreenVisible] = useState(false);

const handleBackImagePress = () => {
  setBackImageFullScreenVisible(true);
};

const handleCloseBackFullScreen = () => {
  setBackImageFullScreenVisible(false);
};

//--------------------- end images options button -------------/
  return (
    <PageContainer>
    <ScrollView >

        <View>
        </View>
      <Spacer size="large">
            <ServiceInfoParentView >
              {showInfo ? (
                <ServiceCloseInfoButtonView>
                  <ServiceCloseInfoButton onPress={toggleInfo}>
                    <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                  </ServiceCloseInfoButton>
                  <ServiceCloseInfoButtonTextView>
                    <ServiceCloseInfoButtonText>{t("body_stats_and_measurments_page_desc")}</ServiceCloseInfoButtonText>
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
        </Spacer>
      <Spacer size="medium">
        <InputField style={{justifyContent:'space-between', flexDirection: 'row' }}>
            <FormInputView style={{width:"48%"}}>
              
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => setModalVisible(true)}>
              <CalendarFullSizePressableButtonText >{t("Select_Date")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            <Modal visible={modalVisible} transparent={true} animationType="fade">
              <ViewOverlay>
              <PlansScreen navigation={navigation}
                    onAddEntry={() => setModalVisible(false)}
                  />
              </ViewOverlay>
            </Modal>
            </FormInputView>       
            <NewFormLabelDateRowView style={{ width: "48%", }}><FormLabelDateRowViewText style={{ textAlign:'center' }}>{selectedDate !== "" ? selectedDate : lastInsertedRowDate}</FormLabelDateRowViewText></NewFormLabelDateRowView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Height")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Height")}
            value={heightBms}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHeightBms(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Weight")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Weight")}
              value={weightBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightBms(u)}
            /> 
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Neck")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Neck")}
              value={neckBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setNeckBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Shoulder")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Shoulder")}
            value={shoulderBms}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setShoulderBms(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Chest")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Chest")}
              value={chestBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setChestBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Arm")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Arm")}
              value={armBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setArmBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Forearm")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Forearm")}
            value={forearmBms}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setForearmBms(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Torso")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Torso")}
              value={torsoBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setTorsoBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      {/* <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>{t("High_Hips")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("High_Hips")}
              value={highHipsBms}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setHighHipsBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer> */}
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>   {t("Hips")}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t("Hips")}
            value={ hipsBms }
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setHipsBms(u)}
          />
        </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Thigh")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Thigh")}
              value={ thighBms }
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setThighBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
          <FormLabelView>
            <FormLabel>   {t("Calves")}:</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={t("Calves")}
              value={calvesBms }
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setCalvesBms(u)}
            />
          </FormInputView>
          </InputField>
      </Spacer>
      <Spacer size="medium">
      <InputField>
      <FormLabelView>
        <FormLabel>   {t("Front_image")}:</FormLabel>
        <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
          <FormElemeentSizeButtonView style={{width:"100%",margin:0}}> 
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => onPressFront()}>
            <CalendarFullSizePressableButtonText >{t("Add_image")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
        </FormElemeentSizeButtonParentView>
        </FormLabelView>
          <FormInputView>
          {photoBmsFront !== "" ? (
            <>
            <TouchableOpacity onPress={handleFrontImagePress}>
              <TouchableOpacity style={styles.closeSmallImageButton} onPress={handleRemoveSmallImageFront}>
                  <View style={styles.closeImageButtonInner} >
                  <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                  </View>
              </TouchableOpacity>
              <Image
                style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10}}
                source={{
                  uri: `${photoBmsFront}`
                }}
              />
            </TouchableOpacity>
            <Modal visible={isFrontImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseFrontFullScreen}>
            <View style={styles.modalFrontImageOverlay}>
                <TouchableOpacity style={styles.closeFrontImageButton} onPress={handleCloseFrontFullScreen}>
                <View style={styles.closeFrontImageButtonInner} >
                <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
                </TouchableOpacity>
                <Image style={styles.fullScreenFrontImage} source={{ uri: `${photoBmsFront}` }} />
            </View>
            </Modal>
            </>
          ):(null)}
          <CameraFrontScreen isVisible={cameraFrontVisible} onClose={() => setCameraFrontVisible(false)} onTakeFrontBodyImage={handleFrontBodyImageCamera} />
          </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
      <InputField>
      <FormLabelView>
        <FormLabel>   {t("Side_image")}:</FormLabel>
        <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
        <FormElemeentSizeButtonView style={{width:"100%",margin:0}}> 
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => onPressSide()}>
            <CalendarFullSizePressableButtonText >{t("Add_image")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
        </FormElemeentSizeButtonParentView>
        </FormLabelView>
          <FormInputView>
            {photoBmsSide !== "" ? (
              <>
            <TouchableOpacity onPress={handleSideImagePress}>
            <TouchableOpacity style={styles.closeSmallImageButton} onPress={handleRemoveSmallImageSide}>
                <View style={styles.closeImageButtonInner} >
                  <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
              </TouchableOpacity>
            <Image
              style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10}}
              source={{
                uri: `${photoBmsSide}`
              }}
            />
             </TouchableOpacity>
            <Modal visible={isSideImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseSideFullScreen}>
            <View style={styles.modalSideImageOverlay}>
                <TouchableOpacity style={styles.closeSideImageButton} onPress={handleCloseSideFullScreen}>
                <View style={styles.closeSideImageButtonInner} >
                <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
                </TouchableOpacity>
                <Image style={styles.fullScreenSideImage} source={{ uri: `${photoBmsSide}` }} />
            </View>
            </Modal>
        </>
          ):(null)}
          <CameraSideScreen isVisible={cameraSideVisible} onClose={() => setCameraSideVisible(false)} onTakeSideBodyImage={handleSideBodyImageCamera} />
          </FormInputView>
        </InputField>
      </Spacer>
      <Spacer size="medium">
      <InputField>
      <FormLabelView>
        <FormLabel>   {t("Back_image")}:</FormLabel>
        <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
        <FormElemeentSizeButtonView style={{width:"100%",margin:0}}> 
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => onPressBack()}>
            <CalendarFullSizePressableButtonText >{t("Add_image")}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
          </FormElemeentSizeButtonView>
        </FormElemeentSizeButtonParentView>
        </FormLabelView>
          

          <FormInputView>
          {photoBmsBack !== "" ? (
          <>
            <TouchableOpacity onPress={handleBackImagePress}>
            <TouchableOpacity style={styles.closeSmallImageButton} onPress={handleRemoveSmallImageBack}>
                <View style={styles.closeImageButtonInner} >
                  <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                </View>
              </TouchableOpacity>
            <Image
              style={{width: 180,height: 165,left:'15%',borderRadius:35}}
              source={{
                uri: `${photoBmsBack}`
              }}
            />
            </TouchableOpacity>
              <Modal visible={isBackImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseBackFullScreen}>
              <View style={styles.modalBackImageOverlay}>
                  <TouchableOpacity style={styles.closeBackImageButton} onPress={handleCloseBackFullScreen}>
                  <View style={styles.closeBackImageButtonInner} >
                  <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                  </View>
                  </TouchableOpacity>
                  <Image style={styles.fullScreenBackImage} source={{ uri: `${photoBmsBack}` }} />
              </View>
              </Modal>
            </>
          ):(null)}
          <CameraBackScreen isVisible={cameraBackVisible} onClose={() => setCameraBackVisible(false)} onTakeBackBodyImage={handleBackBodyImageCamera} />
          </FormInputView>

        </InputField>
      </Spacer>
    <Spacer size="large">
      <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        

          {(!lastInsertedRowHasData)?(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={() => handleBSAndMeasurementsSubmit()}>
          <CalendarFullSizePressableButtonText >{t("Add_Entry")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
          ):(
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={() => handleBSAndMeasurementsSubmit()}>
          <CalendarFullSizePressableButtonText >{t("Update_Entry")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
          )
          }
            {/* {loading && (
              <View style={{ flex: 1 }}>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'transparent',width:"100%",height:780,}}>
                  <ActivityIndicator size="large" color="green" />
                </View>
              </View>
            )} */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={loading || showSuccess} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loading && !showSuccess && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {showSuccess && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      <Text style={styles.successText}>{t('Your_measurements_added_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal>
            <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}

                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
            </Modal>
            {/* Rest of your component UI */}
      </FormElemeentSizeButtonParentView>
    </Spacer>
    <Spacer size="medium">
      {/* <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
onPress={()=>navigation.goBack()}>
          <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </FormElemeentSizeButtonParentView> */}
    </Spacer>
    <Spacer size="large"></Spacer>
    <Spacer size="small"></Spacer>

    </ScrollView>
    
    </PageContainer>
  );
};

const styles = StyleSheet.create({
//zoom image Front
    modalFrontImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenFrontImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeFrontImageButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  closeFrontImageButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:"center",
    alignItems:"center",
  },
  //zoom image Side
   modalSideImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenSideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeSideImageButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  closeSideImageButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:"center",
    alignItems:"center",
  },
  //zoom image Back
   modalBackImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenBackImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeBackImageButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  closeBackImageButtonInner: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent:"center",
    alignItems:"center",
  },
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
  successText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
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
});