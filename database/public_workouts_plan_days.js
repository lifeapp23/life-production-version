import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initPublicWorkoutsPlanDaysTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS publicWorkoutsPlanDays (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            dayNam TEXT,
            speKey TEXT,
            plnKey TEXT,
            wrkSts TEXT,
            wrkKey TEXT,
            wktNam TEXT,
            exrTyp TEXT,
            exrTim TEXT,
            exrStu TEXT,
            lstUpd TEXT,
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
            deleted TEXT,
            isSync TEXT,
            FOREIGN KEY (plnKey) REFERENCES publicWorkoutsPlans(speKey) ON DELETE CASCADE,
            FOREIGN KEY (wrkKey) REFERENCES workouts(speKey) ON DELETE CASCADE
          );
          `,
          [],
          (_, result) => {
            //console.log('Table publicWorkoutsPlanDays created successfully');
          },
          (_, error) => {
            //console.log('Error creating table publicWorkoutsPlanDays');
          }
        );
      });
    });
    
    
    return promise;
  };
              
 
  // export function insertPlansPublicWorkoutsPlanDays(exercises) {
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       exercises.forEach((exercise) => {
  //         const { userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync } = exercise;
  //       // Check the number of existing rows for the specified plan and user
  //       tx.executeSql(
  //         `
  //         SELECT COUNT(DISTINCT speKey) AS rowCount
  //         FROM publicWorkoutsPlanDays
  //         WHERE plnKey = ? AND userId = ? AND deleted = ?;
  //       `,
  //         [plnKey, userId,'no'],
  //         (_, result) => {
  //           const rowCount = result.rows.item(0).rowCount;
  
  //           // Fetch the plan details to get the start and end dates
  //           tx.executeSql(
  //             `
  //             SELECT stDate, edDate
  //             FROM publicWorkoutsPlans
  //             WHERE speKey = ?
  //           `,
  //             [plnKey],
  //             (_, planResult) => {
  //               const { stDate, edDate } = planResult.rows.item(0);
  //               const startDate = new Date(stDate);
  //               const endDate = new Date(edDate);
  
  //               // Calculate the expected number of days
  //               const expectedDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;

  //               if (rowCount >= expectedDays) {
  //                 // All days are already created, reject with an error message
  //                 reject('Cannot add more days. All days have been created.');
  //               } else {
  //                 // Check if there are existing rows for the specified day
  //                 tx.executeSql(
  //                   `
  //                   SELECT COUNT(*) AS existingRowCount
  //                   FROM publicWorkoutsPlanDays
  //                    WHERE userId = ? AND speKey = ? AND plnKey = ?
  //                 `,
  //                   [userId,speKey,plnKey],
  //                   (_, existingResult) => {
  //                     const existingRowCount = existingResult.rows.item(0).existingRowCount;
  
  //                     if (existingRowCount > 0) {
  //                       // Rows exist for the specified day, update them with deleted = 'yes'
  //                      // Update all rows with deleted set to 'yes'
  //                           tx.executeSql(
  //                             `
  //                             UPDATE publicWorkoutsPlanDays
  //                             SET deleted = 'yes',isSync ="no"
  //                             WHERE userId = ? AND speKey = ? AND plnKey = ?
  //                           `,
  //                             [userId,speKey,plnKey],
  //                             (_, updateRowsResult) => {
  //                               //console.log('Updated existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsResult);
  
  //                               // Check if the new exercise exists in the database
  //                               tx.executeSql(
  //                                 `
  //                                 SELECT COUNT(*) AS newExercisesCount
  //                                 FROM publicWorkoutsPlanDays
  //                                 WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
  //                               `,
  //                                 [userId, speKey, plnKey, wrkKey],
  //                                 (_, newExercisesResult) => {
  //                                   const newExercisesCount = newExercisesResult.rows.item(0).newExercisesCount;
  
  //                                   if (newExercisesCount > 0) {
  //                                     // New exercise already exists in the database, update it
  //                                     tx.executeSql(
  //                                       `
  //                                       UPDATE publicWorkoutsPlanDays
  //                                       SET wrkSts = ?,dayNam = ?, deleted = ?, isSync = ?
  //                                       WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
  //                                     `,
  //                                       [wrkSts,dayNam,deleted, 'no', userId, speKey, plnKey, wrkKey],
  //                                       (_, updateResult) => {
  //                                         //console.log('Updated existing rows with new exercises in publicWorkoutsPlanDays', updateResult);
  //                                         resolve(updateResult);
  //                                       },
  //                                       (_, updateError) => {
  //                                         //console.log('Failed to update existing rows with new exercises in publicWorkoutsPlanDays', updateError);
  //                                         reject(updateError);
  //                                       }
  //                                     );
  //                                   } else {
  //                                     // New exercise doesn't exist, proceed to insert
  //                                     tx.executeSql(
  //                                       `
  //                                       INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
  //                                       VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?)
  //                                     `,
  //                                       [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
  //                                       (_, insertResult) => {
  //                                         //console.log('Succeeded to add publicWorkoutsPlanDays', insertResult);
  //                                         resolve(insertResult);
  //                                       },
  //                                       (_, insertError) => {
  //                                         //console.log('Failed to add publicWorkoutsPlanDays', insertError);
  //                                         reject(insertError);
  //                                       }
  //                                     );
  //                                   }
  //                                 },
  //                                 (_, newExercisesError) => {
  //                                   //console.log('Error checking new exercises in publicWorkoutsPlanDays', newExercisesError);
  //                                   reject(newExercisesError);
  //                                 }
  //                               );
  //                             },
  //                             (_, updateRowsError) => {
  //                               //console.log('Failed to update existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsError);
  //                               reject(updateRowsError);
  //                             }
  //                           );
  //                     } else {
  //                       // No existing rows for the specified wrkKey, proceed to insert the new day
  //                       tx.executeSql(
  //                         `
  //                         INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
  //                         VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?)
  //                       `,
  //                         [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
  //                         (_, insertResult) => {
  //                           //console.log('Succeeded to add planspublicWorkoutsPlanDay', insertResult);
  //                           resolve(insertResult);
  //                         },
  //                         (_, insertError) => {
  //                           //console.log('Failed to add planspublicWorkoutsPlanDay', insertError);
  //                           reject(insertError);
  //                         }
  //                       );
  //                     }
  //                   },
  //                   (_, existingError) => {
  //                     //console.log('Error checking existing rows for wrkKey in publicWorkoutsPlanDays', existingError);
  //                     reject(existingError);
  //                   }
  //                 );
  //               }
  //             },
  //             (_, error) => {
  //               //console.log('Error fetching plan details', error);
  //               reject(error);
  //             }
  //           );
  //         },
  //         (_, error) => {
  //           //console.log('Error checking existing rows in publicWorkoutsPlanDays', error);
  //           reject(error);
  //         }
  //       );
  //       });
  //     });
  //   });
  
  //   return promise;
  // };



  export function insertPlansPublicWorkoutsPlanDays(exercises) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        exercises.forEach((exercise) => {
          const { userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,exrTim,exrStu ,lstUpd,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync } = exercise;
        // Check the number of existing rows for the specified plan and user
       //console.log('insertPlansPublicWorkoutsPlanDays exercise',exercise);
        tx.executeSql(
          `
          SELECT COUNT(*) AS existingRowCount
          FROM publicWorkoutsPlanDays
           WHERE userId = ? AND speKey = ? AND plnKey = ?
        `,
          [userId,speKey,plnKey],
          (_, existingResult) => {
            const existingRowCount = existingResult.rows.item(0).existingRowCount;
           //console.log('insertPlansPublicWorkoutsPlanDays existingRowCount',existingRowCount);

            if (existingRowCount > 0) {
              // Rows exist for the specified day, update them with deleted = 'yes'
             // Update all rows with deleted set to 'yes'
                  tx.executeSql(
                    `
                    UPDATE publicWorkoutsPlanDays
                    SET deleted = 'yes',isSync ="no"
                    WHERE userId = ? AND speKey = ? AND plnKey = ?
                  `,
                    [userId,speKey,plnKey],
                    (_, updateRowsResult) => {
                      //console.log('Updated existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsResult);
                     //console.log('insertPlansPublicWorkoutsPlanDays updateRowsResult',updateRowsResult);

                      // Check if the new exercise exists in the database
                      tx.executeSql(
                        `
                        SELECT COUNT(*) AS newExercisesCount
                        FROM publicWorkoutsPlanDays
                        WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
                      `,
                        [userId, speKey, plnKey, wrkKey],
                        (_, newExercisesResult) => {
                          const newExercisesCount = newExercisesResult.rows.item(0).newExercisesCount;
                         //console.log('insertPlansPublicWorkoutsPlanDays newExercisesCount',newExercisesCount);

                          if (newExercisesCount > 0) {
                            // New exercise already exists in the database, update it
                            tx.executeSql(
                              `
                              UPDATE publicWorkoutsPlanDays
                              SET wrkSts = ?,dayNam = ?, deleted = ?, isSync = ?
                              WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
                            `,
                              [wrkSts,dayNam,deleted, 'no', userId, speKey, plnKey, wrkKey],
                              (_, updateResult) => {
                               //console.log('insertPlansPublicWorkoutsPlanDays updateResult',updateResult);
                                resolve(updateResult);
                              },
                              (_, updateError) => {
                               //console.log('Failed to update existing rows with new exercises in publicWorkoutsPlanDays', updateError);
                                // reject(updateError);
                              }
                            );
                          } else {
                            // New exercise doesn't exist, proceed to insert
                            tx.executeSql(
                              `
                              INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,exrTim,exrStu ,lstUpd,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
                              VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?,?,?,?)
                            `,
                              [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,exrTim,exrStu ,lstUpd,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
                              (_, insertResult) => {
                                //console.log('Succeeded to add publicWorkoutsPlanDays', insertResult);
                                resolve(insertResult);
                              },
                              (_, insertError) => {
                               //console.log('Failed to add publicWorkoutsPlanDays', insertError);
                                ////reject(insertError);
                              }
                            );
                          }
                        },
                        (_, newExercisesError) => {
                         //console.log('Error checking new exercises in publicWorkoutsPlanDays', newExercisesError);
                          ///reject(newExercisesError);
                        }
                      );
                    },
                    (_, updateRowsError) => {
                     //console.log('Failed to update existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsError);
                      ///reject(updateRowsError);
                    }
                  );
            } else {
              // No existing rows for the specified wrkKey, proceed to insert the new day
              tx.executeSql(
                `
                INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,exrTim,exrStu ,lstUpd,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
                VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?,?,?,?)
              `,
                [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,exrTim,exrStu ,lstUpd,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
                (_, insertResult) => {
                 //console.log('Succeeded to add planspublicWorkoutsPlanDay', insertResult);
                  resolve(insertResult);
                },
                (_, insertError) => {
                 //console.log('Failed to add planspublicWorkoutsPlanDay', insertError);
                  //reject(insertError);
                }
              );
            }
          },
          (_, existingError) => {
           //console.log('Error checking existing rows for wrkKey in publicWorkoutsPlanDays', existingError);
            //reject(existingError);
          }
        );
        });
      });
    });
  
    return promise;
  };
  export function restartWorkoutByChangingSpekey(userId, speKey, plnKey) {
    // Generate today's date
  
    // Generate the new speKey
  
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND speKey = ? AND plnKey = ?
          `,
          [userId, speKey, plnKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them and update speKey
              tx.executeSql(
                `
                UPDATE publicWorkoutsPlanDays 
                SET 
                  deleted = 'no',
                  speKey = ?
                WHERE userId = ? AND speKey = ? AND plnKey = ?
                `,
                [newSpeKey, userId, speKey, plnKey],
                (_, updateResult) => {
                 //console.log('Succeeded to update speKey for user Day Workouts');
                  resolve(updateResult);
                },
                (_, error) => {
                 //console.log('Failed to update speKey for user Day Workouts');
                }
              );
            } else {
              // Rows don't exist, handle accordingly (e.g., reject with an error)
              const error = new Error('Workouts rows not found');
            }
          },
          (_, error) => {
           //console.log('Error checking for existing user Day Workouts');
          }
        );
      });
    });
  
    return promise;
  }

  export function restartWorkoutByChangingToActive(userId, speKey, plnKey,publicWorkoutsPlanDayArr) {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND speKey = ? AND plnKey = ? AND deleted = 'no'
          `,
          [userId, speKey, plnKey],
          (_, result) => {
            if (result.rows.length > 0) {
              let canUpdate = true;
              let errorMessage = '';
  
              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
  
                if (row.exrStu === 'skipped') {
                  // Update skipped to active
                  tx.executeSql(
                    `
                    UPDATE publicWorkoutsPlanDays 
                    SET 
                      exrStu = 'active',
                      deleted = 'no',
                      lstUpd = ?
                    WHERE userId = ? AND speKey = ? AND plnKey = ? AND exrStu = 'skipped' AND deleted = 'no'
                    `,
                    [row?.lstUpd, userId, speKey, plnKey],
                    (_, updateResult) => {
                     //console.log('Succeeded to update skipped to active');
                      resolve(updateResult);
                    },
                    (_, error) => {
                     //console.log('Failed to update skipped to active', error);
                      // reject(error);
                    }
                  );
                } else if (row.exrStu === 'done') {
                  const lstUpdDate = row?.lstUpd;
 //console.log('lstUpdDate###',lstUpdDate);
 //console.log('today###',today);
// i must put here that today day is not = lastupdDate
                  if (lstUpdDate !== today) {
                    // Update done (not today's date) to active
                    tx.executeSql(
                      `
                      UPDATE publicWorkoutsPlanDays 
                      SET 
                        exrStu = 'active',
                        deleted = 'no',
                        lstUpd = ?
                      WHERE userId = ? AND speKey = ? AND plnKey = ? AND exrStu = 'done' AND lstUpd != ? AND deleted = 'no'
                      `,
                      [lstUpdDate, userId, speKey, plnKey, today],
                      (_, updateResult) => {
                       //console.log('Succeeded to update done to active');
                        resolve(updateResult);
                      },
                      (_, error) => {
                       //console.log('Failed to update done to active', error);
                        // reject(error);
                      }
                    );
                  } else {
                    // Show message if done (today's date)
                    canUpdate = false;
                    errorMessage = 'You_can_restart_the_workout_on_another_day';
                    break;
                  }
                }
              }
  
              if (!canUpdate) {
                // Alert.alert('Info', errorMessage);
               //console.log(errorMessage);

                reject(errorMessage)
              }
            } else {
              const error = new Error('Workouts rows not found');
             //console.log(error.message);
              // reject(error);
            }
          },
          (_, error) => {
           //console.log('Error checking for existing user Day Workouts', error);
            // reject(error);
          }
        );
      });
    });
  }


  export function restartAllWorkoutsToActive(userId, plnKey) {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Step 1: Check if all rows have lstUpd dates not equal to today and exrStu is not 'active'
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND plnKey = ? AND deleted = 'no'
          `,
          [userId, plnKey],
          (_, result) => {
           //console.log('result.rows222',result.rows);
            if (result.rows.length > 0) {
              let lstUpdArray = [];
              let exrStuArray = [];
              let arrayOfAllDoneOrSkippedValues = [];

              let canUpdate = true;
              let errorMessage = '';
              let errorLogged = false; // Flag to check if error has been logged

              for (let i = 0; i < result.rows.length; i++) {
                const row = result.rows.item(i);
                const lstUpdDate = row?.lstUpd; // Extract date portion
  
                lstUpdArray.push(lstUpdDate === today);
                exrStuArray.push(row.exrStu === 'active');
                arrayOfAllDoneOrSkippedValues.push(row.exrStu);
              }
             //console.log('Promise arrayOfAllDoneOrSkippedValues====', arrayOfAllDoneOrSkippedValues);

             //console.log('restartAllWorkoutsToActive lstUpdArray====', lstUpdArray);
             //console.log('restartAllWorkoutsToActive exrStuArray====', exrStuArray);
             //console.log('restartAllWorkoutsToActive exrStuArray.includes(true)', exrStuArray.includes(true));
             //console.log('restartAllWorkoutsToActive lstUpdArray.includes(true)', lstUpdArray.includes(true));
              const allDoneOrSkipped = arrayOfAllDoneOrSkippedValues.every(status => status === 'done' || status === 'skipped');
             //console.log('restartAllWorkoutsToActive allDoneOrSkipped====', allDoneOrSkipped);

             
  
              if (allDoneOrSkipped && lstUpdArray.includes(true)) {
                errorMessage = 'Your_workouts_will_be_reactivated_tomorrow';
                return reject(errorMessage);
              }
  
              // if (!canUpdate) {
              //  //console.log(errorMessage);
              //   return reject(errorMessage);
              // }
            if (allDoneOrSkipped) {

              // Step 2: Update all rows where exrStu is not 'active'
              tx.executeSql(
                `
                UPDATE publicWorkoutsPlanDays 
                SET 
                  exrStu = 'active',
                  deleted = 'no'
                WHERE userId = ? AND plnKey = ? AND exrStu != 'active' AND lstUpd != ? AND deleted = 'no'

                `,
                [ userId, plnKey,today],
                (_, updateResult) => {
                 //console.log('Succeeded to update all workouts to active');
                  resolve(updateResult);
                },
                (_, error) => {
                 //console.log('Failed to update all workouts to active', error);
                  // reject(error);
                }
              );
            }
            } else {
              // const error = new Error('Workouts rows not found');
             //console.log('Workouts rows not found');
              // reject(error);
            }
          },
          (_, error) => {
           //console.log('Error checking for existing user Day Workouts', error);
            // reject(error);
          }
        );
      });
    });
  }
  
  
  
  
  

  export function updateWorkoutByChangingStatusToSkippedOrDone(userId, speKey, plnKey,status,lastDate) {
    // Generate today's date
  
    // Generate the new speKey
  
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND speKey = ? AND plnKey = ?
          `,
          [userId, speKey, plnKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them and update speKey
              tx.executeSql(
                `
                UPDATE publicWorkoutsPlanDays 
                SET 
                  deleted = 'no',
                  exrStu = ?,
                  lstUpd = ?
                WHERE userId = ? AND speKey = ? AND plnKey = ?
                `,
                [status,lastDate, userId, speKey, plnKey],
                (_, updateResult) => {
                 //console.log('Succeeded to update status to for user Day Workouts');
                  resolve(updateResult);
                },
                (_, error) => {
                 //console.log('Failed to update speKey for user Day Workouts');
                }
              );
            } else {
              // Rows don't exist, handle accordingly (e.g., reject with an error)
              const error = new Error('Workouts rows not found');
            }
          },
          (_, error) => {
           //console.log('Error checking for existing user Day Workouts');
          }
        );
      });
    });
  
    return promise;
  }


  export function restartAllWorkoutByChangingSpekey(userId, plnKey) {
   //console.log('restartAllWorkoutByChangingSpekey userId, plnKey', userId, plnKey);
  
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND plnKey = ? AND deleted = ? AND isSync = ?`,
          [userId, plnKey, 'no', 'no'],
          (_, publicWorkoutsResult) => {
            const publicWorkoutsRows = publicWorkoutsResult.rows._array;
           //console.log('publicWorkoutsRows', publicWorkoutsRows);
  
            const publicSpeKeys = publicWorkoutsRows.map(row => row.speKey);
           //console.log('publicSpeKeys', publicSpeKeys);
  
            tx.executeSql(
              `SELECT * FROM startWorkoutTable WHERE userId = ? AND plnKey = ? AND deleted = ? AND isSync = ?`,
              [userId, plnKey, 'no', 'no'],
              (_, startWorkoutsResult) => {
                const startWorkoutsRows = startWorkoutsResult.rows._array;
                const startSpeKeys = startWorkoutsRows.map(row => row.dayKey);
               //console.log('startSpeKeys', startSpeKeys);
  
                // Check if all publicSpeKeys have corresponding speKey in startSpeKeys
                const allKeysMatch = publicSpeKeys.every(key => startSpeKeys.includes(key));
               //console.log('allKeysMatch', allKeysMatch);
  
                if (allKeysMatch) {
                  // Group exercises by speKey
                  const groupedExercises = publicWorkoutsRows.reduce((acc, row) => {
                    if (!acc[row.speKey]) {
                      acc[row.speKey] = [];
                    }
                    acc[row.speKey].push(row);
                    return acc;
                  }, {});
  
                  // Update each group with a new speKey
                  const updatePromises = Object.keys(groupedExercises).map(speKey => {
                    const newSpeKey = userId + '.' + new Date().getTime();
                   //console.log('newSpeKey', newSpeKey);
  
                    return new Promise((resolve, reject) => {
                      tx.executeSql(
                        `UPDATE publicWorkoutsPlanDays 
                         SET 
                           deleted = 'no',
                           speKey = ?
                         WHERE userId = ? AND plnKey = ? AND speKey = ?`,
                        [newSpeKey, userId, plnKey, speKey],
                        (_, updateResult) => {
                         //console.log(`Succeeded to update publicWorkoutsPlanDays rows with speKey ${speKey}`);
                          resolve(updateResult);
                        },
                        (_, error) => {
                         //console.log(`Failed to update publicWorkoutsPlanDays rows with speKey ${speKey}`, error);
                          // reject(error);
                        }
                      );
                    });
                  });
  
                  Promise.all(updatePromises)
                    .then(results => {
                     //console.log('Succeeded to update all publicWorkoutsPlanDays rows');
                      resolve(results);
                    })
                    .catch(error => {
                     //console.log('Failed to update one or more publicWorkoutsPlanDays rows', error);
                      // reject(error);
                    });
                } else {
                 //console.log('Not all rows have corresponding speKey in startWorkoutTable');
                  // resolve({ message: 'Not all rows have corresponding speKey in startWorkoutTable' });
                }
              },
              (_, error) => {
               //console.log('Error selecting from startWorkoutTable', error);
                // reject(error);
              }
            );
          },
          (_, error) => {
           //console.log('Error selecting from publicWorkoutsPlanDays', error);
            // reject(error);
          }
        );
      });
    });
  
    return promise;
  }
  
  
  
  
  




  ///// new inert function that i must try it to solve the updating
  // export function insertPlansPublicWorkoutsPlanDays(exercises) {
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       exercises.forEach((exercise) => {
  //         const { userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync } = exercise;
  //       // Check the number of existing rows for the specified plan and user
  //       tx.executeSql(
  //         `
  //         SELECT COUNT(*) AS existingRowCount
  //         FROM publicWorkoutsPlanDays
  //          WHERE userId = ? AND speKey = ? AND plnKey = ?
  //       `,
  //         [userId,speKey,plnKey],
  //         (_, existingResult) => {
  //           const existingRowCount = existingResult.rows.item(0).existingRowCount;
      
  //           if (existingRowCount > 0) {
  //             // Rows exist for the specified day, update them with deleted = 'yes'
  //            // Update all rows with deleted set to 'yes'
  //                 tx.executeSql(
  //                   `
  //                   UPDATE publicWorkoutsPlanDays
  //                   SET deleted = 'yes',isSync ="no"
  //                   WHERE userId = ? AND speKey = ? AND plnKey = ?
  //                 `,
  //                   [userId,speKey,plnKey],
  //                   (_, updateRowsResult) => {
  //                     //console.log('Updated existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsResult);
      
  //                     // Check if the new exercise exists in the database
  //                     tx.executeSql(
  //                       `
  //                       SELECT COUNT(*) AS newExercisesCount
  //                       FROM publicWorkoutsPlanDays
  //                       WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
  //                     `,
  //                       [userId, speKey, plnKey, wrkKey],
  //                       (_, newExercisesResult) => {
  //                         const newExercisesCount = newExercisesResult.rows.item(0).newExercisesCount;
      
  //                         if (newExercisesCount > 0) {
  //                           // New exercise already exists in the database, update it
  //                           tx.executeSql(
  //                             `
  //                             UPDATE publicWorkoutsPlanDays
  //                             SET wrkSts = ?,dayNam = ?, deleted = ?, isSync = ?
  //                             WHERE userId = ? AND speKey = ? AND plnKey = ? AND wrkKey = ?
  //                           `,
  //                             [wrkSts,dayNam,deleted, 'no', userId, speKey, plnKey, wrkKey],
  //                             (_, updateResult) => {
  //                               //console.log('Updated existing rows with new exercises in publicWorkoutsPlanDays', updateResult);
  //                               resolve(updateResult);
  //                             },
  //                             (_, updateError) => {
  //                               //console.log('Failed to update existing rows with new exercises in publicWorkoutsPlanDays', updateError);
  //                               reject(updateError);
  //                             }
  //                           );
  //                         } else {
  //                           // New exercise doesn't exist, proceed to insert
  //                           tx.executeSql(
  //                             `
  //                             INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
  //                             VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?)
  //                           `,
  //                             [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
  //                             (_, insertResult) => {
  //                               //console.log('Succeeded to add publicWorkoutsPlanDays', insertResult);
  //                               resolve(insertResult);
  //                             },
  //                             (_, insertError) => {
  //                               //console.log('Failed to add publicWorkoutsPlanDays', insertError);
  //                               reject(insertError);
  //                             }
  //                           );
  //                         }
  //                       },
  //                       (_, newExercisesError) => {
  //                         //console.log('Error checking new exercises in publicWorkoutsPlanDays', newExercisesError);
  //                         reject(newExercisesError);
  //                       }
  //                     );
  //                   },
  //                   (_, updateRowsError) => {
  //                     //console.log('Failed to update existing rows with deleted = yes in publicWorkoutsPlanDays', updateRowsError);
  //                     reject(updateRowsError);
  //                   }
  //                 );
  //           } else {
  //             tx.executeSql(
  //               `
  //               SELECT COUNT(DISTINCT speKey) AS rowCount
  //               FROM publicWorkoutsPlanDays
  //               WHERE plnKey = ? AND userId = ? AND deleted = ?;
  //             `,
  //               [plnKey, userId,'no'],
  //               (_, result) => {
  //                 const rowCount = result.rows.item(0).rowCount;
        
  //                 // Fetch the plan details to get the start and end dates
  //                 tx.executeSql(
  //                   `
  //                   SELECT stDate, edDate
  //                   FROM publicWorkoutsPlans
  //                   WHERE speKey = ?
  //                 `,
  //                   [plnKey],
  //                   (_, planResult) => {
  //                     const { stDate, edDate } = planResult.rows.item(0);
  //                     const startDate = new Date(stDate);
  //                     const endDate = new Date(edDate);
        
  //                     // Calculate the expected number of days
  //                     const expectedDays = Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000)) + 1;
      
  //                     if (rowCount >= expectedDays) {
  //                       // All days are already created, reject with an error message
  //                       reject('Cannot add more days. All days have been created.');
  //                     } else{
  //                        // No existing rows for the specified wrkKey, proceed to insert the new day
  //                       tx.executeSql(
  //                         `
  //                         INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
  //                         VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?)
  //                       `,
  //                         [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
  //                         (_, insertResult) => {
  //                           //console.log('Succeeded to add planspublicWorkoutsPlanDay', insertResult);
  //                           resolve(insertResult);
  //                         },
  //                         (_, insertError) => {
  //                           //console.log('Failed to add planspublicWorkoutsPlanDay', insertError);
  //                           reject(insertError);
  //                         }
  //                       );
  //                     }
  //                   },
  //                   (_, error) => {
  //                     //console.log('Error fetching plan details', error);
  //                     reject(error);
  //                   }
  //                 );
  //               },
  //               (_, error) => {
  //                 //console.log('Error checking existing rows in publicWorkoutsPlanDays', error);
  //                 reject(error);
  //               }
  //             );
  //           }
  //         },
  //         (_, existingError) => {
  //           //console.log('Error checking existing rows for wrkKey in publicWorkoutsPlanDays', existingError);
  //           reject(existingError);
  //         }
  //       );

  //       });
  //     });
  //   });
  
  //   return promise;
  // };
 


  export function fetchPublicWorkoutsPlanDays(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlanDays WHERE userId = ?',
          [userId],
          (_, results) => {
            const publicWorkoutsPlanDays = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              publicWorkoutsPlanDays.push(rows.item(index));
            }
  
            resolve(publicWorkoutsPlanDays);
          },
          (_, error) => {
            //console.log("Failed to get publicWorkoutsPlanDays from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchPublicWorkoutsPlanDaysWithoutDeleting(userId,plnKey) {
   //console.log('userId>>>---',userId);
   //console.log('plnKey>>>---',plnKey);

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND deleted=? AND plnKey=?',
          [userId,'no',plnKey],
          (_, results) => {
            const publicWorkoutsPlanDays = [];
            const rows = results.rows; // Access the rows property
           //console.log('rows>>>---',rows);

            for (let index = 0; index < rows.length; index++) {
              publicWorkoutsPlanDays.push(rows.item(index));
            }
           //console.log('publicWorkoutsPlanDays>>>---',publicWorkoutsPlanDays);

            resolve(publicWorkoutsPlanDays);
          },
          (_, error) => {
            ////console.log("Failed to get publicWorkoutsPlanDays from database ", error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchPublicWorkoutsPlanDaysWithoutDeletingWithoutPlnKey(userId) {
   //console.log('userId fetchPublicWorkoutsPlanDaysWithoutDeletingWithoutPlnKey>>>---',userId);

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const publicWorkoutsPlanDays = [];
            const rows = results.rows; // Access the rows property
           //console.log('rows>>>---',rows);

            for (let index = 0; index < rows.length; index++) {
              publicWorkoutsPlanDays.push(rows.item(index));
            }
           //console.log('publicWorkoutsPlanDays fetchPublicWorkoutsPlanDaysWithoutDeletingWithoutPlnKey>>>---',publicWorkoutsPlanDays);

            resolve(publicWorkoutsPlanDays);
          },
          (_, error) => {
            ////console.log("Failed to get publicWorkoutsPlanDays from database ", error);
          }
        );
      });
    });
  
    return promise;
  }; 

  export function getOnePublicWorkoutsPlanDaysRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlanDays WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
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
  export function getPublicWorkoutsPlanDaysUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlanDays WHERE isSync = ? AND userId = ?',
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
            //console.log('Failed to get unsynced publicWorkoutsPlanDays rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updatePublicWorkoutsPlanDaysRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE publicWorkoutsPlanDays SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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
export function SoftDeleteAllPublicWorkoutsPlanDayWorkouts(userId, speKey, plnKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND speKey = ? AND plnKey = ?
        `,
          [userId,speKey,plnKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE publicWorkoutsPlanDays 
                SET 
                  deleted = 'yes',
                  isSync='no' 
                 WHERE userId = ? AND speKey = ? AND plnKey = ?
              `,
                [userId,speKey,plnKey],
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
        SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE publicWorkoutsPlanDays 
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
            //console.log('Error checking for existing user publicWorkoutsPlanDays', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user publicWorkoutsPlanDays', error);
        }
      );
    });
  });

  return promise;
}
export function updatePublicWorkoutsPlanDaysName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM publicWorkoutsPlanDays WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE publicWorkoutsPlanDays 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user publicWorkoutsPlanDays name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user publicWorkoutsPlanDays name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user publicWorkoutsPlanDays', error);
        }
      );
    });
  });

  return promise;
}

export function deletePublicWorkoutsPlanDaysRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM publicWorkoutsPlanDays WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted publicWorkoutsPlanDays rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete publicWorkoutsPlanDays rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchPublicWorkoutsPlanDaysLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM publicWorkoutsPlanDays WHERE userId = ?',
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

  
  export function clearPublicWorkoutsPlanDaysTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM publicWorkoutsPlanDays',
          [],
          (_, result) => {
            //console.log('Cleared publicWorkoutsPlanDays table');
          },
          (_, error) => {
            //console.log('Failed to clear publicWorkoutsPlanDays table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deletePublicWorkoutsPlanDaysTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS publicWorkoutsPlanDays
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete publicWorkoutsPlanDays table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete publicWorkoutsPlanDays table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  