import express from "express";
import cors from "cors";
import pino from "pino-http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import contactsRouter from "./routes/contactsRoutes.js";
import authRouter from "./routes/auth.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

dotenv.config();

const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());
    app.use(cookieParser());

    app.get("/", (req, res) => {
        res.send("Welcome to the Contacts API!");
    });

    app.use("/contacts", contactsRouter);
    app.use("/auth", authRouter);
    app.use("*", notFoundHandler);
    app.use(errorHandler);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

export default setupServer;
