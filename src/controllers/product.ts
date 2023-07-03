import { Request, Response } from 'express';

import connection from '../database/config';
import { Product } from '../interfaces';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const conn = await connection();
    conn.query('SELECT * FROM products', (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      res.status(200).json({
        msg: 'Listado obtenido exitosamente',
        resultado: {
          products: results,
        },
        ok: true
      })
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const postProduct = async (req: Request, res: Response) => {
  const newProduct: Product = req.body;

  try {
    const conn = await connection();
    conn.query('INSERT INTO products SET ?', newProduct, (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      res.status(200).json({
        msg: 'Listado se ha registrado correctamente',
        resultado: {
          product: {
            id: results.insertId,
            ...newProduct
          }
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

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conn = await connection();
    conn.query('SELECT * FROM products p WHERE p.id = ?', id, (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      const product = results[0];

      res.status(200).json({
        msg: 'Lista obtenida exitosamente',
        resultado: {
          product
        },
        ok: true
      })
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateList: Product = req.body;

  try {
    const conn = await connection();
    conn.query('UPDATE products SET ? WHERE id = ?', [updateList, id], (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      res.status(200).json({
        msg: 'Product fue actualizado',
        ok: true
      })
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const conn = await connection();
    conn.query('DELETE FROM products p WHERE p.id = ?', id, (err, results: any, fields) => {
      if (err) {
        res.status(500).json({
          msg: 'Server error',
          resultado: err,
          ok: false
        })
      }

      const product = results[0];

      res.status(200).json({
        msg: 'Lista fue eliminada',
        resultado: {
          product
        },
        ok: true
      })
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      resultado: error,
      ok: false
    })
  }
}