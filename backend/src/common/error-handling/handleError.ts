import { Response } from "express";
import { ResponseStatus } from "../enums/status.enum";

export function handleError(res: Response, message: string, statusCode: number) {
    return res.status(statusCode).json({
        status: ResponseStatus.FAIL,
        message: message,
    });
}