import { Request, Response } from "express";
import { Email } from "../../common/utils/email";
import { handleError } from "../../common/error-handling/handleError";

export async function sendEmailController(req: Request, res: Response) {
    try {
        const { email, firstName } = req.body;

        const mail = new Email({ email, firstName }, "http://localhost:3000/profile/resetPassword/token");
        await mail.sendWelcome();
        await mail.send('deneme1223s','deneme');
        await mail.sendWelcome()

        res.status(200).json({
            message: "Welcome email sent successfully"
        });
        return;
    }
    catch (error) {
        handleError(res, "Failed to send email", 500)
        console.error(error);
        return;
    }
}