import { useCookies } from "react-cookie";
import Layout from "./Layout";

function Home(props: { userName?: string }) {
  const [cookies] = useCookies(["userDetails"]);
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }
  return (
    <>
      <Layout>
        <div className="layout"></div>
        <h1>Welcome{" " + cookies.userDetails?.displayName}!</h1>
        <h2>You successfully signed in.</h2>
      </Layout>
    </>
  );
}

export default Home;
