import { parseAbi } from "viem";

export const YMToken = {
  address: '0x3f0be47e94f78620496c4017FD8044772C676655' as `0x${string}`, // sepolia
  abi: parseAbi([
    'function balanceOf(address _owner) external view returns (uint256)',
    'function mint(address _to, uint256 _value) external',
    'function approve(address _spender, uint256 _value) external returns (bool)',
    'function nonces(address owner) external view returns (uint256)',
  ])
}

export const YMNFT = {
  address: '0x565e230cCdA44D4b7E8436E6a65Aa87510882c58' as `0x${string}`, // sepolia
  abi: parseAbi([
    'function setApprovalForAll(address operator, bool approved) external',
    'function balanceOf(address _owner) external view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
    'function tokenURI(uint256 _tokenId) external view returns (string memory)',
    'function safeMint(address to, string uri) external'
  ])
}

export const market = {
  address: '0xe0a5a199EFA00f2a8A70999435BA18b42C43d676' as `0x${string}`, // sepolia
  abi: parseAbi([
    'function list(address _nftAddr, uint256 _tokenId, uint256 _price) external',
    'function listWithSignature(address _nftAddr, uint256 _tokenId, uint256 _price, uint256 _deadline, bytes calldata _signature) external',
    'function cancel(address _nftAddr, uint256 _tokenId) external',
    'function buy(address _nftAddr, uint256 _tokenId) external',
    'function permitBuy(address _nftAddr, uint256 _tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
    'function nftList(address nftAddress, uint256 tokenId) external view returns (address owner, uint256 price)',
  ])
}

// export const ADMIN = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // localhost
export const ADMIN = '0xFA8Bac84bb8594B7Fc7ACAF932cA680D9A6E495E' // sepolia