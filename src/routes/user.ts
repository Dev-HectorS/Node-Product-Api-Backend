import { Router } from 'express';
import { check } from 'express-validator';

import { emailExists, userExists, rolExists } from '../helpers';

import { validateFields, validateJWT } from '../middlewares';

import { postUser, getUser, deleteUser, updateUser } from '../controllers/user';

const router = Router();

router.post('/', [
   check('email').custom(emailExists),
   check('username').custom(userExists),
   check('role').custom(rolExists),
   validateFields
], postUser);

router.get('/:id', validateJWT, getUser);

router.put('/', validateJWT, updateUser);

router.delete('/', validateJWT, deleteUser);

export default router;