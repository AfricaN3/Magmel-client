import { useMemo, useContext } from "react";

import { BrowserRouter as Router } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

import { ThemeContext } from "context/themeContext";
import { themeSettings } from "theme";
import { Layout } from "components";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const { mode } = useContext(ThemeContext);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer theme="dark" />
        <Layout />
      </ThemeProvider>
    </Router>
  );
}

export default App;
