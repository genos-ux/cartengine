"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const prisma_1 = require("./generated/prisma");
const errors_1 = require("./middlewares/errors");
const passport_1 = __importDefault(require("./config/passport"));
const secrets_1 = require("./config/secrets");
require("./config/googleStrategy");
require("./config/discordStrategy");
const arcjet_1 = require("./middlewares/arcjet");
const app = (0, express_1.default)();
const { PORT } = secrets_1.envDetails;
app.use(express_1.default.json());
app.use(errors_1.errorMiddleware);
app.use(passport_1.default.initialize());
// apply arcjet rate-limit to all routes
app.use(arcjet_1.arcjetMiddleware);
app.use("/api", routes_1.default);
exports.prismaClient = new prisma_1.PrismaClient({
    log: ["query"],
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true,
                },
                compute: (addr) => {
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`;
                },
            },
        },
    },
});
app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
