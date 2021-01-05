import got from 'got'
import * as FormData  from "form-data";
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { EmailVar, MailModuleOptions } from "./mail.interfaces";

@Injectable()
export class MailService{
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {}

    private async sendMail(
        subject: string,
        template: string,
        emailVar: EmailVar[]
        ) {
        const form = new FormData();
        form.append('from', `Excited User <mailgun@${this.options.domain}>`),
        form.append('to', `zzoon.dev@gmail.com`)
        form.append('subject', subject)
        form.append('template', template);
        emailVar.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));
        

        try {
            await got(
                    `https://api.mailgun.net/v3/${this.options.domain}/messages`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Basic ${Buffer.from(`api:${this.options.apiKey}`,).toString('base64')}`,
                        },
                        // body: JSON.stringify({
                        //     from: this.options.fromEmail,
                        //     to: 'zoon.dev@gamil.com',
                        //     subject: subject,
                        //     text: content
                        // })
                        body: form
                    }
                );
            } catch (error) {
                console.log(error)
            }
    }

    sendVerificationEmail(email: string, code: string) {
        this.sendMail('Verify Your Email', 'verity-email', [
            {key: 'code', value: code},
            {key: 'username', value: email}
        ]);
    }
}