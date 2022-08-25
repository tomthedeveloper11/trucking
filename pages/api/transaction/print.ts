import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';
import _ from 'lodash';

interface PrintTransactionsAPIRequest extends NextApiRequest {
  body: {
    invoiceNum: string;
    transactionIds: string[];
    type: string;
    endDate: Date;
  };
}

export default async function handler(
  req: PrintTransactionsAPIRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      try {
        conn = await connectDb();
        const { invoiceNum, transactionIds, type, endDate } = req.body;
        const pdf = await transactionService.printTransaction(
          invoiceNum,
          transactionIds,
          type,
          endDate
        );
        try {
          res.statusCode = 200;
          pdf.toBuffer((err, buffer) => {
            if (err) {
              console.log(err, '=== Error in print');
            }
            res.send(buffer);
          });

          await transactionService.updatePrintStatus(transactionIds, type);
        } catch (err) {
          res.status(500).json({ message: _.get(err, 'message') });
        }
        await conn.close();
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: _.get(err, 'message') });
      }
      break;
  }
}
