"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../src/theme/theme";
import { OrderTable } from "../src/components/OrderTable";
import { OrderForm } from "../src/components/OrderForm";
import { OrderDetails } from "../src/components/OrderDetails";
import { StatusFeedback } from "../src/components/StatusFeedback";
import { useOrders } from "../src/hooks/useOrders";
import { Order } from "../src/types/order";

export default function HomePage() {
  const { orders, loading, error, createOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCreateOrder = async (orderData: any) => {
    try {
      await createOrder(orderData);
      setFeedback({
        open: true,
        message: "Order created successfully!",
        severity: "success",
      });
    } catch (error) {
      setFeedback({
        open: true,
        message: "Failed to create order. Please try again.",
        severity: "error",
      });
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders Management
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage your orders efficiently with real-time updates and status
          tracking.
        </Typography>

        <OrderForm onSubmit={handleCreateOrder} loading={loading} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Orders List
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading && orders.length === 0 ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <OrderTable orders={orders} onViewDetails={handleViewDetails} />
          )}
        </Box>

        <OrderDetails
          order={selectedOrder}
          open={detailsOpen}
          onClose={handleCloseDetails}
        />

        <StatusFeedback
          open={feedback.open}
          message={feedback.message}
          severity={feedback.severity}
          onClose={handleCloseFeedback}
        />
      </Container>
    </ThemeProvider>
  );
}
