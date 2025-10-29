import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrderDetails } from "../../components/OrderDetails";

const mockOrder = {
  id: "12345",
  clientName: "John Doe",
  productName: "Dell Laptop",
  value: 3500,
  status: "Concluído",
  creationDate: "2025-10-25T14:30:00Z",
};

describe("OrderDetails Component", () => {
  it("renders nothing when order is null", () => {
    const { container } = render(
      <OrderDetails order={null} open={true} onClose={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders order data correctly", () => {
    render(<OrderDetails order={mockOrder} open={true} onClose={jest.fn()} />);
    expect(screen.getByText("Order Details")).toBeInTheDocument();
    expect(screen.getByText("Order ID")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("Client Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Product Name")).toBeInTheDocument();
    expect(screen.getByText("Dell Laptop")).toBeInTheDocument();
    expect(screen.getByText("Creation Date")).toBeInTheDocument();
  });

  it("formats value in BRL correctly", () => {
    render(<OrderDetails order={mockOrder} open={true} onClose={jest.fn()} />);
    expect(screen.getByText("R$ 3.500,00")).toBeInTheDocument();
  });

  it("displays status chip correctly", () => {
    render(<OrderDetails order={mockOrder} open={true} onClose={jest.fn()} />);
    const statusChip = screen.getByText("Concluído");
    expect(statusChip).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", () => {
    const handleClose = jest.fn();
    render(
      <OrderDetails order={mockOrder} open={true} onClose={handleClose} />
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("formats date in pt-BR correctly", () => {
    render(<OrderDetails order={mockOrder} open={true} onClose={jest.fn()} />);
    const formattedDateRegex = /\d{2}\/\d{2}\/\d{4}/;
    expect(screen.getByText(formattedDateRegex)).toBeInTheDocument();
  });
});
