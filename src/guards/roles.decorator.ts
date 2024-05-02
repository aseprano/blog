import { Reflector } from '@nestjs/core';

export const AllowedRoles = Reflector.createDecorator<string[]>();

export const Admin = 'admin';
export const User = 'user';
