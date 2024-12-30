import React, { useState, useEffect } from 'react';
import { StyleSheet,ScrollView,View,Linking,Text,TouchableOpacity,Pressable,Alert, Modal } from "react-native";
import WebView from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather';

import {
  Title,
  TitleView,
  InputField,
  FormLabel,
  PageContainer,
  FormLabelView,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FormElemeentSizeButtonParentView,
  FormElemeentSizeButtonView,
  ServiceCloseInfoButtonText,
  ServiceCloseInfoButtonTextView,
  FormLabelDateRowView,
  FormLabelDateRowViewText,
  CalendarFullSizePressableButton,
  CalendarFullSizePressableButtonText,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import { Rating } from '@kolking/react-native-rating';
import "./i18n";
import { useTranslation } from 'react-i18next';
import { Spinner } from '@ui-kitten/components';
import { addEventListener } from "@react-native-community/netinfo";


export const NewPersonalTrainerScreen = ({navigation,route}) => {
  // const newPersonalTrainerRow = route.params?.newPersonalTrainer;
  const params = route.params || {};

  const { newPersonalTrainer = [], existingTrainerPricingCont = {},AdminSettingsAppRowCont={} } = params;

  let onePrice = existingTrainerPricingCont;
  let newPersonalTrainerRow = newPersonalTrainer;
  let AdminSettingsAppRowConst = AdminSettingsAppRowCont;


  const socialMediaColors = {
    Facebook: '#3b5998',
    X: '#000000',
    Instagram: '#C13584',
    Linkedin: '#0077b5',
    TikTok:"#000000",
    Snapchat:"#fffc00",
    // Add more platforms and their colors as needed
  };
  const [showWebView, setShowWebView] = useState(false);
  const [prog, setProg] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [urlLink, setUrlLink] = useState('');
  const [triainerConnected,setTriainerConnected] =  useState(false);

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setTriainerConnected(state.isConnected);
    });
    // Unsubscribe
    unsubscribe();
  }, []); 

  useEffect(() => {
    if(showWebView){
      setProg(true);
      const timer = setTimeout(() => {
        setProg(false);
      }, 3000); // 2 seconds
    }
    
  }, [showWebView]); 
  const { t, i18n } = useTranslation();
  const isLink = (url) => {
    // Check if the URL starts with 'https://', 'http://', 'www.', or just a valid domain name
    const urlPattern = /^(https?:\/\/|www\.)?[\w\-]+\.\w{2,}(\/[\w\-\.]*)?/;
    return urlPattern.test(url);
  };
  
  // const extractUserName = (url) => {
  //   const regex = /https?:\/\/(www\.)?[\w\-]+\.\w{2,}\/([\w\.]+)/;
  //   const match = url.match(regex);
  //   return match ? match[2] : url;
  // };
  const extractUserName = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?[\w\-]+\.\w{2,}\/([\w\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  // const handlePress = async (url,platform) => {
  //   if(triainerConnected){

  //     if (isLink(url)) {
  //       // setShowWebView(true); // Show the WebView modal
  //       const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;

  //       await Linking.openURL(formattedUrl); // Open in the respective app or browser

  //       setPlatformName(platform);
  //       setUrlLink(url);
  //     }
  //   }else{
  //     ////console.log('else no internet ahmed');
  //     Alert.alert(``,
  //     `${t('Please_Connect_to_the_internet_first')}`,
  //     [
  //       {
  //         text: 'OK',
  //         onPress: () => {
           
  //         },
  //       },
  //     ],
  //     { cancelable: false }
  //   );

  //   }
  // };
  const handlePress = async (url, platform) => {
    console.log('handlePress url',url);
    console.log('handlePress platform',platform);

    if (triainerConnected) {
      if (isLink(url)) {
        // Ensure the URL includes a protocol
        let formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  
        try {
          // Check if the https version is supported
          const supported = await Linking.canOpenURL(formattedUrl);
          if (supported) {
            await Linking.openURL(formattedUrl); // Open the https link
          } else {
            // If https is not supported, try the http version
            formattedUrl = formattedUrl.replace('https://', 'http://');
            const httpSupported = await Linking.canOpenURL(formattedUrl);
            if (httpSupported) {
              await Linking.openURL(formattedUrl); // Open the http link
            } 
          }
  
          setPlatformName(platform);
          setUrlLink(url);
        } catch (error) {
          //console.log('Failed to open URL:', error);
          // Alert.alert('Error', 'Failed to open the link', [{ text: 'OK' }]);
        }
      }else{
        const googleSearchUrl = `https://www.google.com/search?q=${url}`;
        console.log('handlePress googleSearchUrl',googleSearchUrl);

        const googleSupported = await Linking.canOpenURL(googleSearchUrl);
        console.log('handlePress googleSupported',googleSupported);

        if (googleSupported) {
          await Linking.openURL(googleSearchUrl); // Open the Google search
        }
      }
    } else {
      Alert.alert(
        '',
        `${t('Please_Connect_to_the_internet_first')}`,
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }
  };
  

  const closeWebView = () => {
    setShowWebView(false); // Close the WebView modal
  };
  const checkIfTrainerCanAcceptSubscription = (newPersonalTrainerRow,onePrice) =>{
    if (newPersonalTrainerRow?.acpSub == "no" || newPersonalTrainerRow?.acpSub == "false" || newPersonalTrainerRow?.acpSub == false || newPersonalTrainerRow?.capcty == newPersonalTrainerRow?.trainees ){
      Alert.alert(`${t(' ')}`,`${t('Trainer_Can_t_Accept_more_Subscriptions_right_now')}`);

    }else{
      navigation.navigate('SubscribePage', { newPersonalTrainer: newPersonalTrainerRow, existingTrainerPricingCont:onePrice,AdminSettingsAppRowConst:AdminSettingsAppRowConst });

    }
    
  }
  
  ////console.log('JSON.parse(newPersonalTrainerRow.crtfct)',JSON.parse(newPersonalTrainerRow?.crtfct));
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{newPersonalTrainerRow?.fName} {newPersonalTrainerRow?.lName}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
        <Spacer size="large">
          <View style={{flex:1,flexDirection:"column",}}>
            <FormLabelView style={{width:"100%"}}>
              <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t("About_trainer")}</FormLabel>
            </FormLabelView>
            <ServiceCloseInfoButtonTextView style={{marginLeft:10,marginRight:10,}}>
              <ServiceCloseInfoButtonText>{newPersonalTrainerRow.about || t("No_information_about_trainer")}</ServiceCloseInfoButtonText>
            </ServiceCloseInfoButtonTextView>
          </View>
        </Spacer>
        <Spacer size="large">
            <InputField >
            <FormLabelView>
                <FormLabel>{t("Status")}:</FormLabel>
            </FormLabelView>
            {(newPersonalTrainerRow?.acpSub == "no" || newPersonalTrainerRow?.acpSub == "false" || newPersonalTrainerRow?.acpSub == false || newPersonalTrainerRow?.capcty == newPersonalTrainerRow?.trainees ) ?
            <View style={{backgroundColor:'red',padding:10,borderRadius:20,alignItems:'center',width:"67%"}}><FormLabelDateRowViewText style={{padding:3,marginLeft:-2,borderRadius:20,fontSize:14,marginTop: 2,color:'white'}}>{t("Seats_Completed")}</FormLabelDateRowViewText></View>
              :
              <View style={{backgroundColor:'green',padding:10,borderRadius:20,alignItems:'center',width:"67%"}}><FormLabelDateRowViewText style={{padding:3,marginLeft:-2,borderRadius:20,fontSize:14,marginTop: 2,color:'white'}}>{t("Subscription_Available")}</FormLabelDateRowViewText></View>

            }
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t("Country")}:</FormLabel>
            </FormLabelView>
                <View style={{backgroundColor:'#e1e3e1',padding:10,borderRadius:20,alignItems:'center',width:"67%"}}><FormLabelDateRowViewText>{newPersonalTrainerRow.country}</FormLabelDateRowViewText></View>
            </InputField>
        </Spacer>
        <Spacer size="medium">
            <InputField >
            <FormLabelView>
                <FormLabel>{t("Rating")}:</FormLabel>
            </FormLabelView>
                <View style={{backgroundColor:'#e1e3e1',padding:10,borderRadius:20,alignItems:'center',width:"67%"}}><Rating size={15} fillColor={'yellow'} rating={newPersonalTrainerRow?.avgRat} disabled={true} /></View>
            </InputField>
        </Spacer>
        <InputField style={{ flexDirection: 'column' }}>
          <FormLabelView style={{ width:"100%",marginBottom:10,marginTop:10 }}>
            <FormLabel>{t("Certificates")}:</FormLabel>
          </FormLabelView>
          <View style={{ width: "100%", flexDirection: 'column' }}>
            {JSON.parse(newPersonalTrainerRow.crtfct).map((certificate, index) => (
              // Extracting the key and value from each certificate object
              Object.entries(certificate).map(([key, value], i) => (
                <>
                {(key != 'Other')?(
                  <View style={{flexDirection: 'column',width: "100%"}} key={key + '-' +index + '-' + i}>
                  <View style={{flexDirection:'row',justifyContent: 'space-between',marginBottom:5}}>
                    <View style={{backgroundColor:'#e1e3e1',width: "40%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{t("Certificates_Name")}:</FormLabelDateRowViewText>
                    </View>
                    <View style={{backgroundColor:'#e1e3e1',width: "58%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{key}</FormLabelDateRowViewText>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',justifyContent: 'space-between',marginBottom:12}}>
                    <View style={{backgroundColor:'#e1e3e1',width: "40%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{t("Refernce_ID")}:</FormLabelDateRowViewText>
                    </View>
                    <View style={{backgroundColor:'#e1e3e1',width: "58%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{value}</FormLabelDateRowViewText>
                    </View>
                  </View>
                </View>
                ):(
                  <>
                  {(() => {
              const parsedOtherCrtificate = JSON.parse(value);
              const crtifiOtherKeys = Object.keys(parsedOtherCrtificate);
                console.log('crtifiOtherKeys:', crtifiOtherKeys);

                // Get all values
                const crtifiOtherValues = Object.values(parsedOtherCrtificate);
                console.log('crtifiOtherValues:', crtifiOtherValues);
              console.log('parsedOtherCrtificate',parsedOtherCrtificate);
              return(
                <View style={{flexDirection: 'column',width: "100%"}} key={key + '-' +index + '-' + i}>
                  <View style={{flexDirection:'row',justifyContent: 'space-between',marginBottom:5}}>
                    <View style={{backgroundColor:'#e1e3e1',width: "40%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{t("Certificates_Name")}:</FormLabelDateRowViewText>
                    </View>
                    <View style={{backgroundColor:'#e1e3e1',width: "58%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{crtifiOtherKeys}</FormLabelDateRowViewText>
                    </View>
                  </View>
                  <View style={{flexDirection:'row',justifyContent: 'space-between',marginBottom:12}}>
                    <View style={{backgroundColor:'#e1e3e1',width: "40%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{t("Refernce_ID")}:</FormLabelDateRowViewText>
                    </View>
                    <View style={{backgroundColor:'#e1e3e1',width: "58%",padding:10,borderRadius:20,alignItems:'center'}}>
                      <FormLabelDateRowViewText>{crtifiOtherValues}</FormLabelDateRowViewText>
                    </View>
                  </View>
                </View>     
              )
            })()}
                  </>
                )}
                </>
              ))
            ))}
          </View>
        </InputField>
        
        {/* <InputField style={{alignItems:'flex-start'}}>
            <FormLabelView style={{top:16}}>
                <FormLabel>Achievments:</FormLabel>
            </FormLabelView>
            <View style={{width:"67%",flexDirection:'column'}}>
            {newPersonalTrainerRow.achievments.map((achievment, index) => ( 
                    <FormLabelDateRowView style={{marginTop:9}} key={index}><FormLabelDateRowViewText>{achievment}</FormLabelDateRowViewText></FormLabelDateRowView>
                ))}
            </View>
        </InputField> */}
        <InputField style={{alignItems:'flex-start',marginBottom:30,}}>
            <FormLabelView style={{top:17}}>
                <FormLabel>{t("Social_Media")}:</FormLabel>
            </FormLabelView>
            <View style={{width:"67%",flexDirection:'column'}}>
            {JSON.parse(newPersonalTrainerRow.socMed).map((socialMedia, index) => (
              Object.entries(socialMedia).map( (([platform, url], i)  => 
                <>
                {
                  (platform != 'Other')?(

                 
                <>
                <Pressable style={{ padding:10, borderRadius:20,marginTop: 9,alignItems:'center', backgroundColor: socialMediaColors[platform] || "#000" }}  onPress={()=>handlePress(url,platform)} key={platform + '-' + index + '-' + i} >
                  <FormLabelDateRowViewText style={{color:"white",fontSize:16,fontWeight:'bold'}}>{extractUserName(url)}</FormLabelDateRowViewText>
                </Pressable>
                {/* {isLink(url) ? (
                    <>
                      
                      <Pressable style={{ padding:10, borderRadius:20,marginTop: 9,alignItems:'center', backgroundColor: socialMediaColors[platform] || "#000" }}  onPress={()=>handlePress(url,platform)} key={platform + '-' + index + '-' + i} >
                        <FormLabelDateRowViewText style={{color:"white",fontSize:16,fontWeight:'bold'}}>{extractUserName(url)}</FormLabelDateRowViewText>
                      </Pressable>
                      {showWebView && (
                        <Modal
                        visible={showWebView} 
                        onRequestClose={closeWebView}
                        onDismiss={closeWebView}
                        animationType={"fade"}
                        transparent>
                        <View style={styles.webViewCon}>
                          <View style={styles.wbHead}>
                            <TouchableOpacity
                              style={{padding: 13}}
                              onPress={closeWebView}>
                              <Feather name={'x'} size={24} />
                            </TouchableOpacity>
                            <Text
                              style={{
                                flex: 1,
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: socialMediaColors[platformName] || '#00457C',
                              }}>
                              {platformName}
                            </Text>
                            <View style={{padding: 13, opacity: prog ? 1 : 0}}>
                              <Spinner size='medium'  status='info' />
                            </View>
                          </View>
                          <WebView
                          originWhitelist={['*']}
                          source={{ uri: urlLink }}
                          style={{ flex: 1 }}
                        />
                        </View>
                      </Modal>
                      )}
                    </>
                  ) : (
                    <View style={{ padding:10, borderRadius:20,marginTop: 9,alignItems:'center', backgroundColor: socialMediaColors[platform] || "#000" }}  key={platform + '-' + index + '-' + i} >
                      <FormLabelDateRowViewText style={{color:"white",fontSize:16,fontWeight:'bold'}}>{extractUserName(url)}</FormLabelDateRowViewText>
                    </View>
                  )} */}
                </>
              
              ):(
                <>
            {(() => {
              const parsedOther = JSON.parse(url);
              return Object.entries(parsedOther).map(
                ([platformOther, urlOther], OtherIndex) => (
                  
                  <View
                    key={
                      platform +
                      '-' +
                      index +
                      '-' +
                      i +
                      '-' +
                      OtherIndex
                    }
                    style={{ width: '100%', flexDirection: 'column' }}>
                    {/* <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        marginTop: 9,
                        alignItems: 'center',
                        backgroundColor: '#000',
                      }}>
                      <FormLabelDateRowViewText
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {platformOther}
                      </FormLabelDateRowViewText>
                    </Pressable> */}
                    <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        marginTop: 9,
                        alignItems: 'center',
                        backgroundColor: '#000',
                      }}
                      onPress={()=>handlePress(urlOther,platformOther)}
                      >
                      <FormLabelDateRowViewText
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {urlOther}
                      </FormLabelDateRowViewText>
                    </Pressable>
                    {/* {isLink(url) ? (

                      <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        marginTop: 9,
                        alignItems: 'center',
                        backgroundColor: '#000',
                      }}
                      onPress={()=>handlePress(urlOther,platformOther)}
                      >
                      <FormLabelDateRowViewText
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {urlOther}
                      </FormLabelDateRowViewText>
                    </Pressable>
                    ):(
                      <Pressable
                      style={{
                        padding: 10,
                        borderRadius: 20,
                        marginTop: 9,
                        alignItems: 'center',
                        backgroundColor: '#000',
                      }}
                      >
                      <FormLabelDateRowViewText
                        style={{
                          color: 'white',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {urlOther}
                      </FormLabelDateRowViewText>
                    </Pressable>

                    )} */}
                    
                  </View>
                )
              );
            })()}
          </>

              )}
            </>

              ))
            ))}
            </View>
        </InputField>
        <Spacer size="medium">
          <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
            <FormElemeentSizeButtonView style={{width:"100%"}}>
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}}  onPress={() => checkIfTrainerCanAcceptSubscription(newPersonalTrainerRow,onePrice) }>
                <CalendarFullSizePressableButtonText >{t("Subscribe")}</CalendarFullSizePressableButtonText>
              </CalendarFullSizePressableButton>
            </FormElemeentSizeButtonView>
            {/* <FormElemeentSizeButtonView style={{width:"49%"}}> 
              <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{navigation.goBack();}}>
              <CalendarFullSizePressableButtonText>{t("Back")}</CalendarFullSizePressableButtonText>
            </CalendarFullSizePressableButton>
            </FormElemeentSizeButtonView> */}
          </FormElemeentSizeButtonParentView>
        </Spacer>
        <Spacer size="large"></Spacer>
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
    color:"white",
    fontFamily:'OpenSans_400Regular',
    flex: 1,
  },
  dateBodyView: {
    flexDirection: 'row',
    justifyContent:"space-around"
  },
  rightContainerText:{
    fontSize:14,
    color:"white",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flex: 1,
  },
webViewCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wbHead: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    zIndex: 25,
    elevation: 2,
  },

});