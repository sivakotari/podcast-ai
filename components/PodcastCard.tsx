import { PodcastCardProps } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const PodcastCard = ({ podcastId, title, description, imgUrl }: PodcastCardProps ) => {
  const router = useRouter()

  const handleViews = () => {
    router.push(`podcasts/${podcastId}`, {
      scroll: true
    })
  }
  return (
    <div className='text-white-1 cursor-pointer' onClick={handleViews}>
      <figure className='flex flex-col gap-2'>
        <Image src={imgUrl} width={174} height={174} alt={description} className='aspect-square h-fit w-full rounded-xl 2xl:size-[200px]' />
        <div className='flex flex-col'>
          <h1 className='text-16 truncate font-bold text-white-1'>{description}</h1>
          <h2 className='text-12 truncate font-normal capitalize text-white-4'>{title}</h2>
        </div>
      </figure>
    </div>
  )
}

export default PodcastCard