'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useReadContracts, useWriteContract, useAccount } from 'wagmi'
import { Spinner } from '@nextui-org/react'
import EmptyState from '@/components/EmptyState'
import NftCard from '@/components/NftCard'
import { timeoutPromise } from '@/utils/timeoutPromise'
import { YMNFT } from "@/utils/contracts"

const NftList = () => {

  const [list, setList] = useState<any[]>([])
  const { address }: any = useAccount()
  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: YMNFT.address,
    abi: YMNFT.abi,
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
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, BigInt(i)],
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

  const fetchData = async (uri: string) => {
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`)
    const metaData = await res.json()
    return metaData
  }

  const fetchList = async () => {
    if(!tokenUris) return
    const res = await Promise.all(
      tokenUris.map((i: any) => timeoutPromise(fetchData(i.result.replace('ipfs://', ''))))
    )
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
        <NftCard status='unlisted' tokenId={tokenIds?.[index]?.result} {...i} key={index} />
      ))}
    </div>
  )
}

export default NftList