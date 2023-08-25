import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Auth from "./Auth";
import Signin from "./Signin";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
    },
    // { path: "/signin", element:<Signin />},
  ]
  // createRoutesFromElements(
  //   <Route path="/" element={<App />}>
  //     <Route path="/signin" element={<Signin />} />
  //   </Route>
  // )
);

function App() {
  return (
    <RouterProvider router={router} />
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
