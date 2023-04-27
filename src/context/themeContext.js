import React, { createContext, useState, useEffect } from "react";

import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { wallet } from "@cityofzion/neon-js";

import useAxiosPost from "hooks/useAxiosPost";
import { NeoBotId } from "constants";

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
      const neoFile = {
        createdAt: "2023-04-22T06:15:35.182Z",
        description: "Your go-to for Neo blockchain queries.",
        file: NeoBotId,
        name: "Neo Assistant",
        owner: address,
        publicId: "magmel/neoFile",
        updatedAt: "2023-04-22T06:15:35.182Z",
        __v: 0,
        _id: NeoBotId,
      };
      try {
        setIsLoadingFiles(true);
        const response = await axiosInstance.get(`post/files/${address}/`);
        const connectedUserFiles = response.data;
        connectedUserFiles.push(neoFile);
        setUserFiles(connectedUserFiles);
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
