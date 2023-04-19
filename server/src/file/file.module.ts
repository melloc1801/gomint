import { FilesController } from "./file.controller";
import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Module({
  imports: [],
  providers: [PrismaService],
  controllers: [FilesController],
})
export class FileModule {}
