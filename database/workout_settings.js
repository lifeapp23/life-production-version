import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initPublicSettingsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS publicSettings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                height INTEGER,
                age INTEGER,
                barBel TEXT,
                dumbel TEXT,
                bands TEXT ,
                FreWit TEXT,
                units TEXT,
                compnd INTEGER,
                isoltn INTEGER,
                cardio INTEGER,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('publicSettings table created successfully');
          },
          (_, error) => {
            //console.error('Error creating publicSettings table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
 
  export function insertOrUpdatePublicSettings(userPublicSettings) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if a row already exists for the user 
        tx.executeSql(
          `
          SELECT * FROM publicSettings WHERE userId = ?
        `,
          [userPublicSettings.user_id],
          (_, result) => {
            if (result.rows.length > 0) {
              // User already has a row, update the existing row
              tx.executeSql(
                `
                UPDATE publicSettings 
                SET height=?, age=?, barBel=?, dumbel=?, bands=?, FreWit=?, units=?, compnd=?, isoltn=?, cardio=?, isSync=?
                WHERE userId=?
              `,
                [
                  userPublicSettings.height,
                  userPublicSettings.age,
                  userPublicSettings.barBel,
                  userPublicSettings.dumbel,
                  userPublicSettings.bands,
                  userPublicSettings.FreWit,
                  userPublicSettings.units,
                  userPublicSettings.compnd,
                  userPublicSettings.isoltn,
                  userPublicSettings.cardio,
                  'no',
                  userPublicSettings.user_id,
                ],
                (_, result) => {
                  //console.log('Succeeded to update user PublicSettings', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user PublicSettings', error);
                  reject(error);
                }
              );
            } else {
              // User doesn't have a row, proceed to insert a new row
              tx.executeSql(
                `
                INSERT INTO publicSettings (userId, height,age,barBel,dumbel,bands,FreWit,units,compnd,isoltn,cardio, isSync)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
              `,
                [
                  userPublicSettings.user_id,
                  userPublicSettings.height,
                  userPublicSettings.age,
                  userPublicSettings.barBel,
                  userPublicSettings.dumbel,
                  userPublicSettings.bands,
                  userPublicSettings.FreWit,
                  userPublicSettings.units,
                  userPublicSettings.compnd,
                  userPublicSettings.isoltn,
                  userPublicSettings.cardio,
                  userPublicSettings.is_sync,
                ],
                (_, result) => {
                  //console.log('Succeeded to add user PublicSettings', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user PublicSettings', error);
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
   



  export function fetchPublicSettings(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicSettings WHERE userId = ?',
          [userId],
          (_, results) => {
            const publicSettings = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              publicSettings.push(rows.item(index));
            }
            
            resolve(publicSettings);
          },
          (_, error) => {
            //console.log("Failed to get PublicSettings from database: ", error);
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
          'SELECT * FROM publicSettings WHERE userId = ?',
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
  export function getPublicSettingsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM publicSettings WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced PublicSettings rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updatePublicSettingsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE publicSettings SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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



export function deletePublicSettingsRow(userId, id) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM publicSettings WHERE userId = ? AND id = ?',
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

 
export function fetchPublicSettingsLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM publicSettings WHERE userId = ?',
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

  
  export function clearPublicSettingsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM publicSettings',
          [],
          (_, result) => {
            //console.log('Cleared PublicSettings table');
          },
          (_, error) => {
            //console.log('Failed to clear PublicSettings table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deletePublicSettingsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS publicSettings
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete PublicSettings table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete PublicSettings table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  