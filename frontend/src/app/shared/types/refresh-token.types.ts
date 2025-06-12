export interface RefreshResponse {
    status: string;        
    message: string;      
    accessToken: string;   
    data: {
        userId: string;
    };
}
