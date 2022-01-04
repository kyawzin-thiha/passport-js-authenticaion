import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserInfoDocument = Document & UserInfo;

@Schema({ timestamps: true })
export class UserInfo {
  @Prop()
  _id: string;

  @Prop({ require: true, unique: true })
  userID: string;

  @Prop({ require: true, enum: ['Local', 'GitHub'] })
  provider: string;

  @Prop({ required: true, trim: true })
  displayName: string;
}
export const UserInfoSchema = SchemaFactory.createForClass(UserInfo);
