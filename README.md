<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# TalachAPP API

1. Instalar **[NestJS CLI](https://docs.nestjs.com/#installation)** globalmente

2. Clonar el repositorio

3. Instalar las depencias con el comando:

```
yarn install o npm install
```

3. Clonar el archivo **`.env.template`** y renombrarlo a **`.env`**

4. Cambiar las variables de entorno

5. Instalar **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** según la versión de tu sistema operativo

6. Levantar la base de datos postgres

```
docker-compose up -d
docker-compose up (Para revisar los logs)
```

7. Levantar el proyecto en modo de desarrollo con el comando:

```
yarn start:dev
```

8. Playground GraphQL

```
http://localhost:3000/graphql
```

## Stack Usado

- NestJS
- Docker
- Postgres
- GraphQL
