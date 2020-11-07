import {
  RpcExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {Neo4jError} from 'neo4j-driver';
import {Observable, throwError} from 'rxjs';

@Catch(Neo4jError)
export class Neo4jErrorRpcFilter implements RpcExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc();
    const context = ctx.getContext();

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

    return throwError({
      message,
      context,
      timestamp: new Date().toISOString(),
      ...new Error(error),
    });
  }
}
