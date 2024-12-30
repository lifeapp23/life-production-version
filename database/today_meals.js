import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initTodayMealsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS TodayMealsTable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            speKey TEXT,
            date TEXT,
            time TEXT,
            foddes TEXT,
            Type TEXT,
            Subtyp TEXT,
            weight TEXT,
            protin TEXT,
            carbs TEXT,
            fats TEXT,
            calris TEXT,
            Satrtd TEXT,
            Plnstd TEXT,
            Munstd TEXT,
            Trans TEXT,
            Sodium TEXT,
            Potsim TEXT,
            Chostl TEXT,
            VtminA TEXT,
            VtminC TEXT,
            Calcim TEXT,
            Iron TEXT,
            images TEXT,
            deleted TEXT,
            isSync TEXT
          );
          `,
          [],
          (_, result) => {
            //console.log('Table TodayMealsTable created successfully');
          },
          (_, error) => {
            //console.log('Error creating table TodayMealsTable');
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertPlansTodayMeals(newTodayMeals) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
          const { userId,speKey,date,time,Type,Subtype,food_description,weight,protein,carbohydrates,fats,calories,Saturated,Polyunsaturated,Monounsaturated,Trans,Sodium,Potassium,Cholesterol,Vitamin_A,Vitamin_C,Calcium,Iron,images,deleted,isSync} = newTodayMeals;
        //console.log('newTodayMeals DB ',newTodayMeals);
          // Check the number of existing rows for the specified plan and user
          tx.executeSql(
            `
            INSERT INTO TodayMealsTable (userId,speKey,date,time,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync)
            VALUES (?,?, ?,?,?, ?, ?, ?, ?,?,?, ?,?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?)
          `,
            [userId,speKey,date,time,Type,Subtype,food_description,weight,protein,carbohydrates,fats,calories,Saturated,Polyunsaturated,Monounsaturated,Trans,Sodium,Potassium,Cholesterol,Vitamin_A,Vitamin_C,Calcium,Iron,images,deleted,isSync],
            (_, insertResult) => {
              //console.log('Succeeded to add TodayMealsTable', insertResult);
              resolve(insertResult);
            },
            (_, insertError) => {
              //console.log('Failed to add TodayMealsTable', insertError);
              reject(insertError);
            }
          );
      });
    });
  
    return promise;
  };
  
 

  // export function fetchLastDayTodayMeals(userId,plnKey,dayKey,wrkKey) {
  //   //console.log("fetchLastDayTodayMeals--",userId,plnKey,dayKey,wrkKey);
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //       tx.executeSql(
  //         'SELECT * FROM TodayMealsTable WHERE userId = ? AND plnKey = ? AND dayKey = ? AND wrkKey = ? AND date = (SELECT MAX(date) FROM TodayMealsTable)',
  //         [userId,plnKey,dayKey,wrkKey],
  //         (_, { rows }) => {
  //           ////console.log('TodayMealsTable rows',rows);
  //           // Resolve with the rows fetched from the database
  //           resolve(rows._array);
  //         },
  //         (_, error) => {
  //           // Reject with the error if there's any
  //           //console.log("Failed to get TodayMealsTable from database ", error);
  //           reject(error);
  //         }
  //       );
  //     });
  //   });
  
  //   return promise;
  // };
  
  export function fetchAlltDaysTodayMeals(userId) {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TodayMealsTable WHERE deleted = ? AND userId = ? AND date=?',
          ["no", userId,today],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TodayMealsTable from database ", error);
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
          'SELECT * FROM TodayMealsTable WHERE deleted = ? AND userId = ? AND date=?',
          ["no", userId,date],
          (_, { rows }) => {
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get TodayMealsTable from database ", error);
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
          'SELECT * FROM TodayMealsTable WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const TodayMealsTable = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              TodayMealsTable.push(rows.item(index));
            }
  
            resolve(TodayMealsTable);
          },
          (_, error) => {
            //console.log("Failed to get TodayMealsTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
// Function to check if there are Meals for today's date
export function checkTodayMeals(userId,dayKey,navigation,publicMealsPlanDayArr){
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  database.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM TodayMealsTable WHERE userId=? AND date = ?',
      [userId,today],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Meals exist for today's date
          alert('You can only make one workout per day.Open the Calendar to see finished Meals');
        } else {
          // No Meals for today's date, check for other dates with the same dayKey
          tx.executeSql(
            'SELECT * FROM TodayMealsTable WHERE userId =? AND dayKey = ? AND date != ?',
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





  export function getOneTodayMealsRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TodayMealsTable WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
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
  export function getTodayMealsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM TodayMealsTable WHERE isSync = ? AND userId = ?',
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
            //console.log('Failed to get unsynced TodayMealsTable rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateTodayMealsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE TodayMealsTable SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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
          SELECT * FROM TodayMealsTable WHERE userId = ? AND speKey = ?
        `,
          [userId,speKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE TodayMealsTable 
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
        SELECT * FROM TodayMealsTable WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TodayMealsTable 
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
            //console.log('Error checking for existing user TodayMealsTable', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TodayMealsTable', error);
        }
      );
    });
  });

  return promise;
}
export function updateTodayMealsName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM TodayMealsTable WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE TodayMealsTable 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user TodayMealsTable name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user TodayMealsTable name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user TodayMealsTable', error);
        }
      );
    });
  });

  return promise;
}

export function deleteTodayMealsRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM TodayMealsTable WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted TodayMealsTable rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete TodayMealsTable rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchTodayMealsLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM TodayMealsTable WHERE userId = ?',
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

  
  export function clearTodayMealsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM TodayMealsTable',
          [],
          (_, result) => {
            //console.log('Cleared TodayMealsTable table');
          },
          (_, error) => {
            //console.log('Failed to clear TodayMealsTable table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteTodayMealsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS TodayMealsTable
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete TodayMealsTable table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete TodayMealsTable table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  