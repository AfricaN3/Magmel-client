import { createContext, useRef, useEffect, useCallback, useState } from "react";
import axios from "axios";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { wallet } from "@cityofzion/neon-js";

import { toastMessage } from "utils";

const { NODE_ENV } = process.env;

let baseURL;

if (NODE_ENV === "development") {
  baseURL = "http://localhost:5001/api/v1/";
} else {
  baseURL = "https://magmel.onrender.com/api/v1/";
}

const config = {
  baseURL: baseURL,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
};

export const AxiosContext = createContext(null);
const AxiosInstanceProvider = ({ children }) => {
  const { connected, address, signMessage } = useWallet();
  const instanceRef = useRef(axios.create(config));
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
      ? JSON.parse(localStorage.getItem("access_token"))
      : null
  );

  useEffect(() => {
    instanceRef.current.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        // const originalRequest = error.config;

        if (typeof error.response === "undefined") {
          toastMessage("error", "Please check your network ", 5000);
          return Promise.reject(error);
        }

        if (error.response.status === 401) {
          toastMessage(
            "error",
            `${error.response.data}. Please refresh browser and sign message with your wallet`,
            15000
          );
          return Promise.reject(error);
        }
        if (error.response.status === 413) {
          toastMessage("error", `${error.response.data.message}.`, 5000);
          return Promise.reject(error);
        }

        if (error.response.status === 403) {
          toastMessage("error", `${error.response.data}`, 5000);
          return Promise.reject(error);
        }

        if (error.response.status === 402) {
          toastMessage("warning", `${error.response.data}`, 5000);
          return Promise.reject(error);
        }

        if (error.response.status === 400) {
          toastMessage("error", `${error.response.data}`, 10000);
          return Promise.reject(error);
        }

        if (error.response.status === 500) {
          toastMessage(
            "error",
            "Server Error: We're sorry, but something went wrong on our end. " +
              "Please try again later. If the problem persists, please contact AfricaN3. " +
              "Thank you for your understanding.",
            10000
          );
          return Promise.reject(error);
        }

        // specific error handling done elsewhere
        return Promise.reject(error);
      }
    );
  }, []);

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
          instanceRef.current.defaults.headers["Authorization"] =
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

  return (
    <AxiosContext.Provider
      value={{ axiosInstance: instanceRef.current, token }}
    >
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosInstanceProvider;
