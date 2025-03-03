import express from 'express';
import { getAllUsers,getUserByEmailId } from '../controllers/user.controller.js';


const router = express.Router();



router.get('/users',getAllUsers)
router.get('/:email',getUserByEmailId)





export default router