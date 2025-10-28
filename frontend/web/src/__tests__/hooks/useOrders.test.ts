import { renderHook, act } from "@testing-library/react";
import { useOrders } from "../../hooks/useOrders";
import { orderService } from "../../services/api";
import { CreateOrderRequest, Order } from "../../types/order";

// Mock the service
jest.mock("../../services/api");

const mockedOrderService = orderService as jest.Mocked<typeof orderService>;

describe("useOrders hook", () => {
  const mockOrders: Order[] = [
    {
      id: "1",
      clientName: "John",
      productName: "Laptop",
      value: 1500,
      status: "Pendente",
      creationDate: new Date().toISOString(),
    },
    {
      id: "2",
      clientName: "Jane",
      productName: "Phone",
      value: 800,
      status: "Pendente",
      creationDate: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch orders on mount", async () => {
    mockedOrderService.getAllOrders.mockResolvedValueOnce(mockOrders);

    const { result } = renderHook(() => useOrders());

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await result.current.fetchOrders();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.orders).toEqual(mockOrders);
    expect(mockedOrderService.getAllOrders).toHaveBeenCalledTimes(2);
  });

  it("should handle error when fetching orders fails", async () => {
    mockedOrderService.getAllOrders.mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useOrders());

    await act(async () => {
      await result.current.fetchOrders();
    });

    expect(result.current.error).toBe("Failed to fetch orders");
    expect(result.current.orders).toEqual([]);
  });

  it("should create a new order and prepend it to the list", async () => {
    const newOrder: Order = {
      id: "3",
      clientName: "Alice",
      productName: "Tablet",
      value: 600,
      status: "Pendente",
      creationDate: new Date().toISOString(),
    };

    mockedOrderService.createOrder.mockResolvedValueOnce(newOrder);

    const { result } = renderHook(() => useOrders());

    await act(async () => {
      await result.current.createOrder({
        clientName: "Alice",
        productName: "Tablet",
        value: 600,
      } as CreateOrderRequest);
    });

    expect(result.current.orders[0]).toEqual(newOrder);
    expect(mockedOrderService.createOrder).toHaveBeenCalledTimes(1);
  });

  it("should handle error when creating order fails", async () => {
    mockedOrderService.createOrder.mockRejectedValueOnce(
      new Error("Server error")
    );

    const { result } = renderHook(() => useOrders());

    await expect(
      act(async () => {
        await result.current.createOrder({
          clientName: "Error",
          productName: "Broken",
          value: 0,
        } as CreateOrderRequest);
      })
    ).rejects.toThrow();

    expect(result.current.error).toBe("Failed to create order");
  });

  it("should get order by id successfully", async () => {
    const mockOrder = mockOrders[0];
    mockedOrderService.getOrderById.mockResolvedValueOnce(mockOrder);

    const { result } = renderHook(() => useOrders());

    const order = await result.current.getOrderById("1");

    expect(order).toEqual(mockOrder);
    expect(mockedOrderService.getOrderById).toHaveBeenCalledWith("1");
  });

  it("should handle error when getting order by id fails", async () => {
    mockedOrderService.getOrderById.mockRejectedValueOnce(
      new Error("Not found")
    );

    const { result } = renderHook(() => useOrders());

    await expect(result.current.getOrderById("99")).rejects.toThrow();

    expect(result.current.error).toBe("Failed to fetch order details");
  });
});
