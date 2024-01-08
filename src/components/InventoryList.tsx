import React from "react";
import { ReceiptItem } from "../recieptItem";
import InventoryItem from "./InventoryItem";
import { List } from "@mui/material";

type Props = {
  listItems: ReceiptItem[];
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
      {props.listItems
        ? inventoryListUI(props.listItems)
        : emptyInventoryListUI()}
    </div>
  );
};

export default InventoryList;
