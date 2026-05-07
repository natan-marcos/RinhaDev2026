import { createReadStream } from 'fs';
import { createGunzip } from 'zlib';
import { resolve } from 'path';
import { FraudRequest } from './Models/Request';
import { normalizar } from './Limitar';

function euclideanDistance14D(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < 14; i++) {
        const diff = a[i] - b[i];
        sum += diff * diff;
    }
    return Math.sqrt(sum);
}

export async function vectorSearch(payload: FraudRequest): Promise<{ approved: boolean; fraud_score: number }> {
  try {
    const payloadVector = normalizar(payload);
    const filePath = resolve(__dirname, '../resources/references.json.gz');

    let nearest: any[] = [];
    let minDist = Infinity;

    await new Promise<void>((res, rej) => {
      const chunks: Buffer[] = [];

      createReadStream(filePath)
        .pipe(createGunzip())
        .on('data', (chunk: Buffer) => chunks.push(chunk))
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
  } catch (error) {
    console.error('Error during vector search:', error);
    throw error;
  }
}