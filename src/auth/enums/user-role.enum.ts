import { registerEnumType } from '@nestjs/graphql';

export enum UserRoles {
  Administrador = 'Administrador',
  Talachero = 'Talachero',
  Usuario = 'Usuario',
  superAdmin = 'superAdmin',
  Trabajador = 'Trabajador'
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
  description:
    'Roles allowed in the system [superAdmin, admin,talachero, user]',
});
