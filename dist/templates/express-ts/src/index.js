"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.get('/', (request, response) => {
    response.status(200).send('Hello World from server Express-TS');
});
app
    .listen(PORT, () => {
    console.log('Server running at PORT : ', PORT);
})
    .on('error', (error) => {
    throw new Error(error.message);
});
