import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import connection from '../database/config';

const validateJWT = async (req: Request | any, res: Response, next: NextFunction) => {
   const token = req.header('x-token');
   if (!token) {
      return res.status(401).json({
         msg: 'Acceso no autorizado',
         ok: false
      })
   }

   try {
      const { user_id }: any = jwt.verify(token, process.env.PRIVATEKEY!);

      const conn = connection();
      conn.query('SELECT u.id FROM users u WHERE u.id = ?', user_id, (err, results: any, fields) => {

         if (err) {
            res.status(500).json({
               msg: 'Server error',
               resultado: err,
               ok: false
            })
         }

         if (results.length == 0) {
            return res.status(401).json({
               msg: 'Acceso no autorizado',
               resultado: err,
               ok: false
            })
         }

         req.user = { user_id: results[0].id };

         next();
      });
   } catch (error) {
      console.log(error);
      res.status(401).json({
         msg: 'Token not valid',
         ok: false
      })
   }
}

export {
   validateJWT
}