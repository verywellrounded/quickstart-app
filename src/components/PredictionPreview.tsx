import { CancelPresentation, Done, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import {
  DocumentReference,
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "..";
import { Receipt, ReceiptItem } from "../recieptItem";
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
  //TODO: Maybe change to edit top level reciept things too?
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
    } else if (props.isDuplicate && !isItemsUnedited()) {
      const receiptsCollection = collection(db, "receipts");
      const q = query(
        receiptsCollection,
        where("uuid", "==", props.response.uuid)
        // where("originalFileHash", "==", props.response.originalFileHash)
      );
      const querySnapshot = await getDocs(q);
      console.log(`Retrieved ${querySnapshot.size} docs`);
      if (querySnapshot.size > 1) {
        console.warn(
          `There are duplicate records with uuid: ${props.response.uuid}`
        );
      }

      const docReceiptMap: { docRef: DocumentReference; receipt: Receipt }[] =
        querySnapshot.docs.map((doc) => {
          console.log("doc data", doc.data());
          console.log("doc metadata", doc.metadata);
          const receipt = { ...(doc.data() as unknown as Receipt) };
          console.log("receipt", receipt);
          return { docRef: doc.ref, receipt };
        });
      // only update the first if there are duplicates
      const firstDoc = docReceiptMap[0];
      firstDoc.receipt.items = predictionPreviewItems;
      try {
        await updateDoc(firstDoc.docRef, firstDoc.receipt);
      } catch (e: any) {
        console.error(`Failed to update first document in ${docReceiptMap}`, e);
        //TODO: What should we do here ? Can the user fix this ?
      }
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
