import {Injectable, Inject, OnApplicationShutdown} from '@nestjs/common';
import neo4j, {Driver, Session, Result, Transaction} from 'neo4j-driver';
import {NEO4J_DRIVER, NEO4J_CONFIG} from './neo4j.constant';
import {Neo4jConfig} from './neo4j.interface';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
    @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
  ) {}

  /**
   * @internal
   */
  private getDriver(): Driver {
    return this.driver;
  }

  /**
   * @internal
   */
  getReadSession(database?: string): Session {
    return this.getDriver().session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  /**
   * @internal
   */
  getWriteSession(database?: string): Session {
    return this.getDriver().session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  /**
   * @internal
   */
  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database);
    return session.beginTransaction();
  }

  public async read(
    cypher: string,
    params?: Record<string, any>,
    database?: string,
  ): Promise<Result> {
    const session = this.getReadSession(database);
    return session.run(cypher, params);
  }

  public async writeTransaction(
    cypher: string,
    params?: Record<string, any>,
  ): Promise<Result> {
    const transaction = this.beginTransaction();
    try {
      const result = await transaction.run(cypher, params);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async write(
    cypher: string,
    params?: Record<string, any>,
    database?: string,
  ): Promise<Result> {
    const session = await this.getWriteSession(database);
    return session.run(cypher, params);
  }

  /**
   * @internal
   */
  onApplicationShutdown() {
    return this.getDriver().close();
  }
}
