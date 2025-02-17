import { Module } from "@nestjs/common";
import { SurveyService } from "./survey.service";
import { SurveyController } from "./survey.controller";
import { Survey, SurveySchema } from "./schemas/survey.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Survey.name, schema: SurveySchema }]),
  ],
  controllers: [SurveyController],
  providers: [SurveyService],
})
export class SurveyModule {}
