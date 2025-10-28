import axios from "axios";
import { orderService } from "../../services/api";
import { Order, CreateOrderRequest } from "../../types/order";
import { afterEach } from "node:test";
import { describe, it, expect, jest } from "jest";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("orderService", () => {
  const mockOrder: Order = {
    id: "1",
    clientName: "Alice",
    productName: "Product A",
    value: 200,
    status: "Pending",
    creationDate: new Date().toISOString(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllOrders", () => {
    it("should fetch all orders", async () => {
      const mockOrders: Order[] = [mockOrder];
      mockedAxios.get.mockResolvedValueOnce({ data: mockOrders });

      const result = await orderService.getAllOrders();

      expect(mockedAxios.get).toHaveBeenCalledWith("/orders");
      expect(result).toEqual(mockOrders);
    });

    it("should handle API errors", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

      await expect(orderService.getAllOrders()).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getOrderById", () => {
    it("should fetch a specific order by ID", async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockOrder });

      const result = await orderService.getOrderById("1");

      expect(mockedAxios.get).toHaveBeenCalledWith("/orders/1");
      expect(result).toEqual(mockOrder);
    });

    it("should handle errors when fetching by ID", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Order not found"));

      await expect(orderService.getOrderById("1")).rejects.toThrow(
        "Order not found"
      );
    });
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      const newOrder: CreateOrderRequest = {
        clientName: "Bob",
        productName: "Product B",
        value: 300,
      };

      const createdOrder: Order = { ...mockOrder, ...newOrder, id: "2" };

      mockedAxios.post.mockResolvedValueOnce({ data: createdOrder });

      const result = await orderService.createOrder(newOrder);

      expect(mockedAxios.post).toHaveBeenCalledWith("/orders", newOrder);
      expect(result).toEqual(createdOrder);
    });

    it("should handle API errors when creating an order", async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error("Failed to create order")
      );

      await expect(
        orderService.createOrder({
          clientName: "Error User",
          productName: "Product C",
          value: 500,
        })
      ).rejects.toThrow("Failed to create order");
    });
  });
});
