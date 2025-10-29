import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrderForm } from "../../components/OrderForm";

describe("OrderForm Component", () => {
  it("renders form fields correctly", () => {
    render(<OrderForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText("Client Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Product Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Value")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create order/i })
    ).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<OrderForm onSubmit={jest.fn()} />);
    const submitButton = screen.getByRole("button", { name: /create order/i });
    fireEvent.click(submitButton);
    expect(
      await screen.findByText("Client name is required")
    ).toBeInTheDocument();
    expect(screen.getByText("Product name is required")).toBeInTheDocument();
    expect(
      screen.getByText("Value must be greater than 0")
    ).toBeInTheDocument();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(<OrderForm onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByLabelText("Client Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "2500" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create order/i }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(handleSubmit).toHaveBeenCalledWith({
      clientName: "John Doe",
      productName: "Laptop",
      value: 2500,
    });
  });

  it("clears fields after successful submission", async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(<OrderForm onSubmit={handleSubmit} />);
    fireEvent.change(screen.getByLabelText("Client Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Product Name"), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText("Value"), {
      target: { value: "2500" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create order/i }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
    expect(screen.getByLabelText("Client Name")).toHaveValue("");
    expect(screen.getByLabelText("Product Name")).toHaveValue("");
    expect(screen.getByLabelText("Value")).toHaveValue(0);
  });

  it("disables inputs and button when loading", () => {
    render(<OrderForm onSubmit={jest.fn()} loading />);
    expect(screen.getByLabelText("Client Name")).toBeDisabled();
    expect(screen.getByLabelText("Product Name")).toBeDisabled();
    expect(screen.getByLabelText("Value")).toBeDisabled();
    expect(screen.getByRole("button", { name: /creating/i })).toBeDisabled();
  });
});
