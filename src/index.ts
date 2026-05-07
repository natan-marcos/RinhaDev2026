import express from 'express';
import httpProxy from 'http-proxy';
import routes from './routes';

// API 1
const app1 = express();
app1.use(express.json());
app1.use(routes);
app1.listen(3001, () => console.log('API 1 running on port 3001'));

// API 2
const app2 = express();
app2.use(express.json());
app2.use(routes);
app2.listen(3002, () => console.log('API 2 running on port 3002'));

// Load Balancer
const proxy = httpProxy.createProxyServer();
const targets = ['http://localhost:3001', 'http://localhost:3002'];
let current = 0;

const lb = express();
lb.use((req, res) => {
  const target = targets[current];
  current = (current + 1) % targets.length;
  proxy.web(req, res, { target });
});

lb.listen(9999, () => console.log('Load Balancer running on port 9999'));