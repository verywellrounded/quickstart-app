import { Logout } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useCookies } from "react-cookie";
import "./Home.css";
import Layout from "./Layout";

function Home(props: { userName?: string }) {
  const [cookies, , removeCookie] = useCookies(["userDetails"]);
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }

  const logout = async () => {
    const auth = getAuth();
    await auth.signOut();
    removeCookie("userDetails", { path: "/" });
    window.location.assign("/auth");
  };
  return (
    <>
      <Layout>
        <IconButton className="signOutButton" onClick={logout}>
          <Logout fontSize="large" />
        </IconButton>
        <div className={"welcomeBannerStyle"}>
          <h1>Welcome{" " + cookies.userDetails?.displayName}!</h1>
          <h2>You have successfully signed in.</h2>
          <h2>May the magic begin</h2>
        </div>
      </Layout>
    </>
  );
}

export default Home;
