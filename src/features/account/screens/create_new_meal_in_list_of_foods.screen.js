import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { ScrollView,View, Modal,Alert,StyleSheet,TouchableOpacity,Image,Text} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as FileSystem from 'expo-file-system';
import { IndexPath , Select, SelectItem } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import { StackActions } from '@react-navigation/native';

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
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    GenderSelector,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    FormElemeentSizeButton,
    FullSizeButtonView,
    FullButton,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
    ViewOverlay,
    FormLabelDateRowView,
    FormLabelDateRowViewText,
    AsteriskTitle,

  
  } from "../components/account.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { insertPlansListOfFoods} from "../../../../database/list_of_foods";
import "./i18n";
import { useTranslation } from 'react-i18next';

const newListOfFoodsImgDir = FileSystem.documentDirectory + 'images/';
const getFileInfo = async (fileURI) => {
  const fileInfo = await FileSystem.getInfoAsync(fileURI)
  return fileInfo
}
const isLessThanTheMB = (fileSize, smallerThanSizeMB) => {
  const isOk = fileSize / 1024 / 1024 < smallerThanSizeMB
  return isOk
}

const ensureNewListOfFoodsImgDirExists = async () => {
const dirInfo = await FileSystem.getInfoAsync(newListOfFoodsImgDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(newListOfFoodsImgDir, { intermediates: true });
    }
}; 

export const CreateNewMealInListOfFoodsScreen =({ navigation })=>{
  const {t} = useTranslation();
  const [isPressDisabled, setPressDisabled] = useState(false);

    const [nameAddEntry, setNameAddEntry] = useState("");
    const [weightAddEntry, setWeightAddEntry] = useState("");  
    const [proteinAddEntry, setProteinAddEntry] = useState("");
    const [carbsAddEntry, setCarbsAddEntry] = useState("");
    const [fatsAddEntry, setFatsAddEntry] = useState(""); 
    const [caloriesAddEntry, setCaloriesAddEntry] = useState("");
    const [typeAddEntry, setTypeAddEntry] = useState(""); 
    const [subtypeAddEntry, setSubtypeAddEntry] = useState(""); 
    const [saturatedAddEntry, setSaturatedAddEntry] = useState(""); 
    const [polyunsaturatedAddEntry, setPolyunsaturatedAddEntry] = useState(""); 
    const [monounsaturatedAddEntry, setMonounsaturatedAddEntry] = useState(""); 
    const [transAddEntry, setTransAddEntry] = useState(""); 
    const [sodiumAddEntry, setSodiumAddEntry] = useState(""); 
    const [potassiumAddEntry, setPotassiumAddEntry] = useState(""); 
    const [cholesterolAddEntry, setCholesterolAddEntry] = useState(""); 
    const [vitaminAAddEntry, setVitaminAAddEntry] = useState(""); 
    const [vitaminCAddEntry, setVitaminCAddEntry] = useState(""); 
    const [calciumAddEntry, setCalciumAddEntry] = useState(""); 
    const [ironAddEntry, setIronAddEntry] = useState("");
    const [imagesAddEntry, setImagesNameAddEntry] = useState("");
    const [userId, setUserId] = useState('');
    const [modalVisible,setModalVisible] = useState(false);
    const [imageNameSent,setImageNameSent] = useState("");
    const [imageTypeSent,setImageTypeSent] = useState("");
    
    ////////////// Start TypeData////////////////
    const [selectedType, setSelectedType] =  useState("");
    const [typeChecked, setTypeChecked ] = useState('');

    const typeData = [
      'Dairy and Egg Products',
      'Spices and Herbs',
      'Baby Foods',
      'Fats and Oils',
      'Poultry Products',
      'Soups, Sauces, and Gravies',
      'Sausages and Luncheon Meats',
      'Breakfast Cereals',
      'Fruits and Fruit Juices',
      'Pork Products',
      'Vegetables and Vegetable Products',
      'Nut and Seed Products',
      'Beef Products',
      'Beverages',
      'Finfish and Shellfish Products',
      'Legumes and Legume Products',
      'Lamb, Veal, and Game Products',
      'Baked Products',
      'Snacks',
      'Sweets',
      'Cereal Grains and Pasta',
      'Fast Foods',
      'Meals, Entrees, and Sidedishes',
      'Restaurant Foods'
    ];
    const renderTypeOption = (title,i) => (
      <SelectItem title={title} key={i} />
    );
    
    ////////////// End TypeData////////////////

    useFocusEffect(
        React.useCallback(() => {

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
        AsyncStorage.getItem("currentUser").then((user) => {
          // setSearchQuery('');
          // setSelectedMuscles(''); 
          // setSelectedEquipments('');
            const storedUser = JSON.parse(user);
            setUserId(storedUser.id);
            ////console.log('predefined meals user',storedUser);
            // fetchListOfFoodsTable(storedUser.id).then((WResults) => {
            //   setFetchedData(WResults);
            //   setFilteredData(WResults);
            //     }).catch((error) => {
            //     //console.error('Error fetching ListOfFoodsTable:', error);
            // });
           
              
            
            })
            
        });
       
        }, [])
      );
    const hideModal = () => setModalVisible(false);
    const speKey = userId + '.' + new Date().getTime();
    const { showActionSheetWithOptions } = useActionSheet();
    const onPressListOfFoodsMedia = () => { 
      const cancelButtonIndex = -1;
      const options = [`${t('Upload_image')}`, `${t('Take_photo')}`];
      showActionSheetWithOptions({
          options,
          cancelButtonIndex,
          }, (selectedIndex) => {
          switch (selectedIndex) {
          case 0:
          pickImageAddEntry();
          break;
          case 1:
          // Take photo
          takeNewWorkoutPhoto();
          break;
          case cancelButtonIndex:
          // Canceled
          }});
  
  };
    // Select image from mobile
    const pickImageAddEntry = async () => {
      // No permissions request is necessary for launching the image library
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
        });
    
        if (!result.canceled) {
          ////console.log('Selected result.assets[0]:', result.assets[0].type);
          ////console.log('Selected result.assets[0].uri:', result.assets[0].uri);
          setImageTypeSent(result.assets[0].type);
          
          //isLessThanTheMB
          const fileInfo = await getFileInfo(result.assets[0].uri);
          
          ////console.log('Selected fileInfo?.size:', fileInfo?.size);

          if (result.assets[0].type === 'image') {
            const isLt5MB = isLessThanTheMB(fileInfo.size, 5);
            ////console.log('Selected isLt5MB:', isLt5MB);

            if (!isLt5MB) {
              Alert.alert(`${t('Image_size_must_be_smaller_than_5MB')}`)
              return;
            }
            // Handle the selected image URI
            ////console.log('Selected Image URI:', result.assets[0].uri);
            setImagesNameAddEntry(result.assets[0].uri);
          }
    

        
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
        setImagesNameAddEntry(result.assets[0].uri);
        
        }
      } catch (error) {
      //console.error('Error taking photo:', error);
      }
      };
    const saveNewListOfFoodsImage = async (uri) => {
      await ensureNewListOfFoodsImgDirExists();
    
      // Extract file extension from the URI
      const fileExtension = uri.split('.').pop() || 'jpeg';
    
      const filename = new Date().getTime() + `.${fileExtension}`;
      setImageNameSent(filename);
      const dest = newListOfFoodsImgDir + filename;
    
      await FileSystem.copyAsync({ from: uri, to: dest });
      return dest;
    };
    function isImageUrl(url) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
        const lowercasedUrl = url?.toLowerCase();
        return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
      }
    // Use useEffect to update caloriesAddEntry whenever proteinAddEntry, carbsAddEntry, or fatsAddEntry changes
    useEffect(() => {
      // Check if all three values are filled
      if (proteinAddEntry && carbsAddEntry && fatsAddEntry) {
        // Perform the calculation and update the caloriesAddEntry state
        const protein = parseFloat(proteinAddEntry) || 0;
        const carbs = parseFloat(carbsAddEntry) || 0;
        const fats = parseFloat(fatsAddEntry) || 0;

        const calories = protein * 4 + carbs * 4 + fats * 9;
        setCaloriesAddEntry(parseFloat(calories.toFixed(4))); // Round to two decimal places
      }
    }, [proteinAddEntry, carbsAddEntry, fatsAddEntry]);
    const addEntryHandler = async () => {
      if (isPressDisabled) return;
    
        setPressDisabled(true);
        let finalNewWorkoutImages = '';
        if(imagesAddEntry){
            try {
                const savedNewListOfFoodsImageConst = await saveNewListOfFoodsImage(imagesAddEntry);
                finalNewWorkoutImages = savedNewListOfFoodsImageConst;
                ////console.log('savedNewListOfFoodsImageConst', savedNewListOfFoodsImageConst);
            } catch (error) {
                ////console.log('Error saving image:', error);
            }

        }
      
      if (nameAddEntry.toString().trim() !== "" && weightAddEntry && proteinAddEntry && carbsAddEntry && fatsAddEntry && typeChecked) {
        //////console.log('savedNewListOfFoodsImageConst',savedNewListOfFoodsImageConst);
        const newData = {
          userId:userId,
          speKey:speKey,
          food_description: nameAddEntry,
          weight: parseFloat((weightAddEntry/weightAddEntry).toFixed(4)),
          protein: parseFloat((proteinAddEntry/weightAddEntry).toFixed(4)),
          carbohydrates: parseFloat((carbsAddEntry/weightAddEntry).toFixed(4)),
          fats: parseFloat((fatsAddEntry/weightAddEntry).toFixed(4)),
          calories: parseFloat((caloriesAddEntry/weightAddEntry).toFixed(4)),
          Type: typeChecked ? typeChecked: "",
          Subtype: "",
          Saturated: saturatedAddEntry ? parseFloat((saturatedAddEntry/weightAddEntry).toFixed(4)) : "",
          Polyunsaturated: polyunsaturatedAddEntry ? parseFloat((polyunsaturatedAddEntry/weightAddEntry).toFixed(4)) : "",
          Monounsaturated: monounsaturatedAddEntry ? parseFloat((monounsaturatedAddEntry/weightAddEntry).toFixed(4)) : "",
          Trans: transAddEntry ? parseFloat((transAddEntry/weightAddEntry).toFixed(4)) : "",
          Sodium: sodiumAddEntry ? parseFloat((sodiumAddEntry/weightAddEntry).toFixed(4)) : "",
          Potassium: potassiumAddEntry ? parseFloat((potassiumAddEntry/weightAddEntry).toFixed(4)) :"",
          Cholesterol: cholesterolAddEntry ? parseFloat((cholesterolAddEntry/weightAddEntry).toFixed(4)) : "",
          Vitamin_A: vitaminAAddEntry ? parseFloat((vitaminAAddEntry/weightAddEntry).toFixed(4)) : "",
          Vitamin_C: vitaminCAddEntry ? parseFloat((vitaminCAddEntry/weightAddEntry).toFixed(4)):"",
          Calcium: calciumAddEntry ? parseFloat((calciumAddEntry/weightAddEntry).toFixed(4)) : "",
          Iron: ironAddEntry ? parseFloat((ironAddEntry/weightAddEntry).toFixed(4)) : "",

          images: "",

          // images:finalNewWorkoutImages ? finalNewWorkoutImages : "",
          deleted:'no',
          isSync:'no'
        };
        ////console.log('newData',newData);
        insertPlansListOfFoods(newData).then((PMResults) => {
              ////console.log('insert Meal in ListOfFoods succesfully:', PMResults);
              Alert.alert(`${t(' ')}`,
                    `${t('Your_New_Meals_added_successfully')}`,
                    [
                    {
                        text: 'OK',
                        onPress: () => {
                        // navigation.navigate('AllMealsPage');
                        navigation.dispatch(StackActions.pop(1));

                        },
                    },
                    ],
                    { cancelable: false }
                );
              }).catch((error) => {
              ////console.log('Error insert Meals in ListOfFoods:', error);
              Alert.alert(``, `${t(error)}`);

            });
        
      }else{
        Alert.alert(`${t('Please_Fill_those_Fields')}`,`${t('type_Weight_protein_carbohydrates_and_fats')}`);
        } 
        setTimeout(() => {
          setPressDisabled(false);
        }, 3000); // Disable press for 300ms to prevent quick successive presses
    };
    const [isImageFullScreenVisible, setImageFullScreenVisible] = useState(false);
  const handleImagePress = () => {
    setImageFullScreenVisible(true);
  };

  const handleCloseFullScreen = () => {
    setImageFullScreenVisible(false);
  };
    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{t('Add_food')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          
        
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t('Name')}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={t("Name")}
                value={nameAddEntry}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setNameAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Type")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              {/* <FormInput
                placeholder={t("Type")}
                value={typeAddEntry}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setTypeAddEntry(u)}
              /> */}
              {/* Type select */}
              
              <GenderSelector
                selectedIndex={selectedType}
                onSelect={(index) => {
                  setSelectedType(index);
                  //console.log('index',index);
                  setTypeChecked(typeData[index?.row]);
                  }}
                placeholder={t('Select_Type')}
                value={typeChecked}
                status="newColor"
                size="customSizo"
                style={{width:"100%"}}
              >
                {typeData.map(renderTypeOption)}
              </GenderSelector>
            </FormInputView>
            </InputField>
        </Spacer>
        {/* <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Subtype")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={t("Subtype")}
                value={subtypeAddEntry}
                keyboardType="default"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setSubtypeAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer> */}
        <Spacer size="medium">
          <InputField>
          <FormLabelView  style={{width:"42%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Weight")}:</FormLabel>
          </FormLabelView>
          <FormInputView style={{width:"58%"}}>
            <FormInput
              placeholder={t("Weight_100_g")}
              value={weightAddEntry}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setWeightAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Protein")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Protein")}(${t("g")})`}
                value={proteinAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setProteinAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Carbohydrates")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput 
                placeholder={`${t("Carbs")}(${t("g")})`}
                value={carbsAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setCarbsAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
          <FormLabelView  style={{width:"42%"}}>
            <FormLabel><AsteriskTitle>*</AsteriskTitle> {t("Fats")}:</FormLabel>
          </FormLabelView>
          <FormInputView style={{width:"58%"}}>
            <FormInput
              placeholder={`${t("Fats")}(${t("g")})`}
              value={fatsAddEntry}
              keyboardType="numeric"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setFatsAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
        <Spacer size="medium">
              <InputField >
                <FormLabelView  style={{width:"42%"}}>
                  <FormLabel>{t("Calories")}:</FormLabel>
                </FormLabelView>
                  <FormLabelDateRowView><FormLabelDateRowViewText>{caloriesAddEntry}</FormLabelDateRowViewText></FormLabelDateRowView>
              </InputField>
            </Spacer>
        <Spacer size="medium">


        
        <Spacer size="small">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Saturated")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Saturated")}(${t("g")})`}
                value={saturatedAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setSaturatedAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Polyunsaturated")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Polyunsaturated")}(${t("g")})`}
                value={polyunsaturatedAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setPolyunsaturatedAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Monounsaturated")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Monounsaturated")}(${t("g")})`}
                value={monounsaturatedAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setMonounsaturatedAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Trans")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Trans")}(${t("g")})`}
                value={transAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setTransAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Sodium")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Sodium")}(${t("mg")})`}
                value={sodiumAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setSodiumAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Potassium")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Potassium")}(${t("mg")})`}
                value={potassiumAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setPotassiumAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Cholesterol")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Cholesterol")}(${t("mg")})`}
                value={cholesterolAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setCholesterolAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Vitamin_A")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Cholesterol")}(${t("mcg")})`}
                value={vitaminAAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setVitaminAAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Vitamin_C")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Vitamin_C")}(${t("mg")})`}
                value={vitaminCAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setVitaminCAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Calcium")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Calcium")}(${t("mg")})`}
                value={calciumAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setCalciumAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
          <InputField>
            <FormLabelView  style={{width:"42%"}}>
              <FormLabel>{t("Iron")}:</FormLabel>
            </FormLabelView>
            <FormInputView style={{width:"58%"}}>
              <FormInput
                placeholder={`${t("Iron")}(${t("mg")})`}
                value={ironAddEntry}
                keyboardType="numeric"
                theme={{colors: {primary: '#3f7eb3'}}}
                onChangeText={(u) => setIronAddEntry(u)}
              />
            </FormInputView>
            </InputField>
        </Spacer>

      </Spacer>
{/* 
        <Spacer size="small">
          <InputField style={{marginTop:10}}
      >
          <FormLabelView  style={{width:"42%"}}>
          <FormLabel style={{marginLeft:0}}
      >{t('Images')}:</FormLabel>
          <FormElemeentSizeButtonParentView style={{flexDirection: 'column',marginLeft:0,}}>
              <FormElemeentSizeButtonView style={{width:"100%",marginTop:5}}> 
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={onPressListOfFoodsMedia}>
              <CalendarFullSizePressableButtonText >{t('Add_image')}</CalendarFullSizePressableButtonText>
              </CalendarFullSizePressableButton>
              </FormElemeentSizeButtonView>
          </FormElemeentSizeButtonParentView>
          </FormLabelView>
              <FormInputView style={{width:"58%"}}>
              {(imagesAddEntry !== "")? (
                  <>
                  <TouchableOpacity onPress={handleImagePress}>
                  <Image
                      style={{width: 180,height: 165,left:'15%',borderRadius:35,marginBottom:10,marginTop:10}}
                      source={{
                      uri: `${imagesAddEntry}`
                      }}
                  />
                  </TouchableOpacity>
                  <Modal visible={isImageFullScreenVisible} transparent={true} animationType="fade" onRequestClose={handleCloseFullScreen}>
                  <View style={styles.modalImageOverlay}>
                      <TouchableOpacity style={styles.closeImageButton} onPress={handleCloseFullScreen}>
                      <View style={styles.closeImageButtonInner} >
                      <Text style={{color:"black",fontSize:20,flex:1,justifyContent:"center",alignItems:"center"}}>X</Text>
                      </View>
                      </TouchableOpacity>
                      <Image style={styles.fullScreenImage} source={{ uri: `${imagesAddEntry}` }} />
                  </View>
                  </Modal>
              </>
              ):(null)}
            
              </FormInputView>
          </InputField>
        </Spacer> */}
      <Spacer size="large">
      <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"100%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={()=>{
                addEntryHandler();
                
                }}>
                    <CalendarFullSizePressableButtonText >{t("Add_new_food")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                    
                  </FormElemeentSizeButtonView>
                  
                </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="medium">
      <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
        <FormElemeentSizeButtonView style={{width:"100%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.goBack()}
           >
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
        </FormElemeentSizeButtonParentView>
    </Spacer>
      </ScrollView>
      
      </PageContainer>
    );
  };

  const styles = StyleSheet.create({
 
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



   });