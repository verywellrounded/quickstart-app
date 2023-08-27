import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate(); // Strange that you have to declare the function here and cannot just import it
  return (
    <>
      <div className="loginButtonContainer">
        <button onClick={() => navigate("auth")}>Login/SignUp</button>
      </div>
      {/* <Signin app={getApp()} /> */}
    </>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
