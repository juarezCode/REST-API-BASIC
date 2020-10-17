import { Response, Request, NextFunction } from 'express';
/* eslint-disable comma-dangle */
/* eslint-disable no-throw-literal */
import jwt from 'jsonwebtoken';

// este midleware hace validaciones
export const isValidHostname = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const validHosts = ['google', 'localhost'];

  if (validHosts.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({ status: 'STATUS_DENIED' });
  }
};

export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // console.log('headers', req.headers);
  const { token } = req.headers;

  try {
    if (token) {
      const data: any = jwt.verify(token as string, process.env.JWT_SECRET!);
      console.log('data', data);
      if (data.userId !== req.body.userId && data.role !== 'admin') {
        throw {
          code: 403,
          status: 'STATUS_DENIED',
          message: 'Missing permission or invalid role',
        };
      }
      req.sessionData = { userId: data.userId, role: data.role }; // agregar el dato userId a traves del req

      next();
    } else {
      throw {
        code: 403,
        status: 'STATUS_DENIED',
        message: 'Missing header token',
      };
    }
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || 'ERROR', message: e.message });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { role } = req.sessionData;
    console.log('role', role);

    if (role !== 'admin') {
      throw {
        code: 403,
        status: 'STATUS_DENIED',
        message: 'invalid role',
      };
    }
    next();
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || 'ERROR', message: e.message });
  }
};

// module.exports = { isValidHostname, isAuth, isAdmin };
