import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { db } from "..";

export default function Auth() {
  const [error, setError] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies(["userDetails"]);

  // Instantiate the auth service SDK
  const auth = getAuth();

  if (cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/home");
  }
  // Handle user sign up with google
  const handleGoogleSignUp = async (e: any) => {
    e.preventDefault();

    // Instantiate a GoogleAuthProvider object
    const provider = new GoogleAuthProvider();

    try {
      // Sign in with a pop-up window
      // 💡Sign in with popup seems less error prone and still a smooth expereince
      const result = await signInWithPopup(auth, provider);

      // Pull signed-in user credential.
      const user = result.user;
      console.log("Signed in result", result);
      try {
        addDoc(collection(db, "users"), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          created: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          providerId: user.providerId,
        });
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      console.log("Signed in user creds", user);
      setCookie("userDetails", {
        uid: user.uid,
        displayName: user.displayName,
        token: user.getIdToken(false),
      });
      window.location.assign("/home");
    } catch (err: any) {
      // Handle errors here.
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/operation-not-allowed":
          setGoogleErrorMessage("Email/password accounts are not enabled.");
          break;
        case "auth/operation-not-supported-in-this-environment":
          setGoogleErrorMessage(
            "HTTP protocol is not supported. Please use HTTPS."
          );
          break;
        case "auth/popup-blocked":
          setGoogleErrorMessage(
            "Popup has been blocked by the browser. Please allow popups for this website."
          );
          break;
        case "auth/popup-closed-by-user":
          setGoogleErrorMessage(
            "Popup has been closed by the user before finalizing the operation. Please try again."
          );
          break;
        default:
          setGoogleErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <>
      <link rel="manifest" href="/manifest.json"></link>
      <h1>Authentication Page</h1>
      <div className="signupContainer">
        <div className="signupContainer__box__google">
          <button onClick={handleGoogleSignUp}>
            <span>
              <img src={"/googleLogo.svg"} alt="Google Logo" />
            </span>
            Sign Up with Google
          </button>
          {error && <p>{googleErrorMessage}</p>}
        </div>

        <div className="signupContainer__box__login">
          <p>
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
}
