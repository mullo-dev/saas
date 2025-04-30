'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GoBackButton({
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) {

  const router = useRouter();

  return (
    <div className='flex'>
      <div className={`cursor-pointer hover:bg-muted flex item-center gap-1 p-2 rounded-md ${className}`} onClick={() => router.back()}>
        <ChevronLeft /> 
        <span className="font-bold">retour</span>
      </div>
    </div>
  );
}