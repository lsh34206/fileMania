import { purchaseService } from "../service/purchaseService";
export declare class purchaseController {
    private readonly purchaseService;
    constructor(purchaseService: purchaseService);
    purchase(req: any, type: string, id: string): Promise<{
        success: boolean;
        message: string;
        point: any;
    } | {
        success: boolean;
        message: string;
    }>;
}
