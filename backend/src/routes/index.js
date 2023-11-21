"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const testRoute_1 = require("./testRoute");
const todos_1 = require("./todos");
exports.routes = express_1.default.Router();
exports.routes.use(testRoute_1.testRoutes);
exports.routes.use(todos_1.todoRoutes);
