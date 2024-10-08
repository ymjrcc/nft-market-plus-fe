'use client'

import { useState } from 'react'
import { useWriteContract, useAccount } from 'wagmi'
import {Input, Button} from "@nextui-org/react"
import toast from 'react-hot-toast'
import ForbiddenState from '@/components/ForbiddenState'
import SectionTitle from '@/components/SectionTitle'
import { YMToken, YMNFT, ADMIN } from '@/utils/contracts'

const Page = () => {

  const { address } = useAccount()
  const [mintLoading, setMintLoading] = useState(false)
  const [mintNftLoading, setMintNftLoading] = useState(false)
  const [mintTo, setMintTo] = useState<any>('')
  const [mintAmount, setMintAmount] = useState('')
  const [mintNftTo, setMintNftTo] = useState<any>('')
  const [uri, setUri] = useState('')
  const { writeContractAsync } = useWriteContract()

  const onMint = async () => {
    setMintLoading(true)
    const hash = await writeContractAsync({
      address: YMToken.address,
      abi: YMToken.abi,
      functionName: "mint",
      args: [
        mintTo,
        BigInt(mintAmount) * BigInt(10**18)
      ]
    })
    toast.success('Mint successful! The transaction hash is ' + hash.slice(-10))
    setMintTo('')
    setMintAmount('')
    setMintLoading(false)
  }

  const onMintNft = async () => {
    setMintNftLoading(true)
    const hash = await writeContractAsync({
      address: YMNFT.address,
      abi: YMNFT.abi,
      functionName: "safeMint",
      args: [
        mintNftTo,
        uri
      ]
    })
    toast.success('Mint successful! The transaction hash is ' + hash.slice(-10))
    setMintNftTo('')
    setUri('')
    setMintNftLoading(false)
  }


  if(address !== ADMIN) return <ForbiddenState />
  return (
    <>
      <SectionTitle title="Mint YMT" subtitle='Mint any number of YMToken for the specified address'/>
      <div className='w-1/2 mb-10'>
        <Input className='mt-4' label="Address" value={mintTo} onChange={(e) => setMintTo(e.target.value)} />
        <div className='flex items-center mt-4'>
          <Input 
            type="number" label="Amount" 
            // endContent={<span>*10<sup>18</sup></span>}
            value={mintAmount} onChange={(e) => setMintAmount(e.target.value)}
          />
          <Button 
            isLoading={mintLoading} isDisabled={mintTo.length !== 42 || mintAmount === ''}
            onClick={onMint}
            color="primary" variant="shadow" className='ml-4' size="lg"
          >Mint</Button>
        </div>
      </div>

      <SectionTitle title="Mint YMNFT" subtitle='Mint a YMNFT for the specified address'/>
      <div className='w-1/2 mb-10'>
        <Input className='mt-4' label="Address" value={mintNftTo} onChange={(e) => setMintNftTo(e.target.value)} />
        <div className='flex items-center mt-4'>
          <Input label='URI' value={uri} onChange={(e) => setUri(e.target.value)} />
          <Button 
            isLoading={mintNftLoading} isDisabled={mintNftTo === '' || uri === ''}
            onClick={onMintNft}
            color="primary" variant="shadow" className='ml-4' size="lg"
          >Mint</Button>
        </div>
      </div>
    </>
  )
};

export default Page;