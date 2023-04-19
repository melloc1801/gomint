import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetProject = createParamDecorator(
  (_: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().project;
  }
);
