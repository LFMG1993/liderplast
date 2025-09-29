import { PromoBanner } from '../publicity/PromoBanner';
import { Header } from './Header';

/**
 * Este componente actúa como un contenedor único y "pegajoso"
 * para el banner promocional y el header principal.
 * Esto soluciona los problemas de apilamiento (z-index) entre
 * múltiples elementos 'sticky'.
 */
export const TopBar = () => {
    return (
        <div className="sticky top-0 z-50">
            <PromoBanner text="♻️ BUSCA NUESTRA SECCIÓN DE BIODEGRADABLES, ESTAMOS COMPROMETIDOS CON EL AMBIENTE. ♻️" />
            <Header />
        </div>
    );
};