import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';


import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  MenuItemPressableButton,
  MenuItemPressableImagedButton,
  MenuItemPressableButtonText,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
  SeparatorView,
  SeparatorViewSpacer,
  WhitePageContainer,
  BlackTitle,
} from "../components/account.styles";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
    
const { width } = Dimensions.get('window');

export const AdsPageScreen = ({ navigation }) => {
    const {t} = useTranslation();//add this line

















  return (
    <WhitePageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <BlackTitle >Life</BlackTitle>
                </TitleView>
                <View style={styles.viewContainer} >
                    <Image
                        source={require('../../../../assets/coming_soon.jpeg')} // Replace with your image URL
                        style={styles.image}
                    />
                    
                </View>


            </AccountBackground>
        </ScrollView>
    </WhitePageContainer>
  );
};
const styles = StyleSheet.create({
    viewContainer: {
      width: width - 20, // he screen width minus padding
      height: 400, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    image: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
  
   
    });