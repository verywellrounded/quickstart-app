import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Auth from "./Auth";
import Home from "./Home";
import Signin from "./Signin";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import * as serviceWorker from "./serviceWorkerRegistration";
import Scan from "./Scan";
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
export const db = getFirestore(app);
//use emulator
connectFirestoreEmulator(db, "127.0.0.1", 9098);
const analytics = getAnalytics(app);
// firebase login
// firebase init
// firebase deploy

const initApp = () => {
  onAuthStateChanged(
    getAuth(),
    (user) => {
      if (user) {
        // User is signed in.
      } else {
        // User is signed out.
      }
    },
    function (error) {
      console.log(error);
    }
  );
};

window.addEventListener("load", function () {
  initApp();
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    // { path: "/signin", element:<Signin />},
    { path: "/home", element: <Home /> },
    { path: "/auth", element: <Auth /> },
    { path: "/signin", element: <Signin /> },
    { path: "/foodbank", element: <Signin /> },
    { path: "/explore", element: <Signin /> },
    { path: "/scan", element: <Scan /> },
  ]
  // createRoutesFromElements(
  //   <Route path="/" element={<App />}>
  //     <Route path="/signin" element={<Signin />} />
  //   </Route>
  // )
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
//TODO: Put an nice splash page here with options to login or view info
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
    {/* 💡 When using router we dont need to also declare component here. Since / is the location the router will automatically render the element that matches the path */}
  </React.StrictMode>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
