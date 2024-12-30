import React, { useState, useEffect,useContext  } from "react";
import { ScrollView,TextInput, View, Pressable,Text,Modal,Alert, Dimensions} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
    Title,
    TitleView,
    PageContainer,
    FullSizeButtonView,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    ServiceInfoButtonAvatarIcon,
    ServiceCloseInfoButtonView,
    ServiceCloseInfoButton,
    ServiceCloseInfoButtonAvatarIcon,
    ServiceCloseInfoButtonTextView,
    ServiceCloseInfoButtonText,
    ServiceInfoParentView,
    ServiceInfoButtonView,
    ServiceInfoButton,
    MenuItemPressableButton,
    MenuItemPressableButtonAvatarAccount,
    MenuItemPressableButtonText,
    MenuItemPressableButtonAvatarChevronRight,
    ServiceAddButtonAvatarIcon,
    InfoField,
    PageMainImage,

  
  } from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
import { CalendarBmiCalculator } from "./calendar_bmi_calculator";
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { useFocusEffect } from '@react-navigation/native';
import { insertGymEquipments,fetchGymEquipmentsWithoutDeleting,SoftDeleteGymEquipments,updateGymEquipmentsName } from "../../../../database/gym_equipments_table";
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
const { height,width } = Dimensions.get('window');


export const GymFacilitiesScreen = ({ navigation }) => {
    const [repeatCount, setRepeatCount] = useState(0);
    const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
    const [gymNewNameInput, setGymNewNameInput] = useState('');
    const [userId,setUserId] = useState('');
    const [gymEquipmentsTable,setGymEquipmentsTable] = useState([]);
    const [isGymNewNameModalVisible, setIsGymNewNameModalVisible] = useState(false);
    const [isEditStatusActive,setIsEditStatusActive] = useState(false);
    const [ editedCurrentGym,setEditedCurrentGym]=useState({});
    const {t} = useTranslation();//add this line

    useFocusEffect(
        React.useCallback(() => {
          // Fetch the latest data or update the state here
        AsyncStorage.getItem("currentUser").then((user) => {
          const storedUser = JSON.parse(user);
          //console.log('Gym Facilities user---->>>',storedUser);
          setUserId(storedUser.id);
          
            
         
          });
        }, [AsyncStorage])
        );
        useFocusEffect(
            React.useCallback(() => {
            fetchGymEquipmentsWithoutDeleting(userId).then((gymEquipmentsTableResults) => {
                //console.log('Gym facilits Table array',gymEquipmentsTableResults);
                setGymEquipmentsTable(gymEquipmentsTableResults);
            });
        }, [AsyncStorage,fetchGymEquipmentsWithoutDeleting,userId])
        );
    // useEffect(() => {
    //     fetchGymEquipmentsWithoutDeleting(userId).then((gymEquipmentsTableResults) => {
    //         //console.log('Gym facilits Table array',gymEquipmentsTableResults);
    //         setGymEquipmentsTable(gymEquipmentsTableResults);
    //     });
    //     }, [fetchGymEquipmentsWithoutDeleting,userId]);
     //console.log("Math.random()-new Date().toISOString().split('T')[0]",`${Math.random()}-${new Date().toISOString().split('T')[0]}`);   
    const addNewGymView =() =>{
        setRepeatCount(value => value +1);
        }
    
    useEffect(() => {
        rendernewGymsViews();
    }, [rendernewGymsViews]);
    const addNewGymButton =() =>{
        const userGymEquipments={
            userId:userId,
            GymName:gymNewNameInput,
            speKey:`${Math.random()}-${new Date().toISOString().split('T')[0]}`,
            DumbBells:'false',
            KettleBells:'false',
            EBarBell:'false',
            EZBar:'false',
            TrapsBar:'false',
            ResistanceBand:'false',
            SandBag:'false',
            WeightedBelts:'false',
            AbWheel:'false',
            Sled:'false',
            ExerciesBall:'false',
            Bosuball:'false',
            JumpingRope:'false',
            BattleRope:'false',
            Rings:'false',
            RopeClimbing:'false',
            JumpBox:'false',
            Parallettes:'false',
            Tires:'false',
            AdjBench:'false',
            FlatBench:'false',
            DeclineBench:'false',
            BenchPressRack:'false',
            IncBenchPres:'false',
            DeclineBenchR:'false',
            SquatRack:'false',
            PreacherBen:'false',
            SwimmingPool:'false',
            Squash:'false',
            Tennis:'false',
            RunningTrack:'false',
            PingPong:'false',
            MaritalArts:'false',
            Elliptical:'false',
            TreadMil:'false',
            ExerciseBike:'false',
            RowingMach:'false',
            AssaultAirBike:'false',
            AssaultRunner:'false',
            StairMaster:'false',
            Butterfly:'false',
            ReverseButterfly:'false',
            LegExtension:'false',
            LegCurl:'false',
            LegPress:'false',
            ChestPress:'false',
            SmithMachine:'false',
            LatPulldowns:'false',
            CrossOverMac:'false',
            CableMachine:'false',
            BicepMachine:'false',
            TircepMachine:'false',
            CalvesMachine:'false',
            AbsMachine:'false',
            deleted:'no',
            isSync:'no',
        };
        insertGymEquipments(userGymEquipments).then((gymEquipmentsResults) => {
               //console.log('Gym facilits added successfuly',gymEquipmentsResults);
              // Fetch and update the gym equipments after adding a new gym
            return fetchGymEquipmentsWithoutDeleting(userId);
        }).then((updatedGymEquipments) => {
            // Update the state with the updated gym equipments
            setGymEquipmentsTable(updatedGymEquipments);
          });
        setRepeatCount(repeatCount + 1);
        
      };
      //console.log('gymNewNameInput',gymNewNameInput);
    const removeNewGymView = (i)=>{
        setRepeatCount(value => value -1);
    }
    const navigateToGymPage = (gymArray) => {
        navigation.navigate('GymPage', { gymArray });
      };
      const softDeleteGym = (gymArray) => {
        const { id, userId, GymName,speKey } = gymArray;
    
        SoftDeleteGymEquipments(id, userId, GymName,speKey)
          .then((result) => {
            //console.log('Gym  deleted turned into yes successfully', result);
    
            // Fetch and update the gym equipments after soft deleting a gym
            return fetchGymEquipmentsWithoutDeleting(userId);
          })
          .then((updatedGymEquipments) => {
            // Update the state with the updated gym equipments
            setGymEquipmentsTable(updatedGymEquipments);
          })
          .catch((error) => {
            //console.log('Failed to delete gym', error);
            // Handle the error (e.g., show an alert)
          });
      };
      const updateGymEquipmentsNamesHandle = (gymArray,gymNewName) => {
        const { id, userId, speKey } = gymArray;
    
        updateGymEquipmentsName(id, userId, gymNewName,speKey)
          .then((result) => {
            //console.log('Gym name uppdates  successfully', result);
    
            // Fetch and update the gym equipments after soft deleting a gym
            return fetchGymEquipmentsWithoutDeleting(userId);
          })
          .then((updatedGymEquipments) => {
            // Update the state with the updated gym equipments
            setGymEquipmentsTable(updatedGymEquipments);
          })
          .catch((error) => {
            //console.log('Failed to update gym', error);
            // Handle the error (e.g., show an alert)
          });
      };
      const handleEditButton=(gymArray)=>{
        setIsEditStatusActive(true);
        setIsGymNewNameModalVisible(true);
        setGymNewNameInput(gymArray.GymName);
        setEditedCurrentGym(gymArray);
      };
      useEffect(() => {
        //console.log('editedCurrentGym-----',editedCurrentGym);

        }, [editedCurrentGym]);
    const rendernewGymsViews = () => {
        return gymEquipmentsTable.map((gymArray, index) => {
          const gymId = gymArray.id; // Assuming the id is at the first index of each gym array
          const gymName = gymArray.GymName;
            //console.log('gymArray',gymArray);
            // //console.log();
            // //console.log();
            // //console.log();
          return (
            <Spacer size="small" key={gymId}>
              <InfoField style={{flex:1,marginLeft: 15,  marginRight: 15,flexDirection: 'row',justifyContent: "space-between" }}>
                <FullSizeButtonView style={{ width: "80%" }}>
                  <MenuItemPressableButton
                    onPress={() => {
                      navigateToGymPage(gymArray);
                    }}
                  >
                    <MenuItemPressableButtonAvatarAccount icon="tape-measure" size={32} color="#000" />
                    <MenuItemPressableButtonText style={{position:"absolute",left:"17%"}}>{gymName}</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white" />
                  </MenuItemPressableButton>
                </FullSizeButtonView>
                <View style={{ marginLeft: 6, justifyContent: "center", alignItems: "center"}}>
                  <ServiceInfoButton onPress={() => softDeleteGym(gymArray)}>
                    <ServiceAddButtonAvatarIcon icon="minus" size={30} color="white" />
                  </ServiceInfoButton>
                  
                </View>
                <View style={{ marginLeft: 6, justifyContent: "center", alignItems: "center"}}>
                  <ServiceInfoButton onPress={() => handleEditButton(gymArray)}>
                    <ServiceAddButtonAvatarIcon icon="square-edit-outline" size={30} color="white" />
                  </ServiceInfoButton>                  
                </View>
                
              </InfoField>
            </Spacer>
          );
        });
      };
    
    
  const handleRepeatButtonPress = () => {
    setRepeatCount(repeatCount + 1);
  };
  const [showInfo, setShowInfo] = useState(false);
  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };
console.log('editedCurrentGym.GymName',editedCurrentGym.GymName);

  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
            <PageMainImage
            source={require('../../../../assets/Gym_Facilities.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover>
            <Spacer size="large">
                <ServiceInfoParentView >
                  {showInfo ? (
                    <ServiceCloseInfoButtonView>
                      <ServiceCloseInfoButton onPress={toggleInfo}>
                        <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
                      </ServiceCloseInfoButton>
                      <ServiceCloseInfoButtonTextView>
                        <ServiceCloseInfoButtonText>{t("gym_faci_desc")}</ServiceCloseInfoButtonText>
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
            <Spacer size="large">
                <ServiceInfoParentView >
                    <ServiceInfoButtonView style={{marginBottom:-20}}>
                        <ServiceInfoButton style={{marginLeft:3}} onPress={()=> {
                            setIsGymNewNameModalVisible(true);
                            setGymNewNameInput('');
                            }}>
                            <ServiceAddButtonAvatarIcon icon="plus" size={40} color="white"/>
                        </ServiceInfoButton>
                        <Modal transparent visible={isGymNewNameModalVisible} >
                            <View style={{ flexDirection: 'column', alignItems: 'center',width:250,height:250, backgroundColor:'#455357',justifyContent:'center',left:(width-250)/2,top:(height-250)/2,borderWidth: 1, borderColor: 'white', borderRadius: 50,  }}>
                              <TextInput
                                  style={{borderWidth: 1, borderColor: 'white', borderRadius: 5, padding: 5, width:100,marginRight: 10, backgroundColor: 'white' }}
                                  placeholder={t("Gym_Name")}
                                  value={gymNewNameInput}
                                  onChangeText={(text) => setGymNewNameInput(text)}
                              />
                              <View style={{ flexDirection: 'row', alignItems: 'center' ,marginTop:10,justifyContent:'center'}}>
                                <Pressable style={{marginRight:5}} onPress={()=>{
                                    if (gymNewNameInput.toString().trim() !== ''){
                                      if(isEditStatusActive === true){
                                        updateGymEquipmentsNamesHandle(editedCurrentGym,gymNewNameInput);
                                      }else{
                                        addNewGymButton();
                                      }
                                      setIsEditStatusActive(false);
                                      setIsGymNewNameModalVisible(false);
                                      setGymNewNameInput('');
                                      setEditedCurrentGym({});
                                    }else{
                                    Alert.alert(`${t("You_must_fill_the_Gym_name_field")}`);
                                    }
                                    
                                    }}>
                                    <Text style={{ color: 'white', borderWidth: 1, borderColor: 'white', borderRadius: 5, paddingTop: 9, paddingBottom: 9, paddingLeft: 20, paddingRight: 20 }}>OK</Text>
                                </Pressable>
                                <Pressable onPress={() => {
                                  setIsEditStatusActive(false);
                                  setIsGymNewNameModalVisible(false);
                                  setGymNewNameInput('');
                                  setEditedCurrentGym({});
                                  }}>
                                    <Text style={{ color: 'white', borderWidth: 1, marginLeft: 5,marginRight:10, borderColor: 'white', borderRadius: 5, padding: 9 }}>X</Text>
                                </Pressable>
                              </View>
                            </View>
                        </Modal>
                    </ServiceInfoButtonView>
                </ServiceInfoParentView>
            </Spacer>
            <View style={{marginBottom:20}}>
                {rendernewGymsViews()}
            </View>
        </ScrollView>
    </PageContainer>
  );
};
