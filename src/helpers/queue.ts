import Queue from "bull";
import redisConfig from "../config/redis";
import * as jobs from "../jobs";
import { l } from "./general";

interface QueueItem {
    bull: Queue.Queue;
    name: string;
    handle({ data }): Promise<void>;
    options?: jobs.IJobOptions;
}

const queues: QueueItem[] = Object.values(jobs).map(
    (job: jobs.IJob): QueueItem => ({
        bull: new Queue(job.key, { redis: redisConfig }),
        name: job.key,
        handle: job.handle,
        options: job.options,
    })
);

export default {
    queues,
    add(name, data) {
        const queue = this.queues.find((queue) => queue.name === name);
        return queue.bull.add(data, queue.options);
    },
    process() {
        return this.queues.forEach((queue) => {
            queue.bull.process(queue.handle);
            queue.bull.on("failed", (job, err) => {
                l.error("Job execution fail", { err, job });
            });
        });
    },
};
