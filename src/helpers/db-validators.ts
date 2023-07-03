import connection from '../database/config';

const emailExists = async (email: string) => {
   const conn = connection();
   const emailExists = await conn.promise().query('SELECT * FROM users u WHERE u.email = ?', email);
   if ((emailExists[0] as Array<{}>).length != 0) {
      throw new Error(`El correo ${email} ya existe, intente otro`);
   }
}

const userExists = async (username: string) => {
   const conn = connection();
   const usuarioExists = await conn.promise().query('SELECT * FROM users u WHERE u.username = ?', username);
   if ((usuarioExists[0] as Array<{}>).length != 0) {
      throw new Error(`El usuario ${username} ya existe, intente otro`);
   }
}

const rolExists = async (role: string) => {
   const conn = connection();
   const rolExists = await conn.promise().query('SELECT * FROM roles r WHERE r.name = ?', role);
   if ((rolExists[0] as Array<{}>).length == 0) {
      throw new Error(`Permiso no autorizado`);
   }
}

export {
   emailExists,
   userExists,
   rolExists
};