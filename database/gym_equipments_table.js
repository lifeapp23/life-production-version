import * as SQLite from 'expo-sqlite'
import "../src/features/account/screens/i18n";
import i18n from 'i18next'; // Import the i18next instance
  import { Alert } from 'react-native';


const database = SQLite.openDatabase('health.db');

export function initGymEquipmentsTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS gymEquipments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                speKey TEXT,
                GymName TEXT,
                DumbBells TEXT,
                KettleBells TEXT,
                EBarBell TEXT,
                EZBar TEXT,
                TrapsBar TEXT,
                ResistanceBand TEXT,
                SandBag TEXT,
                WeightedBelts TEXT,
                AbWheel TEXT,
                Sled TEXT,
                ExerciesBall TEXT,
                Bosuball TEXT,
                JumpingRope TEXT,
                BattleRope TEXT,
                Rings TEXT,
                RopeClimbing TEXT,
                JumpBox TEXT,
                Parallettes TEXT,
                Tires TEXT,
                AdjBench TEXT,
                FlatBench TEXT,
                DeclineBench TEXT,
                BenchPressRack TEXT,
                IncBenchPres TEXT,
                DeclineBenchR TEXT,
                SquatRack TEXT,
                PreacherBen TEXT,
                SwimmingPool TEXT,
                Squash TEXT,
                Tennis TEXT,
                RunningTrack TEXT,
                PingPong TEXT,
                MaritalArts TEXT,
                Elliptical TEXT,
                TreadMil TEXT,
                ExerciseBike TEXT,
                RowingMach TEXT,
                AssaultAirBike TEXT,
                AssaultRunner TEXT,
                StairMaster TEXT,
                Butterfly TEXT,
                ReverseButterfly TEXT,
                LegExtension TEXT,
                LegCurl TEXT,
                LegPress TEXT,
                ChestPress TEXT,
                SmithMachine TEXT,
                LatPulldowns TEXT,
                CrossOverMac TEXT,
                CableMachine TEXT,
                BicepMachine TEXT,
                TircepMachine TEXT,
                CalvesMachine TEXT,
                AbsMachine TEXT,
                deleted TEXT,
                isSync TEXT
              )`,
          [],
          () => {
            //console.log('gymEquipments table created successfully');
          },
          (_, error) => {
            //console.error('Error creating gymEquipments table:', error);
          }
        );
      });
    });
  
    return promise;
  };
              
 
  export function insertGymEquipments(userGymEquipments) {
    const promise = new Promise((resolve, reject) => {
      const t = i18n.t.bind(i18n); // Get translation function

      database.transaction((tx) => {
        // Check if data already exists for the user on the specified date
        
        
        tx.executeSql(
          `
          SELECT * FROM gymEquipments WHERE userId = ? AND GymName = ?
          `,
          [userGymEquipments.userId, userGymEquipments.GymName],
          (_, result) => {
            if (result.rows.length > 0) {
              // Gym already exists for this user, reject the promise
              Alert.alert(`${t(' ')}`,`${t('Gym_already_exists')}`);

            } else {
  
              tx.executeSql(
                `
                INSERT INTO gymEquipments ( 
                      userId,
                      speKey,
                      GymName,
                      DumbBells,
                      KettleBells,
                      EBarBell,
                      EZBar,
                      TrapsBar,
                      ResistanceBand,
                      SandBag,
                      WeightedBelts,
                      AbWheel,
                      Sled,
                      ExerciesBall,
                      Bosuball,
                      JumpingRope,
                      BattleRope,
                      Rings,
                      RopeClimbing,
                      JumpBox,
                      Parallettes,
                      Tires,
                      AdjBench,
                      FlatBench,
                      DeclineBench,
                      BenchPressRack,
                      IncBenchPres,
                      DeclineBenchR,
                      SquatRack,
                      PreacherBen,
                      SwimmingPool,
                      Squash,
                      Tennis,
                      RunningTrack,
                      PingPong,
                      MaritalArts,
                      Elliptical,
                      TreadMil,
                      ExerciseBike,
                      RowingMach,
                      AssaultAirBike,
                      AssaultRunner,
                      StairMaster,
                      Butterfly,
                      ReverseButterfly,
                      LegExtension,
                      LegCurl,
                      LegPress,
                      ChestPress,
                      SmithMachine,
                      LatPulldowns,
                      CrossOverMac,
                      CableMachine,
                      BicepMachine,
                      TircepMachine,
                      CalvesMachine,
                      AbsMachine,
                      deleted,
                      isSync)
                VALUES (
                  ?, ?, ?, ?,?,
                  ?,?,?,?,?,
                  ?,?,?,?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?, ?, ?, ?,?,
                  ?,?,?,?)
              `,
                [
                  userGymEquipments.userId,
                  userGymEquipments.speKey,
                  userGymEquipments.GymName,
                  userGymEquipments.DumbBells,
                  userGymEquipments.KettleBells,
                  userGymEquipments.EBarBell,
                  userGymEquipments.EZBar,
                  userGymEquipments.TrapsBar,
                  userGymEquipments.ResistanceBand,
                  userGymEquipments.SandBag,
                  userGymEquipments.WeightedBelts,
                  userGymEquipments.AbWheel,
                  userGymEquipments.Sled,
                  userGymEquipments.ExerciesBall,
                  userGymEquipments.Bosuball,
                  userGymEquipments.JumpingRope,
                  userGymEquipments.BattleRope,
                  userGymEquipments.Rings,
                  userGymEquipments.RopeClimbing,
                  userGymEquipments.JumpBox,
                  userGymEquipments.Parallettes,
                  userGymEquipments.Tires,
                  userGymEquipments.AdjBench,
                  userGymEquipments.FlatBench,
                  userGymEquipments.DeclineBench,
                  userGymEquipments.BenchPressRack,
                  userGymEquipments.IncBenchPres,
                  userGymEquipments.DeclineBenchR,
                  userGymEquipments.SquatRack,
                  userGymEquipments.PreacherBen,
                  userGymEquipments.SwimmingPool,
                  userGymEquipments.Squash,
                  userGymEquipments.Tennis,
                  userGymEquipments.RunningTrack,
                  userGymEquipments.PingPong,
                  userGymEquipments.MaritalArts,
                  userGymEquipments.Elliptical,
                  userGymEquipments.TreadMil,
                  userGymEquipments.ExerciseBike,
                  userGymEquipments.RowingMach,
                  userGymEquipments.AssaultAirBike,
                  userGymEquipments.AssaultRunner,
                  userGymEquipments.StairMaster,
                  userGymEquipments.Butterfly,
                  userGymEquipments.ReverseButterfly,
                  userGymEquipments.LegExtension,
                  userGymEquipments.LegCurl,
                  userGymEquipments.LegPress,
                  userGymEquipments.ChestPress,
                  userGymEquipments.SmithMachine,
                  userGymEquipments.LatPulldowns,
                  userGymEquipments.CrossOverMac,
                  userGymEquipments.CableMachine,
                  userGymEquipments.BicepMachine,
                  userGymEquipments.TircepMachine,
                  userGymEquipments.CalvesMachine,
                  userGymEquipments.AbsMachine,
                  userGymEquipments.deleted,
                  userGymEquipments.isSync
                ],
                (_, result) => {
                  //console.log('Succeeded to add user New Gym', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user  New Gym', error);
                  reject(error);
                }
              );
            
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
  export function UpdateGymEquipments(userGymEquipments) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if a row already exists for the user (regardless of date)
        tx.executeSql(
          `
          SELECT * FROM gymEquipments WHERE id = ? AND userId = ? AND GymName = ?
        `,
          [userGymEquipments.id,userGymEquipments.userId,userGymEquipments.GymName],
          (_, result) => {
            if (result.rows.length > 0) {
              // User already has a row, update the existing row
              tx.executeSql(
                `
                UPDATE gymEquipments 
                SET 
                GymName=?,
                DumbBells=?,
                KettleBells=?,
                EBarBell=?,
                EZBar=?,
                TrapsBar=?,
                ResistanceBand=?,
                SandBag=?,
                WeightedBelts=?,
                AbWheel=?,
                Sled=?,
                ExerciesBall=?,
                Bosuball=?,
                JumpingRope=?,
                BattleRope=?,
                Rings=?,
                RopeClimbing=?,
                JumpBox=?,
                Parallettes=?,
                Tires=?,
                AdjBench=?,
                FlatBench=?,
                DeclineBench=?,
                BenchPressRack=?,
                IncBenchPres=?,
                DeclineBenchR=?,
                SquatRack=?,
                PreacherBen=?,
                SwimmingPool=?,
                Squash=?,
                Tennis=?,
                RunningTrack=?,
                PingPong=?,
                MaritalArts=?,
                Elliptical=?,
                TreadMil=?,
                ExerciseBike=?,
                RowingMach=?,
                AssaultAirBike=?,
                AssaultRunner=?,
                StairMaster=?,
                Butterfly=?,
                ReverseButterfly=?,
                LegExtension=?,
                LegCurl=?,
                LegPress=?,
                ChestPress=?,
                SmithMachine=?,
                LatPulldowns=?,
                CrossOverMac=?,
                CableMachine=?,
                BicepMachine=?,
                TircepMachine=?,
                CalvesMachine=?,
                AbsMachine=?,
                deleted=?,
                isSync=?    
                WHERE id=? AND userId=? AND GymName=? AND speKey=?
              `,
                [
            userGymEquipments.GymName,
            userGymEquipments.DumbBells,
            userGymEquipments.KettleBells,
            userGymEquipments.EBarBell,
            userGymEquipments.EZBar,
            userGymEquipments.TrapsBar,
            userGymEquipments.ResistanceBand,
            userGymEquipments.SandBag,
            userGymEquipments.WeightedBelts,
            userGymEquipments.AbWheel,
            userGymEquipments.Sled,
            userGymEquipments.ExerciesBall,
            userGymEquipments.Bosuball,
            userGymEquipments.JumpingRope,
            userGymEquipments.BattleRope,
            userGymEquipments.Rings,
            userGymEquipments.RopeClimbing,
            userGymEquipments.JumpBox,
            userGymEquipments.Parallettes,
            userGymEquipments.Tires,
            userGymEquipments.AdjBench,
            userGymEquipments.FlatBench,
            userGymEquipments.DeclineBench,
            userGymEquipments.BenchPressRack,
            userGymEquipments.IncBenchPres,
            userGymEquipments.DeclineBenchR,
            userGymEquipments.SquatRack,
            userGymEquipments.PreacherBen,
            userGymEquipments.SwimmingPool,
            userGymEquipments.Squash,
            userGymEquipments.Tennis,
            userGymEquipments.RunningTrack,
            userGymEquipments.PingPong,
            userGymEquipments.MaritalArts,
            userGymEquipments.Elliptical,
            userGymEquipments.TreadMil,
            userGymEquipments.ExerciseBike,
            userGymEquipments.RowingMach,
            userGymEquipments.AssaultAirBike,
            userGymEquipments.AssaultRunner,
            userGymEquipments.StairMaster,
            userGymEquipments.Butterfly,
            userGymEquipments.ReverseButterfly,
            userGymEquipments.LegExtension,
            userGymEquipments.LegCurl,
            userGymEquipments.LegPress,
            userGymEquipments.ChestPress,
            userGymEquipments.SmithMachine,
            userGymEquipments.LatPulldowns,
            userGymEquipments.CrossOverMac,
            userGymEquipments.CableMachine,
            userGymEquipments.BicepMachine,
            userGymEquipments.TircepMachine,
            userGymEquipments.CalvesMachine,
            userGymEquipments.AbsMachine,
            userGymEquipments.deleted,
            userGymEquipments.isSync,
            userGymEquipments.id,
            userGymEquipments.userId,
            userGymEquipments.GymName,
            userGymEquipments.speKey
                ],
                (_, result) => {
                  //console.log('Succeeded to update user gymEquipments', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to update user gymEquipments', error);
                  reject(error);
                }
              );
            }
          },
          (_, error) => {
            //console.log('Error checking for existing user GymEquipments', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
   



  export function fetchGymEquipments(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gymEquipments WHERE userId = ?',
          [userId],
          (_, results) => {
            const gymEquipments = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              gymEquipments.push(rows.item(index));
            }
  
            resolve(gymEquipments);
          },
          (_, error) => {
            //console.log("Failed to get gymEquipments from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  export function fetchGymEquipmentsWithoutDeleting(userId) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gymEquipments WHERE userId = ? AND deleted=?',
          [userId,'no'],
          (_, results) => {
            const gymEquipments = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              gymEquipments.push(rows.item(index));
            }
  
            resolve(gymEquipments);
          },
          (_, error) => {
            //console.log("Failed to get gymEquipments from database ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  

  export function getOneGymEquipmentsRow(id,userId,GymName,speKey) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gymEquipments WHERE id = ? AND userId = ? AND GymName = ? AND speKey=?',
          [id,userId,GymName,speKey],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one user details from database ",error);
        }
        );
      });
    });
  
    return promise;
  };

  // Function to get unsynced rows from SQLite
  export function getGymEquipmentsUnsyncedRows(userId) {
    return new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM gymEquipments WHERE isSync = ? AND userId = ?',
          ['no', userId],
          (_, { rows }) => {
            const unsyncedRows = [];
            for (let i = 0; i < rows.length; i++) {
              unsyncedRows.push(rows.item(i));
            }
            resolve(unsyncedRows);
          },
          (_, error) => {
            //console.log('Failed to get unsynced gymEquipments rows');
            reject(error);
          }
        );
      });
    });
  };
  

// Function to update rows to synced in SQLite
// Function to update rows to synced in SQLite
export function updateGymEquipmentsRowsToSynced(unsyncedRowIds, userId) {
  return new Promise((resolve, reject) => {
      database.transaction((tx) => {
          tx.executeSql(
              `UPDATE gymEquipments SET isSync = 'yes' WHERE id IN (${unsyncedRowIds.join(',')}) AND userId = ?`,
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

export function SoftDeleteGymEquipments(id, userId, GymName,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM gymEquipments WHERE id = ? AND userId = ? AND GymName = ? AND speKey =?
      `,
        [id, userId, GymName,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE gymEquipments 
              SET 
                deleted = 'yes',
                isSync='no' 
              WHERE id=? AND userId=? AND GymName=? AND speKey=?
            `,
              [id, userId, GymName,speKey],
              (_, result) => {
                //console.log('Succeeded to soft delete user gymEquipments', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to soft delete user gymEquipments', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Gym equipment row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user GymEquipments', error);
        }
      );
    });
  });

  return promise;
}
export function updateGymEquipmentsName(id, userId, GymName,speKey) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Check if a row already exists for the user (regardless of date)
      tx.executeSql(
        `
        SELECT * FROM gymEquipments WHERE id = ? AND userId = ? AND speKey =?
      `,
        [id, userId,speKey],
        (_, result) => {
          if (result.rows.length > 0) {
            // Row exists, soft delete it
            tx.executeSql(
              `
              UPDATE gymEquipments 
              SET 
                GymName=?,
                isSync='no' 
              WHERE id=? AND userId=? AND speKey=?
            `,
              [GymName,id, userId,speKey],
              (_, result) => {
                //console.log('Succeeded to update user gymEquipments name', result);
                resolve(result);
              },
              (_, error) => {
                //console.log('Failed to update user gymEquipments name', error);
              }
            );
          } else {
            // Row doesn't exist, handle accordingly (e.g., reject with an error)
            const error = new Error('Gym equipments row not found');
          }
        },
        (_, error) => {
          //console.log('Error checking for existing user GymEquipments', error);
        }
      );
    });
  });

  return promise;
}

export function deleteGymEquipmentsRowsWithYes(rowsToDelete) {
  const userIdsToDelete = rowsToDelete.map((row) => row.userId);

  return new Promise((resolve, reject) => {
    database.transaction((tx) => {
      // Create a comma-separated string of user IDs for the SQL query
      const userIdsString = userIdsToDelete.map((userId) => `'${userId}'`).join(',');

      tx.executeSql(
        `DELETE FROM gymEquipments WHERE userId IN (${userIdsString}) AND deleted = ?`,
        ['yes'],
        (_, result) => {
          //console.log('Successfully deleted gymEquipments rows with yesss:', result);
          resolve(result);
        },
        (_, error) => {
          //console.log('Failed to delete gymEquipments rows:', error);
          reject(error);
        }
      );
    });
  });
}


 
export function fetchGymEquipmentsLastInsertedRow(userId) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM gymEquipments WHERE userId = ?',
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

  
  export function clearGymEquipmentsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM gymEquipments',
          [],
          (_, result) => {
            //console.log('Cleared gymEquipments table');
          },
          (_, error) => {
            //console.log('Failed to clear gymEquipments table:', error);
          }
        );
      });
    });
  
    return promise;
  }
  export function deleteGymEquipmentsTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS gymEquipments
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete gymEquipments table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete gymEquipments table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  