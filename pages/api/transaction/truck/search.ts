import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../../src/transaction/transaction.service';
import initMiddleware from '../../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../../src/middlewares/validate-middleware';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';

interface SearchTruckTransactionsAPIRequest extends NextApiRequest {
  query: {
    customer: string;
    startDate?: string;
    endDate?: string;
    containerNo?: string;
    invoiceNo?: string;
    destination?: string;
  };
}

const searchTruckTransactionValidator = initMiddleware(
  validateMiddleware(
    [check('customer').isString().isLength({ min: 2 }).exists()],
    validationResult
  )
);

export default async function handler(
  req: SearchTruckTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        await searchTruckTransactionValidator(req, res);
        conn = await connectDb();
        const truckTransactions =
          await transactionService.filterTruckTransactions(req.query);
        await conn.close();
        res.status(200).json({ data: truckTransactions });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
