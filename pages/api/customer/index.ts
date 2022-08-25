import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import customerService from '../../../src/customer/customer.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { Customer } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';

const createCustomerValidator = initMiddleware(
  validateMiddleware(
    [
      check('initial').isString().exists(),
      check('name').isString().optional(),
      check('address').isString().optional(),
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
      await createCustomerValidator(req, res);

      conn = await connectDb();
      const customerPayload = req.body as Customer;
      const customer = await customerService.createCustomer(customerPayload);
      await conn.close();

      res.status(200).json({ data: customer });
      break;

    case 'GET':
      conn = await connectDb();
      const customers = await customerService.getCustomers();
      await conn.close();
      res.status(200).json({ data: customers });
      break;
  }
}
