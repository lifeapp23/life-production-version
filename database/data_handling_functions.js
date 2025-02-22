import * as SQLite from 'expo-sqlite'
import * as FileSystem from 'expo-file-system';
import React, { useState} from 'react';


const database = SQLite.openDatabase('health.db');

    export const addPlansStartWorkoutRowsToDatabase = (dataArray) => {
        const cleanValue = (value) => (value === null || value === undefined || typeof value === 'object' ? null : value);
        const promises = dataArray.map((rowData) => {
        const { userId,plnKey,dayKey,dayNam,date,wrkKey,wktNam,sets,weight,reps,exrTim,exrTyp,casTim,dayTim,isCmpld,timStd,images, deleted, isSync } = rowData;
       
        console.log('rowData before if resultOFStartWorkouts:', rowData);
        console.log("DEBUG: Data types before insertion:", {
            userId: typeof userId,
            plnKey: typeof plnKey,
            dayKey: typeof dayKey,
            dayNam: typeof dayNam,
            date: typeof date,
            wrkKey: typeof wrkKey,
            wktNam: typeof wktNam,
            sets: typeof sets,
            weight: typeof weight,
            reps: typeof reps,
            exrTim: typeof exrTim,
            exrTyp: typeof exrTyp,
            casTim: typeof casTim,
            dayTim: typeof dayTim,
            isCmpld: typeof isCmpld,
            timStd:typeof timStd,
            images:typeof images,
            deleted :typeof deleted,
            isSync:typeof isSync,
            
        });
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM startWorkoutTable WHERE userId = ? AND plnKey = ? AND dayKey = ? AND wrkKey = ? AND sets = ?',
            [userId,plnKey,dayKey,wrkKey,sets],
                (_, resultOFStartWorkouts) => {
                console.log('before if resultOFStartWorkouts?.rows?._array:', resultOFStartWorkouts?.rows?._array);
                if (resultOFStartWorkouts.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                INSERT INTO startWorkoutTable (userId,plnKey,dayKey,dayNam,date,wrkKey,wktNam,sets,weight,reps,exrTim,exrTyp,casTim,dayTim,isCmpld,timStd,images, deleted, isSync)
                VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?,?,?)
            `,
                [cleanValue(userId),cleanValue(plnKey),cleanValue(dayKey),cleanValue(dayNam),cleanValue(date),cleanValue(wrkKey),cleanValue(wktNam),cleanValue(sets),cleanValue(weight),cleanValue(reps),cleanValue(exrTim),cleanValue(exrTyp),cleanValue(casTim),cleanValue(dayTim),cleanValue(isCmpld),cleanValue(timStd),cleanValue(images),cleanValue(deleted),cleanValue(isSync)],
                    (_, insertResult) => {
                        console.log('StartWorkoutRow Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        console.log('Error adding StartWorkoutRow row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    console.log('StartWorkoutRow Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                console.log('Error checking database for existing StartWorkoutRow row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addBodyStatsAndMeasurementsRowsToDatabase = async (dataArray) => {
        const promises = dataArray.map(async (rowData) => {
        const { userId, date, height, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, images, isSync } = rowData;
        //console.log('addBodyStatsAndMeasurementsRowsToDatabase rowData',rowData);
        
        // const setImageSent = (uri) => {
        //     imageSent = uri;
        // };
        let BodyStatDownloadedImage = "";
        let downloadedImagesArray = [];
        let downloadedImagesArrayStringified = "";
        if (images !== null && images !== "") {
            const bodyStatImagesParsed = JSON.parse(images);
            await Promise.all(bodyStatImagesParsed.map(async (bodyStatImageParsed) => {
                const imageName = bodyStatImageParsed.split('images/').pop();
                //console.log('imageName body stats', imageName);
               
                BodyStatDownloadedImage = await FileSystem.downloadAsync(
                    bodyStatImageParsed,
                    FileSystem.documentDirectory + 'images/' + imageName
                );
                //console.log('BodyStatDownloadedImage.uri', BodyStatDownloadedImage.uri);
                downloadedImagesArray.push(BodyStatDownloadedImage.uri);
            }));
        }
        //console.log('downloadedImagesArray--',downloadedImagesArray);
        if(downloadedImagesArray.length > 0 ){
            downloadedImagesArrayStringified = JSON.stringify(downloadedImagesArray);
        }
        //console.log('downloadedImagesArrayStringified--22',downloadedImagesArrayStringified);
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM bodyStatsAndMeasurements WHERE userId = ? AND date = ?',
                [userId,date],
                (_, result) => {
                
                if (result.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                    INSERT INTO bodyStatsAndMeasurements (userId, date, height, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, images, isSync)
                    VALUES (?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?)
                    `,
                    [userId, date, height, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, downloadedImagesArrayStringified, isSync],
                    (_, insertResult) => {
                        //console.log('bodyStatsAndMeasurements Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        //console.log('Error adding bodyStatsAndMeasurements row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    //console.log('bodyStatsAndMeasurements Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                //console.log('Error checking database for existing bodyStatsAndMeasurements row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addCalculatorsTableRowsToDatabase = (dataArray) => {
        const cleanValue = (value) => (value === null || value === undefined || typeof value === 'object' ? null : value);

    const promises = dataArray.map((rowData) => {
        // console.log('calculatorsTable Top rowData',rowData);
        
        const { userId,date,calNam,methds,sFMthd,age,height,weight,neck,torso,hips,chest,sprlic,tricep,thigh,abdmen,axilla,subcpl,workot,target,ditTyp,result,bFPctg,bFMass,lBMass,calris,protin,fats,carbs,isSync} = rowData;
        // console.log('calculatorsTable Top userId,calNam,date',userId,calNam,date);
        // console.log("DEBUG: Data types before insertion:", {
        //     userId: typeof userId,
        //     date: typeof date,
        //     calNam: typeof calNam,
        //     methds: typeof methds,
        //     sFMthd: typeof sFMthd,
        //     age: typeof age,
        //     height: typeof height,
        //     weight: typeof weight,
        //     neck: typeof neck,
        //     torso: typeof torso,
        //     hips: typeof hips,
        //     chest: typeof chest,
        //     sprlic: typeof sprlic,
        //     tricep:typeof tricep,
        //     thigh :typeof thigh,
        //     abdmen:typeof abdmen,
        //     axilla:typeof axilla,
        //     subcpl:typeof subcpl,
        //     workot:typeof workot,
        //     target:typeof target,
        //     ditTyp:typeof ditTyp,
        //     result:typeof result,
        //     bFPctg:typeof bFPctg,
        //     bFMass:typeof bFMass,
        //     lBMass:typeof lBMass,
        //     calris:typeof calris,
        //     protin:typeof protin,
        //     fats  :typeof fats,
        //     carbs :typeof carbs,
        //     isSync:typeof isSync,
            
        // });
          
        return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM calculatorsTable WHERE userId = ? AND calNam = ? AND date = ?',
            [userId,calNam,date],
            (_, result_values) => {
                // console.log('calculatorsTable  if result_values',result_values);
                // console.log('calculatorsTable before if result_values.rows.length',result_values.rows.length);

                if (result_values.rows.length === 0) {
                // console.log('if (result.rows.length === 0)',result_values.rows.length );

                // Entry doesn't exist, add it to the database
                tx.executeSql(
                   `INSERT INTO calculatorsTable (userId, date, calNam, methds, sFMthd, age, height, weight, neck, torso, hips, chest, sprlic, tricep, thigh, abdmen, axilla, subcpl, workot, target, ditTyp, result, bFPctg, bFMass, lBMass, calris, protin, fats, carbs, isSync)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        cleanValue(userId), cleanValue(date), cleanValue(calNam), cleanValue(methds), cleanValue(sFMthd), cleanValue(age), cleanValue(height), cleanValue(weight),
                        cleanValue(neck), cleanValue(torso), cleanValue(hips), cleanValue(chest), cleanValue(sprlic), cleanValue(tricep), cleanValue(thigh), cleanValue(abdmen),
                        cleanValue(axilla), cleanValue(subcpl), cleanValue(workot), cleanValue(target), cleanValue(ditTyp), cleanValue(result), cleanValue(bFPctg), cleanValue(bFMass),
                        cleanValue(lBMass), cleanValue(calris), cleanValue(protin), cleanValue(fats), cleanValue(carbs), cleanValue(isSync)
                    ],
                    (_, insertResult) => {
                    // console.log('calculatorsTable Row added to the database:', insertResult);
                    resolve();
                    },
                    (_, insertError) => {
                    // console.log('Error adding calculatorsTable row to the database:', insertError);
                    
                    }
                );
                } else {
                // Entry already exists, do nothing
                // console.log('calculatorsTable Row already exists in the database-----',result_values.rows);
                resolve();
                }
            },
            (_, error) => {
                // console.log('Error checking database for existing calculatorsTable row:', error);
            }
            );
        });
        });
    });

    return Promise.all(promises);
    };

    export const addGymEquipmentsRowsToDatabase = (dataArray) => {
    const promises = dataArray.map((rowData) => {
        const { userId,
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
        isSync } = rowData;

        return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM gymEquipments WHERE userId = ? AND speKey = ?',
            [userId,speKey],
            (_, result) => {
                
                if (result.rows.length === 0) {
                // Entry doesn't exist, add it to the database
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
            [userId,
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
                isSync],
                    (_, insertResult) => {
                    //console.log('gymEquipments Row added to the database:', insertResult);
                    resolve();
                    },
                    (_, insertError) => {
                    //console.log('Error adding gymEquipments row to the database:', insertError);
                    
                    }
                );
                } else {
                // Entry already exists, do nothing
                //console.log('gymEquipments Row already exists in the database');
                resolve();
                }
            },
            (_, error) => {
                //console.log('Error checking database for existing gymEquipments row:', error);
            }
            );
        });
        });
    });

    return Promise.all(promises);
    };

    export const addListOfFoodsTableRowsToDatabase = async (dataArray) => {
        const promises = dataArray.map(async (rowData) => {
        const { userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync } = rowData;
        console.log('addListOfFoodsTableRowsToDatabase userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync',rowData);
        
        // const setImageSent = (uri) => {
        //     imageSent = uri;
        // };
        let downloadedImage = "";
        if (images != null && images !== "") {
            imageName = images.split('images/').pop();
            //console.log('imageName',imageName);
                // FileSystem.downloadAsync(
                //         images,
                //         FileSystem.documentDirectory + 'images/'+imageName
                //     )
                //         .then(async ({uri}) => {
                //             //console.log('Finished downloading to ', uri);
                //             imageSent = uri;
                //         })
                //         .catch(error => {
                //             //console.log(error);
                //         });

                downloadedImage  = await FileSystem.downloadAsync(
                    images,
                    FileSystem.documentDirectory + 'images/' + imageName
                );
                //console.log('downloadedImage',downloadedImage);
            }
        console.log('afterrrrr downloadedImage--');

        return new Promise((resolve, reject) => {
            
                
            
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM ListOfFoodsTable WHERE userId = ? AND speKey = ?',
            [userId,speKey],
                (_, result) => {
                console.log('select ListOfFoodsTable result.rows--',result.rows);

                if (result.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                        INSERT INTO ListOfFoodsTable (userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync)
                        VALUES (?,?, ?, ?, ?, ?, ?,?,?, ?,?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?)
                    `,
                        [userId,speKey,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,downloadedImage.uri,deleted,isSync],
                    (_, insertResult) => {
                        console.log('ListOfFoodsTable Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        console.log('Error adding ListOfFoodsTable row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    console.log('ListOfFoodsTable Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                console.log('Error checking database for existing ListOfFoodsTable row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addPublicSettingsRowsToDatabase = (dataArray) => {
        const promises = dataArray.map((rowData) => {
        const { userId,height,age,barBel,dumbel,bands,FreWit,units,compnd,isoltn,cardio, isSync} = rowData;
    
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            // Check if a row already exists for the user 
            tx.executeSql(
                `
                SELECT * FROM publicSettings WHERE userId = ?
            `,
                [userId],
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
                        height,age,barBel,dumbel,bands,FreWit,units,compnd,isoltn,cardio, isSync,userId
                    ],
                    (_, result) => {
                        //console.log('Succeeded to update user PublicSettings', result);
                        resolve();
                    },
                    (_, error) => {
                        //console.log('Failed to update user PublicSettings', error);
                        reject();
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
                        userId,height,age,barBel,dumbel,bands,FreWit,units,compnd,isoltn,cardio, isSync
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
                //console.log('Error checking for existing PublicSettings', error);
                reject(error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addPublicWorkoutsPlanDaysRowsToDatabase = (dataArray) => {
        const promises = dataArray.map((rowData) => {
        const { userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync } = rowData;
    
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM publicWorkoutsPlanDays WHERE userId = ? AND plnKey = ? AND speKey = ? AND wrkKey = ?',
            [userId,plnKey,speKey,wrkKey],
                (_, result) => {
                    console.log('publicWorkoutsPlanDays result.rows:', result.rows);

                if (result.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                        INSERT INTO publicWorkoutsPlanDays (userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync)
                        VALUES (?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?, ?, ?,?)
                    `,
                        [userId, speKey,dayNam, plnKey,wrkSts,wrkKey, wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images, deleted, isSync],
                    (_, insertResult) => {
                        console.log('publicWorkoutsPlanDays Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        console.log('Error adding publicWorkoutsPlanDays row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    console.log('publicWorkoutsPlanDays Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                console.log('Error checking database for existing publicWorkoutsPlanDays row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addPublicWorkoutsPlansRowsToDatabase = (dataArray) => {
        const promises = dataArray.map((rowData) => {
        const { userId, speKey, plnNam, stDate, edDate, deleted, isSync } = rowData;
    
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM publicWorkoutsPlans WHERE userId = ? AND speKey = ?',
            [userId,speKey],
                (_, result) => {
                
                if (result.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                    INSERT INTO publicWorkoutsPlans (
                        userId, speKey, plnNam, stDate, edDate, deleted, isSync
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `,
                [userId, speKey, plnNam, stDate, edDate, deleted, isSync],
                    (_, insertResult) => {
                        //console.log('publicWorkoutsPlans Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        //console.log('Error adding publicWorkoutsPlans row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    //console.log('publicWorkoutsPlans Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                //console.log('Error checking database for existing publicWorkoutsPlans row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addTargetStatsRowsToDatabase = (dataArray) => {
    const promises = dataArray.map((rowData) => {
        const { userId, date, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, isSync } = rowData;

        return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
            'SELECT * FROM targetStats WHERE userId = ?',
            [userId],
            (_, result) => {
                
                if (result.rows.length === 0) {
                // Entry doesn't exist, add it to the database
                tx.executeSql(
                    `
                    INSERT INTO targetStats (userId, date, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, isSync)
                    VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?)
                    `,
                [userId, date, weight, neck, should, chest, arm, forarm, torso, hHips, hips, thigh, calves, isSync],
                    (_, insertResult) => {
                    //console.log('targetStats Row added to the database:', insertResult);
                    resolve();
                    },
                    (_, insertError) => {
                    //console.log('Error adding targetStats row to the database:', insertError);
                    
                    }
                );
                } else {
                // Entry already exists, do nothing
                //console.log('targetStats Row already exists in the database');
                resolve();
                }
            },
            (_, error) => {
                //console.log('Error checking database for existing targetStats row:', error);
            }
            );
        });
        });
    });

    return Promise.all(promises);
    };

    export const addTodayMealsTableRowsToDatabase = (dataArray) => {
        const promises = dataArray.map((rowData) => {
        const { userId,speKey,date,time,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync } = rowData;
    
        return new Promise((resolve, reject) => {
            database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM TodayMealsTable WHERE userId = ? AND speKey = ? AND date = ?',
            [userId,speKey,date],
                (_, result) => {
                
                if (result.rows.length === 0) {
                    // Entry doesn't exist, add it to the database
                    tx.executeSql(
                    `
                    INSERT INTO TodayMealsTable (userId,speKey,date,time,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync)
                    VALUES (?,?, ?,?,?, ?, ?, ?, ?,?,?, ?,?,?,?, ?, ?, ?, ?, ?, ?,?,?, ?,?,?)
                    `,
                    [userId,speKey,date,time,Type,Subtyp,foddes,weight,protin,carbs,fats,calris,Satrtd,Plnstd,Munstd,Trans,Sodium,Potsim,Chostl,VtminA,VtminC,Calcim,Iron,images,deleted,isSync],
                    (_, insertResult) => {
                        //console.log('TodayMealsTable Row added to the database:', insertResult);
                        resolve();
                    },
                    (_, insertError) => {
                        //console.log('Error adding TodayMealsTable row to the database:', insertError);
                        
                    }
                    );
                } else {
                    // Entry already exists, do nothing
                    //console.log('TodayMealsTable Row already exists in the database');
                    resolve();
                }
                },
                (_, error) => {
                //console.log('Error checking database for existing TodayMealsTable row:', error);
                }
            );
            });
        });
        });
    
        return Promise.all(promises);
    };

    export const addWorkoutRowsToDatabaseForTrainer = async (dataArray) => {
        //console.log('dataArray addWorkoutRowsToDatabase',dataArray);
        const promises = dataArray.map(async (rowData) => {
        const { userId,
        speKey,
        wktNam,
        exrTyp,
        eqpUsd,
        witUsd,
        wktStp,
        pfgWkt,
        mjMsOn,
        mjMsTw,
        mjMsTr,
        mnMsOn,
        mnMsTo,
        mnMsTr,
        images,
        videos,
        isSync } = rowData;
        //console.log('userId,speKey,wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images,videos,isSync',rowData);
        function isImageUrl(url) {
            const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'];
            const lowercasedUrl = url?.toLowerCase();
            return imageExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
          }
          
          function isVideoUrl(url) {
            const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v'];
            const lowercasedUrl = url?.toLowerCase();
            return videoExtensions.some(ext => lowercasedUrl?.endsWith(`.${ext}`));
          }
        if( isImageUrl(images)  || isVideoUrl(videos)) {
            
        //   let workoutDownloadedImage = "";
        //   let workoutDownloadedVideo = "";
        
        //         if (images && images.trim() !== "" && images !== null || images !== "") {
        //             imageName = images.split('images/').pop();
        //             //console.log('imageName',imageName);
                        
            
        //             workoutDownloadedImage  = images;
        //                 //console.log('workoutDownloadedImage',workoutDownloadedImage);
        //             }
        //             if (videos && videos.trim() !== "" && videos !== null && videos !== "") {
        //               videoName = videos.split('videos/').pop();
        //               //console.log('videoName',videoName);
                          
              
        //               workoutDownloadedVideo  =videos;
        //                   //console.log('workoutDownloadedVideo',workoutDownloadedVideo);
        //               }
                      return new Promise((resolve, reject) => {
                        database.transaction((tx) => {
                            tx.executeSql(
                            'SELECT * FROM workouts WHERE userId = ? AND speKey = ?',
                            [userId,speKey],
                            (_, result) => {
                                
                                if (result.rows.length === 0) {
                                // Entry doesn't exist, add it to the database
                                tx.executeSql(
                                    `
                                    INSERT INTO workouts (
                                    userId,
                                    speKey,
                                    wktNam,
                                    exrTyp,
                                    eqpUsd,
                                    witUsd,
                                    wktStp,
                                    pfgWkt,
                                    mjMsOn,
                                    mjMsTw,
                                    mjMsTr,
                                    mnMsOn,
                                    mnMsTo,
                                    mnMsTr,
                                    images,
                                    videos,
                                    isSync)
                                    VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                                    `,
                                    [userId,
                                    speKey,
                                    wktNam,
                                    exrTyp,
                                    eqpUsd,
                                    witUsd,
                                    wktStp,
                                    pfgWkt,
                                    mjMsOn,
                                    mjMsTw,
                                    mjMsTr,
                                    mnMsOn,
                                    mnMsTo,
                                    mnMsTr,
                                    images,
                                    videos,
                                    'no'],
                                    (_, insertResult) => {
                                    //console.log('workouts Row added to the database:', insertResult);
                                    resolve();
                                    },
                                    (_, insertError) => {
                                    //console.log('Error adding workouts row to the database:', insertError);
                                    
                                    }
                                );
                                } else {
                                // Entry already exists, do nothing
                                //console.log('workouts Row already exists in the database');
                                resolve();
                                }
                            },
                            (_, error) => {
                                //console.log('Error checking database for existing workouts row:', error);
                            }
                            );
                        });
                        });
          
        
          }else if (images == "" && videos == ""){
            return new Promise((resolve, reject) => {
                database.transaction((tx) => {
                    tx.executeSql(
                    'SELECT * FROM workouts WHERE userId = ? AND speKey = ?',
                    [userId,speKey],
                    (_, result) => {
                        
                        if (result.rows.length === 0) {
                        // Entry doesn't exist, add it to the database
                        tx.executeSql(
                            `
                            INSERT INTO workouts (
                            userId,
                            speKey,
                            wktNam,
                            exrTyp,
                            eqpUsd,
                            witUsd,
                            wktStp,
                            pfgWkt,
                            mjMsOn,
                            mjMsTw,
                            mjMsTr,
                            mnMsOn,
                            mnMsTo,
                            mnMsTr,
                            images,
                            videos,
                            isSync)
                            VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                            `,
                            [userId,
                            speKey,
                            wktNam,
                            exrTyp,
                            eqpUsd,
                            witUsd,
                            wktStp,
                            pfgWkt,
                            mjMsOn,
                            mjMsTw,
                            mjMsTr,
                            mnMsOn,
                            mnMsTo,
                            mnMsTr,
                            images,
                            videos,
                            'no'],
                            (_, insertResult) => {
                            //console.log('workouts Row added to the database:', insertResult);
                            resolve();
                            },
                            (_, insertError) => {
                            //console.log('Error adding workouts row to the database:', insertError);
                            
                            }
                        );
                        } else {
                        // Entry already exists, do nothing
                        //console.log('workouts Row already exists in the database');
                        resolve();
                        }
                    },
                    (_, error) => {
                        //console.log('Error checking database for existing workouts row:', error);
                    }
                    );
                });
                }); 
          }else{
                     
            let parsedDataImages ={};
            let parsedDataVideos ={};
            let stringifiedDataImages = images;
            let stringifiedDataVideos = videos;
            try {
              parsedDataImages = JSON.parse(images);
             // //console.log("parsedData TRAINEEE-------:", parsedDataImages);
            } catch (error) {
              {/* console.error("Failed to parse images:", error); */}
              parsedDataImages = null;
            }
            try {
              parsedDataVideos = JSON.parse(videos);
             // //console.log("parsedData TRAINEEE-------:", parsedDataVideos);
            } catch (error) {
              {/* console.error("Failed to parse images:", error); */}
              parsedDataVideos = null;
            }
                        
                        // //console.log("parsedData?.CloudFlareImageUrl -------:", parsedDataImages?.CloudFlareImageUrl);
        
            if ( parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null || parsedDataVideos?.LocalVideUrl !== '' && parsedDataVideos?.LocalVideUrl !== undefined && parsedDataVideos?.LocalVideUrl !== null) {
              let workoutDownloadedImage = parsedDataImages?.LocalImageUrl;
              let workoutDownloadedVideo = parsedDataVideos?.LocalVideUrl;
        
              if ( parsedDataImages?.LocalImageUrl !== '' && parsedDataImages?.LocalImageUrl !== undefined && parsedDataImages?.LocalImageUrl !== null ) {
                if (isImageUrl(parsedDataImages?.LocalImageUrl)){
                  let imageName = parsedDataImages?.LocalImageUrl.split('workouts_thumbnails/').pop();
                //console.log('imageName',imageName);
                    
        
                workoutDownloadedImage  = await FileSystem.downloadAsync(
                  parsedDataImages?.CloudFlareImageUrl.replace(
                    'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                    'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                  ),
                        FileSystem.documentDirectory + 'images/workouts_thumbnails/' + imageName
                    );
                    //console.log('workoutDownloadedImage',workoutDownloadedImage);
                    parsedDataImages.LocalImageUrl = workoutDownloadedImage;
                    stringifiedDataImages = JSON.stringify(parsedDataImages);
                  
                }
                
                }
                
                if ( parsedDataVideos?.LocalVideUrl !== '' && parsedDataVideos?.LocalVideUrl !== undefined && parsedDataVideos?.LocalVideUrl !== null) {
                  if(isVideoUrl(parsedDataVideos?.LocalVideUrl)){
                    let videoName = parsedDataVideos?.LocalVideUrl.split('videos/').pop();
                    //console.log('videoName',videoName);
            
                    workoutDownloadedVideo  = await FileSystem.downloadAsync(
                      parsedDataVideos?.CloudFlareVideUrl.replace(
                        'https://e46498df47bd32e53e8647674155a34c.r2.cloudflarestorage.com/lifeapp23',
                        'https://pub-e97a7d17757c41b8bcfca7023afa5da9.r2.dev'
                      ),
                            FileSystem.documentDirectory + 'videos/' + videoName
                        );
                        parsedDataVideos.LocalVideUrl = workoutDownloadedVideo;
                        stringifiedDataVideos= JSON.stringify(parsedDataVideos);
      
                  
                    }
                  
                      //console.log('workoutDownloadedVideo',workoutDownloadedVideo);
                  }
                  
              }
                          console.log('stringifiedDataImages----');
                          console.log('stringifiedDataVideos----');

              return new Promise((resolve, reject) => {
                database.transaction((tx) => {
                    tx.executeSql(
                    'SELECT * FROM workouts WHERE userId = ? AND speKey = ?',
                    [userId,speKey],
                    (_, result) => {
                        
                        if (result.rows.length === 0) {
                        // Entry doesn't exist, add it to the database
                        tx.executeSql(
                            `
                            INSERT INTO workouts (
                            userId,
                            speKey,
                            wktNam,
                            exrTyp,
                            eqpUsd,
                            witUsd,
                            wktStp,
                            pfgWkt,
                            mjMsOn,
                            mjMsTw,
                            mjMsTr,
                            mnMsOn,
                            mnMsTo,
                            mnMsTr,
                            images,
                            videos,
                            isSync)
                            VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                            `,
                            [userId,
                            speKey,
                            wktNam,
                            exrTyp,
                            eqpUsd,
                            witUsd,
                            wktStp,
                            pfgWkt,
                            mjMsOn,
                            mjMsTw,
                            mjMsTr,
                            mnMsOn,
                            mnMsTo,
                            mnMsTr,
                            stringifiedDataImages,
                            stringifiedDataVideos,
                            'no'],
                            (_, insertResult) => {
                            //console.log('workouts Row added to the database:', insertResult);
                            resolve();
                            },
                            (_, insertError) => {
                            //console.log('Error adding workouts row to the database:', insertError);
                            
                            }
                        );
                        } else {
                        // Entry already exists, do nothing
                        //console.log('workouts Row already exists in the database');
                        resolve();
                        }
                    },
                    (_, error) => {
                        //console.log('Error checking database for existing workouts row:', error);
                    }
                    );
                });
                });            
                          
                        
                        }
                   
                   
                   
                       
                    

        
        });
    
        return Promise.all(promises);
        };
    export const addWorkoutRowsToDatabase = async (dataArray) => {
    //console.log('dataArray addWorkoutRowsToDatabase',dataArray);
    const promises = dataArray.map(async (rowData) => {
    const { userId,
    speKey,
    wktNam,
    exrTyp,
    eqpUsd,
    witUsd,
    wktStp,
    pfgWkt,
    mjMsOn,
    mjMsTw,
    mjMsTr,
    mnMsOn,
    mnMsTo,
    mnMsTr,
    images,
    videos,
    isSync } = rowData;
    //console.log('userId,speKey,wktNam,exrTyp,eqpUsd,witUsd,wktStp,pfgWkt,mjMsOn,mjMsTw,mjMsTr,mnMsOn,mnMsTo,mnMsTr,images,videos,isSync',rowData);
// console.log('speKey---datahandling before',speKey);

    // let workoutDownloadedImage = "";
    // let workoutDownloadedVideo = "";

    // if (images && images.trim() !== "" && images !== null || images !== "") {
    //     imageName = images.split('images/').pop();
    //     //console.log('imageName',imageName);
            

    //     workoutDownloadedImage  = await FileSystem.downloadAsync(
    //             images,
    //             FileSystem.documentDirectory + 'images/' + imageName
    //         );
    //         //console.log('workoutDownloadedImage',workoutDownloadedImage);
    //     }
    //     if (videos && videos.trim() !== "" && videos !== null && videos !== "") {
    //         videoName = videos.split('videos/').pop();
    //         //console.log('videoName',videoName);
                
    
    //         workoutDownloadedVideo  = await FileSystem.downloadAsync(
    //                 videos,
    //                 FileSystem.documentDirectory + 'videos/' + videoName
    //             );
    //             //console.log('workoutDownloadedVideo',workoutDownloadedVideo);
    //         }
    //console.log('workoutDownloadedVideo--',workoutDownloadedVideo);

    return new Promise((resolve, reject) => {
    database.transaction((tx) => {
        tx.executeSql(
        'SELECT * FROM workouts WHERE userId = ? AND speKey = ?',
        [userId,speKey],
        (_, result) => {
            // console.log('speKey---datahandling inside database.transaction',speKey);

            if (result.rows.length === 0) {
            // Entry doesn't exist, add it to the database
            tx.executeSql(
                `
                INSERT INTO workouts (
                userId,
                speKey,
                wktNam,
                exrTyp,
                eqpUsd,
                witUsd,
                wktStp,
                pfgWkt,
                mjMsOn,
                mjMsTw,
                mjMsTr,
                mnMsOn,
                mnMsTo,
                mnMsTr,
                images,
                videos,
                isSync)
                VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?)
                `,
                [userId,
                speKey,
                wktNam,
                exrTyp,
                eqpUsd,
                witUsd,
                wktStp,
                pfgWkt,
                mjMsOn,
                mjMsTw,
                mjMsTr,
                mnMsOn,
                mnMsTo,
                mnMsTr,
                images,
                videos,
                isSync],
                (_, insertResult) => {
                // console.log('workouts Row added to the database:', insertResult);
                resolve();
                },
                (_, insertError) => {
                //console.log('Error adding workouts row to the database:', insertError);
                
                }
            );
            } else {
            // Entry already exists, do nothing
            resolve();
            }
        },
        (_, error) => {
            //console.log('Error checking database for existing workouts row:', error);
        }
        );
    });
    });
    });

    return Promise.all(promises);
    };

