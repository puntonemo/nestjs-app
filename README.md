

## Installation

```bash
$ pnpm i --save class-validator class-transformer @nestjs/swagger swagger-ui-express @nestjs/config @nestjs/serve-static bcryptjs @nestjs/jwt @nestjs/passport passport passport-jwt passport-google-oauth20 passport-microsoft @nestjs/event-emitter ejs @nestjs/cache-manager cache-manager @nestjs/websockets @nestjs/platform-socket.io @nestjs/microservices
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Docker  Build

```bash
docker build -t nestjs-app .

docker run -p4000:4000 nestjs-app
```

## Docker Compose

```bash
docker-compose up -d [--build]

docker-compose down
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
