import { registerEnumType } from "@nestjs/graphql";

export enum UserRoles {
    ADMIN = 'Administrador',
    TALACHERO = 'Centro Talachero',
    USUARIO = 'Usuario',
    SUPERADMIN = 'superAdmin'
}

registerEnumType(UserRoles, {
    name: 'UserRoles',
    description: 'Roles allowed in the system [superAdmin, admin, talachero, user]'
})