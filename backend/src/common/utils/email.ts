import nodemailer, { Transporter } from 'nodemailer';

export class Email {
    to: string;
    firstName: string;
    url: string;
    from: string;
    transporter: Transporter;

    constructor(auth: { email: string; firstName: string }, url: string) {
        this.to = auth.email;
        this.firstName = auth.firstName;
        this.url = url;
        this.from = `Burak Talha Memiş <${process.env.EMAIL_FROM!}>`;
        this.transporter = this.newTransport();
    }

    private newTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false, // false for TLS, true for SSL
            auth: {
                user: process.env.EMAIL_HOST_AUTH,
                pass: process.env.EMAIL_HOST_PASSWORD,
            },
        });
        
    }

    // Send the actual email
    async send(template: string, subject: string) {


        // 2) Define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text: `Here is your link: ${this.url}`, // You can replace this with HTML content if needed
            // html, // Uncomment this if using HTML content
        };

        // 3) Send email using the transporter
        await this.transporter.sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Burak WorkPlace!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)'
        );
    }

    async sendSellers(sellers: { email: string; password: string }[]) {
        const sellerInfoList = sellers
            .map(
                (seller, index) => 
                `Seller ${index + 1}:\nEmail: ${seller.email}\nPassword: ${seller.password}\n`
            )
            .join('\n');
    
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: 'Your Seller Accounts',
            text: `Dear ${this.firstName},\n\nHere are your seller accounts:\n\n${sellerInfoList}\nPlease keep these credentials safe.`,
        };
    
        await this.transporter.sendMail(mailOptions);
    }

    async sendPnr(pnr: string) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: 'Your Ticket PNR Information',
            text: `Dear ${this.firstName},\n\nYour ticket has been successfully created.\nHere is your PNR number: ${pnr}\n\nKeep this code for your records.`,
        };
        console.log("email send")
        await this.transporter.sendMail(mailOptions);
    }
    
}