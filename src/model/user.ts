import { prop, getModelForClass, modelOptions, DocumentType, Ref } from '@typegoose/typegoose';

import { Order } from './order';
@modelOptions({
  schemaOptions: {
    versionKey: false,
    toJSON: {
      transform(doc: DocumentType<User>, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
})
class User {
  @prop({ nullable: true })
  firstName: string;

  @prop({ nullable: true })
  lastName: string;

  @prop({ nullable: true })
  streetAddress: string;

  @prop({ nullable: true })
  email: string;

  @prop({ nullable: true })
  password: string;

  @prop({ nullable: true })
  token: string;

  @prop({ref: "Order"})
  order: Ref<Order, any>[];

  @prop({ default: new Date().toUTCString() })
  createdAt: Date;
}

const UserModel = getModelForClass(User);

export { User, UserModel };
