import { paymentService } from "../service/paymentService";
export declare class paymentController {
    private readonly paymentService;
    constructor(paymentService: paymentService);
    createOrder(req: any, body: {
        amount: number;
    }): Promise<{
        success: boolean;
        orderId: string;
        amount: number;
        orderName: string;
        customerName: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    confirm(req: any, body: {
        paymentKey: string;
        orderId: string;
        amount: number;
    }): Promise<{
        success: boolean;
        message: any;
        point?: undefined;
    } | {
        success: boolean;
        message: string;
        point: any;
    }>;
}
