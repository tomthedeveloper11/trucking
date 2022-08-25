import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import transactionService from '../../../../../src/transaction/transaction.service';
import initMiddleware from '../../../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../../../src/middlewares/validate-middleware';
import { AdditionalTruckTransaction } from '../../../../../types/common';
import connectDb from '../../../../../src/mongodb/connection';
import _ from 'lodash';

interface AdditionalTruckTransactionsAPIRequest extends NextApiRequest {
  body: AdditionalTruckTransaction;
  query: {
    transactionId: string;
  };
}
const createAdditionalTruckTransactionValidator = initMiddleware(
  validateMiddleware(
    [
      check('truckId').isString().isLength({ min: 2 }).exists(),
      check('transactionType').isString().isLength({ min: 2 }).exists(),
      check('cost').isNumeric().exists(),
      check('details').isString().optional(),
    ],
    validationResult
  )
);

export default async function handler(
  req: AdditionalTruckTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  try {
    switch (req.method) {
      case 'PUT':
        await createAdditionalTruckTransactionValidator(req, res);
        conn = await connectDb();
        const editAdditionalTruckTransactionPayload = req.body;
        const editAdditionalTruckTransaction =
          await transactionService.editAdditionalTruckTransaction(
            editAdditionalTruckTransactionPayload
          );
        await conn.close();

        res
          .status(200)
          .json({ data: editAdditionalTruckTransaction, message: 'helllow' });
        break;
    }
  } catch (error) {
    res.status(500).json({ message: _.get(error, 'message') });
  }
}
