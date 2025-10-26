"use client";

import { useState, useEffect, useCallback } from "react";
import { Order, CreateOrderRequest } from "../types/order";
import { orderService } from "../services/api";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newOrder = await orderService.createOrder(orderData);
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError("Failed to create order");
      console.error("Error creating order:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (id: string) => {
    try {
      setError(null);
      return await orderService.getOrderById(id);
    } catch (err) {
      setError("Failed to fetch order details");
      console.error("Error fetching order:", err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    getOrderById,
  };
};
