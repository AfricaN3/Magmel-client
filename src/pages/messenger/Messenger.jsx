import { useState, useEffect, useContext } from "react";

import { useParams } from "react-router-dom";
import {
  Box,
  styled,
  Divider,
  Drawer,
  IconButton,
  useTheme,
  LinearProgress,
} from "@mui/material";
import MenuTwoToneIcon from "@mui/icons-material/MenuTwoTone";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";

import TopBarContent from "components/messenger/TopBarContent";
import BottomBarContent from "components/messenger/BottomBarContent";
import SidebarContent from "components/messenger/SidebarContent";
import ChatContent from "components/messenger/ChatContent";
import Scrollbar from "components/Scrollbar";
import { toastMessage } from "utils";
import { ThemeContext } from "context/themeContext";
import useAxiosPost from "hooks/useAxiosPost";

const RootWrapper = styled(Box)(
  ({ theme }) => `
       height: calc(100vh - ${theme.header.height});
       display: flex;
`
);

const Sidebar = styled(Box)(
  ({ theme }) => `
        width: 300px;
        background: ${
          theme.palette.mode === "dark"
            ? theme.palette.background.dark
            : theme.palette.grey[200]
        };
        border-right: ${
          theme.palette.mode === "dark"
            ? theme.palette.primary[300]
            : theme.palette.primary[800]
        } solid 1px;
`
);

const ChatWindow = styled(Box)(
  () => `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
`
);

const ChatTopBar = styled(Box)(
  ({ theme }) => `
        background: ${
          theme.palette.mode === "dark"
            ? theme.palette.background.dark
            : theme.palette.grey[200]
        };
        border-bottom: ${
          theme.palette.mode === "dark"
            ? theme.palette.primary[300]
            : theme.palette.primary[800]
        } solid 1px;
        padding: ${theme.spacing(2)};
        align-items: center;
`
);

const IconButtonToggle = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  background: ${
    theme.palette.mode === "dark"
      ? theme.palette.background.dark
      : theme.palette.grey[200]
  };
`
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
    width: 340px;
    flex-shrink: 0;

  & > .MuiPaper-root {
        width: 340px;
        z-index: 3;
  }
`
);

const initMessageState = {
  messages: [
    {
      message:
        "Hello there! I'm the AI, your virtual companion. Let's dive into your PDF and unravel its secrets.",
      type: "apiMessage",
      time: new Date(),
    },
  ],
  history: [],
};

function Messenger() {
  const theme = useTheme();
  const { axiosInstance } = useAxiosPost();
  const { userFiles } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address } = useWallet();
  const params = useParams();
  const fileId = params.fileId;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messageState, setMessageState] = useState(() =>
    localStorage.getItem(`${fileId}`)
      ? JSON.parse(localStorage.getItem(`${fileId}`))
      : initMessageState
  );

  const { messages, history } = messageState;

  useEffect(() => {
    setMessageState(() =>
      localStorage.getItem(`${fileId}`)
        ? JSON.parse(localStorage.getItem(`${fileId}`))
        : initMessageState
    );
  }, [fileId]);

  useEffect(() => {
    setError(null);
  }, [query, fileId]);

  const activatedFile = userFiles?.find((file) => file._id === fileId);

  //handle form submission
  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);

    if (!query) {
      toastMessage("error", "Please input a question", 5000);
      return;
    }

    const question = query.trim();

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
          time: new Date(),
        },
      ],
    }));

    setLoading(true);
    setQuery("");

    try {
      const response = await axiosInstance.post(
        `chat/${fileId}/`,
        JSON.stringify({
          question,
          history,
          owner: address,
        })
      );

      const data = response.data;

      setMessageState((state) => ({
        ...state,
        messages: [
          ...state.messages,
          {
            type: "apiMessage",
            message: data.text,
            time: new Date(),
            sourceDocs: data.sourceDocuments,
          },
        ],

        history: [...state.history, [question, data.text]],
      }));

      localStorage.setItem(
        `${fileId}`,
        JSON.stringify({
          ...messageState,
          messages: [
            ...messageState.messages,
            {
              type: "apiMessage",
              message: data.text,
              time: new Date(),
              sourceDocs: data.sourceDocuments,
            },
          ],

          history: [...messageState.history, [question, data.text]],
        })
      );
    } catch (error) {
      setError(
        error.response.data ||
          "An error occurred while fetching the data. Please try again."
      );
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }

  //prevent empty submissions
  const handleEnter = (e) => {
    if (e.key === "Enter" && query) {
      handleSubmit(e);
    } else if (e.key === "Enter") {
      toastMessage("error", "Please input a question", 5000);
      e.preventDefault();
    }
  };

  return (
    <>
      <RootWrapper className="Mui-FixedWrapper">
        <DrawerWrapperMobile
          sx={{
            display: { lg: "none", xs: "inline-block" },
          }}
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          <Scrollbar>
            <SidebarContent userFiles={userFiles} />
          </Scrollbar>
        </DrawerWrapperMobile>
        <Sidebar
          sx={{
            display: { xs: "none", lg: "inline-block" },
          }}
        >
          <Scrollbar>
            <SidebarContent userFiles={userFiles} />
          </Scrollbar>
        </Sidebar>
        <ChatWindow>
          <ChatTopBar
            sx={{
              display: { xs: "flex", lg: "inline-block" },
            }}
          >
            <IconButtonToggle
              sx={{
                display: { lg: "none", xs: "flex" },
                mr: 2,
              }}
              color="primary"
              onClick={handleDrawerToggle}
              size="small"
            >
              <MenuTwoToneIcon />
            </IconButtonToggle>
            <TopBarContent activatedFile={activatedFile} messages={messages} />
          </ChatTopBar>
          <Box flex={1}>
            <Scrollbar>
              <ChatContent messages={messages} activatedFile={activatedFile} />
            </Scrollbar>
          </Box>

          {loading ? (
            <Box sx={{ width: "100%", color: theme.palette.secondary[400] }}>
              <LinearProgress color="inherit" />
            </Box>
          ) : (
            <Divider />
          )}

          <BottomBarContent
            handleEnter={handleEnter}
            handleSubmit={handleSubmit}
            loading={loading}
            query={query}
            setQuery={setQuery}
            error={error}
          />
        </ChatWindow>
      </RootWrapper>
    </>
  );
}

export default Messenger;
