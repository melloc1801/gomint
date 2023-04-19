import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

@Module({
  imports: [],
  controllers: [ReportController],
  providers: [ReportService, PrismaService],
})
export class ReportModule {}
