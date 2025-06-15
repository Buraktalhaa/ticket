import { CartItem } from '../types/cart-item.types';

export function canIncreaseQuantity(item: CartItem | null): string | null {
    if (!item) return "Item is missing";
    if (item.ticket.stock === undefined) {
        return "Stock information is unavailable";
    }
    if (item.count >= item.ticket.stock) {
        return `Not enough stock available. Only ${item.ticket.stock} left in stock.`;
    }
    return null;
}

export function canDecreaseQuantity(item: CartItem | null): string | null {
    if (!item) return "Item is missing";
    if (item.count <= 1) return "At least one item must remain in the cart";
    return null;
}
