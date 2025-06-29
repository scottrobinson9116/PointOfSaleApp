import express from "express";
import getAllItems from '../controllers/menu.js'

const router = express.Router();

//Retrieves all foods and beverages to display on the menu screen
router.get('/items', getAllItems);

export default router;