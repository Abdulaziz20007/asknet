import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Client } from "../../client/schemas/client.schema";
export type SurveyDocument = HydratedDocument<Survey>;

@Schema()
export class Survey {
  @Prop()
  title_uzb: string;

  @Prop()
  title_rus: string;

  @Prop()
  description_uzb: string;

  @Prop()
  description_rus: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Client" })
  client_id: Client;

  @Prop()
  location: string;

  @Prop()
  radius: number;

  @Prop()
  reward_per_participant: number;

  @Prop()
  total_budget: number;

  @Prop()
  start_age: number;

  @Prop()
  finish_age: number;

  @Prop()
  start_date: Date;

  @Prop()
  finish_date: Date;

  @Prop()
  target_lang: string;

  @Prop()
  status: boolean;
}

export const SurveySchema = SchemaFactory.createForClass(Survey);
