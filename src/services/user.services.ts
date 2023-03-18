import { Request, Response, NextFunction } from "express";
import { OrderModel, PizzaModel, UserModel } from "../model";
import { Service } from "typedi";
import axios from 'axios';

import jwt from "jsonwebtoken"
import { CustomError } from "../utils/response/custom-error/CustomError";
import { createUserJwtToken, createAdminJwtToken } from "../utils/createJwtToken";

@Service()
class UserService {

    async register(payload: any, next: NextFunction) {
        try {
            const newUser = await UserModel.create({
                firstName: payload.firstName,
                lastName: payload.lastName,
                streetAddress: payload.streetAddress,
                email: payload.email,
                password: payload.password
            })
            delete newUser.password;
            return newUser;
        } catch (error) {
            return next(new CustomError(500, "Raw", "Can't create a user", null, error))
        }
    }

    async update(id: any, payload: any, next: NextFunction) {
        try {
            let user = await UserModel.findById(id);

            if (!user) {
                return next(new CustomError(400, "General", "User not allowed"))
            }

            const update = await UserModel.findByIdAndUpdate({ _id: user._id }, payload , { new: true });
            delete update.token;
            return update;
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't update", null, error))
        }
    }

    async login(payload: any, next: NextFunction) {
        try {
            let user = await UserModel.findOne({ email: payload.email, passsword: payload.password });
            if (!(user)) {
                return next(new CustomError(400, "General", "Invalid email or password"))
            }
            let payloadJwt = {
                id: user.id,
                email: user.email,
                role: "User"
            }

            let token = createUserJwtToken(payloadJwt);
            user.token = token;
            await user.save();

            let allPizza = await PizzaModel.find({}).sort({ _id: -1 })

            return { token: token, data: allPizza };
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't Login in", null, error))
        }
    }

    async logOut(id: any, next: NextFunction) {
        try {
            let user = await UserModel.findById({ _id: id });
            if (!(user)) {
                return next(new CustomError(403, "General", "Forbidden"))
            }

            user.token = `${user.token}+logout`;
            await user.save();

            return { message: "Logout Successfully" };
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't Login out", null, error))
        }
    }

    async loginAdmin(payload: any, next: NextFunction) {
        try {
            let user = await UserModel.findOne({ email: payload.email, passsword: payload.password });
            if (!(user)) {
                return next(new CustomError(400, "General", "Invalid email or password"))
            }
            let payloadJwt = {
                id: user.id,
                email: user.email,
                role: "Admin"
            }

            let token = createAdminJwtToken(payloadJwt);
            user.token = token;
            await user.save();

            return { message: "Successful login admin", token: token };
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't Login in", null, error))
        }
    }

    async placeOrder({ id }, payload: any, next: NextFunction) {
        try {
            const pizza = await PizzaModel.findById(payload.pizza)
            const user = await UserModel.findById(id)
            if (!user) {
                return next(new CustomError(400, "General", "User don't exist"))
            }
            const order = await OrderModel.create({
                pizza: pizza._id,
                user: user._id,
                quantity: payload.quantity
            })

            user.order.push(order._id);
            await user.save();
            return { message: "Added to cart" }
        } catch (error) {
            return next(new CustomError(400, "Raw", "Something went wrong", null, error))
        }
    }

    async pay({ id }, cart: any[], next: NextFunction) {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return next(new CustomError(400, "General", "User don't exist"))
            }

            let product = await Promise.all(
                cart.map(async (x) => {
                    const order = await OrderModel.findById(x);
                    
                    const pizza = await PizzaModel.findById(order.pizza)
                    return {
                        display_name: pizza.name,
                        variable_name: order._id,
                        value: order.quantity * (pizza.price * 100)
                    }
                })
            )
           
            product = product.filter((x) => {
                if (x === undefined) {
                    return false
                }
                return true
            });
            let total = 0;
            product.map((x) => {
                total += x.value;
            });

            const { data } = await axios.post(`https://api.paystack.co/transaction/initialize`,
                {
                    amount: total,
                    email: user.email,
                    metadata: product
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                        "Content-Type": 'application/json'
                    }
                })
                console.log(data)
            return { Payment_checkout_link: data.data.authorization_url }
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't create cart", null, error))
        }
    }



    async delete(id: any, next: NextFunction) {
        try {
            let user = await UserModel.findById(id);
            if (!user) {
                return next(new CustomError(400, "General", "User not allowed"))
            }

            await UserModel.findByIdAndDelete({ _id: user._id });
            return { message: "deleted" };
        } catch (error) {
            return next(new CustomError(400, "Raw", "Can't delete", null, error))
        }
    }
}

export default UserService;