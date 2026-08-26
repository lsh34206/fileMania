import { Model } from "mongoose";
import { xpService } from "./xpService";
export declare class paymentService {
    private readonly xpService;
    private readonly userModel;
    private readonly pointChargeModel;
    constructor(xpService: xpService, userModel: Model<any>, pointChargeModel: Model<any>);
    createOrder(userId: string, amount: number): Promise<{
        success: boolean;
        message: string;
        orderId?: undefined;
        amount?: undefined;
        orderName?: undefined;
        customerName?: undefined;
    } | {
        success: boolean;
        orderId: string;
        amount: number;
        orderName: string;
        customerName: any;
        message?: undefined;
    }>;
    confirmPayment(userId: string, paymentKey: string, orderId: string, amount: number): Promise<{
        success: boolean;
        message: any;
        point?: undefined;
    } | {
        success: boolean;
        message: string;
        point: any;
    }>;
}
