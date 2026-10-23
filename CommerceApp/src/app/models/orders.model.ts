import { OrderItems } from "./order-items.model";

export interface Orders {
    id: number;
    dateTime: Date;
    status: string;
    totalAmount: number;
    orderItems: OrderItems[];

}
