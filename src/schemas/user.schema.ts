/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop()
  fullname: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
