import React, { useState, useContext } from "react";

import { Box, Container, Tabs, Tab, useTheme, Card, Grid } from "@mui/material";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { useNavigate } from "react-router-dom";

import {
  PageTitle,
  PageTitleWrapper,
  TabsContainerWrapper,
  FilesList,
  FileCreate,
  ConnectWalletPage,
} from "components";
import { ThemeContext } from "context/themeContext";

const Files = ({ userBalance }) => {
  const [currentTab, setCurrentTab] = useState("files");
  const theme = useTheme();
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { isLoadingFiles, userFiles, emitCall } = useContext(ThemeContext);

  const tabs = [
    { value: "files", label: "My Files" },
    { value: "createFile", label: "New File" },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  const buttonAction = () => {
    if (userBalance < 1) {
      navigate("/mint");
      return;
    }
    setCurrentTab("createFile");
  };
  return (
    <Box>
      <PageTitleWrapper>
        <PageTitle
          heading="Your Uploaded Files"
          subHeading="Access and Manage Your Uploaded PDFs and Their AI Models"
          buttonAction={buttonAction}
          buttonTitle={userBalance < 1 ? "Mint MAGMEL" : `${"Add Files"}`}
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
                {currentTab === "createFile" && (
                  <Grid item xs={12}>
                    <Box p={4}>
                      <FileCreate
                        emitCall={emitCall}
                        userBalance={userBalance}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>
          </>
        ) : (
          <ConnectWalletPage
            message={"Connect your wallet to view and upload your pdf files"}
          />
        )}
      </Container>
    </Box>
  );
};

export default Files;
