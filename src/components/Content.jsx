import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";

import dai from "../assets/dai.png";

function InputRightComplement() {
  return (
    <Flex pos="relative" justifyContent="center" alignItems="center">
      <Image w="30%" display="inline-block" src={dai} mr={2} />
      <Text>mDAI</Text>
    </Flex>
  );
}

function Content({
  daiTokenBalance,
  dappTokenBalance,
  stakingBalance,
  stakeTokens,
  unstakeTokens,
  errorFromProps,
  ...rest
}) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const mDai = window.web3.utils.fromWei(stakingBalance, "Ether");
  const mDapp = window.web3.utils.fromWei(dappTokenBalance, "Ether");
  const balance = window.web3.utils.fromWei(daiTokenBalance, "Ether");

  const text = useColorModeValue("light", "dark");

  function handleSubmit(event) {
    event.preventDefault();
    if (parseInt(balance) < 1 || parseInt(amount) > parseInt(balance)) {
      setError("Not enough funds to stake.");
      return;
    }
    if (amount < 1) {
      setError(`Cannot stake ${amount || 0} tokens`);
      return;
    }
    setError("");
    const weiAmount = window.web3.utils.toWei(amount, "Ether");
    stakeTokens(weiAmount);
  }

  function handleInputChange(event) {
    const { value } = event.target;
    setAmount(value);
  }

  return (
    <Flex mt={10} {...rest}>
      <Flex w="90%" maxW="600px" flexDir="column">
        <Flex w="100%" justifyContent="space-around" alignItems="center" mb={5}>
          <Text>Staking Balance</Text>
          <Text>Reward Balance</Text>
        </Flex>
        <Flex w="100%" justifyContent="space-around" alignItems="center">
          <Text>{mDai} mDAI</Text>
          <Text>{mDapp} DAPP</Text>
        </Flex>

        <Box
          borderRadius={5}
          mt={8}
          boxShadow={text === "dark" ? "dark-lg" : "2xl"}
          padding={5}
        >
          <form onSubmit={handleSubmit}>
            <Flex justifyContent="space-between" mb={4}>
              <Text fontWeight="bold">Stake tokens</Text>
              <Text>Balance: {balance}</Text>
            </Flex>
            <InputGroup d="flex" flexDir="column" mb={6}>
              <Flex>
                <Input
                  type="number"
                  value={amount}
                  onChange={handleInputChange}
                  id="amount"
                  name="amount"
                  placeholder={0}
                />
                <InputRightAddon children={<InputRightComplement />} />
              </Flex>
              <Text as="small" color="tomato">
                {errorFromProps ? errorFromProps : error}
              </Text>
            </InputGroup>
            <Button mb={3} w="100%" type="submit" colorScheme="blue">
              STAKE!
            </Button>
          </form>
          <Flex justifyContent="center">
            <Button
              type="submit"
              variant="link"
              colorScheme="blue"
              onClick={(event) => {
                event.preventDefault();
                unstakeTokens();
              }}
            >
              UN-STAKE...
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}

export default Content;
