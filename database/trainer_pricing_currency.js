import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initTrainerPricingCurrency() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS TrainerPricingCurrency (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            speKey TEXT,
            curncy TEXT,
            price TEXT,
            deleted TEXT,
            isSync TEXT
          );
          `,
          [],
          (_, result) => {
            //console.log('Table TrainerPricingCurrency created successfully');
          },
          (_, error) => {
            //console.log('Error creating table TrainerPricingCurrency');
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertTrainerPricingCurrency(newTrainerPricingCurrency) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
          const { userId,speKey,curncy,price,deleted,isSync} = newTrainerPricingCurrency;
          // Check the number of existing rows for the specified plan and user
          tx.executeSql(
            `
            SELECT * FROM TrainerPricingCurrency WHERE userId = ? AND speKey = ?
          `,
            [userId,speKey],
            (_, result) => {

              if (result.rows.length > 0) {
                // User already has a row, update the existing row
                tx.executeSql(
                  `
                  UPDATE TrainerPricingCurrency 
                  SET userId=?,speKey=?,curncy=?,price=?,deleted=?,isSync=?
                  WHERE userId=? AND speKey = ?
                `,
                  [
                    userId,speKey,curncy,price,deleted,isSync,userId,speKey
                  ],
                  (_, result) => {
                    //console.log('Succeeded to update user TrainerPricingCurrency', result);
                    resolve(result);
                  },
                  (_, error) => {
                    //console.log('Failed to update user TrainerPricingCurrency', error);
                    reject(error);
                  }
                );
              } else {
                // User doesn't have a row, proceed to insert a new row
                tx.executeSql(
                  `
                  INSERT INTO TrainerPricingCurrency (userId,speKey,curncy,price,deleted,isSync)
                  VALUES (?, ?,?,?,?,?)
                `,
                  [
                    userId,speKey,curncy,price,deleted,isSync
                  ],
                  (_, result) => {
                    //console.log('Succeeded to add user TrainerPricingCurrency', result);
                    resolve(result);
                  },
                  (_, error) => {
                    //console.log('Failed to add user TrainerPricingCurrency', error);
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
  
 

  // export function fetchLastDayTrainerPricingCurrency(userId,plnKey,dayKey,wrkKey) {
  //   //console.log("fetchLastDayTrainerPricingCurrency--",userId,plnKey,dayKey,wrkKey);
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       tx.executeSql(
  //         'SELECT * FROM TrainerPricingCurrency WHERE userId = ? AND plnKey = ? AND dayKey = ? AND wrkKey = ? AND date = (SELECT MAX(date) FROM TrainerPricingCurrency)',
  //         [userId,plnKey,dayKey,wrkKey],
  //         (_, { rows }) => {
  //           ////console.log('TrainerPricingCurrency rows',rows);
  //           // Resolve with the rows fetched from the database
  //           resolve(rows._array);
  //         },
  //         (_, error) => {
  //           // Reject with the error if there's any
  //           //console.log("Failed to get TrainerPricingCurrency from database ", error);
  //           reject(error);
  //         }
  //       );
  //     });
  //   });
  
  //   return promise;
  // };
  
  export function fetchTrainerPricingCurrency(userId) {
    //console.log('userId Db ',userId);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerPricingCurrency WHERE userId = ?',
          [userId],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            //console.log('userId Db rows._array',rows._array);
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TrainerPricingCurrency from database ", error);
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
          'SELECT * FROM TrainerPricingCurrency WHERE deleted = ? AND userId = ? AND date=?',
          ["no", userId,date],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TrainerPricingCurrency from database ", error);
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
          'SELECT * FROM TrainerPricingCurrency WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const TrainerPricingCurrency = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              TrainerPricingCurrency.push(rows.item(index));
            }
  
            resolve(TrainerPricingCurrency);
          },
          (_, error) => {
            //console.log("Failed to get TrainerPricingCurrency from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
// Function to check if there are Meals for today's date
export function checkTrainerPricingCurrency(userId,dayKey,navigation,publicMealsPlanDayArr){
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM TrainerPricingCurrency WHERE userId=? AND date = ?',
      [userId,today],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Meals exist for today's date
          alert('You can only make one workout per day.Open the Calendar to see finished Meals');
        } else {
          // No Meals for today's date, check for other dates with the same dayKey
          tx.executeSql(
            'SELECT * FROM TrainerPricingCurrency WHERE userId =? AND dayKey = ? AND date != ?',
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





  export function getOneTrainerPricingCurrencyRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerPricingCurrency WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
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
  export function getTrainerPricingCurrencyUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TrainerPricingCurrency WHERE isSync = ? AND userId = ?',
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
            //console.log('Failed to get unsynced TrainerPricingCurrency rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateTrainerPricingCurrencyRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE TrainerPricingCurrency SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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
          SELECT * FROM TrainerPricingCurrency WHERE userId = ? AND speKey = ?
        `,
          [userId,speKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE TrainerPricingCurrency 
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
        SELECT * FROM TrainerPricingCurrency WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TrainerPricingCurrency 
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
            //console.log('Error checking for existing user TrainerPricingCurrency', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TrainerPricingCurrency', error);
        }
      );
    });
  });

  return promise;
}
export function updateTrainerPricingCurrencyName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM TrainerPricingCurrency WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TrainerPricingCurrency 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user TrainerPricingCurrency name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user TrainerPricingCurrency name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TrainerPricingCurrency', error);
        }
      );
    });
  });

  return promise;
}

export function deleteTrainerPricingCurrencyRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM TrainerPricingCurrency WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted TrainerPricingCurrency rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete TrainerPricingCurrency rows:', error);
          reject(error);
        }
      );
    });
  });
}
export function deleteTrainerPricingCurrencyRow(rowToDelete) {
  
  const { userId,speKey,curncy,price,deleted,isSync} = rowToDelete;
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
    
      tx.executeSql(
        `DELETE FROM TrainerPricingCurrency WHERE userId = ? AND speKey = ?`,
        [userId,speKey],
        (_, result) => {
          //console.log('Successfully deleted TrainerPricingCurrency row:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete TrainerPricingCurrency row:', error);
          reject(error);
        }
      );
    });
  });
}

 
export function fetchTrainerPricingCurrencyLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM TrainerPricingCurrency WHERE userId = ?',
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

  
  export function clearTrainerPricingCurrency() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM TrainerPricingCurrency',
          [],
          (_, result) => {
            //console.log('Cleared TrainerPricingCurrency table');
          },
          (_, error) => {
            //console.log('Failed to clear TrainerPricingCurrency table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteTrainerPricingCurrency() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS TrainerPricingCurrency
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete TrainerPricingCurrency table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete TrainerPricingCurrency table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  