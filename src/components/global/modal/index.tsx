"use client"

import * as React from "react"
import { useMediaQuery } from "@react-hook/media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import SimpleTooltip from "../tootip/tooltip"

interface DrawerDialogProps {
  title: string;
  description: string;
  buttonTitle: React.ReactNode;
  children: (props: { setOpen: (open: boolean) => void }) => React.ReactNode;
  onlyDrawer?: boolean;
  buttonSize?: "default" | "sm" | "lg" | "icon" | null | undefined;
  toastTitle?: string
}


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// This component work like layout for modal and drawer component.
// To pass a component you must do : {(props) => <TheComponent setOpen={props.setOpen} otherProps={otherProps} />}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export function DrawerDialog({ 
  title, 
  description, 
  buttonTitle, 
  children, 
  buttonSize, 
  onlyDrawer = false,
  toastTitle
}: DrawerDialogProps) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
 
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Show nothing until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  if (isDesktop && !onlyDrawer) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {toastTitle ?
          <SimpleTooltip content={toastTitle}>
            <DialogTrigger asChild>
              <Button variant="outline" size={buttonSize ? buttonSize : "default"}>{buttonTitle}</Button>
            </DialogTrigger>
          </SimpleTooltip>
          :
          <DialogTrigger asChild>
            <Button variant="outline" size={buttonSize ? buttonSize : "default"}>{buttonTitle}</Button>
          </DialogTrigger>
        }
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          {children({ setOpen })}
        </DialogContent>
      </Dialog>
    )
  }
 
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">{buttonTitle}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-h-full">
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>
              {description}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            {children({ setOpen })}
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}