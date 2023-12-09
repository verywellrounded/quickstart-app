import axios from "axios";
const OCRAPIKEY = "K82493492188957";

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
    const body = new FormData();
    console.log(something);
    body.append("base64Image", something);
    body.append("detectOrientation", "true");
    body.append("language", "eng");
    const config = {
      headers: {
        accept: "application/json",
        apikey: OCRAPIKEY,
        "content-type": "multipart/form-data",
      },
    };
    console.log("sending request to OCR API", something);
    let axiosResp;
    axiosResp = await axios.post(
      `https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict`,
      { document: something },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "d44b27dce5004787119f751809723882",
        },
      }
    );
    // // await axios.post(`https://api.ocr.space/parse/image`, body, config);
    console.log("got response from ocr API", axiosResp);
    return axiosResp;
  } catch (error) {
    console.error(error);
  }
};
