import React, { useState,useContext,useEffect } from 'react';
import { ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable} from "react-native";
import { Spinner } from '@ui-kitten/components';

import {AntDesign} from '@expo/vector-icons';
import { StackActions } from '@react-navigation/native';

import {
  Title,
  TitleView,
  InputField,
  FormInput,
  FormLabel,
  PageContainer,
  FormLabelView,
  FormInputView,
  ServicesPagesCardCover,
  PageMainImage,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  CalendarFullSizePressableButtonText,
  CalendarFullSizePressableButton,
  ViewOverlay,
  CountryParent,
  CountryPickerView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  ServiceInfoParentView,
  ServiceCloseInfoButtonView,
  ServiceCloseInfoButton,
  ServiceCloseInfoButtonAvatarIcon,
  ServiceCloseInfoButtonText,
  ServiceInfoButtonView,
  ServiceInfoButton,
  ServiceInfoButtonAvatarIcon,
  ServiceCloseInfoButtonTextView,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { useDispatch, useSelector } from 'react-redux';
import { addTrainerPricingEntry,editTrainerPricingEntry, removeTrainerPricingEntry, addDiscountEntry,editDiscountEntry,removeDiscountEntry} from './trainer_pricing_store';
import { PlansCalendarScreen } from "./CustomCalendar.screen";
import CurrencyPicker from "react-native-currency-picker";
import { addEventListener } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { insertTrainerPricingCurrency,fetchTrainerPricingCurrency,deleteTrainerPricingCurrencyRow} from "../../../../database/trainer_pricing_currency";
import { insertTrainerDiscount,fetchTrainerDiscount,deleteTrainerDiscountRow} from "../../../../database/trainer_pricing_discount";
import "./i18n";
import { useTranslation } from 'react-i18next';

import axios from 'axios';
import AuthGlobal from "../Context/store/AuthGlobal";

export const TrainerPricingScreen = ({navigation}) => {
  const context = useContext(AuthGlobal);

  const [views, setViews] = useState([]);
  const [editedEntry, setEditedEntry] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDiscountEntry, setEditedDiscountEntry] = useState(null);
  const [isEditDiscountMode, setIsEditDiscountMode] = useState(false);
  const dispatch = useDispatch();
  const [modalNewPriceVisible,setModalNewPriceVisible] = useState('');
  const [modalNewDiscountVisible,setModalNewDiscountVisible] = useState('');
  const [userId, setUserId] = useState("");  
  const [userToken, setUserToken] = useState("");  
  const speKey = userId + '.' + new Date().getTime();
  const [triainerConnected,setTriainerConnected] =  useState(false);
  const [dataTrainerPricing, setDataTrainerPricing] = useState([]);
  const [discountDataTable, setDiscountDataTable] = useState([]);
  const [AdminSettingsData,setAdminSettingsData]=useState({});
  const [isAllowForeignTrainersOn, setIsAllowForeignTrainersOn] = useState(false);
  const [loadingPageInfo, setLoadingPageInfo] = useState(true);

  const [showInfo, setShowInfo] = useState(false);  

  const toggleNoteInfo = () => {
    setShowInfo(!showInfo);
  };
  const showAddModal = () => {
    setModalNewPriceVisible(true);
    setIsEditMode(false);
    setIsEditMode(false);
  };
  const { t, i18n } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
    AsyncStorage.getItem("sanctum_token")
    .then((res) => {
      ////console.log('tokeeen:',res);
      setUserToken(res);
    AsyncStorage.getItem("currentUser").then((user) => {
  
        const storedUser = JSON.parse(user);
        setUserId(storedUser.id);
  
        
        const unsubscribe = addEventListener(state => {
          ////console.log("Connection type--", state.type);
          ////console.log("Is connected?---", state.isConnected);
          setTriainerConnected(state.isConnected);
        if(state.isConnected){
          setLoadingPageInfo(true);

          ////console.log('---------------now online--------')
          ////console.log('---------------now online--------')
        axios.get('https://life-pf.com/api/get-trainer-price', {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            //console.log('context?.stateUser?.userProfile?.country:', context?.stateUser?.userProfile?.country);
            
            //console.log('user_info:', response?.data["user_info"]);

            //console.log('AdminSettingsAppRow:', response?.data["AdminSettingsAppRow"]);
            // response?.data["AdminSettingsAppRow"]
            let AllowForeignTrainers = (response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false
            //console.log('AllowForeignTrainers:', AllowForeignTrainers);

            if(response?.data["user_info"]?.country != "Egypt" && AllowForeignTrainers == false){
              setLoadingPageInfo(false);

              Alert.alert(``,`${t('Application_does_not_support_you_country_as_a_trainer_please_come_back_later')}`,
        [
        {
            text: 'OK',
            onPress: () => {
              navigation.dispatch(StackActions.pop(1));
            },
        },
        ],
        { cancelable: false }
    );
    
        }else{
              setLoadingPageInfo(false);

              setAdminSettingsData(response?.data["AdminSettingsAppRow"]);
              setIsAllowForeignTrainersOn((response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false);

              setDataTrainerPricing(response?.data["profile"]);
            }
            
          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching profile:', error);
            setLoadingPageInfo(false);

          });

          axios.get('https://life-pf.com/api/get-trainer-discount', {
          headers: {
            'Authorization': `Bearer ${res}`,
            'Content-Type': 'application/json',
          },
          })
          .then(response => {
            // Handle successful response
            ////console.log('discount data:', response?.data);
            setDiscountDataTable(response?.data);
            setLoadingPageInfo(false);

          })
          .catch(error => {
            // Handle error
            ////console.log('Error fetching discount:', error);
            setLoadingPageInfo(false);

          });

        }else{
          setLoadingPageInfo(false);

          ////console.log('else no internet ahmed');
        //   fetchTrainerPricingCurrency(storedUser.id).then((response) => {
        //     ////console.log('Trainer Pricing without internet coming from offline database', response?.data.message);
        //     setDataTrainerPricing(response);    
        //   }).catch(error => {
        //           // Handle error
        //           //console.error('Error inserting Trainer Pricing:', error);
        //         });
        // fetchTrainerDiscount(storedUser.id).then((response) => {
        //   ////console.log('Trainer Discount without internet coming from offline database', response?.data.message);
        //   setDiscountDataTable(response);    
        // }).catch(error => {
        //         // Handle error
        //         //console.error('Error inserting Trainer Discount:', error);
        //       });       
                

        }

        });
        
        // Unsubscribe
        unsubscribe();
      })
    });
   
  
  }, [])
  );

  const showEditModal = (entry) => {
    setModalNewPriceVisible(true);
    setIsEditMode(true);
    setEditedEntry(entry);
  };
  const hideNewPriceModal = () => {
    setModalNewPriceVisible(false);
    setIsEditMode(false);
    setEditedEntry(null);
  };
  const showAddNewDiscountModal = () => {
    setModalNewDiscountVisible(true);
    setIsEditDiscountMode(false);
    setIsEditDiscountMode(false);
  };

  const showEditDiscountModal = (entry) => {
    setModalNewDiscountVisible(true);
    setIsEditDiscountMode(true);
    setEditedDiscountEntry(entry);
  };
  const hideDiscountModal = () => {
    setModalNewDiscountVisible(false);
    setIsEditDiscountMode(false);
    setEditedDiscountEntry(null);
  };
  const predefinedTrainerPricingData = useSelector(state => state.predefinedTrainerPricingData.predefinedTrainerPricingData);
  const discountData = useSelector(state => state.discountData.discountData);

  
  const getNextTrainerPricingId = () => {
    const maxId = Math.max(...dataTrainerPricing.map(item => item.id), 0);
    return maxId + 1;
  };
  const removeTrainerPricingItem = (item) => {
    ////console.log('item,:',item);
    if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-pricing-currency-deleting`, item)
      .then((response) => {
        //console.log('$trainerPricingAfterRemovinge Database', response?.data?.trainerPricingAfterRemoving);
          setDataTrainerPricing(response?.data?.trainerPricingAfterRemoving)
          Alert.alert(`${t('Your_Pricing_Deleted_from_Database_successfully')}`);
              });

      // deleteTrainerPricingCurrencyRow(item).then((response) => {
      //   ////console.log('Trainer Pricing data Deleted from offline database', response);
      //       }).catch(error => {
      //         // Handle error
      //         //console.error('Error inserting Trainer Pricing:', error);
      //       });   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };
  const getNextDiscountDataId = () => {
    const maxId = Math.max(...discountDataTable.map(item => item.id), 0);
    return maxId + 1;
  };
  const removeDiscountDataItem = (item) => {
    ////console.log('item,:',item);
    if(triainerConnected){
      axios.post(`https://life-pf.com/api/trainer-discount-currency-deleting`, item)
      .then((response) => {
          ////console.log('Trainer Discount data sent to online Database', response?.data?.message);
          setDiscountDataTable(response?.data?.emptyItem)
          Alert.alert(`${t('Your_Discount_Deleted_from_Database_successfully')}`);
              });

      // deleteTrainerDiscountRow(item).then((response) => {
      //   ////console.log('Trainer Discount data Deleted from offline database', response);
      //       }).catch(error => {
      //         // Handle error
      //         //console.error('Error inserting Trainer Discount:', error);
      //       });   
     }else{
      Alert.alert(`${t('To_Delete_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
  };
  
 

  const AddEntryTrainerPricing =({isEditMode,editedEntry,hideModal,setDataTrainerPricing})=>{
   
    const [priceAddEntry, setPriceAddEntry] = useState("");     
    const [countryCurrency, setCountryCurrency] = useState('');
    const [editedSpeKey, setEditedSpeKey] = useState('');

    // const [changeCountryCurrency, setChangeCountryCurrency] = useState('');     
   // const changeCurrency = () =>{
  //   if (countryCurrency === ""){
  //     setChangeCountryCurrency('');
  //   }
  //   else if (countryCurrency === "EGP"){
  //     setChangeCountryCurrency('EGP');
  //   }else{
  //     setChangeCountryCurrency('USD');
  //   }
  // }
  // useEffect(() => {
  //   changeCurrency();
  // }, [countryCurrency]);  
  const addTrainerPricingEntryHandler = async () => {

  const newData = {
    userId:userId,
    speKey:speKey,
    curncy:countryCurrency,
    price:parseFloat(priceAddEntry).toFixed(2),
    deleted:"no",
    isSync:'no'
  };
  ////console.log('newData: ',newData);
  

 if(triainerConnected){
  axios.post(`https://life-pf.com/api/TrainerPricingCurrencyByPressing-insert-data`, newData)
  .then((response) => {
      ////console.log('Trainer Pricing data sent to online Database', response?.data?.message);
      setDataTrainerPricing(response?.data?.newData)
      Alert.alert(`${t(' ')}`,`${t('Your_Pricing_added_to_Database_successfully')}`,
                [
                {
                    text: 'OK',
                    onPress: () => {
                      hideModal();
                    },
                },
                ],
                { cancelable: false }
            );
        
          });

  // insertTrainerPricingCurrency(newData).then((response) => {
  //   ////console.log('Trainer Pricing data sent to offline database', response);
  //       }).catch(error => {
  //         // Handle error
  //         //console.error('Error inserting Trainer Pricing:', error);
  //       });   
 }else{
  Alert.alert(`${t('To_Add_your_data')}`,
  `${t('You_must_be_connected_to_the_internet')}`);
 }
  

};
    // const addTrainerPricingEntryHandler = () => {
    //   if (countryCurrency && priceAddEntry) {
    //     const newTrainerPricingData = {
    //       id: getNextTrainerPricingId(),
    //       currency:countryCurrency,
    //       pricing:(parseFloat(priceAddEntry).toFixed(2)).toString(),
    //     };

    //     dispatch(addTrainerPricingEntry(newTrainerPricingData));
    //     setDataTrainerPricing((prevData) => [...prevData, newTrainerPricingData]); // Update the local state
    //     // Update total values
        
    //   }
    // };
    useEffect(() => {
      if (isEditMode) {
        // If in edit mode, populate the form fields with the data from the edited entry
        setCountryCurrency(editedEntry?.curncy);
        setPriceAddEntry(editedEntry?.price);
        setEditedSpeKey(editedEntry?.speKey);
      }
    }, [isEditMode, editedEntry]);
    const editTrainerPricingEntryHandler = () => {
      if (editedEntry) {
          
        const newData = {
          userId:userId,
          speKey:editedSpeKey,
          curncy:countryCurrency,
          price:parseFloat(priceAddEntry).toFixed(2),
          deleted:"no",
          isSync:'no'
        };
        ////console.log('newData edited: ',newData);
        
      
          if(triainerConnected){
            axios.post(`https://life-pf.com/api/TrainerPricingCurrencyByPressing-insert-data`, newData)
            .then((response) => {
                ////console.log('Trainer Pricing editing data sent to online Database', response?.data?.message);
                ////console.log('Trainer Pricing new edited data', response?.data?.newData);
                setDataTrainerPricing(response?.data?.newData)
                Alert.alert(`${t(' ')}`,
                  `${t('Your_Pricing_updated_in_Database_successfully')}`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Clear the edited entry state
                        setEditedEntry(null);
                        // Close the modal
                        hideModal();
                      },
                    },
                  ],
                  { cancelable: false }
                );   
        
                });
                

            // insertTrainerPricingCurrency(newData).then((response) => {
            //   ////console.log('Trainer Pricing editing data sent to offline database', response);
            //       }).catch(error => {
            //         // Handle error
            //         ////console.log('Error inserting Trainer Pricing:', error);
            //       });   
          }else{
            Alert.alert(`${t('To_update_your_data')}`,
            `${t('You_must_be_connected_to_the_internet')}`);
          }
        }
      
    
      
    };
    

    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{isEditMode ? `${t('Edit_Price')}` : `${t('Add_New_Price')}`}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
        <Spacer size="large">
        <InputField>
          <CountryParent>
              <FormLabelView>
                <FormLabel>{t('Currency')}:</FormLabel>
              </FormLabelView>
            <CountryPickerView >
            <CurrencyPicker
              enable={true}
              currencyCode={countryCurrency || `${t("Select_Currency")}`}
              showFlag={false}
              darkMode={false}
              showCurrencyName={false}
              showCurrencyCode={true}
              onSelectCurrency={(data) => { setCountryCurrency(data.code); }}
              showNativeSymbol={false}
              showSymbol={false}
              containerStyle={{
                container: {marginLeft:8,},
                flagWidth: 25,
                currencyCodeStyle: {color:"black",fontSize:14},
                currencyNameStyle: {},
                symbolStyle: {},
                symbolNativeStyle: {},
              }}
              modalStyle={{
                container: {backgroundColor:'#455357'},
                searchStyle: {color:"black"},
                tileStyle: {color:"white"},
                itemStyle: {
                  itemContainer: {backgroundColor:'#455357'},
                  flagWidth: 25,
                  currencyCodeStyle: {color:"white"},
                  currencyNameStyle: {color:"white"},
                  symbolStyle: {},
                  symbolNativeStyle: {color:"white"},
                },
              }}
              title={t('Currency')}
              searchPlaceholder={t('Search')}
              showCloseButton={true}
              showModalTitle={true}
            />
          </CountryPickerView>
          </CountryParent>
        </InputField>
      </Spacer>
      <Spacer size="medium">
        <InputField>
        <FormLabelView>
          <FormLabel>{t('Price')}:</FormLabel>
        </FormLabelView>
        <FormInputView>
          <FormInput
            placeholder={t('Price')}
            value={priceAddEntry}
            keyboardType="numeric"
            theme={{colors: {primary: '#3f7eb3'}}}
            onChangeText={(u) => setPriceAddEntry(u)}
          />
          </FormInputView>
          </InputField>
        </Spacer>
        
      <Spacer size="large">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{ backgroundColor: '#000' }} onPress={() => {
              if (countryCurrency && priceAddEntry) {
                if (isEditMode) {
                  // If in edit mode, call the edit handler
                  editTrainerPricingEntryHandler();
                } else {
                  // If in add mode, call the add handler
                  addTrainerPricingEntryHandler();
                }
                
              } else {
                Alert.alert(`${t("You_must_fill_Currency_and_price_fields")}`);
              }
            }}>
              <CalendarFullSizePressableButtonText>
                {isEditMode ? `${t('Edit_Price')}` : `${t('Add_New_Pricing')}`}
              </CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      {/* <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}>
            <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer> */}
      </ScrollView>
      
      </PageContainer>
    );
  };
  const [hideButtonClicks, setHideButtonClicks] = useState(false);

  const AddEntryDiscount =({isEditDiscountMode,editedDiscountEntry,hideModal})=>{
   
    const [discountAddEntry, setDiscountAddEntry] = useState("");     
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState({});
    const [discountEditedSpeKey, setDiscountEditedSpeKey] = useState('');


    // const [changeCountryCurrency, setChangeCountryCurrency] = useState('');
    
   // const changeCurrency = () =>{
  //   if (countryCurrency === ""){
  //     setChangeCountryCurrency('');
  //   }
  //   else if (countryCurrency === "EGP"){
  //     setChangeCountryCurrency('EGP');
  //   }else{
  //     setChangeCountryCurrency('USD');
  //   }
  // }
  // useEffect(() => {
  //   changeCurrency();
  // }, [countryCurrency]); 
  const handleOpenCalendar = () => {
    setCalendarVisible(true);
    
  };

  const handleCloseCalendar = () => {
    setCalendarVisible(false);
  };
  const handleSelectDateRange = (start, end) => {
    // Check if the selected end date is before the start date
    if (end < start) {
      // Swap the dates if needed
      const temp = start;
      start = end;
      end = temp;
    }
    setSelectedDates({start,end});
    handleCloseCalendar();
  };
  const addDiscountEntryHandler = async () => {
    if (discountAddEntry.trim() == "" || !selectedDates.start || !selectedDates.end) {
      Alert.alert(`${t("You_must_fill_discount_and_select_start_and_end_dates_fields")}`);
      return;
    }
    const newData = {
      userId:userId,
      speKey:speKey,
      discont:discountAddEntry,
      strDat:selectedDates.start,
      endDat: selectedDates.end,
      deleted:"no",
      isSync:'no'
    };
    ////console.log('newData: ',newData);
    
  
   if(triainerConnected){
    axios.post(`https://life-pf.com/api/TrainerDiscountCurrencyByPressing-insert-data`, newData)
    .then((response) => {
        ////console.log('Trainer Discount data sent to online Database', response?.data?.message);
        setDiscountDataTable(response?.data?.newData);
        
        Alert.alert(`${t(' ')}`,
              `${t('Your_Discount_updated_to_Database_successfully')}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    hideModal();
                    setEditedDiscountEntry(null);
                  },
                },
              ],
              { cancelable: false }
            );
      }).catch(error => {
        // Handle error
        
        Alert.alert(error?.response?.data?.message);
      });
  
    // insertTrainerDiscount(newData).then((response) => {
    //   ////console.log('Trainer Discount data sent to offline database', response);
    //       }).catch(error => {
    //         // Handle error
    //         //console.error('Error inserting Trainer Discount:', error);
    //       });   
   }else{
    Alert.alert(`${t('To_Add_your_data')}`,
    `${t('You_must_be_connected_to_the_internet')}`);
   }
    
  
  };

  useEffect(() => {
    if (isEditDiscountMode) {
      // If in edit mode, populate the form fields with the data from the edited entry
      setDiscountAddEntry(editedDiscountEntry?.discont);
      const start = editedDiscountEntry?.strDat;
      const end = editedDiscountEntry?.endDat;
      setSelectedDates({start,end});
      setDiscountEditedSpeKey(editedDiscountEntry?.speKey);
    }
  }, [isEditDiscountMode,editedDiscountEntry]);

  const editDiscountEntryHandler = () => {
    if (discountAddEntry.trim() == "" || !selectedDates.start || !selectedDates.end) {
      Alert.alert(`${t('You_must_fill_discount_and_select_start_and_end_dates_fields')}`);
      return;
    }
    if (editedDiscountEntry) {
      const newData = {
        userId:userId,
        speKey:discountEditedSpeKey,
        discont:discountAddEntry,
        strDat:selectedDates.start,
        endDat: selectedDates.end,
        deleted:"no",
        isSync:'no'
      };
      ////console.log('newData: ',newData);
      
    
     if(triainerConnected){
      axios.post(`https://life-pf.com/api/TrainerDiscountCurrencyByPressing-insert-data`, newData)
      .then((response) => {
          ////console.log('Trainer Discount data sent to online Database', response?.data?.message);
          setDiscountDataTable(response?.data?.newData);
            Alert.alert(`${t(' ')}`,
              `${t('Your_Discount_updated_to_Database_successfully')}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    hideModal();
                    setEditedDiscountEntry(null);
                  },
                },
              ],
              { cancelable: false }
            );
          }).catch(error => {
            // Handle error
            
            Alert.alert(error?.response?.data?.message);
          });
    
      // insertTrainerDiscount(newData).then((response) => {
      //   ////console.log('Trainer Discount data sent to offline database', response);
      //       }).catch(error => {
      //         // Handle error
      //         //console.error('Error inserting Trainer Discount:', error);
      //       });   
     }else{
      Alert.alert(`${t('To_Add_your_data')}`,
      `${t('You_must_be_connected_to_the_internet')}`);
     }
      
    }
  
    // Clear the edited entry state
    //setEditedDiscountEntry(null);
    // Close the modal
    
  };
  


    return (
      <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover>
            <ServicesPagesCardAvatarIcon icon="target-account">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader>{isEditDiscountMode ? `${t('Edit_Discount')}` : `${t('Add_Discount')}`}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
        <Spacer size="medium">
          <InputField>
          <FormLabelView>
            <FormLabel>{t('Discount')}(%):</FormLabel>
          </FormLabelView>
          <FormInputView>
            <FormInput
              placeholder={`${t('Discount')}(%)`}
              value={discountAddEntry}
              keyboardType="default"
              theme={{colors: {primary: '#3f7eb3'}}}
              onChangeText={(u) => setDiscountAddEntry(u)}
            />
          </FormInputView>
          </InputField>
        </Spacer>
         <Spacer size="medium">
            <InputField>
                <FormLabelView>
                  <FormLabel>{t('Select_Dates')}:</FormLabel>
                </FormLabelView>
                <CalendarFullSizePressableButton style={{width:"67%",backgroundColor:'#000'}}
          onPress={handleOpenCalendar}>
                  <CalendarFullSizePressableButtonText >{t('Select_Dates')}</CalendarFullSizePressableButtonText>
                </CalendarFullSizePressableButton>
              <PlansCalendarScreen isVisible={isCalendarVisible} onClose={handleCloseCalendar} onSelectDateRange={handleSelectDateRange} />
            </InputField>
          </Spacer>
          <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('Start_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.start ? selectedDates.start : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t('End_Date')}:</FormLabel>
            </FormLabelView>
                <FormLabelDateRowView><FormLabelDateRowViewText>{selectedDates.end ? selectedDates.end : ""}</FormLabelDateRowViewText></FormLabelDateRowView>
            </InputField>
        </Spacer>
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
            <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{
                  // if (discountAddEntry && selectedDates.start && selectedDates.end) {
                  if (isEditDiscountMode) {
                  // If in edit mode, call the edit handler
                  editDiscountEntryHandler({ id: editedDiscountEntry.id, updatedData: {discountPercent: discountAddEntry, startDate:selectedDates.start ,endDate:selectedDates.end} });
                  } else {
                    // If in add mode, call the add handler
                    addDiscountEntryHandler();
                  }
                  
                // }else{Alert.alert("You must fill country & discount & select start & end dates fields");}
                }}>
              <CalendarFullSizePressableButtonText>
                {isEditDiscountMode ? `${t('Edit_Discount')}` : `${t('Add_New_Discount')}`}
              </CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="medium">
        <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
          <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={hideModal}>
            <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
          </CalendarFullSizePressableButton>
        </FormElemeentSizeButtonParentView>
      </Spacer>
      <Spacer size="large"></Spacer>
      </ScrollView>
      
      </PageContainer>
    );
  };
  const isArabic = i18n.language === 'ar';

  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
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
            {/* <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t('Pricing')}</ServicesPagesCardHeader>
            </ServicesPagesCardCover> */}
            <ServicesPagesCardCover>
              <PageMainImage
                source={require('../../../../assets/pricing_section.jpeg')} 
                  // style={{width:"100%",height:"100%",borderRadius:30}}
                />
            </ServicesPagesCardCover>
            <ServiceInfoParentView >
        {showInfo ? (
          <ServiceCloseInfoButtonView>
            <ServiceCloseInfoButton onPress={toggleNoteInfo}>
              <ServiceCloseInfoButtonAvatarIcon icon="close-circle" size={60} />
            </ServiceCloseInfoButton>
            <ServiceCloseInfoButtonTextView>
              <ServiceCloseInfoButtonText>{t("note_pricing_page")}</ServiceCloseInfoButtonText>
            </ServiceCloseInfoButtonTextView>
          </ServiceCloseInfoButtonView>
        ) : (
          <ServiceInfoButtonView>
            <ServiceInfoButton onPress={toggleNoteInfo}>
            <ServiceInfoButtonAvatarIcon icon="information" size={60} />
            </ServiceInfoButton>
          </ServiceInfoButtonView>
        )}
    </ServiceInfoParentView>
            <View style={styles.container}>
            <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t('Pricing')}</FormLabel>
            </FormLabelView> 
            {(dataTrainerPricing?.length >= 1) ? (
              <View style={styles.headerTrainerPricing}>
              
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCountry : styles.EnglishHeaderTrainerPricingCountry]}>{t('Country')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCurrency : styles.EnglishHeaderTrainerPricingCurrency]}>{t('Currency')}</Text>

                
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingNetPrice : styles.EnglishHeaderTrainerPricingNetPrice]}>{t('Net_Price')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingCount : styles.EnglishHeaderTrainerPricingCount]}>{t('Count')}</Text>

                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingPeriod : styles.EnglishHeaderTrainerPricingPeriod]}>{t('Period')}</Text>

                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderTrainerPricingDiscount : styles.EnglishHeaderTrainerPricingDiscount]}>{t('Discount')}</Text>

              </View>
            ):null}
            
            {dataTrainerPricing?.map((onePrice) => (
                <View key={onePrice?.speKey} style={styles.viewContainer}>
                  <View style={styles.trainerPricingContainer}>     
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCountry : styles.EnglishTrainerPricingCountry]}>{(onePrice?.wrldwd == "1" || onePrice?.wrldwd == "yes" || onePrice?.wrldwd == "true" || onePrice?.wrldwd == true) ? ("Worldwide ") : (onePrice?.ctryNm ? onePrice?.ctryNm : '')}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCurrency : styles.EnglishTrainerPricingCurrency]}>{onePrice?.curncy || '0'}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingNetPrice : styles.EnglishTrainerPricingNetPrice]}>{onePrice?.NetPrc || ''}</Text>
                    
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingCount : styles.EnglishTrainerPricingCount]}>{onePrice?.count || ''}</Text>
                    <Text style={[styles.trainerPricingTextValues,isArabic ? styles.ArabicTrainerPricingPeriod : styles.EnglishTrainerPricingPeriod]}>{onePrice?.period || '0'}</Text>

                    <View style={[isArabic ? styles.ArabicTrainerPricingDiscount : styles.EnglishTrainerPricingDiscount]}>{onePrice?.disVal ? 
                        <Text style={{ color: 'black',fontSize:17, height:25}}>✔</Text>
                     : ''}</View>
                  
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,position:"absolute",left:"86%"}}>
                    <Pressable
                      // onPress={() => {
                      //   // Set the currently edited entry and open the modal
                      //   showEditModal(onePrice);
                      // }}
                      onPress={()=>navigation.navigate('TrainerAddEditPricing',{editedEntry :onePrice, isEditMode:true})}

                      style={{  borderRadius: 10, width: 20, height: 20 }}>
                      <AntDesign name="edit" size={20} color="black" />
                    </Pressable>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,position:"absolute",left:"93%"}}>
                    <Pressable disabled={hideButtonClicks} onPress={() => (hideButtonClicks ? null : removeTrainerPricingItem(onePrice))} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>
                
              ))}
            {/* <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,marginTop:20}}>{t('Discounts')}</FormLabel>
            </FormLabelView>
              {(discountDataTable?.length >= 1) ? (
              <View style={styles.FromToViewDiscount}>
              
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderDiscountDiscountPercentText : styles.EnglishHeaderDiscountDiscountPercentText]}>{t('Discount')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderDiscountStartDateText : styles.EnglishHeaderDiscountStartDateText]}>{t('From')}</Text>
                <Text style={[styles.FromToViewText,isArabic ? styles.ArabicHeaderDiscountEndDateText : styles.EnglishHeaderDiscountEndDateText]}>{t('To')}</Text>
              </View>
            ):null}

              {discountDataTable?.map((oneDiscount) => (
                <View key={oneDiscount.speKey} style={styles.viewContainer}>
                  <View style={styles.discountContainer}> 
                     
                    <Text style={[styles.discountTextValues,isArabic ? styles.ArabicDiscountDiscountPercentText : styles.EnglishDiscountDiscountPercentText]}>{oneDiscount?.discont || '0'}</Text>
                    <Text style={[styles.discountTextValues,isArabic ? styles.ArabicDiscountStartDateText : styles.EnglishDiscountStartDateText]}>{oneDiscount?.strDat || '0'}</Text>
                    <Text style={[styles.discountTextValues,isArabic ? styles.ArabicDiscountEndDateText : styles.EnglishDiscountEndDateText]}>{oneDiscount?.endDat || '0'}</Text>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,position:"absolute",left:"80%"}}>
                    <Pressable
                      onPress={() => {showEditDiscountModal(oneDiscount)}}
                      style={{  borderRadius: 10, width: 20, height: 20 }}>
                      <AntDesign name="edit" size={20} color="white" />
                    </Pressable>
                  </View>
                  <View style={{alignItems:'center', marginVertical: 15,position:"absolute",left:"88%"}}>
                    <Pressable onPress={() => removeDiscountDataItem(oneDiscount)} style={{backgroundColor:'#000',borderRadius:10,width:20,height:20}}>
                      <AntDesign name="minuscircleo" size={20} color="white" />
                    </Pressable>
                  </View>
                </View>
                
              ))} */}
              <Spacer size="large">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10,marginTop:20,}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
              onPress={()=>navigation.navigate('TrainerAddEditPricing')} 
            >
                    <CalendarFullSizePressableButtonText >{t('Add_New_Price')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer>
              <Modal visible={modalNewPriceVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                {/* updateWorkoutName={(newName) => setWorkoutName(newName)} */}
                <AddEntryTrainerPricing
                  isEditMode={isEditMode}
                  editedEntry={editedEntry}
                  hideModal={hideNewPriceModal}
                  setDataTrainerPricing={setDataTrainerPricing}
                />
                </ViewOverlay>
              </Modal>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000',opacity: discountDataTable?.length === 1 ? 0.5 : 1,}}
           onPress={showAddNewDiscountModal} disabled={discountDataTable?.length === 1}>
                    <CalendarFullSizePressableButtonText >{t('Add_New_Discount')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
              <Modal visible={modalNewDiscountVisible} transparent={true} animationType="fade">
                <ViewOverlay>
                {/* updateWorkoutName={(newName) => setWorkoutName(newName)} */}
                <AddEntryDiscount   
                  isEditDiscountMode={isEditDiscountMode}
                  editedDiscountEntry={editedDiscountEntry}
                  hideModal={hideDiscountModal}/>
                </ViewOverlay>
              </Modal>
              {/* <Spacer size="medium">
                <FormElemeentSizeButtonParentView style={{marginRight:10,marginLeft:10}}>
                  <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}
           onPress={() => navigation.goBack()}>
                    <CalendarFullSizePressableButtonText >{t('Back')}</CalendarFullSizePressableButtonText>
                  </CalendarFullSizePressableButton>
                </FormElemeentSizeButtonParentView>
              </Spacer> */}
            </View>
            
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    
  },
  viewContainer: {
    flexDirection: 'row',
    marginVertical: 2,
    marginBottom:25,
    
    
  },
  leftContainer: {
    flex: 1,
    marginRight: 10,
  },
  trainerPricingContainer:{
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    // marginLeft:10,
    marginBottom:10,
  },
 
  discountContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent:'space-between',
    marginLeft:10,
    marginRight:15,
  },
 
  discountCountryText:{
    width:60,
    flexWrap: 'wrap',
    marginRight:4,
  },
  discountTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    },
  headerTrainerPricing:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 20,
    width:"100%",
    // backgroundColor:"yellow",
  },
  
  FromToViewDiscount:{
    flexDirection: 'row',
    justifyContent:'space-between',
    marginBottom: 15,
    width:"100%",
  },
  FromToViewText:{
    fontSize:14,
    fontWeight:'bold',
    color:"black",
    // marginBottom: 10,
    //  flex: 1,
    
  },
  ArabicHeaderTrainerPricingCountry :{
position:'absolute',
    left:'4%',
  },
EnglishHeaderTrainerPricingCountry :{
position:'absolute',
    left:'1%',
},
  ArabicHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'20%',
  },
  EnglishHeaderTrainerPricingCurrency:{
    position:'absolute',
    left:'17%',
  },
  ArabicHeaderTrainerPricingNetPrice :{
    position:'absolute',
    left:'41%',
    width:50,
    marginVertical: -6

  },
EnglishHeaderTrainerPricingNetPrice:{
  position:'absolute',
    left:'35%',
    width:50,
    marginVertical: -6
},
ArabicHeaderTrainerPricingPeriod :{
position:'absolute',
left:'66%',
}, 
EnglishHeaderTrainerPricingPeriod:{
    position:'absolute',
    left:'61%',
},
ArabicHeaderTrainerPricingCount :{
position:'absolute',
left:'52%',
   
},
EnglishHeaderTrainerPricingCount:{
    position:'absolute',
    left:'47%',
    
},
ArabicHeaderTrainerPricingDiscount :{
  position:'absolute',
    left:'69%',
},
EnglishHeaderTrainerPricingDiscount:{
  position:'absolute',
  left:'74%',
},

  ArabicHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'53%',
  },
  EnglishHeaderTrainerPricingNumber:{
    position:'absolute',
    left:'52%',
  },
  trainerPricingTextValues:{
    fontSize:14,
    color:"black",
    marginVertical: 15,
    flex: 1,
    },

    ArabicTrainerPricingCurrencyText:{
      position:'absolute',
      left:'8%',
      flexWrap: 'wrap',
      flex:1,
    },
    EnglishTrainerPricingCurrencyText:{
      position:'absolute',
      left:'8%',
      flexWrap: 'wrap',
      flex:1,
    },
ArabicTrainerPricingCountry :{
position:'absolute',
    left:'4%',
    flexWrap: 'wrap',
      flex:1,
      width:60,
  },
EnglishTrainerPricingCountry :{
position:'absolute',
    left:'1%',
    flexWrap: 'wrap',
      flex:1,
      width:60,
},
  ArabicTrainerPricingCurrency:{
    position:'absolute',
    left:'22%',
    flexWrap: 'wrap',
      flex:1,
  },
  EnglishTrainerPricingCurrency:{
    position:'absolute',
    left:'19%',
    flexWrap: 'wrap',
      flex:1,
  },
  ArabicTrainerPricingNetPrice :{
    position:'absolute',
    left:'41%',
    width:50,
  },
EnglishTrainerPricingNetPrice:{
  position:'absolute',
    left:'35%',
    width:50,
},
ArabicTrainerPricingPeriod :{
position:'absolute',
    left:'66%',
}, 
EnglishTrainerPricingPeriod:{
position:'absolute',
left:'61%',
},
ArabicTrainerPricingCount :{
position:'absolute',
    
    left:'54%',
},
EnglishTrainerPricingCount:{
position:'absolute',
left:'49%',

    
},
ArabicTrainerPricingDiscount :{
    borderColor:'black',
  borderWidth:1,
  borderRadius:5,
  position:'absolute',
  width:25,
  height:25,
  alignItems: 'center',
  justifyContent: 'center',
  left:'71%',
  marginVertical:13,
},
EnglishTrainerPricingDiscount:{
  // backgroundColor:'yellow',
  borderColor:'black',
  borderWidth:1,
  borderRadius:5,
  position:'absolute',
  width:25,
  height:25,
  alignItems: 'center',
  justifyContent: 'center',
  left:'76%',
  marginVertical:13,
},


    ArabicTrainerPricingNumberText:{
      position:'absolute',
      left:'47%',
    },
    EnglishTrainerPricingNumberText:{
      position:'absolute',
      left:'47%',
    },
  ArabicHeaderDiscountDiscountPercentText:{
    position:'absolute',
    left:'7%',
  },
  EnglishHeaderDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  ArabicHeaderDiscountStartDateText:{
    position:'absolute',
    left:'30%',
  },
  EnglishHeaderDiscountStartDateText:{
    position:'absolute',
    left:'30%',
  },
  ArabicHeaderDiscountEndDateText:{
    position:'absolute',
    left:'55%',
  },
  EnglishHeaderDiscountEndDateText:{
    position:'absolute',
    left:'55%',
  },
  ArabicDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  EnglishDiscountDiscountPercentText:{
    position:'absolute',
    left:'5%',
  },
  ArabicDiscountStartDateText:{
    position:'absolute',
    left:'25%',
  },
  EnglishDiscountStartDateText:{
    position:'absolute',
    left:'25%',
  },
  ArabicDiscountEndDateText:{
    position:'absolute',
    left:'52%',
  },
  EnglishDiscountEndDateText:{
    position:'absolute',
    left:'52%',
  },
  headerDiscountDiscountPercentText:{
    marginLeft:0,
  },
  discountDiscountPercentText:{
    marginLeft:0,
  },
  headerDiscountStartDateText:{
    marginLeft:-40,
  },
  discountStartDateText:{
    marginLeft:26,
  },
  headerDiscountEndDateText:{
    marginLeft:-20,
  },
  discountEndDateText:{
    marginRight:29,
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
});

