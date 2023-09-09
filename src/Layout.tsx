import { PropsWithChildren } from "react";
import "./Layout.css";

// Importing all created components
import Nav from "./Nav";

// Pass the child props
export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <div className="appContainer">
      {props.children}
      <Nav />
    </div>
  );
}
