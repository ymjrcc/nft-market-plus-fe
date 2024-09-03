'use client'

import { useWriteContract, useAccount } from 'wagmi'
import ForbiddenState from '@/components/ForbiddenState'
import SectionTitle from '@/components/SectionTitle';
import {Input, Button} from "@nextui-org/react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import YMToken from '@/abi/YMToken.json'

const Page = () => {

  const { address } = useAccount()
  const [mintLoading, setMintLoading] = useState(false)
  const [mintTo, setMintTo] = useState('')
  const [mintAmount, setMintAmount] = useState('')
  const { data, writeContractAsync } = useWriteContract()

  const onMint = async () => {
    setMintLoading(true)
    const hash = await writeContractAsync({
      address: "0xD6058907806a611cD9f4F3E565C3AED4633d6431",
      abi: YMToken.abi,
      functionName: "mint",
      args: [
        mintTo,
        BigInt(mintAmount) * BigInt(10**18)
      ]
    })
    toast('Mint successful! The transaction hash is ' + hash.slice(-10))
    console.log(hash)
    setMintLoading(false)
  }


  if(address !== '0xFA8Bac84bb8594B7Fc7ACAF932cA680D9A6E495E') return <ForbiddenState />
  return (
    <>
      <SectionTitle title="Mint YMT" subtitle='Mint any number of YMToken for the specified account'/>
      <div className='w-1/2'>
        <Input className='mt-4' label="Address" value={mintTo} onChange={(e) => setMintTo(e.target.value)} />
        <div className='flex items-center mt-4'>
          <Input 
            type="number" label="Amount" 
            endContent={<span>*10<sup>18</sup></span>}
            value={mintAmount} onChange={(e) => setMintAmount(e.target.value)}
          />
          <Button 
            isLoading={mintLoading} isDisabled={mintTo.length !== 42 || mintAmount === ''}
            onClick={onMint}
            color="primary" variant="shadow" className='ml-4' size="lg"
          >Mint</Button>
        </div>
      </div>
    </>
  )
};

export default Page;