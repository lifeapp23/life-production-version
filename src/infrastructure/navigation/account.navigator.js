import React, { useEffect,useState,useLayoutEffect,useContext } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  StyleSheet,
  NativeModules, Platform,
} from 'react-native';
import "../../features/account/screens/i18n";
import { useTranslation } from 'react-i18next';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { AdsPageScreen } from "../../features/account/screens/ads_page.screen";
import { TermsAndConditionsPageScreen } from "../../features/account/screens/terms_and_conditions_page.screen";
import { PrivacyAndPolicyPageScreen } from "../../features/account/screens/privacy_and_policy.screen";


import { AccountScreen } from "../../features/account/screens/account.screen";
import { LoginScreen } from "../../features/account/screens/login.screen";
import { RegisterScreen } from "../../features/account/screens/register.screen";
import { AdminPayToTrainerPageScreen } from "../../features/account/screens/adminPayToTrainerPage.screen";
import { TrainerAccountWalletPageScreen } from "../../features/account/screens/trainerAccountWallet.screen";
import { DataHandlingPageScreen } from "../../features/account/screens/DataHandlingPageScreen.screen";

import { MixDataHandlingAndWorkoutSettingsScreen } from "../../features/account/screens/mix_data_handling_and_workout_settings.screen";


import { PayToTrainerFromOurAppScreen } from "../../features/account/screens/payToTrainerFromOurApp.screen";
import { NewsPageScreen } from "../../features/account/screens/news_page.screen";
import { OurCommunityScreen } from "../../features/account/screens/our_community.screen";
import { RequestPasswordResetScreen } from "../../features/account/screens/RequestPasswordReset.screen";
import { ResetPasswordScreen } from "../../features/account/screens/ResetPassword.screen";

import { SimilarExercisesScreen } from "../../features/account/screens/similar_workouts.screen";


import { AccountSignOutScreen } from "../../features/account/screens/account_signout.screen";

import { OurServices } from "../../features/account/screens/our_services.screen";

import { AnalysisScreen } from "../../features/account/screens/analysis.screen";

import { AdminSettingsAppScreen } from "../../features/account/screens/admin_settings_app.screen";
import { TrainersSpecificCommissionsScreen } from "../../features/account/screens/Trainers_specific_Commissions.screen";


import { MixBodyAndTargetStatsScreen } from "../../features/account/screens/mix_body_and_target_stats.screen";

import { BodyStatsAndMeasurementsScreen } from "../../features/account/screens/body_stats_and_measurements.screen";
import { CalculatorScreen } from "../../features/account/screens/calculator.screen";
import { CurrentPersonalTrainerScreen } from "../../features/account/screens/current_personal_trainer.screen";
import { RatingCurrentPersonalTrainerScreen } from "../../features/account/screens/rating_current_personal_trainer.screen";

import { WorkoutPlanScreen } from "../../features/account/screens/workout_plan.screen";
import { TargetStatsScreen } from "../../features/account/screens/target_stats.screen";
import { CameraScreen } from "../../features/account/screens/camera.screen";
import { PlansScreen } from "../../features/account/screens/plans.screen";
import { PlansCalendarScreen } from "../../features/account/screens/CustomCalendar.screen";
import { MealPlanScreen } from "../../features/account/screens/meal_plan.screen";

import { PersonalTrainerSearchScreen } from "../../features/account/screens/personal_trainer_search.screen";
import { MacroCalculatorScreen } from "../../features/account/screens/macro_calculator.screen";
import { BMRScreen } from "../../features/account/screens/bmr.screen";
import { TDEEScreen } from "../../features/account/screens/tdee.screen";
import { BMIScreen } from "../../features/account/screens/bmi_calculator.screen";
import { BodyFatAndLbmScreen } from "../../features/account/screens/body_fat_lbm.screen";
import { GymFacilitiesScreen } from "../../features/account/screens/gym_facilities.screen";
import { ExercisesScreen } from "../../features/account/screens/exercises.screen";
import { WorkoutPlansScreen } from "../../features/account/screens/workout_plans.screen";
import { AddEntryPlansScreen } from "../../features/account/screens/add_new_plan_normal.screen";

import { TrainerAddEntryPlansScreen } from "../../features/account/screens/trainer_add_new_plan_normal.screen";
import { TrainerAddEntryPlansMealsScreen } from "../../features/account/screens/trainer_add_new_plan_meal.screen";
import { TrainerPredefinedAddEntryPlansMealsScreen } from "../../features/account/screens/trainer_predefined_add_new_plan_meal.screen";

import { TrainerAddEntryPredefinedWorkoutPlanScreen } from "../../features/account/screens/trainer_add_new_predefined_workout_plan.screen";
import { TrainerOnboardingCurrentTraineesScreen } from "../../features/account/screens/trainer_onboarding_current_trainees.screen";


import { WorkoutSettingsScreen } from "../../features/account/screens/workout_settings.screen";
import { ChartsScreen } from "../../features/account/screens/charts.screen";
import { CustomPageScreen } from "../../features/account/screens/custom_page.screen";
import { WorkoutNameScreen } from "../../features/account/screens/workout_name.screen";
import { PlanNumberScreen } from "../../features/account/screens/plan_number.screen";
import { SelectDayExercisesScreen } from "../../features/account/screens/select_day_exercises.screen";
import { SelectedExercisesScreen } from "../../features/account/screens/selected_exercises.screen";
import { BeginWorkoutScreen } from "../../features/account/screens/begin_workout.screen";
import { DaysExercisesToStartScreen } from "../../features/account/screens/days_exercises_to_start.screen";
import { PredefinedMealsScreen } from "../../features/account/screens/predefined_meals.screen";
import { ListOfFoodsScreen } from "../../features/account/screens/list_of_foods.screen";
import { AllMealsPageScreen } from "../../features/account/screens/all_meals.screen";
import { AddNewMealToTodayMealsScreen } from "../../features/account/screens/add_meal_to_today_meals.screen";
import { TrainerAddNewMealToTodayMealsScreen } from "../../features/account/screens/trainer_add_meal_to_today_meals.screen";



import { CreateNewMealInListOfFoodsScreen } from "../../features/account/screens/create_new_meal_in_list_of_foods.screen";

import { TodayMealsScreen } from "../../features/account/screens/today_meals.screen";
import { PersonalTrainerTodayMealsScreen } from "../../features/account/screens/personal_trainer_today_meal.screen";
import { NewPersonalTrainerScreen } from "../../features/account/screens/new_personal_trainer_page.screen";
import { MembershipsHistoryScreen } from "../../features/account/screens/memberships_history.screen";
import { SubscribePageScreen } from "../../features/account/screens/subscribe_page.screen";
import { WorkedExercisesCalendarScreen } from "../../features/account/screens/worked_exercises_calendar.screen";


import { StartExercisesWithTimerScreen } from "../../features/account/screens/start_exer_with_timer.screen";

import { TrainerServicesScreen } from "../../features/account/screens/trainer_services.screen";
import { TrainerClientsScreen } from "../../features/account/screens/trainer_clients_page.screen";
import { TrainerAnalysisScreen } from "../../features/account/screens/trainer_analysis.screen";
import { TrainerTraineesScreen } from "../../features/account/screens/trainer_trainees.screen";
import { TraineePageScreen } from "../../features/account/screens/trainer_trainee_page.screen";
import { TrainerPricingScreen } from "../../features/account/screens/trainer_pricing.screen";

import { TrainerAddEditPricingScreen } from "../../features/account/screens/trainer_add_edit_pricing.screen";


import { ManageMyProfileScreen } from "../../features/account/screens/trainer_manage_my_profile.screen";
import { TrainerProfileCapacityScreen } from "../../features/account/screens/trainer_profile_capacity.screen";
import { TrainerProfileRefundPolicyScreen } from "../../features/account/screens/trainer_profile_refund_policy.screen";


import { TrainerManageWorkoutsScreen } from "../../features/account/screens/trainer_manage_workouts.screen";
import { TrainerPlanNumberScreen } from "../../features/account/screens/trainer_plan_number.screen";

import { TrainerPredefinedWorkoutPlansScreen } from "../../features/account/screens/trainer_predefined_workout_plans.screen";
import { TrainerPredefinedWorkoutPlanNumberScreen } from "../../features/account/screens/trainer_predefined_workout_plan_number.screen";
import { TrainerPredefinedWorkoutSelectDayExercisesScreen } from "../../features/account/screens/trainer_predefined_workout_select_day_exercises.screen";


import { TrainerPredefinedManageMealsPlansScreen } from "../../features/account/screens/trainer_predefined_manage_meals.screen";
import { TrainerPredefinedMealPlanNumberScreen } from "../../features/account/screens/trainer_predefined_meal_plan_number.screen";
import { TrainerPredefinedMealsPlanDaysScreen } from "../../features/account/screens/trainer_predefined_meals_plan_days_new_style.screen";
import { TrainerPredefinedAddMealToPlanDaysMealsNewStyleScreen } from "../../features/account/screens/trainer_predefined_add_meal_to_plan_days_meals_new_style.screen";
// import { TrainerPredefinedMealsSelectMealsScreen } from "../../features/account/screens/trainer_predefined_meals_select_meals.screen";


import { TrainerTraineeSelectDayExercisesScreen } from "../../features/account/screens/trainer_trainee_select_day_exercises.screen";
import { TrainerTraineeBeginWorkoutScreen } from "../../features/account/screens/trainer_trainee_begin_workout.screen";
import { TrainerTraineeStartExercisesWithTimerScreen } from "../../features/account/screens/trainer_trainee_start_exer_with_timer.screen";
import { TrainerTraineeDaysExercisesToStartScreen } from "../../features/account/screens/trainer_trainee_days_exercises_to_start.screen";
import { TrainerTraineeWorkedExercisesCalendarScreen } from "../../features/account/screens/trainer_trainee_worked_exercises_calendar.screen";

import { TrainerQuestionnaireScreen } from "../../features/account/screens/Trainer_Questionnaire.screen";
import { QuestionnaireBeforeSubscribeScreen } from "../../features/account/screens/Questionnaire_before_subscribe.screen";
import { TrainerPricingInfoInSubscribeScreen } from "../../features/account/screens/trainer_pricing_info_in_subscribe.screen";
import { TrainerQuestionnaireInTraineesPageScreen } from "../../features/account/screens/Trainee_Questionnaire_in_trainees_page.screen";



import { TrainerPredefinedMealsScreen } from "../../features/account/screens/trainer_predefined_meals.screen";
import { TrainerManageMealsScreen } from "../../features/account/screens/trainer_manage_meals.screen";
import { TrainerTraineeRequiredMacrosPageScreen } from "../../features/account/screens/trainer_trainee_requires_macros.screen";

import { TrainerPlanMealsScreen } from "../../features/account/screens/trainer_plan_meal.screen";
// import { TrainerTraineePlanDaysScreen } from "../../features/account/screens/trainer_trainee_plan_days.screen";
import { TrainerTraineePlanDaysScreen } from "../../features/account/screens/trainer_trainee_plan_days_new_style.screen";

import { TrainerTraineeTodayMealsScreen } from "../../features/account/screens/trainer_trainee_today_meals.screen";

import { TrainerTodayMealsNewStyleScreen } from "../../features/account/screens/trainer_today_meals_new_style.screen";

import { TrainerAddNewMealToPlanDaysMealsScreen } from "../../features/account/screens/trainer_add_meal_to_plan_days_meals.screen";



import { TrainerSelectedExercisesScreen } from "../../features/account/screens/trainer_selected_exercises.screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { fetchPublicSettings} from "../../../database/workout_settings";
import AuthGlobal from "../../../src/features/account/Context/store/AuthGlobal";
import { setCurrentUser } from "../../../src/features/account/Context/actions/Auth.actions";

import {AddNewEntryWorkoutScreen} from "../../features/account/screens/create_new_workout.screen"; 


//  const SplashScreen = ({ navigation }) => {
//   const { t, i18n } = useTranslation();
//   const deviceLanguage =
//     Platform.OS === 'ios'
//       ? NativeModules.SettingsManager.settings.AppleLocale.replace('-', '_').split('_')[0] ||
//         NativeModules.SettingsManager.settings.AppleLanguages[0].replace('-', '_').split('_')[0] // iOS 13
//       : NativeModules.I18nManager.localeIdentifier.replace('-', '_').split('_')[0];

//   //console.log(deviceLanguage); //en_US
  
    
//   const fetchSanctumToken = async () => {
//     const userSanctumToken = await AsyncStorage.getItem("sanctum_token");
//     return userSanctumToken || false;
//   };
//   const context = useContext(AuthGlobal);
//   useFocusEffect(
//     React.useCallback(() => {
//     AsyncStorage.getItem("sanctum_token")
//             .then((res) => {
//               if(res === null){
//                 ////console.log('token splashnull****',res);
//                 navigation.reset({
//                   index: 0,
//                   routes: [{ name: 'Login' }],
//                 });
//               } else{
//                 AsyncStorage.getItem("currentUser").then((user) => {
//                   const storedUser = JSON.parse(user);
//                   ////console.log('splashhhh user',storedUser);
//                   fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
//                     if (PSettingsResults.length > 0){
//                       ////console.log('OurServices splashres****');
//                       context.dispatch(setCurrentUser(res, storedUser,PSettingsResults[0]));
//                       navigation.reset({
//                         index: 0,
//                         routes: [{ name: 'OurServices' }],
//                       });
//                     }else{
//                       ////console.log('WorkoutSettings splashres****');
//                       context.dispatch(setCurrentUser(res, storedUser,{}));
//                       navigation.reset({
//                         index: 0,
//                         routes: [{ name: 'WorkoutSettings' }],
//                       });
//                     }
//                   })
//                 })
                
//               }
//               // Call this function when the app starts to add workouts data into database
//                 handleWorkoutsDataImport();
//               // Call this function when the app starts to add Meals data into database
//                 handleMealsDataImport();
//             })
            
//           //   if(deviceLanguage == 'ar'){
//           //     //console.log('ara')
//           //     i18n
//           //     .changeLanguage('ar')
//           //     .then(() => {
//           //       I18nManager.allowRTL(true);
//           //       I18nManager.forceRTL(true);
//           //       RNRestart.Restart();
//           //     })
//           //     .catch(err => {
//           //       ////console.log('something went wrong while applying RTL');
//           //     });
//           // }
//           // else if(deviceLanguage == 'en'){
//           //   //console.log('eng')
//           //   i18n
//           //     .changeLanguage('en')
//           //     .then(() => {
//           //       I18nManager.allowRTL(false);
//           //       I18nManager.forceRTL(false);
//           //       RNRestart.Restart();
//           //     })
//           //     .catch(err => {
//           //       ////console.log('something went wrong while applying RTL');
//           //     });
      
//           // }
//     // const checkToken = async () => {
//     //   const token = await fetchSanctumToken();
//     //   ////console.log('token splash****',token);
//     //   if (token) {
//     //     navigation.reset({
//     //       index: 0,
//     //       routes: [{ name: 'OurServices' }],
//     //     });
//     //   } else {
//     //     navigation.reset({
//     //       index: 0,
//     //       routes: [{ name: 'Account' }],
//     //     });
//     //   }
//     // };

//     // checkToken();
//     }, [AsyncStorage])
//   );
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#455357', }}>
//       <Text style={{color:'#3f7eb3',fontSize:35,marginBottom:10,}}>Health...</Text>
//       {/* <ActivityIndicator size="large" /> */}
//     </View>
//   );
// };

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MealPlanScreenStack = () => {
  const { t, i18n } = useTranslation();

    return (
  <Stack.Navigator initialRouteName='MealPlan'>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Meal_Plan')}`,unmountOnBlur: false }} name="MealPlan" component={MealPlanScreen}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PredefinedMeals" component={PredefinedMealsScreen} options={{headerShown: true ,title: `${t('Predefined_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TodayMeals" component={TodayMealsScreen} options={{headerShown: true ,title: `${t('Today_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="ListOfFoods" component={ListOfFoodsScreen} options={{headerShown: true ,title: `${t('List_of_Foods')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AllMealsPage" component={AllMealsPageScreen} options={{headerShown: true ,title: `${t('All_meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AddNewMealToTodayMeals" component={AddNewMealToTodayMealsScreen} options={{headerShown: true ,title: `${t('Add_New_Meal')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddNewMealToTodayMeals" component={TrainerAddNewMealToTodayMealsScreen} options={{headerShown: true ,title: `${t('Add_New_Meal')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PersonalTrainerTodayMeals" component={PersonalTrainerTodayMealsScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMeals" component={TrainerPredefinedMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Predefined_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerManageMeals" component={TrainerManageMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeRequiredMacrosPage" component={TrainerTraineeRequiredMacrosPageScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Meals')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPlanMeals" component={TrainerPlanMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Plan_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineePlanDays" component={TrainerTraineePlanDaysScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Plan_Days')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddNewMealToPlanDaysMeals" component={TrainerAddNewMealToPlanDaysMealsScreen} options={{headerShown: true ,title: `${t('Add_Meal')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeTodayMeals" component={TrainerTraineeTodayMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Today_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTodayMealsNewStyle" component={TrainerTodayMealsNewStyleScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Today_Meals')}`, unmountOnBlur: false,}}/>

      
      
      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="CreateNewMealInListOfFoods" component={CreateNewMealInListOfFoodsScreen} options={{headerShown: true ,title: `${t('Create_New_Meal')}`, unmountOnBlur: false,}}/>

      
  </Stack.Navigator>
    )};


const CalculatorStack = () => {
  const { t, i18n } = useTranslation();

    return (
  <Stack.Navigator>
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Calculators')}`,}} name="Calculator" component={CalculatorScreen} />
       
  </Stack.Navigator>
)};

const NewsPageScreenStack = () =>  {
  const { t, i18n } = useTranslation();

    return (
  <Stack.Navigator>
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('News')}`,}} name="NewsPageScreen" component={NewsPageScreen} />
      
  </Stack.Navigator>
)};

const OurCommunityScreenStack = () =>  {
  const { t, i18n } = useTranslation();

    return (
  <Stack.Navigator>
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Community')}`,}} name="OurCommunityScreen" component={OurCommunityScreen} />
      
  </Stack.Navigator>
)};

const WorkoutPlanScreenStack = () =>  {
  const { t, i18n } = useTranslation();

    return (
  <Stack.Navigator initialRouteName='WorkoutPlan'>    
    <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Workout')}`,}} name="WorkoutPlan" component={WorkoutPlanScreen} />
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Exercises')}`, unmountOnBlur: false,}} name="Exercises" component={ExercisesScreen}/>
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('create_new_workout')}`, unmountOnBlur: false,}} name="AddNewEntryWorkout" component={AddNewEntryWorkoutScreen}/>
    
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AddEntryPlans" component={AddEntryPlansScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPlans" component={TrainerAddEntryPlansScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPlansMeals" component={TrainerAddEntryPlansMealsScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
    
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedAddEntryPlansMeals" component={TrainerPredefinedAddEntryPlansMealsScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 

    
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutPlans" component={TrainerPredefinedWorkoutPlansScreen} options={{headerShown: true ,title: `${t('Predefined_Workout_Plans')}`, unmountOnBlur: false,}}/>

    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPredefinedWorkoutPlan" component={TrainerAddEntryPredefinedWorkoutPlanScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerOnboardingCurrentTrainees" component={TrainerOnboardingCurrentTraineesScreen}  options={{headerShown: true ,title: `${t('Add_Active_Clients')}`, unmountOnBlur: false,}}/> 

    
    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false,title: 'Sign in'}} name="Login" component={LoginScreen} options={{headerShown: true ,title: `${t('Login')}`,}}/>

    <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutPlans" component={WorkoutPlansScreen}  options={{headerShown: true ,title: `${t('Workout_Plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutSettings" component={WorkoutSettingsScreen}  options={{headerShown: true ,title: `${t('Workout_Settings')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="BeginWorkout" component={BeginWorkoutScreen}  options={{headerShown: true ,title: `${t('Begin_Workout')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Charts" component={ChartsScreen}  options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="GymPage" component={CustomPageScreen}  options={{headerShown: true ,title: `${t('Gym_Page')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SelectDayExercises" component={SelectDayExercisesScreen}  options={{headerShown: true ,title: `${t('Select_Day_Exercises')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PlanNumber" component={PlanNumberScreen}  options={{headerShown: true ,title: `${t('Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutName" component={WorkoutNameScreen} options={{headerShown: true ,title: `${t('Workout_Name')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SimilarExercises" component={SimilarExercisesScreen} options={{headerShown: true ,title: `${t('Similar')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SelectedExercises" component={SelectedExercisesScreen}  options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="DaysExercisesToStart" component={DaysExercisesToStartScreen}  options={{headerShown: true ,title: `${t('Days_Exercises_To_Start')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkedExercisesCalendar" component={WorkedExercisesCalendarScreen} options={{headerShown: true ,title: `${t('Worked_Exercises_Calendar')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerManageWorkouts" component={TrainerManageWorkoutsScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Workouts')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeSelectDayExercises" component={TrainerTraineeSelectDayExercisesScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Select_Day_Exercises')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPlanNumber" component={TrainerPlanNumberScreen} options={{headerShown: true ,title: `${t('Trainer_Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutPlanNumber" component={TrainerPredefinedWorkoutPlanNumberScreen} options={{headerShown: true ,title: `${t('Predefined_Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutSelectDayExercises" component={TrainerPredefinedWorkoutSelectDayExercisesScreen} options={{headerShown: true ,title: `${t('Select_Day_Exercises')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedManageMealsPlans" component={TrainerPredefinedManageMealsPlansScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealPlanNumber" component={TrainerPredefinedMealPlanNumberScreen} options={{headerShown: true ,title: `${t('Predefined_Plan_Number')}`, unmountOnBlur: false,}}/>
      {/* <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealsSelectMeals" component={TrainerPredefinedMealsSelectMealsScreen} options={{headerShown: true ,title: `${t('Plan_Days')}`, unmountOnBlur: false,}}/> */}
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedAddMealToPlanDaysMealsNewStyle" component={TrainerPredefinedAddMealToPlanDaysMealsNewStyleScreen} options={{headerShown: true ,title: `${t('select_meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealsPlanDays" component={TrainerPredefinedMealsPlanDaysScreen} options={{headerShown: true ,title: `${t('Plan_Days')}`, unmountOnBlur: false,}}/>

      
      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeBeginWorkout" component={TrainerTraineeBeginWorkoutScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Begin_Workout')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeDaysExercisesToStart" component={TrainerTraineeDaysExercisesToStartScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Days_Exercises_To_Start')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeStartExercisesWithTimer" component={TrainerTraineeStartExercisesWithTimerScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Start_Exercises_With_Timer')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeWorkedExercisesCalendar" component={TrainerTraineeWorkedExercisesCalendarScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Worked_Exercises_Calendar')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{unmountOnBlur: false}} name="TrainerSelectedExercisesPage" component={TrainerSelectedExercisesScreen} options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="StartExercisesWithTimer" component={StartExercisesWithTimerScreen}  options={{headerShown: true ,title: `${t('StartExercisesWithTimer')}`, unmountOnBlur: false,}}/>
      
  
  
  </Stack.Navigator>
)};



export const AppAuthorizedPagesNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigation = useNavigation();
  // const initialRoute="";
  const { t, i18n } = useTranslation();

  return (

    <Stack.Navigator initialRouteName='OurServices'>
      {/* <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: false ,title: 'Welcome'}} name="SplashScreen" component={SplashScreen} /> */}
      <Stack.Screen screenOptions={{ headerShown: false ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Home')}`}} name="OurServices" component={OurServices}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SignoutPage" component={AccountSignOutScreen} options={{headerShown: true ,title: `${t('Sign_Out')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AdminPayToTrainerPage" component={AdminPayToTrainerPageScreen} options={{headerShown: true ,title: `${t('Admin_Pay_To_Trainer')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAccountWallet" component={TrainerAccountWalletPageScreen} options={{headerShown: true ,title: `${t('Trainer_Account_Wallet')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="DataHandlingPage" component={DataHandlingPageScreen} options={{headerShown: true ,title: `${t('Data_Handling')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PayToTrainerFromOurApp" component={PayToTrainerFromOurAppScreen} options={{headerShown: true ,title: `${t('PayToTrainer')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AdsPage" component={AdsPageScreen} options={{headerShown: true ,title: `${t('Ads')}`,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AdminSettingsApp" component={AdminSettingsAppScreen} options={{headerShown: true ,title: `${t('AdminSettingsApp')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainersSpecificCommissions" component={TrainersSpecificCommissionsScreen} options={{headerShown: true ,title: `${t('Trainers_specific_Commissions')}`,}}/>


      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Analysis" component={AnalysisScreen} options={{headerShown: true ,title: `${t('Analysis')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('body_and_target_measurements')}`,}} name="MixBodyAndTargetStats" component={MixBodyAndTargetStatsScreen} />

      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('App_settings')}`,}} name="MixDataHandlingAndWorkoutSettings" component={MixDataHandlingAndWorkoutSettingsScreen} />

      
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Body_Stats_and_Measurements')}`,}} name="BodyStatsAndMeasurements" component={BodyStatsAndMeasurementsScreen} />
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Calculators')}`,}} name="Calculator" component={CalculatorScreen} />
      
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('CurrentPersonalTrainer')}`,}} name="CurrentPersonalTrainer" component={CurrentPersonalTrainerScreen} />

      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Rating')}`,}} name="RatingCurrentPersonalTrainer" component={RatingCurrentPersonalTrainerScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Target_Stats')}`,}} name="TargetStats" component={TargetStatsScreen} />
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Workout')}`,}} name="WorkoutPlan" component={WorkoutPlanScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Camera" component={CameraScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t("Plans")}`,}} name="Plans" component={PlansScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('PlansCalendar')}`,}} name="PlansCalendar" component={PlansCalendarScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Meal_Plan')}`,unmountOnBlur: false }} name="MealPlan" component={MealPlanScreen}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Personal_Trainer_Search')}`,}} name="PersonalTrainerSearch" component={PersonalTrainerSearchScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Macro_Calculator')}`,}} name="MacroCalculator" component={MacroCalculatorScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('BMR')}`,}} name="BMR" component={BMRScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('TDEE')}`,}} name="TDEE" component={TDEEScreen} /> 
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('BMI_Calculator')}`,}} name="BMI" component={BMIScreen} />
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('Body_Fat_LBM')}`,}} name="BodyFatAndLbm" component={BodyFatAndLbmScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Gym_Facilities')}`, unmountOnBlur: false,}} name="GymFacilities" component={GymFacilitiesScreen}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('Exercises')}`, unmountOnBlur: false,}} name="Exercises" component={ExercisesScreen}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: true ,title: `${t('create_new_workout')}`, unmountOnBlur: false,}} name="AddNewEntryWorkout" component={AddNewEntryWorkoutScreen}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AddEntryPlans" component={AddEntryPlansScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPlans" component={TrainerAddEntryPlansScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPlansMeals" component={TrainerAddEntryPlansMealsScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedAddEntryPlansMeals" component={TrainerPredefinedAddEntryPlansMealsScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEntryPredefinedWorkoutPlan" component={TrainerAddEntryPredefinedWorkoutPlanScreen}  options={{headerShown: true ,title: `${t('Add_New_plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerOnboardingCurrentTrainees" component={TrainerOnboardingCurrentTraineesScreen}  options={{headerShown: true ,title: `${t('Add_Active_Clients')}`, unmountOnBlur: false,}}/> 


      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutPlans" component={WorkoutPlansScreen}  options={{headerShown: true ,title: `${t('Workout_Plans')}`, unmountOnBlur: false,}}/> 
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutSettings" component={WorkoutSettingsScreen}  options={{headerShown: true ,title: `${t('Workout_Settings')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false,title: 'Sign in'}} name="Login" component={LoginScreen} options={{headerShown: true ,title: `${t('Login')}`,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="BeginWorkout" component={BeginWorkoutScreen}  options={{headerShown: true ,title: `${t('Begin_Workout')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Charts" component={ChartsScreen}  options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="GymPage" component={CustomPageScreen}  options={{headerShown: true ,title: `${t('Gym_Page')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SelectDayExercises" component={SelectDayExercisesScreen}  options={{headerShown: true ,title: `${t('Select_Day_Exercises')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PlanNumber" component={PlanNumberScreen}  options={{headerShown: true ,title: `${t('Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutName" component={WorkoutNameScreen} options={{headerShown: true ,title: `${t('Workout_Name')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SimilarExercises" component={SimilarExercisesScreen} options={{headerShown: true ,title: `${t('Similar')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SelectedExercises" component={SelectedExercisesScreen}  options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="DaysExercisesToStart" component={DaysExercisesToStartScreen}  options={{headerShown: true ,title: `${t('Days_Exercises_To_Start')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PredefinedMeals" component={PredefinedMealsScreen} options={{headerShown: true ,title: `${t('Predefined_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="ListOfFoods" component={ListOfFoodsScreen} options={{headerShown: true ,title: `${t('List_of_Foods')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AllMealsPage" component={AllMealsPageScreen} options={{headerShown: true ,title: `${t('All_meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="AddNewMealToTodayMeals" component={AddNewMealToTodayMealsScreen} options={{headerShown: true ,title: `${t('Add_New_Meal')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddNewMealToTodayMeals" component={TrainerAddNewMealToTodayMealsScreen} options={{headerShown: true ,title: `${t('Add_New_Meal')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="CreateNewMealInListOfFoods" component={CreateNewMealInListOfFoodsScreen} options={{headerShown: true ,title: `${t('Create_New_Meal')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TodayMeals" component={TodayMealsScreen} options={{headerShown: true ,title: `${t('Today_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PersonalTrainerTodayMeals" component={PersonalTrainerTodayMealsScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="NewPersonalTrainer" component={NewPersonalTrainerScreen} options={{headerShown: true ,title: `${t('Personal_Trainer')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="MembershipsHistory" component={MembershipsHistoryScreen} options={{headerShown: true ,title: `${t('Memberships_History')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="SubscribePage" component={SubscribePageScreen} options={{headerShown: true ,title: `${t('Subscribe_Page')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkedExercisesCalendar" component={WorkedExercisesCalendarScreen} options={{headerShown: true ,title: `${t('Worked_Exercises_Calendar')}`, unmountOnBlur: false,}}/>
    
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerServices" component={TrainerServicesScreen} options={{headerShown: true ,title: `${t('Trainer_Services')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerClients" component={TrainerClientsScreen} options={{headerShown: true ,title: `${t('My_Clients')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAnalysis" component={TrainerAnalysisScreen} options={{headerShown: true ,title: `${t('Trainer_Analysis')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTrainees" component={TrainerTraineesScreen} options={{headerShown: true ,title: `${t('Trainer_Trainees')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TraineePage" component={TraineePageScreen} options={{headerShown: true ,title: `${t('Trainee_Page')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Trainer'sPricing" component={TrainerPricingScreen} options={{headerShown: true ,title: `${t('Trainer_Pricing')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddEditPricing" component={TrainerAddEditPricingScreen} options={{headerShown: true ,title: `${t('Add_New_Pricing')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="ManageMyProfile" component={ManageMyProfileScreen} options={{headerShown: true ,title: `${t('Manage_My_Profile')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerQuestionnaire" component={TrainerQuestionnaireScreen} options={{headerShown: true ,title: `${t('Questionnaire')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="QuestionnaireBeforeSubscribe" component={QuestionnaireBeforeSubscribeScreen} options={{headerShown: true ,title: `${t('Questionnaire')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPricingInfoInSubscribe" component={TrainerPricingInfoInSubscribeScreen} options={{headerShown: true ,title: `${t('Trainer_Pricing')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerQuestionnaireInTraineesPage" component={TrainerQuestionnaireInTraineesPageScreen} options={{headerShown: true ,title: `${t('Questionnaire')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerProfileRefundPolicy" component={TrainerProfileRefundPolicyScreen} options={{headerShown: true ,title: `${t('Refund_Policy')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerProfileCapacity" component={TrainerProfileCapacityScreen} options={{headerShown: true ,title: `${t('Capacity')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutPlans" component={TrainerPredefinedWorkoutPlansScreen} options={{headerShown: true ,title: `${t('Predefined_Workout_Plans')}`, unmountOnBlur: false,}}/>

      

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerManageWorkouts" component={TrainerManageWorkoutsScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Workouts')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeSelectDayExercises" component={TrainerTraineeSelectDayExercisesScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Select_Day_Exercises')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPlanNumber" component={TrainerPlanNumberScreen} options={{headerShown: true ,title: `${t('Trainer_Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutPlanNumber" component={TrainerPredefinedWorkoutPlanNumberScreen} options={{headerShown: true ,title: `${t('Predefined_Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedWorkoutSelectDayExercises" component={TrainerPredefinedWorkoutSelectDayExercisesScreen} options={{headerShown: true ,title: `${t('Select_Day_Exercises')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedManageMealsPlans" component={TrainerPredefinedManageMealsPlansScreen} options={{headerShown: true ,title: `${t('Predefined_meals_Plans')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealPlanNumber" component={TrainerPredefinedMealPlanNumberScreen} options={{headerShown: true ,title: `${t('Predefined_Plan_Number')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealsPlanDays" component={TrainerPredefinedMealsPlanDaysScreen} options={{headerShown: true ,title: `${t('Plan_Days')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedAddMealToPlanDaysMealsNewStyle" component={TrainerPredefinedAddMealToPlanDaysMealsNewStyleScreen} options={{headerShown: true ,title: `${t('select_meals')}`, unmountOnBlur: false,}}/>
      {/* <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMealsSelectMeals" component={TrainerPredefinedMealsSelectMealsScreen} options={{headerShown: true ,title: `${t('Plan_Days')}`, unmountOnBlur: false,}}/> */}


      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeBeginWorkout" component={TrainerTraineeBeginWorkoutScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Begin_Workout')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeDaysExercisesToStart" component={TrainerTraineeDaysExercisesToStartScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Days_Exercises_To_Start')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeStartExercisesWithTimer" component={TrainerTraineeStartExercisesWithTimerScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Start_Exercises_With_Timer')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeWorkedExercisesCalendar" component={TrainerTraineeWorkedExercisesCalendarScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Worked_Exercises_Calendar')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPredefinedMeals" component={TrainerPredefinedMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Predefined_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerManageMeals" component={TrainerManageMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeRequiredMacrosPage" component={TrainerTraineeRequiredMacrosPageScreen} options={{headerShown: true ,title: `${t('Trainer_Manage_Meals')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerPlanMeals" component={TrainerPlanMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Plan_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineePlanDays" component={TrainerTraineePlanDaysScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Plan_Days')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerAddNewMealToPlanDaysMeals" component={TrainerAddNewMealToPlanDaysMealsScreen} options={{headerShown: true ,title: `${t('Add_Meal')}`, unmountOnBlur: false,}}/>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTraineeTodayMeals" component={TrainerTraineeTodayMealsScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Today_Meals')}`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TrainerTodayMealsNewStyle" component={TrainerTodayMealsNewStyleScreen} options={{headerShown: true ,title: `${t('Trainer_Trainee_Today_Meals')}`, unmountOnBlur: false,}}/>

      
      <Stack.Screen screenOptions={{unmountOnBlur: false}} name="TrainerSelectedExercisesPage" component={TrainerSelectedExercisesScreen} options={{unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="StartExercisesWithTimer" component={StartExercisesWithTimerScreen}  options={{headerShown: true ,title: `${t('StartExercisesWithTimer')}`, unmountOnBlur: false,}}/>
      
    </Stack.Navigator>
    );
};

export const MainTabNavigator = () => {
  const { t, i18n } = useTranslation();

  return (      
    <Tab.Navigator  initialRouteName='AppAuthorizedPagesNavigator' screenOptions={{
      tabBarLabelStyle: { fontSize: 14,color: '#000', },
      tabBarActiveTintColor: '#3f7eb3',// Change the active tab icon and label color
      tabBarInactiveTintColor:"#000",
  
      tabBarStyle: {
            backgroundColor: '#FFF', // Change the background color
            height: 60, // Change the height
            paddingBottom: 5, // Add padding to the bottom
            borderTopWidth: 1, // Change the border top width
            borderTopColor: 'transparent', // Change the border top color
          }, // Change the font size here
      //tabBarActiveBackgroundColor:{backgroundColor: 'red',}
    }}>
      <Tab.Screen name="MealPlanScreenStack" component={MealPlanScreenStack} options={{headerShown: false,tabBarLabel: `${t('Meals')}`,tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food-variant" color={color} size={28} />
          ),}}/>
      <Tab.Screen name="WorkoutPlanScreenStack" component={WorkoutPlanScreenStack}  options={{headerShown: false,tabBarLabel: `${t('Workouts')}`,tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={28} />
          ),}}/>
      <Tab.Screen name="AppAuthorizedPagesNavigator" component={AppAuthorizedPagesNavigator} options={{headerShown: false,tabBarLabel: `${t('Home')}`,tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={28} />
          ),}}/>
      <Tab.Screen name="NewsPageScreenStack" component={NewsPageScreenStack} options={{headerShown: false,tabBarLabel: `${t('News')}`,tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper-variant-outline" color={color} size={28} />
          ),}}/>
      <Tab.Screen name="OurCommunityScreenStack" component={OurCommunityScreenStack} options={{headerShown: false,tabBarLabel: `${t('Community')}`,tabBarIcon: ({ color, size }) => (
            // <MaterialCommunityIcons name="target-account" color={color} size={28} />
          <MaterialIcons name="people-alt" size={28} color={color} /> 
         ),}}/>
    </Tab.Navigator>

);
};

export const AccountNavigator = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigation = useNavigation();
  // const initialRoute="";
  const { t, i18n } = useTranslation();

  return (
    <Stack.Navigator initialRouteName='Login'>

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} options={{headerShown: false ,title: 'Account'}} name="Account" component={AccountScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="Register" component={RegisterScreen} options={{headerShown: true ,title: `${t('Register')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="PrivacyAndPolicyPage" component={PrivacyAndPolicyPageScreen} options={{headerShown: true ,title: `${t('Privacy_Policy')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="TermsAndConditionsPage" component={TermsAndConditionsPageScreen} options={{headerShown: true ,title: `${t('the_Terms_Conditions')}`,}}/>


       

      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false,title: 'Sign in'}} name="Login" component={LoginScreen} options={{headerShown: true ,title: `${t('Login')}`,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="RequestPasswordReset" component={RequestPasswordResetScreen}  options={{headerShown: true ,title: `Request Password Reset`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="ResetPassword" component={ResetPasswordScreen}  options={{headerShown: true ,title: `Reset Password`, unmountOnBlur: false,}}/>
      <Stack.Screen screenOptions={{ headerShown: true,unmountOnBlur: false }} options={{headerShown: true ,title: `${t('App_settings')}`,}} name="MixDataHandlingAndWorkoutSettings" component={MixDataHandlingAndWorkoutSettingsScreen} />
      <Stack.Screen screenOptions={{ headerShown: true ,unmountOnBlur: false}} name="WorkoutSettings" component={WorkoutSettingsScreen}  options={{headerShown: true ,title: `${t('Workout_Settings')}`, unmountOnBlur: false,}}/>


      
    </Stack.Navigator>

  );
};

  



