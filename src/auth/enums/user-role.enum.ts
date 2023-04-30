import { registerEnumType } from "@nestjs/graphql";

export enum UserRoles {
    ADMIN = 'admin',
    TALACHERO = 'talachero',
    USUARIO = 'usuario',
    SUPERADMIN = 'superAdmin'
}

registerEnumType(UserRoles, { name: 'UserRoles' })