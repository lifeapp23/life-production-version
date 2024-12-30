export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const setCurrentUser = (sanctumToken, userProfile, userPublicSettings) => {
    return {
        type: SET_CURRENT_USER,
        token: sanctumToken,
        userProfile: userProfile,
        userPublicSettings: userPublicSettings
    }
}
