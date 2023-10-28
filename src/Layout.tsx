import { PropsWithChildren } from "react";
import "./Layout.css";
import "./Scan.css";

// Importing all created components
import Nav from "./Nav";

// Pass the child props
export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <>
      <div className="layoutContainer">
        <link rel="manifest" href="/manifest.json"></link>
        {props.children}
        <Nav className={"navcontainer"} />
      </div>
    </>
  );
}
