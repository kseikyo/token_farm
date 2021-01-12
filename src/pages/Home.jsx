import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Flex, Spinner } from "@chakra-ui/react";
import { getWeb3 } from "../utils/getWeb3";
import { fetchBlockchainData } from "../utils/fetchBlockchainData";
import Content from "../components/Content";

const Home = () => {
  const [account, setAccount] = useState("0x0");
  const [daiToken, setDaiToken] = useState({});
  const [, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState("0");
  const [dappTokenBalance, setDappTokenBalance] = useState("0");
  const [stakingBalance, setStakingBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadWeb3 = async () => {
      await getWeb3();
      await fetchBlockchainData(
        setAccount,
        setDaiToken,
        setDappToken,
        setTokenFarm,
        setDaiTokenBalance,
        setDappTokenBalance,
        setStakingBalance
      );
    };

    loadWeb3();
    setLoading(false);
  }, [stakingBalance, daiTokenBalance, dappTokenBalance]);

  const stakeTokens = async (amount) => {
    setLoading(true);
    try {
      await daiToken.methods
        .approve(tokenFarm._address, amount)
        .send({ from: account })
        .on("transactionHash", (_) => {
          tokenFarm.methods
            .stakeTokens(amount)
            .send({ from: account })
            .on("transactionHash", async (_) => {
              await fetchBlockchainData(
                setAccount,
                setDaiToken,
                setDappToken,
                setTokenFarm,
                setDaiTokenBalance,
                setDappTokenBalance,
                setStakingBalance
              );
              setLoading(false);
            });
        });
    } catch (err) {
      if (err.code === 4001) {
        setError("You rejected the transaction :(");
      }
      if (err.code === -32603) {
        setError("You don't have enough funds");
      }
      setLoading(false);
    }
  };

  const unstakeTokens = async () => {
    setLoading(true);
    try {
      await tokenFarm.methods
        .unstakeTokens()
        .send({ from: account })
        .on("transactionHash", async (_) => {
          await fetchBlockchainData(
            setAccount,
            setDaiToken,
            setDappToken,
            setTokenFarm,
            setDaiTokenBalance,
            setDappTokenBalance,
            setStakingBalance
          );
          setLoading(false);
        });
    } catch (err) {
      if (err.code === 4001) {
        setError("You rejected the transaction :(");
      }
      if (err.code === -32603) {
        setError("You have no staking balance :(");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar account={account} />
      <Flex>
        <Flex
          mt={4}
          as="main"
          w="100%"
          justifyContent="center"
          alignItems="center"
        >
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Content
              daiTokenBalance={daiTokenBalance}
              dappTokenBalance={dappTokenBalance}
              stakingBalance={stakingBalance}
              stakeTokens={stakeTokens}
              unstakeTokens={unstakeTokens}
              errorFromProps={error}
              w="100%"
              justifyContent="center"
              alignItems="center"
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
