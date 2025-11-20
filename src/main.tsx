import React from "react";
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './hooks/i18n.ts';
import {HelmetProvider} from 'react-helmet-async';
import {Spinner} from "./components/general/Spinner.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useAuthStore} from "./store/authStore.ts";

const queryClient = new QueryClient();
useAuthStore.getState().verifyAuth();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <React.Suspense
                fallback={<div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>}>
                <HelmetProvider>
                    <App/>
                </HelmetProvider>
            </React.Suspense>
        </QueryClientProvider>
    </StrictMode>,
)
