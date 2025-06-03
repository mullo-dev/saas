"use client"

import { usePageTitle } from '@/lib/context/pageTitle'
import { ChevronLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

export function SubHeader() {
  const { title } = usePageTitle();
  const route = useRouter()
  const pathName = usePathname()
  
  return (
   pathName !== "/dashboard" && pathName !== "/suppliers" && title?.title &&
    <div className="container px-2 md:px-4 lg:px-5 py-4 rounded-md m-auto mb-5 bg-white">
      <div className="flex items-center gap-2">
        <ChevronLeft size={25} onClick={() => route.back()} className='text-muted-foreground hover:text-primary cursor-pointer' />
        <h1 className="font-bold text-xl">
          {title.title}
        </h1>
        <div className='flex-1 flex justify-end'>
          {title.menuContent}
        </div>
      </div>
    </div>
  )
}