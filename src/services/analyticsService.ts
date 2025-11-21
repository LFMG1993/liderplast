import {api} from "./api.ts";
import type {DashboardSummary} from "../types";

export const analyticsService = {
    /**
     * Obtiene los datos de resumen para el dashboard desde el backend.
     */
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        const response = await api.get<DashboardSummary>('/api/admin/analytics/report');
        return response.data;
    }
};