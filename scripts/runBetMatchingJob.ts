import { startBetMatchingJob } from "@/app/lib/backgroundJobs/betMatchingJob";

startBetMatchingJob();

console.log('Bet matching cron job started.');