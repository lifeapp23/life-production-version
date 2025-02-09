import React, { useEffect, useContext,useState } from "react";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  PageContainer,
  AccountBackground,
  AccountContainer,
  AuthButton,
  TitleView,
  Title,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText

  
} from "../components/account.styles";
import { StyleSheet,ScrollView,Alert,Text, Modal,View} from "react-native";
import AuthGlobal from "../Context/store/AuthGlobal";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import { setCurrentUser } from "../Context/actions/Auth.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteToken } from "../../../../database/tokensTable"; 
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import {AntDesign} from '@expo/vector-icons';


export const AccountSignOutScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);

  const context = useContext(AuthGlobal);
  const [isUserSanctumToken, setIsUserSanctumToken] = useState(false);
  const [hideButtonClicks, setHideButtonClicks] = useState(false);
  const handleClick = () => {
    setHideButtonClicks(true);
  };
  const { t, i18n } = useTranslation();

  //console.log("context.stateUser.user",context.stateUser.user);
  useFocusEffect(
    React.useCallback(() => {
      const fetchSanctumToken = async () => {
        const userSanctumToken = await AsyncStorage.getItem("sanctum_token");
        return userSanctumToken || false;
      };
      const checkToken = async () => {
        const token = await fetchSanctumToken();
        setIsUserSanctumToken(token);
  
     
      };
  
      checkToken();
    }, [])
  );
  //console.log("isUserSanctumToken signout", isUserSanctumToken);



  
  const handleSignout = async () => {
    setLoading(true);

    axios.post('https://life-pf.com/api/signout', {
              headers: {
                'Authorization': `Bearer ${isUserSanctumToken}`,
                'Content-Type': 'application/json',
                'Connection':"keep-alive",
              },
              })
              .then(response => {
                // Handle successful response
                //console.log("signout response.data.message",response.data.message);
                //console.log("yess----->>>>");

                  // Split the token string using the '|' character
                  const tokenParts = isUserSanctumToken?.split('|');

                  // The first part (index 0) will be the ID
                  const tokenId = parseInt(tokenParts[0], 10);
                  
                  deleteToken(tokenId).then(()=>{
                    //console.log('user token row deleted successfully');
                  });
                  AsyncStorage.removeItem("sanctum_token");
                  AsyncStorage.removeItem("currentUser");
                  AsyncStorage.removeItem("userPublicSettings");

                  context.dispatch(setCurrentUser('',{},{}));
                  // Handle the response, e.g., show a message to the user
                  // alert(response.data.message);
                  setLoading(false);
                  setTimeout(() => {

                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'AccountNavigator',
                      },
                    ],
                  });
                }, 500); // 0.5 seconds delay

              })
              .catch(error => {
                setLoading(false);

                // Handle error
                // Split the token string using the '|' character
                  if(isUserSanctumToken){
                    const tokenParts = isUserSanctumToken.split('|');

                  // The first part (index 0) will be the ID
                  const tokenId = parseInt(tokenParts[0], 10);
                  //console.log('tokenId',tokenId);

                  deleteToken(tokenId).then(()=>{
                    //console.log('result token row deleted successfully');
                  });
                  }
                  
                  AsyncStorage.removeItem("sanctum_token");
                  AsyncStorage.removeItem("currentUser");
                  AsyncStorage.removeItem("userPublicSettings");

                  context.dispatch(setCurrentUser('',{},{}));
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'AccountNavigator',
                      },
                    ],
                  });
              });
              setTimeout(() => {
                setLoading(false);
               
              }, 2000); // 2 seconds delay

    // try {
    //   setHideButtonClicks(true);
      
    //   // Make a request to the signout endpoint `${BASE_URL}/api/signout`
    //   const response = await axios.post(`https://life-pf.com/api/signout`, {token:isUserSanctumToken});
    //   //console.log("signout response.data.message",response.data.message);
      
    //   // Split the token string using the '|' character
    //   const tokenParts = isUserSanctumToken?.split('|');

    //   // The first part (index 0) will be the ID
    //   const tokenId = parseInt(tokenParts[0], 10);
      
    //   deleteToken(tokenId).then(()=>{
    //     //console.log('user token row deleted successfully');
    //   });
    //   AsyncStorage.removeItem("sanctum_token");
    //   AsyncStorage.removeItem("currentUser");
    //   context.dispatch(setCurrentUser('',{},{}));
    //   // Handle the response, e.g., show a message to the user
    //   // alert(response.data.message);
      
    //   navigation.reset({
    //     index: 0,
    //     routes: [
    //       {
    //         name: 'Account',
    //       },
    //     ],
    //   });
    // } catch (error) {
    //   // Handle errors, e.g., show an error message
    //   //console.log(error);
    //   // Split the token string using the '|' character
    //   if(isUserSanctumToken){
    //     const tokenParts = isUserSanctumToken.split('|');

    //   // The first part (index 0) will be the ID
    //   const tokenId = parseInt(tokenParts[0], 10);
      
    //   deleteToken(tokenId).then(()=>{
    //     //console.log('result token row deleted successfully');
    //   });
    //   }
      
    //   AsyncStorage.removeItem("sanctum_token");
    //   AsyncStorage.removeItem("currentUser");
    //   context.dispatch(setCurrentUser('',{},{}));
    //   navigation.reset({
    //     index: 0,
    //     routes: [
    //       {
    //         name: 'Account',
    //       },
    //     ],
    //   });

    // }
  };
  
  return (
    <PageContainer>
      <ScrollView>
      <AccountBackground>
        <TitleView >
          <Title >Life</Title>
        </TitleView>
        <AccountContainer>
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
          <Spacer size="large">
            <CalendarFullSizePressableButton style={{backgroundColor:'#000',padding:10,paddingLeft:20,paddingRight:20}}
               onPress={handleSignout}
            >
              

              <CalendarFullSizePressableButtonText>{t('Sign_Out')}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
          </Spacer>
        </AccountContainer>
      </AccountBackground>
      </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  //zoom image Front
     
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
    successText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
      marginTop: 15,
    },
  });