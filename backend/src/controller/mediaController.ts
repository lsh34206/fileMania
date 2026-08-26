import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import type { Response } from 'express';
import { downloadService } from "src/service/download";

@Controller("media")
export class mediaController {
    constructor(private readonly downloadService: downloadService) {}

    @Get(":type/:id")
    async serve(
        @Req() req: any,
        @Param("type") type: string,
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.downloadService.serve_file(type, id, req.cookies.user);

        if (!result.success || !result.path) {
            return res.status((result as any).status ?? 404).json(result);
        }

        return res.sendFile(result.path);
    }

    @Get(":type/:id/preview")
    async preview(
        @Param("type") type: string,
        @Param("id") id: string,
        @Res() res: Response,
    ) {
        const result = await this.downloadService.serve_preview(type, id);

        if (!result.success || !result.buffer) {
            return res.status((result as any).status ?? 404).json(result);
        }

        res.type("jpeg");
        return res.send(result.buffer);
    }
}
