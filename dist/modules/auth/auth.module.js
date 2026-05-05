"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_controller_1 = require("./presentation/controllers/auth.controller");
const auth_service_1 = require("./application/services/auth.service");
const mongoose_user_repository_1 = require("./infrastructure/persistence/mongoose-user.repository");
const user_schema_1 = require("./infrastructure/persistence/schemas/user.schema");
const security_module_1 = require("../../security/security.module");
const refresh_token_schema_1 = require("./infrastructure/persistence/schemas/refresh-token.schema");
const mongoose_refresh_token_repository_1 = require("./infrastructure/persistence/mongoose-refresh-token.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.Users.name, schema: user_schema_1.UserSchema },
                { name: refresh_token_schema_1.RefreshToken.name, schema: refresh_token_schema_1.RefreshTokenSchema },
            ]),
            security_module_1.SecurityModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            {
                provide: 'IUserRepository',
                useClass: mongoose_user_repository_1.MongooseUserRepository
            },
            {
                provide: 'IRefreshTokenRepository',
                useClass: mongoose_refresh_token_repository_1.MongooseRefreshTokenRepository
            }
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map