import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetProjectIsController = createParamDecorator(
  (_: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().isController;
  }
);
