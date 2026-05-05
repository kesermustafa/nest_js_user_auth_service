import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RefreshToken extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    jti: string;

    @Prop({ required: true, expires: 0 })
    expiresAt: Date;

    @Prop({ default: false })
    isRevoked: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);