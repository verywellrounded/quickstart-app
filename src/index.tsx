import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Auth from "./Auth";
// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import Signin from "./Signin";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxsmHrG840LGceMdGmWsRAf7tYt_abXu8",
  authDomain: "new-tritionist.firebaseapp.com",
  projectId: "new-tritionist",
  storageBucket: "new-tritionist.appspot.com",
  messagingSenderId: "1026041567712",
  appId: "1:1026041567712:web:e5f407aeb63ee015887385",
  measurementId: "G-HQLDYFN4L2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// firebase login
// firebase init
// firebase deploy

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <Auth />
    <Signin app={app} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
