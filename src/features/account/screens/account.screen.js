import React, { useEffect, useContext,useState } from "react";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
  PageContainer,
  AccountBackground,
  AccountContainer,
  AuthButton,
  TitleView,
  Title,
  FormElemeentSizeButtonParentView,
FormElemeentSizeButtonView,
CalendarFullSizePressableButton,
CalendarFullSizePressableButtonText,
  
} from "../components/account.styles";
import { ScrollView} from "react-native";
import AuthGlobal from "../Context/store/AuthGlobal";
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '@env';
import { setCurrentUser } from "../Context/actions/Auth.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./i18n";
import { useTranslation } from 'react-i18next';


export const AccountScreen = ({navigation}) => {
  const context = useContext(AuthGlobal);
  const [hasToken, setHasToken] = useState(false);
  const [isUserSanctumToken, setIsUserSanctumToken] = useState(false);
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

  useEffect(() => {
    if(isUserSanctumToken){
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'OurServices',
          },
        ],
      });
    }
  }, [isUserSanctumToken]);
  //console.log("isUserSanctumToken account",isUserSanctumToken);

  return (
    <PageContainer>
      <ScrollView>
      <AccountBackground>
        <TitleView >
          <Title >Life</Title>
        </TitleView>
        <AccountContainer>

                <FormElemeentSizeButtonView style={{width:"48%"}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
             onPress={() => navigation.navigate("Login")}>
                  <CalendarFullSizePressableButtonText >{t('Login')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView>
                <Spacer size="large">
                  
                </Spacer>
                <FormElemeentSizeButtonView style={{width:"48%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
              onPress={() => navigation.navigate("Register")}>
                      <CalendarFullSizePressableButtonText >{t('Register')}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView>
                
        </AccountContainer>
      </AccountBackground>
      </ScrollView>
    </PageContainer>
  );
};
