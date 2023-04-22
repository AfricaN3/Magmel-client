import { Box, styled } from "@mui/material";

const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `
      padding: 0 ${theme.spacing(2)};
      position: relative;
      bottom: -1px;
      margin-top: 14px;

      .MuiTabs-root {
        height: 44px;
        min-height: 44px;
      }

      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          min-height: 4px;
          height: 4px;
          box-shadow: none;
          bottom: -4px;
          background: none;
          border: 0;

          &:after {
            position: absolute;
            left: 50%;
            width: 28px;
            content: ' ';
            margin-left: -14px;
            background: ${theme.palette.background.alt};
            border-radius: inherit;
            height: 100%;
          }
      }

      .MuiTab-root {
          &.MuiButtonBase-root {
              height: 44px;
              min-height: 44px;
              background: ${theme.palette.background.alt};
              border: 1px solid ${theme.palette.background.lighter};
              border-bottom: 0;
              position: relative;
              margin-right: ${theme.spacing(1)};
              font-size: ${theme.typography.pxToRem(14)};
              color: ${
                theme.palette.mode === "dark"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[700]
              };
              border-bottom-left-radius: 0;
              border-bottom-right-radius: 0;

              .MuiTouchRipple-root {
                opacity: .1;
              }

              &:after {
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: 0;
                height: 1px;
                content: '';
                background: ${theme.palette.background.default};
              }

              &:hover {
                color: ${
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[50]
                    : theme.palette.grey[700]
                };
                background: ${theme.palette.background.darker}
              }
          }

          &.Mui-selected {
              color: ${theme.palette.grey[100]};
              background: ${theme.palette.primary[400]};
              border-bottom-color: ${theme.palette.grey[100]};

              &:after {
                height: 0;
              }
          }
      }
  `
);

export default TabsContainerWrapper;
