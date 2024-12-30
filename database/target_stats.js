import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initTargetStatsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS targetStats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                weight INTEGER,
                neck INTEGER ,
                should INTEGER,
                chest INTEGER,
                arm INTEGER,
                forarm INTEGER,
                torso INTEGER,
                hHips INTEGER,
                hips INTEGER,
                thigh INTEGER,
                calves INTEGER,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('TargetStats table created successfully');
          },
          (_, error) => {
            //console.error('Error creating TargetStats table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
 
  export function insertOrUpdateTargetStats(userTargetStats) {
    const promise = new Promise((resolve, reject) => {
      const currentDate = new Date(); // Get the current date
        const inputDate = new Date(userTargetStats.date); // Convert the input date

        // Check if the input date is in the future
        if (inputDate < currentDate) {
            return reject(new Error("You_can_t_select_date_in_the_Past"));
        }
      database.transaction((tx) => {
        // Check if a row already exists for the user (regardless of date)
        tx.executeSql(
          `
          SELECT * FROM targetStats WHERE userId = ?
        `,
          [userTargetStats.user_id],
          (_, result) => {
            if (result.rows.length > 0) {
              // User already has a row, update the existing row
              tx.executeSql(
                `
                UPDATE targetStats 
                SET date=?, weight=?, neck=?, should=?, chest=?, arm=?, forarm=?, torso=?, hHips=?, hips=?, thigh=?, calves=?, isSync=?
                WHERE userId=?
              `,
                [
                  userTargetStats.date,
                  userTargetStats.weight,
                  userTargetStats.neck,
                  userTargetStats.shoulder,
                  userTargetStats.chest,
                  userTargetStats.arm,
                  userTargetStats.forearm,
                  userTargetStats.torso,
                  userTargetStats.h_hips,
                  userTargetStats.hips,
                  userTargetStats.thigh,
                  userTargetStats.calves,
                  'no',
                  userTargetStats.user_id,
                ],
                (_, result) => {
                  //console.log('Succeeded to update user TargetStats', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user TargetStats', error);
                  reject(error);
                }
              );
            } else {
              // User doesn't have a row, proceed to insert a new row
              tx.executeSql(
                `
                INSERT INTO targetStats (userId, date, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, isSync)
                VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?)
              `,
                [
                  userTargetStats.user_id,
                  userTargetStats.date,
                  userTargetStats.weight,
                  userTargetStats.neck,
                  userTargetStats.shoulder,
                  userTargetStats.chest,
                  userTargetStats.arm,
                  userTargetStats.forearm,
                  userTargetStats.torso,
                  userTargetStats.h_hips,
                  userTargetStats.hips,
                  userTargetStats.thigh,
                  userTargetStats.calves,
                  userTargetStats.is_sync,
                ],
                (_, result) => {
                  //console.log('Succeeded to add user TargetStats', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user TargetStats', error);
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
   



  export function fetchTargetStats(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM targetStats WHERE userId = ?',
          [userId],
          (_, results) => {
            const targetStats = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              targetStats.push(rows.item(index));
            }
  
            resolve(targetStats);
          },
          (_, error) => {
            //console.log("Failed to get TargetStats from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  

  export function getOneTartgetStatsRow(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM targetStats WHERE userId = ?',
          [id],
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
  export function getTargetStatsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM targetStats WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced TargetStats rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateTargetStatsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE targetStats SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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



export function deleteTargetStatsRow(userId, id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM targetStats WHERE userId = ? AND id = ?',
        [userId, id],
        (_, result) => {
          //console.log('Successfully deleted user:', result);
        },
        (_, error) => {
          //console.log('Failed to delete user:', error);
        }
      );
    });
  });

  return promise;
}

 
export function fetchTargetStatsLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM targetStats WHERE userId = ? ORDER BY date DESC LIMIT 1',
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

  
  export function clearTargetStatsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM targetStats',
          [],
          (_, result) => {
            //console.log('Cleared TargetStats table');
          },
          (_, error) => {
            //console.log('Failed to clear TargetStats table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteTargetStatsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS targetStats
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete TargetStats table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete TargetStats table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  