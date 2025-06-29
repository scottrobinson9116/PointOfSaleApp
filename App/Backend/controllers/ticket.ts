import { Request, Response, NextFunction } from 'express';
import Ticket from "../models/ticket.js"

interface Ticket {
  dateCreated: object,
  orderItems: object[],
  orderNumber: string,
  totalPayment: number,
  status: string,
}

//Posts ticket to MongoDB
export async function postTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ticket = req.body;
    const newTicket: Ticket = await Ticket.create(ticket);
    res.send("Ticket is in queue").status(201);
  } catch (err) {
    console.log("Cannot Post Ticket");
    res.send("Cannot Post Ticket").status(404);
  }
}

//Gets all pending tickets
export async function getPendingTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pendingTickets: Ticket[] = await Ticket.find({ status: "pending" })
      res.send(pendingTickets).status(201)
  } catch(err) {
    console.log("Cannot Get Pending Tickets");
    res.send("Cannot Get Pending Tickets").status(404);
  }
}

export async function patchStatusComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.body.id
    await Ticket.findOneAndUpdate({orderNumber: id}, { $set: { status: "complete" } })
    const pendingTickets: Ticket[] = await Ticket.find({ status: "pending" })
    res.send(pendingTickets).status(201)
  } catch (err) {
    console.log("Cannot Change Status");
    res.send("Cannot Change Status").status(404);
  }
}

export async function patchStatusRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.body.idState
    await Ticket.findOneAndUpdate({ orderNumber: id }, { $set: { status: "refunded" } })
    const allTickets: Ticket[] = await Ticket.find()
    res.send(allTickets).status(201)
  } catch (err) {
    console.log("Cannot Change Status");
    res.send("Cannot Chnage Status").status(404);
  }
}

export async function patchStatusPending(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.body.idState
    await Ticket.findOneAndUpdate({ orderNumber: id }, { $set: { status: "pending" } })
    const allTickets: Ticket[] = await Ticket.find()
    res.send(allTickets).status(201)
  } catch (err) {
    console.log("Cannot Change Status");
    res.send("Cannot Chnage Status").status(404);
  }
}

export async function getAllTickets(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items: Ticket[] = await Ticket.find();
    res.send(items).status(201);
  } catch (err) {
    console.log("Cannot Get All Tickets");
    res.send("Cannot Get All Tickets").status(404);
  }
}