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
                            <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>
                                       يُـشير لفظ <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>نحن"، و "لنا"، و"لدينا"، و"الشركة"، و " اليمنت "، و"المنصة" و"المنصة الالكترونية" إلى اليمنت</Text>وعامليها والوكلاء المعتمدين لديها.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>المدربين/ المرشحين:</Text>الأشخاص المستقلين الذين يعرضون خدماتهم من خلال المنصة الالكترونية.
                                    المتدربين: الأشخاص المستخدمين والمستفيدين ومن الخدمات التي تقدم من خلال المنصة الالكترونية.
                                    </Text>
                                  <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>المتدربين: </Text>الأشخاص المستخدمين والمستفيدين ومن الخدمات التي تقدم من خلال المنصة الالكترونية.</Text>
                                    
                                <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>الخدمات: </Text>ويقصد بها خدمات <Text style={{fontWeight: "bold", color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> الوارد بيانها وفق الشروط والاحكام الماثلة.</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>المنصة الالكترونية:</Text>قصد بها الموقع الالكتروني الخاص ب <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> التي يتم الاستفادة من الخدمات المقدمة</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>المنصة الالكترونية:</Text>قصد بها الموقع الالكتروني الخاص ب <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> التي يتم الاستفادة من الخدمات المقدمة</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>القوة القاهرة: </Text>ويُـقصد بها أي حدث قدري، ومن ذلك على وجه العموم لا الحصر الحريق والفيضانات والعواصف والأعاصير والزوابع والنشاطات البركانية والزلازل، وكذا أية تصرفات أو أوامر أو طلبات تصدر من جهة سيادية أو حكومة و/أو أية هيئة يُـفترض أنها تعمل لصالح تلك الجهة، وكذا الحرب، سواء المعلنة أو غير المعلنة، والتصرفات المثيلة للحرب، والثورات، وحالات الشغب، والعصيان المدني، والاضطراب المدني، وكذا عمليات الإضراب، والتوقف عن العمل، و/أو ما شابة ذلك من حالات أو تصرفات تندرج ضمن النزاعات العمالية، وأي سبب آخر مثيل ويخرج عن نطاق تحكم أو سيطرة أي طرف، هذا ما لم يكن تنفيذه هو تنفيذ محل ضمان يسري بموجب تنازل صريح عن الإعفاء في حالة وقوع حدث القوة القاهرة.</Text>
                          <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>مقدمي الخدمات: </Text>ويقصد بهم المدربين و/أو المسجلين في فئة مقدمي الخدمات على منصة الالكترونية.</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 15,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>القوانين واجبة التطبيق:  </Text>ويقصد بها القوانين السارية لدى جمهورية مصر العربية.</Text>
                                                                                                  
                          
                          
                          </> )
                            }
                        </View>
                      <View style={{flexDirection:'column',paddingHorizontal: 10}}>

                              {selectedFilter == 'English' ? (
                                <>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Eligibility: </Text>If you are registering as a business entity (company), you represent that you have the authority to bind your entity to these terms and conditions, and that both you and your business entity will comply with all applicable laws and regulations governing the use of the electronic platform.</Text>
                                  
                                </>
                                    ):(
                                      <>
                                  <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}> <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>الصلاحية: </Text>حتى نضمن أن المستخدمين لديهم القدرة على إبرام عقود قانونية مُـلزمة، فلا يتم منح صلاحية استخدام المنصة الالكترونية للأشخاص ممن تقل أعمارهم عن ١٨ عاما أو عن السن القانونية السارية في منطقتكم، أيهما أعلى.
                                      وإذا قمتم بالتسجيل بصفتكم جهة عمل (شركة)، فيكون عليكم الإقرار بأن لديكم الصلاحية اللازمة لإلزام الكيان الخاص بكم بالشروط والأحكام الماثلة، وأنكم وكذا كيان العمل ستلتزمون بكل ما هو واجب من قوانين واشتراطاتٍ تسري على - وتخضع لها- عملية استخدام المنصة الالكترونية.
                                      </Text>
                                                                                        
                            
                            
                            </> 
                            
                          )
                              }
                          </View>
                          <View style={{flexDirection:'column',paddingHorizontal: 10}}>
                              {selectedFilter == 'English' ? (
                                <>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Accounts and Registration: </Text>To benefit from the services, you must provide all necessary information to create your account and allow <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>Element</Text> to provide services to you.</Text>
                                  
                                </>
                                    ):(
                                      <>
                                  <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}> <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>الحسابات والتسجيل: </Text> للاستفادة من الخدمات، يجب عليك تقديم جميع المعلومات المطلوبة من أجل إنشاء حسابك والسماح لاليمنت بتقديم الخدمات لكم. خلاف ذلك، يجب عليك استخدام المنصة كضيف.</Text>
                                                                                        


                              </> 

                              )
                              }
                          </View>
                          <View style={{flexDirection:'column',paddingHorizontal: 10}}>
                              {selectedFilter == 'English' ? (
                                <>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element </Text> platform requires you to provide certain personal information to <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>Element</Text> if you are using the platform as an individual or legal person, including but not limited to:
As an individual person: Your name, place of residence, qualifications, mobile number, email address, and profile picture.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> You agree to maintain accurate, complete, and updated information in your account. You are responsible for all activities that occur under your account, and you agree to maintain the confidentiality of your username and password unless otherwise authorized in writing by <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>Element.</Text></Text>
                                  
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> As user accounts are non-transferable, you agree to indemnify <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text> for any unauthorized, unlawful, or improper use of your account, whether by you or by any person accessing the electronic platform, services, or otherwise through your designated username or password, regardless of whether you permitted such access.</Text>
                                  
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> You agree that you are solely responsible for all activities related to your <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text> account and must immediately notify us of any unauthorized use of your account.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>We may terminate or suspend your account or your access to the services, in whole or in part, at our sole discretion, for any reason or no reason, without notice or liability of any kind. For example, we may terminate or suspend your account or access to the services if you misuse the platform. Any such termination or suspension may prevent you from accessing your account.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>If <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text>  has any reason to suspect (at its sole discretion) that any information you provided is false, inaccurate, incomplete, or not up to date, <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>Element</Text> reserves the right, without prejudice to any other rights or remedies available under these terms and conditions or applicable laws, to suspend, restrict, or limit your access to the platform and its services.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text> may, at its sole discretion and at any time, make inquiries (either directly or through a third party) and request further information or documents from you, including but not limited to identity verification or proof of ownership of financial instruments.</Text>
                                   <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Without limiting the aforementioned, if you are an employer or are registering on behalf of an employer, such information or documents may include a business license or other official documents related to the company, or documents proving the authority of any person to act on your behalf. You agree to provide any requested information and/or documents to <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text> upon request. If you fail to do so,<Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}> Element </Text>reserves the right, without any liability, to restrict, suspend, or revoke your access to the platform. We also reserve the right to cancel any accounts that have not been confirmed, verified, or activated for a prolonged period.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 0,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Services:</Text> </Text>
                                   <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Element</Text> is a platform that offers a variety of services to both individuals and entities, as outlined below:</Text>
                               
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>The liability of <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> is limited to assisting trainees in finding trainers, without assuming any responsibility for evaluating these candidatestrainers, their suitability for the trainees' needs, or conducting any interviews with them.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Accordingly, you acknowledge and agree that the full responsibility lies with you in assessing the suitability of the trainers and ensuring that the services provided meet your expectations and align with your requirements. <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> shall not be held liable for any outcomes resulting from your selection of trainers.</Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Collecting data from users to assist them in finding suitable trainers to meet their needs:</Text></Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>The liability of <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> is limited to collecting data from users seeking trainers, with the aim of assisting them in finding a trainer that suits their needs. <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>“Element”</Text> shall not be held responsible for the accuracy or completeness of the data provided by the trainees or the trainers using the platform, nor for the competence or ability of trainers to deliver the services offered to trainees.</Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Accordingly, you acknowledge and agree that <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> shall not be held liable for any results or consequences arising from the use of the provided data or services advertised by the trainers.</Text>
                               
                               <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"Element" provides trainers with the opportunity to engage with trainees on the platform:</Text></Text>
                               
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> provides trainers with the opportunity to engage with platform users who are seeking to benefit from the services offered by the trainers.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Accordingly, you acknowledge and agree that <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> shall not be held liable for any outcomes or disputes arising from the use of the provided data or the relationship between trainees and trainers.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Use of the Electronic Platform:</Text></Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>In consideration of the user's commitment to these terms and conditions, <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> grants the user a limited, non-exclusive, non-transferable, revocable license for the following:</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Accessing and using the services in connection with the provision of services only.</Text></Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Accessing any content and using it, as well as any information and related materials that may be available through the services.</Text></Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>It is understood that any right not expressly granted in these terms is reserved by <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text>, and such rights may be revoked or terminated at any time without prior notice to the user.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Users are prohibited from using any trademark or intellectual property rights owned by <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text>, from any part of the services. They are also prohibited from reproducing, modifying, creating derivative works, publishing, distributing, transmitting, displaying, broadcasting, or otherwise exploiting the services unless permitted or expressly authorized in writing by <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>“Element”</Text> Furthermore, users may not disassemble, reverse-engineer, or reconfigure any part of the services or link any part of the services to any reverse system. Copying, framing, launching any programs or scripts for scraping, indexing, scanning, or extracting data from the services in any other way, or burdening or hindering the operation of any aspect of the services, or attempting unauthorized access to the services, or impairing any aspect of the services or the associated systems or networks is also prohibited.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>Users are not allowed to publish any of the following on any part of the electronic platform (as determined at our sole discretion):Any advertisements for solicitation, Any promotional material, Use of offensive language or materials that are obscene or contain insults or cultural or religious transgressions, Any politically critical content, Materials that could pose a threat to public interest or national security, Content that may cause harm to reputation, defamation, or any other content that may be offensive or obscene.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>It is strictly prohibited to copy, transfer, reproduce, duplicate, publish, or redistribute (a) the content or any part thereof and/or (b) the services in general without obtaining prior written permission from <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> To request permission, please direct your request to: (ElementDevelops@gmail.com)</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Electronic Communication:</Text></Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>When creating an account, you agree to communicate with us electronically. Therefore, you consent to receive periodic messages from us. <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> will communicate with you via email, calls, and may also send you information through text messages, as well as publish notifications on the electronic platform as part of the regular business management associated with your use of the services. You acknowledge that your choice not to use the mentioned electronic communication methods may affect your ability to use the services.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>You also agree that all agreements, notices, disclosures, and other communications that we provide to you electronically shall satisfy any legal requirement that such communications be in writing.</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> will request your consent during the registration process to send you emails or promotional notifications related to the electronic platform and its services.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Payments:</Text></Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> offers its services according to several packages tailored for each service area, Some of Tthese services are provided to users free of charge, others are charged when subscribing to a trainer</Text>
                            <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>“Element”</Text> grants trainers the right to collect payment for the services provided within a period ranging from 7 to 14 days, pursuant to a request submitted in advance via the electronic platform.</Text>
                            <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'left',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>To know about the available package prices, users can refer to the personal trainer search section on the platform </Text>



                                </>
                                    ):(
                                      <>
                                  <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}> تطلب منك منصة <Text style={{fontWeight: "bold", color:'#000',
                                        fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> تقديم بعض البيانات الشخصية إلى <Text style={{fontWeight: "bold", color:'#000',
                                          fontFamily:'OpenSans_400Regular'}}>اليمنت</Text>  في حالة الاستخدام كشخص طبيعي او اعتباري بما في ذلك على سبيل المثال لا الحصر
                                      الاستخدام كشخص طبيعي: اسمك الكامل و محل الاقامة و المؤهل و السيرة الذاتية و التاريخ الوظيفي و رقم هاتفك المحمول و عنوان بريدك الإلكتروني و بطاقة الائتمان خاصتك وصورة شخصية.</Text>
                                  <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>ويكون عليكم الموافقة على ان يتم حفظ معلومات صحيحة ودقيقة وكاملة ومحدثة في حسابك. كما سيكون عليكم أن تتحملوا المسئولية عن كل نشاطٍ يجري في إطار حسابكم، كما تلتزمون بالموافقة على الحفاظ وباستمرار على سريان إجراءاتٍ أمنية على اسم المستخدم وكلمة المرور الخاصة بحسابكم، هذا ما لم تصرح <Text style={{fontWeight: "bold", color:'#000',
                                        fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> بغير ذلك كتابة.</Text>
                                    
                                    <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>وحيث أنه لا يجوز نقل أو حوالة حسابات المستخدمين، فلهذا يكون عليكم الموافقة على أن تردوا إلى <Text style={{fontWeight: "bold", color:'#000',
                                        fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> قيمة أية عملية استخدام لحسابكم، ولم تكن عملية صحيحة أو مُصرح بها أو تسري وفق القانون، وحدث ذلك من جانبكم أو من جانب أي شخص يمكنه الدخول على   المنصة الالكترونية أو الخدمات أو خلافه من خلال استخدام اسم المستخدم أو كلمة المرور المحددة من جانبكم، بل وسواء سمحتم بذلك الدخول أم لا.</Text>
                                    <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>أنت توافق على أنك المسؤول الوحيد عن جميع الأنشطة التي تحدث فيما يتعلق بحساب <Text style={{fontWeight: "bold", color:'#000',
                                        fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> ويجب عليك إخطارنا على الفور بأي استخدام غير مصرح به لحسابك.</Text>
                                      <Text style={{fontSize: 16,
                                      marginBottom: 15,
                                      textAlign:'right',
                                      lineHeight: 22,
                                      color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>يجوز لنا إنهاء أو إيقاف الدخول على حسابك أو قدرتك على استخدام الخدمات، كليا أو جزئيا، وفقا لتقديرنا الخاص، لأي سبب أو بدون سبب، ودون إشعار أو مسؤولية من أي نوع. على سبيل المثال، يجوز لنا إنهاء أو تعليق حسابك أو قدرتك على استخدام الخدمات إذا أساءت استخدام المنصة الالكترونية قد يمنعك أي إنهاء أو إيقاف من هذا القبيل من الوصول إلى حسابك.</Text>
                                          <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>  وإذا نما لدى <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> (وحسب مطلق اختيارها) ثمة شكوك بأن أية معلومة من المعلومات التي تقدمتم بها هي معلومة غير صحيحة، أو غير دقيقة، أو غير كاملة، أو غير محدثة، دونما إخلال بأية حقوق أخرى وتعويضاتٍ مكفولة ل <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> وفق الشروط والاحكام الماثلة أو بمقتضى القوانين واجبة التطبيق، فيكون لدينا الحق في إيقاف عملية دخولكم على المنصة الالكترونية وخدماته، أو تحديد هذا الدخول أو قصره.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}> ويجوز ل <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت </Text>القيام (وحسب مطلق اختيارها، بل وفي أي حين) بإبداء أية استفسارات تراها ضرورية (سواء تم ذلك بصورة مباشرة أو من خلال طرف من الغير)، وكذا مطالبتكم بتقديم الرد وبمزيد من المعلومات أو المستندات، ومنها على وجه العموم لا الحصر معلومات ومستندات للتحقق من هويتكم و/أو ملكيتكم لسنداتكم المالية.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>ودونما تقييد لما سلف بيانه، فإذا كنتم بمثابة جهة عمل أو مسجلين بالنيابة عن جهة عمل، فيجوز أن تشمل هذه المعلومات أو المستندات الترخيص التجاري وغير ذلك من مستنداتٍ رسمية خاصة بالشركة و/أو مستنداتٍ تستعرض أية صلاحية مكفولة لأي شخص للعمل نيابة عنكم. ويكون عليكم الموافقة على توفير أية معلوماتٍ و/أو مستندات إلى <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت </Text>فور طلبها إياها. كما يكون عليكم الإقرار والموافقة على أنه إذا تعذر عليكم القيام بذلك، فيجوز لاليمنت القيام ودونما أية مسئولية عليها بتقييد أو إيقاف أو سحب عملية دخولكم على المنصة الالكترونية. كما نحتفظ أيضا بالحق في إلغاء أية حساباتٍ لم يرد تأكيد بشأنها أو لم يتم التحقق منها أو أية حساباتٍ لم تكن مفعلة لمدة طويلة.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 0,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>الخدمات:</Text></Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت </Text>هي منصة تقدم العديد من الخدمات للأشخاص الطبيعية والاعتبارية، ومتخصصة في المجالات الرياضية وتكون تلك الخدمات على النحو الاتي:</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>تقتصر مسؤولية <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> على تقديم المساعدة للمتدربين في العثور على المدربين المناسبين، دون أن تتحمل أي مسؤولية عن تقييم هؤلاء المرشحين أو مدى ملاءمتهم لاحتياجات المتدربين، أو إجراء أي مقابلات معهم.</Text>
                                 <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>وبناءً على ذلك، فإنك تقر وتوافق على أن المسؤولية الكاملة تقع على عاتقك في تقييم مدى توافق المرشحين والتأكد من أن الخدمات المقدمة تلبي توقعاتكم وتتوافق مع متطلباتكم، ولا تتحمل <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> أي مسؤولية عن أي نتائج مترتبة على اختيارك للمرشحين.</Text>
                                   <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>جمع البيانات من المستخدمين لمساعدتهم في العثور على مدربين مناسبين لتلبية احتياجاتهم:</Text></Text>
                                    <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>تقتصر مسؤولية <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> على جمع البيانات من المستخدمين الباحثين عن مدربين بهدف مساعدتهم في العثور على مدرب يناسب احتياجاتهم. ولا تتحمل <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> أي مسؤولية عن دقة أو اكتمال البيانات المقدمة من المتدربين او المدربين مستخدمي المنصة او مدي كفاءة وقدرته المدربين علي تنفيذ الخدمات المعروضة علي المتدربين.</Text>
                                 <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>وبناءً على ذلك، فإنك تقر وتوافق على أن <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> ليست مسؤولة عن أي نتائج أو تبعات قد تنشأ عن استخدام البيانات المقدمة أو الخدمات المعلن عنها من المدربين.</Text>
                                  <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>تتيح اليمنت للمدربين الفرصة الاستفادة من مستخدمي المنصة من المتدربين:</Text></Text>                                                        
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>تتيح <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> للمدربين الفرصة الاستفادة من المتدربين مستخدمي المنصة و الراغبين في الاستفادة من الخدمات التي يقدمها المدربين، وتكون مسؤولية اليمنت محدودة فقط في تسهيل الوصول إلى هؤلاء المتدربين المحتملين.</Text>                                                                          
                               <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>وبناءً على ذلك، فإنك تقر وتوافق على أن <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> ليست مسؤولة عن أي نتائج أو نزاعات قد تنشأ عن استخدام البيانات المقدمة أو العلاقة بين المتدربين و المدربين .</Text>                                                                          
                                 <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>استخدام المنصة الالكترونية:</Text></Text>                                                                                                       
                                <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>نظير التزام المستخدم بالشروط والأحكام الماثلة، تمنح <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> إلى المستخدم ترخيصًا محدودا وغير حصري ولا يجوز منحه من الباطن وغير قابل للإلغاء أو الإبطال، بل وغير قابل للحوالة أو النقل فيما يتعلق بما يلي:</Text>
                                <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>الدخول على الخدمات واستخدامها فيما يتعلق بعملية تقديم الخدمات وحسب.</Text></Text>                                                                                                       
                                <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>الدخول على أي محتوى واستخدامه وكذا أية معلومات وما يرتبط بها من مواد قد تتوفر من خلال الخدمات.</Text></Text>                                                                                                       
                              <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>علما بأن أي حق لم يتم منحه على نحو صريح في هذه الشروط هو حق محفوظ <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text>، بل ويجوز إلغاؤه أو إبطاله في أي حين، بل ودونما أي إخطارٍ بذلك إلى المستخدم.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>ويحظر على المستخدم استخدام أية علامة تجارية أو أي حقوق ملكية فكرية تخص <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> ، وذلك من أي جزء من الخدمات، كما يحظر عليه إعادة إنتاج الخدمات أو تعديلها أو إجراء أية عملية إعداد أو نشر أو تنفيذ أو إرسال أو عرض أو بث أو غير ذلك من وسائل استغلال الخدمات، هذا ما لم تسمح <Text style={{fontWeight: "bold", color:'#000',
                                      fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> بذلك أو يأذن صراحة بذلك كتابة، كما لا يجوز إجراء أعمال تفكيك لنظام الخدمات أو إجراء أي هندسة عكسية أو إعادة تشكيل لها، أو القيام بربط أي جزء من الخدمات بأي نظام عاكس كما لا يجوز نسخ أو تأطير أي جزء من الخدمات أو إطلاق أي برامج أو نصوص برمجية لغرض كشط، أو فهرسة، أو إجراء مسح، أو استخراج البيانات من الخدمات بأي طريقة أخرى، أو إثقال كاهل أو إعاقة تشغيل أي جانب من جوانب الخدمات، أو محاولة الدخول على الخدمات غير المصرح به أو إضعاف أي جانب من جوانب الخدمات أو الأنظمة او الشبكات المرتبطة بها.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>ولا يجوز للمستخدم القيام في أي موضع آخر بالمنصة الالكترونية الإلكتروني (وذلك حسبما يتقرر وحسب مطلق اختيارنا) بأية عملية نشر للآتي: أية دعاية لغرض الاستقطاب، أو أية إعلانات، أو استخدام لغة مبتذلة، أو مواد تشوبها البذاءة أو تحتوي على سباب أو تجاوزات من الناحية الثقافية أو الدينية أو أي محتوى سياسي نقدي أو مواد من شأنها إحداث تهديد للصالح العام أو الأمن القومي أو التسبب في إساءة السمعة، أو القذف، أو التشهير، أو أي محتوى آخر قد تشوبه الإهانة أو البذاءة.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 15,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>يحظر تماما نسخ، أو نقل، أو إعادة إنتاج، أو تكرار، أو نشر، أو إعادة توزيع (أ) المحتوى أو أي جزء منه و/أو (ب) الخدمات بشكل عام دون الحصول على إذن كتابي مسبق من <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> لطلب الإذن، يرجى توجيه طلبك إلى ElementDevelops@gmail.com</Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>عمليات التواصل الإلكتروني:</Text></Text>                                                                                                       
                                <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>عند إنشاء حساب، يكون عليكم الموافقة على انكم ستتواصلون معنا إلكترونيا. وبالتالي، عليكم الموافقة على استلام رسائل دورية من جانبنا. وسوف تتواصل معكم <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> عبر البريد الإلكتروني أو قد ترسل لكم معلومات عبر رسائل نصية قصيرة، وكذا القيام بنشر إخطاراتٍ على المنصة الالكترونية كجزء من إدارة الأعمال المعتادة والتي ترتبط بعملية استخدامكم للخدمات. ويكون عليكم الإقرار بأن اختياركم عدم منصة الالكترونية وسائل التواصل المذكورة هو أمر من شأنه إحداث ثمة تأثير على عملية استخدامكم للخدمات.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>كما يكون عليكم الموافقة على أن تكون جميع الاتفاقات والاخطارات والافصاحات وغير ذلك من مراسلاتٍ مما نقوم بتقديمها اليكم إلكترونيا هي مراسلاتٍ تستوفي أي اشتراط قانوني يستلزم تقديم تلك المراسلات على نحو كتابي.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>كما ستطلب منكم <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> خلال عملية التسجيل الموافقة على أن نرسل لكم رسائل بريد إلكتروني أو إخطاراتٍ دعائية ترتبط بالمنصة الالكترونية وما به من خدمات. وإذا حدث في أي حين أن قررتم أو أبديتم عدم الرغبة في استلام رسائل البريد الإلكتروني الدعائية، فيمكنكم اختيار عدم استلامها من خلال الضغط على الرابط الكائن في أسفل أية رسالة بريد إلكتروني دعائية.</Text>
                               <Text style={{fontSize: 16,
                                  marginBottom: 5,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>المدفوعات:</Text></Text>                                                                                                       
                                <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>تقدم <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> وسيلة السداد الإلكتروني على الموقع الإلكتروني عن طريق وسائل الدفع الإلكتروني ومنها على سبيل المثال لا الحصر بطاقات ائتمان ومحافظ بنكية الكترونية او عن طريق شبكات المحمول (خصم مباشر من الرصيد او مع تحصيل الفواتير)، ويلتزم المستخدم بسداد مقابل الخدمة قبل بداية مدة اشتراك الخدمة وتكون مستحقة في أول أسبوع من كل شهر.</Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>كذلك توفر <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> حق للمدربين تحصيل مقابل الخدمة المقدمة علي في خلال مدة تتراوح بين 7 ايام الي 14 يوم بموجب طلب مقدم مسبقا من خلال المنصة الالكترونية </Text>
                              <Text style={{fontSize: 16,
                                  marginBottom: 10,
                                  lineHeight: 22,
                                  textAlign:'right',
                                  color:'#000',
                                  fontFamily:'OpenSans_400Regular'}}>لمعرفة أسعار الباقات المتاحة، يمكن للمستخدمين الاطلاع عليها في القسم المخصص للمدفوعات على المنصة، أو التواصل مباشرة مع <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>"اليمنت"</Text> للحصول على مزيد من التفاصيل.</Text>
                              
                              
                              
                              </> 

                              )
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