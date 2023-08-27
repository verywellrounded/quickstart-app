// ReactDOM.hydrateRoot(document.getElementById("root") as HTMLElement, <Home />);

// TOOD: // hydreate root or root .render ?
// root.render(
//   <React.StrictMode>
//     <Home></Home>
//   </React.StrictMode>
// );

//TODO: need to check if auth is here or redirect to signin
function Home() {
  return (
    <>
      <h2>You successfully signed in.</h2>
    </>
  );
}

export default Home;
