import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../../src/transaction/transaction.service';
import initMiddleware from '../../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../../src/middlewares/validate-middleware';
import { TruckTransaction } from '../../../../types/common';
import connectDb from '../../../../src/mongodb/connection';
import _ from 'lodash';

interface TruckTransactionsAPIRequest extends NextApiRequest {
  body: TruckTransaction;
  query: {
    transactionId: string;
  };
}

const createTruckTransactionValidator = initMiddleware(
  validateMiddleware(
    [
      check('truckId').isString().isLength({ min: 2 }).exists(),
      check('transactionType').isString().isLength({ min: 2 }).exists(),
      check('cost').isNumeric().exists(),
      check('invoiceNo').isString().isLength({ min: 2 }).exists(),
      check('containerNo').isString().isLength({ min: 2 }).exists(),
      check('customer').isString().isLength({ min: 2 }).exists(),
      check('destination').isString().isLength({ min: 2 }).exists(),
      check('sellingPrice').isNumeric().optional(),
      check('bon').isString().optional(),
      check('details').isString().optional(),
    ],
    validationResult
  )
);

export default async function handler(
  req: TruckTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        conn = await connectDb();
        const truckTransactions =
          await transactionService.getTruckTransactions();
        await conn.close();
        res.status(200).json({ data: truckTransactions });
        break;

      case 'POST':
        await createTruckTransactionValidator(req, res);

        conn = await connectDb();
        const truckTransactionPayload = req.body;
        const truckTransaction =
          await transactionService.createTruckTransaction(
            truckTransactionPayload
          );
        await conn.close();

        res.status(200).json({ data: truckTransaction });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
