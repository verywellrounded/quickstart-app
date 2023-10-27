import { useNavigate } from "react-router-dom";
import "./App.css";

// TODO: Need to check auth is good here and redirect to home.

function App() {
  const navigate = useNavigate(); // Strange that you have to declare the function here and cannot just import it
  return (
    <>
      <link rel="manifest" href="/manifest.json"></link>
      <div className="loginButtonContainer">
        <button onClick={() => navigate("auth")}>Login/SignUp</button>
      </div>
      {/* <Signin app={getApp()} /> */}
    </>
  );
}

export default App;
