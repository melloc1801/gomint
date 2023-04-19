import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetProjectIsOwner = createParamDecorator(
  (_: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().isProjectOwner;
  }
);
