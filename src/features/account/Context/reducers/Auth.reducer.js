import { SET_CURRENT_USER } from "../actions/Auth.actions";

const isEmpty = value =>
    value === undefined || 
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0);

export default function (state, action) {
    switch (action.type) {
        case SET_CURRENT_USER: 
        return {
            ...state,
            isAuthenticated: !isEmpty(action.token),
            token: action.token,
            userProfile: action.userProfile,
            userPublicSettings: action.userPublicSettings
        };
        default:
            return state;
    }
}
