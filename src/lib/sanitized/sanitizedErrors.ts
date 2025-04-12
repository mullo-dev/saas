import { UseFormSetError, Path } from "react-hook-form";

// Find and sanatized errors data
export function extractErrorMessages(errors: Record<string, any>): Record<string, string | string[]> {
  const errorMessages: Record<string, string | string[]> = {};

  function traverse(obj: Record<string, any>, path: string = "") {
    Object.entries(obj).forEach(([key, value]) => {
      const newPath = path ? path + key : key;

      if (key === "_errors" && Array.isArray(value)) {
        // Si la clé est "_errors", extraire le premier message
        errorMessages[path] = value[0];
      } else if (typeof value === "object" && value !== null) {
        // Si la valeur est un objet, continuer à parcourir
        traverse(value, newPath);
      }
    });
  }

  traverse(errors);
  return errorMessages;
}


// return good error
export function handleFormErrors<T extends Record<string, any>>(
  result: any,
  setError: UseFormSetError<T>
) {
  if (result?.validationErrors) {
    console.log("Setting errors:", result.validationErrors);
    const errorMessages = extractErrorMessages(result.validationErrors);
    
    Object.entries(errorMessages).forEach(([field, message]) => {
      setError(field as Path<T>, { type: "manual", message: message as string });
    });

    return;
  } else if (result?.data?.message) {
    setError("root" as Path<T>, { type: "manual", message: "A server error is occured : contact the technical team" });
  } else {
    return { success: true }
  }
}
