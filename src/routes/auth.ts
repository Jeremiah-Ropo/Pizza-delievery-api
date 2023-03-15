import {Router} from 'express';
import { checkUserJwt, checkAdminJwt } from '../middleware/checkJwt';
import {Container} from 'typedi';

import UserController from '../controllers/user.controllers';

const router = Router();
const userController = Container.get(UserController);

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/login-admin', userController.loginAdmin)
router.patch('/update', checkUserJwt, userController.update)
router.delete('/delete', checkAdminJwt, userController.delete)

router.post('/logout', checkUserJwt, userController.logOut)
router.post('/place-order', checkUserJwt, userController.placeOrder)
router.post('/pay', checkUserJwt, userController.pay)

export default router;


