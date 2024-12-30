import React, { useEffect, useState,useContext } from "react";
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
import AuthGlobal from "../Context/store/AuthGlobal";

import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
import { DataHandlingPageScreen } from "./DataHandlingPageScreen.screen";
import { WorkoutSettingsScreen } from "./workout_settings.screen";
 


const { height, width } = Dimensions.get('window');


export const MixDataHandlingAndWorkoutSettingsScreen = ({ navigation,route }) => {
  const {t} = useTranslation();//add this line
  const context = useContext(AuthGlobal);
  const [selectedComponent, setSelectedComponent] = useState('first');
  const [topHeight, setTopHeight] = useState(300); // Height of the top section
  const [bottomHeight, setBottomHeight] = useState(1300); // Height of the selected page
  const [totalHeight, setTotalHeight] = useState(1600); // New state for total height

  const handleFirstImagePress = () => {
    setSelectedComponent('first');
  };

  const handleSecondImagePress = () => {
    setSelectedComponent('second');
  };
 // Capture layout height for the top section
 const onTopLayout = (event) => setTopHeight(event.nativeEvent.layout.height);

 // Capture layout height for the bottom section (selected component)
// Capture layout height for the bottom section (selected component)
const onBottomLayout = (event) => {
  //console.log('mixxx event',event);

  const { sentHeight } = event.nativeEvent.layout;
  //console.log('mixxx sentHeight',sentHeight);

  setBottomHeight(isNaN(sentHeight) ? 1700 : sentHeight); // Update bottomHeight based on the child component's layout
};
//console.log('mixxx topHeight ',topHeight );
//console.log('mixxx bottomHeight', bottomHeight);
// useEffect to update totalHeight whenever topHeight or bottomHeight changes
useEffect(() => {
  setTotalHeight(topHeight + bottomHeight+ 180);
  //console.log('mixxx topHeight + bottomHeight+ 180',topHeight + bottomHeight+ 180);

}, [topHeight, bottomHeight]); // Runs when either topHeight or bottomHeight changes

  return (
    <WhitePageContainer >
      <ScrollView contentContainerStyle={styles.scrollView}>
            <AccountBackground>
                <TitleView >
                    <BlackTitle >Life</BlackTitle>
                </TitleView> 
                <View style={[styles.holePageContainer, { minHeight: parseInt(totalHeight), }]}> 

{/* 
                    {
                      (Object.keys(context.stateUser.userPublicSettings).length > 0)?(
                      <DataHandlingPageScreen  style={{flex:1}}  navigation={navigation} route={route} />
                    ):(null)
                    } */}
                    <View style={styles.RowTwoItemscontainerTwo}  onLayout={onTopLayout}>
                    {
                      (Object.keys(context.stateUser.userPublicSettings).length > 0)?(
                        <>
                            <View style={styles.viewContainer} >
                              <MenuItemPressableImagedButton
                              onPress={handleFirstImagePress}
                              >
                                  
                                  
                                  <Image
                                  source={require('../../../../assets/Workout_Settings_two.jpeg')} // Replace with your image URL
                                  style={styles.image}
                                  />
                                  <View style={styles.overlay}>
                                      <Text style={styles.overlayText}>{t("Workout_Settings")}</Text>
                                  </View>
                                  
                              </MenuItemPressableImagedButton>
                            </View>
                            
                            <View style={styles.space} />
                            <View style={styles.viewContainer} >          
                                <MenuItemPressableImagedButton
                                        onPress={handleSecondImagePress}
                                    >
                                        <Image
                                        source={require('../../../../assets/home_App_Settings.png')} // Replace with your image URL
                                        style={styles.image}
                                        />
                                        <View style={styles.overlay}>
                                        <Text style={styles.overlayText}>{t("Data_Handling")}</Text>
                                        </View>
                                </MenuItemPressableImagedButton>
                            </View>
                            </>
                      ):(
                        <View style={styles.viewFullContainer} >

                                  
                                  
                                  <Image
                                  source={require('../../../../assets/Workout_Settings_two.jpeg')} // Replace with your image URL
                                  style={styles.image}
                                  />
                                  <View style={styles.overlay}>
                                      <Text style={styles.overlayText}>{t("Workout_Settings")}</Text>
                                  </View>
                                  
                            </View>

                      )}
                      </View>
                    <View style={[styles.componentContainer, { minHeight: parseInt(bottomHeight), }]}> 

                    {
                      (Object.keys(context.stateUser.userPublicSettings).length > 0)?(
                        <>
                        {selectedComponent === 'first' && <WorkoutSettingsScreen  style={{width: '100%'}}  navigation={navigation} route={route}  onLayout={onBottomLayout} />}
                        {selectedComponent === 'second' && <DataHandlingPageScreen  style={{width: '100%'}} navigation={navigation} route={route}  onLayout={onBottomLayout} />}
                        </>
                      ):(
                        <WorkoutSettingsScreen  style={{width: '100%'}}  navigation={navigation} route={route}  onLayout={onBottomLayout} />
                      )}
                  </View>

                </View>
            </AccountBackground>
        </ScrollView>
    </WhitePageContainer>
  );
};

const styles = StyleSheet.create({
  holePageContainer: {
    alignItems: 'center',

  },

  componentContainer: { 
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    

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
    overflow: 'hidden',
    position: 'relative',
  },
  viewFullContainer: {
    width: width - 20, // Half the screen width minus padding
    height: 225, // Adjust as needed
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