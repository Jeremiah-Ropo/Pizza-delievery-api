import {prop, getModelForClass, modelOptions, DocumentType, Ref} from "@typegoose/typegoose"
import { Pizza } from "./pizza"
import { User } from "./user"


let Enums = {
    orderPlaced : "order_placed",
    notPlaced: "notPlaced"
}
@modelOptions({
    schemaOptions:{
        versionKey:false,
        toJSON: {
            transform(doc: DocumentType<Order>, ret, options) {
                ret.id = ret._id,
                delete ret._id
            },
        }
    }
})


class Order {

    @prop({ref: "Pizza"})
    pizza:Ref<Pizza>

    @prop({ref: "User"})
    user: Ref<User>

    @prop()
    quantity: number;

    @prop()
    paymentStatus:boolean;

    @prop({default:"order_placed",enums: Enums})
    status:string;

    @prop({default: new Date().toUTCString()})
    createdAt:string;
}

const OrderModel = getModelForClass(Order);

export {Order, OrderModel};


