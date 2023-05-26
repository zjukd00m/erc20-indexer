import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  List,
  ListItem,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import { Utils } from 'alchemy-sdk';
import { useState } from 'react';
import { getERC20Tokens, getERC721Tokens, isValidEthererumAddress } from './utils/crypto';
import Nft from './Nft';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [tokensERC20, setTokensERC20] = useState([]);
  const [tokensERC721, setTokensERC721] = useState([]);
  const [loadingERC20, setLoadingERC20] = useState(false);
  const [loadingERC721, setLoadingERC721] = useState(false);
  const [error, setError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  async function getERC20TokenBalance() {
    if (!userAddress?.length || error?.length) return; 

    setLoadingERC20(false);

    const tokens = await getERC20Tokens(userAddress);

    setLoadingERC20(false);

    setTokensERC20(tokens);
  }

  async function getERC721TokenBalance() {
    if (!userAddress?.length || error?.length) return; 

    setLoadingERC721(true);

    const tokens = await getERC721Tokens(userAddress);

    setLoadingERC721(false);

    setTokensERC721(tokens);
  }

  function handleAddressChange(address) {
    setUserAddress(address);

    const isValid = isValidEthererumAddress(address);

    if (isValid) {
      setAddressError("Invalid ethereum address");
    } else {
      setAddressError("");
    }
  }

  return (
    <Box>
      <Flex
        boxSizing="border-box"
        w="100%"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Heading fontSize={33}>
          Token Indexer
        </Heading>
        <Heading mt={20} fontSize={20}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Flex direction="column" alignItems="flex-start" >
          <Flex alignItems="center">
            <Input
              onChange={(e) => handleAddressChange(e.target.value)}
              color="black"
              w="600px"
              p={4}
              bgColor="white"
              fontSize={24}
            />
            <Button onClick={() => {
              getERC20TokenBalance();
              getERC721TokenBalance();
            }} fontSize={14} color="black" bgColor={"#f1fa8c"} disabled={addressError?.length ? true : false}>
              Check ERC-20 Token Balances
            </Button>
          </Flex>
          {
            addressError?.length ? (
              <Text fontSize={13} color={"#ff5555"} textAlign={"left"}>
                { addressError }
              </Text>
            ) : null
          }
        </Flex>

        {
          modalOpen && token ? (
            <Nft token={token} modalOpen={modalOpen} onClose={() => {
              setModalOpen(false);
              setToken(null);
            }} /> 
          ) : null 
        }

        <SimpleGrid columns={2} spacing="2em">
          <Flex direction="column">
            <Heading my={36}>ERC-20 token balances:</Heading>
            {
              !loadingERC20 && tokensERC20?.length ? (
                <List width="100%" p={0}>
                  {
                    tokensERC20.map((token) => {
                      return (
                        <ListItem bgColor={"gray"} marginY="0.1em" key={token.contractAddress}>
                          <Flex alignItems="center" justifyContent="space-between" gap="3em" marginX="1em">
                            <Image src={token.metadata.logo} height={35} width={35} />
                            <Text fontSize={13}> {token.metadata.symbol}&nbsp; </Text>
                            <Text fontSize={13}> Balance: <span>
                            {Utils.formatUnits(
                              token.tokenBalance,
                              token.metadata.decimals
                            )}&nbsp;
                            </span>
                            </Text>
                          </Flex>
                        </ListItem>
                      )
                    })
                  }
                </List>
              ) : !loadingERC20 && !tokensERC20?.length ? (
                  <Text> Search some tokens </Text>
              ) : loadingERC20 ? (
                <Text> Loading... </Text>
              ) : null
            }
          </Flex>
          <Flex direction="column">
            <Heading my={36}>ERC-721 token balances:</Heading>
            {
              !loadingERC721 && tokensERC721?.length ? (
                <List width="100%" p={0}>
                  {
                    tokensERC721.map((token) => {
                      return (
                        <ListItem bgColor={"gray"} marginY="0.1em" key={token.metadata.tokenId} onClick={() => {
                          setToken(token);
                          setModalOpen(true);
                        }}>
                          <Flex alignItems="center" justifyContent="space-between" gap="3em" marginX="1em">
                            <Image src={token.metadata.rawMetadata.image} height={35} width={35} />
                            <Text fontSize={13}> {token.metadata.title}&nbsp; </Text>
                            <Text fontSize={13}> Balance: <span>
                            {Utils.formatUnits(
                              token.balance,
                              token.metadata.decimals
                            )}&nbsp;
                            </span>
                            </Text>
                          </Flex>
                        </ListItem>
                      )
                    })
                  }
                </List>
              ) : !loadingERC721 && !tokensERC721?.length ? (
                  <Text> Search some tokens </Text>
              ) : loadingERC721 ? (
                <Text> Loading... </Text>
              ) : null
            }
          </Flex>
        </SimpleGrid>

      </Flex>
    </Box>
  );
}

export default App;
