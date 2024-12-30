import styled from "styled-components/native";
import { Button, TextInput,Avatar,RadioButton,DataTable } from "react-native-paper";
import { colors } from "../../../infrastructure/theme/colors";
import { Text } from "../../../components/typography/text.component";
import {Datepicker,Select} from '@ui-kitten/components';

import {Pressable, TouchableOpacity, Dimensions } from "react-native";
const { width } = Dimensions.get('window');

export const AccountBackground = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: "column";
  width:100%;
  height: 100%;
`;
export const AsteriskTitle = styled(Text)`
  font-size: 16px;
  color:red;
`;
export const TopView =styled.View`
  background-color: #000;
  width:320px;
  align-items: center;
  justify-content: center;
  height:60px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;
export const AccountContainer = styled.View`
  background-color: #e4e6e8;
  border-radius: 35px;
  width:320px;
  height:260px;
  align-items: center;
  justify-content: center;
`;

export const AvatarIcon = styled(Avatar.Icon)`
  background-color:white;
  width:50px;
  height:50px;
  position: absolute;
  top: -30px;
  left: 50%;
  margin-left: -30px;
  z-index:111111;

`;
export const LoginIconView = styled.View`
  ${'' /* background-color:white; */}
  width:50px;
  height:50px;
  position: absolute;
  border-radius:50px;
  top: -30px;
  left: 50%;
  margin-left: -30px;
  z-index:111111;
  overflow: hidden;
  ${'' /* aspect-ratio: 1; */}
  ${'' /* overflow: 'visible'; */}
    ${'' /*  */}
`;
export const LoginIcon = styled.Image`
  ${'' /* background-color:white; */}
  
  
  width:47px;
  height:47px; 
  position: absolute;
  
  bottom: 4px;
  left: 1%;
  ${'' /* margin-left: -30px; */}
  z-index:111111;

`;
export const AuthInputViewParent = styled.View`
  align-items: center;
  justify-content: center;
  
`;
export const AuthInputView = styled.View`
  width:67%;
  align-items: center;
  justify-content: center;
`;
export const AuthInput = styled(TextInput)`
  width: 250px;
  border-radius:5px;
  background-color:white;
  height:40px;
  font-size:14px;
  font-family:OpenSans_400Regular;
`;

export const AuthButtonViewParent = styled.View`
  flex-direction: row;
  gap: 20px;

  align-items: center;
  justify-content: center;
`;
export const AuthLoginButton = styled.View`
  
`;


export const AuthButton = styled(Button)`
  padding: ${(props) => props.theme.space[1]};
  background-color: #000;
  border-radius:0px;
  font-size:18px;
  width:115px;
  border-radius:4px;
`;







export const ErrorContainer = styled.View`
  max-width: 300px;
  align-items: center;
  align-self: center;
  margin-top: ${(props) => props.theme.space[2]};
  margin-bottom: ${(props) => props.theme.space[2]};
`;

export const AnimationWrapper = styled.View`
  width: 100%;
  height: 40%;
  position: absolute;
  top: 30px;
  padding: ${(props) => props.theme.space[2]};
`;
export const PageContainer = styled.View`
  position: absolute;
  ${'' /* background-color: #455357; */}
  background-color: #FFF;

  flex: 1;
  width:100%;
  height: 100%;
`;
export const WhitePageContainer = styled.View`
  position: absolute;
  background-color: #FFF;
  flex: 1;
  width:100%;
  height: 100%;
`;
export const TitleView = styled.View`
  align-items: center;
  justify-content: center;
  margin-top:30px;
  margin-bottom:40px;
`;
export const Title = styled(Text)`
  margin-top:5px;
  font-size: 30px;
  ${'' /* color:#3f7eb3; */}
  color:#000;

`;
export const BlackTitle = styled(Text)`
  margin-top:5px;
  font-size: 30px;
  color:#000;
`;
export const InputField = styled.View`
    flex-direction: row;
    margin-left:10px;
    margin-right:10px;
    align-items: center;
`;
export const FormLabelView = styled.View`
    width:33%;
`;
export const FormInputView = styled.View`
    width:67%;
`;
  
export const FormLabel = styled(Text)`
  font-size: 17px;
  color:#000;
  font-family:OpenSans_400Regular;
  `;
export const FormInput = styled(TextInput)`
  border-radius:5px;
  border-color:gray;
  border-width:1px;
  /*padding:0px;*/
  background-color:white;
  height:40px;
  font-size:15px;
  font-family:OpenSans_400Regular;
`;
export const FormHalfInputView = styled.View`
  width:67%;
  flex-direction: row;
  align-items: center;
  justifyContent:space-between;
`;

export const FormHalfInput = styled(TextInput)`
  border-radius:5px;
  width:48%;
  
  border-color:gray;
  border-width:1px;
  /*padding:0px;*/
  background-color:white;
  height:40px;
  font-size:15px;
  font-family:OpenSans_400Regular;
`;

export const GenderSelector = styled(Select)`
  width:67%;
  font-size:10px;
`;
export const CountryParent=styled.View`
flex-direction: row;
align-items: center;
`;
export const CountryTitle = styled.View`
  width:33%;
`;
export const CountryPickerView = styled.View`
  width:67%;
  background-color:#fff;
  justify-content: center;
  border-color:gray;
  border-width:1px;
  border-radius:4px;
  height:40px;
  padding-left:13px;
`;
export const DatePickerSelector = styled(Datepicker)`
  width:67%;
  background-color:white;
`;
export const InfoFieldParent = styled.View`
    width:100%;

`;
export const SelectorTextField = styled.View`
    flex-direction: row;
    margin-left:10px;
    margin-right:10px;
`;
export const InfoField = styled.View`
    flex-direction: row;/* This makes the children Views lay out horizontally*/
    margin-left:10px;
    margin-right:10px;
    margin-top:10px; 
`;
export const InfoFieldColumn = styled.View`
    flex-direction: column;/* This makes the children Views lay out horizontally*/
    width:100%;
    margin-left:10px;
    margin-right:10px;
    margin-top:10px; 
`;
export const SelectInfo = styled.View`
  padding-right:15px;
  width:48%;
  `;
export const WriteInfo = styled.View`
  width:52%;
`;
export const WriteInfoChild = styled.View`

  flex-direction: row;/* This makes the children Views lay out horizontally*/
  align-items: center; /* This aligns the children Views vertically in the center of the parent View*/
  padding:0px;
  margin:0px;
`;

export const InfoSelector = styled(Select)`
    width:100%;
    height:40px;
`;
export const InfoInputView = styled.View`
  width:90%;
  margin-right:5px;
`;
export const InfoInput = styled(TextInput)`
  width:100%;
  background-color:white;
  height:40px;
  border-radius:4px;
  border-width:1px;
  border-color:gray;
`;
export const TraineeOrTrainerField= styled.View`
  flex-direction: row;/* This makes the children Views lay out horizontally*/
  margin-left:10px;
  margin-right:10px;
  margin-top:10px;
  width:100%;

`;
export const TraineeOrTrainerTitleField = styled.View`
  width:25%;
  `;
export const TraineeOrTrainerButtonsParentField = styled.View`
  width:70%;
  flex-direction: column;
  justify-content: center;
`;
export const TraineeOrTrainerButtonField = styled.View`
  flex-direction: row;
  align-items: center;
`;
// export const RadioButtonStyled = styled(RadioButton)`

// `;
export const FullSizeButtonView = styled.View`
  flex-direction: row;
  align-items: center;
  width:100%
`;
export const FullButton = styled(Button)`
  padding: ${(props) => props.theme.space[1]};
  background-color: #000;
  border-radius:4px;
  font-size:18px;
  width:100%;
  border-radius:4px;
`;
export const LightFullButton = styled(Button)`
  padding: ${(props) => props.theme.space[1]};
  background-color: #000;
  border-radius:0px;
  font-size:18px;
  width:100%;

  
`;
export const SeparatorView = styled.View`
  display: block;
  background: #bac0c2;
  margin: 0 10px;
  width: 96%;
  height: 1px;
  margin-right:2%;
  margin-left:2%;
`;
export const SeparatorViewSpacer = styled.View`
  display: block;
  background: transparent;
  width: 100%;
  height: 10px;
 
`;
export const MenuItemPressableButton = styled(TouchableOpacity)`
  height:50px;
  background-color: #000;
  font-size:18px;
  width:100%;
  border-radius:8px;
`;

export const MenuItemPressableImagedButton = styled(TouchableOpacity)`
  height:150px;
  width:100%;
`;
export const MenuItemPressableButtonText = styled(Text)`
font-size: 16px;
color:white;
left:16%;
top:25%;
font-family:OpenSans_400Regular;
`;
export const MenuItemPressableButtonAvatarAccount = styled(Avatar.Icon)`
  position: absolute;
  backgroundColor:white;
  top:17%;
  left: 13%;
  marginLeft: -30px;
  zIndex:111111;
`;
export const MenuItemPressableButtonAvatarChevronRight =styled(Avatar.Icon)`
  backgroundColor:transparent;
  position: absolute;
  top:19%;
  left:90%;
  zIndex:111111;
`;

export const AvatarContainer = styled.View`
align-items: center;
`;


export const ServicesPagesCardCover = styled.View`
  height:225px;
  width:80%;
  margin-left:10%;
  margin-right:10%;
  background-color:#000;
  align-items : center;
  justify-content:center;
  flex-direction:column;
  border-radius:30px;
  margin-bottom:20px;
`;
export const ServicesPagesCardAvatarIcon = styled(Avatar.Icon).attrs({
  size: 70,
  color:"#000",
})`
  backgroundColor:white;
  margin-top:-6px;
  margin-bottom:20px;
`;
export const ServicesPagesCardHeader = styled.Text`
  font-size:26px;
  font-family:OpenSans_400Regular;
  color:#9da6a9;
  text-align: center;

`;

export const FormElemeentSizeButtonParentView = styled.View`
  flex-direction: row;
  margin-left:10px;
  margin-right:10px;
  align-items: center;
  justifyContent:space-between;
`;
export const FormElemeentSizeButtonView = styled.View`
width:48%;
justifyContent:space-between;
`; 
export const FormElemeentSizeButton = styled(Button)`
  padding: ${(props) => props.theme.space[1]};
  background-color: #000;
  border-radius:4px;
  font-family:"OpenSans_400Regular";
  font-size:"34px";
  width:100%;
  color:"red";
`;
export const FormInputSizeButton = styled(Button)`
  padding: ${(props) => props.theme.space[1]};
  ${'' /* background-color: #000; */}
  background-color: #000;
  border-radius:4px;
  font-family:"OpenSans_400Regular";
  font-size:"34px";
  width:100%;
  color:"red";
`;
export const DataTableTitleKey = styled(DataTable.Title)``;
export const DataTableTitleValue = styled(DataTable.Title)``;

export const DataTableCellKey = styled(DataTable.Cell)``;
export const DataTableCellValue = styled(DataTable.Cell)``;
export const DataTableTitleKeyText = styled.Text`
  font-size:17px;
  font-family:OpenSans_400Regular;
  color:#000;
`;
export const DataTableTitleValueText = styled.Text`
  font-size:17px;
  font-family:OpenSans_400Regular;
  color:#000;
`;
export const DataTableCellKeyText = styled.Text`
  font-size:17px;
  font-family:OpenSans_400Regular;
  color:#000;
`;
export const DataTableCellValueText = styled.Text`
  font-size:17px;
  font-family:OpenSans_400Regular;
  color:#000;
`;
export const CalendarFullSizePressableButton = styled(TouchableOpacity)`
  height:50px;
  background-color: #000;
  width:100%;
  border-radius:8px;
  justify-content:center;
  align-items:center;
`;
export const BlackLineOnePixel = styled.View`
width: (${width}-20) px;
height: 1px;
background-color: black;
margin: 0px 10px 0 10px;
`; 
export const BlackLineTwoPixel = styled.View`
width: (${width}-20) px;
height: 2px;
background-color: black;
margin: 10px 10px 0 10px;
`;
export const CalendarFullSizePressableButtonText = styled(Text)`
font-size: 16px;
color:white;
font-family:OpenSans_400Regular;
`;

export const ServiceInfoParentView = styled.View`

  margin-left:10px;
  margin-right:10px;
  margin-bottom:20px;

  `; 
export const ServiceCloseInfoButtonView = styled.View`
flex-direction:column;

`; 
export const ServiceInfoButtonView = styled.View`
`; 
export const ServiceCloseInfoButtonTextView = styled.View`
  background-color:#000;
  padding:20px 10px 20px 15px ;
  ${'' /* flex:1; */}
  border-radius:30px;
`; 
export const ServiceCloseInfoButtonText = styled(Text)`
  font-size: 18px;
  color:white;
  font-family:OpenSans_400Regular;
`; 
export const ServiceCloseInfoButton = styled(TouchableOpacity)`
width:30px;
height:30px;
justify-content:center;
align-items:center;
border-radius:50px;

`;

export const ServiceInfoButton = styled(TouchableOpacity)`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
`;

export const ServiceCloseInfoButtonAvatarIcon = styled(Avatar.Icon).attrs({
  color: 'black', // Set icon color to white
})`
  background-color: white; /* Set background color to black */
  padding: 0;
  margin: 0;
`;
export const ServiceAddButtonAvatarIcon = styled(Avatar.Icon)`
  background-color:#000;
  padding:0;
  margin:0;
`;
export const ServiceInfoButtonAvatarIcon = styled(Avatar.Icon).attrs({
  color: 'black', // Set icon color to white
})`
  background-color: white; /* Set background color to black */
  padding: 0;
  margin: 0;
`;
export const DemoPlayIcon = styled(Avatar.Icon).attrs({
  color: 'white', // Set icon color to white
  // backgroundColor: 'red',
})`
  background-color: transparent; /* Set background color to black */
  padding: 0;
  margin: 0;
`;
export const FormLabelDateRowView = styled.View`
  background-color:#e1e3e1;
  padding:10px 10px 10px 10px ;
  flex:1;
  border-radius:3px;
`; 
export const NewFormLabelDateRowView = styled.View`
  background-color:#e1e3e1;
  padding:15px 10px 15px 10px ;
  border-radius:3px;
`; 
export const FormLabelDateRowViewText = styled.Text`
  color:black;
  padding-left:6px;
`;

export const ResultsParentView = styled.View`
  flex-direction: row;
  margin-left:10px;
  margin-right:10px;
  justifyContent:space-between;
`; 
export const ResultsHalfRowView = styled.View`
  flex-direction: column;
  width:48%;
`; 
export const ResultsHalfRowLabelView = styled.View`
  flex:1;
  margin-bottom:3px;
`; 
export const ResultsHalfRowResultPlaceView = styled.View`
  background-color:#e1e3e1;
  padding:10px 10px 10px 10px ;
  flex:1;
  border-radius:3px;
`; 
export const ResultsHalfRowResultPlaceViewText = styled.Text`
  color:black;
`;
export const ViewOverlay =styled.View`
  flex: 1;
  justify-content: 'center';
`;
export const ServicesGymPageHeader = styled.Text`
  font-size:26px;
  font-family:OpenSans_400Regular;
  color:#9da6a9;
`;
export const ExerciseParentView = styled.View`
   flex-direction: row;
   ${'' /* border:1px #ccc;
   border-radius: 35px; */}
   margin:10px;
 
`;
export const ExerciseImageView = styled.View`
    width:38%;
    overflow: hidden;
    aspect-ratio: 1;
    border-radius: 35px;
`;
export const ExerciseImageViewImage=styled.Image`
  width: 100%;
  height: 150px; 
  border-radius: 35px;
  
`; 
export const PageMainImage=styled.Image`
  width: 100%;
  height: 100%; 
  border-radius: 30px;
  
`;
export const ExerciseInfoParentView = styled.View`
    width:58%;
    padding: 16px;
    
`;
// export const ExerciseInfoTextView = styled.View`

// `;
    
export const ExerciseInfoTextHead = styled.Text`
  color:black;
  font-size:20px;
  font-weight: bold;
  font-family:OpenSans_400Regular;
`;
export const ExerciseInfoTextTag = styled.Text`
  color:gray;
  font-size:18px;
  font-family:OpenSans_400Regular;
  
`;

export const FilterContainer = styled.View`
  margin-bottom: 5px;
`;
export const FilterTextView = styled.View`

  align-items:flex-start;
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 10px;

`;

export const FilterTextPressable = styled(TouchableOpacity)`
  color: white;
  backgroundColor:black;
  width:70px;
  height:30px;
  border-radius:25px;
  justify-content:center;
  align-items:center;
`;

export const FilterText = styled(Text)`
  color: white;
  font-size:14px;
  font-family:OpenSans_400Regular;
`;
export const ClearFilterTextView = styled.View`
  align-items:flex-end;
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 10px;
  margin-right:10px;
`;
export const ClearFilterTouchableOpacity = styled(TouchableOpacity)`
  color: white;
  backgroundColor:black;
  padding-top:5px;
  padding-bottom:5px;
  padding-left:15px;
  padding-right:15px;
  border-radius:25px;
  font-size:16px;
`;  
export const ClearFilterText = styled(Text)`
  color: white;
  font-size:16px;
`; 
export const DemoSectionViewImage = styled.View`
  margin:20px;
`;
export const DemoSectionImage=styled.Image`
  width: 100%;
  height: 250px;
`;
export const DemoSectionTextView = styled.View`
  margin-top:0px;
  margin-left:30px;
  margin-right:20px;
  margin-bottom:30px;
`;
export const DemoSectionExplanationText = styled(Text)`
  font-size:16px;
  color:#9da6a9;
  font-family:OpenSans_400Regular;
`;  
export const  DataTableDateTextView = styled.View`
  margin-top:25px;
  margin-left:10px;
  margin-right:10px;
`;
export const DataTableDateText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color:black;
`;  
export const  TargetSectionMuscleContainer = styled.View`
  margin-bottom: 20px;
`;
export const TargetSectionAnatomyImage=styled.Image`
  width: 100%;
  height: 140px;
`;


export const  WorkoutSettingsWeightIntervals = styled.View`
  margin-top:25px;
  margin-left:10px;
  margin-right:10px;
`;
export const WorkoutSettingsWeightIntervalsText = styled(Text)`
  font-size: 18px;
  font-weight: bold;
  color:black;
`;