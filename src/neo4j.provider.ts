import {Provider} from '@nestjs/common';
import neo4j, {Driver} from 'neo4j-driver';
import {NEO4J_DRIVER, NEO4J_CONFIG} from './neo4j.constant';
import {Neo4jConfig, Neo4jModuleAsyncOptions} from './neo4j.interface';

export async function getDriver(options: Neo4jConfig): Promise<Driver> {
  const {user, url, password, config} = options;
  const driver = neo4j.driver(url, neo4j.auth.basic(user, password), config);
  // Verify the connection details or throw an Error
  await driver.verifyConnectivity();
  return driver;
}

export const createClient = (): Provider => ({
  provide: NEO4J_DRIVER,
  useFactory: async (options: Neo4jConfig): Promise<Driver> => {
    const clients = getDriver(options);

    return clients;
  },
  inject: [NEO4J_CONFIG],
});

export const createAsyncClientOptions = (options: Neo4jModuleAsyncOptions) => ({
  provide: NEO4J_CONFIG,
  useFactory: options.useFactory,
  inject: options.inject,
});
