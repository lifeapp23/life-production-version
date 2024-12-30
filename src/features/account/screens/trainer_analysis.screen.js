import React from 'react';
import {StyleSheet,
  Text,
  ScrollView,View} from "react-native";

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
  
} from "../components/account.styles";
import { Spacer } from "../../../components/spacer/spacer.component";

  
export const TrainerAnalysisScreen = ({navigation}) => {


  
  const subscriptionsValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const subscriptionsNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const revenueValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const revenueNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const clientSuccessValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const clientSuccessNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const myRatingsValues = [{id:1,protein:120,carbs:130,fats:50,calories:300},{id:2,protein:130,carbs:140,fats:60,calories:330}];
  const myRatingsNames = [
    { 1: 'Current', 2: 'Required' },
  ];
  const barSubscriptionsData = [
    {
      value: subscriptionsValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: subscriptionsValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: subscriptionsValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value:subscriptionsValues[1].carbs, frontColor: '#ED6665'},
    {
      value: subscriptionsValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: subscriptionsValues[1].fats, frontColor: '#ED6665'} 
  ];
  const barRevenueData = [
    {
      value: revenueValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: revenueValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: revenueValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value: revenueValues[1].carbs, frontColor: '#ED6665'},
    {
      value: revenueValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: revenueValues[1].fats, frontColor: '#ED6665'} 
  ];
  const clientSuccessData = [
    {
      value: clientSuccessValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: clientSuccessValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: clientSuccessValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value:clientSuccessValues[1].carbs, frontColor: '#ED6665'},
    {
      value: clientSuccessValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: clientSuccessValues[1].fats, frontColor: '#ED6665'} 
  ];
  const myRatingsData = [
    {
      value: myRatingsValues[0].protein,
      label: 'protein',
      spacing: 7,
      labelWidth: 50,
      labelTextStyle: {color:'gray',position:'absolute',left:-5},
      frontColor: '#177AD5',
    },
    {value: myRatingsValues[1].protein,spacing: 30, frontColor: '#ED6665'},
    {
      value: myRatingsValues[0].carbs,
      label: 'carbs',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray'},
      frontColor: '#177AD5',
    },
    {value:myRatingsValues[1].carbs, frontColor: '#ED6665'},
    {
      value: myRatingsValues[0].fats,
      label: 'fats',
      spacing: 7,
      labelWidth: 30,
      labelTextStyle: {color: 'gray',position:'absolute',left:3},
      frontColor: '#177AD5',
    },
    {value: myRatingsValues[1].fats, frontColor: '#ED6665'} 
  ];
  const renderSubscriptionsTitle = () => {
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
        Subscriptions
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
            {subscriptionsNames[0][1]}
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
            {subscriptionsNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderRevenueTitle = () => {
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
        Revenue
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
            {revenueNames[0][1]}
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
            {revenueNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderClientSuccessTitle = () => {
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
       Client Success
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
            {clientSuccessNames[0][1]}
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
            {clientSuccessNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }
  const renderMyRatingsTitle = () => {
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
        My Ratings
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
            {myRatingsNames[0][1]}
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
            {myRatingsNames[0][2]}
          </Text>
        </View>
      </View>
    </View>
    )
  }



  return (
    <PageContainer>
        <ScrollView>
            <TitleView >
                <Title >Life</Title>
            </TitleView>
            <ServicesPagesCardCover>
                <ServicesPagesCardAvatarIcon icon="dumbbell"></ServicesPagesCardAvatarIcon>
                <ServicesPagesCardHeader>Analysis</ServicesPagesCardHeader>
            </ServicesPagesCardCover>
            <Spacer size="medium"/>
            <View style={styles.container}> 
                <View >
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',marginLeft:10,marginRight:10,marginBottom:20,}}>
                      <View
                        style={{
                          backgroundColor: '#333340',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:170,
                          marginRight:10,
                        }}>
                        {renderSubscriptionsTitle()}
                        <BarChart
                          data={barSubscriptionsData}
                          barWidth={4}
                          spacing={24}
                          initialSpacing={10}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'gray'}}
                          noOfSections={3}
                          maxValue={150}
                          height={90}
                          width={145}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: '#333340',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:170,
                        }}>
                        {renderRevenueTitle()}
                        <BarChart
                          data={barRevenueData}
                          barWidth={4}
                          spacing={24}
                          initialSpacing={10}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'gray'}}
                          noOfSections={3}
                          maxValue={150}
                          height={90}
                          width={145}
                        />
                      </View>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent: 'space-between',marginLeft:10,marginRight:10,marginBottom:20,}}>
                      <View
                        style={{
                          backgroundColor: '#333340',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:170,
                          marginRight:10,
                        }}>
                        {renderClientSuccessTitle()}
                        <BarChart
                          data={clientSuccessData}
                          barWidth={4}
                          spacing={24}
                          initialSpacing={10}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'gray'}}
                          noOfSections={3}
                          maxValue={150}
                          height={90}
                          width={145}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: '#333340',
                          paddingBottom: 0,
                          borderRadius: 35,
                          height:200,
                          width:170,
                        }}>
                        {renderMyRatingsTitle()}
                        <BarChart
                          data={myRatingsData}
                          barWidth={4}
                          spacing={24}
                          initialSpacing={10}
                          roundedTop
                          roundedBottom
                          hideRules
                          xAxisThickness={0}
                          yAxisThickness={0}
                          yAxisTextStyle={{color: 'gray'}}
                          noOfSections={3}
                          maxValue={150}
                          height={90}
                          width={145}
                        />
                      </View>
                    </View>
                </View>
            </View>
            <View style={{marginLeft:10,marginRight:10,}}>
              <FullSizeButtonView >
                <FullButton
                  icon="arrow-down-left-bold"
                  mode="contained"
                  style={{fontSize:18}}
                  onPress={() => navigation.goBack()}
                >
                  Back
                </FullButton>
              </FullSizeButtonView>
              </View>
            <Spacer size="large"></Spacer>
            <Spacer size="large"></Spacer>
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
});

