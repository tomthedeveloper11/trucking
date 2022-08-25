import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../../src/mongodb/connection';
import transactionService from '../../../src/transaction/transaction.service';
import _ from 'lodash';

interface PrintSummaryRequest extends NextApiRequest {
  query: {
    startDate: Date;
    endDate: Date;
  };
}

export default async function handler(
  req: PrintSummaryRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      try {
        conn = await connectDb();
        const pdf = await transactionService.printSummary(req.query);
        await conn.close();
        res.statusCode = 200;
        pdf.toBuffer((err, buffer) => {
          if (err) {
              console.log(err, '=== Error in print summary');
          }
          res.send(buffer);
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: _.get(err, 'message') });
      }
      break;
  }
}
