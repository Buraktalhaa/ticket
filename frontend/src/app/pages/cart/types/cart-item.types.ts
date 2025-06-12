export interface CartTicket {
  id: string;
  title: string;
  description?: string;
  price: number;
  stock?: number;
  discount: number;
  images?: string[];
  day?: string | Date;
  hour?: number;
  company?: {
    name: string;
  };
  category?: {
    name: string;
  };
}

export interface CartItem {
  ticket: CartTicket;
  count: number;
}

export interface CartUpdatedTo {
  ticketId: string;
  count: number;
}