import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function Nav(props: any) {
  const navigate = useNavigate();
  return (
    <div className={props.className}>
      <Button
        variant="contained"
        href="/FoodBank" /*onClick={() => navigate("FoodBank")}*/
      >
        Food Bank
      </Button>
      <Button variant="contained" href="/Scan" startIcon="">
        Scan
      </Button>
      <Button variant="contained" href="/" onClick={() => navigate("Explore")}>
        Explore
      </Button>
    </div>
  );
}
