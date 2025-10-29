import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { OrderTable } from "../../components/OrderTable";

const mockOrders = [
  {
    id: "1",
    clientName: "John Doe",
    productName: "Laptop",
    value: 2500,
    status: "Concluído",
    creationDate: "2025-10-25T14:30:00Z",
  },
  {
    id: "2",
    clientName: "Jane Smith",
    productName: "Phone",
    value: 1500,
    status: "Pendente",
    creationDate: "2025-10-26T10:15:00Z",
  },
];

describe("OrderTable Component", () => {
  it("renders table headers correctly", () => {
    render(<OrderTable orders={mockOrders} onViewDetails={jest.fn()} />);
    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  it("renders order data correctly", () => {
    render(<OrderTable orders={mockOrders} onViewDetails={jest.fn()} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Phone")).toBeInTheDocument();
    expect(screen.getAllByText("Concluído")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Pendente")[0]).toBeInTheDocument();
  });

  it("formats values as BRL currency", () => {
    render(<OrderTable orders={mockOrders} onViewDetails={jest.fn()} />);
    expect(screen.getByText("R$ 2.500,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.500,00")).toBeInTheDocument();
  });

  it("formats dates in pt-BR correctly", () => {
    render(<OrderTable orders={mockOrders} onViewDetails={jest.fn()} />);
    const datePattern = /\d{2}\/\d{2}\/\d{4}/;
    expect(screen.getAllByText(datePattern)[0]).toBeInTheDocument();
    expect(screen.getAllByText(datePattern)[1]).toBeInTheDocument();
  });

  it("calls onViewDetails with correct order when clicking the visibility button", () => {
    const handleViewDetails = jest.fn();
    render(
      <OrderTable orders={mockOrders} onViewDetails={handleViewDetails} />
    );
    const viewButtons = screen.getAllByRole("button");
    fireEvent.click(viewButtons[0]);
    expect(handleViewDetails).toHaveBeenCalledTimes(1);
    expect(handleViewDetails).toHaveBeenCalledWith(mockOrders[0]);
  });

  it("renders correct number of rows based on orders array", () => {
    render(<OrderTable orders={mockOrders} onViewDetails={jest.fn()} />);
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(mockOrders.length + 1);
  });
});
