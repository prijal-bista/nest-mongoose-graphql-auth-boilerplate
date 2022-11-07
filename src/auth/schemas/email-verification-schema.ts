import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailVerificationDocument = EmailVerification & Document;

@Schema()
export class EmailVerification {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  timestamp: Date;
}

export const EmailVerificationSchema =
  SchemaFactory.createForClass(EmailVerification);
