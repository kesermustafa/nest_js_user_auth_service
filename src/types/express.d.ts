import { JwtPayload } from '../security/security.service';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export {};