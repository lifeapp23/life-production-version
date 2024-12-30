import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initPublicWorkoutsPlansTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS publicWorkoutsPlans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                speKey TEXT,
                plnNam TEXT,
                stDate TEXT,
                edDate TEXT,
                deleted TEXT,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('publicWorkoutsPlans table created successfully');
          },
          (_, error) => {
            //console.error('Error creating publicWorkoutsPlans table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertPublicWorkoutsPlans(userPublicWorkoutsPlans) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if data already exists for the user within the specified date range
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlans 
          WHERE userId = ? AND deleted =?
          AND (
            (stDate <= ? AND edDate >= ?) OR 
            (stDate <= ? AND edDate >= ?)

          )
        `,
          [
            userPublicWorkoutsPlans.userId,
            userPublicWorkoutsPlans.deleted,
          userPublicWorkoutsPlans.startDate,
          userPublicWorkoutsPlans.startDate,
          userPublicWorkoutsPlans.endDate,
          userPublicWorkoutsPlans.endDate,
          ],
          (_, result) => {
            if (result.rows.length > 0) {
              // User has already inserted data within the specified date range, reject the promise
              reject("There_is_already_a_previous_plan_in_those_dates");
            } else {
              // User hasn't inserted data within the specified date range, proceed to insert
              tx.executeSql(
                `
                INSERT INTO publicWorkoutsPlans (
                  userId, speKey, plnNam, stDate, edDate, deleted, isSync
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `,
                [
                  userPublicWorkoutsPlans.userId,
                  userPublicWorkoutsPlans.speKey,
                  userPublicWorkoutsPlans.name,
                  userPublicWorkoutsPlans.startDate,
                  userPublicWorkoutsPlans.endDate,
                  userPublicWorkoutsPlans.deleted,
                  userPublicWorkoutsPlans.isSync,
                ],
                (_, result) => {
                  //console.log('Succeeded to add user public workouts plan', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user public workouts plan', error);
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
            //console.log('Error checking for existing data', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function insertUnlimitedPlansPublicWorkoutsPlans(userPublicWorkoutsPlans) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if data already exists for the user within the specified date range
        tx.executeSql(
          `
          INSERT INTO publicWorkoutsPlans (
            userId, speKey, plnNam, stDate, edDate, deleted, isSync
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            userPublicWorkoutsPlans.userId,
            userPublicWorkoutsPlans.speKey,
            userPublicWorkoutsPlans.name,
            userPublicWorkoutsPlans.startDate,
            userPublicWorkoutsPlans.endDate,
            userPublicWorkoutsPlans.deleted,
            userPublicWorkoutsPlans.isSync,
          ],
          (_, result) => {
            //console.log('Succeeded to add user public workouts plan', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to add user public workouts plan', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function updatePublicWorkoutsPlans(userPublicWorkoutsPlans,plansAddEntry, startDateBoolean ,endDateBoolean) {
    const promise = new Promise((resolve, reject) => {
      //console.log('plansAddEntry---------:', plansAddEntry);
      //console.log('selectedDates.start--------:', selectedDates.start);
      //console.log('selectedDates.end--------:', selectedDates.end);
      //console.log('userPublicWorkoutsPlans--------:', userPublicWorkoutsPlans);

      database.transaction((tx) => {
        // Check if data already exists for the user and the specified plan (based on speKey)
        tx.executeSql(
          `
          SELECT * FROM publicWorkoutsPlans 
          WHERE userId = ? AND deleted=?
          AND (
            (stDate <= ? AND edDate >= ?) OR 
            (stDate <= ? AND edDate >= ?)
          )
          AND speKey <> ?  -- Exclude the current plan being updated
        `,
          [
            userPublicWorkoutsPlans.userId,
            userPublicWorkoutsPlans.deleted,
            startDateBoolean,
            startDateBoolean,
            endDateBoolean,
            endDateBoolean,
            userPublicWorkoutsPlans.speKey, // Exclude the current plan being updated
          ],
          (_, result) => {
            if (result.rows.length > 0) {
              // User is trying to update with overlapping date range, reject the promise
              //console.log('plansAddEntry overlapping---------:', plansAddEntry);
              //console.log('selectedDates.start overlapping--------:', selectedDates.start);
              //console.log('selectedDates.end overlapping--------:', selectedDates.end);
              reject("There_is_already_a_previous_plan_in_those_dates");
            } else {
              // No overlapping date range found, proceed to update
              tx.executeSql(
                `
                UPDATE publicWorkoutsPlans
                SET plnNam = ?, stDate = ?, edDate = ?, deleted = ?, isSync = ?
                WHERE userId = ? AND speKey = ?
              `,
                [
                  plansAddEntry,
                  startDateBoolean,
                  endDateBoolean,
                  'no',
                  'no',
                  userPublicWorkoutsPlans.userId,
                  userPublicWorkoutsPlans.speKey
                ],
                (_, result) => {
                  //console.log('Succeeded to update user public workouts plan', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user public workouts plan', error);
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
            //console.log('Error checking for existing data', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };

  export function updateUnlimitedPlansPublicWorkoutsPlans(userPublicWorkoutsPlans,plansAddEntry, startDateBoolean ,endDateBoolean) {
    const promise = new Promise((resolve, reject) => {
      //console.log('plansAddEntry---------:', plansAddEntry);
      //console.log('selectedDates.start--------:', selectedDates.start);
      //console.log('selectedDates.end--------:', selectedDates.end);
      //console.log('userPublicWorkoutsPlans--------:', userPublicWorkoutsPlans);

      database.transaction((tx) => {
        // Check if data already exists for the user and the specified plan (based on speKey)
        tx.executeSql(
          `
          UPDATE publicWorkoutsPlans
          SET plnNam = ?, stDate = ?, edDate = ?, deleted = ?, isSync = ?
          WHERE userId = ? AND speKey = ?
        `,
          [
            plansAddEntry,
            startDateBoolean,
            endDateBoolean,
            'no',
            'no',
            userPublicWorkoutsPlans.userId,
            userPublicWorkoutsPlans.speKey
          ],
          (_, result) => {
            //console.log('Succeeded to update user public workouts plan', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to update user public workouts plan', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
   
// Function to get plans for the current date
export function getPlansForCurrentDate(userId){
  return new Promise((resolve, reject) => {
    // Get the current date in the format 'YYYY-MM-DD'
    const currentDate = new Date().toISOString().split('T')[0];

    // Query to get plans for the current date
    const query = `
      SELECT *
      FROM publicWorkoutsPlans
      WHERE userId = ? AND deleted = ? AND ? BETWEEN stDate AND edDate
    `;

    // Execute the query
    database.transaction((tx) => {
      tx.executeSql(
        query,
        [userId,'no',currentDate],
        (_, { rows }) => {
          // Resolve with the result rows
          resolve(rows._array);
          //console.log('rows._array',rows._array);
        },
        (_, error) => {
          // Reject with the error
          reject(error);
          //console.log('rows._array error',error);
        }
      );
    });
  });
};



  export function fetchPublicWorkoutsPlans(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlans WHERE userId = ?',
          [userId],
          (_, results) => {
            const publicWorkoutsPlans = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              publicWorkoutsPlans.push(rows.item(index));
            }
  
            resolve(publicWorkoutsPlans);
          },
          (_, error) => {
            //console.log("Failed to get publicWorkoutsPlans from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchPublicWorkoutsPlansWithoutDeleting(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlans WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const publicWorkoutsPlans = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              publicWorkoutsPlans.push(rows.item(index));
            }
  
            resolve(publicWorkoutsPlans);
          },
          (_, error) => {
            //console.log("Failed to get publicWorkoutsPlans from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  

  export function getOnePublicWorkoutsPlansRow(id,userId,name,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlans WHERE id = ? AND userId = ? AND plnNam = ? AND speKey=?',
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
  export function getPublicWorkoutsPlansUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicWorkoutsPlans WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced publicWorkoutsPlans rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updatePublicWorkoutsPlansRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE publicWorkoutsPlans SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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

export function SoftDeletePublicWorkoutsPlans(id, userId,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM publicWorkoutsPlans WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE publicWorkoutsPlans 
              SET 
                deleted = 'yes',
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [id, userId, speKey],
              (_, result) => {
                //console.log('Succeeded to soft delete user publicWorkoutsPlan', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to soft delete user publicWorkoutsPlans', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('workout Plans row not found');
            //console.log('Error checking for existing user publicWorkoutsPlans', error);
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user publicWorkoutsPlans', error);
        }
      );
    });
  });

  return promise;
}
export function updatePublicWorkoutsPlansName(id, userId, name,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM publicWorkoutsPlans WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE publicWorkoutsPlans 
              SET 
                plnNam=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [name,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user publicWorkoutsPlans name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user publicWorkoutsPlans name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Plans equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user publicWorkoutsPlans', error);
        }
      );
    });
  });

  return promise;
}

export function deletePublicWorkoutsPlansRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM publicWorkoutsPlans WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted publicWorkoutsPlans rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete publicWorkoutsPlans rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchPublicWorkoutsPlansLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM publicWorkoutsPlans WHERE userId = ?',
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

  
  export function clearPublicWorkoutsPlansTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM publicWorkoutsPlans',
          [],
          (_, result) => {
            //console.log('Cleared publicWorkoutsPlans table');
          },
          (_, error) => {
            //console.log('Failed to clear publicWorkoutsPlans table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deletePublicWorkoutsPlansTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS publicWorkoutsPlans
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete publicWorkoutsPlans table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete publicWorkoutsPlans table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  