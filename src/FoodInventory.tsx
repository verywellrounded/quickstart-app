import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { db } from ".";
import Layout from "./components/Layout";
import { Receipt } from "./recieptItem";

type Props = {};

const FoodInventory = (props: Props) => {
  const [cookies] = useCookies(["userDetails"]);
  const [receiptState, setReceiptState] = useState<Receipt[]>();
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }
  const userId: string = cookies.userDetails?.uid;

  const getUsersInventory = async (uid: string) => {
    const receiptsCollection = collection(db, "receipts");
    const q = query(receiptsCollection, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);
    console.log(`Retrieved ${querySnapshot.size} docs`);
    // Heavily cache this data not sure if state is the right place for it
    const receipts: Receipt[] = querySnapshot.docs.map((doc) => {
      console.log("doc data", doc.data());
      console.log("doc metadata", doc.metadata);
      const receipt = { ...(doc.data() as unknown as Receipt) };
      console.log("receipt", receipt);
      return receipt;
    });
    setReceiptState(receipts);
  };

  return (
    <Layout>
      <div>FoodInventory</div>
      <button onClick={async () => await getUsersInventory(userId)}>
        Get Inventory
      </button>
      {receiptState && <p>{receiptState[0].date}</p>}
    </Layout>
  );
};

export default FoodInventory;
