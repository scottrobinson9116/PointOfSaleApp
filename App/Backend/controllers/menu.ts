import { Request, Response, NextFunction } from 'express';
import Menu from '../models/menu.js';

interface Item {
  name: string,
  price: number,
  type: string,
}

export default async function getAllItems(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items: Item[] = await Menu.find();
      res.send(items).status(201);
    } catch (err) {
      console.log("Cannot Fetch Menu Items");
      res.send("Cannot Fetch Menu Items").status(404)
    }
}