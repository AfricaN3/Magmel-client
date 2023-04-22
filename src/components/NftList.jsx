import React from "react";

import { Box, useMediaQuery } from "@mui/material";
import { ConnectWalletPage, NftCard } from "components";

const NftList = ({ data, emptyListMessage }) => {
  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  return (
    <Box>
      {data ? (
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {data.map(({ id, name, description, attributes, image }) => (
            <NftCard
              key={id}
              name={name}
              description={description}
              attributes={attributes}
              image={image}
            />
          ))}
        </Box>
      ) : (
        <ConnectWalletPage emptyListMessage={emptyListMessage} />
      )}
    </Box>
  );
};

export default NftList;
