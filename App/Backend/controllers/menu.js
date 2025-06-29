import Menu from '../models/menu.js';
export default async function getAllItems(req, res, next) {
    try {
        const items = await Menu.find();
        res.send(items).status(201);
    }
    catch (err) {
        console.log("Cannot Fetch Menu Items");
        res.send("Cannot Fetch Menu Items").status(404);
    }
}
//# sourceMappingURL=menu.js.map