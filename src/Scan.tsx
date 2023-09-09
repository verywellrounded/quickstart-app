import { BrowserMultiFormatReader } from "@zxing/library";
import { useRef, useEffect } from "react";
import Nav from "./Nav";

//TODO: Need to create a the ux around the scanning. And provide a exit button
export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) {
      console.log("Video ref not current");
      return;
    }
    const currentReader = reader.current;
    currentReader.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: "environment",
        },
      },
      videoRef.current,
      (result, error) => {
        if (result) console.log(result);
        if (error) console.log(error);
      }
    );
    return () => {
      currentReader.reset();
    };
  }, [videoRef]);

  return (
    <>
      <video ref={videoRef} />;
      <Nav />
    </>
  );
}
