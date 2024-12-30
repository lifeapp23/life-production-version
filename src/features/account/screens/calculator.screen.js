import React, { useState} from "react";

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
  SeparatorView
} from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
import { Spacer } from "../../../components/spacer/spacer.component";

import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
const { width } = Dimensions.get('window');
    

const AccountIcon = (props) => (
  <AvatarIcon icon="account" color="white" size={36}/>
);

const ForwardIcon = (props) => (
  <AvatarIcon icon="arrow-forward-outline" color="#cfd8dc"/>
);

export const CalculatorScreen = ({ navigation }) => {
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const {t} = useTranslation();//add this line

  return (
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>

                <MenuItemPressableImagedButton
                    onPress={() =>{
                       navigation.navigate("BMI");
                       updateSelectedDate('');
                    }}
                    >    
                    <Image
                      source={require('../../../../assets/BMI_Calculator.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("BMI_Calculator")}</Text>
                    </View>
                </MenuItemPressableImagedButton>

                <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("BodyFatAndLbm");
                      updateSelectedDate('');
                    }}
                    >
                    <Image
                      source={require('../../../../assets/Body_Fat.jpeg')} // Replace with your image URL
                      style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("Body_Fat_LBM")}</Text>
                    </View>
                </MenuItemPressableImagedButton>

                <SeparatorView/>

                    <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => 
                    {
                      navigation.navigate("BMR");
                      updateSelectedDate('');
                    }}
                    >
                       <Image
                          source={require('../../../../assets/BMR_Calculator.jpeg')} // Replace with your image URL
                          style={styles.image}
                        />
                        <View style={styles.overlay}>
                          <Text style={styles.overlayText}>{t("BMR")}</Text>
                        </View>
                    </MenuItemPressableImagedButton>

                <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("TDEE");
                      updateSelectedDate('');
                    }}
                    >
                    <Image
                          source={require('../../../../assets/TDEE_Calculator.jpeg')} // Replace with your image URL
                          style={styles.image}
                    />
                    <View style={styles.overlay}>
                      <Text style={styles.overlayText}>{t("TDEE")}</Text>
                    </View>
                </MenuItemPressableImagedButton>

                <SeparatorView/>

                <MenuItemPressableImagedButton style={{marginTop:3}}
                    onPress={() => {
                      navigation.navigate("MacroCalculator");
                      updateSelectedDate('');
                    }}
                    >
                      <Image
                          source={require('../../../../assets/Macro_calculator.jpeg')} // Replace with your image URL
                          style={styles.image}
                        />
                        <View style={styles.overlay}>
                          <Text style={styles.overlayText}>{t("Macro_Calculator")}</Text>
                        </View>
                </MenuItemPressableImagedButton>
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