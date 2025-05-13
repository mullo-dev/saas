const getColSpanClass = (col: number) => {
  const map: Record<number, string> = {
    1: "col-span-1",
    2: "col-span-2",
    3: "col-span-3",
    4: "col-span-4",
    5: "col-span-5",
    6: "col-span-6",
    12: "col-span-12",
  };

  return map[col] || "col-span-1";
};

export {
  getColSpanClass
}