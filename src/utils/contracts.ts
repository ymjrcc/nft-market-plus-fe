import { parseAbi } from "viem";

export const YMToken = {
  address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`, // localhost
  // address: '0xD6058907806a611cD9f4F3E565C3AED4633d6431' as `0x${string}`, // sepolia
  abi: parseAbi([
    'function balanceOf(address _owner) external view returns (uint256)',
    'function mint(address _to, uint256 _value) external',
    'function approve(address _spender, uint256 _value) external returns (bool)',
    'function nonces(address owner) external view returns (uint256)',
  ])
}

export const YMNFT = {
  address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as `0x${string}`, // localhost
  // address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`, // sepolia
  abi: parseAbi([
    'function setApprovalForAll(address operator, bool approved) external',
    'function balanceOf(address _owner) external view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
    'function tokenURI(uint256 _tokenId) external view returns (string memory)',
    'function safeMint(address to, string uri) external'
  ])
}

export const market = {
  address: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82' as `0x${string}`, // localhost
  abi: parseAbi([
    'function list(address _nftAddr, uint256 _tokenId, uint256 _price) external',
    'function cancel(address _nftAddr, uint256 _tokenId) external',
    'function buy(address _nftAddr, uint256 _tokenId) external',
    'function permitBuy(address _nftAddr, uint256 _tokenId, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external',
    'function nftList(address nftAddress, uint256 tokenId) external view returns (address owner, uint256 price)'
  ])
}

export const ADMIN = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' // localhost
// export const admin = '0xFA8Bac84bb8594B7Fc7ACAF932cA680D9A6E495E' // sepolia