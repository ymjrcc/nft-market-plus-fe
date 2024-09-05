'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { Input, Spinner } from '@nextui-org/react'
import { BadgeDollarSign } from 'lucide-react'
import SectionTitle from '@/components/SectionTitle'
import NftList from './ntfList'
import YMToken from '@/abi/YMToken.json'

const Page = () => {

  const { address } = useAccount()
  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: '0xD6058907806a611cD9f4F3E565C3AED4633d6431',
    abi: YMToken.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const formatBalance = useMemo(() => {
    return balance ? (Number(balance) / (10 ** 18)).toString() : '0'
  }, [balance])

  return <>
    <SectionTitle title='My YMToken' />
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

    <SectionTitle title='My YMNFT' />
    <NftList />
  </>
}

export default Page