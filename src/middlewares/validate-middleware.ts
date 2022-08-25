import {
  ResultFactory,
  ValidationChain,
  ValidationError,
} from 'express-validator';
import { NextApiRequest, NextApiResponse } from 'next';

export default function validateMiddleware(
  validations: ValidationChain[],
  validationResult: ResultFactory<ValidationError>
) {
  return async (req: NextApiRequest, res: NextApiResponse, next: any) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res
      .status(422)
      .json({ errors: errors.array(), message: 'Input tidak benar' });
  };
}
