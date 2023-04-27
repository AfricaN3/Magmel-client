import React, { useState } from "react";
import {
  Box,
  useTheme,
  Stack,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";

import { toastMessage } from "utils";
import useAxiosPost from "hooks/useAxiosPost";
import { NeoBotId } from "constants";

const FilesList = ({ data, isLoading, emitCall }) => {
  const renderedData = data.filter((file) => file._id !== NeoBotId);
  const { axiosInstance } = useAxiosPost();
  const navigate = useNavigate();
  const theme = useTheme();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChatClick = (row) => {
    navigate(`/chat/${row._id}`);
  };

  const deleteRow = async (row) => {
    try {
      setMessage(`File "${row.name}" deleting!!!`);
      setLoading(true);
      await axiosInstance.post(
        `post/file/delete/`,
        JSON.stringify({
          fileId: row._id,
          owner: row.owner,
        })
      );
      toastMessage("success", "File deleted successfully", 5000);
      setMessage(`File "${row.name}" deleted!!!`);
      localStorage.removeItem(`${row._id}`);
      emitCall();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.6,
      sortable: false,
      disableClickEventBubbling: true,
      disableRowSelectionOnClick: true,

      renderCell: (params) => {
        const onDeleteClick = async (e) => {
          const currentRow = params.row;
          await deleteRow(currentRow);
        };
        const onChatClick = (e) => {
          const currentRow = params.row;
          handleChatClick(currentRow);
        };

        return (
          <>
            <Tooltip placement="bottom" title="Chat with Doc">
              <IconButton color="info" onClick={onChatClick}>
                <ChatTwoToneIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement="bottom" title="Delete PDF">
              <IconButton onClick={onDeleteClick} color="error">
                <DeleteTwoToneIcon />
              </IconButton>
            </Tooltip>
          </>
        );
      },
    },
  ];

  return (
    <Stack spacing={2}>
      <Box
        mt="40px"
        height="75vh"
        // width="100%"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || loading}
          getRowId={(row) => row._id}
          rows={renderedData || []}
          columns={columns}
        />
      </Box>
      {message && <Alert severity="info">{message}</Alert>}
    </Stack>
  );
};

export default FilesList;
