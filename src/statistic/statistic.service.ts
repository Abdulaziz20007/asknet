import { Injectable } from "@nestjs/common";
import { CreateStatisticDto } from "./dto/create-statistic.dto";
import { UpdateStatisticDto } from "./dto/update-statistic.dto";
import { Statistic } from "./schemas/statistic.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Statistic.name) private statisticModel: Model<Statistic>
  ) {}

  create(createStatisticDto: CreateStatisticDto) {
    return this.statisticModel.create(createStatisticDto);
  }

  findAll() {
    return this.statisticModel.find();
  }

  findOne(id: string) {
    return this.statisticModel.findById(id);
  }

  update(id: string, updateStatisticDto: UpdateStatisticDto) {
    return this.statisticModel.findByIdAndUpdate(id, updateStatisticDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.statisticModel.findByIdAndDelete(id);
  }
}
