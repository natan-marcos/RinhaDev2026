"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vectorSearch_1 = require("./vectorSearch");
const router = (0, express_1.Router)();
router.get('/ready', (_req, res) => {
    res.status(200).json({ ready: true });
});
router.post('/fraud-score', async (req, res) => {
    try {
        const payload = req.body;
        const result = await (0, vectorSearch_1.vectorSearch)(payload);
        res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Erro desconhecido';
        res.status(500).json({ error: message });
    }
});
exports.default = router;
