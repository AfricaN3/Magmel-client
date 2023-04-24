import React, { createContext, useState, useEffect, useCallback } from "react";

import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { wallet } from "@cityofzion/neon-js";

import axiosInstance from "../api";
import { toastMessage } from "../utils";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
      ? JSON.parse(localStorage.getItem("access_token"))
      : null
  );

  const [mode, setMode] = useState("dark");

  const setTheme = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const { connected, address, signMessage } = useWallet();

  const getTokenMemo = useCallback(() => {
    const getToken = async () => {
      if (
        !!token &&
        wallet.getScriptHashFromPublicKey(token.publicKey) ===
          wallet.getScriptHashFromAddress(address)
      ) {
        return;
      } else {
        localStorage.removeItem("access_token");
      }
      try {
        // TODO: check for onegate and run the onegate code
        let signedMessage = await signMessage({
          message: "Welcome to MAGMEL",
        });
        let authObject = signedMessage.data;
        if (authObject) {
          localStorage.setItem("access_token", JSON.stringify(authObject));
          axiosInstance.defaults.headers["Authorization"] =
            "Bearer " + localStorage.getItem("access_token");
          setToken(authObject);
        }
      } catch (error) {
        console.log(error);
        if (error.description) {
          toastMessage("error", error.description, 5000);
        }
      }
    };
    getToken();
  }, [token, address]);

  useEffect(() => {
    if (connected || address) {
      getTokenMemo();
    }
  }, [address, connected, getTokenMemo]);

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
      value={{ token, mode, setTheme, isLoadingFiles, userFiles, emitCall }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
