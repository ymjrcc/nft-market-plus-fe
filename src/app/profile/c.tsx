'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { Input, Spinner, Button } from '@nextui-org/react'
import { BadgeDollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import SectionTitle from '@/components/SectionTitle'
import NftList from './ntfList'
import { YMToken, YMNFT, market } from '@/utils/contracts'

const Page = () => {

  const { address }: any = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const [activeBtn, setActiveBtn] = useState('token')

  const { data: balance, error, isLoading, refetch } = useReadContract({
    address: YMToken.address,
    abi: YMToken.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const formatBalance = useMemo(() => {
    return balance ? (Number(balance) / (10 ** 18)).toString() : '0'
  }, [balance])

  const onApproveNft = async () => {
    setActiveBtn('nft')
    const hash = await writeContractAsync({
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: 'setApprovalForAll',
      args: [market.address, true]
    })
    toast.success('Approval successful! The transaction hash is ' + hash.slice(-10))
  }

  const onApproveToken = async () => {
    setActiveBtn('token')
    if(!balance) {
      toast.error('You have no YMToken to approve!')
      return
    }
    const hash = await writeContractAsync({
      address: YMToken.address,
      abi: YMToken.abi,
      functionName: 'approve',
      args: [market.address, balance],
    })
    toast.success('Approval successful! The transaction hash is ' + hash.slice(-10))
  }

  return <>
    <div className='flex justify-between'>
      <SectionTitle title='My YMToken' />
      <Button 
        color="primary" variant="bordered"
        isLoading={isPending && activeBtn === 'token'}
        onClick={onApproveToken}
      >Approve To Market</Button>
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
        isLoading={isPending && activeBtn === 'nft'}
        onClick={onApproveNft}
      >Approve To Market</Button>
    </div>
    <NftList />
  </>
}

export default Page