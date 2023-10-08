import { PropsWithChildren } from "react";
import "./Layout.css";
import "./Scan.css";

// Importing all created components
import Nav from "./Nav";

// Pass the child props
export default function Layout(props: PropsWithChildren<{}>) {
  return (
    <>
      {props.children}
      <Nav className={"navcontainer"} />
    </>
  );
}
