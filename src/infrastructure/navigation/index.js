import React, { useEffect,useState,useLayoutEffect,useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DateProvider } from '../../features/account/screens/DateContext'; // Import the DateProvider
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  StyleSheet,
  NativeModules, Platform,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchPublicSettings} from "../../../database/workout_settings";
import AuthGlobal from "../../../src/features/account/Context/store/AuthGlobal";
import { setCurrentUser } from "../../../src/features/account/Context/actions/Auth.actions";
import {handleWorkoutsDataImport} from "../../../main_data/main_workouts_functions"; 
import {handleMealsDataImport} from "../../../main_data/main_meals_functions"; 
import { WorkoutSettingsScreen } from "../../features/account/screens/workout_settings.screen";
import { MixDataHandlingAndWorkoutSettingsScreen } from "../../features/account/screens/mix_data_handling_and_workout_settings.screen";


import { Spinner } from '@ui-kitten/components';

import "../../features/account/screens/i18n";
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { AccountNavigator, MainTabNavigator } from "./account.navigator";
const SplashScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale.replace('-', '_').split('_')[0] ||
        NativeModules.SettingsManager.settings.AppleLanguages[0].replace('-', '_').split('_')[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier.replace('-', '_').split('_')[0];

  //console.log(deviceLanguage); //en_US
  
    
  const fetchSanctumToken = async () => {
    const userSanctumToken = await AsyncStorage.getItem("sanctum_token");
    return userSanctumToken || false;
  };
  const context = useContext(AuthGlobal);
  //console.log('WorkoutSettings splashres****',context);

  useEffect(() => {

    AsyncStorage.getItem("sanctum_token")
            .then((res) => {
              if(res === null){
                ////console.log('token splashnull****',res);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'AccountNavigator' }],
                });
                //console.log('AccountNavigator res === null****');

              } else{
                AsyncStorage.getItem("currentUser").then((user) => {
                  const storedUser = JSON.parse(user);
                  //console.log('splashhhh user',storedUser);
                  fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
                    console.log('before if MainTabNavigator splashres PSettingsResults****',PSettingsResults);

                    if (PSettingsResults.length > 0){
                      console.log('MainTabNavigator splashres PSettingsResults[0]****',PSettingsResults[0]);
                      context.dispatch(setCurrentUser(res, storedUser,PSettingsResults[0]));
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabNavigator' }],
                      });
                    }else{
                      //console.log('PSettingsResults.length < 0 splashres****');
                      context.dispatch(setCurrentUser(res, storedUser,{}));
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'MixDataHandlingAndWorkoutSettings' }],
                      });
                    }
                  })
                })
                
              }
              // Call this function when the app starts to add workouts data into database
                handleWorkoutsDataImport();
              // Call this function when the app starts to add Meals data into database
                handleMealsDataImport();
            })
            
          //   if(deviceLanguage == 'ar'){
          //     //console.log('ara')
          //     i18n
          //     .changeLanguage('ar')
          //     .then(() => {
          //       I18nManager.allowRTL(true);
          //       I18nManager.forceRTL(true);
          //       RNRestart.Restart();
          //     })
          //     .catch(err => {
          //       ////console.log('something went wrong while applying RTL');
          //     });
          // }
          // else if(deviceLanguage == 'en'){
          //   //console.log('eng')
          //   i18n
          //     .changeLanguage('en')
          //     .then(() => {
          //       I18nManager.allowRTL(false);
          //       I18nManager.forceRTL(false);
          //       RNRestart.Restart();
          //     })
          //     .catch(err => {
          //       ////console.log('something went wrong while applying RTL');
          //     });
      
          // }
    // const checkToken = async () => {
    //   const token = await fetchSanctumToken();
    //   ////console.log('token splash****',token);
    //   if (token) {
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: 'OurServices' }],
    //     });
    //   } else {
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: 'Account' }],
    //     });
    //   }
    // };

    // checkToken();

}, [AsyncStorage,context]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#fff', }}>
      <Text style={{color:'#000',fontSize:35,marginBottom:10,}}>Life...</Text>
      {/* <ActivityIndicator size="large" /> */}
      <Spinner size='large' />
    </View>
  );
};

export const Navigation = () => {
  const RootStack = createNativeStackNavigator();
  const { t, i18n } = useTranslation();

return (
  <DateProvider>
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <RootStack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: false ,title: 'Welcome'}} name="SplashScreen" component={SplashScreen} />
        {/* <RootStack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutSettings" component={WorkoutSettingsScreen}  options={{headerShown: true ,title: `${t('Workout_Settings')}`, unmountOnBlur: false,}}/> */}
        <RootStack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('App_settings')}`,}} name="MixDataHandlingAndWorkoutSettings" component={MixDataHandlingAndWorkoutSettingsScreen} />

        <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
        <RootStack.Screen name="AccountNavigator" component={AccountNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  </DateProvider>

  );
};
