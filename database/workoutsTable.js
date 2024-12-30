import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initWorkoutsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS workouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                speKey TEXT,
                wktNam TEXT,
                exrTyp TEXT,
                eqpUsd TEXT,
                witUsd TEXT,
                wktStp TEXT,
                pfgWkt TEXT,
                mjMsOn TEXT,
                mjMsTw TEXT,
                mjMsTr TEXT,
                mnMsOn TEXT,
                mnMsTo TEXT,
                mnMsTr TEXT,
                images TEXT,
                videos TEXT,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('Workouts table created successfully');
          },
          (_, error) => {
            //console.error('Error creating workouts table:', error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export const addMainWorkoutsRowsToDatabase = (dataArray) => {
    const promises = dataArray.map((rowData) => {
      const { userId, speKey } = rowData;
  
      return new Promise((resolve, reject) => {
        database.transaction((tx) => {
          tx.executeSql(
            `
            SELECT * FROM workouts
            WHERE userId = ? AND speKey = ?
            `,
            [userId, speKey],
            (_, result) => {
              if (result.rows.length === 0) {
                // Entry doesn't exist, add it to the database
                tx.executeSql(
                  `
                  INSERT INTO workouts (
                    userId,
                    speKey,
                    wktNam,
                    exrTyp,
                    eqpUsd,
                    witUsd,
                    wktStp,
                    pfgWkt,
                    mjMsOn,
                    mjMsTw,
                    mjMsTr,
                    mnMsOn,
                    mnMsTo,
                    mnMsTr,
                    images,
                    videos,
                    isSync)
                  VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                  `,
                  [
                    rowData.userId,
                    rowData.speKey,
                    rowData.workoutName,
                    rowData.exerciseType,
                    rowData.equipmentUsed,
                    rowData.weightsUsed,
                    rowData.workoutSetup,
                    rowData.performingWorkout,
                    rowData.majorMuscleOne,
                    rowData.majorMuscleTwo,
                    rowData.majorMuscleThree,
                    rowData.minorMuscleOne,
                    rowData.minorMuscleTwo,
                    rowData.minorMuscleThree,
                    rowData.images,
                    rowData.videos,
                    rowData.isSync,
                  ],
                  (_, insertResult) => {
                    console.log('Row added to the database:', insertResult);
                    resolve();
                  },
                  (_, insertError) => {
                    console.error('Error adding row to the database:', insertError);
                    
                  }
                );
              } else {
                // Entry already exists, do nothing
                console.log('Row already exists in the database');
              }
            },
            (_, error) => {
              //console.error('Error checking database for existing row:', error);
            }
          );
        });
      });
    });
  
    return Promise.all(promises);
  }; 

 
  export function insertWorkouts(rowData) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // First, check if the workout already exists for the user
        tx.executeSql(
          `SELECT * FROM workouts WHERE userId = ? AND wktNam = ?`,
          [rowData.userId, rowData.workoutName],
          (_, selectResult) => {
            if (selectResult.rows.length > 0) {
              // Workout with the same name exists for this user
              reject(new Error('The_workout_name_is_already_in_the_database'));
            } else {
              // Proceed to insert the new workout
              tx.executeSql(
                `
                INSERT INTO workouts (
                  userId,
                  speKey,
                  wktNam,
                  exrTyp,
                  eqpUsd,
                  witUsd,
                  wktStp,
                  pfgWkt,
                  mjMsOn,
                  mjMsTw,
                  mjMsTr,
                  mnMsOn,
                  mnMsTo,
                  mnMsTr,
                  images,
                  videos,
                  isSync)
                VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                `,
                [
                  rowData.userId,
                  rowData.speKey,
                  rowData.workoutName,
                  rowData.exerciseType,
                  rowData.equipmentUsed,
                  rowData.weightsUsed,
                  rowData.workoutSetup,
                  rowData.performingWorkout,
                  rowData.majorMuscleOne,
                  rowData.majorMuscleTwo,
                  rowData.majorMuscleThree,
                  rowData.minorMuscleOne,
                  rowData.minorMuscleTwo,
                  rowData.minorMuscleThree,
                  rowData.images,
                  rowData.videos,
                  rowData.isSync,
                ],
                (_, insertResult) => {
                  //console.log('Row added to the database:', insertResult);
                  resolve();
                },
                (_, insertError) => {
                  //console.error('Error adding row to the database:', insertError);
                  reject(insertError);
                }
              );
            }
          },
          (_, selectError) => {
            // Error occurred while checking for existing record
            //console.error('Error checking for existing workout:', selectError);
            reject(selectError);
          }
        );
      });
    });
  
    return promise;
  }
  
  export function updateWorkout(rowData) {
    // console.log('database rowData',rowData);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if the workout exists before updating
        tx.executeSql(
          `SELECT * FROM workouts WHERE userId = ? AND speKey = ?`,
          [rowData.userId, rowData.speKey],
          (_, selectResult) => {
            if (selectResult.rows.length === 0) {
              // Workout does not exist for this user
              reject(new Error('The_workout_name_does_not_exist_in_the_database'));
            } else {
              // Proceed to update the existing workout
              tx.executeSql(
                `
                UPDATE workouts
                SET
                  wktNam = ?,
                  speKey = ?,
                  exrTyp = ?,
                  eqpUsd = ?,
                  witUsd = ?,
                  wktStp = ?,
                  pfgWkt = ?,
                  mjMsOn = ?,
                  mjMsTw = ?,
                  mjMsTr = ?,
                  mnMsOn = ?,
                  mnMsTo = ?,
                  mnMsTr = ?,
                  images = ?,
                  videos = ?,
                  isSync = ?
                WHERE userId = ? AND speKey = ?
                `,
                [
                  rowData.workoutName,
                  rowData.speKey,
                  rowData.exerciseType,
                  rowData.equipmentUsed,
                  rowData.weightsUsed,
                  rowData.workoutSetup,
                  rowData.performingWorkout,
                  rowData.majorMuscleOne,
                  rowData.majorMuscleTwo,
                  rowData.majorMuscleThree,
                  rowData.minorMuscleOne,
                  rowData.minorMuscleTwo,
                  rowData.minorMuscleThree,
                  rowData.images,
                  rowData.videos,
                  rowData.isSync,
                  rowData.userId,
                  rowData.speKey,
                ],
                (_, updateResult) => {
                  // Fetch the updated workout
                  tx.executeSql(
                    `SELECT * FROM workouts WHERE userId = ? AND speKey = ?`,
                    [rowData.userId,  rowData.speKey],
                    (_, selectUpdatedResult) => {
                      resolve(selectUpdatedResult.rows.item(0)); // Resolve with the updated workout
                      // console.log('database selectUpdatedResult.rows.item(0)',selectUpdatedResult.rows.item(0));

                    },
                    (_, selectError) => {
                      reject(selectError); // Handle error in fetching updated workout
                    }
                  );
                },
                (_, updateError) => {
                  reject(updateError); // Handle error in updating workout
                  console.log('Error checking for existing workout:', updateError);

                }
              );
            }
          },
          (_, selectError) => {
            // Error occurred while checking for existing record
            //console.error('Error checking for existing workout:', selectError);
            reject(selectError);
          }
        );
      });
    });
  
    return promise;
  }
  


  export function fetchWorkoutsTable(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM workouts WHERE userId = ? OR userId = ?',
        ["appAssets", userId],
          (_, results) => {
            const workouts = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              workouts.push(rows.item(index));
            }
            //console.log("successed to get workouts from database: ");
            resolve(workouts);
          },
          (_, error) => {
            //console.log("Failed to get workouts from database: ", error);
          }
        );
      });
    });
  
    return promise;
  }
  
  

  export function getWorkoutsOneRow(id,userId ) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM workouts WHERE id = ? AND userId = ?',
          [id,userId],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one user details from database: ",error);
        }
        );
      });
    });
  
    return promise;
  };

  // Function to get unsynced rows from SQLite
  export function getWorkoutsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM workouts WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced workouts rows');
            reject(error);
          }
        );
      });
    });
  };

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateWorkoutsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      const query = `UPDATE workouts SET isSync = 'yes'  WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`;
      //console.log('SQL Query:', query);

      tx.executeSql(
        query,
        [userId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to update the database:', error);
          reject(error);
        }
      );
    });
  });
}



  export function deleteWorkoutsUser(id,userId){
    const promise = new Promise((resolve, reject)=>{
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM workouts where id = ? AND userId = ?',
                [id,userId],
                (_, result) => {
                    //console.log("successed to delete user:",result);
                  },
                  (_, error) => {
                    //console.log("Failed to delete user:",error);
                  }
            )
        })
    })

    return promise
  };
 
  export function fetchWorkoutsLastInsertedRow(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM workouts WHERE userId = ? ORDER BY date DESC LIMIT 1',
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
  }
  
  
  export function clearWorkoutsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM workouts',
          [],
          (_, result) => {
            //console.log('Cleared workouts table');
          },
          (_, error) => {
            //console.log('Failed to clear workouts table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteWorkoutsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS workouts
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete workouts table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete workouts table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  