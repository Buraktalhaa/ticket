export interface ApiResponse<T = any> {
    status: string;
    message?: string;
    data?: T;
    error?: {
        code?: number;
        message?: string;
    };
}