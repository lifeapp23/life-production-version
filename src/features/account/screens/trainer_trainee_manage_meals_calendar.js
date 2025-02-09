import React, { useState,useEffect } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { insertPublicWorkoutsPlans,fetchPublicWorkoutsPlans,fetchPublicWorkoutsPlansWithoutDeleting,SoftDeletePublicWorkoutsPlans,updatePublicWorkoutsPlans } from "../../../../database/public_workouts_plans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ViewOverlay,
 
} from "../components/account.styles";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";


export const TrainerTraineeManageMealsCalendarScreen = ({ isVisible, onClose, onDateSelect,TrainerTraineeCameData }) => {
  const [selectedDates, setSelectedDates] = useState({});
  const [userId,setUserId] = useState('');
  const [publicWorkoutsPlansTable,setPublicWorkoutsPlansTable] = useState([]);
  const [selectedDateNew, setSelectedDateNew] = useState(null);
  const [markedDatesAuto, setMarkedDatesAuto] = useState({});
  const [markedDatesAutoFixed, setMarkedDatesAutoFixed] = useState({});
  const [previousSelectedDate, setPreviousSelectedDate] = useState(null);
    useFocusEffect(
      React.useCallback(() => {
      AsyncStorage.getItem("sanctum_token")
      .then((res) => {
        //console.log('tokeeen:',res);
        
      AsyncStorage.getItem("currentUser").then((user) => {
    
          const storedUser = JSON.parse(user);
          
    
          
          const unsubscribe = addEventListener(state => {
            //console.log("Connection type--", state.type);
            //console.log("Is connected?---", state.isConnected);
            
          if(state.isConnected){
            //console.log('---------------now online--------')
            //console.log('my plans page',TrainerTraineeCameData);
  
  
            axios.get(`https://life-pf.com/api/get-trainer-trainee-meals-plans?traineeId=${TrainerTraineeCameData?.trneId}&trainerId=${TrainerTraineeCameData?.trnrId}`, {
            headers: {
              'Authorization': `Bearer ${res}`,
              'Content-Type': 'application/json',
            },
            })
            .then(response => {
              // Handle successful response
              //console.log('measurements::',response.data);
              setPublicWorkoutsPlansTable(response.data["getTraineePlans"]);
            })
            .catch(error => {
              // Handle error
              //console.log('Error fetching plans:', error);
            });
  
          }else{
            //console.log('else no internet ahmed');
           
                  
  
          }
  
          });
          
          // Unsubscribe
          unsubscribe();
        })
      });
     
    
    }, [])
    );
    // for (const plan of publicWorkoutsPlansTable) {
    //   //console.log('clandar plan',plan);
    //   const startDate = plan.stDate;
    //   const endDate = plan.edDate;
    //   //console.log('clandar startDate',startDate);
    //   //console.log('clandar endDate',endDate);
    //   let date = startDate;
    //   date?.getTime()
    // }
    const generateMarkedDates = () => {
      let marked = {};
    
      // Loop through each plan in publicWorkoutsPlansTable
      for (const plan of publicWorkoutsPlansTable) {
        const startDate = new Date(plan.strDat).getTime();
        const endDate = new Date(plan.endDat).getTime();
    
        // Loop through each day between start and end date
        for (let date = startDate; date <= endDate; date+= 60 * 60 * 24000) {
          const dateString = new Date(date).toISOString().split('T')[0];
          marked[dateString] = {
            startingDay: date === startDate,
            endingDay: date === endDate,
            color: '#3f7eb3',
            textColor: 'white',
            disabled: true,
            selected: true,
          };
        }
      }
    
      return marked;
    };
    
    useEffect(() => {
      const initialMarkedDates = generateMarkedDates();
      console.log('initialMarkedDates',initialMarkedDates);
      setMarkedDatesAuto(initialMarkedDates);
      setMarkedDatesAutoFixed(initialMarkedDates);

    }, [publicWorkoutsPlansTable]);

  // const handleDayPress = (day) => {
  //   const { dateString } = day;
  //   setSelectedDates((prev) => ({
  //     ...prev,
  //     [dateString]: {
  //       ...prev[dateString],
  //       selected: !prev[dateString]?.selected,
  //       selectedColor: '#3f7eb3',
  //       selectedTextColor: 'white',
  //     },
  //   }));
  // };
  const handleDayPress = (day) => {
    setSelectedDateNew(day.dateString);
    const newDate = day.dateString
    // Update the marked dates
    // setMarkedDatesAuto((prevMarkedDates) => ({
    //   ...prevMarkedDates,
    //   [newDate]: { selected: true, marked: true, selectedColor: '#3f7eb3',color: 'yellow',textColor: 'red', },
    // }));
    
    const newMarkedDatesAutoFixed = { ...markedDatesAutoFixed };

    const newMarkedDatesAuto = { ...markedDatesAuto };

    
    if (previousSelectedDate && newMarkedDatesAutoFixed[previousSelectedDate]) {
      newMarkedDatesAuto[previousSelectedDate] = { selected: true, disabled: true,marked: false,  color: '#3f7eb3', textColor: 'white' };

    }else if (previousSelectedDate && !newMarkedDatesAutoFixed[previousSelectedDate]) {
      delete newMarkedDatesAuto[previousSelectedDate];
    }

    newMarkedDatesAuto[newDate] = { selected: true, marked: true,  color: 'black', textColor: 'white' };

    setMarkedDatesAuto(newMarkedDatesAuto);
    setPreviousSelectedDate(newDate);
  };

  // const handleDonePress = () => {
  //   const selected = Object.keys(selectedDates).filter((date) => selectedDates[date].selected);
  //   if (selected.length >= 2) {
  //     const startDate = selected[0];
  //     const endDate = selected[selected.length - 1];
  //     onSelectDateRange(startDate, endDate);
  //   }

  //   // Reset selectedDates
  //   setSelectedDates({});
  //   onClose();
  // };
  const handleDonePress = () => {
    console.log('selectedDateNew',selectedDateNew);
    if (selectedDateNew?.length >= 1) {
      onDateSelect(selectedDateNew);
    }

    // Reset selectedDates
    setSelectedDateNew(null);
    setPreviousSelectedDate(null);
    setMarkedDatesAuto({ ...markedDatesAutoFixed });

    onClose();
  };
  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <ViewOverlay>
        <View style={styles.container}>
          <View style={styles.modalView}>
            <Calendar
              current={new Date().toISOString().split('T')[0]}
              markingType="period"
              markedDates={markedDatesAuto}
              onDayPress={handleDayPress}
              maxDate={'2100-12-31'}
              theme={{
            calendarBackground: 'white',
            dayTextColor: 'black',
            textDisabledColor: '#888',
            monthTextColor: 'black',
            textSectionTitleColor: 'black',
            textSectionTitleDisabledColor: '#888',
            selectedDayBackgroundColor: '#3f7eb3',
            selectedDayTextColor: '#fff',
            todayTextColor: '#3f7eb3',
            dotColor: '#fff',
            selectedDotColor: 'black',
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
          initialDate={new Date().toISOString().split('T')[0]}

            />
            <TouchableOpacity style={styles.doneButton} onPress={handleDonePress}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ViewOverlay>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalView: {
    borderRadius: 8,
    padding: 20,
    width:"100%", 
    alignSelf: 'center',
  },
  doneButton: {
    backgroundColor: '#000',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,

    borderRadius: 5,
    marginTop: 10,
  },
  doneText: {
    color: 'white',
    textAlign: 'center',
  },
});
