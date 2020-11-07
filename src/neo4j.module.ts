import {DynamicModule, Module} from '@nestjs/common';
import {ModuleRef} from '@nestjs/core';
import {Neo4jConfig, Neo4jModuleAsyncOptions} from './neo4j.interface';
import {Neo4jCoreModule} from './neo4j.core.module';

@Module({})
export class Neo4jModule {
  constructor(private readonly moduleRef: ModuleRef) {}

  static forRoot(options: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      imports: [Neo4jCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: Neo4jModuleAsyncOptions): DynamicModule {
    return {
      module: Neo4jModule,
      imports: [Neo4jCoreModule.forRootAsync(options)],
    };
  }
}
