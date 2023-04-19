import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetPhase = createParamDecorator(
  (_: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().phase;
  }
);
