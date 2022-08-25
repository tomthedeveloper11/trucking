import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../src/transaction/transaction.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { Transaction } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';
import _ from 'lodash';

interface TransactionsAPIRequest extends NextApiRequest {
  body: Transaction;
  query: {
    month: string;
    year: string;
    transactionId: string;
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
      case 'PUT':
        await createTransactionValidator(req, res);
        conn = await connectDb();
        const editTransactionPayload = req.body;
        const editTransaction = await transactionService.editTransaction(
          editTransactionPayload
        );
        await conn.close();

        res.status(200).json({ data: editTransaction, message: 'helllow' });
        break;

      case 'DELETE':
        conn = await connectDb();
        const { transactionId } = req.query;
        const transaction = await transactionService.deleteTransaction(
          transactionId
        );
        await conn.close();

        res.status(200).json({ data: transaction });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
