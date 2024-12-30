import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';


import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  TitleView,
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

export const PrivacyAndPolicyPageScreen = ({ navigation }) => {
    const {t} = useTranslation();//add this line

















    return (
      <WhitePageContainer >
          <ScrollView>
              <AccountBackground >
                  <TitleView >
                      <BlackTitle >Life</BlackTitle>
                  </TitleView>
                  <View style={styles.viewContainer} >
                  <View style={{flexDirection:'column',paddingHorizontal: 10,paddingBottom: 20,}}>

                   <Text style={{fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color:'#000',fontFamily:'OpenSans_400Regular',}}>Privacy Policy</Text>
                  <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular', textAlign: 'left'}}>1. Introduction</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>Life Platform is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose,
  and safeguard your information when you use our platform, which connects Service Requestors with Service
  Providers. By using the Platform, you consent to the practices described in this Privacy Policy.</Text>
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>2. Information We Collect</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>2.1 Personal Information
  When you register or use our Platform, we may collect personal information that can identify you, such as your
  name, email address, phone number, payment details, and any other information you provide directly to us.</Text>
          <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>2.2 Usage Data
  We may collect information about your interactions with the Platform, including your IP address, browser type,
  device information, pages visited, and time spent on the Platform. This data helps us understand how users
  interact with our Platform and improve our services.</Text>
          <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>2.3 Cookies and Tracking Technologies
  We use cookies and similar tracking technologies to track activity on our Platform and store certain information.
  You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do
  not accept cookies, some parts of our Platform may not function properly.</Text>
                   
                   
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>3. How We Use Your Information</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>3.1 To Provide and Improve Our Services
  We use the information we collect to operate, maintain, and improve the Platform, including to process
  transactions, provide customer support, and develop new features.</Text>
   <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>3.2 To Communicate with You
  We may use your personal information to send you updates, newsletters, marketing materials, and other
  information that may be of interest to you. You can opt-out of receiving these communications by following the
  unsubscribe instructions provided in the communication.</Text>
                <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>3.3 To Personalize Your Experience
  We may use the data we collect to tailor the content and advertisements you see on our Platform and to provide
  personalized recommendations.</Text>
                <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>3.4 For Advertising and Analytics
  We may share your information with third-party partners for the purpose of delivering targeted advertisements
  and conducting analytics. This may include sharing anonymized data or aggregated data that cannot be used to
  identify you personally.</Text>
                                
                   
                   
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>4. Sharing Your Information</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>4.1 With Service Providers
  We may share your information with service providers who perform services on our behalf, such as payment
  processing, data analysis, email delivery, and marketing assistance. These service providers are contractually
  obligated to protect your information and use it only for the services they provide to us.</Text>
            <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>4.2 With Third-Party Advertisers
  We may share your data with third-party advertisers to provide you with relevant advertisements on our Platform
  and other platforms. These advertisers may use cookies and other tracking technologies to collect information
  about your online activities.</Text>
              <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>4.3 For Legal Compliance and Protection
  We may disclose your information if required by law, or if we believe it is necessary to comply with legal
  obligations, protect our rights or the rights of others, investigate fraud, or respond to a government request.</Text>
              <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>4.4 In the Event of a Business Transfer
  
  If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be
  transferred as part of that transaction.</Text>
                     
                   
                   
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>5. Security of Your Information</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
  However, no method of transmission over the internet or method of electronic storage is completely secure, and
  we cannot guarantee absolute security.</Text>
                   
                   
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>6. Your Data Protection Rights</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>6.1 Access and Correction
  You have the right to access the personal information we hold about you and to request corrections if it is
  inaccurate or incomplete.</Text>
                   <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>6.2 Data Portability
  You have the right to request that we transfer your personal information to another organization or directly to you,
  where feasible.</Text>
             <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>6.3 Right to Erasure
  You have the right to request that we delete your personal information under certain circumstances. Please note
  that we may retain certain information as required by law or for legitimate business purposes.</Text>
             <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>6.4 Opt-Out of Marketing Communications
  You can opt-out of receiving marketing communications from us by following the unsubscribe instructions in the
  communication or by contacting us directly.</Text>
             
  
  
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>7. Children's Privacy</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>Our Platform is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete that information.</Text>
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>8. Changes to This Privacy Policy</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on this page, and the updated Privacy Policy will be effective as of the date of posting.</Text>
                   <Text style={{fontSize: 18,
                    fontWeight: 'bold',
                    marginTop: 20,
                    color:'#000',
                    fontFamily:'OpenSans_400Regular',}}>9. Contact Us</Text>
  <Text style={{fontSize: 16,
      marginBottom: 15,
      lineHeight: 22,
      color:'#000',
      fontFamily:'OpenSans_400Regular'}}>If you have any questions or concerns about these Terms, please contact us at Life.App23@gmail.com.</Text>

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