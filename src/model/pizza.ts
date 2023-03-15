import {prop, getModelForClass, modelOptions, DocumentType} from "@typegoose/typegoose"

@modelOptions({
    schemaOptions:{
        versionKey:false,
        toJSON: {
            transform(doc: DocumentType<Pizza>, ret, options) {
                ret.id = ret._id,
                delete ret._id
            },
        }
    }
})

class Pizza {
    @prop()
    name:string;

    @prop()
    size:string;

    @prop()
    price:number;

    @prop()
    image:string;

    @prop({default:new Date().toISOString()})
    createdAt: string;

}

const PizzaModel = getModelForClass(Pizza);

export {Pizza, PizzaModel}