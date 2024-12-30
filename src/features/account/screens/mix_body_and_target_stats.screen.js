import React, { useEffect, useState } from "react";
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
import { BodyStatsAndMeasurementsScreen } from "./body_stats_and_measurements.screen";
import { TargetStatsScreen } from "./target_stats.screen";
 


const { width } = Dimensions.get('window');
const FirstComponent = () => (
    <View style={styles.componentContainer}>
        <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>Loading...</Text>
    </View>
);

const SecondComponent = () => (
    <View style={styles.componentContainer}>
        <Text style={{color:'#000',fontSize:30,marginBottom:10,}}>Loading Two...</Text>
    </View>
);

export const MixBodyAndTargetStatsScreen = ({ navigation,route }) => {
  const [selectedComponent, setSelectedComponent] = useState('first');
  const {t} = useTranslation();//add this line

  const handleFirstImagePress = () => {
    setSelectedComponent('first');
  };

  const handleSecondImagePress = () => {
    setSelectedComponent('second');
  };

  return (
    <WhitePageContainer>
      <ScrollView contentContainerStyle={styles.scrollView}>
            <AccountBackground >
                <TitleView >
                    <BlackTitle >Life</BlackTitle>
                </TitleView> 
                    <View style={styles.holePageContainer}>

                        <View style={styles.RowTwoItemscontainerTwo}>
                            <View style={styles.viewContainer} >
                            <MenuItemPressableImagedButton
                            onPress={handleFirstImagePress}
                            >
                                
                                
                                <Image
                                source={require('../../../../assets/home_Body_Status_and_Measurements.jpg')} // Replace with your image URL
                                style={styles.image}
                                />
                                <View style={styles.overlay}>
                                    <Text style={styles.overlayText}>{t("Body_Stats_and_Measurements")}</Text>
                                </View>
                                
                            </MenuItemPressableImagedButton>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.viewContainer} >          
                            <MenuItemPressableImagedButton
                                    onPress={handleSecondImagePress}
                                >
                                    <Image
                                    source={require('../../../../assets/Target_Measurements.jpeg')} // Replace with your image URL
                                    style={styles.image}
                                    />
                                    <View style={styles.overlay}>
                                    <Text style={styles.overlayText}>{t("Target_Stats")}</Text>
                                    </View>
                            </MenuItemPressableImagedButton>
                            </View>
                        </View>
                            <View style={styles.componentContainer}>

                                {selectedComponent === 'first' && <BodyStatsAndMeasurementsScreen  style={{flex:1}}  navigation={navigation} route={route} />}
                                {selectedComponent === 'second' && <TargetStatsScreen  style={{flex:1}} navigation={navigation} route={route} />}
                            </View>
                    </View>
            </AccountBackground>
        </ScrollView>
    </WhitePageContainer>
  );
};

const styles = StyleSheet.create({
  holePageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  componentContainer: { 
    marginTop: 20,
    width: width,
    height:1250,
  },
  scrollView: {
    flexGrow: 1,
  },

  RowTwoItemscontainerTwo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    width: width / 2 - 20, // Half the screen width minus padding
    height: 150, // Adjust as needed
    marginBottom: 10,
    position: 'relative',
  },
 
  image: {
    width: '100%',
    height: '100%',
    borderRadius:30,

  },
  space: {
    width: 20, // Adjust the space between the images as needed
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: '5%', // Adjust as needed for spacing from the left edge
    borderRadius:30,

  },
  overlayText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    // width: '80%', // Ensures text stays within the left 30% of the image
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Dark shadow
    textShadowOffset: { width: -1, height: 1 }, // Shadow offset
    textShadowRadius: 10, // Shadow blur
  },
});