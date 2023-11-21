"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.todoRoutes = void 0;
const express_1 = require("express");
exports.todoRoutes = (0, express_1.Router)();
exports.todoRoutes.get('/todo', (request, response) => {
    response.send('GET TODOS');
});
exports.todoRoutes.post('/todo', (request, response) => {
    response.send('POST TODOS');
});
exports.todoRoutes.put('/todo/:id', (request, response) => {
    response.send('PUT TODOS');
});
exports.todoRoutes.patch('/todo/:id', (request, response) => {
    response.send('PATCH TODOS');
});
exports.todoRoutes.delete('/todo/:id', (request, response) => {
    response.send('DELETE TODOS');
});
