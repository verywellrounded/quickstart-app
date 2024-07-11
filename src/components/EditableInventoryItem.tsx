import { Add, CancelPresentation, Delete, Done } from "@mui/icons-material";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
} from "@mui/material";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { ReceiptItem } from "../receiptItem";
type Props = {
  listItems: ReceiptItem[];
  setIsEditable: any;
  setPredictionPreviewItems: React.Dispatch<
    React.SetStateAction<ReceiptItem[]>
  >;
};

/**
 * Wrapping mui list.
 * @param props
 * @returns
 */
const EditableInventoryItem = (props: Props) => {
  console.log("rendering EditableInventoryItem", props);
  // make a local copy of the items pre edit on only the first render
  const [localCopyListItems, setLocalCopyListItems] = useState<ReceiptItem[]>(
    _.cloneDeep(props.listItems)
  );
  //💡 useRef can be mutable or immutable depending on if the initialize param is in the union type of the ref
  const listItemRef = useRef<HTMLLIElement>(null);
  const deleteButtonRef = useRef<SVGSVGElement | null>(null);
  const acceptEdits = (e: unknown) => {
    //when done is clicked here user is willing to accept changes so set state to localCopy if not clicked we don't set predicationPreviewItems thus reverting to the original state
    props.setIsEditable(true);
    console.log("original items", props.listItems);
    console.log("updated items", localCopyListItems);
    props.setPredictionPreviewItems(localCopyListItems!);
    props.setIsEditable(false);
  };

  // TODO: plumbing for implementing some animation to only see the delete icon when swipe left
  let touchStart: number | null = null; //, setTouchStart] = useState<number | null>(null);
  let touchEnd: number | null = null; //, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (event: any) => {
    touchEnd = null;
    touchStart = event.targetTouches[0].clientX;
    // setTouchEnd(null);
    // setTouchStart(event.targetTouches[0].clientX); // left right)
  };

  const onTouchMove = (event: any) => {
    touchEnd = event.targetTouches[0].clientX;
    // setTouchEnd(event.targetTouches[0].clientX); // left right)
  };

  const onTouchEnd = (event: any) => {
    if (touchStart && touchEnd) {
      if (touchEnd < touchStart) {
        //  swiped left want to show delete
        console.log("deleting", event.currentTarget.dataset);
        if (deleteButtonRef.current) {
          console.log("trying to show trash button", deleteButtonRef.current);
          // TODO: this was stopping the swipe animation
          // deleteButtonRef.current.style.visibility = "hidden";
          console.log(
            "after trying to show trash button",
            deleteButtonRef.current
          );
        }
      } else if (touchEnd > touchStart) {
        console.log("swipe right registered but not implemented");
      } else {
        if (deleteButtonRef.current) {
          // deleteButtonRef.current.style.visibility = "hidden";
        }
      }
    }
    return event;
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    const newItem: ReceiptItem = {
      itemName: "",
      lineItemName: "userGenerated",
      predicationConfidence: 100,
      price: 0,
    };
    console.log("adding item");
    setLocalCopyListItems([newItem, ...localCopyListItems]);
  };

  const editableInventoryListUI = () => {
    console.log("remapping items");
    // How to get key in the list component
    const mappedItems = localCopyListItems.map((li, index) => {
      const deleteListItem = (e: any, itemIndex: number): void => {
        // honoring the immutable state suggestion from react
        const updatedLocalCopyListItems: ReceiptItem[] = [
          ...localCopyListItems,
        ];
        updatedLocalCopyListItems.splice(itemIndex, 1);
        setLocalCopyListItems(updatedLocalCopyListItems);
        console.log("localCopyListItems", localCopyListItems);
      };

      return (
        <ListItem
          key={li.lineItemName + li.price + "_" + index}
          data-uuid={li.lineItemName + li.price + "_" + index}
          ref={listItemRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <ListItemAvatar>
            <Avatar>
              <LocalDiningRoundedIcon />
            </Avatar>
          </ListItemAvatar>
          <TextField
            variant="outlined"
            defaultValue={li.itemName ?? li.lineItemName}
            onChange={(e) => {
              li.itemName = e.target.value;
            }} // will this have reference to the particular item ? Yes!
          />
          <TextField
            variant="outlined"
            defaultValue={li.price}
            onChange={(e) => {
              li.price = Number.parseFloat(e.target.value);
            }}
          />
          <Delete
            onClick={(e) => deleteListItem(e, index)}
            ref={deleteButtonRef}
            fontSize="large"
            style={{ color: "red", visibility: "visible" }}
          />
        </ListItem>
      );
    });
    return mappedItems;
  };

  return (
    <>
      <div className="editMenu">
        <IconButton
          edge="end"
          className="closeButton"
          onClick={(e) => props.setIsEditable(false)}
        >
          <CancelPresentation fontSize="large" />
        </IconButton>
        <IconButton
          edge="end"
          className="editButton"
          onClick={(e) => addItem(e)}
        >
          <Add fontSize="large" />
        </IconButton>
        <IconButton className="AcceptButton" onClick={(e) => acceptEdits(e)}>
          <Done fontSize="large" />
        </IconButton>
      </div>
      <List
        key={editableInventoryListUI.toLocaleString()}
        className="inventoryListUI"
      >
        {editableInventoryListUI()}
      </List>
    </>
  );
};

export default EditableInventoryItem;
