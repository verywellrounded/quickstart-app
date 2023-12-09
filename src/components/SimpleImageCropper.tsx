import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Button } from "@mui/material";
import { useState } from "react";
import ImageUploadPreview from "./ImageUploadPreview";
import "./SimpleImageUpload.css";

type Props = {};

export default function SimpleImageCropper(props: Props) {
  const [file, setFile] = useState<File>();

  const onClick = (e: React.BaseSyntheticEvent) => {
    console.log("got e", e);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("This is the change event", e);
    console.log("This is the file upload event", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const uploadButton = (
    <div className="uploadButtonContainer">
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload file
        <input
          type="file"
          // value={scale}
          // disabled={!imgSrc}
          hidden={true}
          onClick={(e) => onClick(e)}
          onChange={onChange}
        />
      </Button>
    </div>
  );
  return (
    <>
      {file ? (
        <ImageUploadPreview file={file} setFile={setFile} />
      ) : (
        uploadButton
      )}
    </>
  );
}
