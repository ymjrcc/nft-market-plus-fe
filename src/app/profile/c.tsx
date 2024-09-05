'use client'

import { useEffect, useMemo, useState } from 'react'
import { parseAbi } from 'viem'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { Input, Spinner, Button } from '@nextui-org/react'
import { BadgeDollarSign } from 'lucide-react'
import SectionTitle from '@/components/SectionTitle'
import NftList from './ntfList'
import YMToken from '@/abi/YMToken.json'
import toast from 'react-hot-toast'

const YMNFT = {
  address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`,
  abi: parseAbi([
    'function setApprovalForAll(address operator, bool approved) external'
  ])
}

const market = {
  address: '0x5Dfe4Aeb99e265D3B5A91Cf135FD6623193D942a' as `0x${string}`
}

const Page = () => {

  const { address }: any = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: '0xD6058907806a611cD9f4F3E565C3AED4633d6431',
    abi: YMToken.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const formatBalance = useMemo(() => {
    return balance ? (Number(balance) / (10 ** 18)).toString() : '0'
  }, [balance])

  const onApproveNft = async () => {
    const hash = await writeContractAsync({
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: 'setApprovalForAll',
      args: [market.address, true]
    })
    toast.success('Approval successful! The transaction hash is ' + hash.slice(-10))
  }

  return <>
    <div className='flex justify-between'>
      <SectionTitle title='My YMToken' />
      <Button color="primary" variant="bordered">Approve To Market</Button>
    </div>
    <div className='w-60 mb-10 mt-4'>
      {
        isLoading ? <Spinner /> : 
          <Input 
            isReadOnly label='balance' variant="bordered"
            value={formatBalance}
            endContent={<BadgeDollarSign className='text-amber-500'/>}
          />
      }
    </div>

    <div className='flex justify-between'>
      <SectionTitle title='My YMNFT' />
      <Button 
        color="primary" variant="bordered" 
        isLoading={isPending}
        onClick={onApproveNft}
      >Approve To Market</Button>
    </div>
    <NftList />
  </>
}

export default Page