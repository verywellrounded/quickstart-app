import React, { useEffect, useState } from "react";
import "./ImageUploadPreview.css";
import { IconButton } from "@mui/material";
import {
  CancelPresentation as CancelPresentationIcon,
  Crop,
  Done,
} from "@mui/icons-material";
import { scanReceipt } from "../utils";
import { AxiosResponse } from "axios";
import PredictionPreview from "./PredictionPreview";
import { useNavigate } from "react-router-dom";

type Props = {
  file: File;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
};

const ImageUploadPreview = (props: Props) => {
  const [imgSrcDataURL, setImgSrcDataURL] = useState("");
  const [responsePayload, setResponsePayload] = useState<
    AxiosResponse<any, any> | undefined
  >(undefined);
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
      {responsePayload?.status ? (
        <PredictionPreview response={responsePayload} />
      ) : (
        imageUI
      )}
    </>
  );
};

export default ImageUploadPreview;
