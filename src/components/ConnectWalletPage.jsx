import { Alert, Box } from "@mui/material";
import React from "react";

const ConnectWalletPage = ({ message, severity }) => {
  return (
    <Box margin={4}>
      <Alert severity={severity || "info"} variant="outlined">
        {message}
      </Alert>
    </Box>
  );
};

export default ConnectWalletPage;
