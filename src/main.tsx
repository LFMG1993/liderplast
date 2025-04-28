import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../src/Style/App.css'
import '../src/Style/WhatsAppButton.css'
import {CartProvider} from "./hooks/CardContext.tsx";
import "./hooks/i18n.ts";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
    <React.StrictMode>
        <CartProvider>
            <App/>
        </CartProvider>
    </React.StrictMode>,
)
