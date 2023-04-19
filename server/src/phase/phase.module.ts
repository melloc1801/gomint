import { Module } from "@nestjs/common";
import { PhaseController } from "./phase.controller";
import { PhaseService } from "./phase.service";
import { PrismaService } from "../prisma.service";

@Module({
  providers: [PhaseService, PrismaService],
  controllers: [PhaseController],
  imports: [],
})
export class PhaseModule {}
