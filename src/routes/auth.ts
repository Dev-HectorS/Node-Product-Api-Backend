import { Router } from 'express';
import { check } from 'express-validator';

import { SignIn, renewLogin } from '../controllers/auth';

import { validateFields, validateJWT } from '../middlewares';

const router = Router();

router.post('/auth/sign-in', [
  check('username', 'Usuario es requerido').not().isEmpty(),
  check('password', 'Contraseña es requerido').not().isEmpty(),
  validateFields
], SignIn);

router.get('/auth/renew', validateJWT, renewLogin)

export default router;