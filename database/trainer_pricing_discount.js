import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initTrainerDiscount() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS TrainerDiscount (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            speKey TEXT,
            discont TEXT,
            strDat TEXT,
            endDat TEXT,
            deleted TEXT,
            isSync TEXT
          );
          `,
          [],
          (_, result) => {
            //console.log('Table TrainerDiscount created successfully');
          },
          (_, error) => {
            //console.log('Error creating table TrainerDiscount');
          }
        );
      });
    });
  
    return promise;
  };
 
      
 
  export function insertTrainerDiscount(newTrainerDiscount) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
          const { userId,speKey, discont,strDat,endDat,deleted,isSync} = newTrainerDiscount;
          // Check the number of existing rows for the specified plan and user
          tx.executeSql(
            `
            SELECT * FROM TrainerDiscount WHERE userId = ? AND speKey = ?
          `,
            [userId,speKey],
            (_, result) => {

              if (result.rows.length > 0) {
                // User already has a row, update the existing row
                tx.executeSql(
                  `
                  UPDATE TrainerDiscount 
                  SET userId=?,speKey=?,discont=?,strDat=?,endDat=?,deleted=?,isSync=?
                  WHERE userId=? AND speKey = ?
                `,
                  [
                    userId,speKey,discont,strDat,endDat,deleted,isSync,userId,speKey
                  ],
                  (_, result) => {
                    //console.log('Succeeded to update user TrainerDiscount', result);
                    resolve(result);
                  },
                  (_, error) => {
                    //console.log('Failed to update user TrainerDiscount', error);
                    reject(error);
                  }
                );
              } else {
                // User doesn't have a row, proceed to insert a new row
                tx.executeSql(
                  `
                  INSERT INTO TrainerDiscount (userId,speKey,discont,strDat,endDat,deleted,isSync)
                  VALUES (?, ?,?,?,?,?,?)
                `,
                  [
                    userId,speKey,discont,strDat,endDat,deleted,isSync
                  ],
                  (_, result) => {
                    //console.log('Succeeded to add user TrainerDiscount', result);
                    resolve(result);
                  },
                  (_, error) => {
                    //console.log('Failed to add user TrainerDiscount', error);
                    reject(error);
                  }
                );
              }
            },
            (_, error) => {
              //console.log('Error checking for existing user', error);
              reject(error);
            }
          );
      });
    });
  
    return promise;
  };
  
 

  // export function fetchLastDayTrainerDiscount(userId,plnKey,dayKey,wrkKey) {
  //   //console.log("fetchLastDayTrainerDiscount--",userId,plnKey,dayKey,wrkKey);
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       tx.executeSql(
  //         'SELECT * FROM TrainerDiscount WHERE userId = ? AND plnKey = ? AND dayKey = ? AND wrkKey = ? AND date = (SELECT MAX(date) FROM TrainerDiscount)',
  //         [userId,plnKey,dayKey,wrkKey],
  //         (_, { rows }) => {
  //           ////console.log('TrainerDiscount rows',rows);
  //           // Resolve with the rows fetched from the database
  //           resolve(rows._array);
  //         },
  //         (_, error) => {
  //           // Reject with the error if there's any
  //           //console.log("Failed to get TrainerDiscount from database ", error);
  //           reject(error);
  //         }
  //       );
  //     });
  //   });
  
  //   return promise;
  // };
  
  export function fetchTrainerDiscount(userId) {
    //console.log('userId Db ',userId);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerDiscount WHERE userId = ?',
          [userId],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            //console.log('userId Db rows._array',rows._array);
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TrainerDiscount from database ", error);
            //reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchTodayMealForCalendar(userId,date) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerDiscount WHERE deleted = ? AND userId = ? AND date=?',
          ["no", userId,date],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TrainerDiscount from database ", error);
            //reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchAllDaysMealsWithoutDeleting(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerDiscount WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const TrainerDiscount = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              TrainerDiscount.push(rows.item(index));
            }
  
            resolve(TrainerDiscount);
          },
          (_, error) => {
            //console.log("Failed to get TrainerDiscount from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
// Function to check if there are Meals for today's date
export function checkTrainerDiscount(userId,dayKey,navigation,publicMealsPlanDayArr){
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM TrainerDiscount WHERE userId=? AND date = ?',
      [userId,today],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Meals exist for today's date
          alert('You can only make one workout per day.Open the Calendar to see finished Meals');
        } else {
          // No Meals for today's date, check for other dates with the same dayKey
          tx.executeSql(
            'SELECT * FROM TrainerDiscount WHERE userId =? AND dayKey = ? AND date != ?',
            [userId,dayKey, today],
            (_, { rows }) => {
              if (rows.length > 0) {
                // Meals with the same dayKey but different dates exist
                alert('Please open the calendar to see the finished workout.');
              }  else {
                // No Meals with the same dayKey but different dates, proceed with adding a new workout
                navigation.navigate('DaysExercisesToStart',{publicMealsPlanDayArrSent:publicMealsPlanDayArr});
              }
            },
            (_, error) => console.log('Error checking other dates with same dayKey:', error)
          );
        }
      },
      (_, error) => console.log('Error checking today Meals:', error)
    );
  });
};





  export function getOneTrainerDiscountRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerDiscount WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
          [id,userId,name,speKey],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one PublicMealsPlan details from database ",error);
        }
        );
      });
    });
  
    return promise;
  };

  // Function to get unsynced rows from SQLite
  export function getTrainerDiscountUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerDiscount WHERE isSync = ? AND userId = ?',
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
            //console.log('Failed to get unsynced TrainerDiscount rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateTrainerDiscountRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE TrainerDiscount SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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
export function SoftDeleteTodayMeal(removedMeal) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
       const {userId,speKey} = removedMeal;
        tx.executeSql(
          `
          SELECT * FROM TrainerDiscount WHERE userId = ? AND speKey = ?
        `,
          [userId,speKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE TrainerDiscount 
                SET 
                  deleted = 'yes',
                  isSync='no' 
                 WHERE userId = ? AND speKey = ?
              `,
                [userId,speKey],
                (_, result) => {
                  //console.log('Succeeded to soft delete user Day Meal', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to soft delete user  Day Meal', error);
                }
              );
            } else {
              // Rows doesn't exist, handle accordingly (e.g., reject with an error)
              const error = new Error('Meals rows not found');
              //console.log(error);
            }
          },
          (_, error) => {
            //console.log('Error checking for existing user Day Meals', error);
          }
        );
      
    });
  });

  return promise;
}
export function SoftDeletePublicMealsPlanAllDays(userId, plnKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM TrainerDiscount WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TrainerDiscount 
              SET 
                deleted = 'yes',
                isSync='no' 
              WHERE userId=? AND plnKey=?
            `,
              [userId, plnKey],
              (_, result) => {
                //console.log('Succeeded to soft delete user public Meals Plan All Days', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to soft delete user  public Meals Plan All Days', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('workout days row not found');
            //console.log('Error checking for existing user TrainerDiscount', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TrainerDiscount', error);
        }
      );
    });
  });

  return promise;
}
export function updateTrainerDiscountName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM TrainerDiscount WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TrainerDiscount 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user TrainerDiscount name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user TrainerDiscount name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TrainerDiscount', error);
        }
      );
    });
  });

  return promise;
}

export function deleteTrainerDiscountRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM TrainerDiscount WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted TrainerDiscount rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete TrainerDiscount rows:', error);
          reject(error);
        }
      );
    });
  });
}
export function deleteTrainerDiscountRow(rowToDelete) {
  
  const { userId,speKey,discont,strDat,endDat,deleted,isSync} = rowToDelete;
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
    
      tx.executeSql(
        `DELETE FROM TrainerDiscount WHERE userId = ? AND speKey = ?`,
        [userId,speKey],
        (_, result) => {
          //console.log('Successfully deleted TrainerDiscount row:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete TrainerDiscount row:', error);
          reject(error);
        }
      );
    });
  });
}

 
export function fetchTrainerDiscountLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM TrainerDiscount WHERE userId = ?',
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

  
  export function clearTrainerDiscount() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM TrainerDiscount',
          [],
          (_, result) => {
            //console.log('Cleared TrainerDiscount table');
          },
          (_, error) => {
            //console.log('Failed to clear TrainerDiscount table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteTrainerDiscount() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS TrainerDiscount
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete TrainerDiscount table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete TrainerDiscount table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  