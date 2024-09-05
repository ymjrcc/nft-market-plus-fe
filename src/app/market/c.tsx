'use client'
import SectionTitle from '@/components/SectionTitle'
import EmptyState from '@/components/EmptyState'
import NftCard from '@/components/NftCard'
import NftList from './ntfList'

const Page = () => {
  return (
    <>
      <SectionTitle title="NFTs On Sell" />
      <NftList />
    </>
  )
}

export default Page