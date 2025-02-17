import { Module } from "@nestjs/common";
import { ClientService } from "./client.service";
import { ClientController } from "./client.controller";
import { Client, ClientSchema } from "./schemas/client.schema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
