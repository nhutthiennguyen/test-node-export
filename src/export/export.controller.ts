import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('429')
  async error429() {
    return await this.exportService.error429();
  }

  @Get('updateWith429')
  async updateWith429() {
    return await this.exportService.updateWith429();
  }

  @Get()
  async export(@Res() response: Response): Promise<any> {
    const buffer = await this.exportService.export();
    response.setHeader(
      'Content-Disposition',
      `attachment; filename=test-excel.xlsx`,
    );
    return response.send(buffer);
  }

  @Get('stream')
  async stream(@Res() response: Response): Promise<any> {
    return await this.exportService.stream();
  }
}
