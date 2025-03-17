import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { Spacer } from "../../../components/spacer/spacer.component";

import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
  TraineeOrTrainerButtonField,
  TraineeOrTrainerButtonsParentField,
  FormLabel,
  TraineeOrTrainerField,
  FormLabelView,
  Title,
  MenuItemPressableButton,
  MenuItemPressableImagedButton,
  MenuItemPressableButtonText,
  MenuItemPressableButtonAvatarChevronRight,
  MenuItemPressableButtonAvatarAccount,
  SeparatorView,
  SeparatorViewSpacer,
  WhitePageContainer,
  BlackTitle,
  InputField,
} from "../components/account.styles";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
    
const { width } = Dimensions.get('window');
import { RadioButton} from "react-native-paper";

export const TermsAndConditionsPageScreen = ({ navigation }) => {
    const {t} = useTranslation();//add this line
    const [selectedFilter, setSelectedFilter] = useState('English'); // State to manage the selected filter

















    return (
      <WhitePageContainer >
          <ScrollView>
              <AccountBackground >
                  <TitleView >
                      <BlackTitle >Life</BlackTitle>
                  </TitleView>
                  
                  <View style={styles.viewContainer} >
                  <Spacer size="medium">
                        <TraineeOrTrainerField style={{paddingHorizontal: 10,}}>
                            <FormLabelView>
                            <FormLabel>{t("Language")}:</FormLabel>
                            </FormLabelView>
                            <TraineeOrTrainerButtonsParentField style={{top:-5}}>
                            <TraineeOrTrainerButtonField >
                                <RadioButton
                                value="English"
                                status={ selectedFilter === 'English' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('English')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                                
                                />
                                <FormLabel>{t("English")}</FormLabel>
                            </TraineeOrTrainerButtonField>
                            <TraineeOrTrainerButtonField>
                                <RadioButton
                                value="Arabic"
                                status={ selectedFilter === 'Arabic' ? 'checked' : 'unchecked' }
                                onPress={() => setSelectedFilter('Arabic')}
                                uncheckedColor={"#000"}
                                color={'#000'}
                                />
                                <FormLabel>{t("Arabic")}</FormLabel>
                            </TraineeOrTrainerButtonField>
                           
                        </TraineeOrTrainerButtonsParentField>
                        </TraineeOrTrainerField>
                    </Spacer>
                    <View style={{flexDirection:'column',paddingHorizontal: 10}}>

                    <Text style={{fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color:'#000',fontFamily:'OpenSans_400Regular',}}
                        >{selectedFilter == 'English' ? ' Terms and conditions' : 'الشروط والأحكام'}</Text>
                    <Text style={{fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 20,
                        color:'#000',
                        fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Welcome to Element' : 'مرحبا بكم في اليمنت'}</Text>
                        {selectedFilter == 'English' ? (
                          <>
                            <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>The following terms and conditions govern your use of <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text>‘s electronic platform, as well as any related websites and services. By using <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Element</Text>‘s platform, you agree to these terms and conditions. If you do not agree to these terms and conditions, you must refrain from accessing or using the platform as a guest.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>The following terms and conditions apply to all users with respect to the services provided through <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text> electronic platform. These terms and conditions become effective immediately upon your acceptance of the services through the platform or through any other form of communication with
<Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> Element</Text></Text>
                          <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>Please note that our Privacy Policy  should be reviewed and accepted, as it forms an integral part of these terms and conditions.</Text>
                          <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>This agreement supersedes any prior agreements or arrangements between you and <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element. Element </Text>reserves the right to terminate this agreement and/or the provision of any services hereunder immediately, or to cease providing or deny access to the services or any part thereof at its sole discretion, at any time and for any reason, without liability to you.</Text>
                           <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>The user agrees and acknowledges that their use of <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element </Text>platform and services is done at their own risk and further acknowledges that <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Element </Text> disclaims and is released from any representations or warranties of any kind, whether express or implied.
</Text>
                          
                          </>
                              ):(
                                <>
                            <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    يرد فيما يلي الشروط والأحكام التي تسري بشأن عملية استخدام المنصة الالكترونية <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> وكذا كل ما يرتبط بها من مواقع وخدمات، علما بأن استخدام المنصة الالكترونية <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>اليمنت</Text>  إذ يعتبر بمثابة موافقة من جانبكم على الشروط والأحكام الماثلة. وإذا لم توافقوا على هذه الشروط والأحكام، فيكون عليكم عدم الدخول على المنصة الالكترونية أو استخدامها كضيف.</Text>
                         <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                   تطبق الشروط والأحكام التالية على جميع المستخدمين فيما يتعلق بالخدمات المقدمة من خلال المنصة الالكترونية اليمنت. تدخل هذه الشروط والأحكام حيز التنفيذ بمجرد قبولك للخدمة من خلال المنصة الالكترونية أو من خلال أي شكل آخر من أشكال التواصل مع <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>اليمنت</Text></Text>
                         <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    ونرجو الإحاطة بأنه ينبغي مُراجعة سياسة الخصوصية السارية لدينا والمُوافقة عليها باعتبارها جزءً لا يتجزأ من هذه الشروط والأحكام.</Text>
                         <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    تحل هذه الاتفاقية محل أي اتفاقيات أو ترتيبات سابقة بينك وبين <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text>. يجوز <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>لإليمنت </Text>إنهاء هذه الاتفاقية و/أو أي توفير للخدمات بموجبها على الفور، أو التوقف بشكل عام عن تقديم أو رفض الوصول إلى الخدمات أو أي جزء منها وفقا لتقديرها الخاص، في أي وقت ولأي سبب، دون تحمل أي مسؤولية تجاهك.<Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text></Text>
                       <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    يُـوافق المستخدم، بل ويقبل بأن يكون استخدام المنصة الالكترونية والخدمات التي تقدمها <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> استخداما يسري على مسئوليته الخاصة، كما يُـقر أيضا بأن <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> تبرأ، بل وتعفى من أية إقراراتٍ أو ضماناتٍ من أي نوع، سواءً صدرت صراحة أو ضمنًا.</Text>
                       
                       </> )
                        }
                    </View>
                    <View style={{flexDirection:'column',paddingHorizontal: 10}}>

                        <Text style={{fontSize: 18,
                            fontWeight: 'bold',
                            marginTop: 20,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Definitions:' :'تعريفات:'}</Text>
                            {selectedFilter == 'English' ? (
                              <>
                                <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>The following definitions apply to the terms and conditions set forth below. These terms and conditions, along with the Privacy Policy, collectively represent all that has been agreed upon and understood between  <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Element, the trainer, and the trainee,</Text> whether the User is an individual or entity accessing the electronic platform.</Text>
                                <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>The terms <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>"we" "us" "our" "the company" " Element ""the platform" and "the electronic platform" </Text> refer <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text>, its employees, and its authorized agents.</Text>
                              
                              <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Trainers/candidates:</Text> They are users who provide these services through the electronic platform. We accept trainers on our platform based on certain criteria set reference to our internal policies.
                               <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Trainees:</Text> They are the individuals who gain benefits from and request the services presented through the platform.</Text>
                              <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Services: </Text>  The services provided by <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element </Text> as outlined in these terms and conditions.</Text>
                                     <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Force Majeure:</Text> Refers to any act of nature, including but not limited to fire, floods, storms, hurricanes, tornados, volcanic activity, earthquakes, as well as any actions, orders, or requests issued by a sovereign authority, government, or any entity acting on behalf of such authority, and war (whether declared or undeclared), acts of war, revolutions, riots, civil commotion, civil unrest, strikes, work stoppages, or any other similar acts that constitute labor disputes, or any other similar cause beyond the control of any party, unless the performance of the obligation is guaranteed through an express waiver of exemption in the event of force majeure.</Text>
                                     <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Service Providers:</Text> Refers to trainers and the individuals registered as service providers on the electronic platform.</Text>
                                     <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Applicable Laws:</Text> Refers to the laws in force in the Arab Republic of Egypt.</Text>
                                     <Text style={{fontSize: 16,
                                marginBottom: 15,
                                lineHeight: 22,
                                textAlign:'left',
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Services: The services provided by Element as outlined in these terms and conditions.
                                <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element </Text> </Text>
                              
                              </>
                                  ):(
                                    <>
                                <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>
                                        تسري التعريفات التالية على الشروط والأحكام المعروضة أدناه، علما بأن هذه الشروط والأحكام هي وسياسة الخصوصية إذ تعتبر وبموجب هذا المُحرر كل ما تم الاتفاق عليه والتفاهم بشأنه فيما بين <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت والمدرب و المتدرب </Text>سواء كان المستخدم في صورة شخص أو كيان يقوم بالدخول على المنصة الالكترونية.</Text>
                            
                          </> )
                            }
                        </View>
                  
                  
                  </View>
  
  
  
              </AccountBackground>
          </ScrollView>
      </WhitePageContainer>
    );
};
const styles = StyleSheet.create({
    viewContainer: {
      width: width - 20, // he screen width minus padding
      // height: 400, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    image: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
  
   
    });