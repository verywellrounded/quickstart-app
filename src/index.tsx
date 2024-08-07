import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Auth from "./components/Auth";
import FoodInventory from "./components/FoodInventory";
import Home from "./components/Home";
import Scan from "./components/Scan";
import "./index.css";
import * as serviceWorker from "./serviceWorkerRegistration";
import { firebaseConfig } from "./utils";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//use emulator Need to be commented out in prod
// connectFirestoreEmulator(db, "127.0.0.1", 9098);
const analytics = getAnalytics(app);
// firebase login
// firebase init
// firebase deploy

const initApp = () => {
  onAuthStateChanged(
    getAuth(),
    (user) => {
      if (user) {
        console.log("User is signed in.");
      } else {
        console.log("User is signed out.");
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
// reroute projectId.web.app domain to projectId.firebaseapp.com to lessen confusion about the redirect issue
// https://firebase.google.com/docs/auth/web/redirect-best-practices
// https://stackoverflow.com/questions/61396081/how-to-turn-off-default-domain-in-firebase-hosting-firebase
window.addEventListener("load", function () {
  if (window.location.hostname === `${firebaseConfig.projectId}.web.app`) {
    window.location.href = `http://${firebaseConfig.authDomain}`;
  }
});

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    { path: "/home", element: <Home /> },
    { path: "/auth", element: <Auth /> },
    { path: "/foodbank", element: <FoodInventory /> },
    // { path: "/explore", element: <Explore /> },
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
