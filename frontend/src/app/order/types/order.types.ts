export interface Order {
  id: string;
  userId: string;
  ticketId: string;
  quantity: number;
  orderDay: string;
  paymentId: string;
  pointsUsed: number;
  usePoints: boolean;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  ticket: {
    title: string;
    description: string;
  }
}