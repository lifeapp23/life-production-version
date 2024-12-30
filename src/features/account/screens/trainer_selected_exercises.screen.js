import React, { useState } from 'react';
import { View, ScrollView,Alert } from 'react-native';
import { SelectDayExercisesScreen } from "./select_day_exercises.screen";
import { FlatList } from 'react-native';
import { Spacer } from "../../../components/spacer/spacer.component";
import {
    Title,
    TitleView,
    PageContainer,
    ServicesPagesCardCover,
    ServicesPagesCardAvatarIcon,
    ServicesPagesCardHeader,
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FormElemeentSizeButtonParentView,
    FormElemeentSizeButtonView,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,

  
  } from "../components/account.styles";
import { useDispatch, useSelector } from 'react-redux';
import { addPlansEntry,removePlansEntry,editPlansEntry,addDayToPlanInRedux,deleteDayFromPlanInRedux,updateDayInRedux,removeExerciseFromDayInRedux} from './trainer_manage_workouts';
import { toggleTrainerSelectedWorkoutsDataSelection, clearTrainerSelectedWorkoutsData } from './trainer_selected_workouts_data';

export const TrainerSelectedExercisesScreen = ({navigation,route}) => {
  
  const { dayExercises, planIdRowCon } = route.params;
  const dispatch = useDispatch();
  const publicPlansDataArr = useSelector(state => state.publicPlansData.publicPlansData);
  const [isSelectDayExercisesVisible, setSelectDayExercisesVisible] = useState(false);
  const [isComeFromSelectedExercises , setIsComeFromSelectedExercises] = useState(false);
  const [currentDayExercises, setCurrentDayExercises] = useState(dayExercises)
  const trainerSelectedWorkoutsData = useSelector((state) => state.trainerSelectedWorkoutsData);
  const toggleSelection = (index) => {
    dispatch(toggleTrainerSelectedWorkoutsDataSelection(index));
  };
  const removeTrainerSelectedWorkoutsData = () => {
    let removedSets = 0;
    let removedExercises = 0;

    const selectedExercises = trainerSelectedWorkoutsData.slice(); // Copy the trainerSelectedWorkoutsData array

    selectedExercises.forEach((index) => {
      const removedExercise = currentDayExercises.selectedExerciseRows[index];

      if (removedExercise) {
        removedSets += parseInt(removedExercise.sets, 10);
        removedExercises += 1;
      }
    });

    const updatedTotalExpectedTime = (currentDayExercises.totalSets > 0) ? parseFloat(
      (((Math.max(0, parseInt(currentDayExercises.totalSets, 10) - removedSets)) * 25) / 60) + 2
    ).toFixed(2) : 0;

    // Check if all exercises are selected
    const allExercisesSelected = trainerSelectedWorkoutsData.length === currentDayExercises.selectedExerciseRows.length;

    // Conditionally show an alert
    if (allExercisesSelected) {
      Alert.alert(
        'Remove Exercises',
        'deleting all exercises will result in deleting the day. Are you sure you want to delete the day?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              // Proceed with removing exercises
              // Update the local state
              const updatedDay = {
                id: currentDayExercises.id,
                dayName: currentDayExercises.dayName,
                totalSets: Math.max(0, parseInt(currentDayExercises.totalSets, 10) - removedSets),
                totalExercises: Math.max(0, parseInt(currentDayExercises.totalExercises, 10) - removedExercises),
                totalExpectedTime: ((Math.max(0, parseInt(currentDayExercises.totalSets, 10) - removedSets)) == 0) ? (0) : updatedTotalExpectedTime,
                selectedExerciseRows: currentDayExercises.selectedExerciseRows.filter(
                  (_, index) => !selectedExercises.includes(index)
                ),
              };
              setCurrentDayExercises(updatedDay);

              // Dispatch an action to update the day in the Redux store
              dispatch(updateDayInRedux({ planId: planIdRowCon.id, updatedDay: updatedDay }));
              // Dispatch an action to delete the day from the Redux store
              dispatch(deleteDayFromPlanInRedux({planIdRowConId:planIdRowCon.id, viewId:currentDayExercises.id}));
              dispatch(clearTrainerSelectedWorkoutsData());
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // If not all exercises are selected, proceed with removing exercises
      // Update the local state
      const updatedDay = {
        id: currentDayExercises.id,
        dayName: currentDayExercises.dayName,
        totalSets: Math.max(0, parseInt(currentDayExercises.totalSets, 10) - removedSets),
        totalExercises: Math.max(0, parseInt(currentDayExercises.totalExercises, 10) - removedExercises),
        totalExpectedTime: ((Math.max(0, parseInt(currentDayExercises.totalSets, 10) - removedSets)) == 0) ? (0) : updatedTotalExpectedTime,
        selectedExerciseRows: currentDayExercises.selectedExerciseRows.filter(
          (_, index) => !selectedExercises.includes(index)
        ),
      };
      setCurrentDayExercises(updatedDay);

      // Dispatch an action to update the day in the Redux store
      dispatch(updateDayInRedux({ planId: planIdRowCon.id, updatedDay: updatedDay }));

      dispatch(clearTrainerSelectedWorkoutsData());
    }
  };
  
  
  const handleOpenSelectDayExercise = () => {
    setSelectDayExercisesVisible(true);
    setIsComeFromSelectedExercises(true);
  };

  const handleCloseSelectDayExercise = () => {
    setSelectDayExercisesVisible(false);
  };
   ////// update the current exercises and sets with new ones  Section
   const handleSelectGetExerAndSetsData = (updatedTotalSets, updatedTotalExercises,dayNameInput,selectedExerciseRows) => {
    // Calculate the updated values
    const updatedTotalSetsNew = parseInt(currentDayExercises.totalSets, 10) + parseInt(updatedTotalSets, 10);
    const updatedTotalExercisesNew = parseInt(currentDayExercises.totalExercises, 10) + parseInt(updatedTotalExercises, 10);
    const updatedTotalExpectedTime = parseFloat(((updatedTotalSets * 25) / 60) + 2).toFixed(2);

    const updatedDay = {
      id: currentDayExercises.id,
      dayName: currentDayExercises.dayName,
      totalSets: updatedTotalSetsNew,
      totalExercises: updatedTotalExercisesNew,
      totalExpectedTime: updatedTotalExpectedTime,
      selectedExerciseRows:  [...currentDayExercises.selectedExerciseRows, ...selectedExerciseRows],
    };
    setCurrentDayExercises(updatedDay);
    // Dispatch an action to update the day in the Redux store
    dispatch(updateDayInRedux({ planId: planIdRowCon.id, updatedDay: updatedDay }));

    // Close the modal or perform any other necessary actions
    handleCloseSelectDayExercise();
    
  };
  
  // if you deleted all the selected eercises the day will be deleted
  // useEffect(() => {
  //   if(currentDayExercises.totalExercises == '0'){
  //     dispatch(deleteDayFromPlanInRedux({planIdRowConId:planIdRowCon.id, viewId:currentDayExercises.id}));
  //     navigation.goBack();
  //   }
  // }, [currentDayExercises,planIdRowCon]);
  
  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{currentDayExercises.dayName}</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                  <FormElemeentSizeButtonView style={{width:"49%"}}>
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={handleOpenSelectDayExercise}>
                    <CalendarFullSizePressableButtonText >Add workout</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                  <FormElemeentSizeButtonView style={{width:"49%"}}> 
                    <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={removeTrainerSelectedWorkoutsData}
           >
                    <CalendarFullSizePressableButtonText >Remove</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                  </FormElemeentSizeButtonView>
                </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="small">
              <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                <FormElemeentSizeButtonView style={{width:"100%"}}> 
                      <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                        navigation.goBack();
                        dispatch(clearTrainerSelectedWorkoutsData());
                        }}
            >
                      <CalendarFullSizePressableButtonText >Back</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonView>
              </FormElemeentSizeButtonParentView>
            </Spacer>
            <Spacer size="large">
                <FlatList
                    data={currentDayExercises.selectedExerciseRows}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) =>
                    <View >
                      <ExerciseParentView >
                        <ExerciseImageView >
                            <ExerciseImageViewImage source={require('../../../../assets/gym-workout.png')}/>
                        </ExerciseImageView>
                        <ExerciseInfoParentView>
                            <View style={{flexDirection:'row'}}>
                                <ExerciseInfoTextHead style={{fontSize:16,marginRight:5}} >{item.workout.workoutName}</ExerciseInfoTextHead>
                                <CalendarFullSizePressableButton
                                style={{
                                  backgroundColor: 'white',
                                  width:20,
                                  height:20,
                                  border:1,
                                  borderColor:'black',
                                }} onPress={() => toggleSelection(index)}>
                                  <CalendarFullSizePressableButtonText style={{
                                    color: trainerSelectedWorkoutsData.includes(index) ? '#00FF00' : '#000',position:'absolute',top:-2,}}>{trainerSelectedWorkoutsData.includes(index) ? '✔' : ''}</CalendarFullSizePressableButtonText>
                                </CalendarFullSizePressableButton>
                            </View>
                            <ExerciseInfoTextTag style={{fontSize:14}} >{item.workout.majorMuscleGroupOne}</ExerciseInfoTextTag>
                            <ExerciseInfoTextTag style={{fontSize:14}} >{item.workout.majorMuscleGroupTwo}</ExerciseInfoTextTag>
                            <ExerciseInfoTextTag style={{fontSize:14}}>{item.workout.majorMuscleGroupThree }</ExerciseInfoTextTag>
                            <ExerciseInfoTextTag style={{fontSize:14}}>{item.sets }</ExerciseInfoTextTag>
                        </ExerciseInfoParentView>
                      </ExerciseParentView>
                    </View>
                    }
                />
            </Spacer> 
            <SelectDayExercisesScreen isVisible={isSelectDayExercisesVisible} onClose={handleCloseSelectDayExercise} onSelectGetExerAndSetsData={handleSelectGetExerAndSetsData} isComeFromSelectedExercises={isComeFromSelectedExercises}/>
            
  {/* Remove Exercise Button */}


            
        </ScrollView>
      </PageContainer>
  );

};

const styles = {
  WorkoutNametabContainer: {
    width:"100%",
    backgroundColor:"#455357"
  }, 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:"100%",
    height:780,
    backgroundColor:"#455357"
  },
};