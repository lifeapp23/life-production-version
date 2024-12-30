import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initCalculatorsTableTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS calculatorsTable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                calNam TEXT,
                methds TEXT,
                sFMthd TEXT,
                age INTEGER,
                height INTEGER,
                weight INTEGER,
                neck INTEGER,
                torso INTEGER,
                hips INTEGER,
                chest INTEGER,
                sprlic INTEGER,
                tricep INTEGER,
                thigh INTEGER,
                abdmen INTEGER,
                axilla INTEGER,
                subcpl INTEGER,
                workot TEXT,
                target TEXT,
                ditTyp TEXT,
                result INTEGER,
                bFPctg INTEGER,
                bFMass INTEGER,
                lBMass INTEGER,
                calris INTEGER,
                protin INTEGER,
                fats INTEGER,
                carbs INTEGER,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('CalculatorsTable table created successfully');
          },
          (_, error) => {
            //console.error('Error creating CalculatorsTable table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertCalculatorsTable(userCalculators) {
    const promise = new Promise((resolve, reject) => {
      const currentDate = new Date(); // Get the current date
        const inputDate = new Date(userCalculators.date); // Convert the input date

        // Check if the input date is in the future
        if (inputDate > currentDate) {
            return reject(new Error("You_can_t_select_date_in_the_Future"));
        }
      database.transaction((tx) => {
        // Check if data already exists for the user on the specified date
        tx.executeSql(
          `
          SELECT * FROM calculatorsTable WHERE userId = ? AND calNam = ? AND date = ?
        `,
          [userCalculators.userId, userCalculators.calNam, userCalculators.date],
          (_, result) => {
            if (result.rows.length > 0) {
              // User has already inserted data for the same date, reject the promise
              // reject(new Error("You_Can_t_insert_data_for_the_same_date_twice"));
              // User has already inserted data for the same date, update the existing row
              tx.executeSql(
                `
                UPDATE calculatorsTable
                SET calNam = ?, methds = ?, sFMthd = ?, age = ?, height = ?, weight = ?, neck = ?, torso = ?, hips = ?, chest = ?, sprlic = ?, tricep = ?, thigh = ?, abdmen = ?, axilla = ?, subcpl = ?, workot = ?, target = ?, ditTyp = ?, result = ?, bFPctg = ?, bFMass = ?, lBMass = ?, calris = ?, protin = ?, fats = ?, carbs = ?, isSync = ?
                WHERE userId = ? AND date = ?
                `,
                [
                  userCalculators.calNam,
                  userCalculators.methds,
                  userCalculators.sFMthd,
                  userCalculators.age,
                  userCalculators.height,
                  userCalculators.weight,
                  userCalculators.neck,
                  userCalculators.torso,
                  userCalculators.hips,
                  userCalculators.chest,
                  userCalculators.sprlic,
                  userCalculators.tricep,
                  userCalculators.thigh,
                  userCalculators.abdmen,
                  userCalculators.axilla,
                  userCalculators.subcpl,
                  userCalculators.workot,
                  userCalculators.target,
                  userCalculators.ditTyp,
                  userCalculators.result,
                  userCalculators.bFPctg,
                  userCalculators.bFMass,
                  userCalculators.lBMass,
                  userCalculators.calris,
                  userCalculators.protin,
                  userCalculators.fats,
                  userCalculators.carbs,
                  userCalculators.isSync,
                  userCalculators.userId,
                  userCalculators.date
                ],
                (_, result) => {
                  //console.log('Succeeded to update user CalculatorMeasurements', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user CalculatorMeasurements', error);
                  reject(error);
                }
              );

            } else {
              // User hasn't inserted data for the same date, proceed to insert
              tx.executeSql(
                `
                INSERT INTO calculatorsTable (userId,date,calNam,methds,sFMthd,age,height,weight,neck,torso,hips,chest,sprlic,tricep,thigh,abdmen,axilla,subcpl,workot,target,ditTyp,result,bFPctg,bFMass,lBMass,calris,protin,fats,carbs,isSync)
                VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?)
              `,
                [
                  userCalculators.userId,
                  userCalculators.date,
                  userCalculators.calNam,
                  userCalculators.methds,
                  userCalculators.sFMthd,
                  userCalculators.age,
                  userCalculators.height,
                  userCalculators.weight,
                  userCalculators.neck,
                  userCalculators.torso,
                  userCalculators.hips,
                  userCalculators.chest,
                  userCalculators.sprlic,
                  userCalculators.tricep,
                  userCalculators.thigh,
                  userCalculators.abdmen,
                  userCalculators.axilla,
                  userCalculators.subcpl,
                  userCalculators.workot,
                  userCalculators.target,
                  userCalculators.ditTyp,
                  userCalculators.result,
                  userCalculators.bFPctg,
                  userCalculators.bFMass,
                  userCalculators.lBMass,
                  userCalculators.calris,
                  userCalculators.protin,
                  userCalculators.fats,
                  userCalculators.carbs,
                  userCalculators.isSync
                ],
                (_, result) => {
                  //console.log('Succeeded to add user CalculatorMeasurements', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user CalculatorMeasurements', error);
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
  



  export function fetchCalculatorsTable(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM calculatorsTable WHERE userId = ?',
          [userId],
          (_, results) => {
            const calculatorsTable = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              calculatorsTable.push(rows.item(index));
            }
  
            resolve(calculatorsTable);
          },
          (_, error) => {
            //console.log("Failed to get CalculatorsTable from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  }
  export function fetchCalculatorsTableCalNam(userId,calNam) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM calculatorsTable WHERE userId = ? AND calNam = ?',
          [userId,calNam],
          (_, results) => {
            const calculatorsTable = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              calculatorsTable.push(rows.item(index));
            }
  
            resolve(calculatorsTable);
          },
          (_, error) => {
            //console.log("Failed to get CalculatorsTable from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  }
  

  export function getCalculatorsOneRow(id,userId,calName ) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM calculatorsTable WHERE id = ? AND userId = ? AND calNam = ?',
          [id,userId],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one CalculatorMeasurement details from database: ",error);
        }
        );
      });
    });
  
    return promise;
  };

  // Function to get unsynced rows from SQLite
  export function getCalculatorsTableUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM calculatorsTable WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced CalculatorsTable rows');
            reject(error);
          }
        );
      });
    });
  };

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateCalculatorsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      const query = `UPDATE calculatorsTable SET isSync = 'yes'  WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`;
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



  export function deleteCalculatorsUser(id,userId,calNam){
    const promise = new Promise((resolve, reject)=>{
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM calculatorsTable where id = ? AND userId = ? AND calNam = ?',
                [id,userId,calNam],
                (_, result) => {
                    //console.log("successed to delete CalculatorMeasurement:",result);
                  },
                  (_, error) => {
                    //console.log("Failed to delete CalculatorMeasurement:",error);
                  }
            )
        })
    })

    return promise
  };
 
  export function fetchCalculatorsTableLastInsertedRow(userId,calNam) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM calculatorsTable WHERE userId = ? AND calNam = ? ORDER BY date DESC LIMIT 1',
          [userId,calNam],
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
  
  
  export function clearCalculatorsTableTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM calculatorsTable',
          [],
          (_, result) => {
            //console.log('Cleared CalculatorsTable table');
          },
          (_, error) => {
            //console.log('Failed to clear CalculatorsTable table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteCalculatorsTableTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS calculatorsTable
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete CalculatorsTable table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete CalculatorsTable table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  