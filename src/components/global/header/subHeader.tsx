"use client"

import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export function SubHeader(props:{ title: string }) {
  const route = useRouter()

  return (
    <div className="flex items-center mb-2">
      <Button
        size="icon"
        variant="ghostMuted"
        onClick={() => route.back()}
      >
        <ChevronLeft />
      </Button>
      <h1 className="font-bold text-xl">
        {props.title}
      </h1>
    </div>
  )
}