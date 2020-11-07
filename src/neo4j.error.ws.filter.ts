import {Catch, ArgumentsHost, WsExceptionFilter} from '@nestjs/common';
import {Neo4jError} from 'neo4j-driver';
import {throwError} from 'rxjs';

@Catch(Neo4jError)
export class Neo4jErrorWsFilter implements WsExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    let error = 'Internal Server Error';
    let message: string[] = undefined;

    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54776) already exists with label `User` and property `email` = 'duplicate@email.com'
    if (exception.message.includes('already exists with')) {
      error = 'Bad Request';

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} already taken`];
    }
    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54778) with label `Test` must have the property `mustExist`
    else if (exception.message.includes('must have the property')) {
      error = 'Bad Request';

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} should not be empty`];
    }

    throwError({
      message,
      client,
      timestamp: new Date().toISOString(),
      ...new Error(error),
    });
  }
}
