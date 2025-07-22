import {Link, LinkProps} from "react-router-dom";
import {ReactNode} from "react";

// Extendemos las props de Link y añadimos 'children' y 'className'
type SmartLinkProps = LinkProps & {
    children: ReactNode;
    className?: string;
};

/**
 * Un componente de enlace inteligente que renderiza un <Link> de React Router
 * para rutas internas y una etiqueta <a> estándar para rutas externas
 * (aquellas que comienzan con "http" o son la ruta raíz "/").
 */
export default function SmartLink({to, children, className, ...props}: SmartLinkProps) {
    const href = typeof to === 'string' ? to : to.pathname || '';

    // Es un enlace externo si es la ruta raíz absoluta o si empieza con http
    const isExternal = href === '/' || href.startsWith('http');

    if (isExternal) {
        return (
            <a href={href} className={className} {...props}>
                {children}
            </a>
        );
    }

    return (
        <Link to={to} className={className} {...props}>
            {children}
        </Link>
    );
}