import React, { useState, useEffect } from 'react';
import { StyleSheet,ScrollView,View,Text} from "react-native";
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
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
import "./i18n";
import { useTranslation } from 'react-i18next';


export const MembershipsHistoryScreen = ({navigation,route}) => {
  const traineeAllSubscriptions = route.params?.traineeAllSubscriptionsCon;
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
//console.log('traineeAllSubscriptions',traineeAllSubscriptions)
  const myPersonalTrainers= [
    {id:1,name:"Mohamed Al-Durrah",country:"Egypt",gender:'Him',ratings:"4.4",trainees:"6",price:"150",currency:"EGP",discount:"10%",status:"open",certificates:["ISSA","RGA"],achievments:["Arnold Pro1","Arnold Pro2"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com",tiktok:"https://tiktok.com"},startDate:"2023-10-01",endDate:"2024-12-31",period:"3",about:"Mohamed al Duurah was reaised in Egypt, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
    {id:2,name:"Sarah Kenndy",country:"United Stated",gender:'Her',ratings:"1",trainees:"7",price:"100",currency:"USD",discount:"7.5%",status:"closed",certificates:["RGA","ISSA","CfA",'CNA'],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},startDate:"2023-10-31",endDate:"2024-06-31",period:"6",about:"Sarah Kenndy was reaised in United States, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
    {id:3,name:"Mario Elves",country:"Ireland",gender:'Him',ratings:"3.5",trainees:"10",price:"10",currency:"USD",discount:"0",status:"open",certificates:["ISSA","RGA","CfA",],achievments:["Arnold Pro1","Arnold Pro2","Arnold Pro3","Arnold Pro4"],socialMedias:{facebook:"https://facebook.com",twitter:"https://twitter.com",instagram:"https://instagram.com",linkedin:"https://linkedin.com"},startDate:"2024-07-31",endDate:"2024-10-31",period:"3",about:"Mario Elves was reaised in Ireland, he won Canada natinals and won several competition in the US.Durrah is a certified nutrionist and holds multiple certificates in workouts suchas ISSA."},
];

// useEffect(() => {
//   if (traineeAllSubscriptions.length == 0) {
//     Alert.alert(
//       '',
//       'You_have_not_subscribed_to_a_personal_trainer_yet',
//       [
//         {
//           text: 'OK',
//           onPress: () => {},
//         },
//       ],
//       { cancelable: false }
//     );
//   }
// }, [traineeAllSubscriptions]);
  return (
    <PageContainer>
      <ScrollView >
          <TitleView >
            <Title >Life</Title>
          </TitleView>
          <ServicesPagesCardCover >
            <ServicesPagesCardAvatarIcon icon="tape-measure">
            </ServicesPagesCardAvatarIcon>
            <ServicesPagesCardHeader style={{textAlign:'center',}}>{t("History")}</ServicesPagesCardHeader>
          </ServicesPagesCardCover>
          {(traineeAllSubscriptions.length == 0)?(
            <Spacer size="large">
            <View >
                <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{textAlign:"center",fontSize:18,marginLeft:10,marginBottom:10,}}>{t("You_have_not_subscribed_to_a_personal_trainer_yet")}</FormLabel>
                </FormLabelView>
            </View>
            </Spacer>
          ):(
            <Spacer size="large">
            <View >
                <FormLabelView style={{width:"100%"}}>
                <FormLabel style={{fontSize:20,marginLeft:10,marginBottom:10,}}>{t("Memberships")}</FormLabel>
                </FormLabelView>
                <View style={styles.membershipDateContainer}> 
                    <View style={styles.dateHeadersView}>
                        <Text style={[styles.FromToViewText,isArabic ? styles.ArabicRightHeaderContainerHeaderTextStartDate : styles.EnglishRightHeaderContainerHeaderTextStartDate]}>{t("From")}</Text>
                        <Text style={[styles.FromToViewText,isArabic ? styles.ArabicRightHeaderContainerTextEndDate : styles.EnglishRightHeaderContainerTextEndDate]}>{t("To")}</Text>
                        <Text style={[styles.FromToViewText,isArabic ? styles.ArabicRightHeaderContainerTextPersonalTrainer : styles.EnglishRightHeaderContainerTextPersonalTrainer]}>{t("Personal_Trainer")}</Text>
                    </View>
                    {traineeAllSubscriptions.map((myPersonalTrainer,index) => (
                    <View style={styles.dateBodyView} key={index}>
                        <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextStartDate : styles.EnglishRightContainerTextStartDate]}>{myPersonalTrainer.strDat}</Text>
                        <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextEndDate : styles.EnglishRightContainerTextEndDate]}>{myPersonalTrainer.endDat}</Text>
                        <Text style={[styles.rightContainerText,isArabic ? styles.ArabicRightContainerTextPersonalTrainer : styles.EnglishRightContainerTextPersonalTrainer]} onPress={() => navigation.navigate('CurrentPersonalTrainer', { currentPersonalTrainer: myPersonalTrainer})}>{myPersonalTrainer.fName} {myPersonalTrainer.lName}</Text>
                    </View>
                    ))}
                </View>
            </View>
          </Spacer>

          )}
          
          
        {/* <Spacer size="medium">
            <FormElemeentSizeButtonParentView style={{marginLeft:10,marginRight:10}}>
                <CalendarFullSizePressableButton style={{backgroundColor:'#000'}} onPress={()=>{navigation.goBack();}}>
                <CalendarFullSizePressableButtonText >{t("Back")}</CalendarFullSizePressableButtonText>
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
  dateHeadersView:{
    flexDirection: 'row',
    justifyContent:"space-between",
  //  backgroundColor:'red',
    width:"100%",
    height:20,

  },
  FromToViewText:{
    fontSize:16,
    color:"black",
    fontFamily:'OpenSans_400Regular',
   
  },
  dateBodyView: {
    flexDirection: 'row',
    justifyContent:"space-around",
    marginBottom:40,
    width:"100%",
        // backgroundColor:'red',

  },
  rightContainerText:{
    fontSize:14,
    color:"black",
    fontFamily:'OpenSans_400Regular',
    marginVertical: 10,
    flex: 1,
  },
  EnglishRightContainerTextStartDate:{
    position:"absolute",
    left:"0%",
  },
  ArabicRightContainerTextStartDate:{
    position:"absolute",
    left:"0%",
  },
   EnglishRightHeaderContainerHeaderTextStartDate:{
    position:"absolute",
    left:"0%",
  },
  ArabicRightHeaderContainerHeaderTextStartDate:{
    position:"absolute",
    left:"0%",
  },

  
  EnglishRightHeaderContainerTextEndDate:{
    position:"absolute",
    left:"33%",
  },
  ArabicRightHeaderContainerTextEndDate:{
    position:"absolute",
    left:"28%",
  },
  EnglishRightContainerTextEndDate:{
    position:"absolute",
    left:"33%",
  },
  ArabicRightContainerTextEndDate:{
    position:"absolute",
    left:"28%",
  },

  EnglishRightHeaderContainerTextPersonalTrainer:{
    position:"absolute",
    left:"63%",

  },
  ArabicRightHeaderContainerTextPersonalTrainer:{
    position:"absolute",
    left:"68%",

  },

  EnglishRightContainerTextPersonalTrainer:{
    position:"absolute",
    left:"66%",
    width:80,

  },
  ArabicRightContainerTextPersonalTrainer:{
    position:"absolute",
    left:"68%",
    width:80,

  },

});