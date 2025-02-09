import React, { useState, useMemo,useEffect } from 'react';
import {SafeAreaView,ScrollView, Modal, StyleSheet, View, Dimensions} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { DataTable} from 'react-native-paper';
import axios from 'axios';

import { useDate } from './DateContext'; // Import useDate from the context
import { DataTableTitleKey, 
  DataTableTitleValue,
  DataTableCellKey, 
  DataTableCellValue,
  DataTableTitleKeyText,
  DataTableTitleValueText,
  DataTableCellKeyText,
  DataTableCellValueText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  DataTableDateTextView,
  DataTableDateText,
 

} from "../components/account.styles";
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

import { StartExercisesWithTimerFromCalendarScreen } from "./start_exer_with_timer_from_calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Spacer } from "../../../components/spacer/spacer.component";
import { fetchAlltDaysStartWorkouts} from "../../../../database/start_workout_db";
export const WorkedExercisesCalendarScreen = ({navigation,onAddEntry,publicPlansDataTableItemDayCon,TrainerTraineeSent}) => {
  ////console.log('publicPlansDataTableItemDayCon',publicPlansDataTableItemDayCon);
  const initDate = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(initDate);
  const [visible, setVisible] = React.useState(false);
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [passNewDate, setPassNewDate] = useState('');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  // const tasks = [
  //   {
  //     id: 1,
  //     date: '2023-12-06',
  //     setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}
  //   },
  //   {
  //     id: 2,
  //     date: '2023-12-07',
  //     setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

  //   },
  //   {
  //     id: 3,
  //     date: '2023-12-08',
  //     setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

  //   },
  //   {
  //     id: 4,
  //     date: '2023-12-09',
  //     setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

  //   },
   
  //  ];
  const [allUserWorkedWorkoutsFromDB,setAllUserWorkedWorkoutsFromDB] =useState([]);
  useEffect(() => {
    const fetchData = async () => {
    
        const token = await AsyncStorage.getItem("sanctum_token");
        const user = await AsyncStorage.getItem("currentUser");
        const storedUser = JSON.parse(user);
  
        // Fetch online data
        const onlineDataResponse = await axios.get(
          "https://life-pf.com/api/fetch-all-performed-workouts",
          {
            params: {
              traineeId: TrainerTraineeSent?.trneId,
              trainerId: TrainerTraineeSent?.trnrId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
  
        const onlineDataTrainerUser =
          onlineDataResponse?.data?.allPerformedWorkoutRows || [];
  
        // console.log(
        //   "Fetched online data:",
        //   onlineDataTrainerUser
        // );
  
        // Fetch offline data
        const offlineDataNormalUser = await fetchAlltDaysStartWorkouts(
          storedUser.id
        );
  
        // console.log(
        //   "Fetched offline data:",
        //   offlineDataNormalUser
        // );
        if (TrainerTraineeSent) {

         
          const today = new Date();

          // Safely check if `data` exists and has `strDat` and `endDat`
          if (TrainerTraineeSent?.strDat && TrainerTraineeSent?.endDat) {
            const strDat = new Date(TrainerTraineeSent?.strDat);
            const endDat = new Date(TrainerTraineeSent?.endDat);

            // Check if today is between `strDat` and `endDat`
            if (today >= strDat && today <= endDat) {
              setAllUserWorkedWorkoutsFromDB([
                ...(onlineDataTrainerUser || []),
                ...(offlineDataNormalUser || []),
              ]);
            } else {
              setAllUserWorkedWorkoutsFromDB([...offlineDataNormalUser || []]);
            }
          } else {
            setAllUserWorkedWorkoutsFromDB([...offlineDataNormalUser || []]);
          }

        } else {
          setAllUserWorkedWorkoutsFromDB([...offlineDataNormalUser || []]);
        }
       
      
    };
  
    fetchData();
  }, [TrainerTraineeSent, fetchAlltDaysStartWorkouts]);
  
  // Log the updated state
  useEffect(() => {
    // console.log("allUserWorkedWorkoutsFromDB updated:", allUserWorkedWorkoutsFromDB);
  }, [allUserWorkedWorkoutsFromDB]);
  

  const marked = useMemo(() => ({
    
    [selected]: {
      selected: true,
      selectedColor: '#3f7eb3',
      selectedTextColor: '#fff',
    },
  }), [selected]);

  for(let i = 0; i < allUserWorkedWorkoutsFromDB.length; i++) { 
    marked[allUserWorkedWorkoutsFromDB[i].date] = { marked: true };
  };
  
  const { t, i18n } = useTranslation();

  //const task = tasks.find((t) => t.date === passNewDate.toLocaleString());
  const containerStyle = {width:"100%",height:"100%",flex:1};
  

  return (
    <View style={styles.container}>
    <SafeAreaView >
    <View>
      <Calendar
        theme={{
          calendarBackground: '#fff',
          dayTextColor: '#000',
          textDisabledColor: '#888',
          monthTextColor: '#000',
          textSectionTitleColor: '#000',
          textSectionTitleDisabledColor: '#888',
          selectedDayBackgroundColor: '#3f7eb3',
          selectedDayTextColor: '#fff',
          todayTextColor: '#3f7eb3',
          dotColor: '#3f7eb3',
          selectedDotColor: '#fff',
          arrowColor: '#3f7eb3',
          disabledArrowColor: '#888',
          indicatorColor: '#3f7eb3',
          textDayFontFamily: 'OpenSans_400Regular',
          textMonthFontFamily: 'OpenSans_400Regular',
          textDayHeaderFontFamily: 'OpenSans_400Regular',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        initialDate={initDate}
        markedDates={marked}
        disableAllTouchEventsForDisabledDays={true}
        onDayPress={(day) => {
          setPassNewDate(day.dateString);
          showModal();
        }}
      />
      <Spacer size="large">
        <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
          onPress={() => onAddEntry()}>
          <CalendarFullSizePressableButtonText >{t('Hide_Calendar')}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </Spacer>
      </View>
    </SafeAreaView>
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setVisible(!visible);
        }}>
        <View style={styles.centeredViewSon}>
          
          <View style={styles.modalView}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

              <StartExercisesWithTimerFromCalendarScreen hideModal={hideModal} passNewDate={passNewDate} publicPlansDataTableItemDayCon={publicPlansDataTableItemDayCon} allUserWorkedWorkoutsFromDB={allUserWorkedWorkoutsFromDB} TrainerTraineeSent={TrainerTraineeSent}/>
            </ScrollView>

          </View>
          
        </View>
      </Modal>
    </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor:"#fff"
  },
  centeredView: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:"100%",
    
  },
  centeredViewSon: {
    
    width:"100%",
    flex: 1,
   },
  modalView: {
    backgroundColor: '#fff',
    width:"100%",
    
    borderRadius: 0,
    flex: 1,
    
  },
});