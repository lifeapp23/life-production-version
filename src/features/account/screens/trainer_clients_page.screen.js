import React, { useState } from "react";


import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  MenuItemPressableButton,
  MenuItemPressableButtonText,
  MenuItemPressableImagedButton,
  SeparatorView,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
} from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

export const TrainerClientsScreen = ({ navigation }) => {
const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
const { t, i18n } = useTranslation();

  return (
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>
                {/* <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("TrainerAnalysis");
                        updateSelectedDate('');
                        }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="tape-measure" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >{t('Analysis')}</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/> */}
                {/* <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("TrainerTrainees");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="target-account" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >{t('Trainees')}</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView> */}
                <MenuItemPressableImagedButton
                    onPress={() =>{
                       navigation.navigate("TrainerTrainees");
                       updateSelectedDate('');
                    }}
                    >    
                    <Image
                      source={require('../../../../assets/trainer_trainees_section.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Trainees")}</Text>
                    </View>
                </MenuItemPressableImagedButton>

                <SeparatorView/>
                {/* <FullSizeButtonView>
                    <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("Trainer'sPricing");
                        updateSelectedDate('');
                    }}
                    >
                        <MenuItemPressableButtonAvatarAccount icon="calculator" size={32} color="#cfd8dc"/>
                        <MenuItemPressableButtonText >{t('Pricing')}</MenuItemPressableButtonText>
                        <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                    </MenuItemPressableButton>
                </FullSizeButtonView> */}
                <MenuItemPressableImagedButton  style={{marginTop:3}}
                    onPress={() =>{
                       navigation.navigate("Trainer'sPricing");
                       updateSelectedDate('');
                    }}
                    >    
                    <Image
                      source={require('../../../../assets/pricing_section.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Pricing")}</Text>
                    </View>
                </MenuItemPressableImagedButton>
                <SeparatorView/>
                {/* <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("ManageMyProfile");
                        updateSelectedDate('');
                        }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="dumbbell" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >{t('Manage_My_Profile')}</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                
                </FullSizeButtonView> */}
                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() =>{
                       navigation.navigate("ManageMyProfile");
                       updateSelectedDate('');
                    }}
                    >    
                    <Image
                      source={require('../../../../assets/trainer_manage_my_profile_section.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Manage_My_Profile")}</Text>
                    </View>
                </MenuItemPressableImagedButton>
                <SeparatorView/>
                
            </AccountBackground>
        </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
  
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