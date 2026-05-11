import { CanActivate, ExecutionContext } from '@nestjs/common';
import { SecurityService } from "../../../../security/security.service";
export declare class AuthGuard implements CanActivate {
    private readonly securityService;
    constructor(securityService: SecurityService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
