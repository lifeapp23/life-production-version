
import React, { useState, useEffect } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable} from "react-native";
import {AntDesign} from '@expo/vector-icons';
import { Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { Spinner } from '@ui-kitten/components';
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
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  ServiceCloseInfoButton,
  ServiceCloseInfoButtonTextView,
  ServiceCloseInfoButtonText,
  ServiceInfoButtonView,
  ServiceInfoButton,
  ServiceInfoButtonAvatarIcon,
  ServiceCloseInfoButtonAvatarIcon,
 
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addPlansEntry,removePlansEntry,editPlansEntry} from './public_manage_workouts';
import { WorkoutPlansCalendarScreen } from "./workout_plans_custom_calendar";
import { PlanNumberScreen } from "./plan_number.screen";
import { useFocusEffect } from '@react-navigation/native';
import { insertPublicWorkoutsPlans,fetchPublicWorkoutsPlans,fetchPublicWorkoutsPlansWithoutDeleting,SoftDeletePublicWorkoutsPlans,updatePublicWorkoutsPlans } from "../../../../database/public_workouts_plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPublicWorkoutsPlanDaysWithoutDeleting,SoftDeleteAllPublicWorkoutsPlanDayWorkouts,SoftDeletePublicWorkoutsPlanAllDays } from "../../../../database/public_workouts_plan_days";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import { addEventListener } from "@react-native-community/netinfo";



  
export const WorkoutPlansScreen = ({navigation,route}) => {
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
  const {t} = useTranslation();//add this line
  const [editedPlansEntry, setEditedPlansEntry] = useState(null);
  const [isEditPlansMode, setIsEditPlansMode] = useState(false);
  const dispatch = useDispatch();
  const [modalNewPlansVisible,setModalNewPlansVisible] = useState('');
  const [userId,setUserId] = useState('');
  const [publicWorkoutsPlansTable,setPublicWorkoutsPlansTable] = useState([]);
  // const currentDate = new Date().toISOString().split('T')[0];
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);


  const [triainerConnected,setTriainerConnected] =  useState(false);

  const [traineeData, setTraineeData] = useState({});    
  const traineeDataConst = traineeData;

  // useEffect(() => {
  //   AsyncStorage.getItem("sanctum_token")
  //   .then((res) => {
  //     //console.log('tokeeen:',res);
  //   AsyncStorage.getItem("currentUser").then((user) => {
  
  //       const storedUser = JSON.parse(user);
  //       setUserId(storedUser.id);
  
        
  //       const unsubscribe = addEventListener(state => {
  //         //console.log("Connection type--", state.type);
  //         //console.log("Is connected?---", state.isConnected);
  //         setTriainerConnected(state.isConnected);
  //       if(state.isConnected){
  //         //console.log('---------------now online--------')
  //         axios.get('https://life-pf.com/api/get-trainee-side-data', {
  //           headers: {
  //             'Authorization': `Bearer ${res}`,
  //             'Content-Type': 'application/json',
  //           },
  //           })
  //           .then(response => {
  //             // Handle successful response
  //             console.log('trainee workout plans----::',response.data?.['TraineesData']?.[0]);
  
             
  //             setTraineeData(response.data?.['TraineesData']?.[0]);
  //           })
  //           .catch(error => {
  //             // Handle error
  //             //console.log('Error fetching Trainee:', error);
  //           });
  //       }else{
  //         //console.log('else no internet ahmed');
  //         Alert.alert(`${t(' ')}`,
  //         `${t('Please_Connect_to_the_internet_To_see_the_Plan')}`,
  //         [
  //           {
  //             text: 'OK',
  //             onPress: () => {
               
  //             },
  //           },
  //         ],
  //         { cancelable: false }
  //       );
  
  //       }
  //     });
        
  //       // Unsubscribe
  //       unsubscribe();
  //       const timer = setTimeout(() => {
  //         setLoadingPageInfo(false);
  //       }, 2000); // 2 seconds
  //     })
  //   });

  // }, []);


  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        //console.log('tokeeen:',res);
      AsyncStorage.getItem("currentUser").then((user) => {
    
          const storedUser = JSON.parse(user);
          setUserId(storedUser.id);
    
          
          const unsubscribe = addEventListener(state => {
            //console.log("Connection type--", state.type);
            //console.log("Is connected?---", state.isConnected);
            setTriainerConnected(state.isConnected);
          if(state.isConnected){
            setLoadingPageInfo(true);

            //console.log('---------------now online--------')
            axios.get('https://life-pf.com/api/get-trainee-side-data', {
              headers: {
                'Authorization': `Bearer ${res}`,
                'Content-Type': 'application/json',
              },
              })
              .then(response => {
                // Handle successful response
                console.log('trainee workout plans----::',response.data?.['TraineesData']?.[0]);
    
               
                setTraineeData(response.data?.['TraineesData']?.[0]);
              })
              .catch(error => {
                // Handle error
                //console.log('Error fetching Trainee:', error);
              });
          }else{
            //console.log('else no internet ahmed');
            Alert.alert(`${t(' ')}`,
            `${t('Please_Connect_to_the_internet_To_see_the_Plan')}`,
            [
              {
                text: 'OK',
                onPress: () => {
                 
                },
              },
            ],
            { cancelable: false }
          );
    
          }
        });
          
          // Unsubscribe
          unsubscribe();
          const timer = setTimeout(() => {
            setLoadingPageInfo(false);
          }, 2000); // 2 seconds
        })
      });
  
    }, [AsyncStorage])
    );
    useFocusEffect(
        React.useCallback(() => {
          fetchPublicWorkoutsPlansWithoutDeleting(userId).then((publicWorkoutsPlansTableResults) => {
            ////console.log('publicWorkoutsPlans Table array',publicWorkoutsPlansTableResults);
            setPublicWorkoutsPlansTable(publicWorkoutsPlansTableResults);
        });
    }, [AsyncStorage,fetchPublicWorkoutsPlansWithoutDeleting,userId])
    );
  const showAddNewPlansModal = () => {
    
    setModalNewPlansVisible(true);
    setIsEditPlansMode(false);
    setIsEditPlansMode(false);
  };

  const showEditPlansModal = (entry) => {
    setModalNewPlansVisible(true);
    setIsEditPlansMode(true);
    setEditedPlansEntry(entry);
  };
  const hidePlansModal = () => {
    setModalNewPlansVisible(false);
    setIsEditPlansMode(false);
    setEditedPlansEntry(null);
  };
  const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);

  const [publicPlansDataTable, setPublicPlansDataTable] = useState(publicPlansDataArr);


  const getNextPublicPlansDataId = () => {
    const maxId = Math.max(...publicPlansDataTable.map(item => item.id), 0);
    return maxId + 1;
  };
  const softDeletePublicWorkout = (publicWorkoutsArray) => {
    const { id, userId,speKey } = publicWorkoutsArray;

    SoftDeletePublicWorkoutsPlans(id, userId,speKey)
      .then((result) => {
        ////console.log('PublicWorkout Plan deleted turned into yes successfully', result);
        SoftDeletePublicWorkoutsPlanAllDays(userId,speKey)
        .then((resultTwo) => {
          ////console.log('PublicWorkout All days deleted turned into yes successfully', resultTwo);
        });
        // Fetch and update the PublicWorkout equipments after soft deleting a gym
        return fetchPublicWorkoutsPlansWithoutDeleting(userId);
      })
      .then((updatedPublicWorkoutsPlans) => {
        // Update the state with the updated PublicWorkoutsPlansArray
        setPublicWorkoutsPlansTable(updatedPublicWorkoutsPlans);
      })
      .catch((error) => {
        // Handle the error by showing an alert
        Alert.alert(`${t('Failed_to_delete_workout')}`);
      });
  };
  

  ////console.log('new Date().getTime()',1 +'.' + new Date().getTime());


//   const AddEntryPlans =({isEditPlansMode,editedPlansEntry,hideModal})=>{
    
//     const [plansAddEntry, setPlansAddEntry] = useState("");     
//     const [isCalendarVisible, setCalendarVisible] = useState(false);
//     const [selectedDates, setSelectedDates] = useState({});
    
    
//   const handleOpenCalendar = () => {
//     setCalendarVisible(true);
    
//   };

//   const handleCloseCalendar = () => {
//     setCalendarVisible(false);
//   };
//   const handleSelectDateRange = (start, end) => {
//     // Check if the selected end date is before the start date
//     if (end < start) {
//       // Swap the dates if needed
//       const temp = start;
//       start = end;
//       end = temp;
//     }
//     setSelectedDates({start,end});
//     handleCloseCalendar();
//   };
//   const addPlansEntryHandler = () => {
//     if(plansAddEntry === "" || plansAddEntry.trim() === ""  || !selectedDates.start || !selectedDates.end) { 
//       Alert.alert(`${t('All_fields_are_required')}`); 
//       return;
//     }
//       const newPublicPlansData = {
//         userId:userId,
//         speKey:userId +'.' + new Date().getTime(),
//         name:plansAddEntry,
//         startDate:selectedDates.start,
//         endDate: selectedDates.end,
//         deleted:'no',
//         isSync: 'no'
//       };

//       insertPublicWorkoutsPlans(newPublicPlansData)
//       .then((PublicPlansDataResults) => {
//         ////console.log('Public Plans DataResults added successfully', PublicPlansDataResults);
//         // Fetch and update the PublicWorkoutsPlansArray after adding a new PublicWorkoutsPlansArray
//         return fetchPublicWorkoutsPlansWithoutDeleting(userId);
//       })
//       .then((updatedPublicWorkoutsPlans) => {
//         // Update the state with the updated PublicWorkoutsPlansArray
//         hideModal();
//         setPublicWorkoutsPlansTable(updatedPublicWorkoutsPlans);
//       })
//       .catch((error) => {
//         // Handle the error by showing an alert
//         Alert.alert(` `, `${t('There_is_already_a_previous_plan_in_those_dates')}`);
//       });
      
      
    
//   };
//   useEffect(() => {
//     if (isEditPlansMode) {
//       // If in edit mode, populate the form fields with the data from the edited entry
//       setPlansAddEntry(editedPlansEntry?.plnNam);
//       const start = editedPlansEntry?.stDate;
//       const end = editedPlansEntry?.edDate;
//       setSelectedDates({start,end});
//     }
//   }, [isEditPlansMode,editedPlansEntry]);
//   ////console.log('editedPlansEntry',editedPlansEntry);

//   const editPlansEntryHandler = (PublicWorkoutsPlansArray,plansAddEntry, selectedDates) => {
//     ////console.log('PublicWorkoutsPlansArray editPlansEntryHandler',PublicWorkoutsPlansArray);
//     ////console.log('plansAddEntry editPlansEntryHandler',plansAddEntry);
//     ////console.log('selectedDates editPlansEntryHandler',selectedDates);
// //|| plansAddEntry.trim() === ""

//       if(plansAddEntry === "" || plansAddEntry.trim() === ""  || !selectedDates.start || !selectedDates.end) { 
//         Alert.alert(`${t('All_fields_are_required')}`); 
//         return;
//       }
//         updatePublicWorkoutsPlans(PublicWorkoutsPlansArray,plansAddEntry, selectedDates)
//           .then((result) => {
//             ////console.log('PublicWorkoutsPlans updated  successfully', result);
//             hideModal();
//             setEditedPlansEntry(null);
//             // Fetch and update the PublicWorkoutsPlansArray equipments after soft deleting a PublicWorkoutsPlansArray
//             return fetchPublicWorkoutsPlansWithoutDeleting(userId);
//           })
//           .then((updatedPublicWorkoutsPlans) => {
//             // Update the state with the updated PublicWorkoutsPlansArray equipments
//             setPublicWorkoutsPlansTable(updatedPublicWorkoutsPlans);
//           })
//           .catch((error) => {
//             Alert.alert(error);
//             // Handle the error (e.g., show an alert)
//           });
   
  
//     // Clear the edited entry state
    
//     // Close the modal
    
//   };
  
// ////console.log('publicWorkoutsPlansTable',publicWorkoutsPlansTable);

//     return (
//       <PageContainer>
//       <ScrollView >
//           <TitleView >
//             <Title >Life</Title>
//           </TitleView>
//           <ServicesPagesCardCover>
//             <ServicesPagesCardAvatarIcon icon="target-account">
//             </ServicesPagesCardAvatarIcon>
//             <ServicesPagesCardHeader>{isEditPlansMode ? 'Edit plans' : 'Add plans'}</ServicesPagesCardHeader>
//           </ServicesPagesCardCover>
//         <Spacer size="medium">
//           <InputField>
//           <FormLabelView>
//             <FormLabel>{t("Plan_Name")}:</FormLabel>
//           </FormLabelView>
//           <FormInputView>
//             <FormInput
//               placeholder={t("Plan_Name")}
//               value={plansAddEntry}
//               keyboardType="default"
//               theme={{colors: {primary: '#3f7eb3'}}}
//               onChangeText={(u) => setPlansAddEntry(u)}
//             />
//           </FormInputView>
//           </InputField>
//         </Spacer>
//           <Spacer size="medium">
//             <InputField>
//                 <FormLabelView>
//                   <FormLabel>{t("Select_Dates")}:</FormLabel>
//                 </FormLabelView>
//                 <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
//           onPress={handleOpenCalendar}>
//                   <CalendarFullSizePressableButtonText >{t("Select_Dates")}</CalendarFullSizePressableButtonText>
//                 </CalendarFullSizePressableButton>
//               <WorkoutPlansCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onSelectDateRange={handleSelectDateRange} />
//             </InputField>
//           </Spacer>
//           <Spacer size="medium">
//             <InputField >
//             <FormLabelView>
//                 <FormLabel>{t("Start_Date")}:</FormLabel>
//             </FormLabelView>
//                 <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.start ? selectedDates.start : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
//             </InputField>
//         </Spacer>
//         <Spacer size="medium">
//             <InputField >
//             <FormLabelView>
//                 <FormLabel>{t("End_Date")}:</FormLabel>
//             </FormLabelView>
//                 <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.end ? selectedDates.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
//             </InputField>
//         </Spacer>
//       <Spacer size="medium">
//         <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
//             <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
//                   if (isEditPlansMode) {
//                   // If in edit mode, call the edit handler
//                   editPlansEntryHandler(editedPlansEntry,plansAddEntry, selectedDates);
//                   } else {
//                     // If in add mode, call the add handler
//                     addPlansEntryHandler();
//                   }
//                   }}>
//               <CalendarFullSizePressableButtonText>
//                 {isEditPlansMode ? `${t('Edit_plans')}` : `${t('Add_New_plans')}`}
//               </CalendarFullSizePressableButtonText>
//             </CalendarFullSizePressableButton>
//         </FormElemeentSizeButtonParentView>
//       </Spacer>
//       <Spacer size="medium">
//         <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
//           <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}>
//             <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
//           </CalendarFullSizePressableButton>
//         </FormElemeentSizeButtonParentView>
//       </Spacer>
//       <Spacer size="large"></Spacer>
//       </ScrollView>
      
//       </PageContainer>
//     );
//   };
  const renderNewpublicWorkoutsPlansViews = () => {
    return publicWorkoutsPlansTable.map((publicWorkoutsArray, index) => {
      const publicWorkoutsId = publicWorkoutsArray?.id; // Assuming the id is at the first index of each PublicWorkoutsPlansArray array
      const publicWorkoutsName = publicWorkoutsArray?.plnNam;
        ////console.log('publicWorkoutsArray',publicWorkoutsArray);
        // ////console.log();
        // ////console.log();
        // ////console.log();
        const isCurrentDateInRange = () => {
 
        let startDateConst=  publicWorkoutsArray.stDate;
        let endDateConst=  publicWorkoutsArray.edDate;

            if (startDateConst && endDateConst) {
              const currentDate = new Date();
              const start = new Date(startDateConst);
              const end = new Date(endDateConst);
              //console.log('currentDate test',currentDate);
              //console.log('start test',start);
              //console.log('end test',end);

              return currentDate >= start && currentDate <= end;
            }
            return false;
        };
        //console.log("isCurrentDateInRange()",isCurrentDateInRange());
      return (
           
            <View key={publicWorkoutsArray.id} style={styles.viewContainer}>
                  <View style={styles.plansContainer}>
                    <View style={{width:130,}}>
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:5,width:130,height: 'auto',minHeight: 49,}} onPress={()=>navigation.navigate('PlanNumber',{publicWorkoutsPlanRow:publicWorkoutsArray,TrainerTraineeSent:traineeDataConst})}>
                        <CalendarFullSizePressableButtonText style={{justifyContent:'center',textAlign:'center'}}>{publicWorkoutsArray.plnNam || ''}</CalendarFullSizePressableButtonText>
                      </CalendarFullSizePressableButton>
                    </View>
                    <Text style={[styles.plansTextValues,styles.plansStartDateText, isCurrentDateInRange() && styles.activeDateText,]}>{publicWorkoutsArray.stDate || `${t('Unlimited')}`}</Text>
                    <Text style={[styles.plansTextValues,styles.plansEndDateText, isCurrentDateInRange() && styles.activeDateText,]}>{publicWorkoutsArray.edDate || `${t('Unlimited')}`}</Text>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,marginRight:10,}}>
                    <Pressable
                      onPress={() => navigation.navigate('AddEntryPlans',{isEditPlansMode:true,editedPlansEntry:publicWorkoutsArray})}
                      style={{  borderRadius: 10, width: 20, height: 20 }}>
                      <AntDesign name="edit" size={20} color="black" />
                    </Pressable>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,}}>
                    <Pressable onPress={() => softDeletePublicWorkout(publicWorkoutsArray)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="white" />
                    </Pressable>
                  </View>
              </View>
            
      );
    });
  };



  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));
  const [number, setNumber] = useState(2.5); // Replace with your dynamic number
// Generate the list dynamically based on the input number
const generateOptions = (num) => {
  let options = [];
  for (let i = 0; i <= 31; i++) {

    if (i ==0 ){
      options.push('custom weight');  // Option titles will start from 0

    }
    if (i >0 && i<=31 ){
        // options.push({ title: `${(i-1) * num}` });// Option titles will start from 0
        options.push(`${(i-1) * num}`);
      }
  }
  return options;
};
const options = generateOptions(number);
//console.log('options',options);

  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/workout_plans.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            /></ServicesPagesCardCover>
            {/* <Select
                selectedIndex={selectedIndex}
                onSelect={(index) => setSelectedIndex(index)}
                value={options[selectedIndex.row]?.title}
              >
                {options.map((option, index) => (
                  <SelectItem key={index} title={option.title} />
                ))}
              </Select> */}
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
            <Spacer size="large">
              <ServiceInfoParentView >
                {showInfo ? (
                  <ServiceCloseInfoButtonView>
                    <ServiceCloseInfoButton onPress={toggleInfo}>
                      <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                    </ServiceCloseInfoButton>
                    <ServiceCloseInfoButtonTextView style={{backgroundColor:"#000",}}>
                      <ServiceCloseInfoButtonText>{t("Plans_page_desc")}</ServiceCloseInfoButtonText>
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
            <View style={styles.container}>
            <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Plans')}</FormLabel>
            </FormLabelView> 

            {renderNewpublicWorkoutsPlansViews()}
             
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}

                    onPress={() => navigation.navigate('AddEntryPlans')}>

                    <CalendarFullSizePressableButtonText >{t('Add_New_plans')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              {/* <Modal visible={modalNewPlansVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                <AddEntryPlans   
                  isEditPlansMode={isEditPlansMode}
                  editedPlansEntry={editedPlansEntry}
                  hideModal={hidePlansModal}/>
                </ViewOverlay>
              </Modal> */}
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
                    onPress={() => {
                              navigation.navigate("BeginWorkout");
                            }} >
                    <CalendarFullSizePressableButtonText >{t('Begin_Workout')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('TrainerManageWorkouts',{TrainerTraineeSent:traineeDataConst})}>
                    <CalendarFullSizePressableButtonText >{t('Personal_trainer_Plan')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
            onPress={() => navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
            </View>
            
      </ScrollView>
    </PageContainer>
  );
};

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
    marginBottom:10,
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },

  plansContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginRight:15,
  },
  plansCountryText:{
    width:60,
    flexWrap: 'wrap',
    marginRight:4,
  },
  plansTextValues:{
    fontSize:14,
    color:"white",
    marginVertical: 15,
    },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"white",
    flex: 1,
  },
  headerPlansPlansPercentText:{
    marginLeft:0,
  },
  plansPlansPercentText:{
    marginLeft:0,
  },
  headerPlansStartDateText:{
    marginLeft:-40,
    color:'black',
  },
  plansStartDateText:{
    marginLeft:5,
    color:'black',
  },
  headerPlansEndDateText:{
    marginLeft:10,
    color:'black',
  },
  plansEndDateText:{
    marginLeft:5,
    marginRight:0,
    color:'black',
  },
  activeDateText:{
    color:'#3f7eb3',
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
});

  