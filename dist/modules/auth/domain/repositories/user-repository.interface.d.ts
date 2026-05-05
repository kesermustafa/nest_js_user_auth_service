import { User } from '../entities/user.entity';
import { UpdateMeDto } from "../../application/dtos/update-me.dto";
export declare abstract class IUserRepository {
    abstract create(user: Partial<User>): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract update(userId: string, dto: UpdateMeDto): Promise<User | null>;
}
