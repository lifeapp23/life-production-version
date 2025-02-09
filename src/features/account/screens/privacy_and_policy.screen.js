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