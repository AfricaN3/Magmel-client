import React, { useState, useMemo } from "react";

import {
  Card,
  CardHeader,
  Divider,
  useTheme,
  CardContent,
  Box,
  TextField,
  useMediaQuery,
  Button,
  CardMedia,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/system";
import LinearProgress from "@mui/material/LinearProgress";

import MintTabActions from "./MintTabActions";
import MintSteps from "./MintSteps";

const FlexAround = styled(Box)({
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
});

const MintTabCard = ({
  subHeading,
  form,
  formErrors,
  handleInputChange,
  handleOnSubmit,
  brainstorm,
  inspirationGenerator,
  generatedImageData,
  generateImage,
  handleSurpriseMe,
  handleInspirationGenerator,
  loading,
  handleBrainstorm,
  handleClearFields,
  messages,
}) => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const [openImage, setOpenImage] = useState(false);

  const handleClickOpen = () => {
    setOpenImage(true);
  };

  const handleClose = () => {
    setOpenImage(false);
  };

  const theme = useTheme();

  const handleDialogSubmit = () => {
    setOpenImage(false);
    handleOnSubmit();
  };

  const activeStep = useMemo(() => {
    if (generatedImageData.uri) {
      return 3;
    }
    if (generatedImageData.image) {
      return 2;
    }
    if (!form.name || !form.prompt) {
      return 0;
    }

    return 1;
  }, [generatedImageData, form]);

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Dialog
        open={openImage}
        onClose={handleClose}
        aria-labelledby="image-dialog"
        aria-describedby="image-dialog-description"
      >
        <DialogTitle
          sx={{ backgroundColor: theme.palette.background.alt }}
          id="image-dialog"
        >
          {"Confirm Image Minting"}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: theme.palette.background.alt }}>
          <DialogContentText id="image-dialog-description">
            The AI has generated an image based on your prompt. Are you
            satisfied with the image and do you want it to be minted as an NFT?
          </DialogContentText>
          <Card sx={{ maxWidth: 345, marginTop: 1 }}>
            <CardMedia
              component="img"
              sx={{ height: 512 }}
              image={generatedImageData?.image}
              title="NFT"
            />
          </Card>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.background.alt }}>
          <Button
            sx={{ color: theme.palette.secondary[100] }}
            onClick={handleClose}
          >
            Retry Prompt
          </Button>
          <Button
            sx={{ color: theme.palette.secondary[100] }}
            onClick={handleDialogSubmit}
            autoFocus
          >
            Mint NFT
          </Button>
        </DialogActions>
      </Dialog>
      <CardHeader title={subHeading} />
      <Divider />
      <CardContent>
        {loading && (
          <Box sx={{ width: "100%", color: theme.palette.secondary[400] }}>
            <LinearProgress color="inherit" />
          </Box>
        )}
        <MintSteps activeStep={activeStep} messages={messages} />
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": {
              m: 1,
              width: isNonMobile ? "100ch" : "35ch",
              display: "flex",
            },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              disabled={loading}
              error={Boolean(formErrors.name)}
              required
              label="Name"
              name="name"
              helperText={formErrors.name || "A short name for the NFT"}
              value={form.name || ""}
              onChange={handleInputChange}
            />
            <TextField
              disabled={loading}
              error={Boolean(formErrors.prompt)}
              name="prompt"
              required
              label="Prompt"
              multiline
              maxRows={4}
              helperText={
                formErrors.prompt || "Prompt for the AI to generate NFT"
              }
              value={form.prompt || ""}
              onChange={handleInputChange}
            />
            <FlexAround
              sx={{
                width: isNonMobile ? "100ch" : "100%",
              }}
            >
              {generatedImageData.image && (
                <>
                  <MintTabActions
                    disabled={loading}
                    onClick={handleOnSubmit}
                    action="Mint"
                  />
                  <MintTabActions
                    disabled={loading}
                    onClick={handleClickOpen}
                    action="View NFT"
                  />
                  <MintTabActions
                    disabled={loading}
                    onClick={handleClearFields}
                    action="Clear"
                  />
                </>
              )}
              {!generatedImageData.image && (
                <MintTabActions
                  disabled={loading || !form.prompt || !form.name}
                  onClick={generateImage}
                  action="Create"
                />
              )}

              {brainstorm && !generatedImageData.image && (
                <MintTabActions
                  disabled={loading || !form.prompt}
                  onClick={handleBrainstorm}
                  action="Brainstorm"
                />
              )}
              {inspirationGenerator && !generatedImageData.image && (
                <>
                  <MintTabActions
                    disabled={loading}
                    onClick={handleSurpriseMe}
                    action="Shuffle"
                  />
                  <MintTabActions
                    disabled={loading || !form.prompt}
                    onClick={handleInspirationGenerator}
                    action="Unlock"
                  />
                </>
              )}
            </FlexAround>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MintTabCard;
