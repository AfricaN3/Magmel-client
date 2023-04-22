import React from "react";

import { PageTitle, NftList, PageTitleWrapper } from "components";
import { Box, Container, useTheme, Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Collection = ({ magmelNfts }) => {
  const navigate = useNavigate();
  const buttonAction = () => {
    navigate(`/mint`);
  };
  const theme = useTheme();

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Latest Mints"
          subHeading="Check out the latest additions to the Magpie's Melange collection."
          buttonAction={buttonAction}
          buttonTitle={`View on GhostMarket`}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={0}
            >
              <>
                <Grid item xs={12}>
                  <Box p={4}>
                    <NftList
                      data={magmelNfts}
                      emptyListMessage="No MAGMEL minted yet"
                    />
                  </Box>
                </Grid>
              </>
            </Grid>
          </Card>
        </>
      </Container>
    </>
  );
};

export default Collection;
