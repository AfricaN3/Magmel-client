import React, { useContext } from "react";

import { Outlet, useParams, Navigate } from "react-router-dom";

import { ThemeContext } from "context/themeContext";

const OwnerOnlyRoute = () => {
  const params = useParams();
  const fileId = params.fileId;
  const { userFiles } = useContext(ThemeContext);
  const isOwnedByUser = userFiles?.find((file) => file._id === fileId);

  //if the user is there or not
  return isOwnedByUser ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default OwnerOnlyRoute;
