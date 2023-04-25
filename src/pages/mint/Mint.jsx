import React, { useState } from "react";

import { Box, Container, Tabs, Tab, useMediaQuery } from "@mui/material";
import { useWallet } from "@rentfuse-labs/neo-wallet-adapter-react";
import { sc, wallet } from "@cityofzion/neon-js";
import { WitnessScope } from "@rentfuse-labs/neo-wallet-adapter-base";
import { helpers } from "@cityofzion/props";
import { useNavigate } from "react-router-dom";

import { toastMessage, getRandomPrompt } from "utils";
import {
  ConnectWalletPage,
  MintTabCard,
  PageTitle,
  PageTitleWrapper,
  TabsContainerWrapper,
} from "components";
import useReadNeo from "hooks/useReadNeo";
import {
  gasContractAddress,
  magmelContractAddress,
  rpcAddress,
  pureImaginationMessages,
  inspirationGeneratorMessages,
  brainstormMessages,
} from "constants";
import useAxiosPost from "hooks/useAxiosPost";

const Mint = ({ emitBlockchainCall }) => {
  const [currentTab, setCurrentTab] = useState("pureImagination");
  const [loading, setLoading] = useState(false);
  const { axiosInstance } = useAxiosPost();

  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { connected, address, invoke } = useWallet();
  const { gasBalance, amountPayable } = useReadNeo();
  const navigate = useNavigate();

  const [generatedImageData, setGeneratedImageData] = useState({
    image: "",
    description: "",
    name: "",
    uri: "",
  });

  const [form, setForm] = useState({
    name: "",
    prompt: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    prompt: "",
  });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const tabs = [
    { value: "pureImagination", label: "Solo" },
    { value: "brainstorm", label: "Brainstorm" },
    { value: "inspirationGenerator", label: "Inspiration Generator" },
  ];

  const handleTabsChange = (_event, value) => {
    setCurrentTab(value);
  };
  const buttonAction = () => {
    navigate("/files");
  };

  const handleInspirationGenerator = async () => {
    try {
      setFormErrors({
        name: "",
        prompt: "",
      });
      if (!form.prompt) {
        setFormErrors((formErrors) => ({
          ...formErrors,
          prompt: "'Please input a prompt",
        }));
        toastMessage("error", "Please input a text to help the AI inspire you");
        return;
      }
      setLoading(true);

      const response = await axiosInstance.post(
        `ai/prompt/`,
        JSON.stringify({
          prompt: form.prompt,
        })
      );
      toastMessage(
        "success",
        "Prompt was successfully generated! Generate image",
        8500
      );
      setForm({
        ...form,
        prompt: `${response.data.generated}`,
      });
    } catch (err) {
      toastMessage(
        "error",
        "There was an error while generating Prompt. Please check your console for details",
        5000
      );

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrainstorm = async () => {
    try {
      setFormErrors({
        name: "",
        prompt: "",
      });
      if (!form.prompt) {
        setFormErrors((formErrors) => ({
          ...formErrors,
          prompt: "'Please input a prompt",
        }));
        toastMessage(
          "error",
          "Please input a text for the AI to brainstorm over"
        );
        return;
      }
      setLoading(true);
      const response = await axiosInstance.post(
        `ai/prompt/summarize/`,
        JSON.stringify({
          prompt: form.prompt,
        })
      );
      toastMessage(
        "success",
        "Prompt was successfully generated! Generate image",
        8500
      );

      setForm({
        ...form,
        prompt: `${response.data.generated}`,
      });
    } catch (err) {
      toastMessage(
        "error",
        "There was an error while generating Prompt. Please check your console for details",
        5000
      );
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    try {
      if (generatedImageData.image) {
        toastMessage(
          "error",
          "Clear the previous generated Image before you can generate another"
        );
        return;
      }

      if (!address || !connected) {
        toastMessage(
          "error",
          "You need to connect a wallet to generate Image",
          5000
        );
        return;
      }
      setFormErrors({
        name: "",
        prompt: "",
      });
      if (!form.prompt || !form.name) {
        !form.name
          ? setFormErrors((formErrors) => ({
              ...formErrors,
              name: "'Please input a name",
            }))
          : setFormErrors((formErrors) => ({
              ...formErrors,
              prompt: "'Please input a prompt",
            }));
        toastMessage("error", "Please provide proper prompt or name", 5000);
        return;
      }
      setLoading(true);
      const response = await axiosInstance.post(
        `ai/`,
        JSON.stringify({
          prompt: form.prompt,
        })
      );

      toastMessage(
        "success",
        "Congratulations! Your MAGMEL NFT has been successfully created. You can now view your unique and creative image or mint it as an NFT.",
        8500
      );

      setGeneratedImageData({
        image: response.data.photo,
        description: form.prompt,
        name: form.name,
        uri: "",
      });
    } catch (err) {
      toastMessage(
        "error",
        "There was an error while generating Image. Please check your console for details",
        5000
      );

      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFields = () => {
    setGeneratedImageData({
      image: "",
      description: "",
      name: "",
      uri: "",
    });
  };

  const handleOnSubmit = async () => {
    if (
      generatedImageData.description &&
      generatedImageData.image &&
      generatedImageData.name
    ) {
      try {
        if (!address || !connected) {
          toastMessage(
            "error",
            `You need to connect a wallet to upload Image`,
            5000
          );
          return;
        }
        if (parseInt(amountPayable) > parseInt(gasBalance) + 20000000) {
          toastMessage("error", "You have insufficient GAS", 5000);

          return;
        }
        setLoading(true);
        const response = await axiosInstance.post(
          `post/`,
          JSON.stringify({ ...generatedImageData, owner: address })
        );
        toastMessage(
          "success",
          `Image was succesfully uploaded to IPFS! Mint image`,
          5000
        );

        const jsonMetadata = response.data.data;

        let param = {
          scriptHash: gasContractAddress,
          operation: "transfer",
          args: [
            {
              type: "Hash160",
              value: sc.ContractParam.hash160(address).toJson().value,
            },
            {
              type: "Hash160",
              value: sc.ContractParam.hash160(magmelContractAddress).toJson()
                .value,
            },
            {
              type: "Integer",
              value: sc.ContractParam.integer(amountPayable).toJson().value,
            },
            {
              type: "ByteArray",
              value: sc.ContractParam.byteArray(jsonMetadata).toJson().value,
            },
          ],
          signers: [
            {
              account: wallet.getScriptHashFromAddress(address),
              scopes: WitnessScope.CalledByEntry,
            },
          ],
        };

        let result = await invoke(param);
        if (result.data?.txId) {
          toastMessage("info", "Confirming Transaction", 20000);

          await helpers.sleep(20000);
          let new_result;
          new_result = await helpers.txDidComplete(
            rpcAddress,
            result.data?.txId,
            true
          );
          const sent = new_result[0];
          if (sent) {
            toastMessage(
              "success",
              "Congratulations! You have successfully minted your NFT. Your unique piece of art is now a part of Magpie Melanges. You can now train your AI models by uploading your PDF files and chat with them. Start exploring the power of AI now!",
              10000
            );
            emitBlockchainCall();
            navigate("/dashboard");
          } else {
            toastMessage("error", "Transaction was not successful", 5000);
          }
        }

        setGeneratedImageData({
          ...generatedImageData,
          uri: `${response.data.uri}`,
        });
      } catch (err) {
        toastMessage(
          "error",
          `There was an error while uploading image. Please check your console for details`,
          5000
        );
        console.log(err);
        toastMessage(
          "error",
          `There was an error while minting.. check console`,
          5000
        );
      } finally {
        setLoading(false);
      }
    } else {
      toastMessage("error", `You have no generated NFT metadata yet`, 5000);
    }
  };

  return (
    <Box>
      <PageTitleWrapper>
        <PageTitle
          heading=" Mint Your Own AI-Generated NFT"
          subHeading="Create Unique Artwork with Our AI-Powered Platform"
          buttonAction={buttonAction}
          buttonTitle={`${"Add Files"}`}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {connected ? (
          <>
            <TabsContainerWrapper>
              <Tabs
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  "& .MuiTab-root": {
                    height: isNonMobile ? "44px" : "30px",
                    minHeight: isNonMobile ? "44px" : "30px",
                    width: isNonMobile ? "100px" : "50px",
                  },
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                    sx={{
                      borderRadius: "0.5rem",
                    }}
                  />
                ))}
              </Tabs>
            </TabsContainerWrapper>
            {currentTab === "pureImagination" && (
              <MintTabCard
                subHeading={"Create Your Own Masterpiece"}
                form={form}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleOnSubmit={handleOnSubmit}
                pureImagination
                generatedImageData={generatedImageData}
                generateImage={generateImage}
                loading={loading}
                handleClearFields={handleClearFields}
                messages={pureImaginationMessages}
              />
            )}
            {currentTab === "brainstorm" && (
              <MintTabCard
                subHeading={"Transform Text into Art"}
                form={form}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleOnSubmit={handleOnSubmit}
                brainstorm
                generatedImageData={generatedImageData}
                generateImage={generateImage}
                loading={loading}
                handleBrainstorm={handleBrainstorm}
                handleClearFields={handleClearFields}
                messages={brainstormMessages}
              />
            )}
            {currentTab === "inspirationGenerator" && (
              <MintTabCard
                subHeading={"Unlock Your Imagination"}
                form={form}
                formErrors={formErrors}
                handleInputChange={handleInputChange}
                handleOnSubmit={handleOnSubmit}
                inspirationGenerator
                generatedImageData={generatedImageData}
                generateImage={generateImage}
                handleSurpriseMe={handleSurpriseMe}
                handleInspirationGenerator={handleInspirationGenerator}
                loading={loading}
                handleClearFields={handleClearFields}
                messages={inspirationGeneratorMessages}
              />
            )}
          </>
        ) : (
          <ConnectWalletPage message={`Connect your wallet to mint MAGMEL`} />
        )}
      </Container>
    </Box>
  );
};

export default Mint;
