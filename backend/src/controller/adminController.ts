import { Controller, Get, Post, Req, Param, Body } from "@nestjs/common";
import { adminService } from "src/service/adminService";

@Controller("admin")
export class adminController {
    constructor(private readonly adminService: adminService) {}

    @Get("users")
    async listUsers(@Req() req: any) {
        return await this.adminService.listUsers(req.cookies.user);
    }

    @Post("users/:id/ban")
    async ban(@Req() req: any, @Param("id") id: string, @Body("reason") reason: string) {
        return await this.adminService.banUser(req.cookies.user, id, reason);
    }

    @Post("users/:id/suspend")
    async suspend(@Req() req: any, @Param("id") id: string, @Body("days") days: number, @Body("reason") reason: string) {
        return await this.adminService.suspendUser(req.cookies.user, id, Number(days), reason);
    }

    @Post("users/:id/restore")
    async restore(@Req() req: any, @Param("id") id: string) {
        return await this.adminService.restoreUser(req.cookies.user, id);
    }
}
