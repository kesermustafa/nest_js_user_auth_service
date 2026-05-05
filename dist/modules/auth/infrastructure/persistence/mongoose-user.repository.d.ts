import { Model } from 'mongoose';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { Users } from './schemas/user.schema';
import { UpdateMeDto } from "../../application/dtos/update-me.dto";
export declare class MongooseUserRepository implements IUserRepository {
    private userModel;
    constructor(userModel: Model<Users>);
    update(userId: string, dto: UpdateMeDto): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
