import express from "express";
import { postTicket, getPendingTickets, patchStatusComplete, patchStatusRefund, getAllTickets, patchStatusPending } from "../controllers/ticket.js";
const router = express.Router();
//Creates a new ticket entry
router.post('/newticket', postTicket);
//Gets all pending orders
router.get('/pendingtickets', getPendingTickets);
//Gets all tickets in MongoDB
router.get('/all', getAllTickets);
//Sets a ticket to complete
router.patch('/status/complete', patchStatusComplete);
//Sets a ticket to refund
router.patch('/status/refund', patchStatusRefund);
//Sets a ticket to pending
router.patch('/status/pendingOrder', patchStatusPending);
export default router;
//# sourceMappingURL=ticketsRoutes.js.map