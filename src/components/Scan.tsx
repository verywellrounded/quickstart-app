import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import Layout from "./Layout";
import BoarderDetector from "./BoarderDetector";
import "./Scan.css";
import "../index.css";
import { MediaStreamTest } from "./MediaStreamTest";
interface upcResponse {
  //     {
  //         code: string
  //         total: number
  //         "offset": 0,
  //         "items": [
  //           {
  //             "ean": "0070501025901",
  //             "title": "Neutrogena Rapid Clear Maximum Strength Acne Treatment Pads  60 ct",
  //             "description": "Conveniently clear breakouts fast and help prevent emerging ones with Neutrogena Rapid Clear Maximum Strength Acne Treatment Face Pads. The soft  textured oil-free pads contain the powerful acne medicine 2% salicylic acid with MicroClear technology  which cuts through oil and boosts the delivery of acne medicine deep to the source of breakouts to unclog pores. Suitable for acne-prone skin  these pre-moistened acne facial pads are clinically proven to reduce pimple size  swelling  and redness in 8 hours and are non-comedogenic  so they won t clog pores. This daily acne treatment formula cleans deep into pores to give you clearer skin without over-drying or irritation.",
  //             "upc": "070501025901",
  //             "brand": "Neutrogena",
  //             "model": "070501025901",
  //             "color": "Antique White",
  //             "size": "Pack of 12",
  //             "dimension": "2.9 X 2.9 X 2.7 inches",
  //             "weight": "0.3 Pounds",
  //             "category": "Health & Beauty",
  //             "lowest_recorded_price": 0,
  //             "highest_recorded_price": 118.99,
  //             "images": [
  //               "https://i5.walmartimages.com/asr/2fe6f8ea-6fb6-47b9-a433-79e4e2002dd7.d37da5d74ebf0500f045cae08a682809.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff",
  //               "https://target.scene7.com/is/image/Target/GUEST_a1840405-8232-4eb5-8978-ae514a5c95b8?wid=1000&hei=1000",
  //               "http://c.shld.net/rpx/i/s/i/spin/image/spin_prod_176930901",
  //               "https://pics.walgreens.com/prodimg/149923/450.jpg",
  //               "http://c.shld.net/rpx/i/s/i/spin/10127449/prod_ec_1562988702",
  //               "http://pics2.ds-static.com/prodimg/149923/300.jpg",
  //               "http://ecx.images-amazon.com/images/I/51EwB0sEvhL._SL160_.jpg",
  //               "https://m.media-amazon.com/images/I/41jyJ8IP9jL._UL320_.jpg",
  //               "http://ct.mywebgrocer.com/legacy/productimagesroot/DJ/9/474839.jpg",
  //               "http://images10.newegg.com/ProductImageCompressAll200/A0TR_1_20120222_2050311.jpg"
  //             ],
  //             "offers": [
  //               {
  //                 "merchant": "MyGofer",
  //                 "domain": "mygofer.com",
  //                 "title": "Neutrogena Rapid Clear Treatment Pads, 8 Hours Maximum Strength, 60 pads - NEUTROGENA CORPORATION",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 7.99,
  //                 "shipping": "6.95",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://www.mygofer.com/shc/s/p_10175_27151_015W305352110001P",
  //                 "updated_t": 1427522710
  //               },
  //               {
  //                 "merchant": "Walgreens",
  //                 "domain": "walgreens.com",
  //                 "title": "Neutrogena Rapid Clear Maximum Strength Acne Treatment Pads - 60.0 ea",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 10.99,
  //                 "shipping": "US:::5.99 USD",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "https://www.walgreens.com/store/c/neutrogena-rapid-clear-maximum-strength-acne-treatment-pads/ID=prod2263749-product",
  //                 "updated_t": 1688815104
  //               },
  //               {
  //                 "merchant": "Newegg.com",
  //                 "domain": "newegg.com",
  //                 "title": "Neutrogena Rapid Clear Treatment Pads, 60 Count",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 10.46,
  //                 "shipping": "4.99",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://www.newegg.com/Product/Product.aspx?Item=9SIA0TR08C8724&nm_mc=AFC-C8Junction-MKPL&cm_mmc=AFC-C8Junction-MKPL-_-HW+-+Home+Health+Care-_-JOHNSON+LEVEL+++TOOL-_-9SIA0TR08C8724",
  //                 "updated_t": 1479247944
  //               },
  //               {
  //                 "merchant": "Kmart",
  //                 "domain": "kmart.com",
  //                 "title": "Treatment Pads Maximum Strength Rapid Clear&#174;",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 7.99,
  //                 "shipping": "",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://www.kmart.com/neutrogena-rapid-clear-treatment-pads-8-hours-maximum/p-015W305352110001P",
  //                 "updated_t": 1443231534
  //               },
  //               {
  //                 "merchant": "FSAstore.com",
  //                 "domain": "FSAstore.com",
  //                 "title": "Neutrogena Rapid Clear Acne Treatment Pads Salicylic Acid, Maximum Strength, 60 pads",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 9.99,
  //                 "shipping": "",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://fsastore.com/product.aspx?productid=4199",
  //                 "updated_t": 1446310588
  //               },
  //               {
  //                 "merchant": "Drugstore",
  //                 "domain": "drugstore.com",
  //                 "title": "Neutrogena Rapid Clear Daily Treatment Pads Salicylic Acid Acne Treatment, Maximum Strength, 60 pads",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 7.79,
  //                 "shipping": "5.99",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://www.drugstore.com/products/prod.asp?pid=149923&catid=182265",
  //                 "updated_t": 1482545212
  //               },
  //               {
  //                 "merchant": "Wal-Mart.com",
  //                 "domain": "walmart.com",
  //                 "title": "Neutrogena Rapid Clear Maximum Strength Acne Treatment Pads  60 ct",
  //                 "currency": "",
  //                 "list_price": 9.94,
  //                 "price": 9.12,
  //                 "shipping": "5.99",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "https://www.walmart.com/ip/Neutrogena-Rapid-Clear-Maximum-Strength-Acne-Treatment-Pads-60-ct/10308651&intsrc=CATF_9763",
  //                 "updated_t": 1692554519
  //               },
  //               {
  //                 "merchant": "Amazon.com",
  //                 "domain": "amazon.com",
  //                 "title": "Neutrogena Rapid Clear Treatment Pads, 60 Count",
  //                 "currency": "",
  //                 "list_price": 10.69,
  //                 "price": 6.62,
  //                 "shipping": "Free Shipping",
  //                 "condition": "New",
  //                 "availability": "Out of Stock",
  //                 "link": "http://www.amazon.com/Neutrogena-Rapid-Clear-Treatment-Count/dp/B000NVWF3G",
  //                 "updated_t": 1451465600
  //               },
  //               {
  //                 "merchant": "Target",
  //                 "domain": "target.com",
  //                 "title": "Neutrogena Rapid Clear Maximum Strength Treatment Pads - Scented - 60ct",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 9.59,
  //                 "shipping": "",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "https://www.target.com/p/neutrogena-rapid-clear-maximum-strength-treatment-pads-scented-60ct/-/A-11536488&intsrc=CATF_1444",
  //                 "updated_t": 1694259591
  //               },
  //               {
  //                 "merchant": "Shopko",
  //                 "domain": "shopko.com",
  //                 "title": "Neutrogena Rapid Clear Maximum Strength Acne Treatment Pads",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 8.79,
  //                 "shipping": "8.95",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://www.shopko.com/catalog/product.jsp?productId=92781",
  //                 "updated_t": 1527011373
  //               },
  //               {
  //                 "merchant": "Albertsons",
  //                 "domain": "albertsons.com",
  //                 "title": "Neutrogena - Rapid Clear Maximum Strength Treatment Pads 60.00 ct",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 0,
  //                 "shipping": "",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "https://www.upcitemdb.com/norob/alink/?id=v2q233033353e4b4s2&tid=1&seq=1694376777&plt=17a1d41cbca60417dae9de3581dc077e",
  //                 "updated_t": 1484640955
  //               },
  //               {
  //                 "merchant": "Jet.com",
  //                 "domain": "jet.com",
  //                 "title": "Neutrogena Rapid Clear Maximum Strength Treatment Pads, 60 Count (Pack of 60)",
  //                 "currency": "",
  //                 "list_price": "",
  //                 "price": 6.99,
  //                 "shipping": "",
  //                 "condition": "New",
  //                 "availability": "",
  //                 "link": "http://jet.com/product/detail/482f84b7f8264e67aed20bd0a061147c",
  //                 "updated_t": 1542845988
  //               }
  //             ],
  //             "asin": "B000NVWF3G",
  //             "elid": "154797133616"
  //           }
  //         ]
  //       }
}

//TODO: Need to create a the ux around the scanning. And provide a exit button
export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const resultRef = useRef<HTMLTextAreaElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());
  const fileInput = useRef<HTMLInputElement>(null);

  const onBlur = () => {
    reader.current.reset();
  };
  const onFocus = () => {
    if (!videoRef.current) {
      console.log("Video ref not current");
      return;
    }
    const currentReader = reader.current;
    currentReader.decodeFromConstraints(
      {
        audio: false,
        video: {
          facingMode: "environment",
        },
      },
      videoRef.current,
      (result, error) => {
        if (result) {
          console.log(result);
          const lookup = upcLookUp(result.getText());
          if (resultRef.current) {
            resultRef.current.textContent = result.getText();
            currentReader.reset();
          }
        }
        // if (error) console.log(error);
      }
    );
  };

  const upcLookUp = async (upc: string) => {
    const config = {
      headers: {
        accept: "application/json",
        apikey: "aynD4nrqxizADADOlc98siT1c6ArxwVH",
      },
    };
    console.log("looking up", upc);
    const axiosResp: any = await axios.get(
      `https://api.zebra.com/v2/tools/barcode/lookup?upc=${upc}`,
      config
    );
    console.log("received resp for lookup", axiosResp.status, axiosResp.data);
    return axiosResp.data;
    // items[0].title items[0].title, description, images[0]
  };

  useEffect(() => {
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    fileInput.current?.addEventListener(
      "change",
      (e) => console.log("file scanning event", e)
      //   scanReceipt(e.target.files);
    );
    // Calls onFocus when the window first loads
    onFocus();
    const currentReader = reader.current;

    return () => {
      currentReader.reset();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [onFocus, videoRef]);

  const UploadAndDisplayImage = () => {
    const [selectedImage, setSelectedImage] = useState<Blob | null>(null);

    return (
      <div className="imagePreviewParentContainer">
        <p>Upload and Display Image usign React Hook's</p>
        {selectedImage && (
          <>
            <object
              // height={"100%"}
              width={"100%"}
              data={URL.createObjectURL(selectedImage)}
              type={selectedImage.type}
            >
              innertext
            </object>
            <button onClick={() => setSelectedImage(null)}>Remove</button>
          </>
        )}

        <br />
        <br />

        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            if (event.target && event.target.files) {
              const uploadedFile = event.target.files[0];
              console.log(uploadedFile);
              console.log(uploadedFile.type);
              setSelectedImage(uploadedFile);
              console.log(
                "Created object url from selected image",
                URL.createObjectURL(uploadedFile)
              );
              // Removed to bring the scanReceipt function to image cropper
              // const fReader = new FileReader();
              // fReader.addEventListener(
              //   "loadend",
              //   async (reader) => {
              //     await scanReceipt(fReader.result);
              //   },
              //   false
              // );
              // fReader.readAsDataURL(uploadedFile);
            }
          }}
        />
      </div>
    );
  };

  return (
    <>
      {/* <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={(e) => console.log("the file picker event", e)}
      /> */}
      {/* Need to work out the css how to apply grid at the layout level */}
      <Layout>
        {/* {UploadAndDisplayImage()} */}
        <div className="imagePreviewParentContainer">
          <MediaStreamTest></MediaStreamTest>
          <BoarderDetector></BoarderDetector>
          <ImageCropper></ImageCropper>
        </div>
      </Layout>

      {/* <video ref={videoRef} />
      <button
        onClick={(e) => {
          console.log(reader.current.reset());
          console.log("Close clicked. Resetting reader");
        }}
      >
        close
      </button>
      <textarea ref={resultRef}></textarea> */}
    </>
  );
}
