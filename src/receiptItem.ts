export type ReceiptItem = {
  itemName: string; // coloquial name for the item
  lineItemName: string; // what this appears on the receipt as
  price: number;
  // quantity: number,
  predicationConfidence: number;
};
//Being lazy should probably solve the quantity issue in the ReceiptItem model extending here until decision is made
export type CountableReceiptItem = ReceiptItem & { quantity?: number };
export type Receipt = {
  receiptHash: string; // hash of binary data or line items
  originalFileHash: string; // should I make this the uuid?
  uuid: string;
  category: string;
  items: ReceiptItem[];
  date: string;
  userId: string;
};
