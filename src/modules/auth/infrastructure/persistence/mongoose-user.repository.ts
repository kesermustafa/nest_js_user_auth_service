import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { Users } from './schemas/user.schema';
import { UpdateMeDto } from "../../application/dtos/update-me.dto";

@Injectable()
export class MongooseUserRepository implements IUserRepository {
    constructor(@InjectModel(Users.name) private userModel: Model<Users>) {
    }

    async update(userId: string, dto: UpdateMeDto): Promise<User | null> {

        const updatedDoc = await this.userModel
            .findByIdAndUpdate(
                userId,
                { $set: dto },
                {
                    returnDocument: 'after',
                    runValidators: true
                }
            )
            .exec();

        if (!updatedDoc) return null;

        return {
            id: updatedDoc._id.toString(),
            email: updatedDoc.email,
            password: updatedDoc.password,
            role: updatedDoc.role
        };
    }

    async create(user: Partial<User>): Promise<User> {
        const createdUser = new this.userModel(user);
        const saved = await createdUser.save();
        return { id: saved._id as unknown as string, email: saved.email, password: saved.password, role: saved.role };
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) return null;

        return {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            role: user.role
        };
    }


}