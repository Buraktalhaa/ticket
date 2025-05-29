export interface Category {
  name: string;
}

export interface Ticket {
  id: string;
  pnr: string;
  userId: string;
  title: string;
  description: string;
  city: string;
  location: string;
  pointRate: number;
  dateTime: string;
  price: number;
  pointExpiresAt: string;
  stock: number;
  sold: boolean;
  images: string[];
  discount: number;
  status: 'processing' | 'approve' | 'deleted' | 'cancelling' | 'awaiting';
  category: Category;
  createdAt: string;
}


export interface CreateTicketDTO {
  categoryName: string;
  description: string;
  dateTime: string;
  stock: number;
  price: number;
  pointRate: number;
  pointExpiresAt: string;
  discount: number;
}