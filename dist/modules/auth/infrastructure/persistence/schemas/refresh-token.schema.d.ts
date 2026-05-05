import { Document, Types } from 'mongoose';
export declare class RefreshToken extends Document {
    userId: Types.ObjectId;
    jti: string;
    expiresAt: Date;
    isRevoked: boolean;
}
export declare const RefreshTokenSchema: import("mongoose").Schema<RefreshToken, import("mongoose").Model<RefreshToken, any, any, any, any, any, RefreshToken>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RefreshToken, Document<unknown, {}, RefreshToken, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    jti?: import("mongoose").SchemaDefinitionProperty<string, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    isRevoked?: import("mongoose").SchemaDefinitionProperty<boolean, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, RefreshToken>;
