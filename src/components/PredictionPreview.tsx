import { CancelPresentation, Done, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { addDoc, collection, where } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "..";
import { Receipt, ReceiptItem } from "../receiptItem";
import { updateDocument } from "../utils";
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
  console.log("rendering prediction preview", props);
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [predictionPreviewItems, setPredictionPreviewItems] = useState<
    ReceiptItem[]
  >(props.response.items);

  const isItemsUnedited = () => {
    if (props.response.items.length !== predictionPreviewItems.length) {
      return false;
    } else {
      for (let i = 0; i < props.response.items.length; i++) {
        if (props.response.items[i] !== predictionPreviewItems[i]) {
          return false;
        }
      }
    }
    return true;
  };
  //TODO: Maybe change to edit top level receipt things too?
  const saveAndFinishScanFlow = async (e: unknown, props: Props) => {
    // Does type coercion from undefined to false help here any?
    // Undefined will happen if the catch block of scanReceipt is reached
    if (!props.isDuplicate) {
      // save to database
      const receiptsCollection = collection(db, "receipts");
      //TODO: Add linting for shadowing
      console.log("Log out local props not parent", props);
      const docRef = await addDoc(receiptsCollection, props.response);
      //TODO: Need some type of try catch cause this seems to cause issues alot
      console.log("saved receipt", docRef.id);
    } else if (props.isDuplicate && !isItemsUnedited()) {
      await updateDocument(
        "receipts",
        where("uuid", "==", props.response.uuid),
        {
          ...props.response,
          items: predictionPreviewItems,
        }
      );
    }
    navigate("/foodbank");
  };
  const cancelPredictionPreview = (e: unknown) => {
    console.log("cancelled predication preview", e);
    window.location.reload();
  };

  const clickedEditButton = (e: unknown) => {
    // set state to be clicked
    console.log("clicked edit button, isEditable before click", isEditable);
    setIsEditable(!isEditable);
    console.log("isEditableState after click", isEditable);
  };

  const ButtonBar = (isEditView: boolean) => {
    if (isEditView) {
      // let child button bar take over
      return undefined;
    } else {
      return (
        <>
          <div className="editMenu">
            <IconButton
              edge="end"
              className="closeButton"
              onClick={cancelPredictionPreview}
            >
              <CancelPresentation fontSize="large" />
            </IconButton>
            <IconButton
              edge="end"
              className="cropButton"
              onClick={clickedEditButton}
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
    }
  };

  return (
    <>
      <div className="titleDiv">
        <h1>PredictionPreview</h1>
      </div>
      <div className="responseDisplayContainer">
        {ButtonBar(isEditable)}
        {/* Should manage some coversion here to get count on recieptItem */}
        <InventoryList
          key={predictionPreviewItems.toLocaleString()}
          listItems={predictionPreviewItems}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          setPredictionPreviewItems={setPredictionPreviewItems}
        ></InventoryList>
      </div>
    </>
  );
};

export default PredictionPreview;
