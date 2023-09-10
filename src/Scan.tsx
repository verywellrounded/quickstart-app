import { BrowserMultiFormatReader } from "@zxing/library";
import { useRef, useEffect } from "react";
import Nav from "./Nav";

//TODO: Need to create a the ux around the scanning. And provide a exit button
export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  const onBlur = () => {
    reader.current.reset();
  };
  const onFocus = () => {
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
        if (result) {
          console.log(result);
          if (resultRef.current) {
            resultRef.current.textContent = result.getText();
            currentReader.reset();
          }
        }
        // if (error) console.log(error);
      }
    );
  };

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    // Calls onFocus when the window first loads
    onFocus();
    const currentReader = reader.current;

    return () => {
      currentReader.reset();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [videoRef]);

  return (
    <>
      <video ref={videoRef} />
      <button
        onClick={(e) => {
          console.log(reader.current.reset());
          console.log("Close clicked. Resetting reader");
        }}
      >
        close
      </button>
      <textarea ref={resultRef}></textarea>
      <Nav />
    </>
  );
}
