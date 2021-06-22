import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './reducers/user'
import vod from './reducers/vod'

const reducer = combineReducers({ user, vod })

const persistConfig = {
    key: '__dd__',
    storage,
  }
  
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor =persistStore(store)

export type AppState = ReturnType<typeof reducer>