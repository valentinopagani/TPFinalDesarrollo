"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('mailconfig', () => {
    const a = {
        transport: {
            tls: {
                rejectUnauthorized: false
            },
            host: process.env.MAIL_HOST || 'localhost',
            port: Number(process.env.MAIL_PORT) || 1025,
            secure: true,
            auth: process.env.MAIL_USER && process.env.MAIL_PASS
                ? {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
                : undefined,
        },
    };
    console.log(a);
    return a;
});
//# sourceMappingURL=mail.config.js.map