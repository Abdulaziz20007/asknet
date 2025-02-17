import { Injectable } from "@nestjs/common";
import { CreateSurveyDto } from "./dto/create-survey.dto";
import { UpdateSurveyDto } from "./dto/update-survey.dto";
import { Survey } from "./schemas/survey.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SurveyService {
  constructor(@InjectModel(Survey.name) private surveyModel: Model<Survey>) {}

  create(createSurveyDto: CreateSurveyDto) {
    return this.surveyModel.create(createSurveyDto);
  }

  findAll() {
    return this.surveyModel.find();
  }

  findOne(id: string) {
    return this.surveyModel.findById(id);
  }

  update(id: string, updateSurveyDto: UpdateSurveyDto) {
    return this.surveyModel.findByIdAndUpdate(id, updateSurveyDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.surveyModel.findByIdAndDelete(id);
  }
}
