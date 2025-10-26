# Orders Management Frontend

A modern React frontend for managing orders, built with Next.js and Material-UI.

## Features

- **Order Listing**: Responsive table displaying all orders with status indicators
- **Order Creation**: Form to create new orders with validation
- **Order Details**: Modal to view detailed order information
- **Status Feedback**: Visual feedback for order status changes
- **Real-time Updates**: Automatic refresh of order data

## Tech Stack

- Next.js 16
- React 19
- Material-UI 5
- TypeScript
- Axios for API calls

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The frontend connects to the backend API running on port 3001. Make sure the backend is running before starting the frontend.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:3001)
