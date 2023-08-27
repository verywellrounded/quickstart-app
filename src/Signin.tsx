import { auth } from "firebaseui";
import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { FirebaseApp } from "firebase/app";

// Learn about namespaces and basically how to import them

const createSigninUI = (app: FirebaseApp) => {
  const uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function (
        authResult: any,
        redirectUrl: any
      ) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
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
    const ui = new auth.AuthUI(getAuth(app));
    console.log("created an instance of authui", ui);
    ui.start("#firebaseui-auth-container", uiConfig);
  }
};

function Signin(props: { app: any }) {
  return (
    <>
      {createSigninUI(props.app)}
      <h1>Welcome to My Awesome App</h1>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </>
  );
}

export default Signin;
