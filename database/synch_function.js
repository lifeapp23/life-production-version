//****** TargetStat
getTargetStatsUnsyncedRows(userId).then((usersTS) => {
    //console.log('TargetStat unSynced Data :', usersTS);
    axios.post(`https://life-pf.com/api/tarStat-update-data`, usersTS)
    .then((response) => {
      //console.log('our services target axios update backend', response.data.message);
      // Handle any other logic here if needed
    })
    .catch((error) => {
      // Handle errors, e.g., show an error message
      //console.log('our services target axios error.response.data', error.response.data);
    });
    const unsyncedTSRowIds = usersTS.map((row) => row.id);
    updateTargetStatsRowsToSynced(unsyncedTSRowIds,userId).then((users) => {
        //console.log('TargetStat updateTargetStatsRowsToSynced updated :', users);
      }).catch((error) => {
        //console.error('BSmeasurements updateTargetStatsRowsToSynced didnt updated:', error);
      });
  }).catch((error) => {
  //console.error('Error fetching TargetStat:', error);
  });
  ///// //*********body stats and meaurements 
  getBodyStatsAndMeasurementsUnsyncedRows(userId).then((usersBSMeasurements) => {
    //console.log('BodyStatsAndMeasurementsUnsyncedRows unSynced Data :', usersBSMeasurements);
    axios.post(`https://life-pf.com/api/BSMeasurments-insert-data`, usersBSMeasurements)
    .then((response) => {
      //console.log('our services usersBSMeasurements axios update backend', response.data.message);
      // Handle any other logic here if needed
    })
    .catch((error) => {
      // Handle errors, e.g., show an error message
      //console.log('our services usersBSMeasurements axios error.response.data', error.response.data);
    });
    const unsyncedBSMeasuremntsRowIds = usersBSMeasurements.map((row) => row.id);
    updateStatsAndMeasurementsRowsToSynced(unsyncedBSMeasuremntsRowIds,userId).then((users) => {
        //console.log('BSmeasurements updateBSmeasurementsRowsToSynced updated :', users);
      }).catch((error) => {
        //console.error('BSmeasurements updateBSmeasurementsRowsToSynced didnt updated:', error);
      });
  }).catch((error) => {
  //console.error('Error fetching usersBSMeasurements:', error);
  });
  //////////////////////

//*********workout Settings page 
getPublicSettingsUnsyncedRows(userId).then((usersPS) => {
    //console.log('PublicSettings unSynced Data :', usersPS);
    axios.post(`https://life-pf.com/api/publicSettings-update-data`, usersPS)
    .then((response) => {
        //console.log('PublicSettings axios update backend', response.data.message);
        // Handle any other logic here if needed
            const unsyncedPublicSettingsRowIds = usersPS.map((row) => row.id);
            updatePublicSettingsRowsToSynced(unsyncedPublicSettingsRowIds,userId).then((users) => {
                    //console.log('PublicSettings updatePublicSettingsRowsToSynced updated :', users);
                    }).catch((error) => {
                    //console.error('PublicSettings updatePublicSettingsRowsToSynced didnt updated:', error);
                    });
                })
    .catch((error) => {
        // Handle errors, e.g., show an error message
        //console.log('PublicSettings axios error.response.data', error.response.data);
    });

}).catch((error) => {
//console.error('Error fetching PublicSettings:', error);
});
//******//********* Calculators pages 
getCalculatorsTableUnsyncedRows(storedUser.id).then((usersPS) => {
    //console.log('Calculators unSynced Data :', usersPS);
    axios.post(`https://life-pf.com/api/calculators-insert-data`, usersPS)
    .then((response) => {
        //console.log('Calculators axios update backend', response.data.message);
        // Handle any other logic here if needed
        const unsyncedCalculatorsRowIds = usersPS.map((row) => row.id);
        updateCalculatorsRowsToSynced(unsyncedCalculatorsRowIds,storedUser.id).then((users) => {
                //console.log('Calculators updateStatsAndMeasurementsRowsToSynced updated :', users);
                }).catch((error) => {
                //console.error('Calculators updateStatsAndMeasurementsRowsToSynced didnt updated:', error);
                });
    })
    .catch((error) => {
        // Handle errors, e.g., show an error message
        //console.log('Calculators axios error.response.data', error.response.data);
    });

}).catch((error) => {
//console.error('Error fetching Calculators:', error);
});

//******//********* Gym Facilities pages 
getGymEquipmentsUnsyncedRows(storedUser.id).then((usersPS) => {
    //console.log('GymEquipments unSynced Data:', usersPS);
    
    axios.post(`https://life-pf.com/api/gymEquipments-insert-data`, usersPS)
        .then((response) => {
            //console.log('GymEquipments axios update backend', response?.data.message);

            // Delete gym rows
            deleteGymEquipmentsRowsWithYes(usersPS)
                .then((DGEResults) => {
                    //console.log('Gym Facilites rows deleted:', DGEResults);

                    // Update the rest of the rows
                    const unsyncedGymEquipmentsRowIds = usersPS.map((row) => row.id);
                    updateGymEquipmentsRowsToSynced(unsyncedGymEquipmentsRowIds, storedUser.id)
                        .then((users) => {
                            //console.log('GymEquipments updateStatsAndMeasurementsRowsToSynced updated:', users);
                        })
                        .catch((error) => {
                            //console.error('GymEquipments updateStatsAndMeasurementsRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting Gym Facilites rows:', error);
                });
        })
        .catch((error) => {
            // Handle errors from axios
            //console.log('GymEquipments axios error.response.data', error.response?.data);
        });
})
.catch((error) => {
    //console.error('Error fetching GymEquipments:', error);
});

//******//*********Workouts pages 
getGymEquipmentsUnsyncedRows(storedUser.id).then((usersPS) => {
    //console.log('GymEquipments unSynced Data:', usersPS);
    
    axios.post(`https://life-pf.com/api/gymEquipments-insert-data`, usersPS)
        .then((response) => {
            //console.log('GymEquipments axios update backend', response?.data.message);

            // Delete gym rows
            deleteGymEquipmentsRowsWithYes(usersPS)
                .then((DGEResults) => {
                    //console.log('Gym Facilites rows deleted:', DGEResults);

                    // Update the rest of the rows
                    const unsyncedGymEquipmentsRowIds = usersPS.map((row) => row.id);
                    updateGymEquipmentsRowsToSynced(unsyncedGymEquipmentsRowIds, storedUser.id)
                        .then((users) => {
                            //console.log('GymEquipments updateStatsAndMeasurementsRowsToSynced updated:', users);
                        })
                        .catch((error) => {
                            //console.error('GymEquipments updateStatsAndMeasurementsRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting Gym Facilites rows:', error);
                });
        })
        .catch((error) => {
            // Handle errors from axios
            //console.log('GymEquipments axios error.response.data', error.response?.data);
        });
})
.catch((error) => {
    //console.error('Error fetching GymEquipments:', error);
});

//******//********* PublicWorkoutsPlans pages 
getPublicWorkoutsPlansUnsyncedRows(storedUser.id).then((usersPWP) => {
    //console.log('PublicWorkoutsPlans unSynced Data:', usersPWP);
    
    axios.post(`https://life-pf.com/api/publicWorkoutsPlans-insert-data`, usersPWP)
        .then((response) => {
            //console.log('PublicWorkoutsPlans axios update backend', response?.data.message);
        
        // Delete gym rows
            deletePublicWorkoutsPlansRowsWithYes(usersPWP)
                .then((DGEResults) => {
                    //console.log('PublicWorkoutsPlans rows deleted:', DGEResults);

                    // Update the rest of the rows
                    const unsyncedPublicWorkoutsPlansRowIds = usersPWP.map((row) => row.id);
                    updatePublicWorkoutsPlansRowsToSynced(unsyncedPublicWorkoutsPlansRowIds, storedUser.id)
                        .then((resultPWP) => {
                            //console.log('PublicWorkoutsPlans updatePublicWorkoutsPlansRowsToSynced updated:', resultPWP);
                        })
                        .catch((error) => {
                            //console.error('PublicWorkoutsPlans updatePublicWorkoutsPlansRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting PublicWorkoutsPlans rows:', error);
                });
        })
        .catch((error) => {
            // Handle errors from axios
            //console.log('PublicWorkoutsPlans axios error.response.data', error.response?.data);
        });
})
.catch((error) => {
    //console.error('Error fetching PublicWorkoutsPlans:', error);
});
    // //******//********* PublicWorkoutsPlan Days pages 
getPublicWorkoutsPlanDaysUnsyncedRows(storedUser.id).then((usersPWPD) => {
    //console.log('PublicWorkoutsPlanDays unSynced Data:', usersPWPD);
    
    axios.post(`https://life-pf.com/api/publicWorkoutsPlansDays-insert-data`, usersPWPD)
        .then((response) => {
            //console.log('PublicWorkoutsPlanDays axios update backend', response?.data.message);
            // Delete gym rows
            deletePublicWorkoutsPlanDaysRowsWithYes(usersPWPD)
                .then((DGEResults) => {
                    //console.log('PublicWorkoutsPlanDays rows deleted:', DGEResults);

                    // Update the rest of the rows
                    const unsyncedPublicWorkoutsPlanDaysRowIds = usersPWPD.map((row) => row.id);
                    updatePublicWorkoutsPlanDaysRowsToSynced(unsyncedPublicWorkoutsPlanDaysRowIds, storedUser.id)
                        .then((resultPWPD) => {
                            //console.log('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced updated:', resultPWPD);
                        })
                        .catch((error) => {
                            //console.error('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting PublicWorkoutsPlanDays rows:', error);
                });
        })
        .catch((error) => {
            // Handle errors from axios
            //console.log('PublicWorkoutsPlanDays axios error.response.data', error.response?.data);
        });
})
.catch((error) => {
    //console.error('Error fetching PublicWorkoutsPlanDays:', error);
});
    // //******//********* BeginWorkouts pages 
getPublicWorkoutsPlanDaysUnsyncedRows(storedUser.id).then((usersPWPD) => {
    //console.log('PublicWorkoutsPlanDays unSynced Data:', usersPWPD);
    
    axios.post(`https://life-pf.com/api/publicWorkoutsPlansDays-insert-data`, usersPWPD)
        .then((response) => {
            //console.log('PublicWorkoutsPlanDays axios update backend', response?.data.message);
            // Delete gym rows
            deletePublicWorkoutsPlanDaysRowsWithYes(usersPWPD)
                .then((DGEResults) => {
                    //console.log('PublicWorkoutsPlanDays rows deleted:', DGEResults);

                    // Update the rest of the rows
                    const unsyncedPublicWorkoutsPlanDaysRowIds = usersPWPD.map((row) => row.id);
                    updatePublicWorkoutsPlanDaysRowsToSynced(unsyncedPublicWorkoutsPlanDaysRowIds, storedUser.id)
                        .then((resultPWPD) => {
                            //console.log('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced updated:', resultPWPD);
                        })
                        .catch((error) => {
                            //console.error('PublicWorkoutsPlanDays updatePublicWorkoutsPlanDaysRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting PublicWorkoutsPlanDays rows:', error);
                });
        })
        .catch((error) => {
            // Handle errors from axios
            //console.log('PublicWorkoutsPlanDays axios error.response.data', error.response?.data);
        });
})
.catch((error) => {
    //console.error('Error fetching PublicWorkoutsPlanDays:', error);
});

    //******//********* PredefinedMeals pages 
    getPredefinedMealsUnsyncedRows(storedUser.id).then((usersPM) => {
        //console.log('PredefinedMeals unSynced Data:', usersPM);
        
        axios.post(`https://life-pf.com/api/predefinedMeals-insert-data`, usersPM)
            .then((response) => {
                //console.log('PredefinedMeals axios update backend', response?.data.message);
                // Delete gym rows
                deletePredefinedMealsRowsWithYes(usersPM)
                    .then((DPMResults) => {
                        //console.log('PredefinedMeals rows deleted:', DPMResults);
    
                        // Update the rest of the rows
                        const unsyncedPredefinedMealsRowIds = usersPM.map((row) => row.id);
                        updatePredefinedMealsRowsToSynced(unsyncedPredefinedMealsRowIds, storedUser.id)
                            .then((resultPWPD) => {
                                //console.log('PredefinedMeals updatePredefinedMealsRowsToSynced updated:', resultPWPD);
                            })
                            .catch((error) => {
                                //console.error('PredefinedMeals updatePredefinedMealsRowsToSynced didnt updated:', error);
                            });
                    })
                    .catch((error) => {
                        //console.error('Error deleting PredefinedMeals rows:', error);
                    });
                    })
                    .catch((error) => {
                        // Handle errors from axios
                        //console.log('PredefinedMeals axios error.response.data', error.response?.data);
                    });
            })
            .catch((error) => {
                //console.error('Error fetching PredefinedMeals:', error);
            });

// //******//********* ListOfFoods pages 
getListOfFoodsUnsyncedRows(storedUser.id).then((usersPM) => {
    //console.log('ListOfFoods unSynced Data:', usersPM);
    
    axios.post(`https://life-pf.com/api/ListOfFoods-insert-data`, usersPM)
        .then((response) => {
            //console.log('ListOfFoods axios update backend', response?.data.message);
            // Delete gym rows
            deleteListOfFoodsRowsWithYes(usersPM)
                .then((DPMResults) => {
                    //console.log('ListOfFoods rows deleted:', DPMResults);

                    // Update the rest of the rows
                    const unsyncedListOfFoodsRowIds = usersPM.map((row) => row.id);
                    updateListOfFoodsRowsToSynced(unsyncedListOfFoodsRowIds, storedUser.id)
                        .then((resultPWPD) => {
                            //console.log('ListOfFoods updateListOfFoodsRowsToSynced updated:', resultPWPD);
                        })
                        .catch((error) => {
                            //console.error('ListOfFoods updateListOfFoodsRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting ListOfFoods rows:', error);
                });
                })
                .catch((error) => {
                    // Handle errors from axios
                    //console.log('ListOfFoods axios error.response.data', error.response?.data);
                });
        })
        .catch((error) => {
            //console.error('Error fetching ListOfFoods:', error);
        });

 // //******//********* Today Meals pages 
 getTodayMealsUnsyncedRows(storedUser.id).then((usersPM) => {
    //console.log('TodayMeals unSynced Data:', usersPM);
    axios.post(`https://life-pf.com/api/TodayMeals-insert-data`, usersPM)
        .then((response) => {
            //console.log('TodayMeals axios update backend', response?.data.message);
            // Delete gym rows
            deleteTodayMealsRowsWithYes(usersPM)
                .then((DPMResults) => {
                    //console.log('TodayMeals rows deleted:', DPMResults);

                    // Update the rest of the rows
                    const unsyncedTodayMealsRowIds = usersPM.map((row) => row.id);
                    updateTodayMealsRowsToSynced(unsyncedTodayMealsRowIds, storedUser.id)
                        .then((resultPWPD) => {
                            //console.log('TodayMeals updateTodayMealsRowsToSynced updated:', resultPWPD);
                        })
                        .catch((error) => {
                            //console.error('TodayMeals updateTodayMealsRowsToSynced didnt updated:', error);
                        });
                })
                .catch((error) => {
                    //console.error('Error deleting TodayMeals rows:', error);
                });
                })
                .catch((error) => {
                    // Handle errors from axios
                    //console.log('TodayMeals axios error.response.data', error.response?.data);
                });
        })
        .catch((error) => {
            //console.error('Error fetching TodayMeals:', error);
        });

// //******//********* Trainer Manage My Profile 
axios.post(`https://life-pf.com/api/sendTMPForAppove`, usersPM)
        .then((response) => {
            //console.log('Trainer Manage My Profile  axios data sent to backend', response?.data.message);
            
                })
