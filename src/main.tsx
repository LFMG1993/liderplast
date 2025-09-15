import React from "react";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './hooks/i18n.ts';
import {HelmetProvider} from 'react-helmet-async';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <React.Suspense fallback={<div>Cargando...</div>}>
            <HelmetProvider>
                <App/>
            </HelmetProvider>
        </React.Suspense>
    </StrictMode>,
)
