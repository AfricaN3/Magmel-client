import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useTheme } from "@mui/system";
import ConnectWalletPage from "./ConnectWalletPage";

const steps = ["Enter Prompts", "Generate Image", "Mint NFT"];

export default function MintSteps({ activeStep, messages }) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        "& .MuiStepIcon-root": {
          color: theme.palette.secondary[400],
        },
        "& .MuiStepIcon-text": {
          fill: theme.palette.primary[700],
        },
      }}
    >
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      <React.Fragment>
        <Box sx={{ mt: 2, mb: 1 }}>
          <ConnectWalletPage message={messages[activeStep]} />
        </Box>
      </React.Fragment>
    </Box>
  );
}
