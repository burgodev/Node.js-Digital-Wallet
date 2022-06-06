export { default as VerifyUserDocumentsJob } from "./verify-user-documents-job";
export { default as CreateWalletJob } from "./create-wallet-job";

export interface IJobOptions {
    delay?: number;
    priority?: number;
    limiter?: {
        // Limit queue to max x jobs per y seconds.
        max: number;
        duration: number;
    };
    repeat?: {
        // Repeat every x seconds for y times.
        every: number;
        limit: number;
    };
}

export interface IJob {
    key: string;
    handle({ data }): Promise<void>;
    options?: IJobOptions;
}
