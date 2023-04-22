import React from "react";

import { useTheme, Button, useMediaQuery } from "@mui/material";

const MintTabActions = ({ action, onClick, disabled }) => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      sx={{
        margin: 1,
        backgroundColor:
          action === "Clear" ? "#FFCCCB" : theme.palette.secondary.main,
        color: theme.palette.primary[900],
        "&:hover": {
          color: theme.palette.grey[50],
          background: theme.palette.primary[700],
        },
      }}
      variant="contained"
      size={isNonMobile ? `medium` : `small`}
    >
      {action}
    </Button>
  );
};

export default MintTabActions;
