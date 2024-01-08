import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import React from "react";

type Props = {
  icon: string;
  label: string;
  count: number;
};
/**
 * Wrapping mui list.
 * @param props
 * @returns
 */
const InventoryItem = (props: Props) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <LocalDiningRoundedIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={props.label} />
      <ListItemText primary={props.count} />
    </ListItem>
  );
};

export default InventoryItem;
