import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CreateReportDto } from "./dto/create-report.dto";
import { PrismaService } from "../prisma.service";
import { REPORT_ERROR } from "./enum/report-error.enum";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async create(
    createReportDto: CreateReportDto,
    userId: number,
    projectId: number
  ): Promise<void> {
    const projectReport = await this.prisma.report.findFirst({
      where: { projectId, userId },
    });
    if (projectReport) {
      await this.prisma.report.delete({ where: { id: projectReport.id } });
    }

    await this.prisma.report
      .create({
        data: {
          ...createReportDto,
          user: {
            connect: { id: userId },
          },
          project: {
            connect: { id: projectId },
          },
        },
      })
      .catch((error) => {
        console.log(error);
        throw new BadRequestException(error.message);
      });
  }

  async remove(userId: number, projectId: number): Promise<void> {
    const projectReport = await this.prisma.report.findFirst({
      where: { userId, projectId },
    });

    if (!projectReport) {
      throw new NotFoundException(REPORT_ERROR.NOT_FOUND);
    }

    await this.prisma.report.delete({
      where: {
        id: projectReport.id,
      },
    });
  }
}
