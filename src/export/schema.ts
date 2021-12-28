import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ collection: 'products' })
export class Product {
  @Prop()
  productId: string;

  @Prop()
  type: string;

  @Prop()
  tags: string;

  @Prop()
  title: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
