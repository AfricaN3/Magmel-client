import React from "react";

import { Routes, Route, Navigate } from "react-router-dom";

import {
  Dashboard,
  Files,
  Home,
  Mint,
  Collection,
  About,
  Messenger,
} from "pages";

import useReadNeo from "hooks/useReadNeo";
import OwnerOnlyRoute from "./OwnerOnlyRoute";

const Routers = () => {
  const { myNfts, magmelNfts, totalSupply } = useReadNeo();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/dashboard" element={<Dashboard myNfts={myNfts} />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mint" element={<Mint />} />
      <Route path="/files" element={<Files />} />
      <Route
        path="/collection"
        element={<Collection magmelNfts={magmelNfts} />}
      />
      <Route
        path="/about"
        element={<About magmelNfts={magmelNfts} totalSupply={totalSupply} />}
      />
      <Route path="/" element={<OwnerOnlyRoute />}>
        <Route path="/chat/:fileId" element={<Messenger />} />
      </Route>
    </Routes>
  );
};

export default Routers;
