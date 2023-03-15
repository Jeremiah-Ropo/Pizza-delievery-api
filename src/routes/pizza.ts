import {Container} from "typedi";
import {v2 as cloudinary} from "cloudinary"
import { CloudinaryStorage, Options } from "multer-storage-cloudinary";
import multer from "multer";

import PizzaController from "../controllers/pizza.controllers"
import UserController from "../controllers/user.controllers"

import {Router} from "express";

declare interface cloudinaryOptions extends Options{
    params: {
        folder: string;
    };
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure:true
})

const multerOpts: cloudinaryOptions = {
    cloudinary: cloudinary,
    params:{
        folder:"pizza"
    }
};

const storage = new CloudinaryStorage(multerOpts);
const upload = multer({storage: storage})

const pizzaController = Container.get(PizzaController);
const userController = Container.get(UserController);

const router = Router();

router.post("/", upload.single("image"), pizzaController.addPizza)
router.patch("/update/:id", upload.single("image"), pizzaController.update)
router.delete("/delete", pizzaController.delete)

router.post('/logOut', userController.logOut)


export default router