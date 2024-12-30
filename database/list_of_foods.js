import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initListOfFoodsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS ListOfFoodsTable (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            speKey TEXT,
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
            //console.log('Table ListOfFoodsTable created successfully');
          },
          (_, error) => {
            //console.log('Error creating table ListOfFoodsTable');
          }
        );
      });
    });
  
    return promise;
  };
              
 
  // export function insertPlansListOfFoods(newListOfFoods) {
  //   const promise = new Promise((resolve, reject) => {
  //     database.transaction((tx) => {
  //         const { userId,speKey,Type,Subtype,food_description,weight,protein,carbohydrates,fats,calories,Saturated,Polyunsaturated,Monounsaturated,Trans,Sodium,Potassium,Cholesterol,Vitamin_A,Vitamin_C,Calcium,Iron,images,deleted,isSync} = newListOfFoods;
  //       //console.log('newListOfFoods DB ',newListOfFoods);
  //         // Check the number of existing rows for the specified plan and user
  //         tx.executeSql(
  //           `
  //           INSERT INTO ListOfFoodsTable (userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync)
  //           VALUES (?,?, ?, ?, ?, ?, ?,?,?, ?,?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?)
  //         `,
  //           [userId,speKey,Type,Subtype,food_description,weight,protein,carbohydrates,fats,calories,Saturated,Polyunsaturated,Monounsaturated,Trans,Sodium,Potassium,Cholesterol,Vitamin_A,Vitamin_C,Calcium,Iron,images,deleted,isSync],
  //           (_, insertResult) => {
  //             //console.log('Succeeded to add ListOfFoodsTable', insertResult);
  //             resolve(insertResult);
  //           },
  //           (_, insertError) => {
  //             //console.log('Failed to add ListOfFoodsTable', insertError);
  //             reject(insertError);
  //           }
  //         );
  //     });
  //   });
  
  //   return promise;
  // };
  
  export function insertPlansListOfFoods(newListOfFoods) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        const {
          userId, speKey, Type, Subtype, food_description, weight, protein, carbohydrates, fats, calories, 
          Saturated, Polyunsaturated, Monounsaturated, Trans, Sodium, Potassium, Cholesterol, 
          Vitamin_A, Vitamin_C, Calcium, Iron, images, deleted, isSync
        } = newListOfFoods;
  
        // First, check if the food description with the same userId and speKey already exists
        tx.executeSql(
          `
          SELECT * FROM ListOfFoodsTable 
          WHERE userId = ? AND foddes = ? AND deleted = ?
          `,
          [userId, food_description,'no'],
          (_, selectResult) => {
            if (selectResult.rows.length > 0) {
              // If a record is found, reject the promise with an error message
              reject('Food_already_exists_in_the_database');
            } else {
              // If no record is found, proceed with the insert operation
              tx.executeSql(
                `
                INSERT INTO ListOfFoodsTable (
                  userId, speKey, Type, Subtyp, foddes, weight, protin, carbs, fats, calris, 
                  Satrtd, Plnstd, Munstd, Trans, Sodium, Potsim, Chostl, VtminA, VtminC, 
                  Calcim, Iron, images, deleted, isSync
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [
                  userId, speKey, Type, Subtype, food_description, weight, protein, carbohydrates, fats, 
                  calories, Saturated, Polyunsaturated, Monounsaturated, Trans, Sodium, Potassium, 
                  Cholesterol, Vitamin_A, Vitamin_C, Calcium, Iron, images, deleted, isSync
                ],
                (_, insertResult) => {
                  resolve(insertResult);
                },
                (_, insertError) => {
                  reject(insertError);
                }
              );
            }
          },
          (_, selectError) => {
            reject(selectError);
          }
        );
      });
    });
  
    return promise;
  };
  
  // export const addMainMealsRowsToDatabase = (dataArray) => {
  //   const promises = dataArray.map((rowData) => {
  //     const { userId, speKey } = rowData;
  
  //     return new Promise((resolve, reject) => {
  //       database.transaction((tx) => {
  //         tx.executeSql(
  //           `
  //           SELECT * FROM ListOfFoodsTable
  //           WHERE userId = ? AND speKey = ?
  //           `,
  //           [userId, speKey],
  //           (_, result) => {
  //             //console.log('rowData----',rowData.userId,rowData.speKey,rowData.Type,rowData.Subtype,rowData.food_description,rowData.weight,rowData.protein,rowData.carbohydrates,rowData.fats,rowData.calories,rowData.Saturated,rowData.Polyunsaturated,rowData.Monounsaturated,rowData.Trans,rowData.Sodium,rowData.Potassium,rowData.Cholesterol,rowData.Vitamin_A,rowData.Vitamin_C,rowData.Calcium,rowData.Iron,rowData.images,rowData.deleted,rowData.isSync);
  //             const rowData_weight= parseFloat((rowData.weight /100).toFixed(4));
  //             const rowData_protein=  parseFloat((rowData.protein /100).toFixed(4));
  //             const rowData_carbohydrates=  parseFloat((rowData.carbohydrates /100).toFixed(4));
  //             const rowData_fats=  parseFloat((rowData.fats /100).toFixed(4));
  //             const rowData_calories=  parseFloat((rowData.calories /100).toFixed(4));
  //             const rowData_Saturated=  parseFloat((rowData.Saturated /100).toFixed(4));
  //             const rowData_Polyunsaturated=  parseFloat((rowData.Polyunsaturated /100).toFixed(4));
  //             const rowData_Monounsaturated=  parseFloat((rowData.Monounsaturated /100).toFixed(4));
  //             const rowData_Trans=  parseFloat((rowData.Trans /100).toFixed(4));
  //             const rowData_Sodium=  parseFloat((rowData.Sodium /100).toFixed(4));
  //             const rowData_Potassium=  parseFloat((rowData.Potassium /100).toFixed(4));
  //             const rowData_Cholesterol=  parseFloat((rowData.Cholesterol /100).toFixed(4));
  //             const rowData_Vitamin_A=  parseFloat((rowData.Vitamin_A /100).toFixed(4));
  //             const rowData_Vitamin_C=  parseFloat((rowData.Vitamin_C /100).toFixed(4));
  //             const rowData_Calcium=  parseFloat((rowData.Calcium /100).toFixed(4));
  //             const rowData_Iron=  parseFloat((rowData.Iron /100).toFixed(4));
              
  //             if (result.rows.length === 0) {
  //               // Entry doesn't exist, add it to the database
  //               tx.executeSql(
  //                 `
  //                 INSERT INTO ListOfFoodsTable (userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync)
  //                 VALUES (?,?, ?, ?, ?, ?, ?,?,?, ?,?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?)
  //                 `,
  //                 [rowData.userId,rowData.speKey,rowData.Type,rowData.Subtype,rowData.food_description,rowData_weight,rowData_protein,rowData_carbohydrates,rowData_fats,rowData_calories,rowData_Saturated,rowData_Polyunsaturated,rowData_Monounsaturated,rowData_Trans,rowData_Sodium,rowData_Potassium,rowData_Cholesterol,rowData_Vitamin_A,rowData_Vitamin_C,rowData_Calcium,rowData_Iron,rowData.images,rowData.deleted,rowData.isSync],
  //                 (_, insertResult) => {
  //                   //console.log('Meal Row added to the database:', insertResult);
  //                   resolve();
  //                 },
  //                 (_, insertError) => {
  //                   //console.error('Error adding Meal row to the database:', insertError);
                    
  //                 }
  //               );
  //             } else {
  //               // Entry already exists, do nothing
  //               //console.log('Meal Row already exists in the database');
  //             }
  //           },
  //           (_, error) => {
  //             //console.error('Error checking database for existing Meal row:', error);
  //           }
  //         );
  //       });
  //     });
  //   });
  
  //   return Promise.all(promises);
  // }; 

  export function fetchLastDayListOfFoods(userId,plnKey,dayKey,wrkKey) {
    //console.log("fetchLastDayListOfFoods--",userId,plnKey,dayKey,wrkKey);
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ListOfFoodsTable WHERE userId = ? AND plnKey = ? AND dayKey = ? AND wrkKey = ? AND date = (SELECT MAX(date) FROM ListOfFoodsTable)',
          [userId,plnKey,dayKey,wrkKey],
          (_, { rows }) => {
            ////console.log('ListOfFoodsTable rows',rows);
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get ListOfFoodsTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function fetchAlltDaysListOfFoods(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ListOfFoodsTable WHERE deleted = ? AND userId = ?',
          ["no", userId],
          (_, { rows }) => {
            ////console.log('ListOfFoodsTable rows',rows);
            // Resolve with the rows fetched from the database
            resolve(rows._array);
          },
          (_, error) => {
            // Reject with the error if there's any
            //console.log("Failed to get ListOfFoodsTable from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchListOfFoodsWithoutDeleting(userId,plnKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ListOfFoodsTable WHERE userId = ? AND deleted=? AND plnKey=?',
          [userId,'no',plnKey],
          (_, results) => {
            const ListOfFoodsTable = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              ListOfFoodsTable.push(rows.item(index));
            }
  
            resolve(ListOfFoods);
          },
          (_, error) => {
            //console.log("Failed to get ListOfFoodsTable from database ", error);
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
      'SELECT * FROM ListOfFoodsTable WHERE userId=? AND date = ?',
      [userId,today],
      (_, { rows }) => {
        if (rows.length > 0) {
          // Meals exist for today's date
          alert('You can only make one workout per day.Open the Calendar to see finished Meals');
        } else {
          // No Meals for today's date, check for other dates with the same dayKey
          tx.executeSql(
            'SELECT * FROM ListOfFoodsTable WHERE userId =? AND dayKey = ? AND date != ?',
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





  export function getOneListOfFoodsRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ListOfFoodsTable WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
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
  export function getListOfFoodsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM ListOfFoodsTable WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            //console.log('rows-----------',rows);
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              //console.log('rows.item(i)-----------',rows.item(i));

              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced ListOfFoodsTable rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateListOfFoodsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE ListOfFoodsTable SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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
export function SoftDeleteSelectedMeals(removedMeals) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      removedMeals.forEach((removedMeal) => { 
       const {userId,speKey} = removedMeal;
        tx.executeSql(
          `
          SELECT * FROM ListOfFoodsTable WHERE userId = ? AND speKey = ?
        `,
          [userId,speKey],
          (_, result) => {
            if (result.rows.length > 0) {
              // Rows exists, soft delete them
              tx.executeSql(
                `
                UPDATE ListOfFoodsTable 
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
  });

  return promise;
}
export function SoftDeleteJustOneMeal(removedMeal) {
  const promise = new Promise((resolve, reject) => {
    const { userId, speKey } = removedMeal;

    database.transaction((tx) => {
      // First, check if the row exists
      tx.executeSql(
        `
        SELECT * FROM ListOfFoodsTable WHERE userId = ? AND speKey = ?
        `,
        [userId, speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE ListOfFoodsTable 
              SET 
                deleted = 'yes',
                isSync = 'no' 
              WHERE userId = ? AND speKey = ?
              `,
              [userId, speKey],
              (_, updateResult) => {
                //console.log('Succeeded to soft delete user Day Meal', updateResult);
                resolve(updateResult);
              },
              (_, updateError) => {
                //console.log('Failed to soft delete user Day Meal', updateError);
                reject(updateError);
              }
            );
          } else {
            // Row doesn't exist, reject the promise with an error
            const error = 'Meal row not found';
            //console.log(error);
            reject(error);
          }
        },
        (_, selectError) => {
          //console.log('Error checking for existing user Day Meal', selectError);
          reject(selectError);
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
        SELECT * FROM ListOfFoodsTable WHERE userId = ? AND plnKey =?
      `,
        [userId,plnKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE ListOfFoodsTable 
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
            //console.log('Error checking for existing user ListOfFoodsTable', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user ListOfFoodsTable', error);
        }
      );
    });
  });

  return promise;
}
export function updateListOfFoodsName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM ListOfFoodsTable WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE ListOfFoodsTable 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user ListOfFoodsTable name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user ListOfFoodsTable name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user ListOfFoodsTable', error);
        }
      );
    });
  });

  return promise;
}

export function deleteListOfFoodsRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM ListOfFoodsTable WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted ListOfFoodsTable rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete ListOfFoodsTable rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchListOfFoodsLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM ListOfFoodsTable WHERE userId = ?',
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

  
  export function clearListOfFoodsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM ListOfFoodsTable',
          [],
          (_, result) => {
            //console.log('Cleared ListOfFoodsTable table');
          },
          (_, error) => {
            //console.log('Failed to clear ListOfFoodsTable table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteListOfFoodsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS ListOfFoodsTable
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete ListOfFoodsTable table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete ListOfFoodsTable table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  