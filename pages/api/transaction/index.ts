import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../src/transaction/transaction.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { Transaction } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';
import _ from 'lodash';

interface TransactionsAPIRequest extends NextApiRequest {
  headers: {
    authorization: string;
  };
  body: Transaction;
  query: {
    startDate: Date;
    endDate: Date;
  };
}

const createTransactionValidator = initMiddleware(
  validateMiddleware(
    [
      check('transactionType').isString().isLength({ min: 2 }).exists(),
      check('cost').isNumeric().exists(),
      check('details').isString().optional(),
    ],
    validationResult
  )
);

export default async function handler(
  req: TransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'GET':
        const { authorization } = req.headers;
        conn = await connectDb();
        const transactions = await transactionService.getTransactions({
          access_token: authorization,
          startDate: req.query.startDate,
          endDate: req.query.endDate,
        });
        await conn.close();
        res.status(200).json({ data: transactions });
        break;

      case 'POST':
        // await createTransactionValidator(req, res);
        conn = await connectDb();
        const transactionPayload = req.body;
        const transaction = await transactionService.createTransaction(
          transactionPayload
        );
        await conn.close();

        res.status(200).json({ data: transaction });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
