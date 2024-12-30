import React, { useEffect, useState, useCallback } from 'react';
import {  useFocusEffect } from '@react-navigation/native';

import { StyleSheet,ScrollView,View, Modal, Pressable,Alert,Text, Dimensions} from "react-native";
import { Spacer } from "../../../components/spacer/spacer.component";
import {
    Title,
    TitleView,
    PageContainer,
    FullSizeButtonView,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,

    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    MenuItemPressableButton,
    MenuItemPressableButtonAvatarAccount,
    MenuItemPressableButtonText,
    MenuItemPressableButtonAvatarChevronRight,
    InfoField,
    ServicesGymPageHeader

  
  } from "../components/account.styles";
  import { UpdateGymEquipments } from "../../../../database/gym_equipments_table";

  import "./i18n";
  import { useTranslation } from 'react-i18next';//add this line
     
  const { width } = Dimensions.get('window');

export const CustomPageScreen = ({ navigation,route }) => {
    const { gymArray } = route.params;
    ////console.log("gymArray custom page",gymArray);
    const {t} = useTranslation();//add this line

    const equipments = [
        // Your task data here
        { id: 1,
        DumbBells: true,
        KettleBells: true,
        EBarBell: true,
        EZBar: true,
        TrapsBar: false,},
        { id: 2,
        DumbBells: true,
        KettleBells: false,
        EBarBell: true,
        EZBar: false,
        TrapsBar: true }
    ];
    const equipment = gymArray;
    //console.log('equipment---',equipment);
    ////console.log('"equipment?.DumbBells"---',typeof (equipment?.DumbBells));
    ////console.log('equipment?.DumbBells---',typeof JSON.parse(equipment?.DumbBells));
    const [buttonStates, setButtonStates] = useState({
        id:equipment.id,
        userId:equipment.userId,
        GymName:equipment.GymName,
        speKey:equipment.speKey,
        DumbBells: (!equipment)?(false):(equipment?.DumbBells !== undefined? JSON.parse(equipment?.DumbBells) : false),
        KettleBells: (!equipment)?(false):(equipment?.KettleBells !== undefined? JSON.parse(equipment?.KettleBells) : false),
        EBarBell: (!equipment)?(false):(equipment?.EBarBell !== undefined? JSON.parse(equipment?.EBarBell) : false),
        EZBar: (!equipment)?(false):(equipment?.EZBar !== undefined? JSON.parse(equipment?.EZBar) : false),
        TrapsBar: (!equipment)?(false):(equipment?.TrapsBar !== undefined? JSON.parse(equipment?.TrapsBar) : false),
        ResistanceBand: (!equipment)?(false):(equipment?.ResistanceBand !== undefined? JSON.parse(equipment?.ResistanceBand) : false),
        SandBag: (!equipment)?(false):(equipment?.SandBag !== undefined? JSON.parse(equipment?.SandBag) : false),
        WeightedBelts: (!equipment)?(false):(equipment?.WeightedBelts !== undefined? JSON.parse(equipment?.WeightedBelts) : false),
        AbWheel: (!equipment)?(false):(equipment?.AbWheel !== undefined? JSON.parse(equipment?.AbWheel) : false),
        Sled: (!equipment)?(false):(equipment?.Sled !== undefined? JSON.parse(equipment?.Sled) : false),
        ExerciesBall: (!equipment)?(false):(equipment?.ExerciesBall !== undefined? JSON.parse(equipment?.ExerciesBall) : false),
        Bosuball: (!equipment)?(false):(equipment?.Bosuball !== undefined? JSON.parse(equipment?.Bosuball) : false),
        JumpingRope: (!equipment)?(false):(equipment?.JumpingRope !== undefined? JSON.parse(equipment?.JumpingRope) : false),
        BattleRope: (!equipment)?(false):(equipment?.BattleRope !== undefined? JSON.parse(equipment?.BattleRope) : false),
        Rings: (!equipment)?(false):(equipment?.Rings !== undefined? JSON.parse(equipment?.Rings) : false),
        RopeClimbing: (!equipment)?(false):(equipment?.RopeClimbing !== undefined? JSON.parse(equipment?.RopeClimbing) : false),
        JumpBox: (!equipment)?(false):(equipment?.JumpBox !== undefined? JSON.parse(equipment?.JumpBox) : false),
        Parallettes:(!equipment)?(false):(equipment?.Parallettes !== undefined? JSON.parse(equipment?.Parallettes) : false),
        Tires: (!equipment)?(false):(equipment?.Tires !== undefined? JSON.parse(equipment?.Tires) : false),
        AdjBench: (!equipment)?(false):(equipment?.AdjBench !== undefined? JSON.parse(equipment?.AdjBench) : false),
        FlatBench: (!equipment)?(false):(equipment?.FlatBench !== undefined? JSON.parse(equipment?.FlatBench) : false),
        DeclineBench: (!equipment)?(false):(equipment?.DeclineBench !== undefined? JSON.parse(equipment?.DeclineBench) : false),
        BenchPressRack: (!equipment)?(false):(equipment?.BenchPressRack !== undefined? JSON.parse(equipment?.BenchPressRack) : false),
        IncBenchPres: (!equipment)?(false):(equipment?.IncBenchPres !== undefined? JSON.parse(equipment?.IncBenchPres) : false),
        DeclineBenchR: (!equipment)?(false):(equipment?.DeclineBenchR !== undefined? JSON.parse(equipment?.DeclineBenchR) : false),
        SquatRack: (!equipment)?(false):(equipment?.SquatRack !== undefined? JSON.parse(equipment?.SquatRack) : false),
        PreacherBen: (!equipment)?(false):(equipment?.PreacherBen !== undefined? JSON.parse(equipment?.PreacherBen) : false),
        SwimmingPool: (!equipment)?(false):(equipment?.SwimmingPool !== undefined? JSON.parse(equipment?.SwimmingPool) : false),
        Squash: (!equipment)?(false):(equipment?.Squash !== undefined? JSON.parse(equipment?.Squash) : false),
        Tennis: (!equipment)?(false):(equipment?.Tennis !== undefined? JSON.parse(equipment?.Tennis) : false),
        RunningTrack: (!equipment)?(false):(equipment?.RunningTrack !== undefined? JSON.parse(equipment?.RunningTrack) : false),
        PingPong: (!equipment)?(false):(equipment?.PingPong !== undefined? JSON.parse(equipment?.PingPong) : false),
        MaritalArts: (!equipment)?(false):(equipment?.MaritalArts !== undefined? JSON.parse(equipment?.MaritalArts) : false),
        Elliptical: (!equipment)?(false):(equipment?.Elliptical !== undefined? JSON.parse(equipment?.Elliptical) : false),
        TreadMil: (!equipment)?(false):(equipment?.TreadMil !== undefined? JSON.parse(equipment?.TreadMil) : false),
        ExerciseBike: (!equipment)?(false):(equipment?.ExerciseBike !== undefined? JSON.parse(equipment?.ExerciseBike) : false),
        RowingMach: (!equipment)?(false):(equipment?.RowingMach !== undefined? JSON.parse(equipment?.RowingMach) : false),
        AssaultAirBike: (!equipment)?(false):(equipment?.AssaultAirBike !== undefined? JSON.parse(equipment?.AssaultAirBike) : false),
        AssaultRunner: (!equipment)?(false):(equipment?.AssaultRunner !== undefined? JSON.parse(equipment?.AssaultRunner) : false),
        StairMaster: (!equipment)?(false):(equipment?.StairMaster !== undefined? JSON.parse(equipment?.StairMaster) : false),
        Butterfly: (!equipment)?(false):(equipment?.Butterfly !== undefined? JSON.parse(equipment?.Butterfly) : false),
        ReverseButterfly: (!equipment)?(false):(equipment.ReverseButterfly !== undefined? JSON.parse(equipment.ReverseButterfly) : false),
        LegExtension: (!equipment)?(false):(equipment?.LegExtension !== undefined? JSON.parse(equipment?.LegExtension) : false),
        LegCurl: (!equipment)?(false):(equipment?.LegCurl !== undefined? JSON.parse(equipment?.LegCurl) : false),
        LegPress: (!equipment)?(false):(equipment?.LegPress !== undefined? JSON.parse(equipment?.LegPress) : false),
        ChestPress: (!equipment)?(false):(equipment?.ChestPress !== undefined? JSON.parse(equipment?.ChestPress) : false),
        SmithMachine: (!equipment)?(false):(equipment?.SmithMachine !== undefined? JSON.parse(equipment?.SmithMachine) : false),
        LatPulldowns: (!equipment)?(false):(equipment?.LatPulldowns !== undefined? JSON.parse(equipment.LatPulldowns) : false),
        CrossOverMac: (!equipment)?(false):(equipment?.CrossOverMac !== undefined? JSON.parse(equipment.CrossOverMac) : false),
        CableMachine: (!equipment)?(false):(equipment?.CableMachine !== undefined? JSON.parse(equipment.CableMachine) : false),
        BicepMachine: (!equipment)?(false):(equipment?.BicepMachine !== undefined? JSON.parse(equipment?.BicepMachine) : false),
        TircepMachine: (!equipment)?(false):(equipment?.TircepMachine !== undefined? JSON.parse(equipment?.TircepMachine) : false),
        CalvesMachine: (!equipment)?(false):(equipment?.CalvesMachine !== undefined? JSON.parse(equipment?.CalvesMachine) : false),
        AbsMachine: (!equipment)?(false):(equipment?.AbsMachine !== undefined? JSON.parse(equipment?.AbsMachine) : false),
        // Add more equipment buttons here with their initial states
        isSync:"no",
        deleted:"no",
      });
      const handlePress = (equipmentNew) => {
        setButtonStates({
          ...buttonStates,
          [equipmentNew]: !buttonStates[equipmentNew],
        });
      };
    //console.log('Gym buttonStates',buttonStates);

    const [isPressed, setIsPressed] = useState(false);

    const handleSaveButtonPress = () => {
        UpdateGymEquipments(buttonStates).then((gymEquipmentsTableResults) => {
            ////console.log('Gym equipments updated succcesss',gymEquipmentsTableResults);
            Alert.alert(``,
                `${t('Your_Gym_equipments_updated_successfully')}`,
                [
                    {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('GymFacilities');
                    },
                    },
                ],
                { cancelable: false }
                );
        });// Toggle the state
    };
  ////console.log('buttonStates--->',buttonStates);
  
  
  useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e) => {
        if (hasUnsavedChanges(buttonStates, equipment)) {
          e.preventDefault();
  
          Alert.alert(
            '',
            `${t("Are_you_sure_you_want_to_exit_without_saving")}`,
            [
              { text: 'Cancel', style: 'cancel', onPress: () => {} },
              {
                text: 'Discard',
                style: 'destructive',
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
        }
      };
  
      navigation.addListener('beforeRemove', onBeforeRemove);
  
      return () => {
        navigation.removeListener('beforeRemove', onBeforeRemove);
      };
    }, [navigation, buttonStates])
  );
  
  
  const hasUnsavedChanges = (currentStates, initialStates) => {
    const normalizedCurrent = normalizeButtonStates(currentStates);
    const normalizedInitial = normalizeButtonStates(initialStates);
  
    //console.log('normalizedCurrent--->', normalizedCurrent);
    //console.log('normalizedInitial--->', normalizedInitial);
  
    return JSON.stringify(normalizedCurrent) !== JSON.stringify(normalizedInitial);
  };
  const normalizeButtonStates = (buttonStates) => {
    const normalizedStates = {};
    for (const key in buttonStates) {
      normalizedStates[key] = Number(buttonStates[key]);
    }
    return normalizedStates;
  };
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{(equipment?.GymName !== undefined) ? equipment?.GymName : "New Gym"}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <View>
            <Spacer size="medium">
                <View style={{marginLeft:10,marginTop:15, marginBottom:5}}>
                    <ServicesGymPageHeader>{t("Free_and_Body_Weight")}</ServicesGymPageHeader>
                </View>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.KettleBells ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('KettleBells')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.KettleBells ? 'white' : '#455357' },]}>Kettle Bells</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.EBarBell ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('EBarBell')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.EBarBell ? 'white' : '#455357' },]}>EBar Bell</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.DumbBells ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('DumbBells')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.DumbBells ? 'white' : '#455357' },]}>DumbBells</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.TrapsBar ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('TrapsBar')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.TrapsBar ? 'white' : '#455357' },]}>Traps Bar</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.EZBar ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('EZBar')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.EZBar ? 'white' : '#455357' },]}>EZ Bar</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.SandBag ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('SandBag')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.SandBag ? 'white' : '#455357' },]}>Sand Bag</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.WeightedBelts ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('WeightedBelts')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.WeightedBelts ? 'white' : '#455357' },]}>Weighted Belts</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.AbWheel ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('AbWheel')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.AbWheel ? 'white' : '#455357' },]}>Ab Wheel</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Sled ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Sled')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Sled ? 'white' : '#455357' },]}>Sled</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.ExerciesBall ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('ExerciesBall')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.ExerciesBall ? 'white' : '#455357' },]}>Exercies Ball</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Bosuball ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Bosuball')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Bosuball ? 'white' : '#455357' },]}>Bosu Ball</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.BattleRope ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('BattleRope')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.BattleRope ? 'white' : '#455357' },]}>Battle Rope</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Rings ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Rings')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Rings ? 'white' : '#455357' },]}>Rings</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.RopeClimbing ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('RopeClimbing')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.RopeClimbing ? 'white' : '#455357' },]}>Rope Climbing</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.JumpBox ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('JumpBox')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.JumpBox ? 'white' : '#455357' },]}>Jump Box</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Tires ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Tires')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Tires ? 'white' : '#455357' },]}>Tires</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Parallettes ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Parallettes')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Parallettes ? 'white' : '#455357' },]}>Parallettes</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.JumpingRope ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('JumpingRope')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.JumpingRope ? 'white' : '#455357' },]}>Jumping Rope</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                    <FormElemeentSizeButtonView>
                        <Pressable
                            style={[
                            styles.button,
                            { backgroundColor: buttonStates.ResistanceBand ? 'green' : '#cfd8dc' },
                            ]}
                            onPress={() => handlePress('ResistanceBand')}
                        >
                            <Text style={[styles.buttonText,{ color: buttonStates.ResistanceBand ? 'white' : '#455357' },]}>Resistance Band</Text>
                        </Pressable>
                    </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <View style={{marginLeft:10,marginTop:15, marginBottom:5}}>
                    <ServicesGymPageHeader>{t("Benches_and_Racks")}</ServicesGymPageHeader>
                </View>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.AdjBench ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('AdjBench')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.AdjBench ? 'white' : '#455357' },]}>Adj Bench</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.FlatBench ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('FlatBench')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.FlatBench ? 'white' : '#455357' },]}>Flat Bench</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.DeclineBench ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('DeclineBench')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.DeclineBench ? 'white' : '#455357' },]}>Decline Bench</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.BenchPressRack ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('BenchPressRack')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.BenchPressRack ? 'white' : '#455357' },]}>Bench Press Rack</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.IncBenchPres ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('IncBenchPres')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.IncBenchPres ? 'white' : '#455357' },]}>Inc Bench Pres</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.DeclineBenchR ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('DeclineBenchR')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.DeclineBenchR ? 'white' : '#455357' },]}>Decline Bench R</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.SquatRack ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('SquatRack')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.SquatRack ? 'white' : '#455357' },]}>Squat Rack</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.PreacherBen ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('PreacherBen')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.PreacherBen ? 'white' : '#455357' },]}>Preacher Ben</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            </View>
            <View>
            <Spacer size="medium">
                <View style={{marginLeft:10,marginTop:15, marginBottom:5}}>
                    <ServicesGymPageHeader>{t("Cardio_Facilities")}</ServicesGymPageHeader>
                </View>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.SwimmingPool ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('SwimmingPool')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.SwimmingPool ? 'white' : '#455357' },]}>Swimming Pool</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Squash ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Squash')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Squash ? 'white' : '#455357' },]}>Squash</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Tennis ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Tennis')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Tennis ? 'white' : '#455357' },]}>Tennis</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.RunningTrack ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('RunningTrack')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.RunningTrack ? 'white' : '#455357' },]}>RunningTrack</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.PingPong ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('PingPong')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.PingPong ? 'white' : '#455357' },]}>Ping Pong</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.MaritalArts ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('MaritalArts')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.MaritalArts ? 'white' : '#455357' },]}>Marital Arts</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.Elliptical ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('Elliptical')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.Elliptical ? 'white' : '#455357' },]}>Elliptical</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.TreadMil ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('TreadMil')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.TreadMil ? 'white' : '#455357' },]}>Tread Mil</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.ExerciseBike ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('ExerciseBike')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.ExerciseBike ? 'white' : '#455357' },]}>Exercise Bike</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.RowingMach ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('RowingMach')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.RowingMach ? 'white' : '#455357' },]}>Rowing Mach</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.AssaultAirBike ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('AssaultAirBike')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.AssaultAirBike ? 'white' : '#455357' },]}>Assault Air Bike</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.AssaultRunner ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('AssaultRunner')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.AssaultRunner ? 'white' : '#455357' },]}>Assault Runner</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.StairMaster ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('StairMaster')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.StairMaster ? 'white' : '#455357' },]}>Stair Master</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
               
                </FormElemeentSizeButtonParentView>
            </Spacer>

            </View>
      <View>
            <Spacer size="medium">
                <View style={{marginLeft:10,marginTop:15, marginBottom:5}}>
                    <ServicesGymPageHeader>{t("Machines")}</ServicesGymPageHeader>
                </View>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                    <FormElemeentSizeButtonView>
                        <Pressable
                            style={[
                            styles.button,
                            { backgroundColor: buttonStates.Butterfly ? 'green' : '#cfd8dc' },
                            ]}
                            onPress={() => handlePress('Butterfly')}
                        >
                            <Text style={[styles.buttonText,{ color: buttonStates.Butterfly ? 'white' : '#455357' },]}>Butterfly</Text>
                        </Pressable>
                    </FormElemeentSizeButtonView>
                    <FormElemeentSizeButtonView>
                        <Pressable
                            style={[
                            styles.button,
                            { backgroundColor: buttonStates.ReverseButterfly ? 'green' : '#cfd8dc' },
                            ]}
                            onPress={() => handlePress('ReverseButterfly')}
                        >
                            <Text style={[styles.buttonText,{ color: buttonStates.ReverseButterfly ? 'white' : '#455357' },]}>Reverse Butterfly</Text>
                        </Pressable>
                    </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.LegCurl ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('LegCurl')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.LegCurl ? 'white' : '#455357' },]}>Leg Curl</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.LegPress ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('LegPress')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.LegPress ? 'white' : '#455357' },]}>Leg Press</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                    <Pressable
                        style={[
                        styles.button,
                        { backgroundColor: buttonStates.LegExtension ? 'green' : '#cfd8dc' },
                        ]}
                        onPress={() => handlePress('LegExtension')}
                    >
                        <Text style={[styles.buttonText,{ color: buttonStates.LegExtension ? 'white' : '#455357' },]}>Leg Extension</Text>
                    </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.SmithMachine ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('SmithMachine')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.SmithMachine ? 'white' : '#455357' },]}>Smith Machine</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.LatPulldowns ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('LatPulldowns')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.LatPulldowns ? 'white' : '#455357' },]}>Lat Pulldowns</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.CrossOverMac ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('CrossOverMac')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.CrossOverMac ? 'white' : '#455357' },]}>Cross Over Mac</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.CableMachine ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('CableMachine')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.CableMachine ? 'white' : '#455357' },]}>Cable Machine</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.BicepMachine ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('BicepMachine')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.BicepMachine ? 'white' : '#455357' },]}>Bicep Machine</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.TircepMachine ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('TircepMachine')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.TircepMachine ? 'white' : '#455357' },]}>Tircep Machine</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                <Pressable
                    style={[
                    styles.button,
                    { backgroundColor: buttonStates.CalvesMachine ? 'green' : '#cfd8dc' },
                    ]}
                    onPress={() => handlePress('CalvesMachine')}
                >
                    <Text style={[styles.buttonText,{ color: buttonStates.CalvesMachine ? 'white' : '#455357' },]}>Calves Machine</Text>
                </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView>
                <FormElemeentSizeButtonView>
                    <Pressable
                        style={[
                        styles.button,
                        { backgroundColor: buttonStates.ChestPress ? 'green' : '#cfd8dc' },
                        ]}
                        onPress={() => handlePress('ChestPress')}
                    >
                        <Text style={[styles.buttonText,{ color: buttonStates.ChestPress ? 'white' : '#455357' },]}>Chest Press</Text>
                    </Pressable>
                </FormElemeentSizeButtonView>
                <FormElemeentSizeButtonView>
                    <Pressable
                        style={[
                        styles.button,
                        { backgroundColor: buttonStates.AbsMachine ? 'green' : '#cfd8dc' },
                        ]}
                        onPress={() => handlePress('AbsMachine')}
                    >
                        <Text style={[styles.buttonText,{ color: buttonStates.AbsMachine ? 'white' : '#455357' },]}>Abs Machine</Text>
                    </Pressable>
                </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="small">
                <CalendarFullSizePressableButton  style={{backgroundColor:'#000',width:width-20,marginRight:10,marginLeft:10,marginTop:10,marginBottom:20}}
                    onPress={() => handleSaveButtonPress()}>
                    <CalendarFullSizePressableButtonText >{t('Save')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </Spacer>
            </View>
     
        </ScrollView>
    </PageContainer>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      backgroundColor:"#cfd8dc",
      borderRadius:6,
    },
    buttonPressed: {
      backgroundColor: 'green', // Background color when pressed
    },
    buttonText: {
        color:"black",
        fontSize: 15,
        textAlign: 'center',
        fontFamily:"OpenSans_400Regular",
        color:"#9da6a9",
    },
  });