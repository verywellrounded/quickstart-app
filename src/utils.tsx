import axios from "axios";
import { MindeeResponse } from "./components/MindeeResponse";
import { Receipt, ReceiptItem } from "./recieptItem";
import md5 from "blueimp-md5";
const OCRAPIKEY = "K82493492188957";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyCxsmHrG840LGceMdGmWsRAf7tYt_abXu8",
  authDomain: "new-tritionist.firebaseapp.com",
  projectId: "new-tritionist",
  storageBucket: "new-tritionist.appspot.com",
  messagingSenderId: "1026041567712",
  appId: "1:1026041567712:web:e5f407aeb63ee015887385",
  measurementId: "G-HQLDYFN4L2",
};

export const scanReceipt = async (something: any) => {
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    //TODO: Really might have to pay for receipt scanning service. The one free OCR service has a file limit of 1024kb
    // Mindee has a free dev for 250 scans per month 10mb limit
    // Could have the users take our upload the photo then allow then to crop in app
    // Could do a mix bedtween the 2 if file is larger than 1024kb go to mindee and if file is bigger than 10mb fail
    // Intermediary caching to not have to query for the same image
    // Cropped scan gave a better total amount and line item discovery but still not great
    // Next task create omage preview and cropability for receipt upload

    console.log("sending request to OCR API", something);
    const scannedReceipt: Receipt = await scanReceiptWithMindee(something);
    return scannedReceipt;
  } catch (error) {
    console.error(error);
  }
};

const scanReceiptWithMindee = async (binaryDataUrl: Blob): Promise<Receipt> => {
  let axiosResp;
  axiosResp = await axios.post(
    `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`,
    { document: binaryDataUrl },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "d44b27dce5004787119f751809723882",
      },
    }
  );
  console.log("got response from mindee API", axiosResp);
  //convert to domain specific storage format
  const mindeeResponse = axiosResp.data as MindeeResponse;
  const convertedScannedReceipt: Receipt =
    convertMindeePayloadToReceipt(mindeeResponse);
  return convertedScannedReceipt;
};

// Detects if device is on iOS
export const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  console.log("userAgent", userAgent);
  return /iphone|ipad|ipod/.test(userAgent);
};
// Detects if device is in standalone mode
export const isInStandaloneMode = () =>
  "standalone" in window.navigator && window.navigator.standalone;

export const isSafari = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  console.log("userAgent", userAgent);
  return /iphone|ipad|ipod/.test(userAgent);
};

function convertMindeePayloadToReceipt(data: MindeeResponse): Receipt {
  const inferredReceipt = data.document.inference.prediction;
  // Follow up if this is a good hash
  // const sortedLineItems = inferredReceipt.line_items.toSorted();
  const convertedResponse: Receipt = {
    receiptHash: md5(JSON.stringify(inferredReceipt.line_items)),
    uuid: data.document.id,
    category: inferredReceipt.category.value,
    items: inferredReceipt.line_items.map((x) => {
      const item: ReceiptItem = {
        itemName: x.description,
        lineItemName: x.description,
        predicationConfidence: x.confidence,
        price: x.total_amount,
      };
      return item;
    }),
    date: inferredReceipt.date.value,
  };
  return convertedResponse;
}
