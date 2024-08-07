import React, { useRef, useState } from "react";

import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";

import axios from "axios";
import "react-image-crop/dist/ReactCrop.css";
import "./ImageCropper.css";
import "./Scan.css";
import { useDebounceEffect } from "../debounceEffect";
import { scanReceipt } from "../utils";

const TO_RADIANS = Math.PI / 180;

export async function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
  scale = 1,
  rotate = 0
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);
  console.log("canvas object", canvas);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  const rotateRads = rotate * TO_RADIANS;
  const centerX = image.naturalWidth / 2;
  const centerY = image.naturalHeight / 2;

  ctx.save();

  // 5) Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // 4) Move the origin to the center of the original position
  ctx.translate(centerX, centerY);
  // 3) Rotate around the origin
  ctx.rotate(rotateRads);
  // 2) Scale the image
  ctx.scale(scale, scale);
  // 1) Move the center of the image to the origin (0,0)
  ctx.translate(-centerX, -centerY);
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight
  );

  ctx.restore();
}

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  console.log("Centering crop", mediaWidth, mediaHeight, aspect);
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function App() {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      console.log("event", e);
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(e.target.files[0]);
      setAspectOnSelectImage();
    }
  }

  function onDownloadCropClick() {
    let blobType = "";
    if (!previewCanvasRef.current) {
      throw new Error("Crop canvas does not exist");
    }
    console.log("previewCanvasRef", previewCanvasRef);
    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create blob");
      }
      console.log("oldBlob", blob);
      if (blobUrlRef.current) {
        console.log("revoke Object url", blob);
        URL.revokeObjectURL(blobUrlRef.current);
        console.log("blob after revoke Object Url", blob);
      }
      blobUrlRef.current = URL.createObjectURL(blob);
      console.log("newBlob", blobUrlRef.current);
      blobType = blob.type;
      hiddenAnchorRef.current!.href = blobUrlRef.current;
      hiddenAnchorRef.current!.click();
    });
    //TODO: Redirect with result from ocr to confirm screen with manual correction
    const base64ImageUrl = previewCanvasRef.current
      .toDataURL("image/png")
      .split(";base64,")[1];

    // How to get file size from canvas  https://stackoverflow.com/questions/18557497/how-to-get-html5-canvas-todataurl-file-size-in-javascript
    const fileSize = window.atob(
      previewCanvasRef.current.toDataURL(blobType).split(",")[1]
    ).length;
    console.log("image size in bytes", fileSize);
    console.log("image size in mb", fileSize / 1000000);
    //need ref for file if going to use this anymore
    // scanReceipt(base64ImageUrl);
    // window.location.assign("/home");
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    completedCrop,
    scale,
    rotate
  );

  function setAspectOnSelectImage() {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, 16 / 9);
      setCrop(newCrop);
      // Updates the preview
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }

  return (
    // <div className="imageCropperContainer">
    <>
      <div className="cropControls">
        <div className="fileInput">
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <div className="scaleDiv">
          <label htmlFor="scale-input">Scale: </label>
          <input
            id="scale-input"
            type="number"
            step="0.1"
            value={scale}
            disabled={!imgSrc}
            onChange={(e) => setScale(Number(e.target.value))}
          />
        </div>
        <div className="rotateDiv">
          <label htmlFor="rotate-input">Rotate: </label>
          <input
            id="rotate-input"
            type="number"
            value={rotate}
            disabled={!imgSrc}
            onChange={(e) =>
              setRotate(Math.min(180, Math.max(-180, Number(e.target.value))))
            }
          />
        </div>
        {!!completedCrop && (
          <div className="completedCropContainer">
            <div className="previewCanvas">
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "5px solid green",
                  objectFit: "contain",
                  width: completedCrop.width,
                  height: completedCrop.height,
                }}
              />
            </div>
            <div className="submitCropButtonContainer">
              <button onClick={onDownloadCropClick}>Submit Crop</button>
              <a
                href="#hidden"
                ref={hiddenAnchorRef}
                download
                style={{
                  position: "absolute",
                  top: "-200vh",
                  visibility: "hidden",
                }}
              >
                Hidden download
              </a>
            </div>
          </div>
        )}
      </div>
      {/* @ts-ignore: popover is valid html now */}
      <div className="imageContainer" id="imageContainer" x>
        {!!imgSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => {
              console.log("percentCrop", percentCrop);
              setCrop(percentCrop);
            }}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
            minWidth={400}
            minHeight={200}
          >
            <img
              ref={imgRef}
              width="100%"
              height="100%"
              alt="Crop me"
              src={imgSrc}
              style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            />
          </ReactCrop>
        )}
      </div>
    </>
    // </div>
  );
}

//TODO: Fix css on crop. Make aspect madtory. And send the crop to API
