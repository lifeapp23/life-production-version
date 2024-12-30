import * as SQLite from 'expo-sqlite'

import "../src/features/account/screens/i18n";
import i18n from 'i18next'; // Import the i18next instance
  import { Alert } from 'react-native';


const database = SQLite.openDatabase('health.db');

export function initStartWorkoutTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS startWorkoutTable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            plnKey TEXT,
            dayKey TEXT,
            dayNam TEXT,
            date TEXT,
            wrkKey TEXT,
            wktNam TEXT,
            sets TEXT,
            weight TEXT,
            reps TEXT,
            casTim TEXT,
            dayTim TEXT,
            isCmpld TEXT,
            timStd TEXT,
            exrTyp TEXT,
            exrTim TEXT,
            images TEXT,
            deleted TEXT,
            isSync TEXT
          );
          `,
          [],
          (_, result) => {
            //console.log('Table startWorkoutTable created successfully');
          },
          (_, error) => {
            //console.log('Error creating table startWorkoutTable');
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertPlansStartWorkout(exercises) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        exercises.forEach((exercise) => {
          const { userId,plnKey,dayKey,dayName,date,wrkKey,wktNam,sets,weight,reps,casTim,dayTim,isCompleted,timerStarted,exrTyp,exrTim,images, deleted, isSync } = exercise;
        // Check the number of existing rows for the specified plan and user
          tx.executeSql(
            `
            INSERT INTO startWorkoutTable (userId,plnKey,dayKey,dayNam,date,wrkKey,wktNam,sets,weight,reps,casTim,dayTim,isCmpld,timStd,exrTyp,exrTim,images, deleted, isSync)
            VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?,?,?)
          `,
            [userId,plnKey,dayKey,dayName,date,wrkKey,wktNam,sets,weight,reps,casTim,dayTim,isCompleted,timerStarted,exrTyp,exrTim,images, deleted, isSync],
            (_, insertResult) => {
              //console.log('Succeeded to add startWorkoutTable', insertResult);
              resolve(insertResult);
            },
            (_, insertError) => {
              //console.log('Failed to add startWorkoutTable', insertError);
              reject(insertError);
            }
          );
        });
      });
    });
  
    return promise;
  };
  
 


  export function fetchLastDayStartWorkouts(userId,plnKey,dayKey,wrkKey) {
    // console.log("fetchLastDayStartWorkouts--",userId,plnKey,dayKey,wrkKey);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE userId = ? AND plnKey = ? AND wrkKey = ? AND date = (SELECT MAX(date) FROM startWorkoutTable)',
          [userId,plnKey,wrkKey],
          (_, { rows }) => {
            // console.log('startWorkoutTable rows',rows);
            // console.log('startWorkoutTable rows._array',rows._array);

            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get startWorkoutTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function fetchLastDayStartWorkoutsWithoutPlnKeyAndDayKey(userId,wrkKey) {
    // console.log("fetchLastDayStartWorkoutsWithoutPlnKeyAndDayKey--",userId,wrkKey);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE userId = ?  AND wrkKey = ? AND date = (SELECT MAX(date) FROM startWorkoutTable)',
          [userId,wrkKey],
          (_, { rows }) => {
            // console.log('startWorkoutTable rows',rows);
            // console.log('startWorkoutTable rows._array',rows._array);

            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get startWorkoutTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchAlltDaysStartWorkouts(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE userId = ?',
          [userId],
          (_, { rows }) => {
            // console.log('startWorkoutTable rows',rows);
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get startWorkoutTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchStartWorkoutWithoutDeleting(userId,plnKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE userId = ? AND deleted=? AND plnKey=?',
          [userId,'no',plnKey],
          (_, results) => {
            const startWorkoutTable = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              startWorkoutTable.push(rows.item(index));
            }
  
            resolve(StartWorkout);
          },
          (_, error) => {
            //console.log("Failed to get startWorkoutTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchSpecificWorkoutWithoutDeleting(userId,wrkKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE userId = ? AND deleted=? AND wrkKey=?',
          [userId,'no',wrkKey],
          (_, results) => {
            const startWorkoutTableArray = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              startWorkoutTableArray.push(rows.item(index));
            }
  
            resolve(startWorkoutTableArray);
          },
          (_, error) => {
            //console.log("Failed to get startWorkoutTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  // Function to check if there are workouts for today's date
export function checkTodayWorkouts(userId,dayKey,navigation,publicWorkoutsPlanDayArr){
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const t = i18n.t.bind(i18n); // Get translation function

  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM startWorkoutTable WHERE userId=? AND date = ?',
      [userId,today],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Workouts exist for today's date
          Alert.alert(`${t(' ')}`,`${t('You_can_only_make_one_workout_per_day_Open_the_Calendar_to_see_finished_Workouts')}`);
        } else {
          // No workouts for today's date, check for other dates with the same dayKey
          tx.executeSql(
            'SELECT * FROM startWorkoutTable WHERE userId =? AND dayKey = ? AND date != ?',
            [userId,dayKey, today],
            (_, { rows }) => {
              if (rows.length > 0) {
                // Workouts with the same dayKey but different dates exist
                Alert.alert(`${t(' ')}`,`${t('Please_open_the_calendar_to_see_the_finished_workout')}`);
              }  else {
                // No workouts with the same dayKey but different dates, proceed with adding a new workout
                navigation.navigate('DaysExercisesToStart',{publicWorkoutsPlanDayArrSent:publicWorkoutsPlanDayArr});
              }
            },
            (_, error) =>
              { 
                // console.log('Error checking other dates with same dayKey:', error);

              }
          );
        }
      },
      (_, error) => {
        // console.log('Error checking today workouts:', error);
      }
    );
  });
};





  export function getOneStartWorkoutRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
          [id,userId,name,speKey],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one PublicWorkoutsPlan details from database ",error);
        }
        );
      });
    });
  
    return promise;
  };

  // Function to get unsynced rows from SQLite
  export function getStartWorkoutUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM startWorkoutTable WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            //console.log('rows-----------',rows);
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced startWorkoutTable rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateStartWorkoutRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE startWorkoutTable SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
              [userId],
              (_, result) => {
                  resolve(result);
              },
              (_, error) => {
                  //console.log('Failed to update the database');
              }
          );
      });
  });
}
//WHERE userId = ? AND speKey = ? AND plnKey = ?
export function SoftDeleteAllPublicWorkoutsPlanDayWorkouts(userId, dayKey, plnKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM startWorkoutTable WHERE userId = ? AND dayKey = ? AND plnKey = ?
        `,
          [userId,dayKey,plnKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE startWorkoutTable 
                SET 
                  deleted = 'yes',
                  isSync='no' 
                 WHERE userId = ? AND dayKey = ? AND plnKey = ?
              `,
                [userId,dayKey,plnKey],
                (_, result) => {
                  //console.log('Succeeded to soft delete user Day Workouts', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to soft delete user  Day Workouts', error);
                }
              );
            } else {
              // Rows doesn't exist, handle accordingly (e.g., reject with an error)
              const error = new Error('workouts rows not found');
              //console.log(error);
            }
          },
          (_, error) => {
            //console.log('Error checking for existing user Day Workouts', error);
          }
        );

    });
  });

  return promise;
}
export function SoftDeletePublicWorkoutsPlanAllDays(userId, plnKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM startWorkoutTable WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE startWorkoutTable 
              SET 
                deleted = 'yes',
                isSync='no' 
              WHERE userId=? AND plnKey=?
            `,
              [userId, plnKey],
              (_, result) => {
                //console.log('Succeeded to soft delete user public Workouts Plan All Days', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to soft delete user  public Workouts Plan All Days', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('workout days row not found');
            //console.log('Error checking for existing user startWorkoutTable', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user startWorkoutTable', error);
        }
      );
    });
  });

  return promise;
}
export function updateStartWorkoutName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM startWorkoutTable WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE startWorkoutTable 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user startWorkoutTable name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user startWorkoutTable name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user startWorkoutTable', error);
        }
      );
    });
  });

  return promise;
}

export function deleteStartWorkoutRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM startWorkoutTable WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted startWorkoutTable rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete startWorkoutTable rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchStartWorkoutLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM startWorkoutTable WHERE userId = ?',
        [userId],
        (_, results) => {
          if (results.rows.length > 0) {
            const lastInsertedRow = results.rows.item(0);
            resolve(lastInsertedRow);
            //console.log('lastInsertedRow', lastInsertedRow);
          } else {
            resolve(null); // No rows found
          }
        },
        (_, error) => {
          //console.log("Failed to get last inserted row from database:", error);
          reject(error);
        }
      );
    });
  });

  return promise;
};

  
  export function clearStartWorkoutTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM startWorkoutTable',
          [],
          (_, result) => {
            resolve(result);
            //console.log('Cleared startWorkoutTable table');
          },
          (_, error) => {
            //console.log('Failed to clear startWorkoutTable table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteStartWorkoutTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS startWorkoutTable
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete startWorkoutTable table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete startWorkoutTable table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  