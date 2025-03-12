import express from 'express'
import { createTicket, getAllTickets, getUserTickets, updateStatus } from '../controllers/ticket.controller.js';



const router = express.Router();


router.post('/create',createTicket);
router.get('/tickets',getAllTickets);
router.put('/update/:ticketId',updateStatus)
router.get('/tickets/:userId',getUserTickets)



export default router