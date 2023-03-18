import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";

import PizzaService from "../services/pizza.services";

@Service()
class PizzaController {
    constructor(
        private readonly pizzaService : PizzaService
    ){}

    addPizza = async(req:Request, res:Response, next:NextFunction) => {
        try{
            console.log(req.file.path)
            res.customSuccess(200, await this.pizzaService.addPizza(req.body, req.file.path, next));
        }catch{
            next()
        }
    }


    update = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.pizzaService.update(req.params.id, req.body, req.file.path, next));
        }catch{
            next()
        }
    }

    all = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.pizzaService.all(next));
        }catch{
            next()
        }
    }

    delete = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.pizzaService.delete(req.jwtPayload.id, next));
        }catch{
            next()
        }
    }
}

export default PizzaController;