export type ReceiptItem = {
  itemName: string; // coloquial name for the item
  lineItemName: string; // what this appears on the receipt as
  price: number;
  // quantity: number,
  predicationConfidence: number;
};

export type Receipt = {
  receiptHash: string; // hash of binary data or line items
  uuid: string;
  category: string;
  items: ReceiptItem[];
  date: string;
};