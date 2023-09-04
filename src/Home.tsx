import { useCookies } from "react-cookie";

function Home(props: { userName?: string }) {
  const [cookies] = useCookies(["userDetails"]);
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }
  return (
    <>
      <h1>Welcome{" " + cookies.userDetails?.displayName}!</h1>
      <h2>You successfully signed in.</h2>
    </>
  );
}

export default Home;
