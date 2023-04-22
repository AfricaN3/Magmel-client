import * as React from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import { useTheme } from "@mui/system";

const MagmelImageList = ({ magmelNfts }) => {
  const theme = useTheme();

  const itemData = magmelNfts?.slice(0, 12);

  return (
    <ImageList
      sx={{ height: theme.spacing(26) }}
      variant="woven"
      cols={4}
      rowHeight={121}
    >
      {itemData?.map((item) => (
        <ImageListItem key={item.id}>
          <img
            src={`${item.image}`}
            srcSet={`${item.image}`}
            alt={item.name}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default MagmelImageList;
