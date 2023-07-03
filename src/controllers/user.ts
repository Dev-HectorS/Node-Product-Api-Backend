import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';

import connection from '../database/config';

import { User } from '../interfaces';

import { generateJWT } from '../helpers';

export const postUser = async (req: Request, res: Response) => {
  const { role, password, ...user } = req.body;

  const newUser: User = { ...user, password, isActive: true, role_id: null };

  try {
    const conn = await connection();
    conn.query('SELECT * FROM roles r WHERE r.name = ?', role, async (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      newUser.role_id = results[0].id;

      const salt = bcryptjs.genSaltSync(10);
      newUser.password = bcryptjs.hashSync(password, salt);

      conn.query('INSERT INTO users SET ?', newUser, async (err, results: any, fields) => {
        if (err) {
          res.status(500).json({
            msg: 'Server error',
            resultado: err,
            ok: false
          })
        }

        const user_id = results.insertId
        const token = await generateJWT(user_id);

        const { role_id, ...reset } = newUser;

        res.status(200).json({
          msg: 'Usuario se ha registrado correctamente',
          resultado: {
            token,
            user: {
              id: user_id,
              ...reset
            }
          },
          ok: true
        });
      });
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conn = await connection();
    conn.query('SELECT * FROM users u WHERE u.id = ?', id, (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      if (results.length == 0) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      const user = results[0];

      res.json({
        resultado: {
          user: user
        },
        ok: true
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const updateUser = async (req: any, res: Response) => {
  const { id } = req.params;
  const updateUser: User = req.body;

  try {
    const conn = await connection();
    conn.query('UPDATE users SET ? WHERE id = ?', [updateUser, id], (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      res.json({
        msg: 'Información se actualizo correctamente',
        ok: true
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const deleteUser = async (req: any, res: Response) => {
  const { user_id } = req.user;

  try {
    const conn = await connection();
    conn.query('DELETE FROM users u WHERE u.id = ?', user_id, (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      res.json({
        msg: 'Cuenta eliminada correctamente',
        ok: true
      });
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}