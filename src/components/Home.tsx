import { useCookies } from "react-cookie";
import Layout from "./Layout";

const welcomeBannerStyle = {
  border: "solid 1px navy",
  display: "grid",
  "grid-column-start": "col2",
  "grid-column-end": "endCol",
  "grid-row-start": "row2",
  height: "100%",
  width: "100%",
  "justify-items": "center" /* Center horizontally */,
  "place-items": "center",
};

function Home(props: { userName?: string }) {
  const [cookies] = useCookies(["userDetails"]);
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }
  return (
    <>
      <Layout>
        <div style={welcomeBannerStyle}>
          <h1>Welcome{" " + cookies.userDetails?.displayName}!</h1>
          <h2>You have successfully signed in.</h2>
          <h2>May the magic begin</h2>
        </div>
      </Layout>
    </>
  );
}

export default Home;
