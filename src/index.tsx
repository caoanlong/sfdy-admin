import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app"
import "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBu0HZe7ZFXBh_gBkfqXoMwAP-hjZQ9jZ0",
  authDomain: "jyav-3728d.firebaseapp.com",
  databaseURL: "https://jyav-3728d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jyav-3728d",
  storageBucket: "jyav-3728d.appspot.com",
  messagingSenderId: "464543886366",
  appId: "1:464543886366:web:23b57381b8d8aaf7fa920f",
  measurementId: "G-H0S6J67LXG"
}

firebase.initializeApp(firebaseConfig)
export const storage = firebase.storage()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
