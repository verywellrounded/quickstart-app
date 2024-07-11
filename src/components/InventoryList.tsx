import { List } from "@mui/material";
import { ReceiptItem } from "../receiptItem";
import EditableInventoryItem from "./EditableInventoryItem";
import InventoryItem from "./InventoryItem";

type Props = {
  listItems: ReceiptItem[];
  isEditable: boolean;
  setIsEditable: unknown;
  setPredictionPreviewItems: React.Dispatch<
    React.SetStateAction<ReceiptItem[]>
  >;
};
/**
 * Wraps mui List component
 * @param listItems
 * @returns
 */
const inventoryListUI = (listItems: ReceiptItem[]) => {
  // How to get key in the list component
  const mappedItems = listItems.map((li, index) => {
    return (
      <InventoryItem
        key={`li.itemName${index}`}
        icon=""
        label={li.itemName}
        count={li.price}
      ></InventoryItem>
    );
  });
  return (
    <List key={mappedItems.toLocaleString()} className="inventoryListUI">
      {mappedItems}
    </List>
  );
};

const emptyInventoryListUI = () => {
  return <List className="emptyInventoryListUI" />;
};

const InventoryList = (props: Props) => {
  return (
    <div className="container">
      {props.listItems ? (
        props.isEditable ? (
          <EditableInventoryItem
            listItems={props.listItems}
            setIsEditable={props.setIsEditable}
            setPredictionPreviewItems={props.setPredictionPreviewItems}
          />
        ) : (
          inventoryListUI(props.listItems)
        )
      ) : (
        emptyInventoryListUI()
      )}
    </div>
  );
};

export default InventoryList;
