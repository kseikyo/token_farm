import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Image,
  Link,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import React from "react";
import FarmerIcon from "../assets/farmer.png";

const Navbar = ({ account }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      p={5}
      justifyContent="space-between"
      alignItems="center"
      boxShadow="lg"
      as="header"
    >
      <Flex as={Link} alignItems="center">
        <Image src={FarmerIcon} boxSize="2.5rem" mr={4} />
        <Text fontSize="1.125rem" as="h1">DApp Token Farm</Text>
      </Flex>
      <Flex alignItems="center">
        <IconButton
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          mr={4}
        />
        <Text as="small">{account}</Text>
      </Flex>
    </Flex>
  );
};

export default Navbar;
