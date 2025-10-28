/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import HomePage from "../../app/page";
import { useOrders } from "./../hooks/useOrders";
import { Order } from "./../types/order";

jest.mock("../hooks/useOrders");

const mockedUseOrders = useOrders as jest.MockedFunction<typeof useOrders>;

describe("HomePage", () => {
  const mockOrders: Order[] = [
    {
      id: "1",
      clientName: "John Doe",
      productName: "Laptop",
      value: 1500,
      status: "Pendente",
      creationDate: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseOrders.mockReturnValue({
      orders: [],
      loading: true,
      error: null,
      createOrder: jest.fn(),
      fetchOrders: jest.fn(),
      getOrderById: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByText("Orders Management")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders order list when data is loaded", async () => {
    mockedUseOrders.mockReturnValue({
      orders: mockOrders,
      loading: false,
      error: null,
      createOrder: jest.fn(),
      fetchOrders: jest.fn(),
      getOrderById: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByText("Orders List")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    mockedUseOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: "Failed to fetch orders",
      createOrder: jest.fn(),
      fetchOrders: jest.fn(),
      getOrderById: jest.fn(),
    });

    render(<HomePage />);

    expect(screen.getByText("Failed to fetch orders")).toBeInTheDocument();
  });

  it("displays success feedback after creating an order", async () => {
    const mockCreateOrder = jest.fn().mockResolvedValueOnce(mockOrders[0]);

    mockedUseOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      createOrder: mockCreateOrder,
      fetchOrders: jest.fn(),
      getOrderById: jest.fn(),
    });

    render(<HomePage />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() =>
      expect(
        screen.getByText("Order created successfully!")
      ).toBeInTheDocument()
    );
  });

  it("displays error feedback when order creation fails", async () => {
    const mockCreateOrder = jest.fn().mockRejectedValueOnce(new Error("error"));

    mockedUseOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: null,
      createOrder: mockCreateOrder,
      fetchOrders: jest.fn(),
      getOrderById: jest.fn(),
    });

    render(<HomePage />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    await waitFor(() =>
      expect(
        screen.getByText("Failed to create order. Please try again.")
      ).toBeInTheDocument()
    );
  });
});
