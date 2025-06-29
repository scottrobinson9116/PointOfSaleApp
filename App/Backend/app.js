import express from 'express';
import menuRoutes from "./routes/menuRoutes.js";
import ticketsRoutes from "./routes/ticketsRoutes.js";
import mongoose from 'mongoose';
const app = express();
//Allow CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', "GET,POST,PUT,PATCH,DELETE");
    res.setHeader('Access-Control-Allow-Headers', "Content-Type, Authorization");
    next();
});
//Middleware registration
app.use("/menu", express.json(), menuRoutes);
app.use("/tickets", express.json(), ticketsRoutes);
//Creates MongoDB Connection
async function startServer() { }
try {
    await mongoose.connect("mongodb+srv://scottrobinson9116:Farlo234*@libredb.jcbgvek.mongodb.net/posDB?retryWrites=true&w=majority&appName=LibreDB");
    app.listen(2001);
}
catch (err) {
    console.log("MongoDB connection failed");
    process.exit(1);
}
startServer();
//# sourceMappingURL=app.js.map