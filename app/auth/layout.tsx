import { Card } from '@/components/ui/card';
import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <Card className='max-w-md m-auto border-gray-100'>
      {/* <h2 className='font-bold px-5'>WORK TRAVEL</h2> */}
      {children}
    </Card>
  )
}