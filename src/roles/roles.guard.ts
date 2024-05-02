import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../guards/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(AllowedRoles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userHeader = request.header('x-user');

    return roles.includes(userHeader);
  }
}
