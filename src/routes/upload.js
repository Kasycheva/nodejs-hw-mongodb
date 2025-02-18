import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/uploadController.js";

const uploadRouter = Router()
const upload = multer({dest:"uploads/"})

uploadRouter.post("/avatar", upload.single("avatar"), uploadController)

export default uploadRouter