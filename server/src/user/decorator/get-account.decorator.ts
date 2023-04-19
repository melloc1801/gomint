import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetAccount = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().account;
  }
);
