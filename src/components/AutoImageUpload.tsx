import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import { IconButton } from "@mui/material";
import cv from "@techstark/opencv-js";
import { useEffect, useRef, useState } from "react";
import "./AutoImageUpload.css";

export const AutoImageUpload = (props: {
  isShowUpload: boolean;
  setIsShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);

  useEffect(() => {
    // Function to access the user's camera and display it in the video element
    // Access user env camera, screenshot every two seconds, feed image to opencv or tensorflow to get bounded region paint rectangle one edge at a time to show progressive boarder
    // once boarder is complete send image to mindee
    function processImage(imgSrc: any) {
      console.log("imgSrc", imgSrc);
      const img = cv.imread(imgSrc);

      // to gray scale
      const imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);

      // detect edges using Canny
      const edges = new cv.Mat();
      cv.Canny(imgGray, edges, 100, 100);

      // detect faces using Haar-cascade Detection
      // Find contours in the edge image
      const contours: any = new cv.MatVector();
      const hierarchy = new cv.Mat();
      console.log(
        "About to find contours",
        edges,
        contours,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );
      cv.findContours(
        edges,
        contours,
        hierarchy,
        cv.RETR_EXTERNAL,
        cv.CHAIN_APPROX_SIMPLE
      );

      // Find the largest contour, which should be the receipt
      let maxArea = -1;
      let maxContourIndex = -1;
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        console.log("current Contour", contour);
        const area = cv.contourArea(contour);
        console.log("current contour aread", area);
        if (area > maxArea) {
          console.log("previous max contour index", maxContourIndex);
          maxArea = area;
          maxContourIndex = i;
          console.log("current max contour index", maxContourIndex);
        }
      }

      if (maxContourIndex !== -1) {
        const largestContour = contours.get(maxContourIndex);
        console.log("We found a max contour", largestContour);

        // Draw a rectangle around the receipt
        const rectColor = new cv.Scalar(0, 255, 0, 255); // Green color

        cv.drawContours(
          img,
          contours,
          maxContourIndex,
          rectColor,
          1,
          cv.LINE_8,
          hierarchy,
          100
        );
        // Convert the Mat object back to canvas
        cv.imshow(canvasRef.current!, img);
      }

      // need to release them manually
      img.delete();
      imgGray.delete();
      edges.delete();
    }

    const screenShot = async (mStream: MediaStream) => {
      const track = mStream.getVideoTracks()[0];
      if ("ImageCapture" in window) {
        const imageCapture = new ImageCapture(track);
        console.log(imageCapture);
        return imageCapture;
      } else {
        console.log("API not supported in current browser");
        return undefined;
      }
    };

    const scanForBoarder = async (mStream: MediaStream) => {
      const imageCap = await screenShot(mStream);
      // can get either frame or blob
      try {
        const blob = await imageCap?.takePhoto();
        if (!blob) {
          throw new Error("Blob was undefined");
        }

        setImageUrl(URL.createObjectURL(blob));
        // find a way to get imageurl to imageElementRef
        console.log("blob", blob);
        if (blob) {
          processImage(imageElementRef.current);
        }
        setShowCloseButton(true);
      } catch (e) {
        console.log("unable to take photo or process image", e);
        setShowCloseButton(true);
      }
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        console.log("Media Stream:", stream);
        if (videoRef.current && canvasRef.current) {
          console.log("Before stream:", videoRef.current.srcObject);
          videoRef.current.srcObject = stream;
          // const videoWidth = videoRef.current.width;
          const videoHeight = videoRef.current.height;
          // canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          console.log("After stream:", videoRef.current.srcObject);
          setInterval(async () => {
            try {
              await scanForBoarder(stream);
            } catch (e) {
              console.log("error scanningForBoarder", e);
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };
    // Access user env camera,
    startVideo(); // Call the function to start the video stream
    // Cleanup: stop the video stream when the component unmounts
    return () => {
      if (videoRef.current) {
        const stream = (videoRef.current.srcObject as MediaStream) ?? undefined;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
      setShowCloseButton(false);
    };
  }, []);

  const closeFullScreenCapture = (event: unknown) => {
    props.setIsShowUpload(true);
  };

  return (
    <div className="componentContainer">
      <>
        <div className="videoContainer">
          <video
            ref={videoRef}
            width="100%"
            height="480"
            autoPlay
            playsInline
          />
          <canvas
            className="annotationCanvas"
            ref={canvasRef}
            width="100%"
            height="480"
          ></canvas>
          {showCloseButton && (
            <IconButton
              className="closeButton"
              onClick={closeFullScreenCapture}
            >
              <CancelPresentationIcon fontSize="large" />
            </IconButton>
          )}
        </div>

        <img
          width="100%"
          height="480"
          hidden={false}
          alt={"n/a"}
          ref={imageElementRef}
          src={imageUrl}
        ></img>
      </>
    </div>
  );
};
