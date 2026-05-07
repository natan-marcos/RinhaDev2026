const express = require('express');
const app = express();

const statusRoutes = require('./routes.js');

app.use(express.json());
app.use(statusRoutes);

const PORT = 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));