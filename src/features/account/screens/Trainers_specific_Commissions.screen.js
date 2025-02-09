import React, { useEffect, useContext,useState,useRef } from "react";
import { TextInput,FlatList,ScrollView,View,Text, Modal,Alert,StyleSheet,Pressable, Animated, Easing,TouchableOpacity} from "react-native";
import { Spinner } from '@ui-kitten/components';

import { SelectItem  } from '@ui-kitten/components';
import { Spacer } from "../../../components/spacer/spacer.component";
import { MaterialIcons } from '@expo/vector-icons'; // or any other icon library
import { Rating } from '@kolking/react-native-rating';
import { FontAwesome } from '@expo/vector-icons'; // Assuming you are using FontAwesome icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {AntDesign} from '@expo/vector-icons';

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
    ExerciseParentView,
    ExerciseImageView,
    ExerciseInfoParentView,
    ExerciseInfoTextHead,
    ExerciseInfoTextTag,
    ExerciseImageViewImage,
    FilterContainer,
    FilterTextView,
    FilterText,
    FilterTextPressable,
    ClearFilterTouchableOpacity,
    ClearFilterTextView,
    ClearFilterText,
    CountryParent,
    CountryPickerView,
    GenderSelector,
    CalendarFullSizePressableButton,
    CalendarFullSizePressableButtonText,

  
  } from "../components/account.styles";
import CountryPicker from 'react-native-country-picker-modal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';
import { addEventListener } from "@react-native-community/netinfo";
import axios from 'axios';
import "./i18n";
import { useTranslation } from 'react-i18next';


const MemoizedExerciseParentView = React.memo(({ item, navigation,isAllowForeignTrainersOn,triainerConnected }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [commissionValue,setCommissionValue]=useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const checkmarkAnimation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (showSuccess) {
      Animated.timing(checkmarkAnimation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }).start();
    } else {
      checkmarkAnimation.setValue(0); // Reset animation
    }
  }, [showSuccess]);
  useEffect(() => {
    setCommissionValue(item?.TrSpCm);
  }, [item]); 
  const addEntryHandler = (commissionValue,item) => {
    if (commissionValue == null) {
      Alert.alert(`${t("you_must_fill_Commission_Number")}`);
      return;
    };
    if (commissionValue.trim() == "") {
      Alert.alert(`${t("you_must_fill_Commission_Number")}`);
      return;
    };
    //hideModal();
    // setLoading(true);
    // setShowSuccess(false); // Reset success state
  
      const newData = {
        userId:item?.userId,
        speKey:item?.speKey,
        TrSpCm:commissionValue,
      
  
     
    };
    //console.log('newData',newData);
    if(triainerConnected){   
      setLoading(true);
      setShowSuccess(false); // Reset success state           
       axios.post(`https://life-pf.com/api/TrainerManageMyProfile-trainer-specific-Commission-inserting-data`, newData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json", // Use application/json for non-multipart data
        }
      }).then((response) => {
        setLoading(false);
        setShowSuccess(true); // Show success message and animation
        // Delay to allow users to see the success message before closing the modal
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000); // 2 seconds delay
          //console.log('TrainerManageMyProfile-trainer-specific-Commission updated succesfully')
          // setLoading(false);
          // setShowSuccess(true); // Show success message and animation
          // // Delay to allow users to see the success message before closing the modal
          // setTimeout(() => {
          //     setShowSuccess(false);
          // }, 2000); // 2 seconds delay
      }).catch((error) => {
          setLoading(false);
          setShowSuccess(false); // Reset success state
          //console.log('Error updating AdminSettingsApp:', error);
      });
  }else{
    setLoading(false);
    setShowSuccess(false); // Reset success state
    // Alert.alert(`${t('To_send_your_data_for_Approving')}`,
    // `${t('You_must_be_connected_to_the_internet')}`);
  }
  };   
  return (
    <>

    {/* <Pressable  onPress={() => navigation.navigate('NewPersonalTrainer', { newPersonalTrainer: item })}> */}
        <>
        <Modal
              animationType="slide"
              transparent={true}
              visible={loading || showSuccess} // Show when loading or success
            >
              <View style={styles.modalContainer}>
                <View style={styles.loadingBox}>
                  {loading && !showSuccess && (
                    <>
                      <Text style={styles.loadingText}>Loading...</Text>
                      <Spinner size="large" color="#fff" />
                    </>
                  )}
                  {showSuccess && (
                    <>
                      <Animated.View style={{ transform: [{ scale: checkmarkAnimation }] }}>
                        <AntDesign name="checkcircle" size={50} color="green" />
                      </Animated.View>
                      <Text style={styles.successText}>{t('Trainer_Commission_updated_successfully')}</Text>
                    </>
                  )}
                </View>
              </View>
            </Modal> 
        <View  style={styles.FromToViewParentColumnBody}>
        <View style={styles.viewContainer}>
          <View style={styles.rightContainer}>     
            <Text 
          style={[isArabic ? styles.ArabicRightContainerTextTrainerName : styles.EnglishRightContainerTextTrainerName]}

            >{item?.fName} {item?.lName}</Text>
            <TextInput

                  style={[styles.WorkoutsInput,isArabic ? styles.ArabicRightContainerTextTrainerCommission : styles.EnglishRightContainerTextTrainerCommission]}
                  placeholder={t("%")}
                  // onFocus={handleInputFocus}
                  // editable={!set.isCmpld}
                  // selectTextOnFocus={!set.isCmpld}
                  keyboardType="numeric"
                  value={commissionValue}
                  onChangeText={(text) =>{setCommissionValue(text);}
                    // setInputValues((prevInputValues) => {
                    //   const newInputValues = [...prevInputValues];
                    //   newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] = {
                    //     ...(newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey] || {}),
                    //     [index]: {
                    //       ...newInputValues[publicPlansDataTableItemDayNewData[activeIndex].wrkKey]?.[index],
                    //       weight: text,
                    //     },
                    //   };
                    //   return newInputValues;
                    // })
                  }
                /> 
          
          </View>
          <View style={{alignItems:'center', marginVertical: 17,width:"10%",height:24}}>
            <TouchableOpacity onPress={() => addEntryHandler(commissionValue,item)}>
              <AntDesign name="pluscircleo" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <ExerciseParentView>
          
        <ExerciseInfoParentView style={{marginTop:-17,flexDirection: 'row',}}>
            <ExerciseInfoTextHead style={{fontSize:16,width:"58%",left:"0%"}}>{item?.fName} {item?.lName}</ExerciseInfoTextHead>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t('Country')}: {item?.TrSpCm}</ExerciseInfoTextTag>
            <ExerciseInfoTextTag style={{fontSize:14}}>{t('Price')}: {item?.price} {item?.curncy}</ExerciseInfoTextTag>
            

        </ExerciseInfoParentView>
    </ExerciseParentView> */}
    </>
    {/* </Pressable> */}
    
    </>
  );
});
export const TrainersSpecificCommissionsScreen = ({navigation,route}) => {
//   const ourPersonalTrainers= [
//     {id:1,name:"Mohamed Al-Durrah",country:"Egypt",gender:'Him',ratings:"4.4",trainees:"6",price:"150",currency:"EGP",discount:"10%",status:"open",certificates:["ISSA","RGA"],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com",tiktok:"https://tiktok.com"},about:"Mohamed al Duurah was reaised in Egypt, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
//     {id:2,name:"Sarah Kenndy",country:"United Stated",gender:'Her',ratings:"1",trainees:"7",price:"100",currency:"USD",discount:"7.5%",status:"closed",certificates:["RGA","ISSA","CfA",'CNA'],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Sarah Kenndy was reaised in United States, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
//     {id:3,name:"Mario Elves",country:"Ireland",gender:'Him',ratings:"3.5",trainees:"10",price:"10",currency:"USD",discount:"0",status:"open",certificates:["ISSA","RGA","CfA",],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3","Arnold Pro4"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Mario Elves was reaised in Ireland, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
//     {id:4,name:"Moataz Fahmy",country:"Germany",gender:'Him',ratings:"5",trainees:"9",price:"30",currency:"USD",discount:"15%",status:"closed",certificates:["RGA",],achievments:["Arnold Pro1"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Moataz Fahmy was reaised in Germany, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
//     {id:5,name:"Peter Becker",country:"United Kingdom",gender:'Him',ratings:"2.3",trainees:"5",price:"80",currency:"USD",status:"closed",discount:"0",certificates:["ISSA","RGA"],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},about:"Peter Becker was reaised in United Kingdom, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
// ];
      const [ourPersonalTrainers,setOurPersonalTrainers] =useState([]);
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';

      const [filteredData, setFilteredData] = useState([]);
      const [searchQuery, setSearchQuery] = useState('');
      const [showFilter, setShowFilter] = useState(false); // New state for filter visibility
      const [selectedRatings,setSelectedRatings] =useState("");
      const [selectedTrainees,setSelectedTrainees] =useState("");
      const [selectedGender,setSelectedGender] =useState("");
      
      const [countryName, setCountryName] = useState(null);
      const [countryCode, setCountryCode] = useState(null); // Ensure countryCode is initially null
      const [countryCurrency, setCountryCurrency] = useState('');
      const [changeCountryCurrency, setChangeCountryCurrency] = useState('');
      const [minPrice, setMinPrice] = useState('');
      const [maxPrice, setMaxPrice] = useState('');
      const [includeDiscount, setIncludeDiscount] = useState(false);
      const [userId, setUserId] = useState("");  
      const [triainerConnected,setTriainerConnected] =  useState(false);
      const [isAllowForeignTrainersOn, setIsAllowForeignTrainersOn] = useState(false);
      const [loadingPageInfo, setLoadingPageInfo] = useState(true);
      ///pagination system
      let [totalItems, setTotalItems] = useState(filteredData?.length > 0 ? filteredData?.length : 1);
      const [currentPage, setCurrentPage] = useState(1);
      const [pageSize] = useState(10); // Number of items per page
      let [totalPages, setTotalPages] = useState(totalItems > 0 ? Math.ceil(totalItems / pageSize) : 1);

      // Function to toggle the discount checkbox state
      useFocusEffect(
        React.useCallback(() => {
        AsyncStorage.getItem("sanctum_token")
        .then((res) => {
          ////console.log('tokeeen:',res);
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
              axios.get('https://life-pf.com/api/trainers-search', {
                headers: {
                  'Authorization': `Bearer ${res}`,
                  'Content-Type': 'application/json',
                  'Connection':"keep-alive",
                },
                })
                .then(response => {
                  // Handle successful response
                  //console.log('trainer::',response.data["trainers"]);
                  setOurPersonalTrainers(response?.data["trainers"]);
                  setLoadingPageInfo(false);

                })
                .catch(error => {
                  // Handle error
                  ////console.log('Error fetching Trainers:', error);
                  setLoadingPageInfo(false);

                });

                // axios.get(`https://life-pf.com/api/Admin-Settings-App-Get-Data-From-Database`, {
                //   headers: {
                //     'Authorization': `Bearer ${res}`,
                //     'Content-Type': 'application/json',
                //   },
                //   })
                //   .then(response => {
                //     // Handle successful response
                //     if(Object.keys(response?.data["AdminSettingsAppRow"]).length > 0){
                //       // //console.log(' Object.keys AdminSettingsAppRow length > 0::,',Object.keys(response?.data["AdminSettingsAppRow"]).length > 0);
                //       //console.log('AdminSettingsAppRow::,',response?.data["AdminSettingsAppRow"]);
                //       //console.log('AlFoTr == "1"::,',response?.data["AdminSettingsAppRow"]?.AlFoTr == "1");


                //       // setAdminSettingsData(response?.data["AdminSettingsAppRow"]);
                //       // setAdminCommissionNumber(response?.data["AdminSettingsAppRow"]?.admCom);
                //       setIsAllowForeignTrainersOn((response?.data["AdminSettingsAppRow"]?.AlFoTr == "1" || response?.data["AdminSettingsAppRow"]?.AlFoTr == "true" || response?.data["AdminSettingsAppRow"]?.AlFoTr == true) ? true : false);
                //     }
                //   })
                //   .catch(error => {
                //     // Handle error
                //     ////console.log('Error fetching Meals:', error);
                //     // setLoadingPageInfo(false);
      
                //   });

            }else{
              ////console.log('else no internet ahmed');
              setLoadingPageInfo(false);
              Alert.alert(`${t(' ')}`,
              `${t('Please_Connect_to_the_internet_To_see_the_Trainers')}`,
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
      ////console.log('ourPersonalTrainers',ourPersonalTrainers);
      const toggleDiscount = () => {
        setIncludeDiscount(!includeDiscount);
      };
      const changeCurrency = () =>{
        if (countryCurrency === ""){
          setChangeCountryCurrency('');
        }
        
      }
      useEffect(() => {
        changeCurrency();
      }, [countryCurrency]);    
  
      const toggleFilter = () => {
        setShowFilter(!showFilter);
      };
      ////////////// Start genderData////////////////
      const genderData = [
        'Him',
        'Her',
      ];
      const renderGenderOption = (title,i) => (
        <SelectItem title={title} key={i} />
      );
      const displayGenderValue = genderData[selectedGender.row];
      ////////////// End genderData////////////////
      ////////////// Start ratingsData////////////////
      // const ratingsData = [
      //   1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,
      //   2,2.1,2.2,2.3,2.4,2.5,2.6,2.7,2.8,2.9,
      //   3,3.1,3.2,3.3,3.4,3.5,3.6,3.7,3.8,3.9,
      //   4,4.1,4.2,4.3,4.4,4.5,4.6,4.7,4.8,4.9,
      //   5
      // ];
      const ratingsData = [
        { title: "No Rating", value: 0 },
        { title: "★ & greater", value: 1 },
        { title: "★★ & greater", value: 2 },
        { title: "★★★ & greater", value: 3 },
        { title: "★★★★ & greater", value: 4 },
      ];
      const handleSelect = (index) => {
        setSelectedRatings(index);
        let selectedRatingLet = ratingsData?.[index?.row]?.value;
        
        if (selectedRatingLet !== null) {
          // Send the selectedRatingLet value to the database
          
          //console.log('Rating sent to database:', selectedRatingLet);
        } else {
          selectedRatingLet = null;
          //console.log('No rating selected');
        }
      };
      // const renderRatingsOption = (title,i) => (
      //   <SelectItem title={title} key={i} />
      // );
      // const displayRatingsValue = ratingsData[selectedRatings.row];
      
      
      ////////////// End ratingsData////////////////
      ////////////// Start traineesData////////////////
      // const traineesData = [
      //   '0',
      //   '1',
      //   '2',
      //   '3',
      //   '4',
      //   '5',
      //   '6',
      //   '7',
      //   '8',
      //   '9',
      //   '10',
      //   '11',
      //   '12',
      //   '13',
      //   '14',
      //   '15',
      //   '16',
      //   '17',
      //   '18',
      //   '19',
      //   '20',
      //   '21',
      //   '22',
      //   '23',
      //   '24',
      //   '25',
      //   '26',
      //   '27',
      //   '28',
      //   '29',
      //   '30',
      //   '31',
      //   '32',
      //   '33',
      //   '34',
      //   '35',
      //   '36',
      //   '37',
      //   '38',
      //   '39',
      //   '40',
      //   '41',
      //   '42',
      //   '43',
      //   '44',
      //   '45',
      //   '46',
      //   '47',
      //   '48',
      //   '49',
      //   '50',
      //   '51',
      //   '52',
      //   '53',
      //   '54',
      //   '55',
      //   '56',
      //   '57',
      //   '58',
      //   '59',
      //   '60',
      //   '61',
      //   '62',
      //   '63',
      //   '64',
      //   '65',
      //   '66',
      //   '67',
      //   '68',
      //   '69',
      //   '70',
      // ];
      // const renderTraineesOption = (title,i) => (
      //   <SelectItem title={title} key={i} />
      // );
      // const displayTraineesValue = traineesData[selectedTrainees.row];
      ////////////// End traineesData////////////////
      
        const filterData = () => {
          const filtered = ourPersonalTrainers?.filter((item) => {
          //console.log('item?.avgRat ',item?.avgRat)
          //console.log("ratingsData?.[selectedRatings?.row]?.value",ratingsData?.[selectedRatings?.row]?.value)
          //console.log("item?.avgRat === ratingsData?.[selectedRatings?.row]?.value",item?.avgRat == ratingsData?.[selectedRatings?.row]?.value)

            const firstName = item?.fName;
            const lastName = item?.lName;
            const fullName = firstName + " " + lastName;
            const nameMatches = fullName.toLowerCase().includes(searchQuery.toLowerCase());
            
          
            const countryFilterMatches = countryName ? item?.country == countryName : true;
            const genderFilterMatches = displayGenderValue ? item?.gender == displayGenderValue : true;

            // const ratingsFilterMatches = ratingsData?.[selectedRatings?.row]?.value !== undefined ? item?.avgRat == ratingsData?.[selectedRatings?.row]?.value : true;
             // Update the ratings filter logic based on the selected range
            const selectedRatingValue = ratingsData?.[selectedRatings?.row]?.value;
            const ratingsFilterMatches = selectedRatingValue != undefined
              ? 
                (Number(selectedRatingValue) == 0 && Number(item?.avgRat) == 0) ||
                (Number(selectedRatingValue) == 1 && Number(item?.avgRat) >= 1 && Number(item?.avgRat) <= 1.9) ||
                (Number(selectedRatingValue) == 2 && Number(item?.avgRat) >= 2 && Number(item?.avgRat) <= 2.9) ||
                (Number(selectedRatingValue) == 3 && Number(item?.avgRat) >= 3 && Number(item?.avgRat) <= 3.9) ||
                (Number(selectedRatingValue) == 4 && Number(item?.avgRat) >= 4 && Number(item?.avgRat) <= 5)
              : true;

              //console.log('ratingsFilterMatches ',ratingsFilterMatches)


            // const traineesFilterMatches = displayTraineesValue ? item?.trainees == displayTraineesValue : true;
            const countryCurrencyFilterMatches = changeCountryCurrency ? item?.curncy == changeCountryCurrency : true;
            const minPriceFilterMatches = minPrice ? parseFloat(item?.price) >= minPrice : true;
            const maxPriceFilterMatches = maxPrice ? parseFloat(item?.price) <= maxPrice : true;
            // New discount filter
            const discountFilterMatches = includeDiscount ? item?.discont != '0' : true;
            if(nameMatches || countryFilterMatches || genderFilterMatches || ratingsFilterMatches || countryCurrencyFilterMatches || (minPriceFilterMatches && maxPriceFilterMatches) || discountFilterMatches){
              setCurrentPage(1);
            }
            // Return true if the personal trainers filters matches all selected criteria
            return nameMatches && countryFilterMatches && genderFilterMatches && ratingsFilterMatches && countryCurrencyFilterMatches && (minPriceFilterMatches && maxPriceFilterMatches) && discountFilterMatches;
            });
            //console.log('filtered ',filtered)
            
            setTotalItems(filtered?.length);
            ////console.log('filtered?.length',filtered?.length);
            setTotalPages(Math.ceil(filtered?.length / pageSize));

            setFilteredData(filtered);
          };

        useEffect(() => {
          filterData();
        }, [ourPersonalTrainers,searchQuery,selectedRatings,displayGenderValue,countryName,changeCountryCurrency,minPrice,maxPrice,includeDiscount]);     
        const handlePageChange = (page) => {
          setCurrentPage(page);
        };
        // Calculate the range of page numbers to display
        const minPage = Math.max(1, currentPage - 2);
        const maxPage = Math.min(totalPages, currentPage + 2);


        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const visibleData = filteredData.slice(startIdx, endIdx);  
          // Render the pagination buttons
          const renderPaginationButtons = () => {
            const buttons = [];

            // <MaterialCommunityIcons name="food-variant" color={color} size={28} />
            if ((currentPage - 5) >= 1) {
              buttons.push(
                (isArabic)?(
                <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                  <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                  <TouchableOpacity key="five-back"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage - 5)}>
                  <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                )
              );
            }
            // Render button for previous page
            if (currentPage > 1) {
              buttons.push(
                (isArabic)?(
                  <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                    <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                  </TouchableOpacity>
                  ):(
                  <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',}} key="prev" onPress={() => handlePageChange(currentPage - 1)}>
                    <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                  </TouchableOpacity>
                  )
                
              );
            }
            

            // Render buttons for pages before the current page
            for (let i = minPage; i < currentPage; i++) {
              buttons.push(
                <TouchableOpacity  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                  <Text style={{color:'#000'}}>{i}</Text>
                </TouchableOpacity>
              );
            }

            // Render button for current page
            buttons.push(
              <TouchableOpacity  style={{backgroundColor:'transparent',borderWidth:2,borderColor:"#3f7eb3",width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={currentPage} disabled>
                <Text style={{color:'#3f7eb3'}}>{currentPage}</Text>
              </TouchableOpacity>
            );

            // Render buttons for pages after the current page
            for (let i = currentPage + 1; i <= maxPage; i++) {
              buttons.push(
                <TouchableOpacity style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} key={i} onPress={() => handlePageChange(i)}>
                  <Text style={{color:'#000'}}>{i}</Text>
                </TouchableOpacity>
              );
            }

            // Render button for next page
            if (currentPage < totalPages) {
              buttons.push(
                (isArabic)?(
                  <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                    <FontAwesome name="chevron-left" size={12} color="#000" style={{textAlign:'center'}}/>
                  </TouchableOpacity>
                  ):(
                    <TouchableOpacity key="next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 1)}>
                      <FontAwesome name="chevron-right" size={12} color="#000" style={{textAlign:'center'}}/>
                    </TouchableOpacity>
                  )
                
              );
            }

            if (currentPage+5 <= totalPages) {
              buttons.push(
                (isArabic)?(
                <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                  <MaterialCommunityIcons  name="chevron-triple-left" size={24} color="black" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                ):(
                  <TouchableOpacity key="five-next"  style={{backgroundColor:'transparent',width:25,height:25,borderRadius:50, alignItems: 'center', justifyContent: 'center',marginLeft:5}} onPress={() => handlePageChange(currentPage + 5)}>
                  <MaterialCommunityIcons  name="chevron-triple-right" size={24} color="black" style={{textAlign:'center'}}/>
                </TouchableOpacity>
                )
              );
            }

            return buttons;
          };

        const clearFilter = () => {
          setSelectedRatings(''); 
          setSelectedTrainees(''); 
          setCountryName(null);
          setCountryCode(null); // Reset country code to null to clear picker
          setCountryCurrency('');
          setSelectedGender('');
          setMinPrice('');
          setMaxPrice('');
          setIncludeDiscount(false);
        };
        useEffect(() => {
          //console.log('countryName',countryName);
          //console.log('countryCode',countryCode);

        }, [countryName,countryCode]);     

        return (
      <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            {/* <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>{t("Search")}</ServicesPagesCardHeader>
            </ServicesPagesCardCover> */}
            <ServicesPagesCardCover>
            <PageMainImage  style={{resizeMode: "contain"}}
            source={require('../../../../assets/home_Personal_Trainer_Search.png')} 
              // style={{width:"100%",height:"100%",borderRadius:30}}
            />
            </ServicesPagesCardCover>
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
            <View style={{marginBottom:20,marginRight:10,marginLeft:10}}>
              <FormInput
                placeholder={t("Search")}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                theme={{colors: {primary: '#3f7eb3'}}}
              />
              <FilterTextView >
              <FilterTextPressable  onPress={()=>
                  {toggleFilter();
                    clearFilter();
                  }}>
                <FilterText>{t("Filter")}</FilterText>
                </FilterTextPressable>
              </FilterTextView>
              {showFilter && (
                <FilterContainer >
                <InputField>
                  <CountryParent>
                      <FormLabelView>
                        <FormLabel>{t("Country")}:</FormLabel>
                      </FormLabelView>
                    <CountryPickerView >
                      <CountryPicker 
                        withFilter
                        withFlag
                        {...(countryName ? { withCountryNameButton: true } : {})}  // Conditional prop for withCountryNameButton
                        // theme={{
                        //   primaryColor: 'red',
                        //   primaryColorVariant: 'yellow',
                        //   backgroundColor: '#ffffff',
                        //   }}
                        countryCode={countryCode}  // Properly set countryCode to null when cleared
                        onSelect={(country) => {
                          setCountryName(country.name);
                          setCountryCode(country.cca2);
                          setCountryCurrency(country.currency[0]);
                                        }}
                        // value = {countryName != null ? countryName : 'Select Country'}
                        placeholder={<View><Text style={{marginLeft:3,fontSize:15}}>Select Country </Text></View>}
                      />
                    </CountryPickerView>
                    </CountryParent>
                  </InputField>
                  <Spacer size="medium">
                    <InputField>
                      <FormLabelView>
                        <FormLabel>{t("Gender")}:</FormLabel>
                      </FormLabelView>
                        <GenderSelector
                          selectedIndex={selectedGender}
                          onSelect={(index) => setSelectedGender(index)}
                          placeholder={t('Select_Gender')}
                          value={displayGenderValue}
                          status="newColor"
                        size="customSizo"
                        >
                          {genderData.map(renderGenderOption)}
                        </GenderSelector>
                    </InputField>
                  </Spacer>
                  <Spacer size="medium">
                    <InputField>
                      <FormLabelView>
                        <FormLabel>{t('Ratings')}:</FormLabel>
                      </FormLabelView>
                        {/* <GenderSelector
                          selectedIndex={selectedRatings}
                          onSelect={(index) => setSelectedRatings(index)}
                          placeholder={t('Select_Ratings')}
                          value={displayRatingsValue}
                          status="newColor"
                        size="customSizo"
                        >
                          {ratingsData.map(renderRatingsOption)}
                        </GenderSelector> */}
                        <GenderSelector
                        selectedIndex={selectedRatings}
                        onSelect={(index) => setSelectedRatings(index)}
                        placeholder={t('Select_Ratings')}
                        value={ratingsData?.[selectedRatings?.row]?.title}
                        status="newColor"
                        size="customSizo"
                      >
                        {ratingsData.map((option, index) => (
                          <SelectItem key={index} title={option.title} />
                        ))}
                      </GenderSelector>
                    </InputField>
                  </Spacer>
                  {/* <Spacer size="medium">
                    <InputField>
                      <FormLabelView>
                        <FormLabel>{t('Trainees')}:</FormLabel>
                      </FormLabelView>
                        <GenderSelector
                          selectedIndex={selectedTrainees}
                          onSelect={(index) => setSelectedTrainees(index)}
                          placeholder={t('Select_Trainees')}
                          value={displayTraineesValue}
                          status="newColor"
                        size="customSizo"
                        >
                          {traineesData.map(renderTraineesOption)}
                        </GenderSelector>
                    </InputField>
                  </Spacer> */}
                  <Spacer size="medium">
                    <InputField>
                      <FormLabelView>
                        <FormLabel>{t('Price')}:</FormLabel>
                      </FormLabelView>
                      <FormInputView style={{flexDirection:'row',justifyContent:"space-between"}}>
                      <View style={{width:"47%"}}>
                        <FormInput
                          placeholder={t("Min")}
                          value={minPrice} 
                          keyboardType="numeric"
                          theme={{colors: {primary: '#3f7eb3'}}}
                          onChangeText={(u) => setMinPrice(u)}
                        />
                      </View>
                      <View style={{width:"47%"}}>
                        <FormInput
                          placeholder={t("Max")}
                          value={maxPrice}
                          keyboardType="numeric"
                          theme={{colors: {primary: '#3f7eb3'}}}
                          onChangeText={(u) => setMaxPrice(u)}
                        />
                      </View>
                      </FormInputView>
                      </InputField>
                  </Spacer>
                  <Spacer size="medium">
                    {/* UI component for the discount checkbox */}
                    <InputField>
                      <FormLabelView>
                        <FormLabel>{t("Discount")}:</FormLabel>
                      </FormLabelView>
                      <CalendarFullSizePressableButton
                        style={{
                          backgroundColor: 'white',
                          width:20,
                          height:20,
                          borderWidth:1,
                          borderColor: 'black',
                          marginLeft: 0,
                        }} onPress={toggleDiscount}>
                          <CalendarFullSizePressableButtonText style={{
                            color: includeDiscount ? '#00FF00' : '#000',
                            position:'absolute',top:-2,}}>{includeDiscount ? '✔' : ''}</CalendarFullSizePressableButtonText>
                        </CalendarFullSizePressableButton>
                    </InputField>
                  </Spacer>
                          
                    <ClearFilterTextView>
                    <ClearFilterTouchableOpacity onPress={clearFilter}>
                      <ClearFilterText>{t('Clear_Filter')}</ClearFilterText>
                      </ClearFilterTouchableOpacity>
                    </ClearFilterTextView>
                    
                    
                </FilterContainer>
              )}
              

              <Spacer size="medium">
              <View style={styles.FromToView}>
                <Text 
                style={[isArabic ? styles.ArabicFromToViewTextTrainerName : styles.EnglishFromToViewTextTrainerName]}
                >{t("Name")}</Text>
                <Text 
                style={[isArabic ? styles.ArabicFromToViewTextTrainerCommission : styles.EnglishFromToViewTextTrainerCommission]}

                >{t("Commission")}</Text>
              
              </View>
              <FlatList
                  data={visibleData}
                  scrollEnabled={false}
                  initialNumToRender={5}
                  keyExtractor={(item, index) => index.toString()}
                  windowSize={10} //If you have scroll stuttering but working fine when 'disableVirtualization = true' then use this windowSize, it fix the stuttering problem.
                  maxToRenderPerBatch={10}
                  updateCellsBatchingPeriod={5}
                  disableVirtualization={true}
                  removeClippedSubviews={true}
                  renderItem={({ item }) => <MemoizedExerciseParentView item={item} navigation={navigation} isAllowForeignTrainersOn={isAllowForeignTrainersOn} triainerConnected={triainerConnected}/>}

                />
              </Spacer>
              <Spacer size="medium">

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' ,marginTop:20}}>
                  {renderPaginationButtons()}
                </View>
            </Spacer> 
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
          flex:1,
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
          marginBottom:5,

        },
        FromToViewParentColumnBody:{
          flexDirection: 'column',
          width:"100%",
          height:50,
          // marginBottom:10,
          
          //backgroundColor:"yellow",
          marginBottom:15,

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

        rightContainerTextTrainerName:{
          flex: 1,
          fontSize:14,
          color:"#000",
          //marginVertical: 17,
          position:"absolute",
          left:"1%",

        },
        FromToViewTextTrainerName:{
      
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"1%"
        },
        ArabicFromToViewTextTrainerName:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"1%",

        },
        EnglishFromToViewTextTrainerName:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"1%",

        },
        ArabicRightContainerTextTrainerName:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"1%",
          marginVertical: 17,
          width:100,

        },
        EnglishRightContainerTextTrainerName:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"1%",
          marginVertical: 17,
          width:100,
        },

            
ArabicFromToViewTextTrainerCommission:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"52%",
        },
        EnglishFromToViewTextTrainerCommission:{
          fontSize:14,
          fontWeight:'bold',
          color:"#000",
          position:"absolute",
          left:"42%",
          
        },
        


        ArabicRightContainerTextTrainerCommission:{
        position:"absolute",
        left:"59%",
      },
      EnglishRightContainerTextTrainerCommission:{
        position:"absolute",
        left:"49%",
        marginTop:5,

      },
  
        rightContainerTextTrainerCommission:{
          flex: 1,
          fontSize:14,
          color:"#000",
          //marginVertical: 17,
          position:"absolute",
          left:"18%",
          flexWrap: 'wrap',
        },
        WorkoutsInput: {
          width:60,
          borderWidth: 1,
          borderColor: 'gray',
          padding: 8,
          color:'black',
          fontFamily:'OpenSans_400Regular',
          borderRadius:7,
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
          left:"70%",
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
          left:"85%",
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