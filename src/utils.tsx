import axios from "axios";
import md5 from "blueimp-md5";
import { getAuth } from "firebase/auth";
import {
  DocumentReference,
  QueryFieldFilterConstraint,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from ".";
import { RECEIPTS_COLLECTION_NAME } from "./Constants";
import { MindeeResponse } from "./components/MindeeResponse";
import { Receipt, ReceiptItem } from "./receiptItem";
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
/**
 * if there are multiple results for the query only the first will be updated
 * First iteration just works for receipts will make more generic  as needed
 * @param q
 * @param updatedReceipt
 */
export const updateDocument = async (
  tableName: string,
  whereClause: QueryFieldFilterConstraint,
  updatedDocument: Receipt
) => {
  const receiptsCollection = collection(db, tableName);
  // is there a benefit to using this or collapsing uuid to this where("originalFileHash", "==", props.response.originalFileHash)
  const q = query(receiptsCollection, whereClause);
  const querySnapshot = await getDocs(q);
  console.log(`Retrieved ${querySnapshot.size} docs`);
  if (querySnapshot.size > 1) {
    console.warn(
      `There are duplicate records for query: ${querySnapshot.query}`
    );
  }
  const docReceiptMap: { docRef: DocumentReference; receipt: Receipt }[] =
    querySnapshot.docs.map((doc) => {
      const receipt = { ...(doc.data() as unknown as Receipt) };
      return { docRef: doc.ref, receipt };
    });

  // only update the first if there are duplicates
  const firstDoc = docReceiptMap[0];
  firstDoc.receipt = updatedDocument;
  try {
    await updateDoc(firstDoc.docRef, firstDoc.receipt);
  } catch (e: any) {
    console.error(`Failed to update first document in ${docReceiptMap}`, e);
    //TODO: What should we do here ? Can the user fix this ?
  }
};
export const scanReceipt = async (something: any, originalFile: File) => {
  try {
    // Using the OCR.space default free API key (max 10reqs in 10mins) + remote file
    //TODO: Really might have to pay for receipt scanning service. The one free OCR service has a file limit of 1024kb
    // Mindee has a free dev for 250 scans per month 10mb limit
    // Could have the users take our upload the photo then allow then to crop in app
    // Could do a mix bedtween the 2 if file is larger than 1024kb go to mindee and if file is bigger than 10mb fail
    // Intermediary caching to not have to query for the same image
    // Cropped scan gave a better total amount and line item discovery but still not great
    // Next task create omage preview and cropability for receipt upload

    // Before making a call to scan query db for hash of fileProperties
    const originalFileHash = hashOf(
      originalFile.name,
      originalFile.type,
      originalFile.lastModified
    );

    console.log("hash of original file", originalFileHash);
    const receiptsCollection = collection(db, RECEIPTS_COLLECTION_NAME);
    const q = query(
      receiptsCollection,
      where("originalFileHash", "==", originalFileHash)
    );
    // Check if user is already stored
    const querySnapshot = await getDocs(q);
    console.log("querySnap", querySnapshot);
    if (!querySnapshot.empty) {
      // If so then update last login
      const docId = querySnapshot.docs[0].id;
      // Notifiy that file seems like a duplicate so using already process value
      console.log(
        "Duplicate scan detected using stored receipt with ID: ",
        docId
      );
      return {
        scannedReceipt: querySnapshot.docs[0].data() as Receipt,
        isDuplicateScan: true,
      };
    } else {
      console.log("sending request to OCR API", something);
      const scannedReceipt: Receipt = await scanReceiptWithMindee(
        something,
        originalFileHash
      );
      return { scannedReceipt, isDuplicateScan: false };
    }
  } catch (error) {
    console.error(error);
    return { scannedReceipt: undefined, isDuplicateScan: false };
  }
};

const scanReceiptWithMindee = async (
  binaryDataUrl: Blob,
  originalFileHash: string
): Promise<Receipt> => {
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
  const convertedScannedReceipt: Receipt = convertMindeePayloadToReceipt(
    mindeeResponse,
    originalFileHash
  );
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

/**
 *
 * @param data Hash all the elements provided via a common hashing function.
 *  Sorts then stringifys data to avoid mismatch in hash of the same data
 * @returns
 */
export function hashOf(...data: unknown[]) {
  //toSorted causing issues with transpiler not able to understand esnextarray
  return md5(JSON.stringify(data));
}

function convertMindeePayloadToReceipt(
  data: MindeeResponse,
  originalFileHash: string
): Receipt {
  const inferredReceipt = data.document.inference.prediction;
  // Follow up if this is a good hash
  // const sortedLineItems = inferredReceipt.line_items.toSorted();
  const convertedResponse: Receipt = {
    receiptHash: hashOf(inferredReceipt.line_items),
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
    userId: getAuth().currentUser?.uid ?? "",
    originalFileHash: originalFileHash,
  };
  return convertedResponse;
}
