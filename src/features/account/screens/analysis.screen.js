import React from 'react';
import { StyleSheet,
  Text,ScrollView,View, Dimensions,Image } from "react-native";
import {BarChart} from 'react-native-gifted-charts';
import {
  Title,
  TitleView,
  PageContainer,
  ServicesPagesCardCover,
  ServicesPagesCardAvatarIcon,
  ServicesPagesCardHeader,
  FullSizeButtonView,
  FullButton,
  WhitePageContainer,
  AccountBackground,
  BlackTitle,

} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";
// import {ChartComponent} from './ChartComponent.screen'; // Adjust the path based on your project structure

const { width } = Dimensions.get('window');

  
export const AnalysisScreen = ({navigation}) => {


  
  const weightTrackingValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const weightTrackingNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const liftingValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const liftingNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const macrosValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const macrosNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const barWeightTrackingData = [
    {
      value: weightTrackingValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: weightTrackingValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: weightTrackingValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: weightTrackingValues[1].carbs, frontColor: '#ED6665'},
    {
      value: weightTrackingValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: weightTrackingValues[1].fats, frontColor: '#ED6665'} 
  ];
  const barLiftingData = [
    {
      value: liftingValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: liftingValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: liftingValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: liftingValues[1].carbs, frontColor: '#ED6665'},
    {
      value: liftingValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: liftingValues[1].fats, frontColor: '#ED6665'} 
  ];
  const barMacrosData = [
    {
      value: macrosValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: macrosValues[1].protein,spacing: 50, frontColor: '#ED6665'},
    {
      value: macrosValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: macrosValues[1].carbs, frontColor: '#ED6665'},
    {
      value: macrosValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: macrosValues[1].fats, frontColor: '#ED6665'},
    {
      value: macrosValues[0].calories,
      label: 'calories',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: macrosValues[1].calories, frontColor: '#ED6665'}
    
  ];

  const renderWeightTrackingTitle = () => {
    return(
      <View style={{marginVertical: 10}}>
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontFamily:"OpenSans_400Regular",
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Weight Tracking
      </Text>
      
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {weightTrackingNames[0][1]}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {weightTrackingNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderLiftingTitle = () => {
    return(
      <View style={{marginVertical: 10}}>
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontFamily:"OpenSans_400Regular",
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Lifting
      </Text>
      
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {liftingNames[0][1]}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {liftingNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderMacrosTitle = () => {
    return(
      <View style={{marginVertical: 10}}>
      <Text
        style={{
          color: 'white',
          fontSize: 16,
          fontFamily:"OpenSans_400Regular",
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        Macros
      </Text>
      
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 20,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {macrosNames[0][1]}
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 4,
            }}
          />
          <Text
            style={{
              width: 60,
              height: 16,
              color: 'lightgray',
              fontSize:12,
              fontFamily:"OpenSans_400Regular",
            }}>
            {macrosNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }




  return (
    // <PageContainer>
    //     <ScrollView>
    //         <TitleView >
    //             <Title >Life</Title>
    //         </TitleView>
    //         <ServicesPagesCardCover>
    //             <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
    //             <ServicesPagesCardHeader>Analysis</ServicesPagesCardHeader>
    //         </ServicesPagesCardCover>
    //         <Spacer size="medium"/>
    //         {/* <View style={styles.container}> 
    //             <View >
    //                 <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',marginLeft:10,marginRight:10,marginBottom:20,}}>
    //                   <View
    //                     style={{
    //                       backgroundColor: '#333340',
    //                       paddingBottom: 0,
    //                       borderRadius: 35,
    //                       height:200,
    //                       width:170,
    //                       marginRight:10,
    //                     }}>
    //                     {renderWeightTrackingTitle()}
    //                     <BarChart
    //                       data={barWeightTrackingData}
    //                       barWidth={4}
    //                       spacing={24}
    //                       initialSpacing={10}
    //                       roundedTop
    //                       roundedBottom
    //                       hideRules
    //                       xAxisThickness={0}
    //                       yAxisThickness={0}
    //                       yAxisTextStyle={{color: 'gray'}}
    //                       noOfSections={3}
    //                       maxValue={150}
    //                       height={90}
    //                       width={145}
    //                     />
    //                   </View>
    //                   <View
    //                     style={{
    //                       backgroundColor: '#333340',
    //                       paddingBottom: 0,
    //                       borderRadius: 35,
    //                       height:200,
    //                       width:170,
    //                     }}>
    //                     {renderLiftingTitle()}
    //                     <BarChart
    //                       data={barLiftingData}
    //                       barWidth={4}
    //                       spacing={24}
    //                       initialSpacing={10}
    //                       roundedTop
    //                       roundedBottom
    //                       hideRules
    //                       xAxisThickness={0}
    //                       yAxisThickness={0}
    //                       yAxisTextStyle={{color: 'gray'}}
    //                       noOfSections={3}
    //                       maxValue={150}
    //                       height={90}
    //                       width={145}
    //                     />
    //                   </View>
    //                 </View>
    //                 <View
    //                     style={{
    //                       backgroundColor: '#333340',
    //                       paddingBottom: 0,
    //                       borderRadius: 35,
    //                       height:200,
    //                       flex:1,
    //                       marginLeft:10,
    //                       marginRight:10,
    //                     }}>
    //                     {renderMacrosTitle()}
    //                     <BarChart
    //                       data={barMacrosData}
    //                       barWidth={4}
    //                       spacing={54}
    //                       initialSpacing={20}
    //                       roundedTop
    //                       roundedBottom
    //                       hideRules
    //                       xAxisThickness={0}
    //                       yAxisThickness={0}
    //                       yAxisTextStyle={{color: 'gray'}}
    //                       noOfSections={3}
    //                       maxValue={350}
    //                       height={90}
    //                       width={250}
    //                     />
    //                   </View>
    //             </View>
    //         </View> */}
    //         {/* <View style={{marginLeft:10,marginRight:10,}}>
    //           <FullSizeButtonView >
    //             <FullButton
    //               icon="arrow-down-left-bold"
    //               mode="contained"
    //               style={{fontSize:18}}
    //               onPress={() => navigation.goBack()}
    //             >
    //               Back
    //             </FullButton>
    //           </FullSizeButtonView>
    //           </View> */}
              
    //         <Spacer size="large"></Spacer>
    //         <Spacer size="large"></Spacer>
    //   </ScrollView>
    // </PageContainer>
    <WhitePageContainer>
        <ScrollView>
            <AccountBackground >
                <TitleView >
                    <BlackTitle >Life</BlackTitle>
                </TitleView>
                <View style={styles.CoimngSoonViewContainer} >
                    <Image
                        source={require('../../../../assets/coming_soon.jpeg')} // Replace with your image URL
                        style={styles.imageCoimngSoon}
                    />
                    
                </View>


            </AccountBackground>
        </ScrollView>
    </WhitePageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
  },
  CoimngSoonViewContainer: {
      width: width - 20, // he screen width minus padding
      height: 400, // Adjust as needed
      marginBottom: 10,
      position: 'relative',
    },
   
    imageCoimngSoon: {
      width: '100%',
      height: '100%',
      borderRadius:30,
  
    },
  
});

