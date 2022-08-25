import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface customerDetailProps extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    customerId: string;
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: customerDetailProps,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        const { authorization } = req.headers;
        const user = jwt.verify(
          authorization,
          process.env.SECRET_KEY
        ) as JwtPayload;

        conn = await connectDb();

        const transactions =
          await transactionService.getTruckTransactionsByCustomerId({
            access_token: authorization,
            customerId: req.query.customerId,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
          });
        await conn.close();

        if (user.role === 'user') {
          transactions.forEach((transaction) => {
            transaction.sellingPrice = 0;
          });
        }

        res.status(200).json({ data: transactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
