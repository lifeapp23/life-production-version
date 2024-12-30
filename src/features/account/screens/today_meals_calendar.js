import React, { useState, useMemo,useContext,useEffect } from 'react';
import {SafeAreaView,ScrollView, Modal, StyleSheet, View, Dimensions,Text} from 'react-native';
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
  CalendarFullSizePressableButtonText,
  ResultsParentView,
  ResultsHalfRowView,
  ResultsHalfRowLabelView,
  ResultsHalfRowResultPlaceView,
  ResultsHalfRowResultPlaceViewText,
  FormLabel,
} from "../components/account.styles";
import { fetchAllDaysMealsWithoutDeleting,fetchTodayMealForCalendar,insertPlansTodayMeals,SoftDeleteTodayMeal} from "../../../../database/today_meals";

import { Spacer } from "../../../components/spacer/spacer.component";
import { useFocusEffect } from '@react-navigation/native';
import { fetchPublicSettings} from "../../../../database/workout_settings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthGlobal from "../Context/store/AuthGlobal";
import { getUserIdFromTokenId } from "../../../../database/tokensTable"; 

import { fetchCalculatorsTableCalNam,insertCalculatorsTable,fetchCalculatorsTableLastInsertedRow } from "../../../../database/calcaulatorsTable";

export const TodayMealsCalendar = ({navigation,onAddEntry,traineeData,allUserWorkedMealsFromLaravelDB}) => {
  const initDate = new Date().toISOString().split('T')[0];
  const context = useContext(AuthGlobal);
  const [selected, setSelected] = useState(initDate);
  const [visible, setVisible] = React.useState(false);
  const { selectedDate, updateSelectedDate } = useDate(); // Access selectedDate and updateSelectedDate from the context
  const [passNewDate, setPassNewDate] = useState('');
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [calculatorsTableArray,setCalculatorsTableArray] = useState([]);
  const [unitsChecked, setUnitsChecked ] = useState('');
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const [views, setViews] = useState([]);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');
  const [modalVisible,setModalVisible] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0); 
  const [allDaysMealsObject, setAllDaysMealsObject] = useState({});
  const [allDaysMealsArray, setAllDaysMealsArray] = useState([]);

  const [mixDataFromOnlineAndOfflineOrJustOffline, setMixDataFromOnlineAndOfflineOrJustOffline] = useState([]);


  useFocusEffect(
    React.useCallback(() => {
      // Fetch the latest data or update the state here

      AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);

        //console.log('meal [lan] calendar user---->>>',storedUser);
        fetchAllDaysMealsWithoutDeleting(storedUser.id).then((TMAResults) => {
            setAllDaysMealsArray(TMAResults);
            //console.log('TodayMealsAll',TMAResults);
            // Create an object to group rows by date
              const groupedData = {};
  
              // Group rows by date
              TMAResults.forEach(row => {
                // Extract the date from the row
                const date = row.date;
                
                // If the date doesn't exist in the groupedData object, create an empty array for it
                if (!groupedData[date]) {
                  groupedData[date] = [];
                }
                
                // Push the row into the array for the corresponding date
                groupedData[date].push(row);
              });

              setAllDaysMealsObject(groupedData);
              console.log('normal calendar for meal groupedData',groupedData);

              }).catch((error) => {
              //console.log('Error fetching TodayMealsTable:', error);
              });
        });   

    }, [])
  );

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


  for (const key in allDaysMealsObject) {
    const arr = allDaysMealsObject[key];
    for (const item of arr) {
        marked[item?.date] = { marked: true };
    }
  }
  
  if (traineeData) {
    const today = new Date();

    if (traineeData?.strDat && traineeData?.endDat) {
    const strDat = new Date(traineeData?.strDat);
    const endDat = new Date(traineeData?.endDat);

    // Check if today is between `strDat` and `endDat`
    if (today >= strDat && today <= endDat) {
      for(let i = 0; i < allUserWorkedMealsFromLaravelDB?.length; i++) { 
        marked[allUserWorkedMealsFromLaravelDB?.[i]?.todDay] = { marked: true };
      };
    } 
  } 


  }
  function filterByDate(array, passNewDate) {
    return array?.filter(item => item.date === passNewDate);
    }

    
  function filterByDateForLaravelDbData(array, passNewDate) {
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

  // Filter the array
  // console.log('normal calendar for meal allDaysMealsArray',allDaysMealsArray);
  // console.log('normal calendar for meal traineeData',traineeData);
  // console.log('normal calendar for meal Object.keys(traineeData)?.length',Object.keys(traineeData)?.length);
  // console.log('normal calendar for meal allUserWorkedMealsFromLaravelDB',allUserWorkedMealsFromLaravelDB);

  
  // let filteredData = filterByDate(allDaysMealsArray, passNewDate);
  
  //console.log('filteredData',filteredData);
  const updateTotalValues = () => {
    // Initialize totals based on existing data
    const initialTotalCalories = mixDataFromOnlineAndOfflineOrJustOffline.reduce((total, meal) => total + (parseFloat((meal.calris)) || 0), 0);
    const initialTotalProtein = mixDataFromOnlineAndOfflineOrJustOffline.reduce((total, meal) => total + (parseFloat((meal.protin)) || 0), 0);
    const initialTotalCarbs = mixDataFromOnlineAndOfflineOrJustOffline.reduce((total, meal) => total + (parseFloat((meal.carbs)) || 0), 0);
    const initialTotalFats = mixDataFromOnlineAndOfflineOrJustOffline.reduce((total, meal) => total + (parseFloat((meal.fats)) || 0), 0);

    // Update state with initial values
    setTotalCalories(initialTotalCalories);
    setTotalProtein(initialTotalProtein);
    setTotalCarbs(initialTotalCarbs);
    setTotalFats(initialTotalFats);
  };

  useEffect(() => {
    // Update totals when the component mounts
    updateTotalValues();
  }, [mixDataFromOnlineAndOfflineOrJustOffline]);
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
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3f7eb3',
          dotColor: '#3f7eb3',
          selectedDotColor: '#ffffff',
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
            let filteredDataFromLaravelDb =[];
            let processedDataFromLaravelDb =[];
            let filteredDataFromOfflineDb  = filterByDate(allDaysMealsArray, day.dateString);

          if (traineeData) {
            const today = new Date();
           
            if (traineeData?.strDat && traineeData?.endDat) {
            const strDat = new Date(traineeData?.strDat);
            const endDat = new Date(traineeData?.endDat);

            // Check if today is between `strDat` and `endDat`
            if (today >= strDat && today <= endDat) {
              console.log('yes subscribed')
              filteredDataFromLaravelDb = filterByDateForLaravelDbData(allUserWorkedMealsFromLaravelDB, day.dateString);
              if(filteredDataFromLaravelDb?.length > 0){
                processedDataFromLaravelDb = processTrainerPlanMealCalendar(filteredDataFromLaravelDb);

                //console.log('JSON.parse(filteredData?.malAry)',JSON.parse(filteredData?.[0]?.malAry));
              }
              setMixDataFromOnlineAndOfflineOrJustOffline([
                ...(processedDataFromLaravelDb || []),
                ...(filteredDataFromOfflineDb || []),
              ]);
            } else{
              setMixDataFromOnlineAndOfflineOrJustOffline([...filteredDataFromOfflineDb || []]);
            }
          } else{
            setMixDataFromOnlineAndOfflineOrJustOffline([...filteredDataFromOfflineDb || []]);

          }


          }else{
            setMixDataFromOnlineAndOfflineOrJustOffline([...filteredDataFromOfflineDb || []]);

          }
        //   fetchTodayMealForCalendar(userId,day.dateString).then((TMResults) => {
        //   setData(TMResults);
        //   //console.log('TodayMealsTable calendar:', TMResults);
        //     }).catch((error) => {
        //     //console.log('Error fetching TodayMealsTable:', error);
        //     });
          showModal();
        }}
      />
      <Spacer size="large">
        <CalendarFullSizePressableButton style={{backgroundColor:'#000',width:width-20,marginLeft:10,marginRight:10}}
          onPress={() => onAddEntry()}>
          <CalendarFullSizePressableButtonText >{t("Hide_Calendar")}</CalendarFullSizePressableButtonText>
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
          {(mixDataFromOnlineAndOfflineOrJustOffline.length === 0)?
            (
              <View style={styles.modalViewOnDataTable}>
                <DataTable >
                <DataTable.Header>
                  <DataTableTitleValue><DataTableTitleValueText>{t("No_Entry_Found")}</DataTableTitleValueText></DataTableTitleValue>
                </DataTable.Header>
                <Spacer size="large">
                  <Spacer size="large">
                    <CalendarFullSizePressableButton
                      onPress={()=>{
                          hideModal();
                          setData([]);
                          }} style={{backgroundColor:"#000"}}>
                      <CalendarFullSizePressableButtonText >{t("Back_to_Calendar")}</CalendarFullSizePressableButtonText>
                    </CalendarFullSizePressableButton>
                  </Spacer>
                  
                </Spacer>
                </DataTable>
              </View>
            ):
            (
            <View style={{width:"100%",flex:1,marginTop:20}}>
            {(mixDataFromOnlineAndOfflineOrJustOffline.length >= 1) ? (
                    <View style={styles.FromToViewParentColumnHeader}>
                      <Text style={styles.FromToViewText}>{t("Meal")}</Text>
                      <View style={styles.FromToView}>
                        <Text style={styles.FromToViewTextWeight}>{t("Weight")}</Text>
                        <Text style={styles.FromToViewTextTime}>{t("Time")}</Text>
                        <Text style={styles.FromToViewTextProtein}>{t("Protein")}</Text>
                        <Text style={styles.FromToViewTextCarbs}>{t("short_Carbs")}</Text>
                        <Text style={styles.FromToViewTextFats}>{t("short_Fats")}</Text>
                        <Text style={styles.FromToViewTextCalories}>{t("short_Calories")}</Text>
                      </View>
                    </View>
                  ):null}
                    
                    {mixDataFromOnlineAndOfflineOrJustOffline.map((oneMeal,index) => (
                      <View key={`${oneMeal?.speKey}-${oneMeal?.foddes}-${index}`} style={styles.FromToViewParentColumnBody}>
                      <Text style={styles.rightContainerText}>{oneMeal.foddes || ''}</Text>
                      <View style={styles.viewContainer}>
                        <View style={styles.rightContainer}>     
                          <Text style={styles.rightContainerTextWeight}>{parseFloat(oneMeal.weight) || '0'}</Text>
                          <Text style={styles.rightContainerTextTime}>{oneMeal.time || '0'}</Text>
                          <Text style={styles.rightContainerTextProtein}>{parseFloat(oneMeal.protin) || '0'}</Text>
                          <Text style={styles.rightContainerTextCarbs}>{parseFloat(oneMeal.carbs) || '0'}</Text>
                          <Text style={styles.rightContainerTextFats}>{parseFloat(oneMeal.fats) || '0'}</Text>
                          <Text style={styles.rightContainerTextCalories}>{oneMeal.calris || '0'}</Text>
                        </View>
                      
                      </View>
                    </View>
                    ))}
                                <>
            <Spacer size="medium">
              <ResultsParentView style={{height:60,marginLeft:0,marginRight:2}}>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:12}}>{t("Protein")}:</FormLabel>
                  </ResultsHalfRowLabelView>
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalProtein?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
                <ResultsHalfRowView >
                  <ResultsHalfRowLabelView>
                    <FormLabel style={{fontSize:12}}>{t("Carbs")}:</FormLabel>
                  </ResultsHalfRowLabelView> 
                    <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalCarbs?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                </ResultsHalfRowView>
              </ResultsParentView>
              </Spacer>
              <Spacer size="small">
                <ResultsParentView style={{height:60,marginLeft:0,marginRight:2}}>
                  <ResultsHalfRowView >
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:12}}>{t("Fats")}:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalFats?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                  <ResultsHalfRowView>
                    <ResultsHalfRowLabelView>
                      <FormLabel style={{fontSize:12}}>{t("Calories")}:</FormLabel>
                    </ResultsHalfRowLabelView>
                      <ResultsHalfRowResultPlaceView><ResultsHalfRowResultPlaceViewText style={{fontSize:12}}>{parseFloat(totalCalories?.toFixed(4)) || 0}</ResultsHalfRowResultPlaceViewText></ResultsHalfRowResultPlaceView>
                  </ResultsHalfRowView>
                </ResultsParentView>
              </Spacer>
              <Spacer size="large">
              <CalendarFullSizePressableButton
                    onPress={()=>{
                        hideModal();
                        setData([]);
                        }} style={{backgroundColor:"#000"}}>
                <CalendarFullSizePressableButtonText >{t("Back_to_Calendar")}</CalendarFullSizePressableButtonText>
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
  },
  modalView: {
    margin: 20,
    backgroundColor: '#fff',
    width:"100%",
    height:"100%",
    borderRadius: 0,
    padding: 10,
    alignItems: 'center',
    
  },
  modalViewOnDataTable: {
    margin: 20,
    backgroundColor: '#fff',
    width:"100%",
    height:800,
    borderRadius: 0,
    padding: 10,
    alignItems: 'center',
    
  },
  // viewContainer: {
  //   flexDirection: 'row',
  //   marginVertical: 15,
    

  // },
   viewContainer: {
    flexDirection: 'row',
    marginRight:10,
    width:"100%",
    height:24,
    //backgroundColor:"green",

  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  // rightContainer: {
  //   flexDirection: 'row',
  //   flex: 1,
  //   justifyContent:'space-between',
  //   marginBottom:25,
  // },
  
  // FromToView:{
  //   flexDirection: 'row',
  //   justifyContent:'space-between',


  // },
  // FromToViewText:{
  //   fontSize:12,
  //   fontWeight:'bold',
  //   color:"#000",
  // },
  // rightContainerText:{
  //   fontSize:11,
  //   color:"#000",
  //   marginVertical: 15,
  // },
  // EnglishFromToViewText:{
  //   position:"absolute",
  //   left:"1%",
    
  // },
  // ArabicFromToViewText:{
  //   position:"absolute",
  //   left:"5%",
    
  // },
  // EnglishRightContainerText:{
  //   width:50,
  //   flexWrap: 'wrap',
  //   position:"absolute",
  //   left:"1%"
  // },
  // ArabicRightContainerText:{
  //   width:50,
  //   flexWrap: 'wrap',
  //   position:"absolute",
  //   left:"0%"
  // },
  
  // EnglishFromToViewTextWeight:{
  //   position:"absolute",
  //   left:"15%"
  // },
  // ArabicFromToViewTextWeight:{
  //   position:"absolute",
  //   left:"20%"
  // },
  // EnglishRightContainerTextWeight:{
  //   position:"absolute",
  //   left:"16%"
  // },
  // ArabicRightContainerTextWeight:{
  //   position:"absolute",
  //   left:"21%"
  // },
  // EnglishFromToViewTextTime:{
  //   position:"absolute",
  //   left:"31%",
  // },
  // ArabicFromToViewTextTime:{
  //   position:"absolute",
  //   left:"32%",
  // },
  // EnglishRightContainerTextTime:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"29%",
  //   flexWrap: 'wrap',
  // },
  // ArabicRightContainerTextTime:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"30%",
  //   flexWrap: 'wrap',
  // },
  // EnglishFromToViewTextProtein:{
  //   position:"absolute",
  //   left:"45%",
  // },
  // ArabicFromToViewTextProtein:{
  //   position:"absolute",
  //   left:"47%",
  // },
  // EnglishRightContainerTextProtein:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"45%",
  // },
  // ArabicRightContainerTextProtein:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"46%",
  // },
  // EnglishFromToViewTextCarbs:{
  //   position:"absolute",
  //   left:"56%",
  // },
  // ArabicFromToViewTextCarbs:{
  //   position:"absolute",
  //   left:"57%",
  // },
  // EnglishRightContainerTextCarbs:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"57%",
  // },
  // ArabicRightContainerTextCarbs:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"58%",
  // },
  // EnglishFromToViewTextFats:{
  //   position:"absolute",
  //   left:"70%",
    
  // },
  // ArabicFromToViewTextFats:{
  //   position:"absolute",
  //   left:"71%",
    
  // },
  // EnglishRightContainerTextFats:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"71%",
  // },
  // ArabicRightContainerTextFats:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"72%",
  // },
  // EnglishFromToViewTextCalories:{
  //   position:"absolute",
  //   left:"82%",
  // },
  // ArabicFromToViewTextCalories:{
  //   position:"absolute",
  //   left:"84%",
  // },
  // EnglishRightContainerTextCalories:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"85%",
  // },
  // ArabicRightContainerTextCalories:{
  //   flex: 1,
  //   position:"absolute",
  //   left:"86%",
  // },
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
    //backgroundColor:"yellow",

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
    left:"1%"
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
    left:"16%",
    flexWrap: 'wrap',
  },
  FromToViewTextProtein:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"32%",
  },
  rightContainerTextProtein:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"37%",
  },
  FromToViewTextCarbs:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"48%",
  },
  rightContainerTextCarbs:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"53%",
  },
  FromToViewTextFats:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"63%",
  },
  rightContainerTextFats:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"69%",
  },
  
  FromToViewTextCalories:{
    fontSize:14,
    fontWeight:'bold',
    color:"#000",
    position:"absolute",
    left:"77%",
  },
  rightContainerTextCalories:{
    flex: 1,
    fontSize:14,
    color:"#000",
    //marginVertical: 17,
    position:"absolute",
    left:"88%",
  },

});