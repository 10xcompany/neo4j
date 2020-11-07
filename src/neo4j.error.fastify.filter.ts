import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {Neo4jError} from 'neo4j-driver';

@Catch(Neo4jError)
export class Neo4jErrorFastifyFilter implements ExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string[] = undefined;

    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54776) already exists with label `User` and property `email` = 'duplicate@email.com'
    if (exception.message.includes('already exists with')) {
      statusCode = HttpStatus.BAD_REQUEST;
      error = 'Bad Request';

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} already taken`];
    }
    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54778) with label `Test` must have the property `mustExist`
    else if (exception.message.includes('must have the property')) {
      statusCode = 400;
      error = 'Bad Request';

      const [, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} should not be empty`];
    }

    response.code(statusCode).send({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      error,
      path: request.url,
    });
  }
}
