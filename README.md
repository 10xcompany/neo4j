[![NPM version](https://img.shields.io/npm/v/@10xcompany/nest-neo4j.svg)](https://www.npmjs.com/package/@10xcompany/nest-neo4j)
[![Downloads](https://img.shields.io/npm/dm/@10xcompany/nest-neo4j.svg)](https://www.npmjs.com/package/@10xcompany/nest-neo4j)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Description

The [Neo4j](https://github.com/neo4j/neo4j-javascript-driver) module for [NestJS](https://github.com/nestjs/nest) with platform adapter optimization

## 🚀 Quick Start

First install the module via `yarn` or `npm` and do not forget to install the database driver as well:

```bash
$ yarn add @10xcompany/nest-neo4j neo4j-driver
```

or

```bash
$ npm i -s @10xcompany/nest-neo4j neo4j-driver
```

Once the installation process is completed, we can import the `Neo4jModule` into the required module or in global scope in `AppModule`.

```typescript
import {Neo4jModule} from '@10xcompany/nest-neo4j';

@Module({
  imports: [
    Neo4jModule.forRoot({
      url: 'bolt://localhost',
      user: 'neo4j',
      password: 'neo4j',
      database: 'neo4j',
    }),
  ],
  // ...
})
export class CustomModule {}
```

Or, if you want to use it in global:

```typescript
import {Neo4jModule} from '@10xcompany/nest-neo4j';

@Module({
  imports: [
    Neo4jModule.forRoot({
      url: 'bolt://localhost',
      user: 'neo4j',
      password: 'neo4j',
      database: 'neo4j',
    }),
  ],
  // ...
})
export class AppModule {}
```

Or, if you're using the Async provider:

```typescript
import {Neo4jModule} from '@10xcompany/nest-neo4j';

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      // ...
      useFactory: () => ({
        url: 'bolt://localhost',
        user: 'neo4j',
        password: 'neo4j',
        database: 'neo4j',
      }),
    }),
  ],
  // ...
})
export class CustomModule {}
```

The `forRoot()/forRootAsync()` method accepts the same configuration object as `neo4j.driver()` from the neo4j-javascript-driver package.

Afterward, the `Neo4jService` will be available to inject across entire project or the module which the `Neo4jModule` is used.

```ts
import {Neo4jService} from '@10xcompany/nest-neo4j';

@Injectable()
export class MyService {
  constructor(private readonly neo4jService: Neo4jService) {}
}
```

## Interceptors/Filters

The package includes interceptors/filters to use in your project for handling neo4j errors/types. The package includes error filter type for express, fastify and rpc, websocket

For example:

### Global interceptor/filter

Express

```typescript
import {
  Neo4jTypeInterceptor,
  Neo4jErrorExpressFilter,
} from '@10xcompany/nest-neo4j';

function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...
  app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorExpressFilter());
  // ...
}

// OR
@Controller()
class SampleController {
  @Post()
  @UseFilters(new Neo4jErrorFastifyFilter())
  async create() {
    // ...
  }
}
```

Fastify

```typescript
import {
  Neo4jTypeInterceptor,
  Neo4jErrorFastifyFilter,
} from '@10xcompany/nest-neo4j';

function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...
  app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorFastifyFilter());
  // ...
}

// OR
@Controller()
class SampleController {
  @Post()
  @UseFilters(new Neo4jErrorFastifyFilter())
  async create() {
    // ...
  }
}
```

Websocket

```typescript
import {Neo4jTypeInterceptor, Neo4jErrorWsFilter} from '@10xcompany/nest-neo4j';

function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ...
  app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorWsFilter());
  // ...
}

// OR
@Controller()
class SampleController {
  @SubscribeMessage('create')
  @UseFilters(new Neo4jErrorWsFilter())
  async create() {
    // ...
  }
}
```

Microservice

```typescript
import {
  Neo4jTypeInterceptor,
  Neo4jErrorRpcFilter,
} from '@10xcompany/nest-neo4j';

function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
  });
  // ...
  app.useGlobalInterceptors(new Neo4jTypeInterceptor());
  app.useGlobalFilters(new Neo4jErrorRpcFilter());
  // ...
}

// OR
@Controller()
class SampleController {
  @MessagePattern({cmd: 'sum'})
  @UseFilters(new Neo4jErrorRpcFilter())
  async create() {
    // ...
  }
}
```

## 📚 Example usage

```typescript
@Injectable()
export class ExampleService {
  constructor(private readonly neo4jService: Neo4jService) {}

  async create(params: any): Promise<QueryResult> {
    const res = await this.neo4jService.writeTransaction(
      `
      CREATE (n:Node)
      SET n += $properties
      RETURN n
      `,
      {
        properties: params,
      },
    );

    return res;
  }

  async update(params: any, id: string): Promise<QueryResult> {
    const res = await this.neo4jService.writeTransaction(
      `
        MATCH (n:Node)
        WHERE n.id = $id
        SET n += $properties
        RETURN n
      `,
      {
        properties: params,
        id,
      },
    );

    return res;
  }

  async get(id: string): Promise<QueryResult> {
    const res = await this.neo4jService.read(
      `
        MATCH (n:Node)
        WHERE n.id = $id
        RETURN n
      `,
      {
        properties: params,
        id,
      },
    );

    return res;
  }
}
```

## `Neo4jService` methods

The `Neo4jService` exposes few methods for several use case:

- `async read(): Promise<Result>`: method to run a query to get a node/relationship or path from the database, this method should only be used for a read operation not write.

- `async wite(): Promise<Result>`: method to run a query to write node/relationship to the database, this method should only be used for a write operation.

- `async writeTransaction(): Promise<Result>`: (recommended) method to run a query to write node/relationship to the database, this method should only be used for a write operation, this method is preferred because it implements a rollback if a transaction fails and revert back all changes.

## 🤝 Contributing

Contributions, issues and feature requests are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the process for submitting pull requests to us.

## Authors

👤 **Quadri Adekunle**

- Github: [@Quadriphobs1](https://github.com/Quadriphobs1)

See also the list of contributors who [participated](https://github.com/10xcompany/neo4j/contributors) in this project.

## Show Your Support

Please ⭐️ this repository if this project helped you!

## 📝 License

Copyright © 2020.

This project is licensed under the MIT License - see the [LICENSE file](LICENSE) for details.
