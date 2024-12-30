import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { mainWorkoutsDataWithoutRequire } from "./main_workouts_data_without_require";
import { addMainWorkoutsRowsToDatabase } from "../database/workoutsTable";
import * as VideoThumbnails from 'expo-video-thumbnails';

// const newWorkoutsImgDir = FileSystem.documentDirectory + 'images/';

// const ensureNewWorkoutsImgDirExists = async () => {
// const dirInfo = await FileSystem.getInfoAsync(newWorkoutsImgDir);
//     if (!dirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(newWorkoutsImgDir, { intermediates: true });
//     }
// };

// const saveNewWorkoutsImages = async (asset) => {
//   await ensureNewWorkoutsImgDirExists();
//   // Download the asset if it hasn't been downloaded yet
//   if (!asset.downloaded) {
//     await asset.downloadAsync();
//   }
//   /// continue from here ----------->>>>>>>>>>>>>
//   ////console.log('asset',asset);

//   // Access the localUri property
//   const localUri = asset.localUri;

//   let thumbnailUri = '';
  
//   const { uri } = await VideoThumbnails.getThumbnailAsync(localUri, {
//     time: 5000,
//   });
//   thumbnailUri = uri;
//   // Extract file extension from the URI without query parameters
//   //const uriWithoutQuery = localUri.split('?')[0];

//   const fileExtension = thumbnailUri.split('.').pop() || 'jpeg';
  
//     const filename = new Date().getTime() + `.${fileExtension}`;
//     const dest = newWorkoutsImgDir + filename;
  
//     await FileSystem.copyAsync({ from: uri, to: dest });
//     return dest;
// };

// const updateWorkoutsMedia = async (workoutsArray) => {
//   const promises = workoutsArray.map(async (workout) => {
//     const newWorkoutImage = await saveNewWorkoutsImages(workout.images);
//     workout.images = newWorkoutImage;
//     return workout;
//   });

//   return Promise.all(promises);
// };




// Function to check if data has been imported
export const hasWorkoutsDataBeenImported = async () => {
   //AsyncStorage.removeItem('workoutsDataImported')
  try {
    const value = await AsyncStorage.getItem('workoutsDataImported');
    console.log('function workouts file value',value);
    return value !== null && value !== undefined;
  } catch (error) {
    //console.error('Error checking data import status:', error);
    return false;
  }
};

// Function to import data from JSON file and store it in SQLite
export const importWorkoutsDataFromJSON = async (mainWorkoutsDataWithoutRequire) => {

  try {
    // console.log('Attempting to update workouts media...');
    // const updatedWorkoutsArray = await updateWorkoutsMedia(mainWorkoutsDataWithoutRequire);
  
    console.log('Attempting to add rows to the database...');
    addMainWorkoutsRowsToDatabase(mainWorkoutsDataWithoutRequire).then((workoutsDataImported) => {
      console.log('addMainWorkoutsRowsToDatabase functio n SUCCES :', workoutsDataImported);
    }).catch((error) => {
      //console.error('Error fetching workoutsDataImported:', error);
    });
    //console.log('Setting AsyncStorage value...');
    AsyncStorage.setItem('workoutsDataImported', 'true');
  
    //console.log('Workouts main data added to database successfully');
  } catch (error) {
    //console.error('Error updating workouts media:', error);
  }
  
};

// Main function to handle data import
export const handleWorkoutsDataImport = async () => {
  try {
    const dataImported = await hasWorkoutsDataBeenImported();
    console.log('workouts dataImported',dataImported)
    if (!dataImported && dataImported !== 'true'&& dataImported != true) {
      // Data has not been imported, perform import
      await importWorkoutsDataFromJSON(mainWorkoutsDataWithoutRequire);
    } else {
      //console.log('Workouts Data has already been added to database. Skipping Add.');
    }

    // Continue with the rest of your app logic...
  } catch (error) {
    //console.error('Error handling data adding:', error);
  }
};