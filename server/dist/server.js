"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const AuthRoute_1 = __importDefault(require("./routes/AuthRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
(0, mongodb_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ credentials: true }));
// API Endpoints
app.get('/', (req, res) => { });
app.use('/api/auth', AuthRoute_1.default);
app.use('/api/user', userRoute_1.default);
app.listen(port, () => console.log(`Server started on PORT : ${port}`));
