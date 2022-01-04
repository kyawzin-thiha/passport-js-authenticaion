import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocalUserDocument = Document & LocalUser;

@Schema({ timestamps: true })
export class LocalUser {
  @Prop()
  _id: string;

  @Prop({ require: true, unique: true, trim: true })
  userName: string;

  @Prop({ require: true, trim: true })
  password: string;
}
export const LocalUserSchema = SchemaFactory.createForClass(LocalUser);
