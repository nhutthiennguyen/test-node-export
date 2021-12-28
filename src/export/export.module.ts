import { Module } from '@nestjs/common';
import { ExportService } from './export.service';
import { ExportController } from './export.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
