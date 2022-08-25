import { NextApiRequest, NextApiResponse } from 'next';
import customerService from '../../../src/customer/customer.service';
import connectDb from '../../../src/mongodb/connection';

interface CustomerDetailProps extends NextApiRequest {
  query: {
    customerId: string;
  };
}

export default async function handler(
  req: CustomerDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      conn = await connectDb();

      const customerId = req.query.customerId;
      const customer = await customerService.getCustomerByCustomerId(
        customerId
      );
      await conn.close();
      res.status(200).json({ data: customer });
      break;
  }
}
