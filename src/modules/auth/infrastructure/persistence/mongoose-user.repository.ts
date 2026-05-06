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
            .lean()
            .exec();

        if (!updatedDoc) return null;

        return { ...updatedDoc, id: updatedDoc._id.toString() } as User;
    }

    async create(user: Partial<User>): Promise<User> {
        const createdUser = new this.userModel(user);
        const saved = await createdUser.save();
        const plainObject = saved.toObject();
        return { ...plainObject, id: plainObject._id.toString() } as User;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.userModel.findOne({ email }).lean().exec();
        if (!user) return null;
        return { ...user, id: user._id.toString() } as User;
    }
}
