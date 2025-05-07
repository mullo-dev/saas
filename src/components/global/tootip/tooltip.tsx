import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
import React from 'react'

export default function SimpleTooltip(props:{
  content: string,
  duration?: number,
  children: React.ReactNode;
}) {

  return (
    <Tooltip delayDuration={props.duration ?? 500}>
      <TooltipTrigger asChild>
        {props.children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{props.content}</p>
      </TooltipContent>
    </Tooltip>
  )
}