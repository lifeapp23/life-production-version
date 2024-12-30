import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initBodyStatsAndMeasurementsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS bodyStatsAndMeasurements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                height INTEGER,
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
                images TEXT,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('BodyStatsAndMeasurements table created successfully');
          },
          (_, error) => {
            //console.error('Error creating BodyStatsAndMeasurements table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertBodyStatsAndMeasurements(userBSAndMeasurements) {
    const promise = new Promise((resolve, reject) => {
      const currentDate = new Date(); // Get the current date
        const inputDate = new Date(userBSAndMeasurements.date); // Convert the input date

        // Check if the input date is in the future
        if (inputDate > currentDate) {
            return reject(new Error("You_can_t_select_date_in_the_Future"));
        }
      database.transaction((tx) => {
        // Check if data already exists for the user on the specified date
        tx.executeSql(
          `
          SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? AND date = ?
        `,
          [userBSAndMeasurements.user_id, userBSAndMeasurements.date],
          (_, result) => {
            if (result.rows.length > 0) {
              // reject(new Error("You_Can_t_insert_data_for_the_same_date_twice"));
              // Data already exists, update the existing record
              tx.executeSql(
                `
                UPDATE bodyStatsAndMeasurements 
                SET height = ?, weight = ?, neck = ?, should = ?, chest = ?, arm = ?, forarm = ?, torso = ?, hHips = ?, hips = ?, thigh = ?, calves = ?, images = ?, isSync = ? 
                WHERE userId = ? AND date = ?
              `,
                [
                  userBSAndMeasurements.height,
                  userBSAndMeasurements.weight,
                  userBSAndMeasurements.neck,
                  userBSAndMeasurements.shoulder,
                  userBSAndMeasurements.chest,
                  userBSAndMeasurements.arm,
                  userBSAndMeasurements.forearm,
                  userBSAndMeasurements.torso,
                  userBSAndMeasurements.h_hips,
                  userBSAndMeasurements.hips,
                  userBSAndMeasurements.thigh,
                  userBSAndMeasurements.calves,
                  userBSAndMeasurements.images,
                  userBSAndMeasurements.is_sync,
                  userBSAndMeasurements.user_id,
                  userBSAndMeasurements.date
                ],
                (_, result) => {
                  //console.log('Succeeded to update user BSAndMeasurements', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user BSAndMeasurements', error);
                  reject(error);
                }
              );
            } else {
              // User hasn't inserted data for the same date, proceed to insert
              tx.executeSql(
                `
                INSERT INTO bodyStatsAndMeasurements (userId, date, height, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, images, isSync)
                VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?)
              `,
                [
                  userBSAndMeasurements.user_id,
                  userBSAndMeasurements.date,
                  userBSAndMeasurements.height,
                  userBSAndMeasurements.weight,
                  userBSAndMeasurements.neck,
                  userBSAndMeasurements.shoulder,
                  userBSAndMeasurements.chest,
                  userBSAndMeasurements.arm,
                  userBSAndMeasurements.forearm,
                  userBSAndMeasurements.torso,
                  userBSAndMeasurements.h_hips,
                  userBSAndMeasurements.hips,
                  userBSAndMeasurements.thigh,
                  userBSAndMeasurements.calves,
                  userBSAndMeasurements.images,
                  userBSAndMeasurements.is_sync,
                ],
                (_, result) => {
                  //console.log('Succeeded to add user BSAndMeasurements', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user BSAndMeasurements', error);
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
  }
  



  export function fetchBodyStatsAndMeasurements(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ?',
          [userId],
          (_, results) => {
            const bodyStatsAndMeasurements = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              bodyStatsAndMeasurements.push(rows.item(index));
            }
  
            resolve(bodyStatsAndMeasurements);
          },
          (_, error) => {
            //console.log("Failed to get BodyStatsAndMeasurements from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  }
  
  

  export function getStatsAndMeasurementsOneRow(id,userId ) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM bodyStatsAndMeasurements WHERE id = ? AND userId = ?',
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
  export function getBodyStatsAndMeasurementsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM bodyStatsAndMeasurements WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced BodyStatsAndMeasurements rows');
            reject(error);
          }
        );
      });
    });
  };

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateStatsAndMeasurementsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      const query = `UPDATE bodyStatsAndMeasurements SET isSync = 'yes'  WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`;

      tx.executeSql(
        query,
        [userId],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to update the database:', error);
          //reject(error);
        }
      );
    });
  });
}



  export function deleteStatsAndMeasurementsUser(id,userId){
    const promise = new Promise((resolve, reject)=>{
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM bodyStatsAndMeasurements where id = ? AND userId = ?',
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
  export function fetchbodyStatsAndMeasurementsDateTheSameDateInCalculator(userId, date) {
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            // Check if date is provided
            if (date) {
                // First query: Check for a row matching both userId and date
                tx.executeSql(
                    'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? AND date = ?',
                    [userId, date],
                    (_, results) => {
                        if (results.rows.length > 0) {
                            // If data is found, return the first result
                            resolve(results.rows.item(0));
                        } else {
                            // No data for the given date, so fetch the last inserted row for the userId
                            tx.executeSql(
                                'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? ORDER BY date DESC LIMIT 1',
                                [userId],
                                (__, lastResults) => {
                                    resolve(lastResults.rows.length > 0 ? lastResults.rows.item(0) : null);
                                },
                                (__, error) => {
                                    console.error("Failed to fetch last inserted row:", error);
                                    reject(error);
                                }
                            );
                        }
                    },
                    (_, error) => {
                        console.error("Failed to fetch row by userId and date:", error);
                        reject(error);
                    }
                );
            } else {
                // If no date is provided, directly fetch the last inserted row for the userId
                tx.executeSql(
                    'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? ORDER BY date DESC LIMIT 1',
                    [userId],
                    (_, lastResults) => {
                        resolve(lastResults.rows.length > 0 ? lastResults.rows.item(0) : null);
                    },
                    (_, error) => {
                        console.error("Failed to fetch last inserted row:", error);
                        reject(error);
                    }
                );
            }
        });
    });
}


  export function fetchbodyStatsAndMeasurementsLastInsertedRow(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? ORDER BY date DESC LIMIT 1',
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
  
  
  export function clearBodyStatsAndMeasurementsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM bodyStatsAndMeasurements',
          [],
          (_, result) => {
            //console.log('Cleared BodyStatsAndMeasurements table');
          },
          (_, error) => {
            //console.log('Failed to clear BodyStatsAndMeasurements table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteBodyStatsAndMeasurementsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS bodyStatsAndMeasurements
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete bodyStatsAndMeasurements table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete bodyStatsAndMeasurements table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  