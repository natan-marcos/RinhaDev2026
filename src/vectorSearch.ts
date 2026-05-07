import { FraudRequest } from './Models/Request';

export async function vectorSearch(payload: FraudRequest): Promise<number> {
  try {
    // TODO: implementar busca vetorial real
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return Math.random(); // placeholder: retorna score entre 0 e 1
  } catch (error) {
    console.error('Error during vector search:', error);
    throw error;
  }
}