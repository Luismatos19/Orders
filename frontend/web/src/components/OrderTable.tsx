'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { Order } from '../types/order';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return 'warning';
    case 'processando':
      return 'info';
    case 'concluído':
      return 'success';
    case 'cancelado':
      return 'error';
    default:
      return 'default';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetails }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table sx={{ minWidth: 650 }} aria-label="orders table">
        <TableHead>
          <TableRow>
            <TableCell>Client</TableCell>
            <TableCell>Product</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Created</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Typography variant="body2" fontWeight="medium">
                  {order.clientName}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {order.productName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  {formatCurrency(order.value)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status) as any}
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Typography variant="body2" color="text.secondary">
                  {formatDate(order.creationDate)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Tooltip title="View Details">
                  <IconButton
                    size="small"
                    onClick={() => onViewDetails(order)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
