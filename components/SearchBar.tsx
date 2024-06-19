'useconst';

import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation';
import { useDebounce } from '@/lib/useDebounce';

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const deboundecValue = useDebounce(search)

  useEffect(() => {
    if (deboundecValue) {
      router.push(`/discover?search=${deboundecValue}`)
    } else if (!deboundecValue && pathname === '/discover') {
      router.push('/discover')
    }
  }, [router, pathname, deboundecValue])

  return (
    <div className='relative mt-8'>
      <Input 
        className='input-class py-6 pl-12 focus-visible:ring-offset-orange-1'
        placeholder='Search for podcasts'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch('')}
      />
      <Image 
        src="/icons/search.svg"
        alt='Search'
        height={20}
        width={20}
        className='absolute left-4 top-3.5'
      />
    </div>
  )
}

export default SearchBar