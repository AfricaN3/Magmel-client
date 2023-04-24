import React, { useState, useContext } from "react";

import {
  PageTitle,
  NftList,
  FilesList,
  PageTitleWrapper,
  TabsContainerWrapper,
  ConnectWalletPage,
} from "components";
import { ThemeContext } from "context/themeContext";
import { Box, Tab, Tabs, Container, useTheme, Card, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";

const Dashboard = ({ myNfts }) => {
  const navigate = useNavigate();
  const { connected } = useWallet();

  const buttonAction = () => {
    navigate(`/${currentTab === "nfts" ? "mint" : "files"}`);
  };
  const theme = useTheme();

  const { isLoadingFiles, userFiles, emitCall } = useContext(ThemeContext);

  const [currentTab, setCurrentTab] = useState("nfts");

  const tabs = [
    { value: "nfts", label: "Your NFTs" },
    { value: "files", label: "Your Files" },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Your Dashboard"
          subHeading="Manage Your NFTs and AI Training Data"
          buttonAction={buttonAction}
          buttonTitle={`${currentTab === "nfts" ? "Mint NFT" : "Manage Files"}`}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {connected ? (
          <>
            <TabsContainerWrapper>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    sx={{
                      borderRadius: "0.5rem",
                    }}
                  />
                ))}
              </Tabs>
            </TabsContainerWrapper>
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
                {currentTab === "nfts" && (
                  <>
                    <Grid item xs={12}>
                      <Box p={4}>
                        {myNfts?.length > 0 ? (
                          <NftList
                            data={myNfts}
                            emptyListMessage="You have no MAGMEL"
                          />
                        ) : (
                          <ConnectWalletPage message="You have no MAGMEL" />
                        )}
                      </Box>
                    </Grid>
                  </>
                )}

                {currentTab === "files" && (
                  <Grid item xs={12}>
                    <Box p={4}>
                      <FilesList
                        data={userFiles}
                        isLoading={isLoadingFiles}
                        emitCall={emitCall}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          </>
        ) : (
          <ConnectWalletPage
            message={`Please connect wallet to view dashboard`}
          />
        )}
      </Container>
    </>
  );
};

export default Dashboard;
