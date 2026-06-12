"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPlaceholderUsersGateway = void 0;
const axios_1 = require("axios");
class JsonPlaceholderUsersGateway {
    async fetchAll() {
        const { data } = await axios_1.default.get('https://jsonplaceholder.typicode.com/users');
        return data;
    }
    fetchById(id) {
        return axios_1.default
            .get(`https://jsonplaceholder.typicode.com/users/${id}`)
            .then(({ data }) => data);
    }
}
exports.JsonPlaceholderUsersGateway = JsonPlaceholderUsersGateway;
//# sourceMappingURL=jsonplaceholder-users.gateway.js.map