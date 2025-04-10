import { Card } from '@/components/ui/card';
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className='min-h-[100vh] flex items-center'>
      <div className='flex-1'>
        <Card className='max-w-md m-auto border-gray-100'>
          {children}
        </Card>
      </div>
    </div>
  )
}