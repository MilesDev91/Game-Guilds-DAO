import { NextPage } from "next";
import { useRouter } from "next/router";
import { useApiContract, useMoralis } from "react-moralis";
import { useMoralisWeb3Api } from "react-moralis";
import { useEffect, useState } from "react";
import { Button, Icon, Col, Row, Form } from "web3uikit";
import { createProposal } from "../../utils/snapshot/snapshot";
import MintNFT from "../../utils/snapshot/MintNFT";
import styles from "../../styles/Guild.module.css";
import { NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS } from "../../constants";

const Guild: NextPage = () => {
  const router = useRouter();
  console.log(router.query);
  const guildIndex = router.query.index;
  const name = router.query.name;
  const { user } = useMoralis();
  const Web3Api = useMoralisWeb3Api();

  const { runContractFunction, data, error } = useApiContract({
    address: NFT_CONTRACT_ADDRESS,
    abi: NFT_CONTRACT_ABI,
    functionName: "returnGuilds",
    chain: "rinkeby",
  });

  useEffect(() => {
    runContractFunction();
  }, []);

  const fetchDateToBlock = async () => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const options = { chain: "rinkeby", date: timestamp };
    const date = await Web3Api.native.getDateToBlock(options);
    return date;
  };

  const handleSubmit = async (e) => {
    if (!user) {
      // TODO: Implement error notifications
      console.error("You must have a connected wallet to continue.");
    } else {
      const date = await fetchDateToBlock();
      console.log(e.data, date);
      createProposal(e.data, date.block);
      return false;
    }
  };

  return (
    <div className="main">
      <h1>{name}</h1>
      {guildIndex && typeof guildIndex === "string" ? (
        <MintNFT guildId={parseInt(guildIndex)} />
      ) : (
        ""
      )}

      <Form
        id="poll"
        buttonConfig={{
          theme: "primary",
          isLoading: false,
          loadingText: "Loading",
          text: "Create",
        }}
        data={[
          {
            inputWidth: "50%",
            name: "Poll name",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "100%",
            name: "Description",
            type: "textarea",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "50%",
            name: "End date",
            type: "date",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "25%",
            name: "Choice A",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "25%",
            name: "Choice B",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "25%",
            name: "Choice C",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
          {
            inputWidth: "25%",
            name: "Choice D",
            type: "text",
            validation: {
              required: true,
            },
            value: "",
          },
        ]}
        onSubmit={(e) => handleSubmit(e)}
        title="Create Poll"
      />
    </div>
  );
};

export default Guild;
