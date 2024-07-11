import { collection, getDocs, query, where } from "firebase/firestore";
import { Suspense, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { db } from "..";
import Layout from "./Layout";
import "./FoodInventory.css";
import { Receipt } from "../receiptItem";
import FoodInventoryList from "./FoodInventoryList";
import Button from "@mui/material/Button";

type Props = {};

const FoodInventory = (props: Props) => {
  const [cookies] = useCookies(["userDetails"]);
  const [receiptState, setReceiptState] = useState<Receipt[]>([]);
  if (!cookies.userDetails?.uid) {
    // TODO: Enhance security
    window.location.assign("/auth");
  }
  const userId: string = cookies.userDetails?.uid;

  useEffect(() => {
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
      return receipts;
    };

    getUsersInventory(userId)
      .then((result) => {
        setReceiptState(result);
        console.log("finished pulling receipts", receiptState);
      })
      .catch((err) => console.error("error while fetching inventory", err));
  }, []);

  return (
    <Layout>
      <div className="topRow">
        <p>
          <Button>Inventory</Button>
        </p>
        <h2> Food Bank </h2>
        <p>
          <Button>Shopping list</Button>
        </p>
      </div>
      <div className="secondRow">
        <textarea defaultValue={"Search    🔍"}></textarea>
      </div>
      <div className="main">
        <Suspense fallback={<h2>🌀 Loading...</h2>}>
          <FoodInventoryList receipts={receiptState} />
        </Suspense>
      </div>
    </Layout>
  );
};

export default FoodInventory;
