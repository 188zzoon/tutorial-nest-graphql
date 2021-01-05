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
        const response = await fetch(
            `https://api.mailgun.net/v3/${this.options.domain}/messages`,
            {
                method: 'POST',
                headers: {
                    Authentication: `Basic ${Buffer.from(
                        `api:${this.options.apiKey}`,
                    ).toString('base64')}`,
                },
                body: JSON.stringify({
                    from: this.options.fromEmail,
                    to: 'zoon.dev@gamil.com',
                    subject: subject,
                    text: content
                })
            }
        );
        const json = await response.json()
        console.log(json)
        console.log("=======TEST===========")
    }
}