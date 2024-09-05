import { parseAbi } from "viem";

export const YMToken = {
  address: '0xD6058907806a611cD9f4F3E565C3AED4633d6431' as `0x${string}`,
  abi: parseAbi([
    'function balanceOf(address _owner) external view returns (uint256)',
    'function mint(address _to, uint256 _value) external returns (bool)'
  ])
}

export const YMNFT = {
  address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`,
  abi: parseAbi([
    'function setApprovalForAll(address operator, bool approved) external',
    'function balanceOf(address _owner) external view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
    'function tokenURI(uint256 _tokenId) external view returns (string memory)',
    'function safeMint(address to, string uri) external'
  ])
}

export const market = {
  address: '0x5Dfe4Aeb99e265D3B5A91Cf135FD6623193D942a' as `0x${string}`,
  abi: parseAbi([
    'function list(address _nftAddr, uint256 _tokenId, uint256 _price) external',
    'function nftList(address nftAddress, uint256 tokenId) external view returns (address owner, uint256 price)'
  ])
}