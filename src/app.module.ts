import { Module } from '@nestjs/common';
import { ExportModule } from './export/export.module';

@Module({
  imports: [ExportModule],
})
export class AppModule {}
