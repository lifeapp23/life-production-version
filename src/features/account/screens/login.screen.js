import React, { useEffect,useState,useContext, useRef } from "react";
import {ActivityIndicator, RefreshControl, View, Modal, StyleSheet, ScrollView,Text,Alert, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { URL, URLSearchParams } from 'react-native-url-polyfill';
import * as Device from 'expo-device';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session'
import {addWorkoutRowsToDatabaseForTrainer} from "../../../../database/data_handling_functions";

import * as Linking from 'expo-linking'; // Import Linking
WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

import { WebView } from 'react-native-webview';
import {
  AccountBackground,
  AccountContainer,
  AuthButton,
  AuthInputViewParent,
  AuthInputView,
  AuthInput,
  Title,
  PageContainer,
  TitleView,
  TopView,
  AvatarIcon,
  LoginIconView,
  LoginIcon,
  AuthButtonViewParent,
  AuthLoginButton,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  WhitePageContainer,
  BlackTitle,
  AsteriskTitle,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { addEventListener } from "@react-native-community/netinfo";
import axios from 'axios';
import {BASE_URL} from '@env';
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { setCurrentUser } from "../Context/actions/Auth.actions";
import { insertUser,fetchUsers } from "../../../../database/usersTable"; 
import { insertToken } from "../../../../database/tokensTable"; 
import { fetchPublicSettings} from "../../../../database/workout_settings";
import { insertTrainerManageMyProfile,fetchTrainerManageMyProfile} from "../../../../database/trainer_manage_my_profile";
import { useFocusEffect } from '@react-navigation/native';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const context = useContext(AuthGlobal);
  const [hideButtonClicks, setHideButtonClicks] = useState(false);
  const [isPressDisabled, setPressDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userAgentConst, setUserAgentConst] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a network request or any async operation
    setTimeout(() => {
      console.log('Data refreshed!');
      setRefreshing(false); // Stop the refreshing animation
    }, 2000); // Simulated delay
  };
  const { t, i18n } = useTranslation();
  const [googleWebViewVisible, setGoogleWebViewVisible] = useState(false);
  const [prog, setProg] = useState(false);
  const [progClr, setProgClr] = useState('#000');
  // const [htmlGoogleContent, setHtmlGoogleContent] = useState("");  
  const [authData, setAuthData] = useState(null);
  const webViewGoogleRef = useRef(null);
  const [DataTwoInsideparsedData, setDataTwoInsideparsedData] = useState('');
  const [DataOneuseEffectparams, setDataOneuseEffectparams] = useState('');
  const [DataTwoInsideLINK, setDataTwoInsideLINK] = useState('');
  const [DataOneuseEffectLINK, setDataOneuseEffectLINK] = useState('');
  const [DataTwoInsideauthData, setDataTwoInsideauthData] = useState('');
  const [decodedAuthDataData, setdecodedAuthDataData] = useState('');
  const [handleDeepLinkNewStateAtBegin, setHandleDeepLinkNewStateAtBegin] = useState('');


 
//////////////////////////// START WebBrowser ////////////////////////////////
 // Deep link listener
 const handleDeepLink = ({url}) => {
  // //console.log('before if Received URL:', url);
  // setHandleDeepLinkNewStateAtBegin(url);
  // const url ='life://redirect?authData=%7B%22message%22%3A%22Login_successful%22%2C%22user%22%3A%7B%22id%22%3A40%2C%22fName%22%3A%22Ahmed%22%2C%22lName%22%3A%22Hamdy%22%2C%22email%22%3A%22ahmedovich19593%40gmail.com%22%2C%22phone%22%3A%22%22%2C%22gender%22%3A%22%22%2C%22bdate%22%3Anull%2C%22country%22%3A%22%22%2C%22role%22%3A%22%22%2C%22athRol%22%3A%22user%22%2C%22isAppro%22%3A%22%22%2C%22created_at%22%3A%222024-11-11T16%3A57%3A28.000000Z%22%2C%22updated_at%22%3A%222024-11-11T16%3A57%3A28.000000Z%22%7D%2C%22token%22%3A%22230%7CrPiJ4tmHHBuP7aVXwCdADjgFp3Sv7gaz8pa6Eo1g59208aa7%22%2C%22tokenRaw%22%3A%7B%22id%22%3A230%2C%22tokenable_type%22%3A%22App%5C%5CModels%5C%5CUser%22%2C%22tokenable_id%22%3A40%2C%22name%22%3A%22token-social%22%2C%22abilities%22%3A%5B%22*%22%5D%2C%22last_used_at%22%3Anull%2C%22expires_at%22%3Anull%2C%22created_at%22%3A%222024-11-12T13%3A45%3A09.000000Z%22%2C%22updated_at%22%3A%222024-11-12T13%3A45%3A09.000000Z%22%7D%7D';
  if (url && url.startsWith("life://redirect")) {
    //console.log('Received URL:', url);

    const params = new URL(url).searchParams;
    const authData = params.get('authData');
    // setDataOneuseEffectparams(params);
    // setDataTwoInsideauthData(authData);
    if (authData) {
      //console.log('if Auth Data:', authData);
      // const decodedAuthData = decodeURIComponent(authData);
      // setdecodedAuthDataData(decodedAuthData);
      const parsedData = JSON.parse(authData);

      // setDataTwoInsideparsedData(JSON.stringify(parsedData));

      //console.log('Parsed Auth Data:', parsedData);
      if(parsedData){
        //////console.log('hhhhhhhhhh',data);
        // alert(parsedData.message);
        const token = parsedData.token;
        const user =parsedData.user;
        const tokenRaw =parsedData.tokenRaw;
        const message =parsedData.message;
  
        if(user.role == 'Trainer'){
          const trainerManageMyProfile =parsedData?.trainerManageMyProfile;
          ////console.log("login trainerManageMyProfile",trainerManageMyProfile);
  
          const { userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,aprovd,isSync} = trainerManageMyProfile;
          const aboutNew = about != null ? about : '';
          const crtfctNew = crtfct != null ? crtfct : '';
          const socMedNew = socMed != null ? socMed : '';
          const imagesNew = images != null ? images : '';
          const rfnPlcNew = rfnPlc != null ? rfnPlc : '';
          const capctyNew = capcty != null ? capcty : '';
          const acpSubNew = acpSub != null ? acpSub : '';
          const strDatNew = strDat != null ? strDat : '';
          const endDatNew = endDat != null ? endDat : '';
          const aprovdNew = aprovd != null ? aprovd : '';
          const isSyncNew = isSync != null ? isSync : '';
          const dataComeFromDBAfterEdits={
            userId : userId,
            speKey : speKey,
            about : aboutNew,
            crtfct : crtfctNew,
            socMed : socMedNew,
            images : imagesNew,
            rfnPlc : rfnPlcNew,
            capcty : capctyNew,
            acpSub : acpSubNew,
            strDat : strDatNew,
            endDat : endDatNew,
            aprovd : aprovdNew,
            isSync : isSyncNew,
          }
          insertTrainerManageMyProfile(dataComeFromDBAfterEdits)
          .then(response => {
            //////console.log('inserting data profile into offline database successfully:', response);
  
          })
          .catch(error => {
            // Handle error
            //////console.log('Error inserting data profile into offline database:', error);
          });
          //////console.log('dataComeFromDBAfterEdits',dataComeFromDBAfterEdits);
          const userworkoutsData =parsedData?.userworkoutsData;
          // console.log('userworkoutsData====',userworkoutsData);

          if(userworkoutsData?.length > 0){
            addWorkoutRowsToDatabaseForTrainer(userworkoutsData).then((userworkoutsDataResult) => {
              
            }).catch((error) => {
              //////console.log('Error fetching addWorkoutRowsToDatabaseForTrainer:', error);
              // setIsTwoLoading(false);

            });
          }
        }
      
        //////console.log('user.id====',user.id,' ----user.uName--',user.uName);
        //////console.log('token====',token);
        //////console.log('tokenRaw====',tokenRaw);
  
        //////console.log('data.message====',data.message);
        // Save user data and token locally
        // insertUser(user);
        insertToken(tokenRaw,token).then((result)=>{
          //////console.log('result insert token into database',result);
        });
        insertUser(user).then((result)=>{
          //////console.log('result insert user into database',result);
          fetchPublicSettings(user.id).then((PSettingsResults) => {
            //console.log('PSettingsResults table in login :', PSettingsResults);
            if (PSettingsResults.length > 0){
              Alert.alert(``,
              `${t(message)}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // //console.log('user 2 login',user);
                      // //console.log('PSettingsResults[0] 2 login',PSettingsResults[0]);
  
                      AsyncStorage.setItem("sanctum_token", token);
                      AsyncStorage.setItem("currentUser", JSON.stringify(user));
                      AsyncStorage.setItem("userPublicSettings", JSON.stringify(PSettingsResults[0]));
                      context.dispatch(setCurrentUser(token, user,PSettingsResults[0]));
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'MainTabNavigator',
                          },
                        ],
                      });
                    },
                  },
                ],
                { cancelable: false }
              );
            }else{
              Alert.alert(``,
              `${t("You_will_be_redirected_to_Settings_page_to_complete_your_Account")}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // //console.log('user 2 login',user);
                    AsyncStorage.setItem("sanctum_token", token);
                    AsyncStorage.setItem("currentUser", JSON.stringify(user));
                    context.dispatch(setCurrentUser(token, user,{}));
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'MixDataHandlingAndWorkoutSettings',
                        },
                      ],
                    });
                  },
                },
              ],
              { cancelable: false }
            );
            }
          
          });
        });
        
        
        // saveTokenLocally(token, user.id);
        //Navigate to the next screen or perform any other actions
        
      }else{
      AsyncStorage.removeItem("sanctum_token");
      AsyncStorage.removeItem("currentUser");
      AsyncStorage.removeItem("userPublicSettings");
  
      
      context.dispatch(setCurrentUser('',{},{}));
      }

      // const { token, user } = parsedData;
      // setCurrentUser(dispatch, { token, user });
      // Alert.alert("Success", "Logged in with Google successfully!");
    } else {
      // Alert.alert("Error", "Failed to retrieve login information.");
    }

    // Close the WebBrowser after login is complete
    // WebBrowser.dismissBrowser();
  }
};
// const urlFromUse = Linking.useURL();
  
//  useEffect(() => {
 
//   if (urlFromUse) {
//     //console.log('handleDeepLink(url);:', urlFromUse);  // Add this to verify the URL
//     setDataOneuseEffectLINK(urlFromUse);

//     handleDeepLink(urlFromUse);
//     }
//   // Linking.getInitialURL().then((urlInit) => {
//   //   //console.log('Initial URL:', urlInit);  // Add this to verify the URL
//   //   if (urlInit) handleDeepLink({ urlInit });
//   // });
  
// //   // Add listener on mount
// // const linkingListener = Linking.addEventListener("url", handleDeepLink);

// //   // Remove listener on unmount
// //   return () => { 
// //     linkingListener.remove();
// //    };
// }, [Linking,urlFromUse]);

const handleGoogleSignIn = async () => { 
  // const redirectUrl = 'myapp://redirect'; // Make sure this matches your app scheme
 // Disable browser default behavior
 WebBrowser.maybeCompleteAuthSession({ shouldEscapeRedirect: true });

 // Custom redirect URI that matches your app's scheme
//  const redirectUri = Linking.createURL('redirect');

//  // Open authentication session with specific configuration
//  const result = await WebBrowser.openAuthSessionAsync(
//    `https://life-pf.com/api/auth/google/redirect?redirect_uri=${encodeURIComponent(redirectUri)}`, 
//    redirectUri,
//    {
//      showInRecents: false,
//      ephemeralWebSession: true
//    }
//  );
  let result = await WebBrowser.openAuthSessionAsync('https://life-pf.com/api/auth/google/redirect', redirectTo); 
  //console.log('result--handleGoogleSignIn',result);
  if (result.type === 'success') {
    //console.log('Authentication success:', result.url);
    // The result.url will contain the deep link with authData
    // setDataTwoInsideLINK(result.url);
    handleDeepLink({ url: result.url });
  } else {
    // Alert.alert('Authentication failed', 'There was an issue with the authentication process.');
  }
  // if (result.type === 'success') { 
  //   const parsedUrl = new URL(result.url); 
  //   const authData = JSON.parse(parsedUrl.searchParams.get('authData'));
  //    setGoogleWebViewVisible(false); handleAuthData(authData);
    
  //   }
     
  };

const handleAuthData = (data) => { // Your logic for handling the auth data 
  if (data) { 
    const token = data.token; 
    const user = data.user;
     const tokenRaw = data.tokenRaw;
      const message = data.message; 
      // Perform navigation or other actions based on received data
       } 
      };
//////////////////////////// ENS  WebBrowser ////////////////////////////////
  useEffect(() => {
      const unsubscribe = addEventListener(state => {
        //////console.log("Connection type--", state.type);
        //////console.log("Is connected?---", state.isConnected);
        setTriainerConnected(state.isConnected);

      });
      
      // Unsubscribe when the component unmounts
      return () => {
        unsubscribe();
    };
  
    }, [refreshing]);
    useEffect(() => {
      // Get device info from expo-device
      const deviceInfo = {
        isAndroid: Device.osName === 'Android',
        isIOS: Device.osName === 'iOS',
        systemVersion: Device.osVersion,
        modelName: Device.modelName,
      };
  
      // Dynamically create the user agent string based on device info
      let userAgentString = '';
  
      // if (deviceInfo.isAndroid) {
      //   userAgentString = `Mozilla/5.0 (Linux; Android ${deviceInfo.systemVersion}; ${deviceInfo.modelName} Build/${Device.deviceId}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36`;
      
      // } else if (deviceInfo.isIOS) {
      //   userAgentString = `Mozilla/5.0 (iPhone; CPU iPhone OS ${deviceInfo.systemVersion} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1`;
      // }
      if (deviceInfo.isAndroid) {
        // Flexible Android User-Agent to support different devices and browsers
        userAgentString = `Mozilla/5.0 (Linux; Android ${deviceInfo.systemVersion}; ${deviceInfo.modelName} Build/${Device.deviceId}) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/41.0.2228.0 Mobile Safari/537.36`;
       //userAgentString = ` Mozilla/5.0 (Linux; Android 12; Pixel a5 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.130 Mobile Safari/537.36`
      //  userAgent="Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36"


        // For broader compatibility, you could adjust the Chrome version to something older or more general
        // Example: Chrome/75.0.3770.100 Mobile Safari/537.36
    } else if (deviceInfo.isIOS) {
        // Flexible iOS User-Agent to support different devices and browsers
        userAgentString = `Mozilla/5.0 (iPhone; CPU iPhone OS ${deviceInfo.systemVersion} like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36`;
        // You can also adjust the Safari version for compatibility with older devices
        // Example: Safari/537.36 or use a more general setup for broader compatibility
    }
    
  
      setUserAgentConst(userAgentString);
    }, [Device]);
  const handleSubmit = async () => {
    if(triainerConnected){
      if (email === '' || password === '') {
        alert(`${t('All_fields_are_required')}`);
        return;
      }
      // if (hideButtonClicks) {
      //   return;
      // }
      // if (isPressDisabled) return;
    
      // setPressDisabled(true);
      setLoading(true);

      try {
        setLoading(true);

        // setHideButtonClicks(true);
        // Make an API request to your login endpoint
        const response = await axios.post(`https://life-pf.com/api/signin`, {
          email: email,
          password: password,
        });
        
        //////console.log("-->Print_>>>")
        // Assuming your API returns a token upon successful login
        
        if(response?.data){
          //////console.log('hhhhhhhhhh',response?.data);
          // alert(response?.data.message);
          const token = response?.data.token;
          const user =response?.data.user;
          const tokenRaw =response?.data.tokenRaw;

          if(user.role == 'Trainer'){
            const trainerManageMyProfile =response?.data?.trainerManageMyProfile;

            const { userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,aprovd,isSync} = trainerManageMyProfile;
            const aboutNew = about != null ? about : '';
            const crtfctNew = crtfct != null ? crtfct : '';
            const socMedNew = socMed != null ? socMed : '';
            const imagesNew = images != null ? images : '';
            const rfnPlcNew = rfnPlc != null ? rfnPlc : '';
            const capctyNew = capcty != null ? capcty : '';
            const acpSubNew = acpSub != null ? acpSub : '';
            const strDatNew = strDat != null ? strDat : '';
            const endDatNew = endDat != null ? endDat : '';
            const aprovdNew = aprovd != null ? aprovd : '';
            const isSyncNew = isSync != null ? isSync : '';
            const dataComeFromDBAfterEdits={
              userId : userId,
              speKey : speKey,
              about : aboutNew,
              crtfct : crtfctNew,
              socMed : socMedNew,
              images : imagesNew,
              rfnPlc : rfnPlcNew,
              capcty : capctyNew,
              acpSub : acpSubNew,
              strDat : strDatNew,
              endDat : endDatNew,
              aprovd : aprovdNew,
              isSync : isSyncNew,
            }
            insertTrainerManageMyProfile(dataComeFromDBAfterEdits)
            .then(response => {
              //////console.log('inserting data profile into offline database successfully:', response);
    
            })
            .catch(error => {
              // Handle error
              //////console.log('Error inserting data profile into offline database:', error);
            });
            //////console.log('dataComeFromDBAfterEdits',dataComeFromDBAfterEdits);
            //////console.log('trainerManageMyProfile====',trainerManageMyProfile);
            const userworkoutsData =response?.data?.userworkoutsData;

            if(userworkoutsData?.length > 0){
              addWorkoutRowsToDatabaseForTrainer(userworkoutsData).then((userworkoutsDataResult) => {
                
              }).catch((error) => {
                //////console.log('Error fetching addWorkoutRowsToDatabaseForTrainer:', error);
                // setIsTwoLoading(false);

              });
            }
          
          
          }
        
          //////console.log('user.id====',user.id,' ----user.uName--',user.uName);
          //////console.log('token====',token);
          //////console.log('tokenRaw====',tokenRaw);

          //////console.log('response?.data.message====',response?.data.message);
          // Save user data and token locally
          // insertUser(user);
          insertToken(tokenRaw,token).then((result)=>{
            //////console.log('result insert token into database',result);
          });
          insertUser(user).then((result)=>{
            //////console.log('result insert user into database',result);
            fetchPublicSettings(user.id).then((PSettingsResults) => {
              //////console.log('PSettingsResults table in login length:', PSettingsResults.length);
              if (PSettingsResults.length > 0){
                setLoading(false);
                // Delay to allow users to see the success message before closing the modal
                setTimeout(() => {
                Alert.alert(``,
                `${t(response?.data.message)}`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        AsyncStorage.setItem("sanctum_token", token);
                        AsyncStorage.setItem("currentUser", JSON.stringify(user));
                        AsyncStorage.setItem("userPublicSettings", JSON.stringify(PSettingsResults[0]));

                        context.dispatch(setCurrentUser(token, user,PSettingsResults[0]));
                        navigation.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'MainTabNavigator',
                            },
                          ],
                        });
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }, 500); // .5 seconds delay

              }else{
                setLoading(false);
                // Delay to allow users to see the success message before closing the modal
                setTimeout(() => {
                Alert.alert(``,
                `${t("You_will_be_redirected_to_Settings_page_to_complete_your_Account")}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      AsyncStorage.setItem("sanctum_token", token);
                      AsyncStorage.setItem("currentUser", JSON.stringify(user));
                      context.dispatch(setCurrentUser(token, user,{}));
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'MixDataHandlingAndWorkoutSettings',
                          },
                        ],
                      });
                    },
                  },
                ],
                { cancelable: false }
              );
            }, 500); // .5 seconds delay

              }
            
            });
          });
          
          
          // saveTokenLocally(token, user.id);
          //Navigate to the next screen or perform any other actions
          
        }else{
          setLoading(false);

          AsyncStorage.removeItem("sanctum_token");
          AsyncStorage.removeItem("currentUser");
          context.dispatch(setCurrentUser('',{},{}));
        }
        // Store the token in your app (you can use AsyncStorage or Redux for state management)
        // For example, you can save it to AsyncStorage like this:
        // await AsyncStorage.setItem('token', token);
    
        
        // Example: Navigate to the home screen
        // navigation.navigate('Home');
      } catch (error) {
        //////console.log('error', error);
        // setHideButtonClicks(false);
        // Handle login error
        setLoading(false);

          AsyncStorage.removeItem("sanctum_token");
          AsyncStorage.removeItem("currentUser");
          context.dispatch(setCurrentUser('',{},{}));
        //alert('Login failed. Please check your credentials.');
        //////console.error(error.response?.data.errors);
        const { errors, message } = error?.response?.data;
        // const validationErrors = error.response?.data.errors;
        //////console.log('error.response?.data.errors:', error?.response?.data?.errors);
        ////////console.log('error.response?.data.message:', error.response?.data.message);

        if (message) {
          //////console.log('Error Message:', message);
          if (message === 'Trainer must wait for admin approval'){
            Alert.alert(`${t(message)}`);
          } else{
            Alert.alert(`${t(message)}`,`${t('enter_the_correct_email_or_password')}`);
          }
          
          // Handle error message, e.g., show an alert
          setEmailError('');
          setPasswordError('');
        } else if (error?.response?.data?.errors) {
          if (error?.response?.data?.errors?.email !== undefined){
            setEmailError(error?.response?.data?.errors?.email[0]);
            //////console.log('error.response?.data.errors.email[0]:', error?.response?.data?.errors?.email[0]);
          }else{
            setEmailError('');
          }
          if(error?.response?.data?.errors?.password !== undefined){
            setPasswordError(error?.response?.data?.errors?.password[0]);
          }else{
            setPasswordError('');
          }
        } else {
          setLoading(false);
          setTimeout(() => {

          Alert.alert(`${t("No_Internet_Connection")}`);
          }, 500); // 2 seconds delay

          // Handle other unexpected errors
        }
      }
      setLoading(false);

      setTimeout(() => {
        setPressDisabled(false);
      }, 2000); // Disable press for 300ms to prevent quick successive presses
  
  }else{
    setLoading(false);
          setTimeout(() => {
              Alert.alert(`${t('To_Login')}`,
              `${t('You_must_be_connected_to_the_internet')}`);
          }, 500); // 2 seconds delay

   }
  };
  // function handleGoogleMessage(e) {
  //   let data = JSON.parse(e.nativeEvent.data);
  //   //const message = JSON.parse(event.nativeEvent.data);
  //   //////console.log('e>>>',e);
  //   //////console.log('Received data:', data);
  //   if (data !== undefined) {
  //     setShowGateway(data.setShowGateway);
  //     setOurPersonalTrainers(data.TrainerCurrencyAmountCount);

  //   }
  // };
  const htmlGoogleContent = `
  <html>
    <body>
      <form id="myGoogleForm" action="https://life-pf.com/api/auth/google/redirect" method="get">
        
      </form>
      <script>
        // Submit the form automatically when the page loads
        document.getElementById("myGoogleForm").submit();
      </script>
    </body>
  </html>
`;
const handleGoogleWebViewMessage = (event) => {
  const data = JSON.parse(event.nativeEvent.data);
  ////console.log("Received data:", data);

  setGoogleWebViewVisible(false);
  setAuthData(data);
  // Perform navigation or other actions based on received data
  ////console.log("Received token:", data.token);
  ////console.log("Received message:", data.message);
  ////console.log("Received user:", data.user);

  ////console.log("Received tokenRaw:", data.tokenRaw);
    if(data){
      //////console.log('hhhhhhhhhh',data);
      // alert(data.message);
      const token = data.token;
      const user =data.user;
      const tokenRaw =data.tokenRaw;
      const message =data.message;

      if(user.role == 'Trainer'){
        const trainerManageMyProfile =data?.trainerManageMyProfile;
        ////console.log("login trainerManageMyProfile",trainerManageMyProfile);

        const { userId,speKey,about,crtfct,socMed,images,rfnPlc,capcty,acpSub,strDat,endDat,aprovd,isSync} = trainerManageMyProfile;
        const aboutNew = about != null ? about : '';
        const crtfctNew = crtfct != null ? crtfct : '';
        const socMedNew = socMed != null ? socMed : '';
        const imagesNew = images != null ? images : '';
        const rfnPlcNew = rfnPlc != null ? rfnPlc : '';
        const capctyNew = capcty != null ? capcty : '';
        const acpSubNew = acpSub != null ? acpSub : '';
        const strDatNew = strDat != null ? strDat : '';
        const endDatNew = endDat != null ? endDat : '';
        const aprovdNew = aprovd != null ? aprovd : '';
        const isSyncNew = isSync != null ? isSync : '';
        const dataComeFromDBAfterEdits={
          userId : userId,
          speKey : speKey,
          about : aboutNew,
          crtfct : crtfctNew,
          socMed : socMedNew,
          images : imagesNew,
          rfnPlc : rfnPlcNew,
          capcty : capctyNew,
          acpSub : acpSubNew,
          strDat : strDatNew,
          endDat : endDatNew,
          aprovd : aprovdNew,
          isSync : isSyncNew,
        }
        insertTrainerManageMyProfile(dataComeFromDBAfterEdits)
        .then(response => {
          //////console.log('inserting data profile into offline database successfully:', response);

        })
        .catch(error => {
          // Handle error
          //////console.log('Error inserting data profile into offline database:', error);
        });
        //////console.log('dataComeFromDBAfterEdits',dataComeFromDBAfterEdits);
        //////console.log('trainerManageMyProfile====',trainerManageMyProfile);

      }
    
      //////console.log('user.id====',user.id,' ----user.uName--',user.uName);
      //////console.log('token====',token);
      //////console.log('tokenRaw====',tokenRaw);

      //////console.log('data.message====',data.message);
      // Save user data and token locally
      // insertUser(user);
      insertToken(tokenRaw,token).then((result)=>{
        //////console.log('result insert token into database',result);
      });
      insertUser(user).then((result)=>{
        //////console.log('result insert user into database',result);
        fetchPublicSettings(user.id).then((PSettingsResults) => {
          //console.log('PSettingsResults table in login :', PSettingsResults);
          if (PSettingsResults.length > 0){
            Alert.alert(``,
            `${t(message)}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // //console.log('user 2 login',user);
                    // //console.log('PSettingsResults[0] 2 login',PSettingsResults[0]);

                    AsyncStorage.setItem("sanctum_token", token);
                    AsyncStorage.setItem("currentUser", JSON.stringify(user));
                    AsyncStorage.setItem("userPublicSettings", JSON.stringify(PSettingsResults[0]));
                    context.dispatch(setCurrentUser(token, user,PSettingsResults[0]));
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'MainTabNavigator',
                        },
                      ],
                    });
                  },
                },
              ],
              { cancelable: false }
            );
          }else{
            Alert.alert(``,
            `${t("You_will_be_redirected_to_Settings_page_to_complete_your_Account")}`,
            [
              {
                text: 'OK',
                onPress: () => {
                  // //console.log('user 2 login',user);
                  AsyncStorage.setItem("sanctum_token", token);
                  AsyncStorage.setItem("currentUser", JSON.stringify(user));
                  context.dispatch(setCurrentUser(token, user,{}));
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'MixDataHandlingAndWorkoutSettings',
                      },
                    ],
                  });
                },
              },
            ],
            { cancelable: false }
          );
          }
        
        });
      });
      
      
      // saveTokenLocally(token, user.id);
      //Navigate to the next screen or perform any other actions
      
    }else{
    AsyncStorage.removeItem("sanctum_token");
    AsyncStorage.removeItem("currentUser");
    AsyncStorage.removeItem("userPublicSettings");

    
    context.dispatch(setCurrentUser('',{},{}));
    }

};

// const handleGoogleWebViewNavigationStateChange = async (navState) => {
//   const { url } = navState;
//   if (url.includes('api/auth/google/callback')) {
//       setGoogleWebViewVisible(false);
//       try {
//           const response = await fetch(url);
//           const data = await response;
//           ////console.log("Received data:", data);

//           // Handle the received data (token, user, etc.)
//           //setAuthData(data);
//           // Perform navigation or other actions based on received data
//           // ////console.log("Received token:", data.token);
//           // ////console.log("Received message:", data.message);
//           // ////console.log("Received user:", data.user);

//           // ////console.log("Received tokenRaw:", data.tokenRaw);
          
//       } catch (error) {
//           //console.error('Error fetching data:', error);
//       }
//   }
// };
const renderCustomLoading = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" color="#fff" />
    </View>
  );
  ////////console.log('emailError',emailError);
  return (
    <WhitePageContainer>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <AccountBackground>
      <TitleView >
      <BlackTitle >Life</BlackTitle>
      </TitleView>
      {/* <TopView>
      
      </TopView> */}
      <AccountContainer>
      {/* <AvatarIcon icon="account" color="#cfd8dc"/> */}
      <LoginIconView>
        <LoginIcon  source={require('../../../../assets/Login_icon.jpg')} />
      </LoginIconView>
       <Modal
            animationType="slide"
            transparent={true}
            visible={loading}

            >
            
            <View style={styles.modalContainer}>
              <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>Loading...</Text>
                <Spinner size="large" color="#fff" />
              </View>
            </View>
      </Modal>
      <AuthInputViewParent>
        <AuthInputView>
          <AuthInput
            placeholder={t("E_mail")}
              value={email}
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setEmail(u)}
          />
          {emailError && (<Text style={{color:'red',fontSize:14}}>{emailError}</Text>)}
        </AuthInputView>
        <Spacer size="large">
          <AuthInputView>
            <AuthInput
              placeholder={t("Password")}
              value={password}
              textContentType="password"
              secureTextEntry
              autoCapitalize="none"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(p) => setPassword(p)}
            />
            {passwordError && (<Text style={{color:'red',fontSize:14}}>{passwordError}</Text>)}
          </AuthInputView>
        </Spacer>
      </AuthInputViewParent>
      <Spacer size="large">
          <View style={styles.forgetPasswordContainer}>
            {/* Your login form */}
            <TouchableOpacity style={styles.forgetPasswordLinkContainer} onPress={() => navigation.navigate('RequestPasswordReset')}>
              <Text style={styles.forgetPasswordLink}>{t("Forgot_Password")}</Text>
            </TouchableOpacity>
          </View>
      </Spacer>
        <Spacer size="large">
          <AuthButtonViewParent style={{gap: 10,}}>
            <AuthLoginButton>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:10,paddingLeft:35,paddingRight:35}}
               onPress={handleSubmit}
            >
              <CalendarFullSizePressableButtonText>{t("Login")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            </AuthLoginButton>
            <AuthLoginButton>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:10,paddingLeft:35,paddingRight:35}} onPress={() => navigation.navigate("Register")}
            >
              <CalendarFullSizePressableButtonText>{t("Register")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            </AuthLoginButton>
            </AuthButtonViewParent>
        </Spacer>
      </AccountContainer>
      
  
{/*   
  
      <Text style={styles.forgetPasswordLink}>{DataTwoInsideLINK ? DataTwoInsideLINK : "no DataTwoInsideLINK"}</Text>
      <Text style={styles.forgetPasswordLink}>{DataOneuseEffectLINK ? DataOneuseEffectLINK : "no DataOneuseEffectLINK"}</Text>
      <Text style={styles.forgetPasswordLink}>{DataOneuseEffectparams ? DataOneuseEffectparams : "no DataOneuseEffectparams"}</Text>
      
      <Text style={styles.forgetPasswordLink}>{DataTwoInsideauthData ? DataTwoInsideauthData : "no DataTwoInsideauthData"}</Text>
      <Text style={styles.forgetPasswordLink}>{decodedAuthDataData ? decodedAuthDataData : "no decodedAuthDataData"}</Text>
      <Text style={styles.forgetPasswordLink}>{ DataTwoInsideparsedData ? DataTwoInsideparsedData : "no DataTwoInsideparsedData"}</Text>

       */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image source={require('../../../../assets/google-logo.png')} style={styles.googleButtonLogo} />
        <Text style={styles.googleButtonText}>{t("Sign_in_with_Google")}</Text>
      </TouchableOpacity>
      <View style={styles.googleButtonContainer}>
      {/* <TouchableOpacity style={styles.googleButton} onPress={() => setGoogleWebViewVisible(true)}>
        <Image
            source={require('../../../../assets/google-logo.png')} 
          style={styles.googleButtonLogo}
        />
        <Text style={styles.googleButtonText}>{t("Sign_in_with_Google")}</Text>
      </TouchableOpacity> */}

      <Modal
        visible={googleWebViewVisible}
        onDismiss={() =>setGoogleWebViewVisible(false)}
        onRequestClose={() => setGoogleWebViewVisible(false)}
        animationType={"fade"}
        transparent>
        <View style={styles.webViewCon}>
          <View style={styles.wbHead}>
            <TouchableOpacity
              style={{padding: 13}}
              onPress={() => setGoogleWebViewVisible(false)}>
              <Feather name={'x'} size={24} />
            </TouchableOpacity>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                color: '#00457C',
              }}>
              {t("Sign_in_with_Google")}
            </Text>
            <View style={{padding: 13, opacity: prog ? 1 : 0}}>
              <ActivityIndicator size={24} color={progClr} />
            </View>
          </View>
          <WebView
            //  onNavigationStateChange={handleGoogleWebViewNavigationStateChange}
            style={styles.googleWebView}
            originWhitelist={['*']}
            source={{ html: htmlGoogleContent }}
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62"          
            ref={webViewGoogleRef}
            onMessage={handleGoogleWebViewMessage}
           
            startInLoadingState={true} // Show loading indicator
            renderLoading={renderCustomLoading} // Custom loading spinner
                />
          
        </View>
      </Modal>
    </View>
    </AccountBackground>
    </ScrollView>
    
    </WhitePageContainer>
  );
};
const styles = StyleSheet.create({
  googleButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 70,
    paddingRight: 70,
    borderRadius: 25,
    marginTop:20,
    borderWidth: 2,
    borderColor:"#eaeaea",
  },
  googleButtonLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
  },
  googleWebView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
  },
  forgetPasswordContainer: {
    width:250,
    padding: 1,
    justifyContent: 'center',
  },
  forgetPasswordLinkContainer:{
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  forgetPasswordLink: {
    color: '#000',
    textAlign: 'center',
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