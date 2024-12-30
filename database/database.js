// import {openDatabase} from "react-native-sqlite-storage";
  
//   // Enable promise for SQLite
  
//   export const connectToDatabase =openDatabase({ name: "health.db", location: "default" });
//   export const createTables = async (db) => {
//     const usersTableQuery = `
//       CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY,
//         uName TEXT UNIQUE,
//         fName TEXT,
//         lName TEXT,
//         email TEXT UNIQUE,
//         phone TEXT,
//         gender TEXT,
//         bdate TEXT,
//         country TEXT,
//         role TEXT,
//         isAppro TEXT,
//       )
//     `
    
//     try {
//       await db.executeSql(usersTableQuery)
//     } catch (error) {
//         //console.log(error)
//       //console.log(`Failed to create users tables`)
//     }
//   };
//   export const getTableNames = async (db) => {
//     try {
//       const tableNames = [];
//       const results = await db.executeSql(
//         "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
//       );
  
//       results?.forEach((result) => {
//         for (let index = 0; index < result.rows.length; index++) {
//           tableNames.push(result.rows.item(index).name);
//         }
//       });
  
//       return tableNames;
//     } catch (error) {
//         //console.log(error);
//       //console.log("Failed to get table names from database");
//     }
//   };
  
  
  
//   export const removeTable = async (db, tableName) => {
//     const query = `DROP TABLE IF EXISTS ${tableName}`;
//     try {
//       await db.executeSql(query);
//     } catch (error) {
//         //console.log(error);
//         //console.log(`Failed to drop table ${tableName}`);
//     }
//   };
  