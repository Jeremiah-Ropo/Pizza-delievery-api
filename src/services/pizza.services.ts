import { Request, Response, NextFunction } from "express";
import { PizzaModel, UserModel } from "../model";
import { Service } from "typedi";

import { CustomError } from "../utils/response/custom-error/CustomError";


@Service()
class PizzaService {

    async addPizza(payload: any, image:any, next: NextFunction) {
        try {
            
            const newPizza = await PizzaModel.create({
                name: payload.name,
                size: payload.size,
                price: payload.price,
                image: image
            })

            return newPizza;
        } catch (error) {
            return next(new CustomError(500, "Raw", "Can't create a user", null, error))
        }
    }

    async all(next: NextFunction) {
        try {
            let pizzas = await PizzaModel.find({});
           
            return { data: pizzas};
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't Fetch", null, error))
        }
    }

    async update(id: any, payload: any, image:any, next: NextFunction) {
        try {
            let pizza = await PizzaModel.findById(id);

            if (!pizza) {
                return next(new CustomError(400, "General", "Pizza type don't exist"))
            }

            const update = await PizzaModel.findByIdAndUpdate({ _id: pizza._id }, { 
                name: payload.name,
                size:payload.size,
                price:payload.price,
                image: image
             }, { new: true });
            return update;
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't update"))
        }
    }

    async delete(id: any, next: NextFunction) {
        try {
            let pizza = await PizzaModel.findById(id);
            if (!pizza) {
                return next(new CustomError(400, "General", "Pizza with this Id don't exist"))
            }

            await PizzaModel.findByIdAndDelete({ _id: pizza._id });
            return { message: "deleted" };
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't delete"))
        }
    }
}

export default PizzaService;