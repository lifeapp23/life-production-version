import React, { useState, useMemo,useEffect } from 'react';
import {SafeAreaView,ScrollView, Modal, StyleSheet, View,Text, Dimensions} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { DataTable} from 'react-native-paper';
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
  ResultsParentView,
  ResultsHalfRowView,
  ResultsHalfRowLabelView,
  ResultsHalfRowResultPlaceView,
  ResultsHalfRowResultPlaceViewText,
  FormLabel,

} from "../components/account.styles";
import { TrainerTraineeStartExercisesWithTimerFromCalendarScreen } from "./trainer_trainee_start_exer_with_timer_from_calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Spacer } from "../../../components/spacer/spacer.component";
import { fetchAlltDaysStartWorkouts} from "../../../../database/start_workout_db";
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
const { width } = Dimensions.get('window');

import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';

export const TrainerTraineeMealsPlansCalendarScreen = ({onAddEntry,publicWorkoutsPlanRowCon,allUserWorkedMealsFromDB}) => {
  //console.log('publicWorkoutsPlanRowCon',publicWorkoutsPlanRowCon);
  //console.log('allUserWorkedMealsFromDB calendar',allUserWorkedMealsFromDB);

  const initDate = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(initDate);
  const [visible, setVisible] = React.useState(false);
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [passNewDate, setPassNewDate] = useState('');
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [dayNameAddEntry, setDayNameAddEntry] = useState("");  
  const [parsedMalAry, setParsedMalAry] = useState([]);  
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0); 

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const tasks = [
    {
      id: 1,
      date: '2023-12-06',
      setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}
    },
    {
      id: 2,
      date: '2023-12-07',
      setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

    },
    {
      id: 3,
      date: '2023-12-08',
      setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

    },
    {
      id: 4,
      date: '2023-12-09',
      setsArray:{"1": [{"isCompleted": true, "reps": "5", "sets": 1, "timerStarted": true, "weight": "5"}, {"isCompleted": true, "reps": "5", "sets": 2, "timerStarted": true, "weight": "5"}], "2": [{"isCompleted": true, "reps": "2", "sets": 1, "timerStarted": true, "weight": "2"}, {"isCompleted": true, "reps": "4", "sets": 2, "timerStarted": true, "weight": "4"}]}

    },
   
   ];
   //console.log('passNewDate out',passNewDate);

  function filterByDate(array, passNewDate) {
    ////console.log('array?.filter(item => item?.todDay === passNewDate)',array?.filter(item => item?.todDay === passNewDate));
    if(passNewDate){
      return array?.filter(item => item?.todDay === passNewDate);

    }
    }

    function processTrainerPlanMealCalendar(data) {
      const result = [];
  
      data.forEach(item => {
          // Extract the necessary keys
          const { planId, todDay, trneId, trnrId, dayNam, id, malAry } = item;
  
          // Parse malAry
          let mealsArray = [];
          try {
              mealsArray = JSON.parse(malAry);
          } catch (error) {
              console.error('Error parsing malAry:', error);
              return; // Skip this item if malAry parsing fails
          }
  
          // Add additional keys to each meal
          mealsArray = mealsArray.map(meal => ({
              ...meal,
              planId,
              todDay,
              trneId,
              trnrId,
              dayNam,
              id
          }));
  
          // Add the processed meals to the result
          result.push(...mealsArray);
      });
  
      return result;
  } 

  const marked = useMemo(() => ({
    
    [selected]: {
      selected: true,
      selectedColor: '#3f7eb3',
      selectedTextColor: 'white',
    },
  }), [selected]);

  for(let i = 0; i < allUserWorkedMealsFromDB?.length; i++) { 
    marked[allUserWorkedMealsFromDB?.[i]?.todDay] = { marked: true };
  };
  
  
  //const task = tasks.find((t) => t.date === passNewDate.toLocaleString());
  // const containerStyle = {width:"100%",height:"100%",flex:1};
 
  

  
const updateTotalValues = () => {
  // Initialize totals based on existing data
  const initialTotalCalories = parsedMalAry?.reduce((total, meal) => total + (parseFloat((meal?.calris)) || 0), 0);
  const initialTotalProtein = parsedMalAry?.reduce((total, meal) => total + (parseFloat((meal?.protin)) || 0), 0);
  const initialTotalCarbs = parsedMalAry?.reduce((total, meal) => total + (parseFloat((meal?.carbs)) || 0), 0);
  const initialTotalFats = parsedMalAry?.reduce((total, meal) => total + (parseFloat((meal?.fats)) || 0), 0);

  // Update state with initial values
  setTotalCalories(initialTotalCalories);
  setTotalProtein(initialTotalProtein);
  setTotalCarbs(initialTotalCarbs);
  setTotalFats(initialTotalFats);
};

useEffect(() => {
  // Update totals when the component mounts
  updateTotalValues();
}, [parsedMalAry]);
  return (
    <View style={styles.container}>
    <SafeAreaView >
    <View>
      <Calendar
        theme={{
          calendarBackground: 'white',
          dayTextColor: 'black',
          textDisabledColor: '#888',
          monthTextColor: 'black',
          textSectionTitleColor: 'black',
          textSectionTitleDisabledColor: '#888',
          selectedDayBackgroundColor: '#3f7eb3',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3f7eb3',
          dotColor: '#3f7eb3',
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
        initialDate={initDate}
        markedDates={marked}
        disableAllTouchEventsForDisabledDays={true}
        onDayPress={(day) => {
          let filteredData =[];
        // Filter the array
        //console.log('day.dateString useEffect',day.dateString);
        console.log('allUserWorkedMealsFromDB useEffect',allUserWorkedMealsFromDB);

        filteredData = filterByDate(allUserWorkedMealsFromDB, day.dateString);
        console.log('filteredData trainer plan meal calendar',filteredData);

        if(filteredData?.length > 0){
          const processedData = processTrainerPlanMealCalendar(filteredData);

          setParsedMalAry(processedData);
          //console.log('JSON.parse(filteredData?.malAry)',JSON.parse(filteredData?.[0]?.malAry));
        }

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
        <ScrollView>
        <View style={styles.centeredView}>
          
          <View style={styles.modalView}>
          {(parsedMalAry?.length === 0)?
            (
              <DataTable >
              <DataTable.Header>
                <DataTableTitleValue><DataTableTitleValueText>{t('No_Entry_Found')}</DataTableTitleValueText></DataTableTitleValue>
              </DataTable.Header>
              <Spacer size="large">
                <Spacer size="large">
                  <CalendarFullSizePressableButton
                    onPress={()=>{
                        hideModal();
                        setParsedMalAry([]);
                        }} style={{backgroundColor:"#000"}}>
                    <CalendarFullSizePressableButtonText >{t('Back_to_Calendar')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </Spacer>
                
              </Spacer>
              </DataTable>
            ):
            (
            <View style={{width:"100%",height:900,marginTop:20}}>
              {(parsedMalAry?.length >= 1) ? (
                <>
                {/* <View style={styles.FromToView}>
                  <Text style={[styles.FromToViewText,isArabic ? styles.ArabicFromToViewText : styles.EnglishFromToViewText]}>{t('Meal')}</Text>
                  <Text style={[styles.FromToViewTextWeight,isArabic ? styles.ArabicFromToViewTextWeight : styles.EnglishFromToViewTextWeight]}>{t('Weight')}</Text>
                  <Text style={[styles.FromToViewTextTime,isArabic ? styles.ArabicFromToViewTextTime : styles.EnglishFromToViewTextTime]}>{t('Time')}</Text>
                  <Text style={[styles.FromToViewTextProtein,isArabic ? styles.ArabicFromToViewTextProtein : styles.EnglishFromToViewTextProtein]}>{t('Protein')}</Text>
                  <Text style={[styles.FromToViewTextCarbs,isArabic ? styles.ArabicFromToViewTextCarbs : styles.EnglishFromToViewTextCarbs]}>{t('short_Carbs')}</Text>
                  <Text style={[styles.FromToViewTextFats,isArabic ? styles.ArabicFromToViewTextFats : styles.EnglishFromToViewTextFats]}>{t('short_Fats')}</Text>
                  <Text style={[styles.FromToViewTextCalories,isArabic ? styles.ArabicFromToViewTextCalories : styles.EnglishFromToViewTextCalories]}>{t('short_Calories')}</Text>
                </View> */}
                <View style={styles.FromToViewParentColumnHeader}>
                    <Text style={styles.FromToViewText}>{t("Meal")}</Text>
                    <View style={styles.FromToView}>
                      <Text style={styles.FromToViewTextWeight}>{t("Weight")}</Text>
                      {/* <Text style={styles.FromToViewTextTime}>{t("Time")}</Text> */}
                      <Text style={styles.FromToViewTextProtein}>{t("Protein")}</Text>
                      <Text style={styles.FromToViewTextCarbs}>{t("short_Carbs")}</Text>
                      <Text style={styles.FromToViewTextFats}>{t("short_Fats")}</Text>
                      <Text style={styles.FromToViewTextCalories}>{t("short_Calories")}</Text>
                    </View> 
                  </View>
                </>
              ):null}
                
              {parsedMalAry.map((oneMeal,index) => (
                <>
                {/* <View key={`${oneMeal?.foddes}-${index}`} style={styles.viewContainer}>
                  <View style={styles.rightContainer}>     
                    <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerText : styles.EnglishRightContainerText]}>{oneMeal?.foddes || ''}</Text>
                    <Text style={[styles.rightContainerTextWeight,isArabic ? styles.ArabicRightContainerTextWeight : styles.EnglishRightContainerTextWeight]}>{parseFloat(oneMeal?.weight) || '0'}</Text>
                    <Text style={[styles.rightContainerTextTime,isArabic ? styles.ArabicRightContainerTextTime : styles.EnglishRightContainerTextTime]}>{oneMeal?.time || '0'}</Text>
                    <Text style={[styles.rightContainerTextProtein,isArabic ? styles.ArabicRightContainerTextProtein : styles.EnglishRightContainerTextProtein]}>{parseFloat(oneMeal?.protin) || '0'}</Text>
                    <Text style={[styles.rightContainerTextCarbs,isArabic ? styles.ArabicRightContainerTextCarbs : styles.EnglishRightContainerTextCarbs]}>{parseFloat(oneMeal?.carbs) || '0'}</Text>
                    <Text style={[styles.rightContainerTextFats,isArabic ? styles.ArabicRightContainerTextFats : styles.EnglishRightContainerTextFats]}>{parseFloat(oneMeal?.fats) || '0'}</Text>
                    <Text style={[styles.rightContainerTextCalories,isArabic ? styles.ArabicRightContainerTextCalories : styles.EnglishRightContainerTextCalories]}>{oneMeal?.calris || '0'}</Text>
                  </View>

                </View> */}
                <View key={`${oneMeal?.speKey}-${oneMeal?.mealSpekey}-${oneMeal?.foddes}-${index}`} style={styles.FromToViewParentColumnBody}>
                <Text style={styles.rightContainerText}>{oneMeal.foddes || ''}</Text>
                <View style={styles.viewContainer}>
                  <View style={styles.rightContainer}>     
                    <Text style={styles.rightContainerTextWeight}>{parseFloat(oneMeal.weight) || '0'}</Text>
                    {/* <Text style={styles.rightContainerTextTime}>{oneMeal.time || '0'}</Text> */}
                    <Text style={styles.rightContainerTextProtein}>{parseFloat(oneMeal.protin) || '0'}</Text>
                    <Text style={styles.rightContainerTextCarbs}>{parseFloat(oneMeal.carbs) || '0'}</Text>
                    <Text style={styles.rightContainerTextFats}>{parseFloat(oneMeal.fats) || '0'}</Text>
                    <Text style={styles.rightContainerTextCalories}>{oneMeal.calris || '0'}</Text>
                    
                  </View>
                 

                </View>
              </View>
                </>
              ))}
              <>
            <Spacer size="medium">
              <ResultsParentView style={{height:60,marginLeft:0,marginRight:2,marginTop:30}}>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:12}}>Protein:</FormLabel>
                  </ResultsHalfRowLabelView>
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalProtein?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:12}}>Carbs:</FormLabel>
                  </ResultsHalfRowLabelView> 
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalCarbs?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
              </ResultsParentView>
              </Spacer>
              <Spacer size="small">
                <ResultsParentView style={{height:60,marginLeft:0,marginRight:2}}>
                  <ResultsHalfRowView >
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:12}}>Fats:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalFats?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                  <ResultsHalfRowView>
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:12}}>Calories:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalCalories?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                </ResultsParentView>
              </Spacer>
              <Spacer size="large">
              <CalendarFullSizePressableButton
                    onPress={()=>{
                        hideModal();
                        setParsedMalAry([]);
                        }} style={{backgroundColor:"#000"}}>
                <CalendarFullSizePressableButtonText >Back to calendar</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </Spacer>
            </>
            </View>
           
          )}
          
          </View>
          
        </View>
        </ScrollView>
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
    // minHeight:780,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    width:"100%",
    height:"100%",
    borderRadius: 0,
    padding: 30,
    alignItems: 'center',
    
  },
  // viewContainer: {
  //   flexDirection: 'row',
  //   marginVertical: 2,

  // },
  // leftContainer: {
  //   flex: 1,
  //   marginRight: 10,
  // },
  // rightContainer: {
  //   flexDirection: 'row',
  //   flex: 1,
  //   justifyContent:'space-between',
  //   marginBottom:25,
  //   width:"100%",

  // },
  
  // FromToView:{
  //   flexDirection: 'row',
  //   justifyContent:'space-between',
  //   width:"100%",
  //   marginBottom:10,
  // },
  // FromToViewText:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",
  // },
  // ArabicFromToViewText:{
  //   position:"absolute",
  //   left:"5%",
  // },
  // EnglishFromToViewText:{
  //   position:"absolute",
  //   left:"0%",
  // },
  // rightContainerText:{

  //   fontSize:12,
  //   width:50,
  //   color:"black",
  //   marginVertical: 15,
  //   flexWrap: 'wrap',
  // },
  // ArabicRightContainerText:{
  //   position:"absolute",
  //   left:"0%",
  // },
  // EnglishRightContainerText:{
  //   position:"absolute",
  //   left:"0%",
  // },
  // FromToViewTextWeight:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

  // },
  // ArabicFromToViewTextWeight:{
  //   position:"absolute",
  //   left:"22%",
  // },
  // EnglishFromToViewTextWeight:{
  //   position:"absolute",
  //   left:"18%",
  // },
  // rightContainerTextWeight:{
  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,
  // },
  // ArabicRightContainerTextWeight:{
  //   position:"absolute",
  //   left:"23%",
  // },
  // EnglishRightContainerTextWeight:{
  //   position:"absolute",
  //   left:"19%",
  // },
  // FromToViewTextTime:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

  // },
  // ArabicFromToViewTextTime:{
  //   position:"absolute",
  //   left:"37%",
  // },
  // EnglishFromToViewTextTime:{
  //   position:"absolute",
  //   left:"37%",
  // },
  // rightContainerTextTime:{
  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,
  //   flexWrap: 'wrap',
  // },
  // ArabicRightContainerTextTime:{
  //   position:"absolute",
  //   left:"33%",
  // },
  // EnglishRightContainerTextTime:{
  //   position:"absolute",
  //   left:"33%",
  // },
  // FromToViewTextProtein:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

  // },
  // ArabicFromToViewTextProtein:{
  //   position:"absolute",
  //   left:"52%",
  // },
  // EnglishFromToViewTextProtein:{
  //   position:"absolute",
  //   left:"52%",
  // },
  // rightContainerTextProtein:{

  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,
 
  // },
  // ArabicRightContainerTextProtein:{
  //   position:"absolute",
  //   left:"55%",
  // },
  // EnglishRightContainerTextProtein:{
  //   position:"absolute",
  //   left:"55%",
  // },
  // FromToViewTextCarbs:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

  // },
  // ArabicFromToViewTextCarbs:{
  //   position:"absolute",
  //   left:"67%",
  // },
  // EnglishFromToViewTextCarbs:{
  //   position:"absolute",
  //   left:"67%",
  // },
  // rightContainerTextCarbs:{

  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,

  // },
  // ArabicRightContainerTextCarbs:{
  //   position:"absolute",
  //   left:"67%",
  // },
  // EnglishRightContainerTextCarbs:{
  //   position:"absolute",
  //   left:"67%",
  // },
  // FromToViewTextFats:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

    
  // },
  // ArabicFromToViewTextFats:{
  //   position:"absolute",
  //   left:"78%",
  // },
  // EnglishFromToViewTextFats:{
  //   position:"absolute",
  //   left:"78%",
  // },
  // rightContainerTextFats:{
  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,

  // },
  // ArabicRightContainerTextFats:{
  //   position:"absolute",
  //   left:"79%",
  // },
  // EnglishRightContainerTextFats:{
  //   position:"absolute",
  //   left:"79%",
  // },
  // FromToViewTextCalories:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"black",

  // },
  // ArabicFromToViewTextCalories:{
  //   position:"absolute",
  //   left:"90%",
  // },
  // EnglishFromToViewTextCalories:{
  //   position:"absolute",
  //   left:"90%",
  // },
  // rightContainerTextCalories:{
  //   fontSize:11,
  //   color:"black",
  //   marginVertical: 15,

  // },
  // ArabicRightContainerTextCalories:{
  //   position:"absolute",
  //   left:"92%",
  // },
  // EnglishRightContainerTextCalories:{
  //   position:"absolute",
  //   left:"92%",
  // },
  
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    width:"90%",
    height:22,
    // justifyContent:'space-between',
  //  backgroundColor:'blue'
  },
  


  FromToViewParentColumnHeader:{
    flexDirection: 'column',
    // flex:1,
    width:"100%",
    height:48,
    // marginBottom:5,
    borderTopWidth:1,
    borderTopColor:"black",
    // backgroundColor:'blue'


  },
  FromToView:{
    flexDirection: 'row',
    justifyContent:'space-between',
    height:24,
    width:"100%",
    borderWidth:1,
    borderColor:"black",
  },
  FromToViewParentColumnBody:{
    flexDirection: 'column',
    width:"100%",
    height:50,
    // marginBottom:10,
    borderBottomWidth:1,
    borderBottomColor:"black",

    
    
    // backgroundColor:"yellow",

  },
  viewContainer: {
    flexDirection: 'row',
    marginRight:10,
    width:"100%",
    height:24,
    //backgroundColor:"green",

  },
  FromToViewText:{
    height:24,
    width:"100%",
    justifyContent:"center",
    textAlign:'center',
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    // flex:1,
    
  },
  rightContainerText:{

    fontSize:14,
    color:"#000",
    // //marginVertical: 17,
    height:24,
    width:"100%",
    justifyContent:"center",
    textAlign:'center',
    marginTop:5,
     //backgroundColor:"red",
  },
  FromToViewTextWeight:{

    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"1%"
  },
  rightContainerTextWeight:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"2%"
  },
  FromToViewTextTime:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"18%",
  },
  rightContainerTextTime:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"18%",
    flexWrap: 'wrap',
  },
  FromToViewTextProtein:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"20%",
  },
  rightContainerTextProtein:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"23%",
  },
  FromToViewTextCarbs:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"39%",
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"46%",
  },
  FromToViewTextFats:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"59%",
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"63%",
  },
  
  FromToViewTextCalories:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"80%",
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"89%",
  },
  rightContainerTextCheckBox:{

    height:30,
    width:30,
    position:'absolute',
     marginVertical: -21,

    right:'0%'
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
  },
  loadingBox: {
    width: 200,
    height: 200,
    backgroundColor: '#333',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 15,
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },

});