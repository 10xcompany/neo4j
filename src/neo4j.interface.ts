import {ModuleMetadata} from '@nestjs/common';
import {Config} from 'neo4j-driver';

export interface Neo4jConfig {
  user: string;
  password: string;
  url: string;
  config?: Config;
  database?: string;
}

export interface Neo4jModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Neo4jConfig;
  inject?: any[];
}
