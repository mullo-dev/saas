"use client"

import { createMessage } from "@/actions/messages/actions/create";
import { Button } from "@/components/ui/button";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { getConversationById } from "@/actions/messages/actions/get";
import SimpleTooltip from "@/components/global/tootip/tooltip";

export function ConversationDrawer({ receipt }: { receipt: any }) {
  const {
    register,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<{message: string}>();
  const [conversation, setConversation] = useState<any>()
  const [isPending, startTransition] = useTransition();

  const getConv = async () => {
    const result = await getConversationById({receiptId: receipt.id })
    setConversation(result?.data?.conversation)
  }

  const onSubmit: SubmitHandler<{message: string}> = async (data) => {
    startTransition(async () => {
      if (!receipt.email) {
        return setError("root", { type: "manual", message: "Le client n'a pas été trouvé." })
      }
      const result = await createMessage({receiptId: receipt.id, toEmail: receipt.email, message: data.message})
      
      if (result?.data?.success) {
        setValue("message", "")
        getConv()
      } else {
        handleFormErrors(result, setError);
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger>
        <SimpleTooltip content="Conversation">
          <Button 
            variant="outline" 
            onClick={() => getConv()}
            >
            <Send />
          </Button>
        </SimpleTooltip>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Conversation</SheetTitle>
          <SheetDescription>
            <span>{receipt.name} - {receipt.email}</span>
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 overflow-scroll">
          <div className="flex flex-col gap-4 h-[2000px]">
            {!conversation?.message ? conversation?.conversation?.messages?.map((message:any, index:number) => {
              const theSender = message.senderEmail === receipt.email
              const formatted = `${message.createdAt.toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })} à ${message.createdAt.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}`;

              return (
                <div key={index}>
                  <div className={`flex ${!theSender && "justify-end"}`}>
                    <div className={`${!theSender ? "bg-gray-600 rounded-bl-2xl" : "bg-black rounded-br-2xl"} rounded-t-2xl max-w-[80%] py-2 px-4`}>
                      <span className="text-white font-bold text-sm">
                        {message.body}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs font-bold text-gray-500 ${!theSender && "text-end"}`}>{formatted}</p>
                </div>
              )
            })
            : <p>{conversation?.message}</p>}
          </div>
        </div>
        <SheetFooter>
          <form onSubmit={handleSubmit(onSubmit)} className="py-2 max-w-[91%] bg-white grid gap-2">
            {!conversation?.conversation?.messages.at(-1).readBy.includes(receipt.email) ?
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p>non lu</p>
              </div>
            : 
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p>lu</p>
              </div>
            }
            <Textarea 
              required {...register("message")} 
              placeholder="Type your message here."
              className="text-sm"
            />
            {errors.message && <p className="text-red-500 mt-1 text-sm">{errors.message?.message}</p>}
            {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
            <Button type="submit" disabled={isPending}>
              {isPending ?
                <LoaderCircle className="animate-spin" />
              : "Send message"}
            </Button>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}