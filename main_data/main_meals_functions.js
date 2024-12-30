import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { mainMealsData } from "./main_meals_data_without_require";
import { addMainMealsRowsToDatabase } from "../database/predefined_meals";
import * as VideoThumbnails from 'expo-video-thumbnails';

// const newMealsImgDir = FileSystem.documentDirectory + 'images/';

// const ensureNewMealsImgDirExists = async () => {
// const dirInfo = await FileSystem.getInfoAsync(newMealsImgDir);
//     if (!dirInfo.exists) {
//         await FileSystem.makeDirectoryAsync(newMealsImgDir, { intermediates: true });
//     }
// };

// const saveNewMealsImages = async (asset) => {
//   await ensureNewMealsImgDirExists();
//   // Download the asset if it hasn't been downloaded yet
//   if (!asset.downloaded) {
//     await asset.downloadAsync();
//   }
//   /// continue from here ----------->>>>>>>>>>>>>
//   ////console.log('asset',asset);

//   // Access the localUri property
//   const localUri = asset.localUri;

//   let thumbnailUri = localUri;
//   // Extract file extension from the URI without query parameters
//   //const uriWithoutQuery = localUri.split('?')[0];

//   const fileExtension = thumbnailUri.split('.').pop() || 'jpeg';
  
//     const filename = new Date().getTime() + `.${fileExtension}`;
//     const dest = newMealsImgDir + filename;
  
//     await FileSystem.copyAsync({ from: uri, to: dest });
//     return dest;
// };

// const updateMealsMedia = async (mealsArray) => {
//   const promises = mealsArray.map(async (workout) => {
//     const newWorkoutImage = await saveNewMealsImages(workout.images);
//     workout.images = newWorkoutImage;
//     return workout;
//   });

//   return Promise.all(promises);
// };




// Function to check if data has been imported
export const hasMealsDataBeenImported = async () => {
  //AsyncStorage.removeItem('mealsDataImported')
  try {
    const value = await AsyncStorage.getItem('mealsDataImported');
    //console.log('function Meals file value',value);
    return value !== null && value !== undefined;
  } catch (error) {
    //console.error('Error checking data import status:', error);
    return false;
  }
};

// Function to import data from JSON file and store it in SQLite
export const importMealsDataFromJSON = async (mainMealsData) => {

  try {  
    //console.log('Attempting to add Meals rows to the database...');
    addMainMealsRowsToDatabase(mainMealsData).then((mealsDataImported) => {
      //console.log('addMainMealsRowsToDatabase functio n SUCCES :', mealsDataImported);
    }).catch((error) => {
      //console.error('Error fetching MealsDataImported:', error);
    });
    //console.log('Setting AsyncStorage value...');
    AsyncStorage.setItem('mealsDataImported', 'true');
  
    //console.log('Meals main data added to database successfully');
  } catch (error) {
    //console.error('Error updating Meals media:', error);
  }
  
};

// Main function to handle data import
export const handleMealsDataImport = async () => {
  try {
    const dataImported = await hasMealsDataBeenImported();
    //console.log('dataImported',dataImported)
    if (!dataImported && dataImported !== 'true') {
      // Data has not been imported, perform import
      await importMealsDataFromJSON(mainMealsData);
    } else {
      //console.log('Data has already been added to database. Skipping Add.');
    }

    // Continue with the rest of your app logic...
  } catch (error) {
    //console.error('Error handling data adding:', error);
  }
};


