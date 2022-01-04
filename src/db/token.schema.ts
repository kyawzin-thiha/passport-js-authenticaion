import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserTokenDocument = UserToken & Document;

@Schema({ timestamps: true })
export class UserToken {
  @Prop()
  _id: string;

  @Prop({ required: true })
  userID: string;

  @Prop({ required: true })
  infoID: string;

  @Prop({ required: true, unique: true })
  token: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
