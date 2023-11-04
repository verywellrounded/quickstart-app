import cv, { Point } from "@techstark/opencv-js";
import React, { useState } from "react";
import "./boarderDetector.css";

// cv = cv;

// componentDidMount() {
//     loadHaarFaceModels();
//   }

function TestPage(props: any) {
  //   const inputImgRef = useRef<HTMLCanvasElement>();
  const grayImgRef = React.createRef<HTMLCanvasElement>();
  const cannyEdgeRef = React.createRef<HTMLCanvasElement>();
  const boarderedImageRef = React.createRef<HTMLCanvasElement>();
  const [imageUrl, setImageUrl] = useState("");

  /////////////////////////////////////////
  //
  // process image with opencv.js
  //
  /////////////////////////////////////////
  function processImage(imgSrc: any) {
    const img = cv.imread(imgSrc);

    // to gray scale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
    cv.imshow(grayImgRef.current!, imgGray);

    // detect edges using Canny
    const edges = new cv.Mat();
    cv.Canny(imgGray, edges, 100, 100);
    cv.imshow(cannyEdgeRef.current!, edges);

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
      console.log("");
      console.log("");

      const contour = contours.get(i); // hoping this works
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
      const rect = cv.boundingRect(largestContour);
      const point1 = new Point(rect.x, rect.x + rect.width);
      const point2 = new Point(rect.y, rect.y + rect.height);
      console.log("edges", edges);
      console.log("rect", rect);
      console.log("line", cv.LINE_8);
      const rectColor = new cv.Scalar(0, 255, 0, 255); // Green color
      //   cv.rectangle(edges, rect, [0, 255, 0, 255]); //, 2, cv.LINE_8, 0);
      cv.rectangle(img, point1, point2, rectColor, 2, cv.LINE_8, 0);

      // Convert the Mat object back to canvas
      cv.imshow(boarderedImageRef.current!, img);
    }

    // need to release them manually
    img.delete();
    imgGray.delete();
    edges.delete();
  }

  return (
    <div>
      <div style={{ marginTop: "30px" }}>
        <span style={{ marginRight: "10px" }}>Select an image file:</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target && e.target.files && e.target.files[0]) {
              setImageUrl(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
      </div>

      {imageUrl && (
        <div className="images-container">
          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ The original image ↓↓↓</div>
            <img
              alt="Original input"
              src={imageUrl}
              onLoad={(e) => {
                processImage(e.target);
              }}
            />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ The gray scale image ↓↓↓</div>
            <canvas ref={grayImgRef} />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ Canny Edge Result ↓↓↓</div>
            <canvas ref={cannyEdgeRef} />
          </div>

          <div className="image-card">
            <div style={{ margin: "10px" }}>↓↓↓ Boardered Edge Result ↓↓↓</div>
            <canvas ref={boarderedImageRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default TestPage;
