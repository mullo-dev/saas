import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationDrawer } from "@app/(private)/(private supplier)/dashboard/customers/conversationDrawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Eye, File } from "lucide-react";
import SimpleTooltip from "../tootip/tooltip";

export default function CustomerCard(props: {
  customer?: {customerId: string, products: object, subCatId: string}
  subCat: any,
  setCustomer?: (value: any) => void
  setSelectProducts?: (value: any) => void
  withoutTools?: boolean
}) {
  const { withoutTools, customer, subCat } = props
  const theCustomer = withoutTools ? subCat.user : subCat.customer

  return (
    <div className="w-80">
      <Card
        className={`${customer?.customerId === theCustomer.id ? "bg-secondary" : "bg-secondary-800"}`}
      >
        {theCustomer ? 
          <>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>
                  <h3>
                    {theCustomer.name}
                  </h3>
                </CardTitle>
                <CardDescription>
                  {theCustomer.email}
                </CardDescription>
              </div>
              {!withoutTools &&
                <Button
                  size="icon"
                  variant={customer?.customerId === theCustomer.id ? "default" : "secondary"}
                  onClick={() => {
                    if (customer?.customerId === theCustomer.id) {
                      props.setCustomer?.({})
                      props.setSelectProducts?.([])
                    } else {
                      props.setCustomer?.({customerId: theCustomer.id, products:subCat.products, subCatId: subCat.id})}
                      props.setSelectProducts?.(subCat.products.map((p:any) => ({
                        productId: p.productId,
                        price: p.price
                      })))
                    }
                  }
                >
                  <Eye />
                </Button>
              }
            </CardHeader>
            <CardContent></CardContent>
          </>
        : 
          <p>En attente</p>
        }
        <CardFooter className="flex justify-end gap-2">
          <ConversationDrawer receipt={theCustomer} />
          <SimpleTooltip duration={100} content="Commandes">
            <Button
              size="icon"
              variant="outline"
            >
              <File />
            </Button>
          </SimpleTooltip>
        </CardFooter>
      </Card>
    </div>
  )
}