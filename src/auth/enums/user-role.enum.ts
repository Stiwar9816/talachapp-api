import { registerEnumType } from '@nestjs/graphql';

export enum UserRoles {
  Administrador = 'Administrador',
  centroTalachero = 'Centro Talachero',
  Talachero = 'Talachero',
  Usuario = 'Usuario',
  superAdmin = 'superAdmin',
}

registerEnumType(UserRoles, {
  name: 'UserRoles',
  description:
    'Roles allowed in the system [superAdmin, admin, centroTalachero,talachero, user]',
});
