import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../src/transaction/transaction.service';
import connectDb from '../../../src/mongodb/connection';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface TruckDetailProps extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    truckId: string;
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: TruckDetailProps,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      const { authorization } = req.headers;
      const user = jwt.verify(
        authorization,
        process.env.SECRET_KEY
      ) as JwtPayload;

      conn = await connectDb();
      const transactions =
        await transactionService.getTruckTransactionsByTruckId(req.query);
      await conn.close();

      if (user.role === 'user') {
        transactions.forEach((transaction) => {
          transaction.sellingPrice = 0;
        });
      }

      res.status(200).json({ data: transactions });
      break;
  }
}
