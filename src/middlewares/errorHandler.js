import { isHttpError } from "http-errors";
import { MongooseError } from "mongoose";

export const errorHandler = (err, req, res) => {
    if (isHttpError(err)) {
        return res.status(err.status).json({
            status: err.status,
            message: err.message,
            name: err.name,
        });
    }

    if (err instanceof MongooseError) {
        return res.status(500).json({
            status: 500,
            message: err.message,
            name: "Mongoose error",
        });
    }

    res.status(500).json({
        status: 500,
        message: err.message || "Internal Server Error",
        name: "Internal server error",
    });
};
