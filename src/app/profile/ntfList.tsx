'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useReadContracts, useWriteContract, useAccount } from 'wagmi'
import { Spinner } from '@nextui-org/react'
import YMNFT from '@/abi/YMNFT.json'
import EmptyState from '@/components/EmptyState'
import NftCard from '@/components/NftCard'


const NftList = () => {

  const [list, setList] = useState<any[]>([])
  const { address } = useAccount()
  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7',
    abi: YMNFT.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const balanceArray = useMemo(() => {
    if(balance) {
      const balanceArray = Array.from({length: Number(balance)}, (_, i) => i)
      console.log(balanceArray)
      return balanceArray
    }
    return []
  }, [balance])

  const { data: tokenIds } = useReadContracts({
    contracts: balanceArray.map((i) => ({
      address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7',
      abi: YMNFT.abi,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, BigInt(i)],
    }))
  })

  const { data: tokenUris, refetch: refetchTokenUris } = useReadContracts({
    contracts: tokenIds?.map((i) => ({
      address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7',
      abi: YMNFT.abi,
      functionName: 'tokenURI',
      args: [i?.result],
    }))
  })

  const fetchData = async (uri: string) => {
    const res = await fetch(`https://ipfs.io/ipfs/${uri}`)
    const metaData = await res.json()
    console.log(metaData);
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
        <NftCard {...i} key={index} />
        // <div key={index}>
        //   <div>{i.title}</div>
        //   <div>{i.description}</div>
        //   <div>{i.image}</div>
        // </div>
      ))}
    </div>
  )
}

export default NftList