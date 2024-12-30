import React, { useState,} from "react";

import {ScrollView} from "react-native";
import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  Title,
  MenuItemPressableButton,
  MenuItemPressableButtonText,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
  SeparatorView
} from "../components/account.styles";
import { useDate } from './DateContext'; // Import useDate from the context
const AccountIcon = (props) => (
  <AvatarIcon icon="account" color="white" size={36}/>
);

const ForwardIcon = (props) => (
  <AvatarIcon icon="arrow-forward-outline" color="#cfd8dc"/>
);

export const TrainerServicesScreen = ({ navigation }) => {
const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context


  return (
    <PageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <Title >Life</Title>
                </TitleView>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("BodyStatsAndMeasurements");
                        updateSelectedDate('');
                        }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="tape-measure" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Body Stats & Measurements</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("TargetStats");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="target-account" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Target Stats</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                    <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("Calculator");
                        updateSelectedDate('');
                    }}
                    >
                        <MenuItemPressableButtonAvatarAccount icon="calculator" size={32} color="#cfd8dc"/>
                        <MenuItemPressableButtonText >Calculator</MenuItemPressableButtonText>
                        <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                    </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("WorkoutPlan");
                        updateSelectedDate('');
                        }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="dumbbell" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Workout Plan</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("MealPlan");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="food-apple" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Meal Plan</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("Analysis");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="chart-bar" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Analysis</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                    <MenuItemPressableButton
                    onPress={() => {
                        navigation.navigate("CurrentPersonalTrainer");
                        updateSelectedDate('');
                    }}
                    >
                        <MenuItemPressableButtonAvatarAccount icon="human-male-board-poll" size={32} color="#cfd8dc"/>
                        <MenuItemPressableButtonText >Personal Trainer</MenuItemPressableButtonText>
                        <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                    </MenuItemPressableButton>
                </FullSizeButtonView>
                <SeparatorView/>
                <FullSizeButtonView>
                <MenuItemPressableButton
                    onPress={() => {
                    navigation.navigate("TrainerClients");
                    updateSelectedDate('');
                    }}
                    >
                    <MenuItemPressableButtonAvatarAccount icon="target-account" size={32} color="#cfd8dc"/>
                    <MenuItemPressableButtonText >Clients</MenuItemPressableButtonText>
                    <MenuItemPressableButtonAvatarChevronRight icon="chevron-right" size={32} color="white"/>
                </MenuItemPressableButton>
                </FullSizeButtonView>
            </AccountBackground>
        </ScrollView>
    </PageContainer>
  );
};