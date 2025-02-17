import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type StatisticDocument = HydratedDocument<Statistic>;

@Schema()
export class Statistic {
  @Prop()
  survey_id: string;

  @Prop()
  total_responses: number;

  @Prop()
  average_rating: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);
