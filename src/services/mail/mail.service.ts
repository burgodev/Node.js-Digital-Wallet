import SES from 'aws-sdk/clients/ses';
import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { l } from '../../helpers/general';

type Email = string | {
    email: string, 
    name: string,
};

type Tamplate = { 
    path: string, 
    args: {[k: string]: string | {translate: string, args?: {[k: string]: string}}}
};

type EmailHtml = string | Tamplate;

export type EmailParams = {
    source?: Email,
    destination: Email | Email[],
    subject: string,
    text?: string,
    html?: EmailHtml,
};

class EmailService {

    private client: SES;

    constructor() {
        this.client = new SES({
            region: process.env.AWS_REGION || 'us-east-1'
        });
    }

    private formatEmailWithName(email: string, name: string): string {
        return `${name} <${email}>`;
    }

    private formatEmail(email: Email): string {
        return typeof email == 'object' ? this.formatEmailWithName(email.email, email.name) : email;
    }

    private parseTamplate(tamplate: Tamplate): string {
        const html = fs.readFileSync(path.resolve(__dirname, `./templates/${tamplate.path}`), 'utf8');
        const reg = /\{\{(\s*)(\w+)(\s*)\}\}/g;

        return html.replace(reg, (match: string, contents: any, offset: any) => {
            const value = tamplate.args[offset];
            if (value) {
                if (typeof value == 'string') {
                    return value as string;
                } else if (typeof value == 'object') {
                    return i18next.t(value.translate, value.args || {});
                }
            }
            return '';
        });
    }

    public async send(params: EmailParams): Promise<boolean> {
        const source = this.formatEmail(params.source || process.env.ROOT_EMAIL as string);
        const destination = (Array.isArray(params.destination) ? params.destination : [params.destination])
                            .map(d => this.formatEmail(d));
        const html = (typeof params.html == 'object') ? this.parseTamplate(params.html) : params.html;

        const response = await this.client.sendEmail({
            Source: source,
            Destination: {
                ToAddresses: destination
            },
            Message: {
                Subject: {
                    Data: params.subject
                },
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: html as string
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: params.text as string
                    }
                }
            }
        }, (err, data) => {
            if (err) l.error(err.message, err);
            else l.info('Email sended');
        }).promise();

        return !response.$response.error;
    }

}

export default EmailService;