import { AnyAction } from 'redux'
import { VodType } from '../../types'
import { SET_TYPES } from '../actions'

type TypesMap = {
    [typeId: number]: string
}

export type VodState = {
    types: VodType[],
    typesMap: TypesMap
}

const initState = {
    types: [],
    typesMap: {}
}


function vod(state: VodState = initState, action: AnyAction) {
    switch (action.type) {
        case SET_TYPES:
            const typesMap: TypesMap = {}
            for(let i = 0; i < action.types.length; i++) {
                typesMap[action.types[i].typeId] = action.types[i].typeName
            }
            return { ...state, types: action.types, typesMap }
        default:
            return state
    }
}

export default vod