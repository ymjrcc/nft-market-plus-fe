import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { parseSignature } from 'viem'
import toast from "react-hot-toast"
import { useReadContract, useWriteContract, useAccount, useSendTransaction, useWaitForTransactionReceipt, useChainId, useSignTypedData } from 'wagmi'
import { YMNFT, market, YMToken } from "@/utils/contracts"

type TData = {
  title: string
  image: string
  description: string
  attributes?: any[];
  status: string
  tokenId: bigint
  owner?: string
  price?: bigint
}

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const NftCard = (data: TData) => {

  const { address }: any = useAccount()
  const chainId = useChainId()
  const { signTypedDataAsync } = useSignTypedData();
  const [price, setPrice] = useState<string>('')
  const { data: hash, writeContractAsync, isPending } = useWriteContract()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({ hash });

  const { data: nonce, refetch: refetchNonce } = useReadContract({
    address: YMToken.address,
    abi: YMToken.abi,
    functionName: 'nonces',
    args: [address],
  })

  useEffect(() => {
    isConfirmed && refetchNonce()
  }, [isConfirmed])

  const signToList = async () => {
    const domain = {
      name: 'YMNFT',
      version: '1',
      chainId: chainId,
      verifyingContract: YMNFT.address
    }

    const types = {
      Permit: [
        { name: 'to', type: 'address' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    }

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

    const message = {
      to: market.address,
      tokenId: data.tokenId,
      deadline
    }

    const signHash = await signTypedDataAsync({
      primaryType: 'Permit',
      domain,
      types,
      message
    })

    return {
      signHash,
      deadline
    }

  }

  const onPermitList = async () => {
    const result: any = await signToList()
    const amount = BigInt(Number(price) * 10 ** 18)
    const hash = await writeContractAsync({
      address: market.address,
      abi: market.abi,
      functionName: 'listWithSignature',
      args: [YMNFT.address, data.tokenId, amount, result.deadline, result.signHash]
    },
      {
        onError: (error) => {
          toast.error(error.message, {
            style: {
              wordBreak: 'break-all'
            }
          })
        }
      })
    toast.success('List successful! The transaction hash is ' + hash.slice(-10))
    setPrice('')
    onClose()
  }

  const onList = async () => {
    const amount = BigInt(Number(price) * 10 ** 18)
    const hash = await writeContractAsync({
      address: market.address,
      abi: market.abi,
      functionName: 'list',
      args: [YMNFT.address, data.tokenId, amount]
    },
      {
        onError: (error) => {
          toast.error(error.message, {
            style: {
              wordBreak: 'break-all'
            }
          })
        }
      })
    toast.success('List successful! The transaction hash is ' + hash.slice(-10))
    setPrice('')
    onClose()
  }

  const onCancelList = async () => {
    const hash = await writeContractAsync({
      address: market.address,
      abi: market.abi,
      functionName: 'cancel',
      args: [YMNFT.address, data.tokenId]
    },
      {
        onError: (error) => {
          toast.error(error.message, {
            style: {
              wordBreak: 'break-all'
            }
          })
        }
      })
    toast.success('Cancel list successful! The transaction hash is ' + hash.slice(-10))
  }

  const onBuy = async () => {
    const hash = await writeContractAsync({
      address: market.address,
      abi: market.abi,
      functionName: 'buy',
      args: [YMNFT.address, data.tokenId]
    },
      {
        onError: (error) => {
          toast.error(error.message, {
            style: {
              wordBreak: 'break-all'
            }
          })
        }
      })
    toast.success('Buy successful! The transaction hash is ' + hash.slice(-10))
  }

  const signToBuy = async () => {
    await refetchNonce()
    const domain = {
      name: 'YMToken',
      version: '1',
      chainId: chainId,
      verifyingContract: YMToken.address
    }

    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' }
      ]
    }

    const value = data.price
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 20)

    const message = {
      owner: address,
      spender: market.address,
      value: value,
      nonce: nonce,
      deadline: deadline
    }
    const signHash = await signTypedDataAsync({
      primaryType: 'Permit',
      domain,
      types,
      message
    })
    const signatureData = parseSignature(signHash)
    return {
      ...signatureData,
      deadline
    }
  }

  const onPermitBuy = async () => {
    const result: any = await signToBuy()
    const hash = await writeContractAsync({
      address: market.address,
      abi: market.abi,
      functionName: 'permitBuy',
      args: [
        YMNFT.address, data.tokenId, result.deadline, result.v, result.r, result.s
      ]
    },
      {
        onSuccess: () => {
          refetchNonce()
        },
        onError: (error) => {
          toast.error(error.message, {
            style: {
              wordBreak: 'break-all'
            }
          })
        }
      })
    toast.success('Buy successful! The transaction hash is ' + hash.slice(-10))
  }

  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2 pb-10 relative">
      <img 
        className="w-full h-60 object-cover" 
        src={data.image.includes('ipfs://') ? `https://gateway.pinata.cloud/ipfs/${data.image.replace('ipfs://', '')}` : data.image}
        alt={data.title} 
      />
      <div className="px-3 py-2">
        <div className="font-bold text-xl mb-2">{data.title}</div>
        <div className="mb-2 border border-gray-200 rounded inline-block px-2 bg-gray-700">#{Number(data.tokenId)}</div>
        <p className="text-gray-400 text-sm line-clamp-3" title={data.description}>{data.description}</p>
        {
          data.attributes ? (
            <div className="mt-2">
              {
                data.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">{attr.type || attr.trait_type}</span>
                    <span className="text-sm text-gray-400 text-right">{attr.value}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
        {
          data.status === 'listing' && data.owner && data.price ?
            <div className="pt-2 mt-4 border-t-2 border-gray-700 text-gray-400">
              <div>Owner: {formatAddress(data.owner)}</div>
              <div>Price: {Number(data.price / BigInt(10 ** 18))} YMT</div>
            </div> : null
        }
      </div>
      <div className="absolute bottom-0 w-full p-2">
        {
          data.status === 'unlisted' ?
            <Button
              className="w-full bg-blue-500 text-white text-base" size="sm"
              onClick={onOpen}
              isLoading={isPending}
            >List</Button>
            : null
        }
        {
          data.status === 'listing' ?
            (
              data.owner === address ?
                <Button
                  className="w-full bg-gray-500 text-white text-base" size="sm"
                  onClick={onCancelList}
                  isLoading={isPending}
                >Cancel List</Button> :
                <Button
                  className="w-full bg-orange-500 text-white text-base" size="sm"
                  // onClick={onBuy}
                  onClick={onPermitBuy}
                  isLoading={isPending}
                  isDisabled={!address}
                >Buy</Button>
            )
            : null
        }

      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">List NFT #{Number(data.tokenId)}</ModalHeader>
              <ModalBody>
                <Input
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter the price in YMToken"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onList} isLoading={isPending}>
                  Submit
                </Button> */}
                <Button color="primary" onPress={onPermitList} isLoading={isPending}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  )
}

export default NftCard