export function calculateDiscountedPrice(price: number, discount: number): number {
    if (!discount || discount <= 0) return price;
    return price * (1 - discount / 100);
}  