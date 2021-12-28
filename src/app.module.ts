import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    ExportModule,
    MongooseModule.forRoot(
      'mongodb+srv://nhutthien:nhutthien@cluster0.fk4bz.mongodb.net/nodejs?retryWrites=true&w=majority',
    ),
  ],
})
export class AppModule {}
