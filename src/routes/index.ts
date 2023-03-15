import {Router} from 'express';

import auth from './auth';
import pizza from './pizza';
import { checkAdminJwt } from '../middleware/checkJwt';


const router = Router();


router.use('/auth', auth);
router.use('/pizza', checkAdminJwt, pizza);



export default router;
