import React from "react";
import { Box, Avatar, Typography, styled } from "@mui/material";
import { formatDistance } from "date-fns";

import avatar1 from "assets/images/avatars/bot.png";

const RootWrapper = styled(Box)(
  ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
`
);

function TopBarContent({ activatedFile, messages }) {
  return (
    <>
      <RootWrapper>
        <Box display="flex" alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
            }}
            alt={activatedFile?.name}
            src={avatar1}
          />
          <Box ml={1}>
            <Typography variant="h4">{activatedFile?.name}</Typography>
            <Typography variant="subtitle1">
              {messages.length > 0
                ? formatDistance(
                    new Date(messages[messages?.length - 1].time),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )
                : "less than a minute ago"}
            </Typography>
          </Box>
        </Box>
      </RootWrapper>
    </>
  );
}

export default TopBarContent;
