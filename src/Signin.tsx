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
    signInOptions: [
      // List of OAuth providers supported.
      GoogleAuthProvider.PROVIDER_ID,
      FacebookAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
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
