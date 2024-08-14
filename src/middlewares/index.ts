import { Err, ResponseErrorObject, Middleware, Next, Res, Req, HeaderParams, Context } from "@tsed/common";
import { Env } from "@tsed/core";
import { Constant } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import jwt from 'jsonwebtoken';

import { getEnv } from "@app/config/env";

const { JWT_KEY } = getEnv();

@Middleware()
export class NotFoundMiddleware {
  use(@Res() response: Res, @Next() next: Next) {
    response.status(404).json({ status: 404, message: 'Not found' });
  }
}

@Middleware()
export class Authenticated {
  async use(@HeaderParams("Authorization") authorization: string, @Req() request: Req, @Res() response: Res, @Next() next: Next, @Context() context: Context) {
    try {
      authorization = authorization?.split(' ')[1];
      jwt.verify(authorization, JWT_KEY);
      const _authenticated = jwt.decode(authorization);
      context.set('authenticated', _authenticated);
      next();
    } catch (error) {
      response.status(401).json({ status: 401, message: error.message });
    }
  }
}


function getErrors(error: any) {
  return [error, error.origin]
    .filter(Boolean)
    .reduce((errs, { errors }: ResponseErrorObject) => {
      return [
        ...errs,
        ...errors || []
      ];
    }, []);
}

function getHeaders(error: any) {
  return [error, error.origin]
    .filter(Boolean)
    .reduce((obj, { headers }: ResponseErrorObject) => {
      return {
        ...obj,
        ...headers || {}
      };
    }, {});
}

@Middleware()
export class GlobalErrorHandlerMiddleware {
  @Constant("env")
  env: Env;

  use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
    if (typeof error === "string") {
      response.status(404).send(error);
      return;
    }

    if (error instanceof Exception || error.status) {
      this.handleException(error, request, response);

      return;
    }

    this.handleError(error, request, response);

    return;
  }

  protected handleError(error: any, request: Req, response: Res) {
    const logger = request?.$ctx?.logger;
    const err = this.mapError(error);

    logger.error({
      error: err
    });

    response
      .set(getHeaders(error))
      .status(err.status).json(this.env === Env.PROD ? "InternalServerError" : err);
  }

  protected handleException(error: any, request: Req, response: Res) {
    const logger = request.$ctx.logger;
    const err = this.mapError(error);
    logger.error({
      error: err
    });

    response
      .set(getHeaders(error))
      .status(error.status)
      .json(err);
  }

  protected mapError(error: any) {
    return {
      message: error.message,
      stack: this.env === Env.DEV ? error.stack : undefined,
      status: error.status || 500,
      origin: {
        ...error.origin || {},
        errors: undefined
      },
      errors: getErrors(error)
    };
  }
}

