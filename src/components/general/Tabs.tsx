import * as React from 'react';
import {useState} from 'react';

interface Tab {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({tabs}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            {/* 1. Envolvemos la navegación en un div que permitirá el scroll horizontal. */}
            <div className="overflow-x-auto border-b border-gray-200">
                {/* 2. Usamos `inline-flex` para que la barra de navegación no ocupe más de lo necesario y pueda desplazarse. */}
                <nav className="-mb-px inline-flex space-x-8" aria-label="Tabs">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.label}
                            onClick={() => setActiveTab(index)}
                            className={`${
                                index === activeTab
                                    ? 'border-liderplast-primary text-liderplast-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {tabs[activeTab].content}
            </div>
        </div>
    );
};