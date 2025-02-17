import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Survey } from "../../survey/schemas/survey.schema";

export class Client {
  @Prop()
  full_name: string;

  @Prop()
  company: string;

  @Prop()
  phone_number: string;

  @Prop()
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Survey" }])
  surveys: Survey[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
