"use client";

import PodcastCard from '@/components/PodcastCard'
import { podcastData } from '@/constants'
import React from 'react'
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Home = () => {
  const tasks = useQuery(api.tasks.get)
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts)

  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>Trending Podcasts</h1>
        <div className='podcast_grid'>
          {
            trendingPodcasts?.map((podcast) => (
              <PodcastCard
                key={podcast._id}
                podcastId={podcast._id}
                title={podcast.podcastTitle}
                description={podcast.podcastDescription}
                imgUrl={podcast.imageUrl!}
              />
            ))
          }
        </div>
      </section>
    </div>
  )
}

export default Home