import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import userService from '../../src/user/user.service';
import initMiddleware from '../../src/middlewares/init-middleware';
import validateMiddleware from '../../src/middlewares/validate-middleware';
import { User } from '../../types/common';
import connectDb from '../../src/mongodb/connection';

const createUserValidator = initMiddleware(
  validateMiddleware(
    [
      check('username').isString().exists(),
      check('password').isString().exists(),
      check('email').isString().optional(),
      check('role').isString().exists(),
      check('phoneNumber').isString().optional(),
    ],
    validationResult
  )
);

interface RegisterUserRequest extends NextApiRequest {
  body: Omit<User, 'id'>;
}

export default async function handler(
  req: RegisterUserRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      await createUserValidator(req, res);

      conn = await connectDb();
      const userPayload = req.body;
      const user = await userService.register(userPayload);
      await conn.close();

      res.status(200).json({ data: user, message: 'Account created!' });
      break;
  }
}
