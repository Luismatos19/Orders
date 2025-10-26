"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import { CreateOrderRequest } from "../types/order";

interface OrderFormProps {
  onSubmit: (orderData: CreateOrderRequest) => Promise<void>;
  loading?: boolean;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateOrderRequest>({
    clientName: "",
    productName: "",
    value: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (formData.value <= 0) {
      newErrors.value = "Value must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        clientName: "",
        productName: "",
        value: 0,
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleChange =
    (field: keyof CreateOrderRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "value" ? parseFloat(e.target.value) || 0 : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value as any }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Order
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Client Name"
              value={formData.clientName}
              onChange={handleChange("clientName")}
              error={!!errors.clientName}
              helperText={errors.clientName}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.productName}
              onChange={handleChange("productName")}
              error={!!errors.productName}
              helperText={errors.productName}
              disabled={loading}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Value"
              type="number"
              value={formData.value}
              onChange={handleChange("value")}
              error={!!errors.value}
              helperText={errors.value}
              disabled={loading}
              inputProps={{
                min: 0,
                step: 0.01,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? "Creating..." : "Create Order"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};
