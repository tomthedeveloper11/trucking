import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import userService from '../../src/user/user.service';
import initMiddleware from '../../src/middlewares/init-middleware';
import validateMiddleware from '../../src/middlewares/validate-middleware';
import { User } from '../../types/common';
import connectDb from '../../src/mongodb/connection';
const loginValidator = initMiddleware(
  validateMiddleware(
    [
      check('username').isString().exists(),
      check('password').isString().exists(),
    ],
    validationResult
  )
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      await loginValidator(req, res);

      conn = await connectDb();
      const userPayload = req.body as User;
      const access_token = await userService.login(userPayload);
      await conn.close();
    
      res.status(200).json({
        access_token,
        message: 'Login Success!',
      });
      break;
  }
}
