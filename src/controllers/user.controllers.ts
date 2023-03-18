import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";

import UserService from "../services/user.services";

@Service()
class UserController {
    constructor(
        private readonly userService : UserService
    ){}

    register = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.register(req.body, next));
        }catch{
            next()
        }
    }

    login = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.login(req.body, next));
        }catch{
            next()
        }
    }

    loginAdmin = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.loginAdmin(req.body, next));
        }catch{
            next()
        }
    }


    placeOrder = async(req:Request, res:Response, next:NextFunction) => {
        try{
            console.log(req.body)
            res.customSuccess(200, await this.userService.placeOrder(req.jwtPayload, req.body, next));
        }catch{
            next()
        }
    }

    pay = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.pay(req.jwtPayload, req.body.cart, next));
        }catch{
            next()
        }
    }

    all = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.all(next));
        }catch{
            next()
        }
    }

    logOut = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.logOut(req.jwtPayload.id, next));
        }catch{
            next()
        }
    }

    update = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.update(req.jwtPayload.id, req.body, next));
        }catch{
            next()
        }
    }

    delete = async(req:Request, res:Response, next:NextFunction) => {
        try{
            res.customSuccess(200, await this.userService.delete(req.jwtPayload.id, next));
        }catch{
            next()
        }
    }
}

export default UserController;