import { MiddlewareConsumer, NestModule } from "@nestjs/common";
export declare class mainModule implements NestModule {
    constructor();
    configure(consumer: MiddlewareConsumer): void;
}
