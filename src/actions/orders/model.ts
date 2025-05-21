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


export type OrderType = {
  suppliers: Array<{
      totalHt: number;
  }>;
  ref: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}

export type OrderTypeWithSuppliers = {
  suppliers: Array<{
    supplierId: string;
    orderId: string;
    deliveryNote: string | null;
    totalHt: number;
    totalTtc: number;
  }>;
  ref: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}