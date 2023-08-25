import googleLogo from './logo.svg';
import { Link } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth
} from "firebase/auth";
import { useState } from "react";

const GoogleSignUp = () => {
  const [error, setError] = useState(false);
  const [googleErrorMessage, setGoogleErrorMessage] = useState("");

  // Instantiate the auth service SDK
  const auth = getAuth();

  // Handle user sign up with google
  const handleGoogleSignUp = async (e: any) => {
    e.preventDefault();

     // Instantiate a GoogleAuthProvider object
    const provider = new GoogleAuthProvider();
    
    try {
      // Sign in with a pop-up window
      const result = await signInWithPopup(auth, provider);

      // Pull signed-in user credential.
      const user = result.user;
    } catch (err:any) {
      // Handle errors here.
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/operation-not-allowed":
          setGoogleErrorMessage("Email/password accounts are not enabled.");
          break;
        case "auth/operation-not-supported-in-this-environment":
          setGoogleErrorMessage("HTTP protocol is not supported. Please use HTTPS.")
          break;
        case "auth/popup-blocked":
          setGoogleErrorMessage("Popup has been blocked by the browser. Please allow popups for this website.")
          break;
        case "auth/popup-closed-by-user":
          setGoogleErrorMessage("Popup has been closed by the user before finalizing the operation. Please try again.")
          break;
        default:
          setGoogleErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <>
    <p>Testing</p>
    <div className='signupContainer'>
      <div className='signupContainer__box__google'>
        <button onClick={handleGoogleSignUp}>
          <span>
            <img src={googleLogo} alt='Google Logo' />
          </span>
            Sign Up with Google
        </button>
          {error && <p>{googleErrorMessage}</p>}
      </div>

          <div className='signupContainer__box__login'>
            <p>
              Already have an account? <a href='/signin'>Sign In</a>
            </p>
          </div>
    </div>
    </>
  );
};

export default GoogleSignUp;