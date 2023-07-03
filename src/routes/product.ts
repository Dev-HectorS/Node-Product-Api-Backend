import { Router } from 'express';

import { validateJWT } from '../middlewares';

import { getProducts, postProduct, getProduct, updateProduct, deleteProduct } from '../controllers/product';

const router = Router();

router.get('/', validateJWT, getProducts);

router.post('/', validateJWT, postProduct);

router.get('/:id', validateJWT, getProduct);

router.put('/:id', validateJWT, updateProduct);

router.delete('/:id', validateJWT, deleteProduct);

export default router;