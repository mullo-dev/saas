"use client"

import { createMessage, getConversationById } from "@/actions/messages/action";
import { Button } from "@/components/ui/button";
import { handleFormErrors } from "@/lib/sanitized/sanitizedErrors";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export function CustomerCard({ customer }: { customer: any }) {
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<{message: string}>();
  const [conversation, setConversation] = useState<any>()

  const getConv = async () => {
    const result = await getConversationById({email: customer.email })
    setConversation(result?.data?.conversation)
  }

  const onSubmit: SubmitHandler<{message: string}> = async (data) => {
    if (!customer.email) {
      return setError("root", { type: "manual", message: "Le client n'a pas été trouvé." })
    }
    const result = await createMessage({toEmail: customer.email, message: data.message})
    
    if (result?.data?.success) {
      getConv()
    } else {
      handleFormErrors(result, setError);
    }
  }

  return (
    <li className="flex justify-between items-center">
      <p>{customer.name} - {customer.email}</p>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline" onClick={() => getConv()}>
            <Send />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] px-2">
          <SheetHeader>
            <SheetTitle>Conversation</SheetTitle>
            <SheetDescription>
              {conversation?.conversation?.message ? 
                <span>{conversation?.conversation.message}</span>
              :
                <span>{conversation?.toUser.name} - {conversation?.toUser.email}</span>
              }
            </SheetDescription>
          </SheetHeader>
          <div className="relative h-full overflow-scroll pb-4">
            <div className="flex flex-col gap-2">
              {conversation?.conversation?.messages?.map((message:any, index:number) => {
                const fromYou = message.senderEmail === conversation?.conversation.fromEmail
                return (
                  <div key={index} className={`flex ${fromYou && "justify-end"}`}>
                    <div className={`${fromYou ? "bg-gray-600 rounded-bl-2xl" : "bg-black rounded-br-2xl"} rounded-t-2xl max-w-[80%] py-2 px-4`}>
                      <span className="text-white font-bold text-sm">
                        {message.body}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="fixed py-2 bg-white w-[367px] bottom-0 grid gap-2">
              <Textarea required {...register("message")} placeholder="Type your message here." />
              {errors.message && <p className="text-red-500 mt-1 text-sm">{errors.message?.message}</p>}
              {errors.root && <p className="text-red-500 text-sm">{errors.root.message}</p>}
              <Button type="submit">Send message</Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </li>
  )
}