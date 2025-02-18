import express from "express";
import pino from "pino-http";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import contactsRouter from "./routes/contactsRoutes.js";
import authRouter from "./routes/auth.js";
import uploadRouter from "./routes/upload.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";

dotenv.config();

const setupServer = async () => {
    await createDirIfNotExists("./temp");

    const app = express();

    app.use(cors());
    app.use(pino());
    app.use(express.json());
    app.use(cookieParser());
    app.use("/contacts", contactsRouter);
    app.use("/auth", authRouter);
    app.use("/upload", uploadRouter);
    app.use("*", notFoundHandler);
    app.use(errorHandler);

    app.get("/", (req, res) => {
        res.send("Welcome to the Contacts API!");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

export default setupServer;
