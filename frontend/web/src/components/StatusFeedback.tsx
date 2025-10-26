"use client";

import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface StatusFeedbackProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

export const StatusFeedback: React.FC<StatusFeedbackProps> = ({
  open,
  message,
  severity,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
