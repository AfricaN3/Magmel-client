import { useState, useEffect, useMemo } from "react";

import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import Neon from "@cityofzion/neon-js";
import { rpc } from "@cityofzion/neon-core";
import axios from "axios";

import {
  rpcAddress,
  gasContractAddress,
  networkMagic,
  magmelContractAddress,
  mintFee,
} from "../constants";
import { toInvocationArgument, convertBytestring } from "../utils";

const getImageFromIpfs = async (image) => {
  try {
    const tokenURI = image.slice(7);
    const ipfsImageUrl = `https://ipfs.io/ipfs/${tokenURI}`;
    const ipfsResponse = await axios.get(`${ipfsImageUrl}`);
    const data = ipfsResponse.data;

    return data;
  } catch (error) {
    console.log(error);
  }
};

const useReadNeo = () => {
  const { address, connected } = useWallet();
  const [gasBalance, setGasBalance] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [isDiscountEligible, setIsDiscountEligible] = useState(false);
  const [amountPayable, setAmountPayable] = useState(mintFee);
  const [magmelNfts, setMagmelNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const [userBalance, setUserBalance] = useState(0);
  const [blockchainChanges, setBlockchainChanges] = useState(0);

  const emitBlockchainCall = () => {
    setBlockchainChanges((blockchainChanges) => blockchainChanges + 1);
  };

  const rpcClient = useMemo(() => new rpc.RPCClient(rpcAddress), []);

  useEffect(() => {
    const magmelContract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(magmelContractAddress),
      {
        networkMagic: networkMagic,
        rpcAddress: rpcAddress,
      }
    );

    const getMagpieMelanges = async () => {
      try {
        const totalSupplyResult = await magmelContract.testInvoke(
          "totalSupply",
          []
        );

        let count = totalSupplyResult.stack[0].value;

        let parsedCount = parseInt(count);

        let lowerLimit = parsedCount <= 20 ? 0 : parsedCount - 20;

        let nftArray = [];
        for (let i = parsedCount; i > lowerLimit; i--) {
          const magmelResult = await magmelContract.testInvoke(
            "propertiesJson",
            [toInvocationArgument("Integer", i)]
          );
          let nftData = JSON.parse(
            convertBytestring(magmelResult.stack[0].value)
          );

          nftData.id = i;
          nftData.image = await getImageFromIpfs(nftData.image);

          nftArray.push(nftData);
        }

        setTotalSupply(parsedCount);
        setMagmelNfts(nftArray);
      } catch (error) {
        console.log(error);
      }
    };
    getMagpieMelanges();
  }, [rpcClient]);

  useEffect(() => {
    const gasContract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(gasContractAddress),
      {
        networkMagic: networkMagic,
        rpcAddress: rpcAddress,
      }
    );
    const magmelContract = new Neon.experimental.SmartContract(
      Neon.u.HexString.fromHex(magmelContractAddress),
      {
        networkMagic: networkMagic,
        rpcAddress: rpcAddress,
      }
    );

    if (connected) {
      const sendConnectedTransaction = async () => {
        try {
          const gasBalanceResult = await gasContract.testInvoke("balanceOf", [
            toInvocationArgument("Hash160", address),
          ]);
          const isDiscountEligibleResult = await magmelContract.testInvoke(
            "isDiscountEligible",
            [toInvocationArgument("Hash160", address)]
          );
          const mintFeeResult = await magmelContract.testInvoke(
            "getMintFee",
            []
          );
          const getDiscountRateResult = await magmelContract.testInvoke(
            "getDiscountRate",
            []
          );

          let rawAmountPayable = mintFeeResult.stack[0].value;
          let discountRate = getDiscountRateResult.stack[0].value;
          const isDiscountEligibleRaw = isDiscountEligibleResult.stack[0].value;
          if (isDiscountEligibleRaw) {
            rawAmountPayable =
              (rawAmountPayable * (10000 - discountRate)) / 10000;
          }

          setGasBalance(gasBalanceResult.stack[0].value);
          setIsDiscountEligible(isDiscountEligibleRaw);
          setAmountPayable(rawAmountPayable);

          const ownerBalanceResult = await magmelContract.testInvoke(
            "balanceOf",
            [toInvocationArgument("Hash160", address)]
          );
          const ownerTokensResult = await magmelContract.testInvoke(
            "tokensOf",
            [toInvocationArgument("Hash160", address)]
          );

          let count = ownerBalanceResult.stack[0].value;
          setUserBalance(parseInt(count));
          if (parseInt(count) >= 0) {
            let nftiterator = await rpcClient.traverseIterator(
              ownerTokensResult.session,
              ownerTokensResult.stack[0].id,
              parseInt(count)
            );

            let nftArray = [];
            for (let i = 0; i < nftiterator.length; i++) {
              const magmelResult = await magmelContract.testInvoke(
                "propertiesJson",
                [toInvocationArgument("ByteArray", nftiterator[i].value)]
              );
              let nftData = JSON.parse(
                convertBytestring(magmelResult.stack[0].value)
              );

              nftData.id = nftiterator[i].value;
              nftData.image = await getImageFromIpfs(nftData.image);
              nftArray.push(nftData);
            }
            setMyNfts(nftArray.reverse());
          }
        } catch (error) {
          console.log(error);
        }
      };
      sendConnectedTransaction();
    } else {
      setGasBalance(0);
      setIsDiscountEligible(false);
      setAmountPayable(mintFee);
      setMyNfts([]);
    }
  }, [connected, address, rpcClient, blockchainChanges]);

  return {
    gasBalance,
    isDiscountEligible,
    amountPayable,
    magmelNfts,
    myNfts,
    totalSupply,
    userBalance,
    emitBlockchainCall,
  };
};

export default useReadNeo;
