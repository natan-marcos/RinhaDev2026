import normalization from '../resources/normalization.json';
import mccRisk from '../resources/mcc-risk.json';
import { FraudRequest } from './Models/Request';

function limitar(valor: number, max: number): number {
    return Math.min(Math.max(valor, 0.0), 1.0);
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
        limitar(transaction.amount / n.max_amount, 1.0),
    
        //1 - installments
        limitar(transaction.installments / n.max_installments, 1.0),

        //2 - amount_vs_avg
        limitar((transaction.amount / customer.avg_amount) / n.amount_vs_avg_ratio, 1.0),

        //3 - hour_of_day
        hora(transaction.requested_at),

        //4 - day_of_week
        DiaDaSemana(transaction.requested_at),

        //5 - minutes_since_last_tx

        last_transaction ? limitar(minutosDesdeUltima(last_transaction.timestamp, transaction.requested_at) / n.max_minutes) : -1.0,
        //6 - km_from_last_tx

        //7 - km_from_home

        //8 - tx_count_24h

        //9 - is_online

        //10 - card_present

        //11 - unkown_merchant

        //12 - mcc_risk

        //13 - merchant_avg_amount
    ];
}
