import React, { useState } from "react";
import * as FileSystem from 'expo-file-system';

import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  MenuItemPressableImagedButton,
  MenuItemPressableButton,
  MenuItemPressableButtonText,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
  SeparatorView,
  ServicesPagesCardCover, ServicesPagesCardAvatarIcon,
   ServicesPagesCardHeader
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDate } from './DateContext'; // Import useDate from the context
import "./i18n";
import { useTranslation } from 'react-i18next';//add this line


import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import {handleWorkoutsDataImport} from "../../../../main_data/main_workouts_functions"; 
const { width } = Dimensions.get('window');

const AccountIcon = (props) => (
  <AvatarIcon icon="account" color="white" size={36}/>
);

const ForwardIcon = (props) => (
  <AvatarIcon icon="arrow-forward-outline" color="#cfd8dc"/>
);

export const WorkoutPlanScreen = ({ navigation }) => {
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [selectedIndex, setSelectedIndex] = useState(null);
  const {t} = useTranslation();//add this line
  const [triainerConnected,setTriainerConnected] =  useState(false);


  const [userId, setUserId] = useState("");  
  const [traineeData, setTraineeData] = useState({});  
  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      //console.log('tokeeen:',res);
    AsyncStorage.getItem("currentUser").then((user) => {
  
        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
  
        
      //   const unsubscribe = addEventListener(state => {
      //     //console.log("Connection type--", state.type);
      //     //console.log("Is connected?---", state.isConnected);
      //     setTriainerConnected(state.isConnected);
      //   if(state.isConnected){
      //     //console.log('---------------now online--------')
      //     axios.get('https://life-pf.com/api/get-trainee-side-data', {
      //       headers: {
      //         'Authorization': `Bearer ${res}`,
      //         'Content-Type': 'application/json',
      //       },
      //       })
      //       .then(response => {
      //         // Handle successful response
      //         //console.log('trainee::',response.data?.['TraineesData']?.[0]);
  
             
      //         setTraineeData(response.data?.['TraineesData']?.[0]);
      //       })
      //       .catch(error => {
      //         // Handle error
      //         //console.log('Error fetching Trainee:', error);
      //       });
      //   }else{
      //     //console.log('else no internet ahmed');
      //     Alert.alert(`${t(' ')}`,
      //     `${t('Please_Connect_to_the_internet_To_see_the_Plan')}`,
      //     [
      //       {
      //         text: 'OK',
      //         onPress: () => {
               
      //         },
      //       },
      //     ],
      //     { cancelable: false }
      //   );
  
      //   }
      // });
        
      //   // Unsubscribe
      //   unsubscribe();
      })
    });
   
  
  }, [])
  );
  

  return (
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>
                {/* <ServicesPagesCardCover>
                  <ServicesPagesCardAvatarIcon icon="tape-measure">
                  </ServicesPagesCardAvatarIcon>
                  <ServicesPagesCardHeader>{t("Workout")}</ServicesPagesCardHeader>
                </ServicesPagesCardCover> */}
                {/* <SeparatorView/>

                <MenuItemPressableImagedButton
                    onPress={() => {
                      navigation.navigate("GymFacilities");
                      updateSelectedDate('');
                    }}
                    >   

                    <Image
                      source={require('../../../../assets/Gym_Facilities.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Gym_Facilities")}</Text>
                    </View>
                </MenuItemPressableImagedButton> */}

                {/* <FullSizeButtonView>
                    <MenuItemPressableImagedButton
                    onPress={handleDDownloadWorkoutsPress}
                    >
                        <MenuItemPressableImagedButtonAvatarAccount icon="calculator" size={32} color="#cfd8dc"/>
                        <MenuItemPressableImagedButtonText >{t("Download_our_workouts")}</MenuItemPressableButtonText>
                        <MenuItemPressableImagedButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                    </MenuItemPressableImagedButton>
 */}
                
                <SeparatorView/>

                    <MenuItemPressableImagedButton
                    onPress={() => 
                    {
                      navigation.navigate("Exercises");
                      updateSelectedDate('');
                    }}
                    >
                       <Image
                      source={require('../../../../assets/Exercises_page.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Exercises")}</Text>
                    </View>
                    </MenuItemPressableImagedButton>

                <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("WorkoutPlans");
                      updateSelectedDate('');
                    }}
                    >
                    <Image
                      source={require('../../../../assets/workout_plans.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Workout_Plans")}</Text>
                    </View>
                </MenuItemPressableImagedButton>

                {/* <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("MixDataHandlingAndWorkoutSettings");
                      updateSelectedDate('');
                    }}
                    >
                    <Image
                      source={require('../../../../assets/Workout_Settings_two.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Workout_Settings")}</Text>
                    </View>
                </MenuItemPressableImagedButton> */}

                {/* <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("BeginWorkout");
                      updateSelectedDate('');
                    }}
                    >
                    <Image
                      source={require('../../../../assets/Begin_Workout.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Begin_Workout")}</Text>
                    </View>
                </MenuItemPressableImagedButton> */}

                <SeparatorView/>
                {/* <FullSizeButtonView>
                <MenuItemPressableImagedButton
                    onPress={() => {
                      navigation.navigate("Charts");
                      updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableImagedButtonAvatarAccount icon="food-apple" size={32} color="#cfd8dc"/>
                    <MenuItemPressableImagedButtonText >Charts</MenuItemPressableButtonText>
                    <MenuItemPressableImagedButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableImagedButton>
 */}
                <Spacer size="large"></Spacer>
                <Spacer size="large"></Spacer>
            </AccountBackground>
        </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  RowTwoItemscontainer: {
    width:"100%",
    flexDirection: 'row',

    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  RowTwoItemscontainerTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,

  },
  viewContainer: {
    width: width / 2 - 15, // Half the screen width minus padding
    height: 150, // Adjust as needed
    marginBottom: 10,
    position: 'relative',
  },
 
  image: {
    width: '100%',
    height: '100%',

  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: '5%', // Adjust as needed for spacing from the left edge

  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    // width: '30%', // Ensures text stays within the left 30% of the image
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Dark shadow
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 10, // Shadow blur
  },



  });