'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useReadContracts, useWriteContract, useAccount } from 'wagmi'
import { Spinner } from '@nextui-org/react'
import { parseAbi } from 'viem'
import EmptyState from '@/components/EmptyState'
import NftCard from '@/components/NftCard'


const abi = parseAbi([
  'function balanceOf(address _owner) external view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
  'function tokenURI(uint256 _tokenId) external view returns (string memory)'
])
const contractAddress = '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`

const NftList = () => {

  const [list, setList] = useState<any[]>([])
  const { address }: any = useAccount()
  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7',
    abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const balanceArray = useMemo(() => {
    if(balance) {
      const balanceArray = Array.from({length: Number(balance)}, (_, i) => i)
      return balanceArray
    }
    return []
  }, [balance])

  const { data: tokenIds } = useReadContracts({
    contracts: balanceArray.map((i) => ({
      address: contractAddress,
      abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, BigInt(i)],
    }))
  })

  const { data: tokenUris } = useReadContracts({
    contracts: tokenIds?.map((i) => ({
      address: contractAddress,
      abi,
      functionName: 'tokenURI',
      args: [i?.result],
    }))
  })

  const fetchData = async (uri: string) => {
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`)
    const metaData = await res.json()
    return metaData
  }

  const fetchList = async () => {
    if(!tokenUris) return
    const res = await Promise.all(tokenUris.map((i: any) => fetchData(i.result.replace('ipfs://', ''))))
    setList(res)
  }

  useEffect(() => {
    fetchList()
  }, [tokenUris])

  if(isLoading) return <Spinner />
  if(!balance) return <EmptyState />
  return (
    <div className="flex flex-wrap -m-2 mt-2">
      {list.map((i: any, index) => (
        <NftCard status='unlisted' tokenId={tokenIds?.[index].result} {...i} key={index} />
      ))}
    </div>
  )
}

export default NftList