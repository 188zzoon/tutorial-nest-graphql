import { EPROTO } from "constants";
import { StringRegexOptions } from "joi";

export interface MailModuleOptions {
    apiKey: string;
    domain: string;
    fromEmail: string;
}

export interface EmailVar {
    key: string,
    value: string
}