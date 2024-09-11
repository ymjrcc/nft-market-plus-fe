'use client'

import { useEffect, useMemo, useState } from 'react'
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { Input, Spinner, Button, Tooltip } from '@nextui-org/react'
import { BadgeDollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import SectionTitle from '@/components/SectionTitle'
import NftList from './ntfList'
import { YMToken, YMNFT, market } from '@/utils/contracts'

const Page = () => {

  const { address }: any = useAccount()
  const [activeBtn, setActiveBtn] = useState('token')

  const { data: hash, writeContractAsync, isPending } = useWriteContract()

  const { data: balance, error, isLoading, refetch: refetchBalance } = useReadContract({
    address: YMToken.address,
    abi: YMToken.abi,
    functionName: 'balanceOf',
    args: [address],
  })

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ hash });

  const formatBalance = useMemo(() => {
    let formatBalance = balance ? (Number(balance) / (10 ** 18)).toString() : '0'
    if(Math.abs(Math.round(Number(formatBalance)) - Number(formatBalance)) < 0.000001) {
      formatBalance = Math.round(Number(formatBalance)).toString()
    } else {
      formatBalance = Number(formatBalance).toFixed(6)
    }
    return formatBalance
  }, [balance])

  useEffect(() => {
    isConfirmed && refetchBalance()
  }, [isConfirmed])

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

  const onMintToken = async () => {
    setActiveBtn('token')
    const hash = await writeContractAsync({
      address: YMToken.address,
      abi: YMToken.abi,
      functionName: 'mint',
      args: [address, BigInt(1000 * 10 ** 18)]
    })
    toast.success('Mint successful! The transaction hash is ' + hash.slice(-10))
  }

  return <>
    <div className='flex justify-between'>
      <SectionTitle title='My YMToken' />
      {/* <Button 
        color="primary" variant="bordered"
        isLoading={isPending && activeBtn === 'token'}
        onClick={onApproveToken}
      >Approve To Market</Button> */}
      <Tooltip content="Get 1000 YMToken for free!" color="primary" placement="bottom-end">
        <Button 
          color="primary" variant="bordered"
          isLoading={(isPending || isConfirming) && activeBtn === 'token'}
          onClick={onMintToken}
        >Faucet</Button>
      </Tooltip>
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
      {/* <Button 
        color="primary" variant="bordered" 
        isLoading={isPending && activeBtn === 'nft'}
        onClick={onApproveNft}
      >Approve To Market</Button> */}
    </div>
    <NftList />
  </>
}

export default Page