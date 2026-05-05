import { Document } from 'mongoose';
import { Role } from "../../../domain/enums/role.enum";
export declare class Users extends Document {
    email: string;
    password: string;
    role: Role;
}
export declare const UserSchema: import("mongoose").Schema<Users, import("mongoose").Model<Users, any, any, any, any, any, Users>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Users, Document<unknown, {}, Users, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Users & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, Users, Document<unknown, {}, Users, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Users & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, Users, Document<unknown, {}, Users, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Users & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    password?: import("mongoose").SchemaDefinitionProperty<string, Users, Document<unknown, {}, Users, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Users & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    role?: import("mongoose").SchemaDefinitionProperty<Role, Users, Document<unknown, {}, Users, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Users & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Users>;
