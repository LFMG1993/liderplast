import { NavLink, type NavLinkProps } from 'react-router-dom';

/**
 * Un componente wrapper sobre NavLink de React Router.
 * Nos permite centralizar los estilos de los enlaces y aplicar
 * una clase 'active' automáticamente al enlace de la página actual.
 */
 const SmartLink = ({ children, className, ...props }: NavLinkProps) => {
    const linkClasses = ({ isActive }: { isActive: boolean }) =>
        `${className} ${isActive ? 'text-liderplast-primary font-semibold' : ''}`;

    return (
        <NavLink className={linkClasses} {...props}>
            {children}
        </NavLink>
    );
};

 export default SmartLink;