import React, { useState, useMemo,useContext,useEffect } from 'react';
import {SafeAreaView,ScrollView, Modal, StyleSheet, View, Dimensions} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {DataTable} from 'react-native-paper';
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
  CalendarFullSizePressableButtonText
} from "../components/account.styles";
const { width } = Dimensions.get('window');

import { Spacer } from "../../../components/spacer/spacer.component";
import { useFocusEffect } from '@react-navigation/native';
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 
import "./i18n";
import { useTranslation } from 'react-i18next';

import { fetchCalculatorsTableCalNam,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";

export const CalendarBmrCalculator = ({navigation,onAddEntry}) => {
  const initDate = new Date().toISOString().split('T')[0];
  const context = useContext(AuthGlobal);
  const [selected, setSelected] = useState(initDate);
  const [visible, setVisible] = React.useState(false);
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [passNewDate, setPassNewDate] = useState('');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [userIdNum, setUserIdNum] = useState('');
  const [calculatorsTableArray,setCalculatorsTableArray] = useState([]);
  const [unitsChecked, setUnitsChecked ] = useState('');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here

      AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        //console.log('bmr calculator calendar user---->>>',storedUser);
        fetchCalculatorsTableCalNam(storedUser.id,"bmrCal").then((calculatorsResults) => {
          //console.log('calculators bmr calendar Results-->',calculatorsResults);
          setCalculatorsTableArray(calculatorsResults);
        });
        if(Object.keys(context.stateUser.userPublicSettings).length > 0){
          setUnitsChecked(context.stateUser.userPublicSettings.units);
  
        }else{
          fetchPublicSettings(storedUser.id).then((PSettingsResults) => {
            setUnitsChecked(PSettingsResults[0].units);

          });
        }
        });   

    }, [fetchCalculatorsTableCalNam,fetchPublicSettings])
  );
  //console.log('calculatorsTableArray',calculatorsTableArray);

  const tasks = [
    // Your task data here
    { date: '2023-10-26', height: 170, weight: 60, nick:10,shoulder:10,chest:10,arm:10,forearm:10,torso:10,highHips:10,hips:10,thigh:10,calves:10},
    { date: '2023-10-27', height: 170, weight: 60, nick:10,shoulder:10,chest:10,arm:10,forearm:10,torso:10,highHips:10,hips:10,thigh:10,calves:10},
    { date: '2023-10-28', height: 170, weight: 60, nick:10,shoulder:10,chest:10,arm:10,forearm:10,torso:10,highHips:10,hips:10,thigh:10,calves:10},
];
  
  const marked = useMemo(() => ({
    
    [selected]: {
      selected: true,
      selectedColor: '#3f7eb3',
      selectedTextColor: '#fff',
    },
  }), [selected]);

  for(let i = 0; i < calculatorsTableArray?.length; i++) { 
    marked[calculatorsTableArray?.[i]?.date] = { marked: true };
  };

  

  const task = calculatorsTableArray?.find((t) => t?.date === passNewDate.toLocaleString());
  const containerStyle = {width:"100%",height:"100%",flex:1};

  const weightComeFromtDBToPounds = task?.weight?.toFixed(0) * 2.20462; // Convert kg to pounds
  const heightInInches = task?.height / 2.54; // Convert cm to inches
  const newWeight = unitsChecked=="Metrics" ? `${task?.weight?.toFixed(0)} ${t('Kg')}` : `${weightComeFromtDBToPounds.toFixed(3)} ${t('Pounds')}`;
  const newHeight = unitsChecked=="Metrics" ? `${task?.height.toFixed(0)} ${t('Cm')}` : `${heightInInches.toFixed(2)} ${t('Inches')}`;

  //console.log('calculatorsTableArray',calculatorsTableArray);
  //console.log('task?.weight?.toFixed(0)',task?.weight?.toFixed(0));
  //console.log('unitsChecked',unitsChecked);

  //console.log('newWeight',newWeight);
  //console.log('newHeight',newHeight);
  useEffect(() => {
    if(!task && passNewDate){
      setSelected(passNewDate);
      updateSelectedDate(passNewDate);
      onAddEntry();
    }
    }, [task,passNewDate]);
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
          selectedDayTextColor: '#000',
          todayTextColor: '#3f7eb3',
          dotColor: '#3f7eb3',
          selectedDotColor: '#000',
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
          let presseddDateString =day?.dateString?.toLocaleString();
          let dayWorkoutWorkedTask = calculatorsTableArray?.find((t) => t?.date === day?.dateString?.toLocaleString());
          navigation.navigate('BMI',{dayWorkoutWorkedTask:dayWorkoutWorkedTask,sentPassNewDate:presseddDateString})
          onAddEntry();
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
          {(!task)?
            (
              null
            ):
            (
            <DataTable >
              <DataTable.Header>
                <DataTableTitleKey ><DataTableTitleKeyText>{t('Date')}</DataTableTitleKeyText></DataTableTitleKey>
                <DataTableTitleValue numeric><DataTableTitleValueText>{(task.date)}</DataTableTitleValueText></DataTableTitleValue>
              </DataTable.Header>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Methods')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.methds)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Height')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{newHeight}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Weight')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{newWeight}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Result')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{task?.result}  {t('Calories_day')}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              
              <View style={{marginTop:20}}>
              <Spacer size="large">
                <CalendarFullSizePressableButton style={{backgroundColor:"#000"}}
                  onPress={hideModal}>
                  <CalendarFullSizePressableButtonText >{t('Back_to_Calendar')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              </Spacer>
              </View>
          </DataTable>
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
    height:780,
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
});