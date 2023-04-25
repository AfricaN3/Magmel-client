import React, { createContext, useState, useEffect } from "react";

import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { wallet } from "@cityofzion/neon-js";

import useAxiosPost from "hooks/useAxiosPost";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("dark");
  const { axiosInstance, token } = useAxiosPost();

  const setTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const { address } = useWallet();

  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [fileChanges, setFileChanges] = useState(0);

  const emitCall = () => {
    setFileChanges((fileChanges) => fileChanges + 1);
  };

  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoadingFiles(true);
        const response = await axiosInstance.get(`post/files/${address}/`);
        setUserFiles(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingFiles(false);
      }
    };
    if (
      !!address &&
      !!token &&
      wallet.getScriptHashFromPublicKey(token.publicKey) ===
        wallet.getScriptHashFromAddress(address)
    ) {
      loadFiles();
    } else {
      setUserFiles([]);
    }
  }, [address, fileChanges, token]);

  return (
    <ThemeContext.Provider
      value={{ mode, setTheme, isLoadingFiles, userFiles, emitCall }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
