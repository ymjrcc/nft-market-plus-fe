import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox, Input, Link } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { parseAbi } from 'viem'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'

type TData = {
  title: string
  image: string
  description: string
  attributes?: any[];
  status: string
  tokenId: bigint
}

const YMNFT = {
  address: '0x03511900fE6ad41fd221b6a5a75694578a4d92F7' as `0x${string}`,
}

const market = {
  address: '0x5Dfe4Aeb99e265D3B5A91Cf135FD6623193D942a' as `0x${string}`,
  abi: parseAbi([
    'function list(address _nftAddr, uint256 _tokenId, uint256 _price) external'
  ])
}

const NftCard = (data: TData) => {

  const { address }: any = useAccount()
  const [price, setPrice] = useState<string>('')
  const { writeContractAsync, isPending } = useWriteContract()

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

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

  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2 pb-10 relative">
      <img className="w-full h-60 object-cover" src={data.image} alt={data.title} />
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
      </div>
      <div className="absolute bottom-0 w-full p-2">
        {
          data.status === 'unlisted' ?
            <Button
              className="w-full bg-blue-500 text-white text-base" size="sm"
              // onClick={() => onList(data.tokenId)}
              onClick={onOpen}
              isLoading={isPending}
            >List</Button>
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
                <Button color="primary" onPress={onList} isLoading={isPending}>
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