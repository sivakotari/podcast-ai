'use client';

import Link from 'next/link'
import React from 'react'
import {sidebarLinks} from '@/constants'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { Button } from './ui/button';

const LeftSidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()

  return (
    <section className='left_sidebar'>
      <nav className='flex flex-col gap-6'>
        <Link href="/" className='flex cursor-pointer items-center gap-1 pb-10 max-lg:justify-center'>
          <img src='/icons/logo.svg' alt='logo' width={24} height={26} />
          <h1 className='text-24 font-extrabold text-white max-lg:hidden'>Podcast AI</h1>
        </Link>
        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive = pathname === route || pathname.startsWith(`${route}/`)
          return <Link key={label} href={route} className={cn('flex gap-3 items-center py-4 max-lg:px-4 lg:justify-start justify-center', {
            'bg-nav-focus border-r-4 border-orange-1': isActive
          })}>
            <Image src={imgURL} alt={label} width={24} height={24}/>
            <p>{label}</p>
          </Link>
        })}
      </nav>
      <SignedOut>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button asChild className='text-16 w-full bg-orange-1 font-extrabold'>
            <Link
              href='/sign-in'
            >Sign in</Link>
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <div className='flex-center w-full pb-14 max-lg:px-4 lg:pr-8'>
          <Button
            className='text-16 w-full bg-orange-1 font-extrabold'
            onClick={() => signOut(() => router.push('/'))}
          >Log out</Button>
        </div>
      </SignedIn>
    </section>
  )
}

export default LeftSidebar