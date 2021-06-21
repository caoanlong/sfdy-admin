import { AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import Admin from "../../api/Admin"
import { User } from "../../types"

export const SET_USERINFO = 'SET_USERINFO'
export const SET_TOKEN = 'SET_TOKEN'

export const setToken = (token: string) => {
    return {
        type: SET_TOKEN,
        token
    }
}

export const setUserInfo = (userInfo: User) => {
    return {
        type: SET_USERINFO,
        userInfo
    }
}

export const fetchUserInfo = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const { data } = await Admin.getUserInfo()
        dispatch(setUserInfo(data.data))
    }
}

