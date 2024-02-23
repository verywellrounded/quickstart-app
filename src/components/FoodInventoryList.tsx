import { CountableReceiptItem, Receipt } from "../receiptItem";
import { List, ListItem } from "@mui/material";
import InventoryItem from "./InventoryItem";

type Props = {
  receipts: Receipt[];
  view?: "inventory" | "shoppingList" | "recipes" | "";
};

const transformReceiptsToCountableItems = (receipts: Receipt[]) => {
  // seems expensive is there a better way to do this
  const countableReceiptItems: { [x: string]: CountableReceiptItem } = {};
  const allCountableReceiptItems: CountableReceiptItem[] = [];
  for (let r of receipts) {
    for (let i of r.items) {
      if (countableReceiptItems[i.itemName]) {
        let itemQuantity = countableReceiptItems[i.itemName].quantity;
        itemQuantity = itemQuantity ? itemQuantity++ : 1;
      } else {
        countableReceiptItems[i.itemName] = { ...i, quantity: 1 };
        allCountableReceiptItems.push(countableReceiptItems[i.itemName]);
      }
    }
  }
  return { list: allCountableReceiptItems, map: countableReceiptItems };
};
const inventoryView = (allReceiptItems: CountableReceiptItem[]) => {
  const list = allReceiptItems.map((receipt, index) => {
    return (
      <ListItem>
        <InventoryItem
          label={receipt.itemName}
          count={receipt.quantity!}
          icon={""}
        />
      </ListItem>
    );
  });
  return <List>{list}</List>;
};

const shoppingListView = (allReceiptItems: CountableReceiptItem[]) => {
  const list = allReceiptItems.map((receipt, index) => {
    return (
      <ListItem>
        <InventoryItem
          label={receipt.itemName}
          count={receipt.quantity!}
          icon={""}
        />
      </ListItem>
    );
  });
  return <List>{list}</List>;
};

const recipesView = (allReceiptItems: CountableReceiptItem[]) => {
  const list = allReceiptItems.map((receipt, index) => {
    return (
      <ListItem>
        <InventoryItem
          label={receipt.itemName}
          count={receipt.quantity!}
          icon={""}
        />
      </ListItem>
    );
  });
  console.log(list);
  return <List>{list}</List>;
};

const FoodInventoryList = (props: Props) => {
  const { list: allReceiptItemsList } = transformReceiptsToCountableItems(
    props.receipts
  );
  console.log("rendering Food Inventory");
  switch (props.view) {
    case "inventory":
      return inventoryView(allReceiptItemsList);
    case "shoppingList":
      return shoppingListView(allReceiptItemsList);
    default:
      console.log("triggered default case");
      return recipesView(allReceiptItemsList);
  }
};

export default FoodInventoryList;
