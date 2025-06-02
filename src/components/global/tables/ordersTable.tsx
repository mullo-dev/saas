import { buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"
import Link from "next/link"
import { OrderTypeWithSuppliers } from "@/actions/orders/model"

export function Orderstable(props: { orders: any, supplier?: boolean }) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>N° de commande</TableHead>
            <TableHead>Date</TableHead>
            {!props.supplier && <TableHead>Nombre de fournisseurs</TableHead>}
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.orders?.map((item: OrderTypeWithSuppliers, index:number) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-60">
                <span className="line-clamp-1">{item.ref}</span>
              </TableCell>
              <TableCell className="font-medium">
                <span className="line-clamp-1">{item.createdAt.toLocaleDateString('fr-FR')}</span>
              </TableCell>
              {!props.supplier && <TableCell className="font-medium w-60">
                <span className="line-clamp-1">{item.suppliers.length}</span>
              </TableCell>}
              <TableCell className="font-medium w-60">
                <span className="line-clamp-1">{item.suppliers.reduce((acc, t) => acc + t.totalHt, 0).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '€'}</span>
              </TableCell>
              <TableCell className="text-right w-[150px]">
                <Link 
                  href={props.supplier ? `/dashboard/orders/${item.id}` : `/orders/${item.id}`} 
                  className={buttonVariants({size: "icon", variant: "outline"})}
                >
                  <Eye />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
