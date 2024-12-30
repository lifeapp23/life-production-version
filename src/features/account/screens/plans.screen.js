import React, { useState, useMemo } from 'react';
import {SafeAreaView,ScrollView, Dimensions,Modal, StyleSheet, View} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {DataTable} from 'react-native-paper';
import { useDate } from './DateContext'; // Import useDate from the context
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

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
import { Spacer } from "../../../components/spacer/spacer.component";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 

import { fetchBodyStatsAndMeasurements} from "../../../../database/B_S_and_measurements";
import { fetchTargetStats} from "../../../../database/target_stats";

export const PlansScreen = ({navigation,onAddEntry}) => {
  const initDate = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(initDate);
  const [visible, setVisible] = React.useState(false);
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [passNewDate, setPassNewDate] = useState('');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [userIdNum, setUserIdNum] = useState('');
  const [bodyStatsArray,setBodyStatsArray] = useState([]);
  const [targetStatsArray,setTargetStatsArray] = useState([]);
  const { t, i18n } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here

        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
            // Extract the ID part from the token and convert it to a number
            const tokenIDPart = parseInt(res.split('|')[0], 10);
            getUserIdFromTokenId(tokenIDPart)
            .then((userId) => {
                setUserIdNum(userId);
                fetchBodyStatsAndMeasurements(userId).then((bSMResults) => {
                  setBodyStatsArray(bSMResults);
                    //console.log('BodyStatsAndMeasurements table:', bSMResults);
                    }).catch((error) => {
                    //console.error('Error fetching BodyStatsAndMeasurements:', error);
                    });
                fetchTargetStats(userId).then((TSResults) => {
                  setTargetStatsArray(TSResults);
                //console.log('fetchTargetStats table:', TSResults);
                }).catch((error) => {
                //console.error('Error fetching fetchTargetStats:', error);
                });
            })
        });   

    }, [fetchBodyStatsAndMeasurements,fetchTargetStats])
  );
  //console.log('bodyStatsArray',bodyStatsArray?.length);

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
      selectedTextColor: 'white',
    },
  }), [selected]);

  for(let i = 0; i < bodyStatsArray?.length; i++) { 
    marked[bodyStatsArray?.[i]?.date] = { marked: true };
  };
  // for(let i = 0; i < targetStatsArray?.length; i++) { 
  //   marked[targetStatsArray?.[i]?.date] = { marked: true };
  // };
  
  const newTable = [...bodyStatsArray] ;
  //console.log('newTable',newTable);
  // const task = newTable?.find((t) => t?.date === passNewDate.toLocaleString());
  const containerStyle = {width:width,height:"100%",flex:1};



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
          textSectionTitleColor: 'white',
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
          let presseddDateString =day?.dateString?.toLocaleString();
          let dayWorkoutWorkedTask = newTable?.find((t) => t?.date === day?.dateString?.toLocaleString());
          navigation.navigate('MixBodyAndTargetStats',{dayWorkoutWorkedTask:dayWorkoutWorkedTask,sentPassNewDate:presseddDateString})
          onAddEntry();
        }}
      />
      <Spacer size="large">
        <CalendarFullSizePressableButton  style={{backgroundColor:'#000',width:width-20,marginRight:10,marginLeft:10}}
          onPress={() => onAddEntry()}>
          <CalendarFullSizePressableButtonText >{t('Hide_Calendar')}</CalendarFullSizePressableButtonText>
        </CalendarFullSizePressableButton>
      </Spacer>
      </View>
    </SafeAreaView>
    {/* <View style={styles.centeredView}>
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
              <DataTable >
              <DataTable.Header>
                <DataTableTitleValue><DataTableTitleValueText>{t('No_Entry_Found')}</DataTableTitleValueText></DataTableTitleValue>
              </DataTable.Header>
              <Spacer size="large">
                <Spacer size="large">
                  <CalendarFullSizePressableButton
                    onPress={hideModal} style={{backgroundColor:"#7b8d93"}}>
                    <CalendarFullSizePressableButtonText >{t('Back_to_Calendar')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </Spacer>
                <Spacer size="large">
                  <CalendarFullSizePressableButton
                          onPress={() => {
                            setSelected(passNewDate);
                            updateSelectedDate(passNewDate);
                            onAddEntry();
                            }} style={{backgroundColor:"#7b8d93"}}>
                      <CalendarFullSizePressableButtonText >{t('Add_New_Entry')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </Spacer>
              </Spacer>
              </DataTable>
            ):
            (
            <DataTable >
              <DataTable.Header>
                <DataTableTitleKey ><DataTableTitleKeyText>{t('Date')}</DataTableTitleKeyText></DataTableTitleKey>
                <DataTableTitleValue numeric><DataTableTitleValueText>{(task.date)}</DataTableTitleValueText></DataTableTitleValue>
              </DataTable.Header>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Height')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.height)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Weight')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.weight)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Neck')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.neck)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Shoulder')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.should)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Chest')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.chest)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Arm')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.arm)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Forearm')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.forarm)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Torso')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.torso)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('High_Hips')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.hHips)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Hips')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.hips)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Thigh')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.thigh)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <DataTable.Row>
                <DataTableCellKey ><DataTableCellKeyText >{t('Calves')}</DataTableCellKeyText></DataTableCellKey>
                <DataTableCellValue numeric><DataTableCellValueText >{(task.calves)}</DataTableCellValueText></DataTableCellValue>
              </DataTable.Row>
              <View style={{marginTop:20}}>
              <Spacer size="large">
                <CalendarFullSizePressableButton style={{backgroundColor:"#7b8d93"}}
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
    </View> */}
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