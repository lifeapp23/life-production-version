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


export const TrainerTraineeTodayMealsScreen = ({navigation,route}) => {
    const publicWorkoutsPlanRow = route?.params?.publicWorkoutsPlanRowConArr;
    ////console.log('publicWorkoutsPlanRow',publicWorkoutsPlanRow);
    // Get today's date
    const today = new Date();
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    
    // Filter the plans to find the one where today's date falls between strDat and endDat
    const publicWorkoutsPlanRowCon = publicWorkoutsPlanRow.find(plan => {
        const startDate = new Date(plan.strDat);
        const endDate = new Date(plan.endDat);
        return startDate <= today && today <= endDate;
    });

    // Log the plan for today
    //console.log('publicWorkoutsPlanRowCon',publicWorkoutsPlanRowCon);
   
    const [userId, setUserId] = useState("");  
    const [userToken, setUserToken] = useState("");  
    const netInfo = useNetInfo();
    const speKey = userId + '.' + new Date().getTime();
    const [predefinedMeals, setPredefinedMeals] = useState([]);
    const [triainerConnected,setTriainerConnected] =  useState(false);

    const [todayMealsData, setTodayMealsData] = useState({});
    const [dayNameAddEntry, setDayNameAddEntry] = useState("");  

    
    const [totalCalories, setTotalCalories] = useState(0);
    const [totalProtein, setTotalProtein] = useState(0);
    const [totalCarbs, setTotalCarbs] = useState(0);
    const [totalFats, setTotalFats] = useState(0); 

    
    
    const [newCertificatesSelectsValue,setNewCertificatesSelectsValue] =  useState([]);

    const [newCertificatesTextValue,setNewCertificatesTextValue] =  useState([]);
    
    


    // our number of inputs, we can add the length or decrease
    const [certificatesNumInputs, setCertificatesNumInputs] = useState(1);
    //const [certificatesNumInputs, setCertificatesNumInputs] = useState(2);

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


 useFocusEffect(
    React.useCallback(() => {
      
      AsyncStorage.getItem("sanctum_token")
  .then((res) => {
  AsyncStorage.getItem("currentUser").then((user) => {

      const storedUser = JSON.parse(user);
      setUserId(storedUser.id);
      const unsubscribe = addEventListener(state => {
        ////console.log("res--", res);
        ////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        ////console.log('---------------now online--------')
        ////console.log('my today page',publicWorkoutsPlanRowCon);

        const todayDay =new Date().toISOString().split('T')[0];
        axios.get(`https://life-pf.com/api/get-trainer-trainee-today-meals?traineeId=${publicWorkoutsPlanRowCon?.trneId}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&planId=${publicWorkoutsPlanRowCon?.id}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&todDay=${todayDay}`, {
        headers: {
          'Authorization': `Bearer ${res}`,
          'Content-Type': 'application/json',
        },
        })
        .then(response => {
          // Handle successful response
          //////console.log('getTraineeTodayMeals::,',response?.data["getTraineeTodayMeals"]);
          ////console.log('getTraineePlanDays::,',response?.data["getTraineePlanDays"]);

          
          setDayNameAddEntry(response?.data["getTraineeTodayMeals"]?.dayNam);
          setTodayMealsData(response?.data["getTraineeTodayMeals"]);
          //let parsedMalAry =[];
          ////console.log('getTraineePlanDaysone::,',response?.data["getTraineePlanDays"]);
           let parsedGetTraineePlanDaysMalAry = [];
           if(response?.data["getTraineePlanDays"].length > 0 ){
                      ////console.log('response?.data["getTraineePlanDays"]',response?.data["getTraineePlanDays"].length );
                      //  parsedGetTraineePlanDaysMalAry = response?.data["getTraineePlanDays"].map(item => JSON.parse(item.malAry)).flat();
                        parsedGetTraineePlanDaysMalAry = response?.data["getTraineePlanDays"]
                       .map(item => {
                         // Parse the malAry for each item
                         let malAry = JSON.parse(item.malAry);
                     
                         // Loop over each object in malAry array
                         malAry = malAry.map(meal => {
                          // Check if meal.imageId exists in any PMResults object
                          const isImageIdInPMResults = PMResults.some(pm => pm.foddes === meal.foddes);

                          if (isImageIdInPMResults) {
                            return null; // Skip this meal if the imageId is in PMResults
                          }
                           const weight = meal.weight || 1; // Get the weight, default to 1 if not found
                              
                           // Loop over each key in the meal object
                           Object.keys(meal).forEach(key => {
                             // Check if the value of the key is a number and the key is not 'weight'
                             if ( 
                            key != 'foddes' &&
                             key != 'date'
                              && key != 'time'
                               && key != 'Type'
                                && key != 'Subtyp'
                                && key != 'images' && key != 'imageId') {
                               // Divide the value by the weight
                               meal[key] = meal[key] / weight;
                             }
                           });
                     
                           return meal; // Return the updated meal object
                         }).filter(meal => meal !== null); // Filter out null values (skipped meals)

                     
                         return malAry; // Return the transformed malAry array
                       })
                       .flat(); // Flatten the array of arrays
                     // Remove duplicate meals based on a unique key (e.g., meal.foddes)
                        parsedGetTraineePlanDaysMalAry = parsedGetTraineePlanDaysMalAry.filter(
                          (meal, index, self) =>
                            index === self.findIndex(m => m.foddes === meal.foddes) // Ensure only one instance of each 'foddes' remains
                        );

                        // Now `parsedGetTraineePlanDaysMalAry` has unique meals with duplicate entries removed.

                     
                      
                      // The result `parsedGetTraineePlanDaysMalAry` will now have updated numerical values divided by weight.
                      
                      }

           ////console.log('parsedGetTraineePlanDaysMalAryone::,',[...parsedGetTraineePlanDaysMalAry]);
 
          if(Object.keys(response?.data["getTraineeTodayMeals"]).length > 0){
            //////console.log('response?.data["getTraineeTodayMeals"]',response?.data["getTraineeTodayMeals"]);

          const parsedMalAry = JSON.parse(response?.data["getTraineeTodayMeals"]?.malAry);
            //////console.log('parsedMalAry',parsedMalAry);
          
          setCertificatesNumInputs(parsedMalAry?.length);
          /************* */
           // Define a function to fetch both arrays and merge them
          const fetchDataAndUpdateState = async () => {
            try {
                // Fetch both arrays concurrently
                const [PMResults, LOFResults] = await Promise.all([
                    fetchAlltDaysPredefinedMeals(storedUser.id),
                    fetchAlltDaysListOfFoods(storedUser.id)
                ]);
      
                // Merge the arrays
                const mergedResults = [...parsedGetTraineePlanDaysMalAry,...LOFResults,...PMResults];
                //////console.log('mergedResults',mergedResults);
                //////console.log('parsedMalAry',parsedMalAry);

                let newCertificatesInputsAry = []; // Create a new array to hold all values
                let newCertificatesSelectsValueAry = []; // Create a new array to hold all values
                if(parsedMalAry?.length > 0){
                  for (let i = 0; i < parsedMalAry?.length; i++) {
                    ////console.log('parsedMalAry?.[i]?.weight?.toString()', i, parsedMalAry?.[i]?.weight?.toString());
                    // Add each value to the new array
                    newCertificatesInputsAry.push(parsedMalAry?.[i]?.weight?.toString());
                    //const certificatesDatIndex = predefinedMeals.indexOf(parsedMalAry?.[i]?.foddes);
                    const certificatesDatIndex = mergedResults.findIndex(obj => obj?.foddes === parsedMalAry?.[i]?.foddes);
          
                    ////console.log('certificatesDatIndex', i, certificatesDatIndex);
                    ////console.log('parsedMalAry?.[i]?.foddes?.toString()', i, parsedMalAry?.[i]?.foddes?.toString());
          
                    newCertificatesSelectsValueAry.push(certificatesDatIndex);
          
          
                  }
                }
                //Update the state once with the new array containing all values
                //console.log('newCertificatesTextValue', newCertificatesInputsAry);
                //console.log('NewCertificatesSelectsValue', newCertificatesSelectsValueAry);

                setNewCertificatesTextValue(newCertificatesInputsAry);
                setNewCertificatesSelectsValue(newCertificatesSelectsValueAry);
                  
                
                // Update the state with the merged array
                //setPredefinedMeals(mergedResults);
            } catch (error) {
                ////console.log('Error fetching data:', error);
            }
            };
  
        // Call the function to fetch and update the state
        fetchDataAndUpdateState();
  
       
           /************************ */
            }

        })
        .catch(error => {
          // Handle error
          ////console.log('Error fetching Meals:', error);
        });

      }else{
        ////console.log('else no internet ahmed');
       
              

      }
    
    
    });
    // Unsubscribe
    unsubscribe();
    
      })
      
  });

    }, [])
  );
useEffect(() => {

      
  
  AsyncStorage.getItem("sanctum_token")
  .then((res) => {
  AsyncStorage.getItem("currentUser").then((user) => {

      const storedUser = JSON.parse(user);
      setUserId(storedUser.id);
      const unsubscribe = addEventListener(state => {
        ////console.log("Connection type--", state.type);
        ////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);
      if(state.isConnected){
        ////console.log('---------------now online--------')
        ////console.log('my today page',publicWorkoutsPlanRowCon);

        const todayDay =new Date().toISOString().split('T')[0];
        axios.get(`https://life-pf.com/api/get-trainer-trainee-today-meals?traineeId=${publicWorkoutsPlanRowCon?.trneId}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&planId=${publicWorkoutsPlanRowCon?.id}&trainerId=${publicWorkoutsPlanRowCon?.trnrId}&todDay=${todayDay}`, {
        headers: {
          'Authorization': `Bearer ${res}`,
          'Content-Type': 'application/json',
        },
        })
        .then(response => {
          // Handle successful response
          ////console.log('getTraineeTodayMeals::,',response?.data["getTraineeTodayMeals"]);
          //setTodayMealsData(response?.data["getTraineeTodayMeals"]);
          // Define a function to fetch both arrays and merge them
           ////console.log('getTraineePlanDaystwo::,',response?.data["getTraineePlanDays"]);
           let parsedGetTraineePlanDaysMalAry = [];
           if(response?.data["getTraineePlanDays"].length > 0 ){
                      ////console.log('response?.data["getTraineePlanDays"]',response?.data["getTraineePlanDays"].length );
                      //  parsedGetTraineePlanDaysMalAry = response?.data["getTraineePlanDays"].map(item => JSON.parse(item.malAry)).flat();
                        parsedGetTraineePlanDaysMalAry = response?.data["getTraineePlanDays"]
                       .map(item => {
                         // Parse the malAry for each item
                         let malAry = JSON.parse(item.malAry);
                     
                         // Loop over each object in malAry array
                         malAry = malAry.map(meal => {
                          // Check if meal.imageId exists in any PMResults object
                          const isImageIdInPMResults = PMResults.some(pm => pm.foddes === meal.foddes);

                          if (isImageIdInPMResults) {
                            return null; // Skip this meal if the imageId is in PMResults
                          }
                           const weight = meal.weight || 1; // Get the weight, default to 1 if not found
                              
                           // Loop over each key in the meal object
                           Object.keys(meal).forEach(key => {
                             // Check if the value of the key is a number and the key is not 'weight'
                             if ( 
                            key != 'foddes' &&
                             key != 'date'
                              && key != 'time'
                               && key != 'Type'
                                && key != 'Subtyp'
                                && key != 'images' && key != 'imageId') {
                               // Divide the value by the weight
                               meal[key] = meal[key] / weight;
                             }
                           });
                     
                           return meal; // Return the updated meal object
                         }).filter(meal => meal !== null); // Filter out null values (skipped meals)

                     
                         return malAry; // Return the transformed malAry array
                       })
                       .flat(); // Flatten the array of arrays
                     // Remove duplicate meals based on a unique key (e.g., meal.foddes)
                        parsedGetTraineePlanDaysMalAry = parsedGetTraineePlanDaysMalAry.filter(
                          (meal, index, self) =>
                            index === self.findIndex(m => m.foddes === meal.foddes) // Ensure only one instance of each 'foddes' remains
                        );

                        // Now `parsedGetTraineePlanDaysMalAry` has unique meals with duplicate entries removed.

                     
                      
                      // The result `parsedGetTraineePlanDaysMalAry` will now have updated numerical values divided by weight.
                      
                      }

           //console.log('The new after updates result `parsedGetTraineePlanDaysMalAry`::,',parsedGetTraineePlanDaysMalAry);
 
      const fetchDataAndUpdateState = async () => {
        try {
            // Fetch both arrays concurrently
            const [PMResults, LOFResults] = await Promise.all([
                fetchAlltDaysPredefinedMeals(storedUser.id),
                fetchAlltDaysListOfFoods(storedUser.id)
            ]);
  
            // Merge the arrays
            const mergedResults = [...parsedGetTraineePlanDaysMalAry,...LOFResults,...PMResults];
            ////console.log('mergedResults',mergedResults);
  
            
            // Update the state with the merged array
            setPredefinedMeals(mergedResults);
        } catch (error) {
            ////console.log('Error fetching data:', error);
        }
        };
  
        // Call the function to fetch and update the state
        fetchDataAndUpdateState();
  
       
  
        })
        .catch(error => {
          // Handle error
          ////console.log('Error fetching Meals:', error);
        });

      }else{
        ////console.log('else no internet ahmed');
       
              

      }
    
    
    });
    // // Unsubscribe
    // unsubscribe();
     

      })
      
  });
 
}, [fetchAlltDaysPredefinedMeals,fetchAlltDaysListOfFoods,]);


  
  /////////////// Start Certificates functionalty///////////
 
 

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

  const certificatesInputsItems= [];
  for (let i = 0; i < certificatesNumInputs; i++)
  {
    certificatesInputsItems.push(
      <View key={i} >

      <InfoField>
        <SelectInfo style={{left:"5%",width:90}}>
            <InfoSelector
              value={predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes || ''}
              onSelect={value => setCertificatesSelectValue(i,value-1)} 
              placeholder={t('Select_one')}
              status="newColor"
              style={{width:90}}
            >
              

              {predefinedMeals.map(renderCertificatesOption)}
            </InfoSelector>
        </SelectInfo>   
        <WriteInfo style={{flex:1}}>
          <WriteInfoChild>
          <InfoInputView style={{width:50,left:"27%"}}>
              <TextInput
                style={{ width:50,borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, marginRight: 10,backgroundColor:'white' }}
                placeholder={t("g")}
                  theme={{colors: {primary: '#3f7eb3'}}}
                  value={newCertificatesTextValue?.[i] ? newCertificatesTextValue?.[i] : ""}
                  textContentType="name"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={value => setCertificatesInputValue(i,value)}
              />
          </InfoInputView> 
          <Text style={styles.rightContainerTextProtein}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.protin).toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCarbs}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.carbs).toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextFats}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.fats).toFixed(4)) || '0'}</Text>
          <Text style={styles.rightContainerTextCalories}>{parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.calris).toFixed(4)) || '0'}</Text>
           
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
      </View>
    );
   
    // Update the certificatesInfo state when the certificatesInputs change
    if (predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes !== undefined  && newCertificatesTextValue?.[i] !== '' && newCertificatesTextValue?.[i] !== undefined && newCertificatesTextValue?.[i] !== 'undefined'){
      certificatesInfo.push({
        foddes:predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.foddes,
        date:new Date().toISOString().split('T')[0],
        time:new Date().toLocaleTimeString(),
        weight: parseFloat(newCertificatesTextValue?.[i]),
        protin: parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.protin).toFixed(4)),
        carbs:  parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.carbs).toFixed(4)),
        fats:  parseFloat((newCertificatesTextValue?.[i] *predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.fats).toFixed(4)),
        calris: parseFloat((newCertificatesTextValue?.[i] * predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.calris).toFixed(4)),
        Type: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Type ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Type: "",
        Subtyp: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Subtyp ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Subtyp : "",
        Satrtd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Satrtd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Satrtd*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Plnstd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Plnstd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Plnstd*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Munstd: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Munstd ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Munstd*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Trans: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Trans ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Trans*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Sodium: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Sodium ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Sodium*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Potsim: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Potsim ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Potsim*newCertificatesTextValue?.[i]).toFixed(4)) :"",
        Chostl: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Chostl ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Chostl*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        VtminA: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminA ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminA*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        VtminC: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminC ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.VtminC*newCertificatesTextValue?.[i]).toFixed(4)):"",
        Calcim: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Calcim ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Calcim*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        Iron: predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Iron ? parseFloat((predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.Iron*newCertificatesTextValue?.[i]).toFixed(4)) : "",
        images:predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.images ? predefinedMeals?.[newCertificatesSelectsValue?.[i]]?.images : "",
    
        });

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
    
  let newData={
    trnrId: publicWorkoutsPlanRowCon?.trnrId,
    trneId:publicWorkoutsPlanRowCon?.trneId,
    planId:publicWorkoutsPlanRowCon?.id,
    todDay:new Date().toISOString().split('T')[0],
    speKey:todayMealsData?.speKey ? todayMealsData?.speKey: speKey,
    dayNam:dayNameAddEntry,
    malAry:JSON.stringify(certificatesInfo),
  };
    ////console.log('newData: ',newData);
    
  
   if(triainerConnected){
    axios.post(`https://life-pf.com/api/trainer-trainee-today-meal-insert`, newData)
    .then((response) => {
        ////console.log('Trainer plan day data sent to online Database', response?.data?.message);
        Alert.alert(`${t(' ')}`,'Today_Meals_added_to_Database_successfully',
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
              Alert.alert(JSON.stringify(error?.response?.data?.message));
            });
  
   
   }else{
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
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
                  <ServicesPagesCardHeader>{t('Today_Meals')}</ServicesPagesCardHeader>
              </ServicesPagesCardCover>
              <Spacer>
                <InputField style={{marginTop:10,marginBottom:10}}>
                  <FormLabelView>
                    <FormLabel>{t('Day_Name')}:</FormLabel>
                  </FormLabelView>
                  <FormInputView>
                    <FormInput
                      placeholder={t('Day_Name')}
                      value={dayNameAddEntry}
                      theme={{colors: {primary: '#3f7eb3'}}}
                      onChangeText={(text) => setDayNameAddEntry(text)}
                    />
                  </FormInputView>
                </InputField>
              </Spacer>
              <Spacer size="large">
                <InfoFieldParent>
                    <ScrollView>
                    <SelectorTextField>
                        <FormLabel>{t('Day_s_Meals')}:</FormLabel>
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
                      <FormLabel style={{fontSize:16}}>{t("Fats")}:</FormLabel>
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
              {(userId != publicWorkoutsPlanRowCon?.trnrId)?(
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
                        
                ):(null)}
              
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                  <FormElemeentSizeButtonView style={{width:'100%'}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:'100%'}} onPress={() => navigation.goBack()}
           >
                    <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              
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
    color:"white",
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
    color:"white",
    
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
    color:"white",
    
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
  //   color:"white",
  //   flex: 1,
  //   marginLeft:-8,
  // },
  // rightContainerTextTime:{
  //   flex: 1,
  //   fontSize:13,
  //   color:"white",
  //   marginVertical: 15,
  //   marginRight:-8,
  //   marginLeft:-26,
  //   flexWrap: 'wrap',
  // },
  FromToViewTextProtein:{
    fontSize:13,
    fontWeight:'bold',
    color:"white",
    
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
    color:"white",
    position:'absolute',
    right:'65%'
  },
  FromToViewTextCarbs:{
    fontSize:13,
    fontWeight:'bold',
    color:"white",

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
    color:"white",
    position:'absolute',
    right:'48%'
  },
  FromToViewTextFats:{
    fontSize:13,
    fontWeight:'bold',
    color:"white",
    
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
    color:"white",
    position:'absolute',
    right:'32%'
  },
  
  FromToViewTextCalories:{
    fontSize:13,
    fontWeight:'bold',
    color:"white",
    
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
    color:"white",
    position:'absolute',
    right:'15%'
  },
  
});