import React, { useState, useRef } from "react";

import {
  TextField,
  Card,
  CardHeader,
  Box,
  CardContent,
  Divider,
  useTheme,
  Button,
  useMediaQuery,
  Typography,
  LinearProgress,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";

import { toastMessage } from "utils";
import ConnectWalletPage from "./ConnectWalletPage";
import useAxiosPost from "hooks/useAxiosPost";

const acceptedFiles = {
  "application/pdf": [".pdf"],
};

const FileCreate = ({ emitCall, userBalance }) => {
  const { axiosInstance } = useAxiosPost();
  const theme = useTheme();
  const { address } = useWallet();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const [file, setFile] = useState(null); // state for storing actual file
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    description: "",
    file: "",
  });
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const handleInputChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFormErrors({ ...formErrors, file: "" });
    setFile(null);

    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          file: "Size of file is too large (>10MB).",
        });
        return;
      }
      setFile(uploadedFile);
    } else {
      setFormErrors({ ...formErrors, file: "Wrong file format" });
    }
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = `0.1px solid ${theme.palette.secondary[500]}`;
    } else if (dragState === "leave") {
      dropRef.current.style.border = `0.1px dashed ${theme.palette.grey[100]}`;
    }
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (userBalance < 1) {
      toastMessage(
        "error",
        "Oops! Looks like you don't have any Magpie Melanges NFTs yet",
        5000
      );
      return;
    }

    try {
      setIsLoading(true);
      const { name, description } = state;
      if (name.trim() !== "" && description.trim() !== "") {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", name);
          formData.append("description", description);
          formData.append("owner", address);

          setFormErrors({
            name: "",
            description: "",
            file: "",
          });
          const response = await axiosInstance.post(`post/upload/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          setState({
            name: "",
            description: "",
          });
          setFile(null);
          toastMessage("success", "File created successfully", 5000);
          emitCall();
        } else {
          toastMessage("error", "Please select a PDF file", 5000);
          setFormErrors({ ...formErrors, file: "Please select a PDF file" });
        }
      } else {
        toastMessage("error", "Please enter all the field values.", 5000);
        if (name.trim() === "") {
          setFormErrors({
            ...formErrors,
            name: "Please enter the name of file",
          });
        }
        if (description.trim() === "") {
          setFormErrors({
            ...formErrors,
            description: "please enter a short description of file",
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <CardHeader title="Upload PDF" />
      <Divider />
      {userBalance < 1 && (
        <ConnectWalletPage
          message={
            "Oops! Looks like you don't have any Magpie Melanges NFTs yet. To upload documents and train the AI, you must first mint an NFT. Don't worry, they're only 1 GAS each! Start your collection today."
          }
          severity={"warning"}
        />
      )}
      <CardContent>
        {isLoading && (
          <Box sx={{ width: "100%", color: theme.palette.secondary[400] }}>
            <LinearProgress color="inherit" />
          </Box>
        )}
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": {
              m: 1,
              width: isNonMobile ? "100ch" : "25ch",
              display: "flex",
            },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              error={Boolean(formErrors.name)}
              disabled={isLoading}
              required
              id="outlined-required"
              label="Name"
              name="name"
              helperText={formErrors.name || "A short name for the file"}
              value={state.name || ""}
              onChange={handleInputChange}
            />
            <TextField
              disabled={isLoading}
              error={Boolean(formErrors.description)}
              name="description"
              required
              id="outlined-disabled"
              label="Description"
              multiline
              maxRows={4}
              helperText={formErrors.description || "Description for the file"}
              value={state.description || ""}
              onChange={handleInputChange}
            />

            <Dropzone
              accept={acceptedFiles}
              onDrop={onDrop}
              onDragEnter={() => updateBorder("over")}
              onDragLeave={() => updateBorder("leave")}
            >
              {({ getRootProps, getInputProps }) => (
                <Card
                  {...getRootProps({
                    className: "drop-zone",
                    sx: {
                      backgroundColor: theme.palette.background.default,
                      width: isNonMobile ? "100ch" : "25ch",
                      height: "200px",
                      border: `0.1px dashed ${theme.palette.grey[100]}`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    },
                  })}
                  ref={dropRef}
                >
                  <input {...getInputProps()} />
                  {isLoading ? (
                    <p>Uploading and training model with your data!!!</p>
                  ) : (
                    <p>
                      Drag and drop a PDF file OR click here to select a file
                    </p>
                  )}
                  {file && (
                    <div>
                      <strong>Selected file:</strong>{" "}
                      {isNonMobile ? file.name : file.name.substring(0, 25)}
                    </div>
                  )}
                  {formErrors.file && (
                    <Typography color={"red"}>{formErrors.file}</Typography>
                  )}
                </Card>
              )}
            </Dropzone>

            <Button
              sx={{
                margin: 1,
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary[400],
              }}
              variant="contained"
              onClick={handleOnSubmit}
              disabled={isLoading}
            >
              Submit
            </Button>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FileCreate;
