import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Role} from "../../../domain/enums/role.enum";

@Schema({ timestamps: true })
export class Users extends Document {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: Role, default: Role.USER })
    role: Role;

}
export const UserSchema = SchemaFactory.createForClass(Users);