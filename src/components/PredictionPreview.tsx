import {
  CancelPresentation as CancelPresentationIcon,
  Done,
  Edit,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "..";
import { Receipt } from "../recieptItem";
import InventoryList from "./InventoryList";
import "./PredictionPreview.css";

type Props = { response: Receipt; isDuplicate: boolean };

/**
 * This is the screen that allows a user to modify the scan results
 * @param props
 * @returns
 */
const PredictionPreview = (props: Props) => {
  const navigate = useNavigate();
  const saveAndFinishScanFlow = async (e: unknown, props: Props) => {
    // Does type coercision from undefined to false help here any?
    // Undefined will happen if the catch block of scanReceipt is reached
    if (!props.isDuplicate) {
      // save to database
      const receiptsCollection = collection(db, "receipts");
      //TODO: Add linting for shadowing
      console.log("Log out local props not parent", props);
      const docRef = await addDoc(receiptsCollection, props.response);
      //TODO: Need some type of try catch cause this seems to cause issues alot
      console.log("saved receipt", docRef.id);
    }
    navigate("/foodbank");
  };
  const cancelPredictionPreview = (e: unknown) => {
    console.log("cancelled predication preview", e);
    window.location.reload();
  };
  const ButtonBar = (
    <>
      <div className="editMenu">
        <IconButton
          edge="end"
          className="closeButton"
          onClick={cancelPredictionPreview}
        >
          <CancelPresentationIcon fontSize="large" />
        </IconButton>
        <IconButton
          edge="end"
          className="cropButton"
          //   onClick={}
        >
          <Edit fontSize="large" />
        </IconButton>
        <IconButton
          className="AcceptButton"
          onClick={(e) => saveAndFinishScanFlow(e, props)}
        >
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
      <div className="responseDisplayContainer">
        {ButtonBar}
        {/* Should manage some coversion here to get count on recieptItem */}
        <InventoryList
          key={props.response.items.toLocaleString()}
          listItems={props.response.items}
        ></InventoryList>
      </div>
    </>
  );
};

export default PredictionPreview;
