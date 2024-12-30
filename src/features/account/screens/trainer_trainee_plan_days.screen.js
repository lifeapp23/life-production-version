import React, { useState, useRef,useEffect} from 'react';
import {Switch,ScrollView,Alert, Modal, StyleSheet, Pressable, View,TextInput,Text} from 'react-native';
import { SelectItem } from '@ui-kitten/components';
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { PlansCalendarScreen } from "./TrainerManageMyProfileCalendar";
import {useNetInfo} from "@react-native-community/netinfo";
import { addEventListener } from "@react-native-community/netinfo";
import { fetchAlltDaysPredefinedMeals} from "../../../../database/predefined_meals";
import { fetchAlltDaysListOfFoods} from "../../../../database/list_of_foods";
import "./i18n";
import { useTranslation } from 'react-i18next';


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

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
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButtonText,
    CalendarFullSizePressableButton,
    ViewOverlay,
    FormLabelDateRowView,
    FormLabelDateRowViewText,
    InfoFieldParent,
    InfoField,
    SelectInfo,
    WriteInfo,
    InfoSelector,
    WriteInfoChild,
    InfoInput,
    SelectorTextField,
    InfoInputView,
    ResultsParentView,ResultsHalfRowView,
    ResultsHalfRowLabelView,
    ResultsHalfRowResultPlaceView,
    ResultsHalfRowResultPlaceViewText,
  
  } from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import {AntDesign} from '@expo/vector-icons';


export const TrainerTraineePlanDaysScreen = ({navigation,route}) => {
  const params = route.params || {};
  // //console.log('params',params);
 const { sentDay = {},publicWorkoutsPlanRowConArr = {}} = params;
 
    // const { sentDay, publicWorkoutsPlanRowConArr } = route?.params;
    const publicWorkoutsPlanRowCon = publicWorkoutsPlanRowConArr;
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [dayNameAddEntry, setDayNameAddEntry] = useState(sentDay?.dayNam ? sentDay?.dayNam : "");  
   
    const [userId, setUserId] = useState(""); 
    const [userInfo, setUserInfo] = useState({}); 

    
    const [userToken, setUserToken] = useState("");  
    const netInfo = useNetInfo();
    const speKey = userId + '.' + publicWorkoutsPlanRowConArr.trneId  + '.' + new Date().getTime();
    
    let speKeySentOrNormal = sentDay?.speKey ? sentDay?.speKey : speKey;

    const [predefinedMeals, setPredefinedMeals] = useState([]);
    const [triainerConnected,setTriainerConnected] =  useState(false);

    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFats, setTotalFats] = useState(0); 

    // Function to check if a value is numeric
    function isNumeric(value) {
      return !isNaN(value) && value !== null && value !== '';
    }
    let parsedMalAry =[];
    let parsedMalAryWillBeAddedToPMResultsAndLOFResultsDataInSelect =[];
    let updatedMalAry=[];
    if(Object.keys(sentDay).length > 0){
      parsedMalAry = JSON.parse(sentDay?.malAry);
      // Loop through each object in the array and update the numerical values
      // Create a new array with updated values
        updatedMalAry = parsedMalAry.map(obj => {
          let weight = obj.weight;

          // Return a new object with updated values
          return Object.keys(obj).reduce((acc, key) => {
            if(key != "imageId"){
              acc[key] = isNumeric(obj[key]) ? parseFloat((parseFloat(obj[key]) / weight)?.toFixed(4)) : obj[key];
              
            }
            return acc;
          }, {});
        });

        //console.log("updatedMalAry",updatedMalAry);
      ////console.log('parsedMalAry',parsedMalAry);
    }
    
    const [newCertificatesSelectsValue,setNewCertificatesSelectsValue] =  useState([]);

    const [newCertificatesTextValue,setNewCertificatesTextValue] =  useState([]);
    
    


    // our number of inputs, we can add the length or decrease
    const [certificatesNumInputs, setCertificatesNumInputs] = useState(parsedMalAry?.length ? parsedMalAry?.length : 1);
  // Helper function to check if two objects are equal by comparing specific properties
function isSameObject(obj1, obj2) {
  return obj1.foddes === obj2.foddes; // You can adjust this based on unique keys
}
  
    useEffect (() => {
//console.log('sentDay',sentDay);
//console.log('parsedMalAry',parsedMalAry);


//console.log('newCertificatesSelectsValue',newCertificatesSelectsValue);
//console.log('newCertificatesTextValue',newCertificatesTextValue);


  }, [sentDay,newCertificatesSelectsValue,newCertificatesTextValue]);

//   useEffect (() => {
//    // Subscribe
// const unsubscribe = addEventListener(state => {
//   ////console.log("Connection type", state.type);
//   ////console.log("Is connected?", state.isConnected);
// // if(state.isConnected){
// //   axios.get('https://3a5d-62-114-9-225.ngrok-free.app/api/get-profile', {
// //     headers: {
// //       'Authorization': `Bearer ${userToken}`,
// //       'Content-Type': 'application/json',
// //     },
// //     })
// //     .then(response => {
// //       // Handle successful response
// //       ////console.log('Profile data:', response.data);
// //     })
// //     .catch(error => {
// //       // Handle error
// //       //console.error('Error fetching profile:', error);
// //     });
// // }else{

// // }
  

// });

// // Unsubscribe
// unsubscribe();
//   }, [addEventListener]);
useEffect(() => {

      
  
  AsyncStorage.getItem("sanctum_token")
  .then((res) => {
  AsyncStorage.getItem("currentUser").then((user) => {

      const storedUser = JSON.parse(user);
      setUserId(storedUser.id);
      setUserInfo(storedUser)
     // Define a function to fetch both arrays and merge them
      const fetchDataAndUpdateState = async () => {
      try {
          // Fetch both arrays concurrently
          const [PMResults, LOFResults] = await Promise.all([
              fetchAlltDaysPredefinedMeals(storedUser.id),
              fetchAlltDaysListOfFoods(publicWorkoutsPlanRowCon?.trnrId)
          ]);

          // Merge the arrays
          const mergedResults = [...LOFResults,...PMResults];

          // Filter updatedMalAry to exclude any object that is in mergedResults
          const filteredUpdatedMalAry = updatedMalAry.filter(updatedObj => {
            return !mergedResults.some(mergedObj => isSameObject(updatedObj, mergedObj));
          });
          //console.log('filteredUpdatedMalAry', filteredUpdatedMalAry);

          // Now merge the filtered array with mergedResults
          const finalMergedResults = [...filteredUpdatedMalAry,...mergedResults];
          ////console.log('mergedResults',mergedResults);
            let newCertificatesInputsAry = []; // Create a new array to hold all values
            let newCertificatesSelectsValueAry = []; // Create a new array to hold all values
            if(parsedMalAry.length > 0){
                for (let i = 0; i < certificatesNumInputs; i++) {


                  
                  // Add each value to the new array
                  newCertificatesInputsAry.push(parsedMalAry?.[i]?.weight?.toString());
                  //const certificatesDatIndex = predefinedMeals.indexOf(parsedMalAry?.[i]?.foddes);
                  const certificatesDatIndex = finalMergedResults.findIndex(obj => obj?.foddes === parsedMalAry?.[i]?.foddes);
        
                  ////console.log('certificatesDatIndex', i, certificatesDatIndex);
                  ////console.log('parsedMalAry?.[i]?.foddes?.toString()', i, parsedMalAry?.[i]?.foddes?.toString());
        
                  newCertificatesSelectsValueAry.push(certificatesDatIndex);

                  

                }
              }
              
            
            
            // Update the state once with the new array containing all values
            setNewCertificatesTextValue(newCertificatesInputsAry);
            setNewCertificatesSelectsValue(newCertificatesSelectsValueAry);
          //  //console.log('mergedResults', mergedResults);

          // Update the state with the merged array
          setPredefinedMeals(finalMergedResults);
      } catch (error) {
          ////console.log('Error fetching data:', error);
      }
      };

      // Call the function to fetch and update the state
      fetchDataAndUpdateState();

      const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
      
      
      });
      // Unsubscribe
      unsubscribe();


      })
      
  });
 
}, [fetchAlltDaysPredefinedMeals,fetchAlltDaysListOfFoods]);


  
  /////////////// Start Certificates functionalty///////////
 
  useFocusEffect(
    React.useCallback(() => {
      
      //console.log('speKey:', speKey);

  if (sentDay) {
    //console.log('sentDay:', sentDay);
  }
  
  if (publicWorkoutsPlanRowConArr) {
    //console.log('publicWorkoutsPlanRowConArr:', publicWorkoutsPlanRowConArr);
  }

    }, [])
  );

  const setCertificatesSelectValue = (index,value)=>{
    
    const newCertificatesSelects = [...newCertificatesSelectsValue];
    newCertificatesSelects[index] = value;
  
    setNewCertificatesSelectsValue(newCertificatesSelects);
  }
  const setCertificatesInputValue = (index,value)=>{


    const newCertificatesInputs = [...newCertificatesTextValue];
    newCertificatesInputs[index] = value;
  
  setNewCertificatesTextValue(newCertificatesInputs);
  }
  const addCertificatesInput =() =>{
 
    setCertificatesNumInputs(value => value +1);
  }
  const removeCertificatesInput = (i)=>{
    //remove from the array by index value

    // Create new arrays without the element to remove
    const newSelects = newCertificatesSelectsValue.filter((_, index) => index !== i);
    const newInputs = newCertificatesTextValue.filter((_, index) => index !== i);

    setNewCertificatesSelectsValue(newSelects);
    setNewCertificatesTextValue(newInputs);
    //decrease the number of inputs
    setCertificatesNumInputs(value => value -1);
  }
  const renderCertificatesOption = (title,i) => (
    <SelectItem key={i} title={title?.foddes}  />
  );
  const certificatesInfo =[];
////console.log('userInfo',userInfo);
  const certificatesInputsItems= [];
  for (let i = 0; i < certificatesNumInputs; i++)
  {
    certificatesInputsItems.push(
      <View key={i} >
{(userId == publicWorkoutsPlanRowCon?.trnrId)?(
      <InfoField>
        <SelectInfo style={{left:"5%",width:90}}>
            <InfoSelector
              value={predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes || ''}
              onSelect={value => setCertificatesSelectValue(i,value-1)} 
              placeholder={t('Select_one')}
              status="newColor"
              
              disabled={userInfo.role === 'Trainee' || userId === publicWorkoutsPlanRowCon?.trneId} // Disable if condition matches
              style={{width:90}}
            >
              

              {predefinedMeals.map(renderCertificatesOption)}
            </InfoSelector>
        </SelectInfo>   
        <WriteInfo style={{flex:1}}>
          <WriteInfoChild>
          <InfoInputView style={{width:50,left:"27%"}}>
              <TextInput
                style={{ width:50,borderWidth: 1, borderColor: 'black', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                placeholder={t("g")}
                  theme={{colors: {primary: '#3f7eb3'}}}
                  value={newCertificatesTextValue?.[i] ? newCertificatesTextValue?.[i] : ""}
                  textContentType="name"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  editable={userInfo.role != 'Trainee' && userId != publicWorkoutsPlanRowCon?.trneId} // Disable if condition matches
                  onChangeText={value => setCertificatesInputValue(i,value)}
              />
          </InfoInputView> 

          
          <Text style={styles.rightContainerTextProtein}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.protin)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCarbs}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.carbs)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextFats}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.fats)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCalories}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.calris)?.toFixed(4)) || '0'}</Text>
           
          {(userId == publicWorkoutsPlanRowCon?.trnrId)?(
            (i == certificatesNumInputs-1) ? (
            <Pressable onPress={addCertificatesInput} style={{backgroundColor:'#000',borderRadius:10,position:'absolute',right:'3%'}}>
              <AntDesign name="pluscircleo" size={20} color="white" />
          </Pressable>):( <Pressable onPress={() => removeCertificatesInput(i)} style={{backgroundColor:'#000',borderRadius:10,position:'absolute',right:'3%'}}>
            <AntDesign name="minuscircleo" size={20} color="white" />
          </Pressable>)     
            ):(null)}
          </WriteInfoChild>
        </WriteInfo>
        </InfoField>
):(
  <InfoField>
        <SelectInfo style={{left:"5%",width:90}}>
            <InfoSelector
              value={parsedMalAry?.[i]?.foddes || ''}
              onSelect={value => setCertificatesSelectValue(i,value-1)} 
              placeholder={t('Select_one')}
              status="newColor"
              
              disabled={userInfo.role === 'Trainee' || userId === publicWorkoutsPlanRowCon?.trneId} // Disable if condition matches
              style={{width:90}}
            >
              

              {predefinedMeals.map(renderCertificatesOption)}
            </InfoSelector>
        </SelectInfo>   
        <WriteInfo style={{flex:1}}>
          <WriteInfoChild>
          <InfoInputView style={{width:50,left:"27%"}}>
              <TextInput
                style={{ width:50,borderWidth: 1, borderColor: 'black', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                placeholder={t("g")}
                  theme={{colors: {primary: '#3f7eb3'}}}
                  value={parsedMalAry?.[i]?.weight?.toString() || ""}
                  textContentType="name"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  editable={userInfo.role != 'Trainee' && userId != publicWorkoutsPlanRowCon?.trneId} // Disable if condition matches
                  onChangeText={value => setCertificatesInputValue(i,value)}
              />
          </InfoInputView> 
          <Text style={styles.rightContainerTextProtein}>{parseFloat((parsedMalAry?.[i]?.protin)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCarbs}>{parseFloat((parsedMalAry?.[i]?.carbs)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextFats}>{parseFloat((parsedMalAry?.[i]?.fats)?.toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCalories}>{parseFloat((parsedMalAry?.[i]?.calris)?.toFixed(4)) || '0'}</Text>

          
          
          </WriteInfoChild>
        </WriteInfo>
        </InfoField>
)}
      
      </View>
    );
   if(userId == publicWorkoutsPlanRowCon?.trnrId){
     // Update the certificatesInfo state when the certificatesInputs change
     if (predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes !== undefined  && newCertificatesTextValue?.[i] !== '' && newCertificatesTextValue?.[i] !== undefined && newCertificatesTextValue?.[i] !== 'undefined'){
      certificatesInfo.push({
        foddes:predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes,
        date:new Date().toISOString().split('T')[0],
        time:new Date().toLocaleTimeString(),
        weight: parseFloat(newCertificatesTextValue?.[i]),
        protin: parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.protin)?.toFixed(4)),
        carbs:  parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.carbs)?.toFixed(4)),
        fats:  parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.fats)?.toFixed(4)),
        calris: parseFloat((newCertificatesTextValue?.[i] * predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.calris)?.toFixed(4)),
        Type: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Type ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Type: "",
        Subtyp: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Subtyp ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Subtyp : "",
        Satrtd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Satrtd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Satrtd*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Plnstd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Plnstd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Plnstd*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Munstd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Munstd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Munstd*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Trans: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Trans ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Trans*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Sodium: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Sodium ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Sodium*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Potsim: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Potsim ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Potsim*newCertificatesTextValue?.[i])?.toFixed(4)) :"",
        Chostl: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Chostl ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Chostl*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        VtminA: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminA ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminA*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        VtminC: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminC ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminC*newCertificatesTextValue?.[i])?.toFixed(4)):"",
        Calcim: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Calcim ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Calcim*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        Iron: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Iron ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Iron*newCertificatesTextValue?.[i])?.toFixed(4)) : "",
        images:predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.images ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.images : "",
        imageId:predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.id ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.id : "",
        });

    }
   }else{
 // Update the certificatesInfo state when the certificatesInputs change
 if (parsedMalAry?.[i]?.foddes !== undefined  && parsedMalAry?.[i] != '' && parsedMalAry?.[i] !== undefined && parsedMalAry?.[i] !== 'undefined'){
  certificatesInfo.push({
    foddes:parsedMalAry?.[i]?.foddes,
    date:new Date().toISOString().split('T')[0],
    time:new Date().toLocaleTimeString(),
    weight: parseFloat(parsedMalAry?.[i]?.weight),
    protin: parseFloat((parsedMalAry?.[i]?.protin)?.toFixed(4)),
    carbs:  parseFloat((parsedMalAry?.[i]?.carbs)?.toFixed(4)),
    fats:  parseFloat((parsedMalAry?.[i]?.fats)?.toFixed(4)),
    calris: parseFloat((parsedMalAry?.[i]?.calris)?.toFixed(4)),
    Type: parsedMalAry?.[i]?.Type || "",
    Subtyp: "",
    Satrtd: parsedMalAry?.[i]?.Satrtd ? parseFloat((parsedMalAry?.[i]?.Satrtd)?.toFixed(4)) : "",
    Plnstd: parsedMalAry?.[i]?.Plnstd ? parseFloat((parsedMalAry?.[i]?.Plnstd)?.toFixed(4)) : "",
    Munstd: parsedMalAry?.[i]?.Munstd ? parseFloat((parsedMalAry?.[i]?.Munstd)?.toFixed(4)) : "",
    Trans: parsedMalAry?.[i]?.Trans ? parseFloat((parsedMalAry?.[i]?.Trans)?.toFixed(4)) : "",
    Sodium: parsedMalAry?.[i]?.Sodium ? parseFloat((parsedMalAry?.[i]?.Sodium)?.toFixed(4)) : "",
    Potsim: parsedMalAry?.[i]?.Potsim ? parseFloat((parsedMalAry?.[i]?.Potsim)?.toFixed(4)) :"",
    Chostl: parsedMalAry?.[i]?.Chostl ? parseFloat((parsedMalAry?.[i]?.Chostl)?.toFixed(4)) : "",
    VtminA: parsedMalAry?.[i]?.VtminA ? parseFloat((parsedMalAry?.[i]?.VtminA)?.toFixed(4)) : "",
    VtminC: parsedMalAry?.[i]?.VtminC ? parseFloat((parsedMalAry?.[i]?.VtminC)?.toFixed(4)):"",
    Calcim: parsedMalAry?.[i]?.Calcim ? parseFloat((parsedMalAry?.[i]?.Calcim)?.toFixed(4)) : "",
    Iron: parsedMalAry?.[i]?.Iron ? parseFloat((parsedMalAry?.[i]?.Iron)?.toFixed(4)) : "",
    images:parsedMalAry?.[i]?.images ? parsedMalAry?.[i]?.images : "",
    imageId:parsedMalAry?.[i]?.imageId ? parsedMalAry?.[i]?.imageId : "",
    userId:publicWorkoutsPlanRowCon?.trnrId,
    });

}
   }
   
   

  }

  // useEffect(() => {
   
  //   for (let i = 0; i < certificatesNumInputs; i++)
  // {
  //       const newCertificatesInputs = [...newCertificatesTextValue];
  //       newCertificatesInputs[i] = parsedMalAry?.[i]?.weight?.toString();
      
  //     setNewCertificatesTextValue(newCertificatesInputs);
  // }
  // }, []);
  


  const addPlansDayEntryHandler = () => {
   if (dayNameAddEntry.trim() == "" || certificatesInfo.length == 0){
    Alert.alert(`${t(' ')}`,`${t('please_fill_day_and_At_least_one_Meal_Fields')}`)
    return;
   }
    
  const newData={
    trnrId: publicWorkoutsPlanRowCon?.trnrId,
    trneId:publicWorkoutsPlanRowCon?.trneId,
    planId:publicWorkoutsPlanRowCon?.id,
    speKey:sentDay?.speKey ? sentDay?.speKey: speKey,
    dayNam:dayNameAddEntry,
    malAry:JSON.stringify(certificatesInfo),
  };
    ////console.log('newData: ',newData);
    
  
   if(triainerConnected){
    axios.post(`https://www.elementdevelops.com/api/trainer-trainee-meal-plan-day-insert`, newData)
    .then((response) => {
        ////console.log('Trainer plan day data sent to online Database', response?.data?.message);
        Alert.alert(`${t(' ')}`,`${t('Day_Meals_added_to_Database_successfully')}`,
                  [
                  {
                      text: 'OK',
                      onPress: () => {
                        navigation.goBack();
                      },
                  },
                  ],
                  { cancelable: false }
              );
          
            })
            .catch(error => {
              // Handle error
              Alert.alert(error?.response?.data?.message);
            });
  
   
   }else{
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to the_internet')}`);
   }
   
  };


  /////////////// End Certificates functionalty///////////
  useEffect (() => {

    ////console.log('certificatesInfo',certificatesInfo);
    ////console.log('certificatesInfo.length',certificatesInfo?.length);
    if (certificatesInfo?.length === 0){
      ////console.log('000');
    }else{
      ////console.log('ffff');
    }
  }, [certificatesInfo]);
 



const updateTotalValues = () => {
    // Initialize totals based on existing data
    const initialTotalCalories = certificatesInfo.reduce((total, meal) => total + (parseFloat((meal?.calris)) || 0), 0);
    const initialTotalProtein = certificatesInfo.reduce((total, meal) => total + (parseFloat((meal?.protin)) || 0), 0);
    const initialTotalCarbs = certificatesInfo.reduce((total, meal) => total + (parseFloat((meal?.carbs)) || 0), 0);
    const initialTotalFats = certificatesInfo.reduce((total, meal) => total + (parseFloat((meal?.fats)) || 0), 0);

    // Update state with initial values
    setTotalCalories(initialTotalCalories);
    setTotalProtein(initialTotalProtein);
    setTotalCarbs(initialTotalCarbs);
    setTotalFats(initialTotalFats);
  };

  useEffect(() => {
    // Update totals when the component mounts
    updateTotalValues();
  }, [certificatesInfo]);

    return (
        <PageContainer>
          <ScrollView>
              <TitleView >
                  <Title >Life</Title>
              </TitleView>
              <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{sentDay?.dayNam ? sentDay?.dayNam : `${t("Trainer_s_day_Meals")}`}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>
              <Spacer>
                <InputField style={{marginTop:10,marginBottom:10}}>
                  <FormLabelView>
                    <FormLabel>{t("Day_Name")}:</FormLabel>
                  </FormLabelView>
                  <FormInputView>
                    <FormInput
                      placeholder={t("Day_Name")}
                      value={dayNameAddEntry}
                      theme={{colors: {primary: '#3f7eb3'}}}
                      editable={userInfo.role != 'Trainee' && userId != publicWorkoutsPlanRowCon?.trneId} // Disable if condition matches

                      onChangeText={(text) => setDayNameAddEntry(text)}
                    />
                  </FormInputView>
                </InputField>
              </Spacer>
              <Spacer size="large">
                <InfoFieldParent>
                    <ScrollView>
                    <SelectorTextField>
                        <FormLabel>{t("Day_s_Meals")}:</FormLabel>
                    </SelectorTextField>
                    <View style={styles.FromToView}>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicFromToViewText : styles.EnglishFromToViewText]}>{t("Meal")}</Text>
                      <Text style={[styles.FromToViewTextWeight,isArabic ? styles.ArabicFromToViewTextWeight : styles.EnglishFromToViewTextWeight]}>{t("Weight")}</Text>
                      {/* <Text style={styles.FromToViewTextTime}>Time</Text> */}
                      <Text style={[styles.FromToViewTextProtein,isArabic ? styles.ArabicFromToViewTextProtein : styles.EnglishFromToViewTextProtein]}>{t("Protein")}</Text>
                      <Text style={[styles.FromToViewTextCarbs,isArabic ? styles.ArabicFromToViewTextCarbs : styles.EnglishFromToViewTextCarbs]}>{t("short_Carbs")}</Text>
                      <Text style={[styles.FromToViewTextFats,isArabic ? styles.ArabicFromToViewTextFats : styles.EnglishFromToViewTextFats]}>{t("short_Fats")}</Text>
                      <Text style={[styles.FromToViewTextCalories,isArabic ? styles.ArabicFromToViewTextCalories : styles.EnglishFromToViewTextCalories]}>{t("short_Calories")}</Text>
                    </View>
                    {certificatesInputsItems}
                    </ScrollView>
                </InfoFieldParent>
              </Spacer>
              <Spacer size="medium">
              <ResultsParentView >
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>{t("Protein")}:</FormLabel>
                  </ResultsHalfRowLabelView>
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalProtein?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:16}}>{t("Carbs")}:</FormLabel>
                  </ResultsHalfRowLabelView> 
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCarbs?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
              </ResultsParentView>
              </Spacer>
              <Spacer size="small">
                <ResultsParentView >
                  <ResultsHalfRowView >
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:16}}>{t("short_Fats")}:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalFats?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                  <ResultsHalfRowView>
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:16}}>{t("Calories")}:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText>{parseFloat(totalCalories?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                </ResultsParentView>
              </Spacer>
              {(userId == publicWorkoutsPlanRowCon?.trnrId)?(
                <>
                <Spacer size="large">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView style={{width:'100%'}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:'100%'}} onPress={addPlansDayEntryHandler}
           >
                    <CalendarFullSizePressableButtonText >{t("Save")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer>        
              <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.navigate('TrainerAddNewMealToPlanDaysMeals',{publicWorkoutsPlanRowCon:publicWorkoutsPlanRowCon,speKeySentOrNormal:speKeySentOrNormal,sentDay:sentDay})}>
                    <CalendarFullSizePressableButtonText >{t("Add_New_Meal")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>  
              </>    
                ):(null)}
              
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView style={{width:'100%'}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:'100%'}} onPress={() => navigation.goBack()}
           >
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              
              <Spacer size="large"></Spacer>
              <Spacer size="large"></Spacer>
            </ScrollView>
        </PageContainer>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    
  },
  viewContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    marginLeft:10,
    marginRight:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
  rightContainerText:{

    fontSize:13,
    width:50,
    color:"black",
    marginVertical: 15,
    flexWrap: 'wrap',
    marginRight:12,
  },

  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginVertical: 15,
    width:"100%",

  },
  FromToViewText:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewText:{
    position:'absolute',
    left:'8%',
  },
  EnglishFromToViewText:{
    position:'absolute',
    left:'4%'
  },
  FromToViewTextWeight:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextWeight:{
    position:'absolute',
    left:'31%'
  },
  EnglishFromToViewTextWeight:{
    position:'absolute',
    left:'28%'
  },
  // FromToViewTextTime:{
  //   fontSize:13,
  //   fontWeight:'bold',
  //   color:"black",
  //   flex: 1,
  //   marginLeft:-8,
  // },
  // rightContainerTextTime:{
  //   flex: 1,
  //   fontSize:13,
  //   color:"black",
  //   marginVertical: 15,
  //   marginRight:-8,
  //   marginLeft:-26,
  //   flexWrap: 'wrap',
  // },
  FromToViewTextProtein:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextProtein:{
    position:'absolute',
  left:'44%'
},
  EnglishFromToViewTextProtein:{
    position:'absolute',
    left:'44%'
  },
  rightContainerTextProtein:{
    fontSize:13,
    color:"black",
    position:'absolute',
    right:'65%'
  },
  FromToViewTextCarbs:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",

  },
  ArabicFromToViewTextCarbs:{
    position:'absolute',
    left:'58%'
  },
  EnglishFromToViewTextCarbs:{
    position:'absolute',
    left:'58%'
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    right:'48%'
  },
  FromToViewTextFats:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextFats:{
    position:'absolute',
    left:'69%'
  },
  EnglishFromToViewTextFats:{
    position:'absolute',
    left:'69%'
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    right:'32%'
  },
  
  FromToViewTextCalories:{
    fontSize:13,
    fontWeight:'bold',
    color:"black",
    
  },
  ArabicFromToViewTextCalories:{
    position:'absolute',
    left:'80%'
  },
  EnglishFromToViewTextCalories:{
    position:'absolute',
    left:'78%'
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:13,
    color:"black",
    position:'absolute',
    right:'15%'
  },
  
});