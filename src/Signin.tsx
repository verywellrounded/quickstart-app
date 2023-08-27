import { getApp } from "firebase/app";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  UserCredential,
} from "firebase/auth";
import { auth } from "firebaseui";
import "./Signin.css";
// Learn about namespaces and basically how to import them

const createSigninUI = () => {
  const uiConfig = {
    callbacks: {
      // 💡 With out using the GoogleAuthProvider it hard to capture that return value
      signInSuccessWithAuthResult: function (
        authResult: UserCredential,
        redirectUrl: string
      ) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.

        //TODO: if i dont redirect then i can log. But i can process this result and save in the db etc
        console.log("The is the auth result", authResult);
        console.log("The is the redirecturl", redirectUrl);
        return true;
      },
      uiShown: function () {
        // The widget is rendered.
        // Hide the loader.
        let loader = document.getElementById("loader");
        if (loader) {
          loader.style.display = "none";
        }
      },
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: "popup",
    signInSuccessUrl: "home",
    signInOptions: [
      // List of OAuth providers supported.
      GoogleAuthProvider.PROVIDER_ID,
      FacebookAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
    ],
    // Terms of service url.
    tosUrl: "<your-tos-url>",
    // Privacy policy url.
    privacyPolicyUrl: "<your-privacy-policy-url>",
  };
  if (auth.AuthUI.getInstance()) {
    const ui = auth.AuthUI.getInstance();
    console.log("got an instance of authui", ui);
    ui?.start("#firebaseui-auth-container", uiConfig);
  } else {
    const app = getApp();
    console.log("getApp", app);
    const ui = new auth.AuthUI(getAuth(app));
    console.log("created an instance of authui", ui);
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};

function Signin() {
  return (
    <>
      {createSigninUI()}
      <h1>Welcome to My Awesome App</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </>
  );
}

export default Signin;
