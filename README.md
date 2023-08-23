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

9. Construir imagen de docker:

```
docker-compose -f docker-compose.prod.yml --env-file .env.prod up --build
```

10. Correr la iamgen de docker en local

```
docker-compose -f docker-compose.prod.yml --env-file .env.prod up
```

11. Correr imagen de docker desde el docker hub

```
docker run -p 3000:3000 --env-file=.env.prod stiwar1098/talachapp-api:1.0.0
```

## Cambiar nombre de la imagen de docker

```
docker tag <nombre app> <usuario docker hub>/<nombre repositorio>
```

## Subir imagen a docker hub

```
docker push <usuario docker hub>/<nombre repositorio>
```

## Nota

Por defecto, `docker-compose` usa el archivo `.env`, por lo que si tenemos el archivo `.env` configurado con las variables de entorno de producción, bastaría con ejecutar el siguiente comando

```
docker-compose -f docker-compose.prod.yml up --build
```

## Stack Usado

- NestJS
- Docker
- Postgres
- GraphQL

## COMMIT STRUCUTRE

| Type     | Definition                                            |
| -------- | ----------------------------------------------------- |
| feat     | When new features are added                           |
| fix      | Correction of some error                              |
| build    | Build system changes                                  |
| chore    | Changes that do not affect the production environment |
| ci       | Continuous Integration configuration changes          |
| docs     | Documentation Changes                                 |
| perf     | Application performance improvements                  |
| refactor | Code refactoring processes                            |
| revert   | Rollbacks to a previous commit                        |
| style    | Style changes in the application                      |
| syntax   | Code syntax changes                                   |
| test     | Add or correct test                                   |
| delete   | File deletion                                         |

## Example

```sh
fix (button) = Change of any button
```

```sh
fix (User) = Change in an entity
```

If the commit has a change that makes it incompatible with the new version, for example the ORM change, the commit will be created as follows:

```sh
fix (database)! = If you have the "!" at the end it means that it is a breaking change
```

and finally add a short message:

```sh
fix (UserController): Changing the HTTP method used in /register
```
