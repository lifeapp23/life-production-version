import React, { useEffect } from "react";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Provider } from 'react-redux';
import { StatusBar } from "react-native"; // Import native StatusBar
import 'react-native-url-polyfill/auto';
import { ThemeProvider } from "styled-components/native";
import * as eva from '@eva-design/eva';
import { ApplicationProvider} from '@ui-kitten/components';
// Context API
import Auth from "./src/features/account/Context/store/Auth";
import { default as mapping } from './mapping.json'; // <-- import mapping


import {
  useFonts,
  OpenSans_300Light,
  OpenSans_400Regular
} from '@expo-google-fonts/open-sans';

import { theme } from "./src/infrastructure/theme";
import { Navigation } from "./src/infrastructure/navigation";
import store from "./src/features/account/screens/store";
import { initUsersTable, fetchUsers,clearUsersTable } from "./database/usersTable";
import { initTokensTable, fetchTokens,clearTokensTable } from "./database/tokensTable";
import { initBodyStatsAndMeasurementsTable, fetchBodyStatsAndMeasurements} from "./database/B_S_and_measurements";
import { initTargetStatsTable } from "./database/target_stats";
import { initPublicSettingsTable } from "./database/workout_settings";
import { initCalculatorsTableTable } from "./database/calcaulatorsTable";
import { initWorkoutsTable } from "./database/workoutsTable";
import { initPublicWorkoutsPlansTable } from "./database/public_workouts_plans";
import { initPublicWorkoutsPlanDaysTable } from "./database/public_workouts_plan_days";
import { initStartWorkoutTable } from "./database/start_workout_db";
import { initPredefinedMealsTable,deletePredefinedMealsTable } from "./database/predefined_meals";
import { initListOfFoodsTable,deleteListOfFoodsTable } from "./database/list_of_foods";
import { initTodayMealsTable,deleteTodayMealsTable } from "./database/today_meals";
import { initTrainerManageMyProfile } from "./database/trainer_manage_my_profile";
import { initTrainerPricingCurrency } from "./database/trainer_pricing_currency";
import { initTrainerDiscount } from "./database/trainer_pricing_discount";

import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

import { initGymEquipmentsTable } from "./database/gym_equipments_table";

import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function App() {
  const {t, i18n} = useTranslation();
///ios client id 519904726192-qa3hf2uskb4hb20pohud3p1o26poa452.apps.googleusercontent.com
/// android client id 519904726192-sd4sp5dvrqvplpo14r6olb6h5rtesfd4.apps.googleusercontent.com
  useEffect(() => {
    // const applyPendingLanguageChange = async () => {
    //   const pendingLanguage = await AsyncStorage.getItem('pendingLanguage');

    //   if (pendingLanguage) {
    //     await i18n.changeLanguage(pendingLanguage);
    //     await AsyncStorage.removeItem('pendingLanguage');
    //   }
    // };

    // applyPendingLanguageChange();
    // Call the init function when the component mounts (i.e., when the app starts)
    initUsersTable().then(() => {
      ////console.log('Database initialization complete');
    });

    fetchUsers().then((users) => {
      ////console.log('Users table :', users);
    }).catch((error) => {
      //console.error('Error fetching users:', error);
    });
    initTokensTable();
    fetchTokens().then((users) => {
      ////console.log('Tokens table :', users);
    }).catch((error) => {
      //console.error('Error fetching Tokens:', error);
    });
    initBodyStatsAndMeasurementsTable().then(() => {
      ////console.log('initBodyStatsAndMeasurementsTable complete');
    });
    initTargetStatsTable().then(() => {
      ////console.log('initTargetStatsTable complete');
    });
    initPublicSettingsTable().then(() => {
      ////console.log('initPublicSettingsTable complete');
    });
    initCalculatorsTableTable().then(() => {
      ////console.log('initCalculatorsTableTable complete');
    });
    initGymEquipmentsTable().then(() => {
      ////console.log('initGymEquipmentsTable complete');
    });
    initWorkoutsTable().then(() => {
      ////console.log('initWorkoutsTable initialization complete');
    });
    initPublicWorkoutsPlansTable().then(() => {
      ////console.log('initPublicWorkoutsPlansTable initialization complete');
    });
    initPublicWorkoutsPlanDaysTable().then(() => {
      //console.log('initPublicWorkoutsPlanDaysTable initialization complete');
    });
    initStartWorkoutTable().then(() => {
      ////console.log('initStartWorkoutTable initialization complete');
    });
    initPredefinedMealsTable().then(() => {
      ////console.log('initPredefinedMealsTable initialization complete');
    });
    initListOfFoodsTable().then(() => {
      ////console.log('initListOfFoodsTable initialization complete');
    });
    initTodayMealsTable().then(() => {
      ////console.log('initTodayMealsTable initialization complete');
    });
    initTrainerManageMyProfile().then(() => {
      ////console.log('initTrainerManageMyProfile initialization complete');
    });
    initTrainerPricingCurrency().then(() => {
      ////console.log('initTrainerPricingCurrency initialization complete');
    });
    initTrainerDiscount().then(() => {
      ////console.log('initTrainerDiscount initialization complete');
    });
  }, []);
  
  const [fontsLoaded] = useFonts({
    OpenSans_300Light,
    OpenSans_400Regular
  });

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
    <Auth>
    {/*put it when you pu files with store don't forget   */}
    <Provider store={store}>
      

      <ThemeProvider theme={theme}>
        <ActionSheetProvider>
          <ApplicationProvider {...eva} customMapping={mapping} theme={eva.light }>
            <Navigation />
          </ApplicationProvider>
        </ActionSheetProvider>
      </ThemeProvider>

      </Provider>
    </Auth>
    <StatusBar
          barStyle="dark-content" // black icons
          backgroundColor="white" // white background
          translucent={false} // non-translucent
        />
        
    {/* Expo StatusBar */}
    <ExpoStatusBar style="dark" translucent={false} backgroundColor="white" />
    </>
  );
};