'use client'

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PodcastCard from '@/components/PodcastCard'
import PodcastDetailPlayer from '@/components/PodcastDetailPlayer'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { Podcast } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const PodcastDetails = ({params}: {params: {podcastId: Id<'podcasts'>}}) => {
  const {user} = useUser()
  const podcast = useQuery(api.podcasts.getPodcastById, {
    podcastId: params.podcastId
  })
  const similarPodcasts = useQuery(api.podcasts.getPodcastByVoiceType, {
    podcastId: params.podcastId
  })

  if(!podcast || !similarPodcasts) {
    return <LoaderSpinner />
  }

  const isOwner = user?.id === podcast?.authorId

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>Currently playing</h1>
        <figure className='flex gap-3'>
          <Image 
            src='/icons/headphone.svg'
            width={24}
            height={24}
            alt='headphone'
          />
          <h2 className='text-16 text-white-1 font-bold'>{podcast?.views}</h2>
        </figure>
      </header>

      <PodcastDetailPlayer 
        {...podcast}
        isOwner={isOwner}
        podcastId={podcast._id}
      />

      <p className='text-white-2 text-19 pb-8 pt-[45[x] font-medium max-md:text-center'>{podcast?.podcastDescription}</p>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-q6 font-medium text-white-2'>{podcast?.voicePrompt}</p>
        </div>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Thumbnail prompt</h1>
          <p className='text-q6 font-medium text-white-2'>{podcast?.imagePrompt}</p>
        </div>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Similar Podcasts</h1>
        {(similarPodcasts && similarPodcasts.length > 0) ? (
          <div className='podcast_grid'>
            {
              similarPodcasts?.map((podcast) => (
                <PodcastCard
                  key={podcast._id}
                  podcastId={podcast._id}
                  title={podcast.podcastTitle}
                  description={podcast.podcastDescription}
                  imgUrl={podcast.imageUrl}
                />
              ))
            }
          </div>
        ) : (
          <EmptyState 
            title='No similar podcasts found!'
            buttonLink="/discover"
            buttonText='Discover more Podcasts'
          />
        )}
      </section>
    </section>
  )
}

export default PodcastDetails