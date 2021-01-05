import got from 'got'
import * as FormData  from "form-data";
import { Inject, Injectable } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { MailModuleOptions } from "./mail.interfaces";

@Injectable()
export class MailService{
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {
        this.sendMail('testing', 'test')
    }

    private async sendMail(subject: string, content: string) {
        const form = new FormData();
        form.append('from', `Excited User <mailgun@${this.options.domain}>`),
        form.append('to', `zzoon.dev@gmail.com`)
        form.append('subject', subject)
        form.append('text', content)
        const response = await got(
            `https://api.mailgun.net/v3/${this.options.domain}/messages`,
            {
                method: 'POST',
                headers: {
                    Authrization: `Basic ${Buffer.from(`api:${this.options.apiKey}`,).toString('base64')}`,
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
        console.log(response.body)
        console.log("=======TEST===========")
    }
}