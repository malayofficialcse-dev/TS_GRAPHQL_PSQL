export type UserRole = "ADMIN" | "MANAGER" | "USER";

export interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}