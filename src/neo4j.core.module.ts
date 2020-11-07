import {
  DynamicModule,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import {Driver} from 'neo4j-driver';
import {ModuleRef} from '@nestjs/core';
import {Neo4jService} from './neo4j.service';
import {NEO4J_CONFIG, NEO4J_DRIVER} from './neo4j.constant';
import {Neo4jConfig} from './neo4j.interface';
import {Neo4jTransactionInterceptor} from './neo4j.transaction.interceptor';
import {createAsyncClientOptions, createClient} from './neo4j.provider';

@Global()
@Module({
  providers: [Neo4jService, Neo4jTransactionInterceptor],
  exports: [Neo4jService, Neo4jTransactionInterceptor],
})
export class Neo4jCoreModule implements OnModuleDestroy {
  constructor(
    @Inject(NEO4J_CONFIG)
    private readonly options: Neo4jConfig,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(options: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jCoreModule,
      providers: [
        createClient(),
        {
          provide: NEO4J_CONFIG,
          useValue: options,
        },
      ],
      exports: [Neo4jService, Neo4jTransactionInterceptor],
    };
  }

  static forRootAsync(options): DynamicModule {
    return {
      module: Neo4jCoreModule,
      imports: options.imports,
      providers: [createClient(), createAsyncClientOptions(options)],
      exports: [Neo4jService, Neo4jTransactionInterceptor],
    };
  }

  onModuleDestroy() {
    const closeConnection = (driver) => () => {
      driver?.close();
    };

    const driver = this.moduleRef.get<Driver>(NEO4J_DRIVER);
    const closeClientConnection = closeConnection(driver);
    closeClientConnection();
  }
}
