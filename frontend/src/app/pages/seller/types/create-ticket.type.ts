export interface SellerTicket {
    categoryName: string;
    title: string;
    description: string;
    location: string;
    city: string;
    pointRate: number;
    price: number;
    pointExpiresAt: string | null;
    dateTime: string;
    discount: number;
    stock: number;
    images: string[];
}