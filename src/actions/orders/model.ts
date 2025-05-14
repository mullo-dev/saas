export type OrderWithRelations = {
  id: string;
  ref: string;
  customerId: string;
  updatedAt: Date;
  createdAt: Date;
  suppliers: Array<{
    supplier: {
      name: string;
      members: Array<{ user: any }>;
    };
    products: Array<{
      price: number;
      tvaValue: number;
    }>;
    totalHt: number;
  }>;
  customer: {
    name: string;
  };
}
