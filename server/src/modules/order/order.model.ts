export interface Order {
    id?: number;
    user_id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    order_date?: string;
    status: string;
}
