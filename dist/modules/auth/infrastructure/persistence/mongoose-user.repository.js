"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseUserRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let MongooseUserRepository = class MongooseUserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async update(userId, dto) {
        const updatedDoc = await this.userModel
            .findByIdAndUpdate(userId, { $set: dto }, {
            returnDocument: 'after',
            runValidators: true
        })
            .exec();
        if (!updatedDoc)
            return null;
        return {
            id: updatedDoc._id.toString(),
            email: updatedDoc.email,
            password: updatedDoc.password,
            role: updatedDoc.role
        };
    }
    async create(user) {
        const createdUser = new this.userModel(user);
        const saved = await createdUser.save();
        return { id: saved._id, email: saved.email, password: saved.password, role: saved.role };
    }
    async findByEmail(email) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user)
            return null;
        return {
            id: user._id.toString(),
            email: user.email,
            password: user.password,
            role: user.role
        };
    }
};
exports.MongooseUserRepository = MongooseUserRepository;
exports.MongooseUserRepository = MongooseUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.Users.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MongooseUserRepository);
//# sourceMappingURL=mongoose-user.repository.js.map