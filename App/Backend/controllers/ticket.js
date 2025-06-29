import Ticket from "../models/ticket.js";
//Posts ticket to MongoDB
export async function postTicket(req, res, next) {
    try {
        const ticket = req.body;
        const newTicket = await Ticket.create(ticket);
        res.send("Ticket is in queue").status(201);
    }
    catch (err) {
        console.log("Cannot Post Ticket");
        res.send("Cannot Post Ticket").status(404);
    }
}
//Gets all pending tickets
export async function getPendingTickets(req, res, next) {
    try {
        const pendingTickets = await Ticket.find({ status: "pending" });
        res.send(pendingTickets).status(201);
    }
    catch (err) {
        console.log("Cannot Get Pending Tickets");
        res.send("Cannot Get Pending Tickets").status(404);
    }
}
export async function patchStatusComplete(req, res, next) {
    try {
        const id = req.body.id;
        await Ticket.findOneAndUpdate({ orderNumber: id }, { $set: { status: "complete" } });
        const pendingTickets = await Ticket.find({ status: "pending" });
        res.send(pendingTickets).status(201);
    }
    catch (err) {
        console.log("Cannot Change Status");
        res.send("Cannot Change Status").status(404);
    }
}
export async function patchStatusRefund(req, res, next) {
    try {
        const id = req.body.idState;
        await Ticket.findOneAndUpdate({ orderNumber: id }, { $set: { status: "refunded" } });
        const allTickets = await Ticket.find();
        res.send(allTickets).status(201);
    }
    catch (err) {
        console.log("Cannot Change Status");
        res.send("Cannot Chnage Status").status(404);
    }
}
export async function patchStatusPending(req, res, next) {
    try {
        const id = req.body.idState;
        await Ticket.findOneAndUpdate({ orderNumber: id }, { $set: { status: "pending" } });
        const allTickets = await Ticket.find();
        res.send(allTickets).status(201);
    }
    catch (err) {
        console.log("Cannot Change Status");
        res.send("Cannot Chnage Status").status(404);
    }
}
export async function getAllTickets(req, res, next) {
    try {
        const items = await Ticket.find();
        res.send(items).status(201);
    }
    catch (err) {
        console.log("Cannot Get All Tickets");
        res.send("Cannot Get All Tickets").status(404);
    }
}
//# sourceMappingURL=ticket.js.map