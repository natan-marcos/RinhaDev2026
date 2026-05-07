import { FraudRequest, Normalization } from './Models/Request';
import normalization from '../resources/normalization.json'; 
import
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



function limitar(valor: number, campo: string): number {
    const chave = TypetoKey[campo as keyof typeof TypetoKey];

    if (!chave) { throw new Error(`Campo desconhecido: ${campo}`); }

    const max = normalization[chave as keyof Normalization];
  return Math.min(Math.max(eq, 0.0), 1.0);
}