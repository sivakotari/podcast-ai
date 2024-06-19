'use client';

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner';
import PodcastCard from '@/components/PodcastCard';
import SearchBar from '@/components/SearchBar';
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({searchParams: {search}} : {searchParams: {search: string}}) => {
  const podcastsData = useQuery(api.podcasts.getPodcastBySearch, { search: search || '' })

  return (
    <div className='flex flex-col gap-9'>
      <SearchBar />
      <div className='flex flex-col gap-9'>
        <h1 className='text-20 font-bold text-white-1'>
          {!search 
            ? 'Discover Trending Podcasts' 
            : <>Search results for: <span className='text-white-2'>{search}</span></>
          }
        </h1>
        {podcastsData ? (
          <>
            {podcastsData?.length > 0 ? (
              <div className='podcast_grid'>
                {podcastsData?.map((podcast) => (
                  <PodcastCard
                    key={podcast._id}
                    podcastId={podcast._id}
                    title={podcast.podcastTitle}
                    description={podcast.podcastDescription}
                    imgUrl={podcast.imageUrl!}
                  />
                ))}
              </div>
            ) : (
              <EmptyState title='No Results Found!' />
            )}
          </>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  )
}

export default Discover