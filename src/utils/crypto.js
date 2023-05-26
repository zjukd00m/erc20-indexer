import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';

const config = {
  apiKey: '',
  network: Network.ETH_MAINNET,
};

export const alchemy = new Alchemy(config);

export async function ensToAddress(ens) {
  const address = await alchemy.core.resolveName(ens);

  return address;
}

export async function isValidEthererumAddress(address) {
  const _address = ethers.utils.hexZeroPad(address, 32);
  return ethers.utils.isAddress(_address);
}

export async function getERC20Tokens(address) {
  const isAddress = ethers.utils.isAddress(address);

  let _address;

  if (!isAddress) {
    _address = await alchemy.core.resolveName(address);
  } else {
    _address = address;
  }

  const tokens = await alchemy.core.getTokenBalances(_address);

  return await Promise.all(
    tokens?.tokenBalances?.map(async (token) => {
      const metadata = await alchemy.core.getTokenMetadata(
        token.contractAddress
      );

      return { ...token, metadata };
    })
  );
}

export async function getERC721Tokens(address) {
  const isAddress = ethers.utils.isAddress(address);

  let _address;

  if (!isAddress) {
    _address = await alchemy.core.resolveName(address);
  } else {
    _address = address;
  }

  const nfts = await alchemy.nft.getNftsForOwner(_address);

  return await Promise.all(
    nfts?.ownedNfts?.map(async (nft) => {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );

      return { ...nft, metadata };
    })
  );
}
