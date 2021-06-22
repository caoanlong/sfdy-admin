import { AnyAction } from "redux"
import { ThunkAction, ThunkDispatch } from "redux-thunk"
import AdminApi from "../../api/AdminApi"
import VodTypeApi from "../../api/VodTypeApi"
import { User, VodType } from "../../types"

export const SET_USERINFO = 'SET_USERINFO'
export const SET_TOKEN = 'SET_TOKEN'
export const SET_TYPES = 'SET_TYPES'

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

export const setTypes = (types: VodType[]) => {
    return {
        type: SET_TYPES,
        types
    }
}

export const fetchUserInfo = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const { data } = await AdminApi.getUserInfo()
        dispatch(setUserInfo(data.data))
    }
}

export const fetchTypes = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
    return async (dispatch: ThunkDispatch<{}, {}, AnyAction>): Promise<void> => {
        const { data } = await VodTypeApi.findAll()
        dispatch(setTypes(data.data))
    }
}

