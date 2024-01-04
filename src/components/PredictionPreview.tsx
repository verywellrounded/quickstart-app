import React from "react";
import { IconButton } from "@mui/material";
import {
  CancelPresentation as CancelPresentationIcon,
  Edit,
  Done,
} from "@mui/icons-material";
import "./PredictionPreview.css";
import { useNavigate } from "react-router-dom";

type Props = { response: unknown };

const PredictionPreview = (props: Props) => {
  const navigate = useNavigate();
  const saveAndFinishScanFlow = (e: unknown) => {
    // save to database
    navigate("/home");
  };
  const ButtonBar = (
    <>
      <div className="editMenu">
        <IconButton
          className="closeButton"
          //   onClick={}
        >
          <CancelPresentationIcon fontSize="large" />
        </IconButton>
        <IconButton
          className="cropButton"
          //   onClick={}
        >
          <Edit fontSize="large" />
        </IconButton>
        <IconButton className="AcceptButton" onClick={saveAndFinishScanFlow}>
          <Done fontSize="large" />
        </IconButton>
      </div>
    </>
  );
  return (
    <>
      <div className="titleDiv">
        <h1>PredictionPreview</h1>
      </div>
      {ButtonBar}
      <div className="responseDisplayContainer">
        <pre>
          <code> {JSON.stringify(props.response, null, "  ")} </code>
        </pre>
      </div>
    </>
  );
};

export default PredictionPreview;
