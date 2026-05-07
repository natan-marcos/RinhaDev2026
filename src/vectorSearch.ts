import { FraudRequest } from './Models/Request';
import { Normalization } from '../resources/normalization.json';

export async function vectorSearch(payload: FraudRequest): Promise<number> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = limitar(payload.transaction.amount, 'amount');

    return result;
  } catch (error) {
    console.error('Error during vector search:', error);
    throw error;
  }
}

function limitar(valor: number , campo: string): number {

    const Eq = valor / Normalization[campo];

    const clamped = Math.min(Math.max(Eq, 0.0), 1.0);

    return clamped;
}