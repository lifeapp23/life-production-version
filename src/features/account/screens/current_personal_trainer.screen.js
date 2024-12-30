import React, { useState,useEffect } from 'react';
import { Dimensions,StyleSheet,ScrollView,View,Text,Modal,Alert} from "react-native";
import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  PageContainer,
  FormLabelView,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  ServiceCloseInfoButtonText,
  ServiceCloseInfoButtonTextView,
  ViewOverlay,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,
  GenderSelector,

} from "../components/account.styles";
import { Spinner } from '@ui-kitten/components';

import { Spacer } from "../../../components/spacer/spacer.component";
import { SelectItem  } from '@ui-kitten/components';
import "./i18n";
import { useTranslation } from 'react-i18next';
const { width } = Dimensions.get('window');

import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

import { addEventListener } from "@react-native-community/netinfo";

export const CurrentPersonalTrainerScreen = ({navigation,route}) => {
  const currentPersonalTrainerParam = route.params?.currentPersonalTrainer;
  const [selectedRatings,setSelectedRatings] =useState("");
  const [modalVisible,setModalVisible] = useState('');
  const [currentPersonalTrainerRow, setCurrentPersonalTrainerRow] = useState();
  const [userId,setUserId] = useState('');
  const [trainerIdNumb,setTrainerIdNumb] = useState('');
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);

  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [disableRatingButton,setDisableRatingButton] =  useState(false);

  const [trainerInfoFromUsersAndManageMProfTbls,setTrainerInfoFromUsersAndManageMProfTbls] =  useState({});
  const [traineeLastRateToTrainer,setTraineeLastRateToTrainer] =  useState({});

  const [trainerSubscriptionData,setTrainerSubscriptionData] =  useState({});
  const [AdminSettingsAppRowCont,setAdminSettingsAppRowCont] =  useState({});

  
  const [traineeAllSubscriptions,setTraineeAllSubscriptions] =  useState([]);
  const [existingTrainerPricingCont,setExistingTrainerPricingCont] =  useState([]);

  
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
    useFocusEffect(
    React.useCallback(() => {
      if (route.params?.currentPersonalTrainer) {
        setTrainerInfoFromUsersAndManageMProfTbls(route?.params?.currentPersonalTrainer);
      } else {
        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
  
        AsyncStorage.getItem("currentUser").then((user) => {
        const storedUser = JSON.parse(user);
        ////console.log('current personal user---->>>',storedUser);
        setUserId(storedUser.id);
        const fetchData = async () => { 
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
        if(state.isConnected){
          ////console.log('---------------now online--------')
  
  
          axios.get(`https://www.elementdevelops.com/api/get-trainers-Data-for-trainee?traineeId=${storedUser?.id}`, {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            //console.log('current personal Data from DB::',response?.data?.["trainer"]?.[0]);
            //console.log('trainer pricing  Data from DB::',response?.data?.["existingTrainerPricing"]);
  
            //console.log('trainer pricing  Data from DB::',response?.data?.["AdminSettingsAppRow"]);
          console.log('trainee_last_rate_to_trainer::',response?.data?.["trainee_last_rate_to_trainer"]?.[0]);
          setTraineeLastRateToTrainer(response?.data?.["trainee_last_rate_to_trainer"]?.[0] || {});
            setTrainerInfoFromUsersAndManageMProfTbls(response?.data?.["trainer"]?.[0] || {});
            console.log('response?.data?.["trainer"]?.[0]::',response?.data?.["trainer"]?.[0]);

            setExistingTrainerPricingCont(response?.data?.["existingTrainerPricing"] || {});
            setAdminSettingsAppRowCont(response?.data?.["AdminSettingsAppRow"] || {});
  
            
            const filterDataByTraineeId = (dataArray, traineeId) => {
              return dataArray.filter(item => item?.trneId === traineeId);
            };
            
            // Example traineeId to filter with
            const traineeId = 1;
            //console.log('1::');
  
            // Filter the data array based on the traineeId
            const filteredData = filterDataByTraineeId(response?.data?.["trainer_subscriptions_rows"], storedUser?.id);
            //console.log('2::');
  
            console.log('filteredData',filteredData);
            setTrainerIdNumb(filteredData?.[0]?.['trnrId']);
            //setTrainerSubscriptionData(filteredData[0]);
            //console.log('3::');
  
            ////console.log('response?.data?.["trainee_all_subscriptions"]',response?.data?.["trainee_all_trainers_profiles"])
            setTraineeAllSubscriptions(response?.data?.["trainee_all_trainers_profiles"]);
            //console.log('4::');
            if(response?.data?.["trainee_last_rate_to_trainer"]?.[0]){
              const updatedAt = new Date(response?.data?.["trainee_last_rate_to_trainer"]?.[0]?.updated_at);
              const subcribtionStartDate = new Date(filteredData?.[0]?.strDat);
              const subcribtionEndDate = new Date(filteredData?.[0]?.endDat);
              console.log('updatedAt::',updatedAt);
              console.log('subcribtionStartDate::',subcribtionStartDate);
              console.log('subcribtionEndDate::',subcribtionEndDate);
              if(updatedAt >= subcribtionStartDate && updatedAt <= subcribtionEndDate){
                console.log('trueeeee::');
                setDisableRatingButton(true);
              }else{
                console.log('falseeee::');

              }

            }
            // const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
            // ////console.log('userPublicSettings:', userPublicSettings);
            setLoadingPageInfo(false);
            //console.log('5::');
  
            
          })
          .catch(error => {
            setLoadingPageInfo(false);
  
            // Handle error
            ////console.log('Error fetching Trainer:', error?.response?.data?.message);
          });
          ////////////////all performed meals will go to the calendar/////////////////
  
          
  
          ////////////////////////////////////////////////////////////////////////////
  
        }else{
          setLoadingPageInfo(false);
  
          ////console.log('else no internet ahmed');
          Alert.alert(`${t("To_see_current_personal_trainer")}`,
              `${t("You_must_be_connected_to_the_internet")}`);
                
  
        }
  
        });
        
        // Unsubscribe
        unsubscribe();
      };
      fetchData();
        
        });
      });
      }
      setLoadingPageInfo(true);
      const timer = setTimeout(() => {
        setLoadingPageInfo(false);
      }, 7000); // 7 seconds
    }, [AsyncStorage,route.params?.currentPersonalTrainer])
      );
          
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Fetch the latest data or update the state here
  //   AsyncStorage.getItem("sanctum_token")
  //     .then((res) => {

  //     AsyncStorage.getItem("currentUser").then((user) => {
  //     const storedUser = JSON.parse(user);
  //     ////console.log('current personal user---->>>',storedUser);
  //     setUserId(storedUser.id);
  //     const fetchData = async () => { 
  //     const unsubscribe = addEventListener(state => {
  //       ////console.log("Connection type--", state.type);
  //       ////console.log("Is connected?---", state.isConnected);
  //       setTriainerConnected(state.isConnected);
  //     if(state.isConnected){
  //       ////console.log('---------------now online--------')


  //       axios.get(`https://www.elementdevelops.com/api/get-trainers-Data-for-trainee?traineeId=${storedUser.id}`, {
  //       headers: {
  //         'Authorization': `Bearer ${res}`,
  //         'Content-Type': 'application/json',
  //       },
  //       })
  //       .then(response => {
  //         // Handle successful response
  //         ////console.log('current personal Data from DB::',response.data);
  //         setTrainerInfoFromUsersAndManageMProfTbls(response?.data?.["trainer"]?.[0]);
          
  //         const filterDataByTraineeId = (dataArray, traineeId) => {
  //           return dataArray.filter(item => item.trneId === traineeId);
  //         };
          
  //         // Example traineeId to filter with
  //         const traineeId = 1;
          
  //         // Filter the data array based on the traineeId
  //         const filteredData = filterDataByTraineeId(response?.data?.["trainer_subscriptions_rows"], storedUser.id);

  //         ////console.log('filteredData',filteredData)
  //         //setTrainerSubscriptionData(filteredData[0]);

  //         ////console.log('response?.data?.["trainee_all_subscriptions"]',response?.data?.["trainee_all_trainers_profiles"])
  //         setTraineeAllSubscriptions(response?.data?.["trainee_all_trainers_profiles"]);
          
  //         // const userPublicSettings = response?.data?.["getTraineePublicSettings"]?.[0];
  //         // ////console.log('userPublicSettings:', userPublicSettings);

          
  //       })
  //       .catch(error => {
  //         // Handle error
  //         ////console.log('Error fetching Trainer:', error?.response?.data?.message);
  //       });
  //       ////////////////all performed meals will go to the calendar/////////////////

        

  //       ////////////////////////////////////////////////////////////////////////////

  //     }else{
  //       ////console.log('else no internet ahmed');
  //       Alert.alert("To see Plan's days",
  //           "You must be connected to the internet");
              

  //     }

  //     });
      
  //     // Unsubscribe
  //     unsubscribe();
  //   };
  //   fetchData();
      
  //     });
  //   });
  //   }, [AsyncStorage])
  //   );
  const hideModal = () => setModalVisible(false);
  const myPersonalTrainers= [
    {id:1,name:"Mohamed Al-Durrah",country:"Egypt",gender:'Him',ratings:"4.4",trainees:"6",price:"150",currency:"EGP",discount:"10%",status:"open",certificates:["ISSA","RGA"],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com",tiktok:"https://tiktok.com"},startDate:"2024-10-01",endDate:"2024-12-31",period:"3",about:"Mohamed al Duurah was reaised in Egypt, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
    {id:2,name:"Sarah Kenndy",country:"United Stated",gender:'Her',ratings:"1",trainees:"7",price:"100",currency:"USD",discount:"7.5%",status:"closed",certificates:["RGA","ISSA","CfA",'CNA'],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},startDate:"2023-10-31",endDate:"2024-06-31",period:"6",about:"Sarah Kenndy was reaised in United States, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
    {id:3,name:"Mario Elves",country:"Ireland",gender:'Him',ratings:"3.5",trainees:"10",price:"10",currency:"USD",discount:"0",status:"open",certificates:["ISSA","RGA","CfA",],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3","Arnold Pro4"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},startDate:"2024-07-31",endDate:"2024-10-31",period:"3",about:"Mario Elves was reaised in Ireland, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
];
  ////////////// Start ratingsData////////////////
  const ratingsData = [
    '1','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9',
    '2','2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9',
    '3','3.1','3.2','3.3','3.4','3.5','3.6','3.7','3.8','3.9',
    '4','4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9',
    '5',
  ];
  const renderRatingsOption = (title,i) => (
    <SelectItem title={title} key={i} />
  );
  const displayRatingsValue = ratingsData[selectedRatings?.row];
  ////////////// End ratingsData////////////////
  // useEffect(() => {
  //   const today = new Date().toISOString().split('T')[0];
  
  //   // Check if there are updated parameters from the navigation route
    
  // }, [route.params?.currentPersonalTrainer]);

  const pressingOnAddRating = async () => {
    
    if(!trainerIdNumb){
      Alert.alert(`${t('there_is_no_personal_trainer_to_rate')}`);
      return;
    }
    if(!displayRatingsValue){
      Alert.alert(`${t('you_should_select_rating_first')}`);
      return;
    }
    const newData = {
      userId:userId,
      trainerId:trainerIdNumb,
      ratingNum:displayRatingsValue,
      
    };

    ////console.log('newData: ',newData);
    
  
   if(triainerConnected){
    axios.post(`https://www.elementdevelops.com/api/trainer-rating-sending`, newData)
    .then((response) => {
        ////console.log('response?.data?.message', response?.data?.message);
        Alert.alert(`${t(' ')}`,`${t(response?.data?.message)}`);

      }).catch(error => {
          // Handle error
          
          Alert.alert(`${t(' ')}`,`${t(error?.response?.data?.message)}`);
        });
  

   }else{
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
  }
  ////console.log('displayRatingsValue',displayRatingsValue);
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          {
            (loadingPageInfo)?(
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={loadingPageInfo}
                  // onRequestClose={() => {
                  //   setIsLoading(!isLoading);
                  // }}
                  >
                  
                  <View style={styles.modalContainer}>
                    <View style={styles.loadingBox}>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </View>
                  </View>
                </Modal>
                ):(
                      (Object.keys(trainerInfoFromUsersAndManageMProfTbls)?.length > 0)?(
                        <>
                            {/* <ServicesPagesCardCover >
                          <ServicesPagesCardAvatarIcon icon="tape-measure">
                          </ServicesPagesCardAvatarIcon>
                          <ServicesPagesCardHeader style={{textAlign:'center',}}>
                          {trainerInfoFromUsersAndManageMProfTbls?.fName ? `${trainerInfoFromUsersAndManageMProfTbls?.fName} ${trainerInfoFromUsersAndManageMProfTbls?.lName}` : `${t('No_Current_Personal_Trainer')}`}
                          </ServicesPagesCardHeader>
                        </ServicesPagesCardCover> */}
                      <ServicesPagesCardCover>
                          {
                            (
                              trainerInfoFromUsersAndManageMProfTbls?.images != "" && trainerInfoFromUsersAndManageMProfTbls?.images != "null" && trainerInfoFromUsersAndManageMProfTbls?.images != null
                            )?
                            (
                              <PageMainImage
                            source={{
                              uri: `${trainerInfoFromUsersAndManageMProfTbls?.images}`
                            }}
                          />
                            ):(
                              <>
                                <ServicesPagesCardAvatarIcon icon="tape-measure">
                                  </ServicesPagesCardAvatarIcon>
                                <ServicesPagesCardHeader style={{textAlign:'center',}}>
                                {trainerInfoFromUsersAndManageMProfTbls?.fName ? `${trainerInfoFromUsersAndManageMProfTbls?.fName} ${trainerInfoFromUsersAndManageMProfTbls?.lName}` : `${t('No_Current_Personal_Trainer')}`}
                                </ServicesPagesCardHeader>
                              </>
                            )
                          }
                      
                      </ServicesPagesCardCover>
                      <Spacer size="large">
                        <View style={{flex:1,flexDirection:"column",}}>
                          <FormLabelView style={{width:"100%"}}>
                            <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t("About")}</FormLabel>
                          </FormLabelView>
                          <ServiceCloseInfoButtonTextView style={{marginLeft:10,marginRight:10,}}>
                            <ServiceCloseInfoButtonText>
                            {trainerInfoFromUsersAndManageMProfTbls?.about ? trainerInfoFromUsersAndManageMProfTbls?.about : `${t('No_info_found')}`}
                            </ServiceCloseInfoButtonText>
                          </ServiceCloseInfoButtonTextView>
                        </View>
                      </Spacer>
                      <Spacer size="large">
                        <View >
                          <FormLabelView style={{width:"100%"}}>
                            <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t("Membership")}</FormLabel>
                          </FormLabelView>
                          <View style={styles.membershipDateContainer}> 
                            <View style={styles.dateHeadersView}>
                              <Text style={styles.FromToViewText}>{t('Start')}</Text>
                              <Text style={styles.FromToViewText}>{t('End')}</Text>
                              <Text style={styles.FromToViewText}>{t('Period')}</Text>
                            </View>
                            <View style={styles.dateBodyView}>
                              <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextStartDate : styles.EnglishRightContainerTextStartDate]}>
                              {trainerInfoFromUsersAndManageMProfTbls?.strDat ? (trainerInfoFromUsersAndManageMProfTbls?.strDat) : (`${t('No_found')}`)}
                              </Text>
                              <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextEndDate : styles.EnglishRightContainerTextEndDate]}>
                              {trainerInfoFromUsersAndManageMProfTbls?.endDat ? trainerInfoFromUsersAndManageMProfTbls?.endDat : `${t('No_found')}`}
                              </Text>
                              <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextPeriodDate : styles.EnglishRightContainerTextPeriodDate]}>
                              {(trainerInfoFromUsersAndManageMProfTbls?.period) ? (`${trainerInfoFromUsersAndManageMProfTbls?.period}`) : (`${t('No_found')}`)}</Text>
                            </View>
                          </View>
                        </View>
                      </Spacer>
                      <Spacer size="small">
                        <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                          <FormElemeentSizeButtonView style={{width:"49%"}}>
                            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>navigation.navigate('SubscribePage',{ newPersonalTrainer: trainerInfoFromUsersAndManageMProfTbls,existingTrainerPricingCont:existingTrainerPricingCont,AdminSettingsAppRowConst:AdminSettingsAppRowCont})}>
                            <CalendarFullSizePressableButtonText >{t('Renew')}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                          </FormElemeentSizeButtonView>
                          <FormElemeentSizeButtonView style={{width:"49%"}}> 
                            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={() => navigation.navigate('MembershipsHistory',{ traineeAllSubscriptionsCon: traineeAllSubscriptions})}>
                            <CalendarFullSizePressableButtonText >{t('History')}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                          </FormElemeentSizeButtonView>
                        </FormElemeentSizeButtonParentView>
                      </Spacer>
                      <Spacer size="medium">
                        <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                          <FormElemeentSizeButtonView style={{width:"49%"}}>
                            <CalendarFullSizePressableButton disabled={disableRatingButton} style={[
                                      {backgroundColor:'#000'},
                                      disableRatingButton && {backgroundColor: '#aaa'} // Apply additional styles when disabled
                                    ]}
                                    onPress={()=>navigation.navigate('RatingCurrentPersonalTrainer')}>
                            <CalendarFullSizePressableButtonText >{t('Rating')}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                          </FormElemeentSizeButtonView>
                          <Spacer size="medium">
                            <Modal visible={modalVisible} transparent={true} animationType="fade">
                              <ViewOverlay style={{backgroundColor:'#455357'}}>
                                <View style={{position:'absolute',top:"50%"}}>
                                  <InputField>
                                    <FormLabelView>
                                      <FormLabel>{t('Ratings')}:</FormLabel>
                                    </FormLabelView>
                                      <GenderSelector
                                        selectedIndex={selectedRatings}
                                        onSelect={(index) => setSelectedRatings(index)}
                                        placeholder={t('Select_Ratings')}
                                        value={displayRatingsValue}
                                      >
                                        {ratingsData.map(renderRatingsOption)}
                                      </GenderSelector>
                                  </InputField>
                                  <Spacer size="medium">
                                    <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                                      <FormElemeentSizeButtonView style={{width:"49%"}}>
                                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={pressingOnAddRating}>
                                        <CalendarFullSizePressableButtonText >{t('Add_Rating')}</CalendarFullSizePressableButtonText>
                                      </CalendarFullSizePressableButton>
                                      </FormElemeentSizeButtonView>
                                      <FormElemeentSizeButtonView style={{width:"49%"}}> 
                                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}>
                                        <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                                      </CalendarFullSizePressableButton>
                                      </FormElemeentSizeButtonView>
                                    </FormElemeentSizeButtonParentView>
                                  </Spacer>
                                </View>
                              </ViewOverlay>
                            </Modal>
                          </Spacer>
                          <FormElemeentSizeButtonView style={{width:"49%"}}> 
                            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{navigation.navigate('PersonalTrainerSearch');}}>
                            <CalendarFullSizePressableButtonText >{t('Search')}</CalendarFullSizePressableButtonText>
                          </CalendarFullSizePressableButton>
                          </FormElemeentSizeButtonView>
                        </FormElemeentSizeButtonParentView>
                      </Spacer>

                        </>
                    ):(
                      <>
                      <Text style={{width: width - 20,color:'black',fontSize:20 ,marginTop:20,textAlign:"center",marginLeft:10,marginRight:10}}>{t('You_are_not_subscribed_to_any_personal_trainer')}</Text>
                      <FormElemeentSizeButtonView style={{width: width - 20,marginTop:20,marginLeft:10,marginRight:10}}> 
                        <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{navigation.navigate('PersonalTrainerSearch');}}>
                          <CalendarFullSizePressableButtonText >{t('Search')}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                      </FormElemeentSizeButtonView>
                      </>
                    )
                )
          }
          
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
  dateHeadersView:{
    flexDirection: 'row',
    justifyContent:"space-around"
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
    marginBottom:40,
    width:"100%",
  },
  rightContainerText:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    
  },
  EnglishRightContainerTextStartDate:{
    position:"absolute",
    left:"0%",
  },
  ArabicRightContainerTextStartDate:{
    position:"absolute",
    left:"0%",
  },
  EnglishRightContainerTextEndDate:{
    position:"absolute",
    left:"32%",
  },
  ArabicRightContainerTextEndDate:{
    position:"absolute",
    left:"32%",
  },
  EnglishRightContainerTextPeriodDate:{
    position:"absolute",
    left:"65%",
  },
  ArabicRightContainerTextPeriodDate:{
    position:"absolute",
    left:"65%",
  },
modalContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        },
        loadingBox: {
          width: 150,
          height: 150,
          backgroundColor: '#333', // dark background for the loading box
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

});