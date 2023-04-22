import {
  Avatar,
  Box,
  Button,
  styled,
  InputBase,
  useTheme,
} from "@mui/material";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";
import PendingTwoToneIcon from "@mui/icons-material/PendingTwoTone";
import Identicon from "react-identicons";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";

import { identiconsPalette } from "constants";
import { ConnectWalletPage } from "components";

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
);

function BottomBarContent({
  handleSubmit,
  loading,
  handleEnter,
  query,
  setQuery,
  error,
}) {
  const theme = useTheme();
  const { address } = useWallet();

  return (
    <>
      <Box
        sx={{
          background: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box flexGrow={1} display="flex" alignItems="center">
          <Avatar
            sx={{
              display: { xs: "none", sm: "flex" },
              mr: 1,
              bgcolor: theme.palette.background.light,
            }}
          >
            <Identicon size={32} string={address} palette={identiconsPalette} />
          </Avatar>
          <MessageInputWrapper
            autoFocus
            placeholder={
              loading
                ? "I'm thinking...🤔"
                : "How can I help you unlock the secrets in your PDF?"
            }
            fullWidth
            disabled={loading}
            onKeyDown={handleEnter}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Box>
        <Box>
          <Button
            onClick={handleSubmit}
            startIcon={loading ? <PendingTwoToneIcon /> : <SendTwoToneIcon />}
            variant="contained"
            disabled={loading}
          >
            Send
          </Button>
        </Box>
      </Box>
      {error && (
        <ConnectWalletPage
          message={error.error || error.message || error}
          severity="error"
        />
      )}
    </>
  );
}

export default BottomBarContent;
