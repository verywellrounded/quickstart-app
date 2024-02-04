import {
  GoogleAuthProvider,
  User,
  UserCredential,
  getAuth,
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { db } from "..";
import { isIos } from "../utils";

export default function Auth() {
  const [error, setError] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");
  const [cookies, setCookie] = useCookies(["userDetails"]);

  async function saveUserInfo(user: User) {
    try {
      //TODO: Could caching be implemented here to save of reads/ writes ?
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("email", "==", user.email));
      // Check if user is already stored
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If so then update last login
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(db, "users", docId), {
          lastLogin: user.metadata.lastSignInTime,
        });
        console.log("Updated written with ID: ", docId);
      } else {
        //If not save
        const docRef = await addDoc(usersCollection, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          created: user.metadata.creationTime,
          lastLogin: user.metadata.lastSignInTime,
          providerId: user.providerId,
        });
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    console.log("Signed in user creds", user);
  }

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
    let result: UserCredential | null = null;
    try {
      // Sign in with a pop-up window
      // 💡Sign in with popup seems less error prone and still a smooth expereince
      result = await signInWithPopup(auth, provider);

      // Pull signed-in user credential.
      const user = result.user;
      console.log("Signed in result", result);
      await saveUserInfo(user);
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
          console.log("Pop up blocked. Trying redirect");
          await signInWithRedirect(auth, provider);
          result = await getRedirectResult(auth);

          // setGoogleErrorMessage(
          //   "Popup has been blocked by the browser. Please allow popups for this website."
          // );
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

    if (null !== result) {
      const user = result.user;
      console.log("Signed in result", result);
      saveUserInfo(user);
    } else {
      console.log("login failed. Result is null", result);
    }
    window.location.assign("/home");
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
