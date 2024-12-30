import React, { useEffect, useContext,useState,useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';


import {
  AvatarIcon,
  FullSizeButtonView,
  PageContainer,
  AccountBackground,
  InputField,
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
} from "../components/account.styles";


import "./i18n";
import { useTranslation } from 'react-i18next';//add this line
    
const { width } = Dimensions.get('window');

export const TermsAndConditionsPageScreen = ({ navigation }) => {
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
                  color:'#000',fontFamily:'OpenSans_400Regular',}}>Terms and Conditions</Text>
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>1. Introduction</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>Welcome to Life Platform. These Terms and Conditions (“Terms”) govern your access to and use of the Platform,
which connects individuals or businesses seeking services (“Service Requestors”) with individuals or businesses
providing services (“Service Providers”). By accessing or using the Platform, you agree to comply with and be
bound by these Terms. If you do not agree to these Terms, you must not use the Platform.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>2. Definitions</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>2.1 “Platform” refers to Life Platform, the mobile application or website that connects Service Requestors
with Service Providers.</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>2.2 “Service Requestor” refers to any individual or entity that uses the Platform to request services.</Text>
    <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>2.3 “Service Provider” refers to any individual or entity that offers services through the Platform.</Text>
    <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>2.4 “User” refers to both Service Requestors and Service Providers.</Text>
    <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>2.5 “Services” refers to the work or tasks provided by Service Providers to Service Requestors.</Text>
        
    <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>3. Role of the Platform</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>3.1 Neutral Facilitator
Life Platform acts solely as a neutral facilitator to connect Service Requestors and Service Providers. The
Platform is not a party to any agreement between Service Requestors and Service Providers.</Text>
       <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>3.2 No Endorsement
The Platform does not endorse, guarantee, or validate the quality, reliability, or legality of any services provided
by Service Providers. The Platform is not responsible for the conduct of any User or the outcomes of any service
provided.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>4. User Responsibilities</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>4.1 Service Requestors
Service Requestors are solely responsible for vetting Service Providers, negotiating terms, and ensuring that the
services provided meet their expectations. Any disputes arising from the service must be resolved directly
between the Service Requestor and Service Provider.</Text>
  <Text style={{fontSize: 16,
  marginBottom: 15,
  lineHeight: 22,
  color:'#000',
  fontFamily:'OpenSans_400Regular'}}>4.2 Service Providers
Service Providers are solely responsible for ensuring they have the necessary qualifications, licenses, and
authorizations to provide the services. They must comply with all applicable laws and regulations and bear full
responsibility for the services they provide.</Text>
          
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>5. Limitation of Liability</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>5.1 No Liability for Services
Life Platform is not liable for any actions, omissions, or disputes arising out of or related to the services provided
by Service Providers. The Platform disclaims any responsibility for any damage, loss, or injury resulting from the
use of the services.</Text>
                <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>5.2 Indemnification
Users agree to indemnify, defend, and hold harmless Life Platform and its affiliates, officers, directors,

employees, and agents from any claims, damages, liabilities, and expenses arising out of or related to their use of
the Platform or their provision or receipt of services.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>6. Dispute Resolution</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>6.1 Direct Resolution
Any disputes between Service Requestors and Service Providers must be resolved directly between the parties.
The Platform is not responsible for mediating or resolving any disputes.</Text>
                <Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>6.2 No Claims Against the Platform
Users agree not to bring any claims against Life Platform related to disputes between Service Requestors and
Service Providers.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>7. User Conduct</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>Users must comply with all applicable laws and regulations when using the Platform. The Platform reserves the
right to suspend or terminate access to any User who violates these Terms or engages in illegal or unethical
behavior.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>8. Intellectual Property</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>All content, trademarks, and intellectual property on the Platform are owned by Life Platform or its licensors.
Users may not use or reproduce any content from the Platform without prior written consent.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>9. Termination</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>The Platform reserves the right to terminate or suspend any User’s access to the Platform at any time for any
reason, including violations of these Terms.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>10. Amendments</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>Life Platform reserves the right to amend these Terms at any time. Any changes will be posted on the Platform
and notified to the Users, and continued use of the Platform constitutes acceptance of the revised Terms.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>11. Governing Law</Text>
<Text style={{fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
    color:'#000',
    fontFamily:'OpenSans_400Regular'}}>These Terms are governed by and construed in accordance with the laws of Egypt. Any legal action or proceeding
arising under these Terms shall be brought exclusively in the courts located in Egypt.</Text>
                
                <Text style={{fontSize: 18,
                  fontWeight: 'bold',
                  marginTop: 20,
                  color:'#000',
                  fontFamily:'OpenSans_400Regular',}}>12. Contact Information</Text>
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
    //   height: 400, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    image: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
  
   
    });