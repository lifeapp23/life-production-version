import * as SQLite from 'expo-sqlite'


const database = SQLite.openDatabase('health.db');

export function initUsersTable() {

    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER,
                fName TEXT,
                lName TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                gender TEXT,
                bdate TEXT,
                country TEXT,
                role TEXT,
                isAppro TEXT,
                created_at TEXT
              )`,
          [],
          () => {
            //console.log('Users table created successfully');
          },
          (_, error) => {
            //console.error('Error creating users table:', error);
          }
        );
      });
    });
  
    return promise;
  };

  export function insertUser(userData) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        // Check if the user with the given email already exists
        tx.executeSql(
          'SELECT * FROM users WHERE email = ?',
          [userData.email],
          (_, results) => {
            if (results.rows.length === 0) {
              // User with the email doesn't exist, proceed with the INSERT
              tx.executeSql(
                `
                INSERT INTO users (id,fName,lName,email,phone,gender,bdate,country,role,isAppro,created_at)
                VALUES (?, ?, ?,?,?,?,?,?,?,?,?)
              `,
                [
                  userData.id,
                  userData.fName,
                  userData.lName,
                  userData.email,
                  userData.phone,
                  userData.gender,
                  userData.bdate,
                  userData.country,
                  userData.role,
                  userData.isAppro,
                  userData.created_at,
                ],
                (_, result) => {
                  //console.log('Succeeded to add user', result);
                  resolve(result);
                },
                (_, error) => {
                  //console.log('Failed to add user', error);
                }
              );
            } else {
              // User with the same email already exists, resolve the promise without doing anything
              resolve();
            }
          },
          (_, error) => {
            //console.log('Error checking user existence', error);
          }
        );
      });
    });
  
    return promise;
  };
  


  export function fetchUsers() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users',
          [],
          (_, results) => {
            const users = [];
            const rows = results.rows; // Access the rows property
  
            for (let index = 0; index < rows.length; index++) {
              users.push(rows.item(index));
            }
  
            resolve(users);
          },
          (_, error) => {
            //console.log("Failed to get Users from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };
  

  export function getOneUser(id) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE id = ?',
          [id],
          (_, results) => {
            const rows = results.rows;
  
            if (rows && rows.length > 0) {
              resolve(rows.item(0));
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            //console.log("Failed to get one user details from database: ", error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  }
  

  export function updateUser(updatedUser) {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
            `
            UPDATE users
            SET id= ?, fName = ?, lName = ?, email = ?, phone = ?, gender = ?, bdate = ?, country = ?, role = ?, isAppro = ?,created_at =? 
          `,
          [
        updatedUser.id,
        updatedUser.fName,
        updatedUser.lName,
        updatedUser.email,
        updatedUser.phone,
        updatedUser.gender,
        updatedUser.bdate,
        updatedUser.country,
        updatedUser.role,
        updatedUser.isAppro,
        updatedUser.created_at,
          ],
          (_, result) => {
            //console.log("successed to update user:",result);
          },
          (_, error) => {
            //console.log("Failed to update user:",error);
          }
        );
      });
    });
  
    return promise;
  };

  export function deleteUser(id){
    const promise = new Promise((resolve, reject)=>{
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM users where id = ?',
                [id],
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
  export function clearUsersTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          'DELETE FROM users',
          [],
          (_, result) => {
            //console.log('Cleared users table');
          },
          (_, error) => {
            //console.log('Failed to clear users table:', error);
          }
        );
      });
    });
  
    return promise;
  };
  
  export function deleteUsersTable() {
    const promise = new Promise((resolve, reject) => {
      database.transaction((tx) => {
        tx.executeSql(
          `
          DROP TABLE IF EXISTS users
        `,
          [],
          (_, result) => {
            //console.log('Succeeded to delete users table', result);
            resolve(result);
          },
          (_, error) => {
            //console.log('Failed to delete users table', error);
            reject(error);
          }
        );
      });
    });
  
    return promise;
  };