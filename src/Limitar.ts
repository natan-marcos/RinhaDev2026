import normalization from '../resources/normalization.json';
import mccRisk from '../resources/mcc-risk.json';
import { FraudRequest, Merchant } from './Models/Request';

function limitar(valor: number, max: number): number {
    return Math.min(Math.max(valor/max, 0.0), 1.0);
}

function hora(timestamp: string): number {
    return new Date(timestamp).getUTCHours() / 23.0;
}

function DiaDaSemana(timestamp: string): number {
    return new Date(timestamp).getUTCDay() / 6.0;
}

function minutosDesdeUltima(timestamp: string, requestAt: string): number {
    const diff = (new Date(requestAt).getTime() - new Date(timestamp).getTime()) / 60000;
    return diff;
}

export function normalizar(payload: FraudRequest): number[] {
    const {transaction, customer, merchant, terminal, last_transaction} = payload;
    const n = normalization;
    return[
        //0 - amount
        limitar(transaction.amount, n.max_amount),
    
        //1 - installments
        limitar(transaction.installments, n.max_installments),

        //2 - amount_vs_avg
        limitar((transaction.amount / customer.avg_amount) / n.amount_vs_avg_ratio, 1.0),

        //3 - hour_of_day
        hora(transaction.requested_at),

        //4 - day_of_week
        DiaDaSemana(transaction.requested_at),

        //5 - minutes_since_last_tx
        last_transaction ? limitar(minutosDesdeUltima(last_transaction.timestamp, transaction.requested_at), n.max_minutes) : -1.0,

        //6 - km_from_last_tx
        last_transaction ? limitar(last_transaction.km_from_current, n.max_km) : -1.0,
        //7 - km_from_home
        limitar(terminal.km_from_home, n.max_km),
        //8 - tx_count_24h
        limitar(customer.tx_count_24h, n.max_tx_count_24h),
        //9 - is_online
        terminal.is_online ? 1.0 : 0.0,
        //10 - card_present
        terminal.card_present ? 1.0 : 0.0,
        //11 - unkown_merchant
        customer.known_merchants.includes(merchant.id) ? 0.0 : 1.0,
        //12 - mcc_risk
        (mccRisk as Record<string, number>)[merchant.mcc] ?? 0.5,
        //13 - merchant_avg_amount
        limitar(merchant.avg_amount, n.max_amount),
    ];
}
