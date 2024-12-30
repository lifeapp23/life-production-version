import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabase('health.db');

export function initTokensTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER,
                tokenable_id INTEGER,
                token TEXT,
                created_at TEXT,
                expires_at TEXT
              )`,
          [],
          () => {
            //console.log('Tokens table created successfully');
          },
          (_, error) => {
            //console.error('Error creating created_at table:', error);
          }
        );
      });
    });
  
    return promise;
  };





  export function insertToken(tokenRaw,token) {
     // Example created_at from your token data
     const createdAt = tokenRaw.created_at;

     // Parse the created_at string to a Date object
     const createdAtDate = new Date(createdAt);

     // Add one year to the created_at date
     createdAtDate.setFullYear(createdAtDate.getFullYear() + 1);

     // Format the expiration date as a string
     const formattedExpiration = createdAtDate.toISOString();

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
                `
                INSERT INTO tokens (id,tokenable_id,token,created_at,expires_at)
                VALUES (?,?, ?, ?,?)
              `,
                [
                  tokenRaw.id,
                  parseInt(tokenRaw.tokenable_id, 10),
                  token,
                  tokenRaw.created_at,
                  formattedExpiration
                ],
                (_, result) => {
                  //console.log('Succeeded to add token', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add token', error);
                }
              );
            
      });
    });
  
    return promise;
  };
  


  export function fetchTokens() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM tokens',
          [],
          (_, results) => {
            const tokens = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              tokens.push(rows.item(index));
            }
  
            resolve(tokens);
          },
          (_, error) => {
            //console.log("Failed to get tokens from database: ", error);
          }
        );
      });
    });
  
    return promise;
  };
  

  export function getOneToken(id) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM tokens WHERE id = ?',
          [id],
          (_, results) => {
            if (results[0]?.rows?.length) {
                return results[0].rows.item(0);
            } else {
                return null;
            }
          },
          (_, error) => {
            //console.log("Failed to get one token details from database: ",error);
        }
        );
      });
    });
  
    return promise;
  };

  export function getUserIdFromTokenId(tokenId) {
    //console.log('token table tokenId:', tokenId);
  
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM tokens WHERE id = ?',
          [tokenId],
          (_, results) => {
  
            if (results.rows && results.rows._array.length > 0) {
              const row = results.rows._array[0];  
              const userId = row.tokenable_id;
              resolve(userId);
            } else {
              //console.log("Token not found");
            }
          },
          (_, error) => {
            //console.log("Failed to get user id from token id from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  
  
  

  export function deleteToken(id) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Step 1: Select the row with the given id to get tokenable_id
        tx.executeSql(
          'SELECT * FROM tokens WHERE id = ?',
          [id],
          (_, results) => {
            if (results.rows && results.rows._array.length > 0) {
              const row = results.rows._array[0];  
              const tokenableId = row.tokenable_id;
              // Step 2: Select and delete all rows where tokenable_id is equal to the selected tokenable_id
              tx.executeSql(
                'DELETE FROM tokens WHERE tokenable_id = ?',
                [tokenableId],
                (_, deleteResult) => {
                  //console.log('Rows deleted successfully!');
                  resolve();
                },
                (_, error) => {
                  //console.log('Failed to delete rows:', error);
                }
              );
            } else {
              //console.log('No row found with the given id.');
            }
          },
          (_, error) => {
            //console.log('Failed to select row:', error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function dropTokensTable() { // Ensure that this function is exported
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DROP TABLE IF EXISTS tokens',
          [],
          () => {
            //console.log('Tokens table dropped successfully');
            resolve();
          },
          (_, error) => {
            //console.error('Error dropping tokens table:', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };