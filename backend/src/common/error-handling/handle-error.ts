import { Response } from "express";
import { ResponseStatus } from "../enums/status.enum";

export function handleError(res: Response, message: string, statusCode: number) {
    res.status(statusCode).json({
        status: ResponseStatus.FAIL,
        message: message,
    });
}