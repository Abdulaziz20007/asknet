export class CreateSurveyDto {
  title_uzb: string;
  title_rus: string;
  description_uzb: string;
  description_rus: string;
  client_id: string;
  location: string;
  radius: number;
  reward_per_participant: number;
  total_budget: number;
  start_age: number;
  finish_age: number;
  start_date: Date;
  finish_date: Date;
  target_lang: string;
  status: boolean;
}
