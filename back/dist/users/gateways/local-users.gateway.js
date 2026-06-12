"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalUsersGateway = void 0;
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
class LocalUsersGateway {
    users;
    constructor() {
        const filePath = path.join(__dirname, '../data/users.json');
        const file = fs.readFileSync(filePath, 'utf-8');
        this.users = JSON.parse(file);
    }
    async fetchAll() {
        return this.users;
    }
    async fetchById(id) {
        const user = this.users.find((u) => u.id === id);
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
}
exports.LocalUsersGateway = LocalUsersGateway;
//# sourceMappingURL=local-users.gateway.js.map