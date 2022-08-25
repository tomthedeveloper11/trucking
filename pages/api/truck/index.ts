import { NextApiRequest, NextApiResponse } from 'next';
import { check, validationResult } from 'express-validator';
import truckService from '../../../src/truck/truck.service';
import initMiddleware from '../../../src/middlewares/init-middleware';
import validateMiddleware from '../../../src/middlewares/validate-middleware';
import { Truck } from '../../../types/common';
import connectDb from '../../../src/mongodb/connection';

const createTruckValidator = initMiddleware(
  validateMiddleware(
    [
      check('name').isString().exists(),
      check('licenseNumber').isString().optional(),
    ],
    validationResult
  )
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let conn;
  switch (req.method) {
    case 'POST':
      await createTruckValidator(req, res);

      conn = await connectDb();
      const truckPayload = req.body as Truck;
      const truck = await truckService.createTruck(truckPayload);
      await conn.close();

      res.status(200).json({ data: truck });
      break;

    case 'GET':
      conn = await connectDb();
      const trucks = await truckService.getTrucks();
      await conn.close();
      res.status(200).json({ data: trucks });
      break;
  }
}
