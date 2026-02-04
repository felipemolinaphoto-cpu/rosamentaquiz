import { QuizResult } from '../types';

// URL do Webhook do N8N (ou outro serviço de automação)
// SUBSTITUA PELA SUA URL REAL DO N8N
const WEBHOOK_URL = 'http://76.13.173.47:5678/webhook/427afeeb-faa3-48f9-91ba-96a932259cb3';

interface QuizReportData {
    userName: string;
    result: QuizResult;
    answers: string[];
    date: string;
}

export const sendQuizResultEmail = async (data: QuizReportData): Promise<boolean> => {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('SEU_WEBHOOK_N8N')) {
        console.warn('Webhook URL not configured yet. Skipping email send.');
        // Retornamos true para não bloquear o fluxo do usuário, mas logamos o aviso
        return true;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                notificationType: 'quiz_completed', // Identificador para o N8N saber o que fazer
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            console.error('Webhook error:', response.status, response.statusText);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Failed to send quiz result to webhook:', error);
        return false;
    }
};
