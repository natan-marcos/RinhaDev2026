const payloads = require('../example-payloads.json');
const TARGET_URL = 'http://localhost:9999/fraud-score';
const DELAY_MS = 500;
const TOTAL_REQUESTS: number = 20;

function getRandomPayload(): any {
  const base = payloads[Math.floor(Math.random() * payloads.length)] as any;
  return {
    ...base,
    id: `tx-${Math.floor(Math.random() * 9_999_999_999)}`,
    transaction: {
      ...base.transaction,
      requested_at: new Date().toISOString(),
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendRequest(index: number): Promise<void> {
  const payload = getRandomPayload();
  try {
    const res = await fetch(TARGET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json() as Record<string, unknown>;
    console.log(`[${index}] ✓ ${res.status} | id: ${payload.id} | result:`, data['result'] ?? data);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${index}] ✗ Erro:`, message);
  }
}

async function run(): Promise<void> {
  console.log(`🤖 Bot iniciado → ${TARGET_URL}`);
  console.log(`📦 Payloads disponíveis: ${payloads.length}`);
  console.log(`🔁 Requests: ${TOTAL_REQUESTS === 0 ? '∞' : TOTAL_REQUESTS} | Delay: ${DELAY_MS}ms\n`);

  let i = 1;
  while (TOTAL_REQUESTS === 0 || i <= TOTAL_REQUESTS) {
    await sendRequest(i);
    await sleep(DELAY_MS);
    i++;
  }

  console.log('✅ Bot finalizado.');
}

run();