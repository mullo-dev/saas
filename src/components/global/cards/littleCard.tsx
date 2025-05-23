import { Trash } from "lucide-react";

export default function LittleCard(props: { 
  title: string 
  subTitle: string
  ico: any
  color?: string
}) {

  return (
    <div className="bg-white shadow-sm rounded-lg flex items-center pl-3 pr-5 py-2 mb-3">
      <div className={`w-12 h-12 bg-${props.color} rounded-full flex items-center justify-center text-${props.color}-foreground`}>
        {props.ico}
      </div>
      <div className="flex-1 pl-4">
        <h5 className="font-medium">{props.title}</h5>
        <p className="font-light text-sm">{props.subTitle}</p>
      </div>
    </div>
  )
}