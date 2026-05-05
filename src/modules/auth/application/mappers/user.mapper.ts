import { User } from '../../domain/entities/user.entity';

export class UserMapper {
    static toResponse(user: User) {
        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }
}