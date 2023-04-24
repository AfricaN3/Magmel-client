import React, { useState } from "react";

import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Navbar, Sidebar } from "components";

const Layout = ({ gasBalance }) => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Box flexGrow={1}>
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          gasBalance={gasBalance}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
