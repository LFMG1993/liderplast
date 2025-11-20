export interface User {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'employee' | '';
    created_at: string;
}

export type UserCreationData = Omit<User, 'id' | 'created_at'> & { password?: string };
export type UserUpdateData = Omit<User, 'id' | 'created_at' | 'password'>;