import { Box, Container, styled } from "@mui/material";

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(4)};
        background: ${
          theme.palette.mode === "dark"
            ? theme.palette.background.dark
            : theme.palette.background.darker
        };
`
);

const PageTitleWrapper = ({ children }) => {
  return (
    <PageTitle className="MuiPageTitle-wrapper">
      <Container maxWidth="lg">{children}</Container>
    </PageTitle>
  );
};

export default PageTitleWrapper;
