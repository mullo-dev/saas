import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function unauthorized() {

  return (
    <div className="p-4">
      <Alert>
        <AlertTitle>Unautorized</AlertTitle>
        <AlertDescription>
          You are not autorized to access this page. Please SIgn In to continue.
        </AlertDescription>
      </Alert>
    </div>
  )
}