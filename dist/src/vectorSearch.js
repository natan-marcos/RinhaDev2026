"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorSearch = vectorSearch;
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const path_1 = require("path");
const Limitar_1 = require("./Limitar");
function euclideanDistance14D(a, b) {
    let sum = 0;
    for (let i = 0; i < 14; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}
async function vectorSearch(payload) {
    try {
        const payloadVector = (0, Limitar_1.normalizar)(payload);
        const filePath = (0, path_1.resolve)(__dirname, '../resources/references.json.gz');
        let nearest = [];
        let minDist = Infinity;
        await new Promise((res, rej) => {
            const chunks = [];
            (0, fs_1.createReadStream)(filePath)
                .pipe((0, zlib_1.createGunzip)())
                .on('data', (chunk) => chunks.push(chunk))
                .on('end', () => {
                const data = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
                for (const item of data) {
                    const dist = euclideanDistance14D(payloadVector, item.vector);
                    nearest.push({ ...item, distance: dist });
                }
                nearest.sort((a, b) => a.distance - b.distance);
                nearest = nearest.slice(0, 3);
                res();
            })
                .on('error', rej);
        });
        const fraudCount = nearest.filter((item) => item.label === 'fraud').length;
        const fraudScore = fraudCount / 3;
        return {
            approved: fraudScore < 0.6,
            fraud_score: fraudScore,
        };
    }
    catch (error) {
        console.error('Error during vector search:', error);
        throw error;
    }
}
