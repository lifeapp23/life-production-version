import React, { useState,useEffect,useContext} from 'react';
import { StyleSheet,ScrollView,View,Text,TouchableOpacity,Dimensions} from "react-native";
import {Avatar } from "react-native-paper";

import {
  Title,
  TitleView,
  FormLabel,
  PageContainer,
  FormLabelView,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  PageMainImage,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  ServiceCloseInfoButton,
  ServiceCloseInfoButtonAvatarIcon,
  ServiceCloseInfoButtonTextView,
  ServiceCloseInfoButtonText,
  ServiceInfoButtonView,
  ServiceInfoButton,
  ServiceInfoButtonAvatarIcon,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import AuthGlobal from "../Context/store/AuthGlobal";
import { fetchUsers,getOneUser,deleteUsersTable } from "../../../../database/usersTable";

import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { addEventListener } from "@react-native-community/netinfo";
import "./i18n";
import { useTranslation } from 'react-i18next';

export const TrainerTraineesScreen = ({navigation,route}) => {
  const myTrainerTrainees= [
    {id:1,name:"Mohamed Al-DurrahT",country:"Egypt",gender:'Him',price:"150",currency:"EGP",discount:"10%",startDate:"2023-11-01",endDate:"2024-01-31",period:"3 months"},
    {id:2,name:"Sarah KenndyT",country:"United Stated",gender:'Her',price:"100",currency:"USD",discount:"7.5%",startDate:"2023-10-01",endDate:"2024-01-31",period:"4 months"},
    {id:3,name:"Mario ElvesT",country:"Ireland",gender:'Him',price:"10",currency:"USD",discount:"0",startDate:"2023-10-01",endDate:"2024-01-31",period:"4 months"},
    {id:4,name:"Moataz FahmyT",country:"Germany",gender:'Him',price:"30",currency:"USD",discount:"15%",startDate:"2024-01-01",endDate:"2024-05-31",period:"5 months"},
    {id:5,name:"Peter BeckerT",country:"United Kingdom",gender:'Him',price:"80",currency:"USD",discount:"0",startDate:"2024-05-01",endDate:"2024-07-31",period:"3 months"},
];
const [userId, setUserId] = useState("");  
const [userActiveOnboardButton, setUserActiveOnboardButton] = useState(false);  

const [activeClients, setActiveClients] = useState([]);  
const [inactiveClients, setInactiveClients] = useState([]);  
const { t, i18n } = useTranslation();
const { width } = Dimensions.get('window');
const context = useContext(AuthGlobal);  
const [showInfo, setShowInfo] = useState(false);
const toggleInfo = () => {
  setShowInfo(!showInfo);
};
// console.log('context.stateUser?.userProfile trainees',context.stateUser?.userProfile);
// console.log('context.stateUser?.userProfile?.created_at',context.stateUser?.userProfile?.created_at);

// Function to toggle the discount checkbox state
useFocusEffect(
  React.useCallback(() => {
  AsyncStorage.getItem("sanctum_token")
  .then((res) => {
    //console.log('tokeeen:',res);
  AsyncStorage.getItem("currentUser").then((user) => {

      const storedUser = JSON.parse(user);
      setUserId(storedUser.id);

      if(context.stateUser?.userProfile?.created_at){
        // Convert created_at to a Date object
        const createdDate = new Date(context.stateUser?.userProfile?.created_at);
        console.log('context createdDate:', createdDate);

        // Get the current date
        const currentDate = new Date();
        console.log('context currentDate:', currentDate);

        // Calculate the date 5 days after created_at
        const fiveDaysLater = new Date(createdDate);
        fiveDaysLater.setDate(createdDate.getDate() + 5);
        console.log('context fiveDaysLater:', fiveDaysLater);
        // Check if current date is between created_at and fiveDaysLater
        if (currentDate >= createdDate && currentDate <= fiveDaysLater) {
          console.log("context OnBoarding Button is Active"); // Current date is within the range
          setUserActiveOnboardButton(true);

        } else {
          console.log("context OnBoarding Button is not Active"); // Current date is within the range
        }
      }else{
        getOneUser(storedUser.id).then((users) => {
          console.log('User info table trainess?.created_at:', users?.created_at);
           // Convert created_at to a Date object
        const createdDate = new Date(users?.created_at);
        console.log('getOneUser context createdDate:', createdDate);

        // Get the current date
        const currentDate = new Date();
        console.log('context currentDate:', currentDate);

        // Calculate the date 5 days after created_at
        const fiveDaysLater = new Date(createdDate);
        fiveDaysLater.setDate(createdDate.getDate() + 5);
        console.log('context fiveDaysLater:', fiveDaysLater);
        // Check if current date is between created_at and fiveDaysLater
        if (currentDate >= createdDate && currentDate <= fiveDaysLater) {
          console.log("getOneUser OnBoarding Button is Active"); // Current date is within the range
          setUserActiveOnboardButton(true);

        } else {
          console.log("getOneUser OnBoarding Button is not Active"); // Current date is within the range
        }
          }).catch((error) => {
            //console.error('Error fetching users:', error);
          });
      }
      // getOneUser(storedUser.id).then((users) => {
      //   console.log('User info table trainess?.created_at:', users?.created_at);
      //   }).catch((error) => {
      //     //console.error('Error fetching users:', error);
      //   });
      //console.log("activeClients?.length", activeClients?.length);
      const unsubscribe = addEventListener(state => {
        //console.log("Connection type--", state.type);
        //console.log("Is connected?---", state.isConnected);
        //setTriainerConnected(state.isConnected);
      if(state.isConnected){
        //console.log('---------------now online--------')
        axios.get('https://www.elementdevelops.com/api/get-trainer-trainees', {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            //console.log('trainees::',response.data);

            //console.log('active trainees::',response.data["activeTrainees"]);
            //console.log('inactive trainees::',response.data["inactiveTrainees"]);
            setActiveClients(response.data["activeTrainees"]);
            setInactiveClients(response.data["inactiveTrainees"]);
            //setOurPersonalTrainers(response.data["trainers"]);
          })
          .catch(error => {
            // Handle error
            //console.log('Error fetching Trainers:', error);
          });
      }else{
        //console.log('else no internet ahmed');
        Alert.alert(`${t(' ')}`,
        `${t('Please_Connect_to_the_internet_To_see_the_Trainees')}`,
        [
          {
            text: 'OK',
            onPress: () => {
             
            },
          },
        ],
        { cancelable: false }
      );

      }
    });
      
      // Unsubscribe
      unsubscribe();
    })
  });
 

}, [])
);
  const today = new Date().toISOString().split('T')[0];

  // const activeClients = myTrainerTrainees.filter((trainee) => {
  //   return today >= trainee.startDate && today <= trainee.endDate;
  // });

  // const inactiveClients = myTrainerTrainees.filter((trainee) => {
  //   return today < trainee.startDate || today > trainee.endDate;
  // });
  const isArabic = i18n.language === 'ar';


  const [inactiveparentHeight, setInactiveParentHeight] = useState([]);
  const handleInactiveChildLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;

    // Update the height for the specific row
    setInactiveParentHeight((prevState) => {
      const newHeights = [...prevState]; // Copy previous heights
      // if(newHeights[index]){
      //   if(height > newHeights[index] ){
      //     newHeights[index] = height; // Set the height for the specific row
  
      //   }
      // }else{
        newHeights[index] = height; // Set the height for the specific row

      // }
      
      return newHeights;
    });
  };
  const [activeParentHeight, setActiveParentHeight] = useState([]);

  // Function to handle layout and set the height dynamically for each row
  const handleActiveChildLayout = (event, index) => {
    const { height } = event.nativeEvent.layout;

    // Update the height for the specific row
    setActiveParentHeight((prevState) => {
      const newHeights = [...prevState]; // Copy previous heights
      // if(newHeights[index]){
      //   if(height > newHeights[index] ){
      //     newHeights[index] = height; // Set the height for the specific row
  
      //   }
      // }else{
        newHeights[index] = height; // Set the height for the specific row

      // }
      
      return newHeights;
    });
  };
  
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          {/* <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t('Trainees')}</ServicesPagesCardHeader>
          </ServicesPagesCardCover> */}
          <ServicesPagesCardCover>
          <PageMainImage
            source={require('../../../../assets/trainer_trainees_section.jpeg')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
          </ServicesPagesCardCover>

          {(
            userActiveOnboardButton
          )?(
            <Spacer size="large">
          
              <ServiceInfoParentView >
                {showInfo ? (
                  <ServiceCloseInfoButtonView>
                    <ServiceCloseInfoButton onPress={toggleInfo}>
                      <Avatar.Icon  color="#3f7eb3"  style={{backgroundColor: 'transparent', borderRadius: 30,}}  icon="close-circle" size={60} />
                    </ServiceCloseInfoButton>
                    <ServiceCloseInfoButtonTextView style={{backgroundColor:'#3f7eb3'}}>
                      <ServiceCloseInfoButtonText>{t("Add_Active_Clients_i_desc")}</ServiceCloseInfoButtonText>
                    </ServiceCloseInfoButtonTextView>
                  </ServiceCloseInfoButtonView>
                ) : (
                  <ServiceInfoButtonView>
                    <ServiceInfoButton  onPress={toggleInfo}>
                    <Avatar.Icon  color="#3f7eb3" // Icon color
                style={{
                  backgroundColor: 'transparent', // Background color for the Avatar
                  borderRadius: 30, // Circular shape
                }} icon="information" size={60} />
                    </ServiceInfoButton>
                  </ServiceInfoButtonView>
                )}
            </ServiceInfoParentView>
            </Spacer>
          ):(null)}
          
          <Spacer size="medium">
            <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerPredefinedWorkoutPlans')}
>
                <CalendarFullSizePressableButtonText >{t('Predefined_Workout_Plans')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </View>
          </Spacer>
          <Spacer size="medium">
            <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerPredefinedManageMealsPlans')}
>
                <CalendarFullSizePressableButtonText >{t('Predefined_meals_Plans')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </View>
          </Spacer>
          {(
            userActiveOnboardButton
          )?(
            <Spacer size="medium">
            <View style={{width: width - 20,marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('TrainerOnboardingCurrentTrainees')}
>                
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>{t('Just_For_five_Days')}</Text>
                  </View>
                <CalendarFullSizePressableButtonText >{t('Add_Active_Clients')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </View>
          </Spacer>
          ):(null)}
          
          <Spacer size="large">
            <View >
                <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Active_Clients')}</FormLabel>
                </FormLabelView>
                <View style={[styles.membershipDateContainer,styles.activeMembershipDateContainer]}> 
                {(parseInt(activeClients?.length) > 0)?(
                  <View style={styles.dateHeadersView}>
                  
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeName : styles.EnglishHeaderTraineeName]}>{t('Name')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeCountry : styles.EnglishHeaderTraineeCountry]}>{t('Country')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeStartDate : styles.EnglishHeaderTraineeStartDate]}>{t('Start')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeEndDate : styles.EnglishHeaderTraineeEndDate]}>{t('End')}</Text>
                  </View>
                ):(null)
                }
                    
                    {activeClients?.map((TrainerTrainee, index) => 
                      {
                        {/* console.log('activeParentHeight[index] ',index, activeParentHeight[index] ); */}

                    return (
                    <View style={[
                          styles.dateBodyView,
                          {
                            marginTop: (activeParentHeight?.[index] != null && activeParentHeight?.[index] != undefined && activeParentHeight?.[index] > 60) ? (activeParentHeight?.[index] / 2) - 10 : 40,
                            marginBottom: (activeParentHeight?.[index] != null && activeParentHeight?.[index] != undefined && activeParentHeight?.[index] > 60) ? (activeParentHeight?.[index] / 2) : 40,
                          
                          },
                        ]} key={`${TrainerTrainee.id}-${TrainerTrainee.trainee.fName}-${TrainerTrainee.trainee.lName}`}>
                    <TouchableOpacity  onLayout={(event) => handleActiveChildLayout(event, index)}  style={[styles.rightContainerTextName,isArabic ? styles.ArabicRightContainerTextName: styles.EnglishRightContainerTextName]} onPress={() => navigation.navigate('TraineePage', { TrainerTraineeSent: TrainerTrainee})}>

                        <Text   style={[styles.rightContainerTextNameForButton]} >{`${TrainerTrainee.trainee.fName } ${TrainerTrainee.trainee.lName }` || ''}</Text>
                    </TouchableOpacity>
                        <Text onLayout={(event) => handleActiveChildLayout(event, index)} style={[styles.rightContainerTextCountryActive, { marginVertical: activeParentHeight?.[index] ? -((activeParentHeight?.[index]/2)-17) : 10 },isArabic ? styles.ArabicRightContainerTextCountry: styles.EnglishRightContainerTextCountry]}>{TrainerTrainee.trainee.country || ''}</Text>
                        <Text style={[styles.rightContainerTextStart,isArabic ? styles.ArabicRightContainerTextStart: styles.EnglishRightContainerTextStart]}>{TrainerTrainee.strDat || ''}</Text>
                        <Text style={[styles.rightContainerTextEnd,isArabic ? styles.ArabicRightContainerTextEnd: styles.EnglishRightContainerTextEnd]}>{TrainerTrainee.endDat || ''}</Text>
                    </View>
                      )
                    }
                    
                    )}
                </View>
            </View>
          </Spacer>
          <Spacer size="large">
            <View >
                <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Inactive_Clients')}</FormLabel>
                </FormLabelView>
                <View style={[styles.membershipDateContainer,styles.inactiveMembershipDateContainer]}> 
                {(parseInt(inactiveClients?.length) > 0)?(
                  <View style={styles.dateHeadersView}>
                  
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeName : styles.EnglishHeaderTraineeName]}>{t('Name')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeCountry : styles.EnglishHeaderTraineeCountry]}>{t('Country')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeStartDate : styles.EnglishHeaderTraineeStartDate]}>{t('Start')}</Text>
                      <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTraineeEndDate : styles.EnglishHeaderTraineeEndDate]}>{t('End')}</Text>
                  </View>
                ):(null)}
                    {inactiveClients?.map((TrainerTrainee, index) => 
                    {
                    return(
                      <View style={[
                        styles.dateBodyView,
                        {
                        marginTop: (inactiveparentHeight?.[index] != null && inactiveparentHeight?.[index] != undefined && inactiveparentHeight?.[index] > 60) ? (inactiveparentHeight?.[index] / 2) - 10 : 40,
                        marginBottom: (inactiveparentHeight?.[index] != null && inactiveparentHeight?.[index] != undefined && inactiveparentHeight?.[index] > 60) ? (inactiveparentHeight?.[index] / 2) : 40,

                        },
                        ]} key={`inactive-${TrainerTrainee.id}-${index}`}>
                        <Text style={[styles.rightContainerTextName,isArabic ? styles.ArabicRightContainerTextNameNotActive: styles.EnglishRightContainerTextNameNotActive]}>{`${TrainerTrainee.trainee.fName } ${TrainerTrainee.trainee.lName }` || ''}</Text>
                        <Text onLayout={(event) => handleInactiveChildLayout(event, index)} style={[styles.rightContainerTextCountryNotActive, { marginVertical: inactiveparentHeight?.[index] ? -((inactiveparentHeight?.[index]/2)-19) : 10 },isArabic ? styles.ArabicRightContainerTextCountry: styles.EnglishRightContainerTextCountry]}>{TrainerTrainee.trainee.country || ''}</Text>
                        <Text style={[styles.rightContainerTextStart,isArabic ? styles.ArabicRightContainerTextStart: styles.EnglishRightContainerTextStart]}>{TrainerTrainee.strDat || ''}</Text>
                        <Text style={[styles.rightContainerTextEnd,isArabic ? styles.ArabicRightContainerTextEnd: styles.EnglishRightContainerTextEnd]}>{TrainerTrainee.endDat || ''}</Text>
                    </View>
                    );
                    }
                    )}
                </View>
            </View>
          </Spacer>
        {/* <Spacer size="medium">
            <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{navigation.goBack();}}>
                <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
            </FormElemeentSizeButtonParentView>
        </Spacer> */}
        <Spacer size="large"></Spacer>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  membershipDateContainer: {
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:10,
    marginLeft:10,
    marginRight:10,
  },
  activeMembershipDateContainer:{
    marginBottom:30,
  },
  inactiveMembershipDateContainer:{
    marginBottom:30,
  },
  dateHeadersView:{
    flexDirection: 'row',
    justifyContent:"space-around",
    width:"100%",
    marginVertical: 10,
    marginBottom:20,
  },
  FromToViewText:{
    fontSize:16,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    flex: 1,
  },
  dateBodyView: {
    flexDirection: 'row',
    justifyContent:"space-around",
    width:"100%",
    marginVertical: 20,
  },
  rightContainerTextName:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flexWrap: 'wrap',
    flex: 1,
  },
  rightContainerTextNameForButton:{
    fontSize:14,
    color:"white",
    fontFamily:'OpenSans_400Regular',
    justifyContent:'center',
    alignItems:'center',
    textAlign:"center" ,
    padding:6,
    


  },
  rightContainerTextCountryActive:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    flexWrap: 'wrap',
    flex: 1,
  },

   rightContainerTextStart:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flex: 1,
  },
  rightContainerTextEnd:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flex: 1,
  },
  ArabicHeaderTraineeName:{
    position:'absolute',
    left:'5%',
  },
  EnglishHeaderTraineeName:{
    position:'absolute',
    left:'3%',
  },
  ArabicRightContainerTextName:{
    position:'absolute',
    left:'2%',
    backgroundColor:'#000',
    height:"auto",
    width:90,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    textAlign:"center",
    marginVertical: -5,

  },
  EnglishRightContainerTextName:{
    position:'absolute',
    left:'1%',
    backgroundColor:'#000',
    height:"auto",
    width:90,
    borderRadius:15,
    justifyContent:'center',
    alignItems:'center',
    textAlign:"center",
    marginVertical: -5,


  },
  ArabicRightContainerTextNameNotActive:{
    position:'absolute',
    left:'2%',
    width:70,
    },
  EnglishRightContainerTextNameNotActive:{
    position:'absolute',
    left:'3%',
    width:70,
// backgroundColor:"yellow",
  },
  
    rightContainerTextCountryNotActive:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flexWrap: 'wrap',
    flex: 1,
  },
  ArabicHeaderTraineeCountry:{
    position:'absolute',
    left:'29%',
  },
  EnglishHeaderTraineeCountry:{
    position:'absolute',
    left:'26%',
  },
  ArabicRightContainerTextCountry:{
    position:'absolute',
    left:'27%',
    width:60,
    // backgroundColor:"green",

  },
  EnglishRightContainerTextCountry:{
    position:'absolute',
    left:'27%',
    width:60,
// backgroundColor:"green",
  },
  ArabicHeaderTraineeStartDate:{
    position:'absolute',
    left:'50%',
  },
  EnglishHeaderTraineeStartDate:{
    position:'absolute',
    left:'50%',
  },
  ArabicRightContainerTextStart:{
    position:'absolute',
    left:'47%',
  },
  EnglishRightContainerTextStart:{
    position:'absolute',
    left:'47%',
  },
  ArabicHeaderTraineeEndDate:{
    position:'absolute',
    left:'74%',
  },
  EnglishHeaderTraineeEndDate:{
    position:'absolute',
    left:'74%',
  },
  ArabicRightContainerTextEnd:{
    position:'absolute',
    left:'72%',
  },
  EnglishRightContainerTextEnd:{
    position:'absolute',
    left:'72%',
  },
  badgeContainer: {
    position: "absolute",
    bottom: -10, // Adjust to place above the button
    right: -10, // Adjust to place at the corner
    backgroundColor: "#3f7eb3",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1, // Ensure it overlays the button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});