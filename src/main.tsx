import React from "react";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './hooks/i18n.ts';
import {HelmetProvider} from 'react-helmet-async';
import {Spinner} from "./components/general/Spinner.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <React.Suspense
            fallback={<div className="flex justify-center items-center py-16">
            <Spinner/>
        </div>}>
            <HelmetProvider>
                <App/>
            </HelmetProvider>
        </React.Suspense>
    </StrictMode>,
)
