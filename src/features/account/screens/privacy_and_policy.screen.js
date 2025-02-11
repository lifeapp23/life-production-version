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

export const PrivacyAndPolicyPageScreen = ({ navigation }) => {
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
                        >{selectedFilter == 'English' ? 'Privacy Policy' : 'سياسة الخصوصية'}</Text>
                    <Text style={{fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 20,
                        color:'#000',
                        fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Introduction' : 'مقدمة'}</Text>
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text> respects your privacy and is committed to protecting Data. This Privacy Policy will inform you as to how we look after Data when you visit and use our Platform (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 15,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    تحترم <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> خصوصيتك وتلتزم بحماية البيانات. وستُعلمك سياسة الخصوصية هذه بكيفية قيامنا بالاعتناء بالبيانات عند زيارتك واستخدامك للمنصة الإلكترونية الخاصة بنا (بغض النظر عن المكان الذي تقوم بزيارته منه) وتخبرك عن حقوق الخصوصية الخاصة بك وكيف يقوم القانون بحمايتك.
                                </Text>
                        )
                        }
                    </View>
                    
                    <View style={{flexDirection:'column',paddingHorizontal: 10}}>

                    
                    <Text style={{fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 15,
                        color:'#000',
                        fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Glossary' : 'مسرد المصطلحات'}</Text>
                        
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>You OR Your:</Text> shall refer to the users of our Platform.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                    تحترم <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>أنت أو لك:</Text> تعود على مستخدمي المنصة الخاصة بنا.                                </Text>
                        )
                        }

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Platform:</Text> means <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text> Platform whereby its Services shall be used.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>المنصة:</Text>
                                يقصد بها المنصة الالكترونية الخاصة ب 
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> التي يتم الاستفادة من الخدمات المقدمة من خلالها.

                                </Text>
                        )
                        }

                    {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Data:</Text> the information that we collect from users while using the Platform.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>البيانات:</Text> المعلومات التي يتم جمعها من المستخدمين أثناء استخدام المنصة الإلكترونية</Text>
                        )
                        }

                    {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Services:</Text> means <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text> services and described by the Terms and Conditions.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>الخدمة :</Text>
                                يقصد بها خدمات
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}> اليمنت</Text> والموضحة في الشروط والاحكام.

                                </Text>
                        )
                        } 

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Account:</Text> refers to the User account on the Platform.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>الحساب:</Text> يقصد به حساب المستخدم على المنصة الإلكترونية.</Text>
                        )
                        }

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element:</Text> refers to the platform owned by ……………… under commercial registration number ………. …… Investment office.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت: </Text>ويقصد بها المنصة الإلكترونية المملوكة لشركة ................. تحت سجل تجارى رقم ........ مكتب استثمار ........</Text>
                        )
                        }

                    {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element:</Text> refers to the platform owned by ……………… under commercial registration number ………. …… Investment office.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت: </Text>ويقصد بها المنصة الإلكترونية المملوكة لشركة ................. تحت سجل تجارى رقم ........ مكتب استثمار ........</Text>
                        )
                        }

                    <Text style={{fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 15,
                        color:'#000',
                        fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Important information and who we are' : "معلومات مهمة ومن نحن"}</Text>
                    <Text style={{fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 5,
                        marginBottom:5,
                        color:'#000',
                        fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Purpose of this Privacy Policy:' : "الغرض من سياسة الخصوصية هذه:"}</Text>
                        
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>This Privacy Policy aims to give you information on how <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}> Element </Text>collects and processes Data through your use of our Platform, including any Data you may provide through this Platform when you register and/or use our Services, as well as sign up to our Platform. It is important that you read this Privacy Policy along with our Terms and Conditions so that you are fully aware of how and why we are using this Data. This Privacy Policy supplements other notices and Privacy Policies and is not intended to override them.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>تهدف سياسة الخصوصية هذه إلى اطلاعك حول كيفية قيام <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>اليمنت </Text>بجمع البيانات ومعالجتها من خلال استخدامك للمنصة الالكترونية، بما في ذلك أي بيانات قد تقدمها من خلال هذا المنصة عند التسجيل و/أو استخدام خدماتنا، وكذلك التسجيل في المنصة.
    من المهم أن تقرأ سياسة الخصوصية هذه إلى جانب الشروط والأحكام الخاصة بنا عند قيامنا بجمع أو معالجة البيانات عنك لكي تكون على دراية كاملة عن كيف ولماذا نستخدم هذه البيانات. تكمل سياسة الخصوصية هذه الإشعارات وسياسات الخصوصية الأخرى ولا تهدف إلى تجاوزها.</Text>
                        )
                        }

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Controller:</Text> …………………………… an … Company Commercial Registration No. …….. is the controller and responsible for Data (referred to as  <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element</Text> , "we", "us" or "our" in this Privacy Policy). ……………. is the controller and responsible for this Platform.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>المُتحكم :</Text>
                                شركة ...................، شركة .............. سجل تجارى رقم ......... هي المتحكم والمسؤول عن البيانات (يشار إليها باسم 
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}> “اليمنت”</Text> أو "نحن" أو "إيانا" أو "لنا" أو في سياسة الخصوصية هذه). ................. هي المتحكم والمسؤول عن هذا المنصة.

                                </Text>
                        )
                        } 
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Contact details:</Text> If you have any questions about this Privacy Policy or our privacy practices, please feel free to contact us through the email address:</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>بيانات الاتصال :</Text>إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه أو ممارسات الخصوصية الخاصة بنا، لا تتردد في الاتصال بنا من خلال عنوان البريد الإلكتروني:</Text>
                        )
                        } 

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Changes to the Privacy Policy and your duty to inform us of changes</Text> We keep our Privacy Policy under regular review. 
                                It is important that the Data we hold about you is accurate and current. Please keep us informed if Data changes during your relationship with us.
                                </Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>تغييرات على سياسة الخصوصية وواجبك لإبلاغنا بالتغييرات:</Text>نحن نخضع سياسة الخصوصية الخاصة بنا للمراجعة الدورية.
                                من المهم أن تكون البيانات التي نحتفظ بها عنك دقيقة وحديثة. يرجى إخطارنا إذا تغيرت البيانات خلال علاقتك معنا.</Text>
                        )
                        } 

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Third-party Links: </Text>This Platform may include links to third-party Platform s and plug-ins.may allow third parties to collect or share Data about you. We do not control these third-party Platform s and we are not responsible for their privacy statements.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>روابط الطرف الثالث: </Text>قد يتضمن هذا المنصة روابط إلى مواقع إلكترونية ومكونات إضافية ومواقع لطرف ثالث. قد يؤدي النقر على هذه الروابط أو تمكين هذه الاتصالات إلى السماح للأطراف الثالثة بجمع أو مشاركة بيانات عنك. نحن لا نتحكم في المواقع الإلكترونية الخاصة بهذا الطرف الثالث، ونحن غير مسؤولين عن بيانات الخصوصية الخاصة بهم. نوصيك بقراءة سياسة الخصوصية الخاصة بكل منصة إلكترونية تقوم بزيارتها</Text>
                        )
                        } 

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Data that we collect: </Text>Data means any information about an individual or institution from which that entity can be identified. It does not include Data where the identity has been removed (anonymous Data).We <Text style={{fontWeight: "bold", color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>may collect, </Text>use, store and transfer different kinds of Data about you, which is including, but not limited to the following: </Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>البيانات التي نجمعها: </Text>البيانات تعني أي معلومات عن فرد او مؤسسة والتي يمكن منها تحديد هوية ذلك الكيان وهي لا تشمل البيانات التي تم فيها إزالة الهوية (بيانات مجهولة المصدر).
                                <Text style={{fontWeight: "bold", color:'#000',
                                                                    fontFamily:'OpenSans_400Regular'}}> قد نجمع </Text>
                                ونستخدم ونخزن وننقل أنواعًا مختلفة من البيانات عنك والتي تتضمن، على سبيل المثال لا الحصر، ما يلي:</Text>
                        )
                        } 

                        {selectedFilter == 'English' ? (<>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Identity Data includes first name,  Last name, username or similar identifier, date of birth and gender.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Contact Data includes phone number, e-mail and postal addresses.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Financial Data includes your bank account information, credit card details, cardholder name, expiration date, authentication code and billing address.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Technological Data includes your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and location, and other technology on the devices you use to access the Platform.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Profile Data  your username and password,  interests, preferences, purchasing power, reviews and ratings, feedback, and survey responses.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Usage Data includes information about how you use our Platform and your transaction history.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Photos, reviews, social posts, and videos you may have provided to us.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- The company incorporation documents which but not limited to (Articles of Association, Commercial Register, Tax Card and investment gazette.)</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>In addition to the categories noted above, we may also collect certain location Data if you have instructed your device to send such Data via the privacy settings on that device.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>We also collect, use, and share aggregated Data such as statistical or demographic Data for any purpose. Aggregated Data could be derived from Data but is not considered Data in law as this Data will not directly or indirectly reveal your identity. For example, we may aggregate your usage Data to calculate the percentage of users accessing a specific Platform feature. However, if we combine or connect aggregated Data with Data so that it can directly or indirectly identify you, we treat the combined Data as Data which will be used in accordance with this Privacy Policy.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>At <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Element,</Text> we use the data we collect to develop and train AI models to improve our services, including but not limited to: content personalization, improving the performance of our services. We emphasize that we are committed to protecting your privacy, we do not disclose sensitive information, and we ensure the security of your data through robust security technologies.</Text>
                            </>
                        ):(<>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- بيانات الهوية تشمل الاسم الأول، أو اسم العائلة، أو اسم المستخدم، أو معرف مماثل وتاريخ الميلاد والجنس.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>-بيانات الاتصال تشمل رقم الهاتف المحمول والبريد الإلكتروني، والعنوان البريدي.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- البيانات المالية تشمل تفاصيل الحساب البنكي وتفاصيل بطاقة الدفع واسم حامل البطاقة وكذلك تاريخ الانتهاء ورمز التحقق وعنوان ارسال الفواتير.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- البيانات التقنية تشمل بيانات تسجيل الدخول ونوع متصفح الإنترنت وإصداره وإعداد المنطقة الزمنية وأنواع المكونات الإضافية وإصدارات متصفح الإنترنت ونظام التشغيل والموقع وغيرها من التقنيات على الأجهزة التي تستخدمها للوصول إلى المنصة.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- بيانات الملف الشخصي تشمل اسم المستخدم وكلمة المرور واهتماماتك وتفضيلاتك وقوتك الشرائية وآرائك وتقييماتك وتعليقاتك وردود الاستطلاع الخاصة بك.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- بيانات الاستخدام تشمل معلومات حول كيفية استخدامك للمنصة الإلكترونية وسجل المعاملات الخاص بك.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- الصور والتعليقات والمشاركات الاجتماعية ومقاطع الفيديو التي ربما تكون قد قدمتها لنا.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- بيانات الموقع الجغرافي.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- لبيانات والمستندات الخاصة بشركتك وتشمل على سبيل المثال لا الحصر (عقد التأسيس، السجل التجاري، البطاقة الضريبة وصحيفة الاستثمار.)</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- بالإضافة إلى الفئات المذكورة أعلاه، قد نقوم أيضا بجمع بيانات موقع معينة إذا كنت قد طلبت من جهازك إرسال هذه البيانات عبر إعدادات الخصوصية على هذا الجهاز.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- كما نقوم أيضًا بجمع البيانات المجمعة واستخدامها ومشاركتها، مثل البيانات الإحصائية أو السكانية لأي غرض. يمكن الحصول على البيانات المجمعة من البيانات، ولكنها لا تعتبر بيانات في القانون لأن هذه البيانات لن تكشف هويتك بشكل مباشر أو غير مباشر. على سبيل المثال، قد نقوم بتجميع بيانات الاستخدام الخاصة بك لحساب النسبة المئوية للمستخدمين الذين يصلون إلى خاصية محددة في المنصة ولبعض الاحصائيات ومع ذلك، إذا قمنا بدمج أو وصل البيانات المجمعة مع البيانات بحيث يمكنها تحديد هويتك بشكل مباشر أو غير مباشر، فنحن نعامل البيانات المجمعة كبيانات والتي سيتم استخدامها وفقًا لسياسة الخصوصية هذه.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- نحن لا نجمع أي فئات خاصة من البيانات (وهذا يشمل تفاصيل عن أصلك أو عرقك ومعتقداتك الدينية أو الفلسفية وحياتك الجنسية وتوجهك الجنسي وآرائك السياسية وعضويتك النقابية). كما أننا لا نجمع أي معلومات عن القناعات الجنائية والجرائم.</Text>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            textAlign:'right',
                            lineHeight: 22,
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>-في <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>اليمنت</Text> نستخدم البيانات التي نقوم بجمعها لتطوير وتدريب نماذج الذكاء الاصطناعي وذلك لتحسين خدماتنا على سبيل المثال لا الحصر: تخصيص المحتوى، وتحسين أداء خدماتنا ونؤكد على أننا نلتزم بحماية خصوصيتك، ولا نقوم بالكشف عن معلومات حساسة، ونضمن أمان بياناتك من خلال تقنيات أمان قوية.</Text>
                            </>
                            )
                        } 

                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>If you fail to provide Data: </Text>Where we need to collect Data by law, by using our Platform, and you fail to provide the required Data, we may not be able to perform our Services. We will notify you if this is the case at time.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>إذا فشلت في توفير البيانات:  </Text>عندما نحتاج إلى جمع البيانات حسب القانون، وباستخدام المنصة الخاصة بنا، وفشلت في تقديم هذه البيانات المطلوبة، قد لا نتمكن من تنفيذ خدماتنا. وسنقوم بإعلامك إذا كان هذا هو الحال في ذلك الوقت.</Text>
                        )
                        } 
                    {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>How is Data collected?: </Text>We use different methods to collect Data from and about you including through:</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>كيف يتم جمع البيانات؟: </Text>نستخدم طرقا مختلفة لجمع البيانات منك وعنك من خلال ما يلي:</Text>
                        )
                        } 
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Direct interactions. </Text>You may give us your Identity, contact and financial Data by filling in forms or by corresponding with us by phone or e-mail or otherwise. This includes Data you provide when you undertake the following:</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>التفاعلات المباشرة. </Text> يمكنك أن تمنحنا بيانات هويتك وبيانات الاتصال الخاصة بك وبياناتك المالية عن طريق ملئ الاستمارات أوعن طريق التواصل معنا عن طريق الهاتف أو البريد الإلكتروني أو غير ذلك. يتضمن ذلك البيانات التي تقدمها عند قيامك بما يلي:</Text>
                        )
                        } 
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Create an Account on, or exploit, use, our Platform;</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>- إنشاء حساب على المنصة أو استخدامها؛</Text>
                        )
                        } 
                         {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Enter a social competition, promotion, or survey; or</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>- دخول مسابقة اجتماعية أو عرض أو استطلاع؛ أو</Text>
                        )
                        } 
                         {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}>- Provide us with feedback or contact us.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>- تزويدنا برأيك أو الاتصال بنا.</Text>
                        )
                        } 
                        {selectedFilter == 'English' ? (
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Automated technologies or interactions.  </Text>As you interact with our Platform, we will automatically collect technical data about your browsing actions and patterns. We collect theseis Data by using cookies, server logs and other similar technologies.</Text>
                        ):(
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>التقنيات والتفاعلات الآلية.</Text> أثناء تفاعلك مع منصتنا الالكترونية، سنقوم تلقائيًا بجمع البيانات الفنية حول إجراءات وأنماط التصفح الخاصة بك. نجمع هذه البيانات باستخدام ملفات تعريف الارتباط وسجلات الخادم وغيرها من التقنيات المماثلة.</Text>
                        )
                        } 
                        {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>How we use Data: </Text>To the  extent possible, we want to provide you with relevant content and a tailored experience when you use our Services, and we use Data about you to do that.</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>We will only use Data when the law allows us to. Most commonly, we will use Data in the following circumstances:</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where it is necessary for our legitimate interests (or those of a third party) and fundamental rights do not override those interests;</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where we need to comply with a legal obligation;</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where we need to comply with a legal obligation;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where we need to set up your Account and administrate it;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where we need to carry out surveys;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where we need to personalize content, user experience or business information;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Where you have given consent.</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Generally, we do not rely on consent as a legal basis for processing Data.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>كيف نستخدم البيانات:</Text>إلى أقصى حد ممكن، نريد تزويدك بمحتوى ذي صلة وتجربة مخصصة عند استخدام خدماتنا، ونستخدم بيانات عنك للقيام بذلك.</Text>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>سنستخدم البيانات فقط عندما يسمح لنا القانون بذلك. في الغالب، سنستخدم البيانات في الحالات التالية:</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما تكون ضرورية لمصالحنا المشروعة (أو مصالح طرف ثالث) ومصالحك وحقوقك الأساسية لا تتخطى تلك المصالح؛</Text>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>- عندما نحتاج إلى الامتثال لالتزام قانوني؛</Text>
                        
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما نحتاج إلى إعداد حسابك وإدارته؛</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما نحتاج إلى إجراء استطلاعات؛</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما نحتاج إلى تخصيص المحتوى أو تجربة المستخدم أو معلومات تجارية؛</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما تكون قد أعطيتنا الموافقة.</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- بشكل عام، لا نعتمد على الموافقة كأساس قانوني لمعالجة البيانات على الرغم من أننا سنحصل على موافقتك قبل إرسال رسائل التسويق المباشر من طرف ثالث إليك عبر البريد الإلكتروني أو رسالة نصية. لديك الحق في سحب الموافقة على التسويق في أي وقت عن طريق الاتصال بنا.</Text>
                            </>      
                            )
                        } 
                        <Text style={{fontSize: 18,
                                fontWeight: 'bold',
                                marginTop: 15,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? 'Purposes for which we will use Data' : "الأغراض التي سنستخدم البيانات من أجلها"}</Text>
                            <Text style={{fontSize: 18,
                                fontWeight: 'bold',
                                marginTop: 5,
                                marginBottom:5,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular', textAlign:selectedFilter == 'English' ? 'left': "right"}}>{selectedFilter == 'English' ? '1.Performance of our Services:' : "1.أداء خدماتنا:"}</Text>
                    {selectedFilter == 'English' ? (
                            <>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>We process Data because it is necessary for the performance of our Services through our Platform.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>In this respect, we use Data for the following:</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- To prepare a proposal for you regarding the Services we offer;</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- To provide you with the Services as set in the scope of our Services, or as otherwise agreed with you from time to time;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- To deal with any complaints or feedback you may have;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- For any other purpose for which you provide us with the Data which we collect</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- In this respect, we may share Data with or transfer it to the following:</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Our Professional Advisers where it is necessary for us to obtain their advice or assistance, including lawyers, accountants, IT or public relations advisers;.</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Our Data storage providers.</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- the European General Data Protection Regulation (GDPR) and the Egyptian law no. 151 for year 2020. Due to the said purposes, to guarantee security and a smooth connection setup, we have a legitimate interest to process this Data</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>نقوم بمعالجة البيانات لأنها ضرورية لأداء خدماتنا من خلال منصتنا الإلكترونية.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>في هذا الصدد، نستخدم البيانات من أجل ما يلي:</Text>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>- لإعداد عرض لك بخصوص الخدمات التي نقدمها.</Text>
                        
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- تزويدك بالخدمات المحددة في نطاق خدماتنا، أو كما هو متفق عليه معك من وقت لآخر.</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- عندما نحتاج إلى إجراء استطلاعات؛</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- للتعامل مع أي شكاوى أو أراء قد تكون لديك.</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- لأي غرض آخر تزودنا من أجله بالبيانات التي نجمعها.</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>في هذا الصدد، يجوز لنا مشاركة البيانات أو نقلها إلى من يلي:</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- رهنًا بموافقتك، الأطراف الثالثة المستقلة التي نتشارك معها للمساعدة في تقديم الخدمات لك.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- المستشارون المهنيون لدينا حيث يكون من الضروري بالنسبة لنا الحصول على مشورتهم أو مساعدتهم، ويشمل هؤلاء، المحامون، أو المحاسبون، أو قسم تكنولوجيا المعلومات، أو مستشارو العلاقات العامة؛</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- مقدمي خدمة تخزين البيانات لدينا.</Text>
                            
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    textAlign:'right',
                                    lineHeight: 22,
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>لأساس القانوني لتجهيز فئات البيانات المذكورة أعلاه هو القانون 6. (1) (أ) من اللائحة الأوروبية العامة لحماية البيانات والقانون المصري رقم 151 لسنة 2020. نظرا للأغراض المذكورة، خصوصا لضمان الأمان واعداد الاتصال السلس، لدينا مصلحة مشروعة في معالجة هذه البيانات.</Text>
                            </>      
                            )
                        } 
                        {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>2. Legitimate interests: </Text>We also process Data because it is necessary for our legitimate interests, or sometimes where it is necessary for the legitimate interests of a third party.</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>In this respect, we use Data for the administration and management of our business, marketing purposes, archiving or statistical analysis.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>2. المصالح المشروعة: </Text>كما نقوم أيضًا بمعالجة البيانات لأنها ضرورية لمصالحنا المشروعة، أو في بعض الأحيان عندما تكون ضرورية للمصالح المشروعة للغير.</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>في هذا الصدد، نستخدم البيانات لإدارة وتنظيم أعمالنا، ولأغراض التسويق أو الأرشفة أو المعالجة الإحصائية.</Text>
                            </>
                            )
                        } 

                        {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>3. Legal Compliance:</Text>We also process Data for our compliance with a legal obligation which we are under. In this respect, we will use Data for the following:</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Resolve disputes or troubleshoot problems;</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Prevent fraud and other potentially prohibited or unlawful activities;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>- Comply with relevant laws, respond to legal requests, prevent harm, and protect our rights and the rights of other users and third parties;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>As required by tax authorities or any competent court or legal authority.</Text>

                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>3. الالتزامات القانونية: </Text>كما نقوم أيضًا بمعالجة البيانات من أجل امتثالنا بالتزام قانوني. في هذا الصدد، سنستخدم البيانات من أجل ما يلي:</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>حل المنازعات او استكشاف المشكلات واصلاحها؛</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>منع الاحتيال وأي انشطة أخرى يحتمل ان تكون محظورة او غير قانونية؛</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>الامتثال للقوانين ذات الصلة والاستجابة للطلبات القانونية ومنع الضرر وحماية حقوقنا وحقوق المستخدمين والغير؛</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>كما هو مطلوب من قبل السلطات الضريبية أو أي محكمة مختصة أو سلطة قانونية.</Text>
                                   
                            </>
                            )
                        } 

                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>4. Marketing: </Text>We will send you marketing about Services we provide which may be of interest to you, as well as other information in the form of alerts, newsletters, notifications for discounts and deals, or functions which we believe might be of interest to you or in order to update you with information which we believe may be relevant to you. We will communicate this to you in a number of ways including by telephone, SMS, e-mail or other digital channels as appropriate.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>4. التسويق: </Text>سنرسل إليك تسويقًا حول الخدمات التي نقدمها والتي قد تهمك، بالإضافة إلى معلومات أخرى في شكل تنبيهات، أو رسائل إخبارية، أو إشعارات عن الخصومات والعروض، أو الخصائص التي نعتقد أنها قد تهمك أو من أجل تحديثك بمعلومات التي نعتقد أنها قد تكون ذات صلة بك. سوف نبلغك بذلك بعدة طرق بما في ذلك عن طريق الهاتف، أو الرسائل النصية القصيرة، أو البريد الإلكتروني، أو القنوات الرقمية الأخرى حسب الاقتضاء.</Text>
                            </>
                            )
                        } 
                    
                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>5. Communication: </Text>Communicate with you or facilitate communication between you, our affiliates;</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Host your reviews, ratings, photos, videos, and other content;</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Customize your experience, including customizing the ads shown to you on and off our Platform;</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Respond to your questions and comments.</Text>

                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>5. التواصل:</Text>التواصل معك أو تسهيل التواصل بينك وبين الشركات التابعة لنا؛</Text>
                                <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>استضافة الآراء والتقييمات والصور ومقاطع الفيديو والمحتويات الأخرى؛</Text>
                           <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>تشكيل تجربة خاصة بك، بما في ذلك الإعلانات المعروضة لك داخل وخارج منصتنا الإلكترونية؛</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>الاجابة على أسئلتك وتعليقاتك.</Text>
                                    <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>كما هو مطلوب من قبل السلطات الضريبية أو أي محكمة مختصة أو سلطة قانونية.</Text>
                                   
                            </>
                            )
                        } 

                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>6. Promotional offers from us: </Text>We may use Data to form a view on what we think you may want or need, or what may be of interest to you. This is how we decide which merchants, products, Services, discounts and deals may be relevant to you.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>You will receive marketing communications from us in case of using our Platform, and you have not opted out of receiving these marketing communications.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>6. العروض الترويجية منا: </Text>قد نستخدم البيانات لتشكيل رؤية حول ما نعتقد أنك قد تريده أو تحتاجه أو ما قد يثير اهتمامك. هذه هي الطريقة التي نقرر بها أي التجار والمنتجات والخدمات والخصومات والعروض قد تكون ذات صلة بك.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>ستتلقى اتصالات تسويقية منا في حالة استخدام منصتنا الإلكترونية، ولم تختر عدم تلقي هذه الاتصالات التسويقية.</Text>
                                   
                            </>
                            )
                        } 

                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>7. Third-party marketing: </Text>We will get your express opt-in consent before we share Data with any third party for marketing purposes or for R&D.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>7. التسويق لطرف ثالث:  </Text>سنحصل على موافقتك الصريحة للاشتراك قبل أن نشارك البيانات مع أي طرف ثالث لأغراض التسويق او الإحصاء أو لأغراض البحث العلمي والتطوير.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>يمكنك أن تطلب منا أو من الأطراف الثالثة إيقاف إرسال رسائل تسويقية إليك في أي وقت عن طريق تسجيل الدخول إلى المنصة والتأشير أو إلغاء التأشير على الخانات ذات الصلة لتعديل تفضيلاتك التسويقية، أو من خلال اتباع روابط إلغاء الاشتراك في أي رسالة تسويقية يتم إرسالها إليك أو عن طريق الاتصال بنا في أي وقت.</Text>
                                   
                            </>
                            )
                        } 
                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>8. Cookies: </Text>You can set your browser to refuse all or some browser cookies, or to alert you when the Platform sets or access cookies. If you disable or refuse cookies, please note that some parts of this Platform may become inaccessible or not function properly.</Text>
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>8.  ملفات تعريف الارتباط:  </Text>يمكنك ضبط المتصفح الخاص بك لرفض كل أو بعض ملفات تعريف الارتباط للمتصفح، أو لتنبيهك عند قيام المواقع بضبط ملفات تعريف الارتباط أو السماح لها بالوصول. إذا قمت بإيقاف أو رفض ملفات تعريف الارتباط يرجى ملاحظة أنه قد يتعذر الوصول لبعض أجزاء هذه المنصة أو عدم عملها بشكل صحيح.</Text>
                              
                            </>
                            )
                        }
                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>9. Change of purpose: </Text>We will only use Data for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. </Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>Please note that we may process Data without your knowledge or consent, in compliance with the above rules, where this is required or permitted by law</Text>
                                   
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>9 . تغير الغرض:  </Text>سنستخدم البيانات فقط للأغراض التي جمعناها من أجلها، ما لم نعتبر بشكل معقول أننا نحتاج إلى استخدامها لسبب آخر، وذلك السبب متوافق مع الغرض الأصلي. إذا كنت ترغب في الحصول على شرح لكيفية توافق عملية معالجة الغرض الجديد مع الغرض الأصلي، يرجى الاتصال بنا على عنوان البريد الإلكتروني […………………………]. إذا احتجنا إلى استخدام البيانات لغرض غير ذي صلة، فسوف نخطرك وسنشرح الأساس القانوني الذي يسمح لنا بالقيام بذلك. يرجى ملاحظة أننا قد نقوم بمعالجة البيانات دون علمك أو موافقتك، وفقًا للقواعد المذكورة أعلاه، حيث يكون هذا مطلوبًا أو مسموحًا به بموجب القانون.</Text>
                              
                            </>
                            )
                        } 
                    
                    {selectedFilter == 'English' ? (
                            <>
                            <Text style={{fontSize: 16,
                            marginBottom: 10,
                            lineHeight: 22,
                            textAlign:'left',
                            color:'#000',
                            fontFamily:'OpenSans_400Regular'}}><Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>Disclosures of Data: </Text>We may share Data with the parties set out herein in relation to the specified purposes for which we will use the Data above.</Text>
                            <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>We may share Data with third parties to whom we may choose to sell, transfer or merge parts of our business or our assets. Alternatively, we may seek to acquire other businesses or merge with them. If a change happens to our business, then the new owners may use Data in the same way as set out in this Privacy Policy.</Text>
                                   
                            </>
                            ):(
                            <>
                            <Text style={{fontSize: 16,
                                marginBottom: 10,
                                textAlign:'right',
                                lineHeight: 22,
                                color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>
                                <Text style={{fontWeight: "bold", color:'#000',
                                fontFamily:'OpenSans_400Regular'}}>الإفصاح عن البيانات:  </Text>يجوز لنا مشاركة البيانات مع الأطراف المنصوص عليها هنا فيما يتعلق بالأغراض المحددة التي سنستخدم من أجلها البيانات المذكورة أعلاه.</Text>
                               <Text style={{fontSize: 16,
                                    marginBottom: 10,
                                    lineHeight: 22,
                                    textAlign:'left',
                                    color:'#000',
                                    fontFamily:'OpenSans_400Regular'}}>يجوز لنا مشاركة البيانات مع أطراف ثالثة والتي قد نختار بيع أو نقل أو دمج أجزاء من أعمالنا أو أصولنا معها. وبالتبادل، قد نسعى للحصول على أعمال أخرى أو الاندماج معها. إذا حدث تغيير في أعمالنا، فيجوز للمالكين الجدد استخدام البيانات بنفس الطريقة الواردة في سياسة الخصوصية هذه.</Text>
                                   
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