"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const routes_1 = __importDefault(require("./routes"));
// API 1
const app1 = (0, express_1.default)();
app1.use(express_1.default.json());
app1.use(routes_1.default);
app1.listen(3001, () => console.log('API 1 running on port 3001'));
// API 2
const app2 = (0, express_1.default)();
app2.use(express_1.default.json());
app2.use(routes_1.default);
app2.listen(3002, () => console.log('API 2 running on port 3002'));
// Load Balancer
const proxy = http_proxy_1.default.createProxyServer();
const targets = ['http://localhost:3001', 'http://localhost:3002'];
let current = 0;
const lb = (0, express_1.default)();
lb.use((req, res) => {
    const target = targets[current];
    current = (current + 1) % targets.length;
    proxy.web(req, res, { target });
});
lb.listen(9999, () => console.log('Load Balancer running on port 9999'));
