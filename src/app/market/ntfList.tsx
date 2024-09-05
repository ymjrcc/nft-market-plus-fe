'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useReadContracts, useWriteContract, useAccount } from 'wagmi'
import { Spinner } from '@nextui-org/react'
import { parseAbi } from 'viem'
import EmptyState from '@/components/EmptyState'
import NftCard from '@/components/NftCard'

const YMNFT = {
  address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`,
  abi: parseAbi([
    'function balanceOf(address _owner) external view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)',
    'function tokenURI(uint256 _tokenId) external view returns (string memory)'
  ])
}

const market = {
  address: '0x5Dfe4Aeb99e265D3B5A91Cf135FD6623193D942a' as `0x${string}`,
  abi: parseAbi([
    'function nftList(address nftAddress, uint256 tokenId) external view returns (address owner, uint256 price)'
  ])
}

const NftList = () => {

  const [list, setList] = useState<any[]>([])
  const { address }: any = useAccount()
  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7',
    abi: YMNFT.abi,
    functionName: 'balanceOf',
    args: [market.address],
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
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [market.address, BigInt(i)],
    }))
  })

  const { data: tokenUris } = useReadContracts({
    contracts: tokenIds?.map((i) => ({
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: 'tokenURI',
      args: [i?.result],
    }))
  })

  const { data: orders } = useReadContracts({
    contracts: tokenIds?.map((i) => ({
      address: market.address,
      abi: market.abi,
      functionName: 'nftList',
      args: [YMNFT.address, i?.result],
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

  useEffect(() => {
    console.log(orders)
  }, [orders])

  if(isLoading) return <Spinner />
  if(!balance) return <EmptyState />
  return (
    <div className="flex flex-wrap -m-2 mt-2">
      {list.map((i: any, index) => (
        <NftCard 
        status='listing' 
        tokenId={tokenIds?.[index].result}
        owner={orders?.[index]?.result?.[0]}
        price={orders?.[index]?.result?.[1]}
        {...i} key={index} 
        />
      ))}
    </div>
  )
}

export default NftList