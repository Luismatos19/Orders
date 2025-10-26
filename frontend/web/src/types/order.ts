export interface Order {
  id: string;
  clientName: string;
  productName: string;
  value: number;
  status: string;
  creationDate: string;
}

export interface CreateOrderRequest {
  clientName: string;
  productName: string;
  value: number;
}
