import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationDrawer } from "@app/(private)/(private supplier)/dashboard/customers/conversationDrawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Eye, File } from "lucide-react";
import SimpleTooltip from "../tootip/tooltip";

export default function CustomerCard(props: {
  customer: {customerId: string, products: object, subCatId: string}
  subCat: any,
  setCustomer: (value: any) => void
  setSelectProducts: (value: any) => void
}) {
  const { customer, subCat, setCustomer } = props

  console.log(subCat.customer)

  return (
    <div className="w-80">
      <Card
        className={`${customer.customerId === subCat.customerId && "bg-gray-50"}`}
      >
        {subCat.customer ? 
          <>
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle>
                  <h3>
                    {subCat.customer.name}
                  </h3>
                </CardTitle>
                <CardDescription>
                  {subCat.customer.email}
                </CardDescription>
              </div>
              <Button
                size="icon"
                variant={customer.customerId === subCat.customerId ? "secondary" : "ghost"}
                onClick={() => {
                  if (customer.customerId === subCat.customerId) {
                    setCustomer({})
                    props.setSelectProducts([])
                  } else {
                    setCustomer({customerId: subCat.customerId, products:subCat.products, subCatId: subCat.id})}
                    props.setSelectProducts(subCat.products.map((p:any) => ({
                      productId: p.productId,
                      price: p.price
                    })))
                  }
                }
              >
                <Eye />
              </Button>
            </CardHeader>
            <CardContent></CardContent>
          </>
        : 
          <p>En attente</p>
        }
        <CardFooter className="flex justify-end gap-2">
          <ConversationDrawer receipt={subCat.customer} />
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