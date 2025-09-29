import type {FC} from 'react';

interface StatusBadgeProps {
    label: string;
    colorClasses: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({label, colorClasses}) => {
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {label}
                    </span>
    );
};