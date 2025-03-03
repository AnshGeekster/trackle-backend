import express from 'express'
import { createTicket, getAllTickets, updateStatus } from '../controllers/ticket.controller.js';



const router = express.Router();


router.post('/create',createTicket);
router.get('/tickets',getAllTickets);
router.patch('/update/:ticketId',updateStatus)



export default router