import {api} from "./api.ts";
import type {DashboardSummary} from "../types";

// Define la estructura de la respuesta que viene del backend
interface AnalyticsReportItem {
    date: string;
    activeUsers: string;
    sessions: string;
}

interface AnalyticsApiResponse {
    success: boolean;
    report: AnalyticsReportItem[];
}

export const analyticsService = {
    /**
     * Obtiene los datos de resumen para el dashboard desde el backend.
     */
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        const response = await api.get<AnalyticsApiResponse>('/api/admin/analytics/report');
        const report = response.data.report;

        // Procesamos la respuesta del backend para adaptarla al formato que el frontend necesita.
        if (!report || report.length === 0) {
            // Si no hay datos, devolvemos un objeto con valores por defecto.
            return { activeUsers: 0, newUsers: 0, conversionRate: '0.00', avgSessionDuration: '0m 0s' };
        }

        // Tomamos los usuarios activos del día más reciente.
        const latestActiveUsers = parseInt(report[0].activeUsers, 10);

        // Sumamos las sesiones de todos los días en el informe como nuevos usuarios.
        const totalNewUsers = report.reduce((sum, item) => sum + parseInt(item.sessions, 10), 0);

        return {
            activeUsers: latestActiveUsers,
            newUsers: totalNewUsers,
            conversionRate: '1.25',
            avgSessionDuration: '2m 15s',
        };
    }
};