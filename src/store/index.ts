import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import user from './reducers/user'

const reducer = combineReducers({ user })

const persistConfig = {
    key: '__dd__',
    storage,
  }
  
const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(persistedReducer, applyMiddleware(thunk))
export const persistor =persistStore(store)

export type AppState = ReturnType<typeof reducer>