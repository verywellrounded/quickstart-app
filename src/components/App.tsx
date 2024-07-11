import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./App.css";
import Layout from "./Layout";

// TODO: Should change this to the preauth experience. And make auth the landing page.
function App() {
  const navigate = useNavigate(); // Strange that you have to declare the function here and cannot just import it
  const [cookies] = useCookies(["userDetails"]);
  if (cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/home");
  }
  return (
    <Layout displayNavBar={true}>
      <span className="bannerText">
        <h1> Nutritionist</h1>
      </span>
      <Button
        variant="contained"
        className="signInButton"
        onClick={() => navigate("auth")}
      >
        Login/SignUp
      </Button>
    </Layout>
  );
}

export default App;
