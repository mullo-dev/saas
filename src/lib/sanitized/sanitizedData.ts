export const sanitizedDataFunction = (data:any) => {
  const sanitizedData = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, value ?? undefined])
  );

  return sanitizedData
}
