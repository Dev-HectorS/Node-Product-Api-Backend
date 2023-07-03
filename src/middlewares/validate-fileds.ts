import { NextFunction, Request, Response } from 'express';
import { Result, validationResult } from 'express-validator';

const validateFields = (req: Request | any, res: Response, next: NextFunction) => {
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      const { msg } = errors.array({ onlyFirstError: true })[0];
      return res.status(400).json({
         msg,
         ok: false
      });
   }
   next();
}

export {
   validateFields
}