import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export abstract class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: string;
}
