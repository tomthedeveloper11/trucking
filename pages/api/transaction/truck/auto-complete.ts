import { NextApiRequest, NextApiResponse } from 'next';
import transactionService from '../../../../src/transaction/transaction.service';
import connectDb from '../../../../src/mongodb/connection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'GET':
      conn = await connectDb();
      const autoCompleteData =
        await transactionService.getTruckTransactionAutoComplete();
      await conn.close();
      res.status(200).json({ data: autoCompleteData });
      break;
  }
}
