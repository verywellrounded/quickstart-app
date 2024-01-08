import {
  CancelPresentation as CancelPresentationIcon,
  Crop,
  Done,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Receipt } from "../recieptItem";
import { scanReceipt } from "../utils";
import "./ImageUploadPreview.css";
import PredictionPreview from "./PredictionPreview";

type Props = {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

/**
 * This is the UI that displays the manually scanned receipt. It allows the user to discard the image, crop the image, or submit to call the scan API
 * @param props
 * @returns
 */
const ImageUploadPreview = (props: Props) => {
  const [imgSrcDataURL, setImgSrcDataURL] = useState("");
  const [responsePayload, setResponsePayload] = useState<Receipt>();
  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrcDataURL(reader.result?.toString() || "");
    });
    reader.readAsDataURL(props.file);
  });

  const clickedDoneButton = async (e: unknown) => {
    try {
      const response = await scanReceipt(imgSrcDataURL);
      setResponsePayload(response);
    } catch (e: unknown) {
      console.log(
        "Logging this error as we may need to retry to keep a good UX",
        e
      );
    }
  };

  const clickedCancelButton = () => {
    console.log("clickedCancel");
    window.location.reload();
  };

  const imageUI = (
    <>
      <div className="cropMenu">
        <IconButton className="closeButton" onClick={clickedCancelButton}>
          <CancelPresentationIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="cropButton"
          // onClick={clickedCancelButton}
        >
          <Crop fontSize="large" />
        </IconButton>
        <IconButton className="AcceptButton" onClick={clickedDoneButton}>
          <Done fontSize="large" />
        </IconButton>
      </div>

      <div className="imageContainer">
        <img alt="uploadedImage" src={imgSrcDataURL}></img>
      </div>
    </>
  );

  return (
    <>
      {/* Need to figure out a good way to handle the error response before getting back to the render function */}
      {responsePayload ? (
        <PredictionPreview response={responsePayload} />
      ) : (
        imageUI
      )}
    </>
  );
};

export default ImageUploadPreview;
