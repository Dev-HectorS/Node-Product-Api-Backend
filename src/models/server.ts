import express, { Application } from 'express';
import cors from 'cors';
import 'colors';

import dbConnection from '../database/config';

import { authRoutes, userRoutes, productRoutes } from '../routes';

class Server {
   private app: Application;
   private port: string;
   private pathUsers = '/api/v1/users';
   private pathProducts = '/api/v1/products';

   constructor() {
      this.app = express();
      this.port = process.env.PORT || '8080';

      // -> Connection to db
      this.connectDB();

      // -> Middlewares
      this.middlewares();

      // -> Routes
      this.routes();
   }

   async connectDB() {
      try {
         await dbConnection().connect((err: any) => {
            if (err) { return console.error('Failed to connect to database'.red) };
            console.log('Database:', 'online'.cyan);
         });
      } catch (error) {
         throw new Error('Failed to connect to database'.red);
      }
   }

   middlewares() {
      // Cors
      this.app.use(cors());

      // Express parse
      this.app.use(express.json());
   }

   routes() {
      this.app.use(this.pathUsers, authRoutes);
      this.app.use(this.pathUsers, userRoutes);
      this.app.use(this.pathProducts, productRoutes);
   }

   listen() {
      this.app.listen(this.port, () => {
         console.log(`Express server running on port: ${this.port.cyan}`);
      })
   }
}

export default Server;