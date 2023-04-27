import React, { useEffect, useRef } from "react";

import { Box, Avatar, Typography, Card, styled, useTheme } from "@mui/material";

import { formatDistance } from "date-fns";
import Identicon from "react-identicons";
import ReactMarkdown from "react-markdown";
import ScheduleTwoToneIcon from "@mui/icons-material/ScheduleTwoTone";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";

import { identiconsPalette } from "constants";
import SourceDocs from "./SourceDocs";
import { FlexBetween } from "components";

import avatar2 from "assets/images/avatars/bot.png";

const CardWrapperPrimary = styled(Card)(
  ({ theme }) => `
      background: ${
        theme.palette.mode === "dark"
          ? theme.palette.background.dark
          : theme.palette.background.darker
      };
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(1.5)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

const CardWrapperSecondary = styled(Card)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[10]};
      color: ${
        theme.palette.mode === "dark"
          ? theme.palette.grey[100]
          : theme.palette.grey[700]
      };
      padding: ${theme.spacing(1.5)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
);

function ChatContent({ messages, activatedFile, isNeoBot }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { address } = useWallet();
  const theme = useTheme();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box p={3}>
      {messages?.map((message, index) => {
        return message.type === "apiMessage" ? (
          <Box
            key={message.time}
            display="flex"
            alignItems="flex-start"
            justifyContent="flex-start"
            py={3}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 50,
                height: 50,
              }}
              alt={activatedFile?.name}
              src={avatar2}
            />
            <Box
              display="flex"
              alignItems="flex-start"
              flexDirection="column"
              justifyContent="flex-start"
              ml={2}
            >
              <CardWrapperSecondary>
                <ReactMarkdown>{message?.message}</ReactMarkdown>
              </CardWrapperSecondary>
              <FlexBetween>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5,
                    }}
                    fontSize="small"
                  />
                  {formatDistance(new Date(message?.time), new Date(), {
                    addSuffix: true,
                  })}
                </Typography>
                {message.sourceDocs && (
                  <SourceDocs
                    isNeoBot={isNeoBot}
                    sourceDocs={message.sourceDocs}
                    index={index}
                  />
                )}
              </FlexBetween>
            </Box>
          </Box>
        ) : (
          <Box
            key={message.time}
            display="flex"
            alignItems="flex-start"
            justifyContent="flex-end"
            py={3}
          >
            <Box
              display="flex"
              alignItems="flex-end"
              flexDirection="column"
              justifyContent="flex-end"
              mr={2}
            >
              <CardWrapperPrimary>
                <ReactMarkdown>{message?.message}</ReactMarkdown>
              </CardWrapperPrimary>
              <FlexBetween>
                <Typography
                  variant="subtitle1"
                  sx={{
                    pt: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ScheduleTwoToneIcon
                    sx={{
                      mr: 0.5,
                    }}
                    fontSize="small"
                  />
                  {formatDistance(new Date(message?.time), new Date(), {
                    addSuffix: true,
                  })}
                </Typography>
                {message.sourceDocs && (
                  <SourceDocs sourceDocs={message.sourceDocs} index={index} />
                )}
              </FlexBetween>
            </Box>
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: theme.palette.background.light,
                width: 50,
                height: 50,
              }}
            >
              <Identicon
                size={32}
                string={address}
                palette={identiconsPalette}
              />
            </Avatar>
          </Box>
        );
      })}
      <div ref={messagesEndRef} />
    </Box>
  );
}

export default ChatContent;
