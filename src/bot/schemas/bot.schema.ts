import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type BotDocument = HydratedDocument<Bot>;

@Schema()
export class Bot {
  @Prop()
  user_id: string;

  @Prop()
  user_name: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  phone_number: string;

  @Prop()
  status: boolean;

  @Prop()
  last_state: string;

  @Prop()
  user_lang: string;

  @Prop()
  real_name: string;

  @Prop()
  gender: string;

  @Prop()
  birth_year: string;

  @Prop()
  balance: number;

  @Prop({ unique: true })
  refferal_code: string;

  @Prop()
  offer_code: string;
}

export const BotSchema = SchemaFactory.createForClass(Bot);
