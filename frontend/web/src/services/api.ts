import axios from "axios";
import { Order, CreateOrderRequest } from "../types/order";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const orderService = {
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get("/orders");
    console.log(response.data, "teste");
    return response.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
};
