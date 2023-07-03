import mysql from 'mysql2';

const dbConnection = () => {
   try {
      const connection = mysql.createConnection({
         host: process.env.MYSQL_HOST,
         port: parseInt(process.env.MYSQL_PORT!, 10),
         user: process.env.MYSQL_USER,
         password: process.env.MYSQL_PASSWORD,
         database: process.env.MYSQL_DATABASE,
      });

      return connection;
   } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to database'.red);
   }
}

export default dbConnection;