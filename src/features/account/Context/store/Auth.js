import React, { useEffect, useReducer, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../reducers/Auth.reducer";
import { setCurrentUser } from "../actions/Auth.actions";
import AuthGlobal from './AuthGlobal'
import { fetchUsers,getOneUser } from "../../../../../database/usersTable";
import {fetchTokens, getUserIdFromTokenId } from "../../../../../database/tokensTable"; 

const Auth = props => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        token: "",
        userProfile: {},
        userPublicSettings: {}
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        setShowChild(true);
        AsyncStorage.getItem("sanctum_token").then((sanctum_token) => {
            const sanctumToken = sanctum_token ? sanctum_token : "";
            ////console.log('Auth sanctumToken--->>>',sanctumToken);
            const tokenIDPart = parseInt(sanctumToken.split('|')[0], 10);
            getUserIdFromTokenId(tokenIDPart)
            .then((userId) => {
            getOneUser(userId)
            .then((userInfo) => {
                ////console.log('Auth userInfo--->>>',userInfo);
                //context.dispatch(setCurrentUser(res,userInfo,{}));
                if (setShowChild) {
                    dispatch(setCurrentUser(sanctumToken, userInfo, {}));
                }
            })
                
            });
            
            });
        
        return () => setShowChild(false);
    }, [])

    if (!showChild) {
        return null;
    } else {
        return (
            <AuthGlobal.Provider
                value={{
                    stateUser,
                    dispatch
                }}
            >
                {props.children}
            </AuthGlobal.Provider>
        )
    }
};

export default Auth;
