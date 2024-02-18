import { CancelPresentation, Done, Edit } from "@mui/icons-material";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  TextField,
} from "@mui/material";
import { ReceiptItem } from "../recieptItem";
import _ from "lodash";
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
  // make a local copy of the items pre edit
  const localCopyListItems = _.cloneDeep(props.listItems);
  // listener for when edit button is clicked
  const acceptEdits = (e: unknown) => {
    props.setIsEditable(true);
    // might be useful to make a map with the index as a key to access it faster
    // hide the others and
    //when done is clicked here do a diff and send the updates to db and set state
    console.log("orignal items", props.listItems);
    console.log("updated items", localCopyListItems);
    // index of copy is same as parent so one loop should be able to merge successfully
    // Unless we start doing more complex manipulations we can just return the local copy to replace the orignal
    // Need some validation though

    //TODO: Determine if saving to db here is better than saving at the end of prediction flow
    console.log("diff and merged items", localCopyListItems);
    props.setPredictionPreviewItems(localCopyListItems);
    props.setIsEditable(false);
  };

  const editableInventoryListUI = (listItems: ReceiptItem[]) => {
    // How to get key in the list component
    const mappedItems = localCopyListItems.map((li, index) => {
      return (
        <ListItem>
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
        <IconButton edge="end" className="editButton" disabled={true}>
          <Edit fontSize="large" />
        </IconButton>
        <IconButton className="AcceptButton" onClick={(e) => acceptEdits(e)}>
          <Done fontSize="large" />
        </IconButton>
      </div>
      <List
        key={editableInventoryListUI.toLocaleString()}
        className="inventoryListUI"
      >
        {editableInventoryListUI(localCopyListItems)}
      </List>
    </>
  );
};

export default EditableInventoryItem;
