import { PropsWithChildren } from "react";
import "./Layout.css";
import "./Scan.css";

// Importing all created components
import Nav from "./Nav";

interface propsWithChildrenPlus extends PropsWithChildren {
  displayNavBar?: boolean;
}
const defaultPropsWithChildrenPlus: propsWithChildrenPlus = {
  displayNavBar: false,
};

// Pass the child props
export default function Layout(props: typeof defaultPropsWithChildrenPlus) {
  return (
    <>
      <div className="layoutContainer">
        <link rel="manifest" href="/manifest.json"></link>
        {props.children}
        {props.displayNavBar ?? <Nav className={"navcontainer"} />}
      </div>
    </>
  );
}
