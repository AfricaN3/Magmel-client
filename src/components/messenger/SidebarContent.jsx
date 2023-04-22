import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  styled,
  useTheme,
} from "@mui/material";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import Identicon from "react-identicons";
import { useNavigate, useParams } from "react-router-dom";

import avatar1 from "assets/images/avatars/bot.png";
import { shortenAddress } from "utils";
import { identiconsPalette } from "constants";

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
  `
);

const ListItemWrapper = styled(ListItemButton)(
  ({ theme }) => `
        &.MuiButtonBase-root {
            margin: ${theme.spacing(1)} 0;
        }
        &.Mui-selected {
          background-color: ${theme.palette.background.default};
        }
  `
);

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTabs-indicator {
            min-height: 4px;
            height: 4px;
            box-shadow: none;
            border: 0;
        }

        .MuiTab-root {
            &.MuiButtonBase-root {
                padding: 0;
                margin-right: ${theme.spacing(3)};
                font-size: ${theme.typography.pxToRem(16)};
                color: ${theme.palette.secondary[100]};

                .MuiTouchRipple-root {
                    display: none;
                }
            }

            &.Mui-selected:hover,
            &.Mui-selected {
                color: ${theme.palette.secondary[100]};
            }
        }
  `
);

function SidebarContent({ userFiles }) {
  const { address } = useWallet();
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const fileId = params.fileId;

  const [currentTab, setCurrentTab] = useState("all");

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState(null);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = userFiles.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const tabs = [{ value: "all", label: "All" }];

  const changeFile = (id) => {
    navigate(`/chat/${id}`);
  };

  const onSidebarActionClick = () => {
    navigate(`/files`);
  };

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };

  return (
    <RootWrapper>
      <Box display="flex" alignItems="flex-start">
        <Avatar sx={{ bgcolor: theme.palette.background.light }}>
          <Identicon size={32} string={address} palette={identiconsPalette} />
        </Avatar>
        <Box
          sx={{
            ml: 1.5,
            flex: 1,
          }}
        >
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" noWrap>
                {shortenAddress(address)}
              </Typography>
              <Typography variant="subtitle1" noWrap>
                {userFiles ? `${userFiles.length} Files` : `0 Files`}
              </Typography>
            </Box>
            <IconButton
              sx={{
                p: 1,
              }}
              size="small"
              color="primary"
              onClick={onSidebarActionClick}
            >
              <SettingsTwoToneIcon color="secondary" fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <TextField
        sx={{
          mt: 2,
          mb: 1,
        }}
        size="small"
        fullWidth
        value={searchText}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchTwoToneIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search by file name or description"
      />

      <Typography
        sx={{
          mb: 1,
          mt: 2,
        }}
        variant="h3"
      >
        Chats
      </Typography>

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
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>
      </TabsContainerWrapper>

      <Box mt={2}>
        {currentTab === "all" && (
          <List disablePadding component="div">
            {searchText
              ? searchedResults?.map((file) => (
                  <ListItemWrapper
                    key={file._id}
                    selected={file._id === fileId}
                    onClick={() => changeFile(file._id)}
                  >
                    <ListItemAvatar>
                      <Avatar src={avatar1} />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        mr: 1,
                      }}
                      primaryTypographyProps={{
                        color: "textPrimary",
                        variant: "h5",
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        color: "textSecondary",
                        noWrap: true,
                      }}
                      primary={file.name}
                      secondary={file.description}
                    />
                  </ListItemWrapper>
                ))
              : userFiles?.map((file) => (
                  <ListItemWrapper
                    key={file._id}
                    selected={file._id === fileId}
                    onClick={() => changeFile(file._id)}
                  >
                    <ListItemAvatar>
                      <Avatar src={avatar1} />
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        mr: 1,
                      }}
                      primaryTypographyProps={{
                        color: "textPrimary",
                        variant: "h5",
                        noWrap: true,
                      }}
                      secondaryTypographyProps={{
                        color: "textSecondary",
                        noWrap: true,
                      }}
                      primary={file.name}
                      secondary={file.description}
                    />
                  </ListItemWrapper>
                ))}
          </List>
        )}
      </Box>
    </RootWrapper>
  );
}

export default SidebarContent;
