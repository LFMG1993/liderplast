import * as React from 'react';
import type {DashboardSummary} from "../../types";
import {useQuery} from '@tanstack/react-query';
import {Users, TrendingUp, MousePointerClick, Hourglass} from 'lucide-react';
import {Spinner} from '../../components/general/Spinner';
import {analyticsService} from "../../services/analyticsService.ts";

const StatCard = ({title, value, icon: Icon, isLoading}: {
    title: string,
    value: string | number,
    icon: React.ElementType,
    isLoading: boolean
}) => (
    <div
        className="bg-[var(--color-card)] p-6 rounded-lg shadow-md border border-[var(--color-border)] flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary"/>
        </div>
        <div>
            <p className="text-sm text-[var(--color-foreground)]/60">{title}</p>
            {isLoading ? (
                <div className="h-7 w-16 bg-[var(--color-muted)] rounded animate-pulse mt-1"></div>
            ) : (
                <p className="text-2xl font-bold">{value}</p>
            )}
        </div>
    </div>
);

const DashboardPage = () => {
    const {data, isLoading} = useQuery<DashboardSummary>({
        queryKey: ['dashboardSummary'],
        queryFn: analyticsService.getDashboardSummary,
        staleTime: 1000 * 60 * 5, // Cachear los datos por 5 minutos
    });

    return (
        <div className="p-8 bg-[var(--color-background)] text-[var(--color-foreground)]">
            <h1 className="text-3xl font-bold">Bienvenido al Dashboard</h1>
            <p className="mt-2 text-[var(--color-foreground)]/80">Un resumen del rendimiento de tu tienda </p>

            {isLoading ? (
                <div className="mt-8 flex justify-center items-center min-h-[12rem]">
                    <Spinner/>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Usuarios en tiempo real" value={data?.activeUsers ?? 0} icon={Users}
                              isLoading={isLoading}/>
                    <StatCard title="Nuevos usuarios (Últ. 7 días)" value={data?.newUsers ?? 0} icon={TrendingUp}
                              isLoading={isLoading}/>
                    <StatCard title="Tasa de conversión" value={`${data?.conversionRate ?? 0}%`}
                              icon={MousePointerClick} isLoading={isLoading}/>
                    <StatCard title="Duración media de sesión" value={data?.avgSessionDuration ?? '0m 0s'}
                              icon={Hourglass} isLoading={isLoading}/>
                </div>
            )}

        </div>
    );
}

export default DashboardPage;