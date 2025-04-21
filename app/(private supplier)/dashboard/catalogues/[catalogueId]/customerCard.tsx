import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomerCard(props: {
  customer: {customerId: string, products: object}
  subCat: any,
  setCustomer: (value: any) => void
}) {
  const { customer, subCat, setCustomer } = props

  return (
    <div className="w-80">
      <Card
        className={`cursor-pointer hover:bg-gray-100" ${customer.customerId === subCat.customerId && "bg-gray-200"}`}
        onClick={() => {
          if (customer.customerId === subCat.customerId) {
            setCustomer({})
          } else {
            setCustomer({customerId: subCat.customerId, products:subCat.products})}
          }
        }
      >
        {subCat.customer ? 
          <>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <h3>
                  {subCat.customer.name}
                </h3>
              </CardTitle>
              <CardDescription>
                {subCat.customer.email}
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
          </>
        : 
          <p>En attente</p>
        }
      </Card>
    </div>
  )
}