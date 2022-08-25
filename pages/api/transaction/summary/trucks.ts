import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface TransactionSummaryRequest extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: TransactionSummaryRequest,
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
        const truckTransactions =
          await transactionService.getGroupedTruckTransactions({
            access_token: authorization,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
          });
        await conn.close();

        // if (user?.role === 'user'){
        //  TODO: delete selling price sama margin
        // }

        res.status(200).json({ data: truckTransactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
