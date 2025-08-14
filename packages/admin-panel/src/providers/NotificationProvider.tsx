import {useState, useCallback, type ReactNode, useContext} from 'react';
import {NotificationContext, type Notification, type NotificationType} from '../context/NotificationContext';
import {CheckCircle, XCircle, Info, AlertTriangle} from 'lucide-react';

const notificationIcons = {
    success: <CheckCircle className="h-6 w-6 text-green-500"/>,
    error: <XCircle className="h-6 w-6 text-red-500"/>,
    info: <Info className="h-6 w-6 text-blue-500"/>,
    warning: <AlertTriangle className="h-6 w-6 text-yellow-500"/>,
};

function NotificationItem({notification, onDismiss}: { notification: Notification, onDismiss: (id: number) => void }) {
    useState(() => {
        const timer = setTimeout(() => {
            onDismiss(notification.id);
        }, 5000); // Desaparece después de 5 segundos

        return () => clearTimeout(timer);
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-start space-x-4">
            <div>{notificationIcons[notification.type]}</div>
            <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{notification.message}</p>
            </div>
            <button onClick={() => onDismiss(notification.id)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="h-5 w-5"/>
            </button>
        </div>
    );
}

export function NotificationProvider({children}: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = (id: number) => {
        setNotifications(current => current.filter(n => n.id !== id));
    };

    const addNotification = useCallback((message: string, type: NotificationType) => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
        };
        setNotifications(current => [...current, newNotification]);
    }, []);

    return (
        <NotificationContext.Provider value={{addNotification}}>
            {children}
            {/* Contenedor que renderiza las notificaciones en la esquina superior derecha */}
            <div className="fixed bottom-28 left-5 z-[100] space-y-3 w-full max-w-sm">
                {notifications.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={removeNotification}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

// Este hook es la forma correcta y estandarizada para que los componentes consuman el contexto.
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
    }
    // Adaptamos la llamada para que coincida con la firma esperada en las páginas.
    const showNotification = ({message, type}: { message: string, type: NotificationType }) => {
        context.addNotification(message, type);
    };
    return {showNotification};
};