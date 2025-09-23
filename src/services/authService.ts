import type {Customer} from "../context/UserAuthContext.tsx";
import {api} from "./api.ts";

interface VerifyCodeResponse {
    success: boolean;
    token: string;
    user: Customer;
    error?: string;
}

export const authService = {
    /**
     * Solicita al backend que envíe un código de inicio de sesión al email proporcionado.
     */
    async requestLoginCode(email: string): Promise<{ success: boolean; message?: string }> {
        const response = await api.post<{ success: boolean; message?: string }>('/api/auth/request-code', {email});
        return response.data;

    },

    /**
     * Envía el email y el código al backend para su verificación.
     * Si es exitoso, devuelve el token JWT y los datos del usuario.
     */
    async verifyLoginCode(email: string, code: string): Promise<VerifyCodeResponse> {
        const response = await api.post<VerifyCodeResponse>('/api/auth/verify-code', {email, code});
        return response.data;
    },
};