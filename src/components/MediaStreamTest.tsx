import React, { useEffect, useRef } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import "./MediaStreamTest.css";

export const MediaStreamTest = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Function to access the user's camera and display it in the video element
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        console.log("Media Stream:", stream);
        if (videoRef.current && canvasRef.current) {
          console.log("Before stream:", videoRef.current.srcObject);
          videoRef.current.srcObject = stream;
          const videoWidth = videoRef.current.width;
          const videoHeight = videoRef.current.height;
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          console.log("After stream:", videoRef.current.srcObject);
          console.log("cocoSsd", cocoSsd);
          const model = await cocoSsd.load();

          const detectObjects = async () => {
            const canvas2d = canvasRef.current?.getContext("2d");
            if (canvas2d) {
              canvas2d.clearRect(
                0,
                0,
                canvas2d.canvas.width,
                canvas2d.canvas.height
              );
            }

            const predictions = await model.detect(videoRef.current!);
            // Extract boxes and classes

            predictions.forEach((prediction) => {
              const [x, y, width, height] = prediction["bbox"];
              const text = prediction["class"];

              // Set styling
              if (canvasRef.current) {
                const color = Math.floor(Math.random() * 16777215).toString(16);
                const canvas2d = canvasRef.current.getContext("2d");
                if (canvas2d) {
                  canvas2d.clearRect(
                    0,
                    0,
                    canvas2d.canvas.width,
                    canvas2d.canvas.height
                  );
                  canvas2d.strokeStyle = "#" + color;
                  canvas2d.font = "18px Arial";

                  // Draw rectangles and text
                  canvas2d.beginPath();
                  canvas2d.fillStyle = "#" + color;
                  canvas2d.fillText(text, x, y);
                  canvas2d.rect(x, y, width, height);
                  canvas2d.stroke();
                }
              }
            });

            console.log("Object predictions:", predictions);

            // You can use predictions to highlight the detected objects on the image
            // For simplicity, this example just logs the predictions
          };

          setInterval(async () => {
            await detectObjects();
          }, 3000);
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
      }
    };

    startVideo(); // Call the function to start the video stream

    // Cleanup: stop the video stream when the component unmounts
    return () => {
      if (videoRef.current) {
        const stream = (videoRef.current.srcObject as MediaStream) ?? undefined;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };
  }, []);
  return (
    <div className="videoContainer">
      <video ref={videoRef} width="640" height="480" autoPlay playsInline />
      <canvas
        className="annotationCanvas"
        ref={canvasRef}
        width="640"
        height="480"
      ></canvas>
    </div>
  );
};
