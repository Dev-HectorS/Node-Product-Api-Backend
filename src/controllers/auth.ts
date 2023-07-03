import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import { generateJWT } from '../helpers';

import connection from '../database/config';

export const SignIn = async (req: Request, res: Response) => {
  const { username, password, auth } = req.body;

  try {
    const conn = await connection();
    conn.query('SELECT * FROM users u WHERE u.username = ?', username, async (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: res,
          ok: false
        })
      }

      if (results.length == 0) {
        return res.status(400).json({
          msg: 'Usuario / Contraseña no existe',
          ok: false
        })
      }

      const user = results[0];

      if (!user.isActive) {
        return res.status(400).json({
          msg: 'Usuario se encuentra inactivo',
          ok: false
        })
      }

      conn.query('SELECT * FROM roles r WHERE r.id = ?', user.role_id, async (err, results: any, fields) => {
        if (auth && results[0].name !== 'admin') {
          return res.status(400).json({
            msg: 'Permiso no autorizado',
            ok: false
          })
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
          return res.status(400).json({
            msg: 'Usuario o Contraseña no es valido',
            ok: false
          })
        }

        const { id, role_id, ...rest } = user;
        const token = await generateJWT(id);

        res.status(201).json({
          msg: 'Sesión iniciada correctamente',
          resultado: {
            token,
            user: {
              ...rest
            }
          },
          ok: true
        })
      })
    });
  } catch (error) {
    res.json({
      msg: 'Login Error',
      ok: false,
    })
  }
}

export const renewLogin = async (req: Request | any, res: Response) => {
  const { user_id } = req.user;

  const token = await generateJWT(user_id);

  try {
    const conn = await connection();
    conn.query('SELECT * FROM users u WHERE u.id = ?', user_id, async (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: res,
          ok: false
        })
      }

      const user = results[0];
      const { id, role_id, ...rest } = user;

      res.status(201).json({
        msg: 'Sesión renovada correctamente',
        resultado: {
          token,
          user: {
            ...rest
          }
        },
        ok: true,
      })
    })
  } catch (error) {
    res.json({
      msg: 'Login Error',
      ok: false,
    })
  }
}