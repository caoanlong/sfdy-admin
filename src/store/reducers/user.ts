import { AnyAction } from 'redux'
import { User } from '../../types'
import { SET_USERINFO, SET_TOKEN } from '../actions'

export type UserState = {
    userInfo: User,
    token: string
}

const initState = {
    userInfo: {},
    token: ''
}


function user(state: UserState = initState, action: AnyAction) {
    switch (action.type) {
        case SET_USERINFO:
            return { ...state, userInfo: action.userInfo }
        case SET_TOKEN:
            return { ...state, token: action.token }
        default:
            return state
    }
}

export default user